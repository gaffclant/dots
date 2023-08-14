// SPDX-License-Identifier: MPL-2.0
// Copyright (c) Yuxuan Shui <yshuiv7@gmail.com>
#include <assert.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

#include <xcb/composite.h>
#include <xcb/present.h>
#include <xcb/render.h>
#include <xcb/sync.h>
#include <xcb/xcb.h>

#include "backend/backend.h"
#include "backend/backend_common.h"
#include "common.h"
#include "config.h"
#include "kernel.h"
#include "log.h"
#include "picom.h"
#include "region.h"
#include "types.h"
#include "utils.h"
#include "win.h"
#include "x.h"

typedef struct _xrender_data {
	backend_t base;
	/// If vsync is enabled and supported by the current system
	bool vsync;
	xcb_visualid_t default_visual;
	/// Target window
	xcb_window_t target_win;
	/// Painting target, it is either the root or the overlay
	xcb_render_picture_t target;
	/// Back buffers. Double buffer, with 1 for temporary render use
	xcb_render_picture_t back[3];
	/// The back buffer that is for temporary use
	/// Age of each back buffer.
	int buffer_age[3];
	/// The back buffer we should be painting into
	int curr_back;
	/// The corresponding pixmap to the back buffer
	xcb_pixmap_t back_pixmap[3];
	/// Pictures of pixel of different alpha value, used as a mask to
	/// paint transparent images
	xcb_render_picture_t alpha_pict[256];

	// XXX don't know if these are really needed

	/// 1x1 white picture
	xcb_render_picture_t white_pixel;
	/// 1x1 black picture
	xcb_render_picture_t black_pixel;

	/// Width and height of the target pixmap
	int target_width, target_height;

	xcb_special_event_t *present_event;
} xrender_data;

struct _xrender_blur_context {
	enum blur_method method;
	/// Blur kernels converted to X format
	struct x_convolution_kernel **x_blur_kernel;

	int resize_width, resize_height;

	/// Number of blur kernels
	int x_blur_kernel_count;
};

struct _xrender_image_data_inner {
	// struct backend_image_inner_base
	int refcount;
	bool has_alpha;

	// Pixmap that the client window draws to,
	// it will contain the content of client window.
	xcb_pixmap_t pixmap;
	// A Picture links to the Pixmap
	xcb_render_picture_t pict;
	int width, height;
	xcb_visualid_t visual;
	uint8_t depth;
	// Whether we own this image, e.g. we allocated it;
	// or not, e.g. this is a named pixmap of a X window.
	bool owned;
};

struct xrender_rounded_rectangle_cache {
	int refcount;
	// A cached picture of a rounded rectangle. Xorg rasterizes shapes on CPU so it's
	// exceedingly slow.
	xcb_render_picture_t p;
};

struct xrender_image {
	struct backend_image base;

	struct xrender_rounded_rectangle_cache *rounded_rectangle;
};

/// Make a picture of size width x height, which has a rounded rectangle of corner_radius
/// rendered in it.
struct xrender_rounded_rectangle_cache *
make_rounded_corner_cache(xcb_connection_t *c, xcb_render_picture_t src,
                          xcb_drawable_t root, int width, int height, int corner_radius) {
	auto picture = x_create_picture_with_standard(c, root, width, height,
	                                              XCB_PICT_STANDARD_ARGB_32, 0, NULL);
	if (picture == XCB_NONE) {
		return NULL;
	}

	int inner_height = height - 2 * corner_radius;
	int cap_height = corner_radius;
	if (inner_height < 0) {
		cap_height = height / 2;
		inner_height = 0;
	}
	auto points = ccalloc(cap_height * 4 + 4, xcb_render_pointfix_t);
	int point_count = 0;

#define ADD_POINT(px, py)                                                                \
	assert(point_count < cap_height * 4 + 4);                                        \
	points[point_count].x = DOUBLE_TO_XFIXED(px);                                    \
	points[point_count].y = DOUBLE_TO_XFIXED(py);                                    \
	point_count += 1;

	// The top cap
	for (int i = 0; i <= cap_height; i++) {
		double y = corner_radius - i;
		double delta = sqrt(corner_radius * corner_radius - y * y);
		double left = corner_radius - delta;
		double right = width - corner_radius + delta;
		if (left >= right) {
			continue;
		}
		ADD_POINT(left, i);
		ADD_POINT(right, i);
	}

	// The middle rectangle
	if (inner_height > 0) {
		ADD_POINT(0, cap_height + inner_height);
		ADD_POINT(width, cap_height + inner_height);
	}

	// The bottom cap
	for (int i = cap_height + inner_height + 1; i <= height; i++) {
		double y = corner_radius - (height - i);
		double delta = sqrt(corner_radius * corner_radius - y * y);
		double left = corner_radius - delta;
		double right = width - corner_radius + delta;
		if (left >= right) {
			break;
		}
		ADD_POINT(left, i);
		ADD_POINT(right, i);
	}
#undef ADD_POINT

	XCB_AWAIT_VOID(xcb_render_tri_strip, c, XCB_RENDER_PICT_OP_SRC, src, picture,
	               x_get_pictfmt_for_standard(c, XCB_PICT_STANDARD_A_8), 0, 0,
	               (uint32_t)point_count, points);
	free(points);
	auto ret = ccalloc(1, struct xrender_rounded_rectangle_cache);
	ret->p = picture;
	ret->refcount = 1;
	return ret;
}

static void compose_impl(struct _xrender_data *xd, struct xrender_image *xrimg,
                         int dst_x1, int dst_y1, int dst_x2, int dst_y2,
			 const region_t *reg_paint, const region_t *reg_visible,
			 xcb_render_picture_t result) {
	const struct backend_image *img = &xrimg->base;
	auto alpha_pict = xd->alpha_pict[(int)(img->opacity * MAX_ALPHA)];
	auto inner = (struct _xrender_image_data_inner *)img->inner;
	region_t reg;

	bool has_alpha = inner->has_alpha || img->opacity != 1;
	const auto tmpw = to_u16_checked(dst_x2 - dst_x1);
	const auto tmph = to_u16_checked(dst_y2 - dst_y1);
	const auto tmpew = to_u16_checked(dst_x2 - dst_x1);
	const auto tmpeh = to_u16_checked(dst_y2 - dst_y1);
	const xcb_render_color_t dim_color = {
	    .red = 0, .green = 0, .blue = 0, .alpha = (uint16_t)(0xffff * img->dim)};

	// Clip region of rendered_pict might be set during rendering, clear it to
	// make sure we get everything into the buffer
	x_clear_picture_clip_region(xd->base.c, inner->pict);

	pixman_region32_init(&reg);
	pixman_region32_intersect(&reg, (region_t *)reg_paint, (region_t *)reg_visible);
	x_set_picture_clip_region(xd->base.c, result, 0, 0, &reg);
#define DOUBLE_TO_XFIXED(value) ((xcb_render_fixed_t)(((double)(value)) * 65536))
		{
			const xcb_render_transform_t transform = {
				DOUBLE_TO_XFIXED((double)img->ewidth / (double)tmpew), DOUBLE_TO_XFIXED(0.0), DOUBLE_TO_XFIXED(0.0),
				DOUBLE_TO_XFIXED(0.0), DOUBLE_TO_XFIXED((double)img->eheight / (double)tmpeh), DOUBLE_TO_XFIXED(0.0),
				DOUBLE_TO_XFIXED(0.0), DOUBLE_TO_XFIXED(0.0), DOUBLE_TO_XFIXED(1.0),
			};
			xcb_render_set_picture_transform(xd->base.c, inner->pict, transform);
			xcb_render_set_picture_filter(xd->base.c, inner->pict, 7, "nearest", 0, NULL);
		}
#undef DOUBLE_TO_XFIXED

	if (img->corner_radius != 0 && xrimg->rounded_rectangle == NULL) {
		xrimg->rounded_rectangle = make_rounded_corner_cache(
		    xd->base.c, xd->white_pixel, xd->base.root, inner->width,
		    inner->height, (int)img->corner_radius);
	}
	if (((img->color_inverted || img->dim != 0) && has_alpha) || img->corner_radius != 0) {
		// Apply image properties using a temporary image, because the source
		// image is transparent. Otherwise the properties can be applied directly
		// on the target image.
		auto tmp_pict =
		    x_create_picture_with_visual(xd->base.c, xd->base.root, inner->width,
		                                 inner->height, inner->visual, 0, NULL);

		// Set clip region translated to source coordinate
		x_set_picture_clip_region(xd->base.c, tmp_pict, to_i16_checked(-dst_x1),
		                          to_i16_checked(-dst_y1), &reg);
		// Copy source -> tmp
		xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_OVER, inner->pict,
		                     XCB_NONE, tmp_pict, 0, 0, 0, 0, 0, 0, tmpw, tmph);
		if (img->color_inverted) {
			if (inner->has_alpha) {
				auto tmp_pict2 = x_create_picture_with_visual(
				    xd->base.c, xd->base.root, tmpw, tmph, inner->visual,
				    0, NULL);
				xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_OVER,
				                     tmp_pict, XCB_NONE, tmp_pict2, 0, 0,
				                     0, 0, 0, 0, tmpw, tmph);

				xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_DIFFERENCE,
				                     xd->white_pixel, XCB_NONE, tmp_pict,
				                     0, 0, 0, 0, 0, 0, tmpw, tmph);
				xcb_render_composite(
				    xd->base.c, XCB_RENDER_PICT_OP_IN_REVERSE, tmp_pict2,
				    XCB_NONE, tmp_pict, 0, 0, 0, 0, 0, 0, tmpw, tmph);
				xcb_render_free_picture(xd->base.c, tmp_pict2);
			} else {
				xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_DIFFERENCE,
				                     xd->white_pixel, XCB_NONE, tmp_pict,
				                     0, 0, 0, 0, 0, 0, tmpw, tmph);
			}
		}
		if (img->dim != 0) {
			// Dim the actually content of window
			xcb_rectangle_t rect = {
			    .x = 0,
			    .y = 0,
			    .width = tmpw,
			    .height = tmph,
			};

			xcb_render_fill_rectangles(xd->base.c, XCB_RENDER_PICT_OP_OVER,
			                           tmp_pict, dim_color, 1, &rect);
		}

		if (img->corner_radius != 0 && xrimg->rounded_rectangle != NULL) {
			// Clip tmp_pict with a rounded rectangle
			xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_IN_REVERSE,
			                     xrimg->rounded_rectangle->p, XCB_NONE,
			                     tmp_pict, 0, 0, 0, 0, 0, 0, tmpw, tmph);
		}

		xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_OVER, tmp_pict,
		                     alpha_pict, result, 0, 0, 0, 0, to_i16_checked(dst_x1),
		                     to_i16_checked(dst_y1), tmpew, tmpeh);
		xcb_render_free_picture(xd->base.c, tmp_pict);
	} else {
		uint8_t op = (has_alpha ? XCB_RENDER_PICT_OP_OVER : XCB_RENDER_PICT_OP_SRC);

		xcb_render_composite(xd->base.c, op, inner->pict, alpha_pict, result, 0,
		                     0, 0, 0, to_i16_checked(dst_x1),
		                     to_i16_checked(dst_y1), tmpew, tmpeh);
		if (img->dim != 0 || img->color_inverted) {
			// Apply properties, if we reach here, then has_alpha == false
			assert(!has_alpha);
			if (img->color_inverted) {
				xcb_render_composite(xd->base.c, XCB_RENDER_PICT_OP_DIFFERENCE,
				                     xd->white_pixel, XCB_NONE, result, 0,
				                     0, 0, 0, to_i16_checked(dst_x1),
				                     to_i16_checked(dst_y1), tmpew, tmpeh);
			}

			if (img->dim != 0) {
				// Dim the actually content of window
				xcb_rectangle_t rect = {
				    .x = to_i16_checked(dst_x1),
				    .y = to_i16_checked(dst_y1),
				    .width = tmpew,
				    .height = tmpeh,
				};

				xcb_render_fill_rectangles(xd->base.c, XCB_RENDER_PICT_OP_OVER,
				                           result, dim_color, 1, &rect);
			}
		}
	}
	pixman_region32_fini(&reg);
}

static void compose(backend_t *base, void *img_data,
		    int dst_x1, int dst_y1, int dst_x2, int dst_y2,
                    const region_t *reg_paint, const region_t *reg_visible) {
	// TODO(dccsillag): use dst_{x,y}2
	struct _xrender_data *xd = (void *)base;
	return compose_impl(xd, img_data, dst_x1, dst_y1, dst_x2, dst_y2, reg_paint, reg_visible, xd->back[2]);
}

static void fill(backend_t *base, struct color c, const region_t *clip) {
	struct _xrender_data *xd = (void *)base;
	const rect_t *extent = pixman_region32_extents((region_t *)clip);
	x_set_picture_clip_region(base->c, xd->back[2], 0, 0, clip);
	// color is in X fixed point representation
	xcb_render_fill_rectangles(
	    base->c, XCB_RENDER_PICT_OP_OVER, xd->back[2],
	    (xcb_render_color_t){.red = (uint16_t)(c.red * 0xffff),
	                         .green = (uint16_t)(c.green * 0xffff),
	                         .blue = (uint16_t)(c.blue * 0xffff),
	                         .alpha = (uint16_t)(c.alpha * 0xffff)},
	    1,
	    (xcb_rectangle_t[]){{.x = to_i16_checked(extent->x1),
	                         .y = to_i16_checked(extent->y1),
	                         .width = to_u16_checked(extent->x2 - extent->x1),
	                         .height = to_u16_checked(extent->y2 - extent->y1)}});
}

static bool blur(backend_t *backend_data, double opacity, void *ctx_,
                 const region_t *reg_blur, const region_t *reg_visible) {
	struct _xrender_blur_context *bctx = ctx_;
	if (bctx->method == BLUR_METHOD_NONE) {
		return true;
	}

	struct _xrender_data *xd = (void *)backend_data;
	xcb_connection_t *c = xd->base.c;
	region_t reg_op;
	pixman_region32_init(&reg_op);
	pixman_region32_intersect(&reg_op, (region_t *)reg_blur, (region_t *)reg_visible);
	if (!pixman_region32_not_empty(&reg_op)) {
		pixman_region32_fini(&reg_op);
		return true;
	}

	region_t reg_op_resized =
	    resize_region(&reg_op, bctx->resize_width, bctx->resize_height);

	const pixman_box32_t *extent_resized = pixman_region32_extents(&reg_op_resized);
	const auto height_resized = to_u16_checked(extent_resized->y2 - extent_resized->y1);
	const auto width_resized = to_u16_checked(extent_resized->x2 - extent_resized->x1);
	static const char *filter0 = "Nearest";        // The "null" filter
	static const char *filter = "convolution";

	// Create a buffer for storing blurred picture, make it just big enough
	// for the blur region
	const uint32_t pic_attrs_mask = XCB_RENDER_CP_REPEAT;
	const xcb_render_create_picture_value_list_t pic_attrs = {.repeat = XCB_RENDER_REPEAT_PAD};
	xcb_render_picture_t tmp_picture[2] = {
	    x_create_picture_with_visual(xd->base.c, xd->base.root, width_resized, height_resized,
	                                 xd->default_visual, pic_attrs_mask, &pic_attrs),
	    x_create_picture_with_visual(xd->base.c, xd->base.root, width_resized, height_resized,
	                                 xd->default_visual, pic_attrs_mask, &pic_attrs)};

	if (!tmp_picture[0] || !tmp_picture[1]) {
		log_error("Failed to build intermediate Picture.");
		pixman_region32_fini(&reg_op);
		pixman_region32_fini(&reg_op_resized);
		return false;
	}

	region_t clip;
	pixman_region32_init(&clip);
	pixman_region32_copy(&clip, &reg_op_resized);
	pixman_region32_translate(&clip, -extent_resized->x1, -extent_resized->y1);
	x_set_picture_clip_region(c, tmp_picture[0], 0, 0, &clip);
	x_set_picture_clip_region(c, tmp_picture[1], 0, 0, &clip);
	pixman_region32_fini(&clip);

	xcb_render_picture_t src_pict = xd->back[2], dst_pict = tmp_picture[0];
	auto alpha_pict = xd->alpha_pict[(int)(opacity * MAX_ALPHA)];
	int current = 0;
	x_set_picture_clip_region(c, src_pict, 0, 0, &reg_op_resized);

	// For more than 1 pass, we do:
	//   back -(pass 1)-> tmp0 -(pass 2)-> tmp1 ...
	//   -(pass n-1)-> tmp0 or tmp1 -(pass n)-> back
	// For 1 pass, we do
	//   back -(pass 1)-> tmp0 -(copy)-> target_buffer
	int i;
	for (i = 0; i < bctx->x_blur_kernel_count; i++) {
		// Copy from source picture to destination. The filter must
		// be applied on source picture, to get the nearby pixels outside the
		// window.
		xcb_render_set_picture_filter(c, src_pict, to_u16_checked(strlen(filter)),
		                              filter,
		                              to_u32_checked(bctx->x_blur_kernel[i]->size),
		                              bctx->x_blur_kernel[i]->kernel);

		if (i == 0) {
			// First pass, back buffer -> tmp picture
			// (we do this even if this is also the last pass, because we
			// cannot do back buffer -> back buffer)
			xcb_render_composite(c, XCB_RENDER_PICT_OP_SRC, src_pict, XCB_NONE,
			                     dst_pict, to_i16_checked(extent_resized->x1),
			                     to_i16_checked(extent_resized->y1), 0, 0, 0,
			                     0, width_resized, height_resized);
		} else if (i < bctx->x_blur_kernel_count - 1) {
			// This is not the last pass or the first pass,
			// tmp picture 1 -> tmp picture 2
			xcb_render_composite(c, XCB_RENDER_PICT_OP_SRC, src_pict,
			                     XCB_NONE, dst_pict, 0, 0, 0, 0, 0, 0,
			                     width_resized, height_resized);
		} else {
			x_set_picture_clip_region(c, xd->back[2], 0, 0, &reg_op);
			// This is the last pass, and we are doing more than 1 pass
			xcb_render_composite(c, XCB_RENDER_PICT_OP_OVER, src_pict,
			                     alpha_pict, xd->back[2], 0, 0, 0, 0,
			                     to_i16_checked(extent_resized->x1),
			                     to_i16_checked(extent_resized->y1),
			                     width_resized, height_resized);
		}

		// reset filter
		xcb_render_set_picture_filter(
		    c, src_pict, to_u16_checked(strlen(filter0)), filter0, 0, NULL);

		src_pict = tmp_picture[current];
		dst_pict = tmp_picture[!current];
		current = !current;
	}

	// There is only 1 pass
	if (i == 1) {
		x_set_picture_clip_region(c, xd->back[2], 0, 0, &reg_op);
		xcb_render_composite(
		    c, XCB_RENDER_PICT_OP_OVER, src_pict, alpha_pict, xd->back[2], 0, 0,
		    0, 0, to_i16_checked(extent_resized->x1),
		    to_i16_checked(extent_resized->y1), width_resized, height_resized);
	}

	xcb_render_free_picture(c, tmp_picture[0]);
	xcb_render_free_picture(c, tmp_picture[1]);
	pixman_region32_fini(&reg_op);
	pixman_region32_fini(&reg_op_resized);
	return true;
}

static void *
bind_pixmap(backend_t *base, xcb_pixmap_t pixmap, struct xvisual_info fmt, bool owned) {
	xcb_generic_error_t *e;
	auto r = xcb_get_geometry_reply(base->c, xcb_get_geometry(base->c, pixmap), &e);
	if (!r) {
		log_error("Invalid pixmap: %#010x", pixmap);
		x_print_error(e->full_sequence, e->major_code, e->minor_code, e->error_code);
		return NULL;
	}

	auto img = ccalloc(1, struct xrender_image);
	auto inner = ccalloc(1, struct _xrender_image_data_inner);
	inner->depth = (uint8_t)fmt.visual_depth;
	inner->width = img->base.ewidth = r->width;
	inner->height = img->base.eheight = r->height;
	inner->pixmap = pixmap;
	inner->has_alpha = fmt.alpha_size != 0;
	inner->pict =
	    x_create_picture_with_visual_and_pixmap(base->c, fmt.visual, pixmap, 0, NULL);
	inner->owned = owned;
	inner->visual = fmt.visual;
	inner->refcount = 1;

	img->base.inner = (struct backend_image_inner_base *)inner;
	img->base.opacity = 1;
	img->rounded_rectangle = NULL;
	free(r);

	if (inner->pict == XCB_NONE) {
		free(inner);
		free(img);
		return NULL;
	}
	return img;
}
static void release_image_inner(backend_t *base, struct _xrender_image_data_inner *inner) {
	xcb_render_free_picture(base->c, inner->pict);
	if (inner->owned) {
		xcb_free_pixmap(base->c, inner->pixmap);
	}
	free(inner);
}

static void
release_rounded_corner_cache(backend_t *base, struct xrender_rounded_rectangle_cache *cache) {
	if (!cache) {
		return;
	}

	assert(cache->refcount > 0);
	cache->refcount--;
	if (cache->refcount == 0) {
		xcb_free_pixmap(base->c, cache->p);
		free(cache);
	}
}

static void release_image(backend_t *base, void *image) {
	struct xrender_image *img = image;
	release_rounded_corner_cache(base, img->rounded_rectangle);
	img->rounded_rectangle = NULL;
	img->base.inner->refcount -= 1;
	if (img->base.inner->refcount == 0) {
		release_image_inner(base, (void *)img->base.inner);
	}
	free(img);
}

static void deinit(backend_t *backend_data) {
	struct _xrender_data *xd = (void *)backend_data;
	for (int i = 0; i < 256; i++) {
		xcb_render_free_picture(xd->base.c, xd->alpha_pict[i]);
	}
	xcb_render_free_picture(xd->base.c, xd->target);
	for (int i = 0; i < 2; i++) {
		xcb_render_free_picture(xd->base.c, xd->back[i]);
		xcb_free_pixmap(xd->base.c, xd->back_pixmap[i]);
	}
	if (xd->present_event) {
		xcb_unregister_for_special_event(xd->base.c, xd->present_event);
	}
	xcb_render_free_picture(xd->base.c, xd->white_pixel);
	xcb_render_free_picture(xd->base.c, xd->black_pixel);
	free(xd);
}

static void present(backend_t *base, const region_t *region) {
	struct _xrender_data *xd = (void *)base;
	const rect_t *extent = pixman_region32_extents((region_t *)region);
	int16_t orig_x = to_i16_checked(extent->x1), orig_y = to_i16_checked(extent->y1);
	uint16_t region_width = to_u16_checked(extent->x2 - extent->x1),
	         region_height = to_u16_checked(extent->y2 - extent->y1);

	// compose() sets clip region on the back buffer, so clear it first
	x_clear_picture_clip_region(base->c, xd->back[xd->curr_back]);

	// limit the region of update
	x_set_picture_clip_region(base->c, xd->back[2], 0, 0, region);

	if (xd->vsync) {
		// Update the back buffer first, then present
		xcb_render_composite(base->c, XCB_RENDER_PICT_OP_SRC, xd->back[2],
		                     XCB_NONE, xd->back[xd->curr_back], orig_x, orig_y, 0,
		                     0, orig_x, orig_y, region_width, region_height);

		// Make sure we got reply from PresentPixmap before waiting for events,
		// to avoid deadlock
		auto e = xcb_request_check(
		    base->c, xcb_present_pixmap_checked(
		                 xd->base.c, xd->target_win,
		                 xd->back_pixmap[xd->curr_back], 0, XCB_NONE, XCB_NONE, 0,
		                 0, XCB_NONE, XCB_NONE, XCB_NONE, 0, 0, 0, 0, 0, NULL));
		if (e) {
			log_error("Failed to present pixmap");
			free(e);
			return;
		}
		// TODO(yshui) don't block wait for present completion
		xcb_present_generic_event_t *pev =
		    (void *)xcb_wait_for_special_event(base->c, xd->present_event);
		if (!pev) {
			// We don't know what happened, maybe X died
			// But reset buffer age, so in case we do recover, we will
			// render correctly.
			xd->buffer_age[0] = xd->buffer_age[1] = -1;
			return;
		}
		assert(pev->evtype == XCB_PRESENT_COMPLETE_NOTIFY);
		xcb_present_complete_notify_event_t *pcev = (void *)pev;
		// log_trace("Present complete: %d %ld", pcev->mode, pcev->msc);
		xd->buffer_age[xd->curr_back] = 1;

		// buffer_age < 0 means that back buffer is empty
		if (xd->buffer_age[1 - xd->curr_back] > 0) {
			xd->buffer_age[1 - xd->curr_back]++;
		}
		if (pcev->mode == XCB_PRESENT_COMPLETE_MODE_FLIP) {
			// We cannot use the pixmap we used anymore
			xd->curr_back = 1 - xd->curr_back;
		}
		free(pev);
	} else {
		// No vsync needed, draw into the target picture directly
		xcb_render_composite(base->c, XCB_RENDER_PICT_OP_SRC, xd->back[2],
		                     XCB_NONE, xd->target, orig_x, orig_y, 0, 0, orig_x,
		                     orig_y, region_width, region_height);
	}
}

static int buffer_age(backend_t *backend_data) {
	struct _xrender_data *xd = (void *)backend_data;
	if (!xd->vsync) {
		// Only the target picture really holds the screen content, and its
		// content is always up to date. So buffer age is always 1.
		return 1;
	}
	return xd->buffer_age[xd->curr_back];
}

static struct _xrender_image_data_inner *
new_inner(backend_t *base, int w, int h, xcb_visualid_t visual, uint8_t depth) {
	auto new_inner = ccalloc(1, struct _xrender_image_data_inner);
	new_inner->pixmap = x_create_pixmap(base->c, depth, base->root, w, h);
	if (new_inner->pixmap == XCB_NONE) {
		log_error("Failed to create pixmap for copy");
		free(new_inner);
		return NULL;
	}
	new_inner->pict = x_create_picture_with_visual_and_pixmap(
	    base->c, visual, new_inner->pixmap, 0, NULL);
	if (new_inner->pict == XCB_NONE) {
		log_error("Failed to create picture for copy");
		xcb_free_pixmap(base->c, new_inner->pixmap);
		free(new_inner);
		return NULL;
	}
	new_inner->width = w;
	new_inner->height = h;
	new_inner->visual = visual;
	new_inner->depth = depth;
	new_inner->refcount = 1;
	new_inner->owned = true;
	return new_inner;
}

static bool decouple_image(backend_t *base, struct backend_image *img, const region_t *reg) {
	if (img->inner->refcount == 1) {
		return true;
	}
	auto inner = (struct _xrender_image_data_inner *)img->inner;
	// Force new pixmap to a 32-bit ARGB visual to allow for transparent frames around
	// non-transparent windows
	auto visual = (inner->depth == 32)
	                  ? inner->visual
	                  : x_get_visual_for_standard(base->c, XCB_PICT_STANDARD_ARGB_32);
	auto inner2 = new_inner(base, inner->width, inner->height, visual, 32);
	if (!inner2) {
		return false;
	}

	x_set_picture_clip_region(base->c, inner->pict, 0, 0, reg);
	xcb_render_composite(base->c, XCB_RENDER_PICT_OP_SRC, inner->pict, XCB_NONE,
	                     inner2->pict, 0, 0, 0, 0, 0, 0, to_u16_checked(inner->width),
	                     to_u16_checked(inner->height));

	img->inner = (struct backend_image_inner_base *)inner2;
	inner->refcount--;
	return true;
}

static bool image_op(backend_t *base, enum image_operations op, void *image,
                     const region_t *reg_op, const region_t *reg_visible, void *arg) {
	struct _xrender_data *xd = (void *)base;
	struct backend_image *img = image;
	region_t reg;
	double *dargs = arg;

	pixman_region32_init(&reg);
	pixman_region32_intersect(&reg, (region_t *)reg_op, (region_t *)reg_visible);

	switch (op) {
	case IMAGE_OP_APPLY_ALPHA:
		assert(reg_op);

		if (!pixman_region32_not_empty(&reg)) {
			break;
		}

		if (dargs[0] == 1) {
			break;
		}

		if (!decouple_image(base, img, reg_visible)) {
			pixman_region32_fini(&reg);
			return false;
		}

		auto inner = (struct _xrender_image_data_inner *)img->inner;
		auto alpha_pict = xd->alpha_pict[(int)((1 - dargs[0]) * MAX_ALPHA)];
		x_set_picture_clip_region(base->c, inner->pict, 0, 0, &reg);
		xcb_render_composite(base->c, XCB_RENDER_PICT_OP_OUT_REVERSE, alpha_pict,
		                     XCB_NONE, inner->pict, 0, 0, 0, 0, 0, 0,
		                     to_u16_checked(inner->width),
		                     to_u16_checked(inner->height));
		inner->has_alpha = true;
		break;
	}
	pixman_region32_fini(&reg);
	return true;
}

static void *
create_blur_context(backend_t *base attr_unused, enum blur_method method, void *args) {
	auto ret = ccalloc(1, struct _xrender_blur_context);
	if (!method || method >= BLUR_METHOD_INVALID) {
		ret->method = BLUR_METHOD_NONE;
		return ret;
	}
	if (method == BLUR_METHOD_DUAL_KAWASE) {
		log_warn("Blur method 'dual_kawase' is not compatible with the 'xrender' "
		         "backend.");
		ret->method = BLUR_METHOD_NONE;
		return ret;
	}

	ret->method = BLUR_METHOD_KERNEL;
	struct conv **kernels;
	int kernel_count;
	if (method == BLUR_METHOD_KERNEL) {
		kernels = ((struct kernel_blur_args *)args)->kernels;
		kernel_count = ((struct kernel_blur_args *)args)->kernel_count;
	} else {
		kernels = generate_blur_kernel(method, args, &kernel_count);
	}

	ret->x_blur_kernel = ccalloc(kernel_count, struct x_convolution_kernel *);
	for (int i = 0; i < kernel_count; i++) {
		int center = kernels[i]->h * kernels[i]->w / 2;
		x_create_convolution_kernel(kernels[i], kernels[i]->data[center],
		                            &ret->x_blur_kernel[i]);
		ret->resize_width += kernels[i]->w / 2;
		ret->resize_height += kernels[i]->h / 2;
	}
	ret->x_blur_kernel_count = kernel_count;

	if (method != BLUR_METHOD_KERNEL) {
		// Kernels generated by generate_blur_kernel, so we need to free them.
		for (int i = 0; i < kernel_count; i++) {
			free(kernels[i]);
		}
		free(kernels);
	}
	return ret;
}

static void destroy_blur_context(backend_t *base attr_unused, void *ctx_) {
	struct _xrender_blur_context *ctx = ctx_;
	for (int i = 0; i < ctx->x_blur_kernel_count; i++) {
		free(ctx->x_blur_kernel[i]);
	}
	free(ctx->x_blur_kernel);
	free(ctx);
}

static void get_blur_size(void *blur_context, int *width, int *height) {
	struct _xrender_blur_context *ctx = blur_context;
	*width = ctx->resize_width;
	*height = ctx->resize_height;
}

static backend_t *backend_xrender_init(session_t *ps) {
	auto xd = ccalloc(1, struct _xrender_data);
	init_backend_base(&xd->base, ps);

	for (int i = 0; i <= MAX_ALPHA; ++i) {
		double o = (double)i / (double)MAX_ALPHA;
		xd->alpha_pict[i] = solid_picture(ps->c, ps->root, false, o, 0, 0, 0);
		assert(xd->alpha_pict[i] != XCB_NONE);
	}

	xd->target_width = ps->root_width;
	xd->target_height = ps->root_height;
	xd->default_visual = ps->vis;
	xd->black_pixel = solid_picture(ps->c, ps->root, true, 1, 0, 0, 0);
	xd->white_pixel = solid_picture(ps->c, ps->root, true, 1, 1, 1, 1);

	xd->target_win = session_get_target_window(ps);
	xcb_render_create_picture_value_list_t pa = {
	    .subwindowmode = XCB_SUBWINDOW_MODE_INCLUDE_INFERIORS,
	};
	xd->target = x_create_picture_with_visual_and_pixmap(
	    ps->c, ps->vis, xd->target_win, XCB_RENDER_CP_SUBWINDOW_MODE, &pa);

	auto pictfmt = x_get_pictform_for_visual(ps->c, ps->vis);
	if (!pictfmt) {
		log_fatal("Default visual is invalid");
		abort();
	}

	xd->vsync = ps->o.vsync;
	if (ps->present_exists) {
		auto eid = x_new_id(ps->c);
		auto e =
		    xcb_request_check(ps->c, xcb_present_select_input_checked(
		                                 ps->c, eid, xd->target_win,
		                                 XCB_PRESENT_EVENT_MASK_COMPLETE_NOTIFY));
		if (e) {
			log_error("Cannot select present input, vsync will be disabled");
			xd->vsync = false;
			free(e);
		}

		xd->present_event =
		    xcb_register_for_special_xge(ps->c, &xcb_present_id, eid, NULL);
		if (!xd->present_event) {
			log_error("Cannot register for special XGE, vsync will be "
			          "disabled");
			xd->vsync = false;
		}
	} else {
		xd->vsync = false;
	}

	// We might need to do double buffering for vsync, and buffer 0 and 1 are for
	// double buffering.
	int first_buffer_index = xd->vsync ? 0 : 2;
	for (int i = first_buffer_index; i < 3; i++) {
		xd->back_pixmap[i] = x_create_pixmap(ps->c, pictfmt->depth, ps->root,
		                                     to_u16_checked(ps->root_width),
		                                     to_u16_checked(ps->root_height));
		const uint32_t pic_attrs_mask = XCB_RENDER_CP_REPEAT;
		const xcb_render_create_picture_value_list_t pic_attrs = {
		    .repeat = XCB_RENDER_REPEAT_PAD};
		xd->back[i] = x_create_picture_with_pictfmt_and_pixmap(
		    ps->c, pictfmt, xd->back_pixmap[i], pic_attrs_mask, &pic_attrs);
		xd->buffer_age[i] = -1;
		if (xd->back_pixmap[i] == XCB_NONE || xd->back[i] == XCB_NONE) {
			log_error("Cannot create pixmap for rendering");
			goto err;
		}
	}
	xd->curr_back = 0;

	return &xd->base;
err:
	deinit(&xd->base);
	return NULL;
}

void *clone_image(backend_t *base attr_unused, const void *image_data,
                  const region_t *reg_visible attr_unused) {
	auto new_img = ccalloc(1, struct xrender_image);
	*new_img = *(struct xrender_image *)image_data;
	new_img->base.inner->refcount++;
	if (new_img->rounded_rectangle) {
		new_img->rounded_rectangle->refcount++;
	}
	return new_img;
}

static bool
set_image_property(backend_t *base, enum image_properties op, void *image, void *args) {
	auto xrimg = (struct xrender_image *)image;
	if (op == IMAGE_PROPERTY_CORNER_RADIUS &&
	    ((double *)args)[0] != xrimg->base.corner_radius) {
		// Free cached rounded rectangle if corner radius changed
		release_rounded_corner_cache(base, xrimg->rounded_rectangle);
		xrimg->rounded_rectangle = NULL;
	}
	return default_set_image_property(base, op, image, args);
}

struct backend_operations xrender_ops = {
    .init = backend_xrender_init,
    .deinit = deinit,
    .blur = blur,
    .present = present,
    .compose = compose,
    .fill = fill,
    .bind_pixmap = bind_pixmap,
    .release_image = release_image,
    .render_shadow = default_backend_render_shadow,
    //.prepare_win = prepare_win,
    //.release_win = release_win,
    .is_image_transparent = default_is_image_transparent,
    .buffer_age = buffer_age,
    .max_buffer_age = 2,

    .image_op = image_op,
    .clone_image = clone_image,
    .set_image_property = set_image_property,
    .create_blur_context = create_blur_context,
    .destroy_blur_context = destroy_blur_context,
    .get_blur_size = get_blur_size,
};

// vim: set noet sw=8 ts=8:
