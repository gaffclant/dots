# Autogenerated config.py
#
# NOTE: config.py is intended for advanced users who are comfortable
# with manually migrating the config file on qutebrowser upgrades. If
# you prefer, you can also configure qutebrowser using the
# :set/:bind/:config-* commands without having to write a config.py
# file.
#
# Documentation:
#   qute://help/configuring.html
#   qute://help/settings.html

# Change the argument to True to still load settings configured via autoconfig.yml

# Which cookies to accept. With QtWebEngine, this setting also controls
# other features with tracking capabilities similar to those of cookies;
# including IndexedDB, DOM storage, filesystem API, service workers, and
# AppCache. Note that with QtWebKit, only `all` and `never` are
# supported as per-domain values. Setting `no-3rdparty` or `no-
# unknown-3rdparty` per-domain on QtWebKit will have the same effect as
# `all`. If this setting is used with URL patterns, the pattern gets
# applied to the origin/first party URL of the page making the request,
# not the request URL.
# Type: String
# Valid values:
#   - all: Accept all cookies.
#   - no-3rdparty: Accept cookies from the same origin only. This is known to break some sites, such as GMail.
#   - no-unknown-3rdparty: Accept cookies from the same origin only, unless a cookie is already set for the domain. On QtWebEngine, this is the same as no-3rdparty.
#   - never: Don't accept cookies at all.
config.set('content.cookies.accept', 'all', 'chrome-devtools://*')

# Which cookies to accept. With QtWebEngine, this setting also controls
# other features with tracking capabilities similar to those of cookies;
# including IndexedDB, DOM storage, filesystem API, service workers, and
# AppCache. Note that with QtWebKit, only `all` and `never` are
# supported as per-domain values. Setting `no-3rdparty` or `no-
# unknown-3rdparty` per-domain on QtWebKit will have the same effect as
# `all`. If this setting is used with URL patterns, the pattern gets
# applied to the origin/first party URL of the page making the request,
# not the request URL.
# Type: String
# Valid values:
#   - all: Accept all cookies.
#   - no-3rdparty: Accept cookies from the same origin only. This is known to break some sites, such as GMail.
#   - no-unknown-3rdparty: Accept cookies from the same origin only, unless a cookie is already set for the domain. On QtWebEngine, this is the same as no-3rdparty.
#   - never: Don't accept cookies at all.
config.set('content.cookies.accept', 'all', 'devtools://*')

# User agent to send.  The following placeholders are defined:  *
# `{os_info}`: Something like "X11; Linux x86_64". * `{webkit_version}`:
# The underlying WebKit version (set to a fixed value   with
# QtWebEngine). * `{qt_key}`: "Qt" for QtWebKit, "QtWebEngine" for
# QtWebEngine. * `{qt_version}`: The underlying Qt version. *
# `{upstream_browser_key}`: "Version" for QtWebKit, "Chrome" for
# QtWebEngine. * `{upstream_browser_version}`: The corresponding
# Safari/Chrome version. * `{qutebrowser_version}`: The currently
# running qutebrowser version.  The default value is equal to the
# unchanged user agent of QtWebKit/QtWebEngine.  Note that the value
# read from JavaScript is always the global value. With QtWebEngine
# between 5.12 and 5.14 (inclusive), changing the value exposed to
# JavaScript requires a restart.
# Type: FormatString
config.set('content.headers.user_agent', 'Mozilla/5.0 ({os_info}) AppleWebKit/{webkit_version} (KHTML, like Gecko) {upstream_browser_key}/{upstream_browser_version} Safari/{webkit_version}', 'https://web.whatsapp.com/')

# User agent to send.  The following placeholders are defined:  *
# `{os_info}`: Something like "X11; Linux x86_64". * `{webkit_version}`:
# The underlying WebKit version (set to a fixed value   with
# QtWebEngine). * `{qt_key}`: "Qt" for QtWebKit, "QtWebEngine" for
# QtWebEngine. * `{qt_version}`: The underlying Qt version. *
# `{upstream_browser_key}`: "Version" for QtWebKit, "Chrome" for
# QtWebEngine. * `{upstream_browser_version}`: The corresponding
# Safari/Chrome version. * `{qutebrowser_version}`: The currently
# running qutebrowser version.  The default value is equal to the
# unchanged user agent of QtWebKit/QtWebEngine.  Note that the value
# read from JavaScript is always the global value. With QtWebEngine
# between 5.12 and 5.14 (inclusive), changing the value exposed to
# JavaScript requires a restart.
# Type: FormatString
config.set('content.headers.user_agent', 'Mozilla/5.0 ({os_info}) AppleWebKit/{webkit_version} (KHTML, like Gecko) {upstream_browser_key}/{upstream_browser_version} Safari/{webkit_version} Edg/{upstream_browser_version}', 'https://accounts.google.com/*')

# User agent to send.  The following placeholders are defined:  *
# `{os_info}`: Something like "X11; Linux x86_64". * `{webkit_version}`:
# The underlying WebKit version (set to a fixed value   with
# QtWebEngine). * `{qt_key}`: "Qt" for QtWebKit, "QtWebEngine" for
# QtWebEngine. * `{qt_version}`: The underlying Qt version. *
# `{upstream_browser_key}`: "Version" for QtWebKit, "Chrome" for
# QtWebEngine. * `{upstream_browser_version}`: The corresponding
# Safari/Chrome version. * `{qutebrowser_version}`: The currently
# running qutebrowser version.  The default value is equal to the
# unchanged user agent of QtWebKit/QtWebEngine.  Note that the value
# read from JavaScript is always the global value. With QtWebEngine
# between 5.12 and 5.14 (inclusive), changing the value exposed to
# JavaScript requires a restart.
# Type: FormatString
config.set('content.headers.user_agent', 'Mozilla/5.0 ({os_info}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99 Safari/537.36', 'https://*.slack.com/*')

# Enable the ad/host blocker
# Type: Bool
c.content.blocking.enabled = True

# A list of patterns that should always be loaded, despite being blocked
# by the ad-/host-blocker. Local domains are always exempt from
# adblocking. Note this whitelists otherwise blocked requests, not
# first-party URLs. As an example, if `example.org` loads an ad from
# `ads.example.org`, the whitelist entry could be
# `https://ads.example.org/*`. If you want to disable the adblocker on a
# given page, use the `content.blocking.enabled` setting with a URL
# pattern instead.
# Type: List of UrlPattern
c.content.blocking.whitelist = ['sdk.split.io', 'events.split.io', 'cdn.split.io', 'sdk.split.io', 'aternos.org', 'aternos.org', 'events.split.io',]

# Load images automatically in web pages.
# Type: Bool
config.set('content.images', True, 'chrome-devtools://*')

# Load images automatically in web pages.
# Type: Bool
config.set('content.images', True, 'devtools://*')

# Enable JavaScript.
# Type: Bool
config.set('content.javascript.enabled', True, 'chrome-devtools://*')

# Enable JavaScript.
# Type: Bool
config.set('content.javascript.enabled', True, 'devtools://*')

# Enable JavaScript.
# Type: Bool
config.set('content.javascript.enabled', True, 'chrome://*/*')

# Enable JavaScript.
# Type: Bool
config.set('content.javascript.enabled', True, 'qute://*/*')

# Allow websites to record audio.
# Type: BoolAsk
# Valid values:
#   - true
#   - false
#   - ask
config.set('content.media.audio_capture', True, 'https://asm.smartmusic.com')

# Proxy to use. In addition to the listed values, you can use a
# `socks://...` or `http://...` URL. Note that with QtWebEngine, it will
# take a couple of seconds until the change is applied, if this value is
# changed at runtime.
# Type: Proxy
# Valid values:
#   - system: Use the system wide proxy.
#   - none: Don't use any proxy
c.content.proxy = 'system'

# Allow websites to register protocol handlers via
# `navigator.registerProtocolHandler`.
# Type: BoolAsk
# Valid values:
#   - true
#   - false
#   - ask
config.set('content.register_protocol_handler', True, 'https://mail.google.com?extsrc=mailto&url=%25s')

# Text color of the completion widget. May be a single color to use for
# all columns or a list of three colors, one for each column.
# Type: List of QtColor, or QtColor
c.colors.completion.fg = '#99cbf1'

# Background color of the completion widget for odd rows.
# Type: QssColor
c.colors.completion.odd.bg = '#06020F'

# Background color of the completion widget for even rows.
# Type: QssColor
c.colors.completion.even.bg = '#06020F'

# Foreground color of completion widget category headers.
# Type: QtColor
c.colors.completion.category.fg = '#99cbf1'

# Background color of the completion widget category headers.
# Type: QssColor
c.colors.completion.category.bg = '#06020F'

# Top border color of the completion widget category headers.
# Type: QssColor
c.colors.completion.category.border.top = '#06020F'

# Bottom border color of the completion widget category headers.
# Type: QssColor
c.colors.completion.category.border.bottom = '#06020F'

# Foreground color of the selected completion item.
# Type: QtColor
c.colors.completion.item.selected.fg = '#99cbf1'

# Background color of the selected completion item.
# Type: QssColor
c.colors.completion.item.selected.bg = '#6b8ea8'

# Top border color of the selected completion item.
# Type: QssColor
c.colors.completion.item.selected.border.top = '#06020F'

# Bottom border color of the selected completion item.
# Type: QssColor
c.colors.completion.item.selected.border.bottom = '#06020F'

# Foreground color of the matched text in the completion.
# Type: QtColor
c.colors.completion.match.fg = '#C4877B'

# Color of the scrollbar handle in the completion view.
# Type: QssColor
c.colors.completion.scrollbar.fg = '#6b8ea8'

# Color of the scrollbar in the completion view.
# Type: QssColor
c.colors.completion.scrollbar.bg = '#06020F'

# Background color for the download bar.
# Type: QssColor
c.colors.downloads.bar.bg = '#06020F'

# Color gradient stop for download backgrounds.
# Type: QtColor
c.colors.downloads.stop.bg = '#A935D2'

# Color gradient interpolation system for download backgrounds.
# Type: ColorSystem
# Valid values:
#   - rgb: Interpolate in the RGB color system.
#   - hsv: Interpolate in the HSV color system.
#   - hsl: Interpolate in the HSL color system.
#   - none: Don't show a gradient.
c.colors.downloads.system.bg = 'none'

# Foreground color for downloads with errors.
# Type: QtColor
c.colors.downloads.error.fg = '#99cbf1'

# Background color for downloads with errors.
# Type: QtColor
c.colors.downloads.error.bg = '#4B4D64'

# Font color for hints.
# Type: QssColor
c.colors.hints.fg = '#06020F'

# Background color for hints. Note that you can use a `rgba(...)` value
# for transparency.
# Type: QssColor
c.colors.hints.bg = '#C4877B'

# Font color for the matched part of hints.
# Type: QtColor
c.colors.hints.match.fg = '#180C9B'

# Text color for the keyhint widget.
# Type: QssColor
c.colors.keyhint.fg = '#99cbf1'

# Highlight color for keys to complete the current keychain.
# Type: QssColor
c.colors.keyhint.suffix.fg = '#C4877B'

# Background color of the keyhint widget.
# Type: QssColor
c.colors.keyhint.bg = '#06020F'

# Foreground color of an error message.
# Type: QssColor
c.colors.messages.error.fg = '#99cbf1'

# Background color of an error message.
# Type: QssColor
c.colors.messages.error.bg = '#4B4D64'

# Border color of an error message.
# Type: QssColor
c.colors.messages.error.border = '#4B4D64'

# Foreground color of a warning message.
# Type: QssColor
c.colors.messages.warning.fg = '#99cbf1'

# Background color of a warning message.
# Type: QssColor
c.colors.messages.warning.bg = '#4B4D64'

# Border color of a warning message.
# Type: QssColor
c.colors.messages.warning.border = '#4B4D64'

# Foreground color of an info message.
# Type: QssColor
c.colors.messages.info.fg = '#99cbf1'

# Background color of an info message.
# Type: QssColor
c.colors.messages.info.bg = '#180C9B'

# Border color of an info message.
# Type: QssColor
c.colors.messages.info.border = '#180C9B'

# Foreground color for prompts.
# Type: QssColor
c.colors.prompts.fg = '#99cbf1'

# Border used around UI elements in prompts.
# Type: String
c.colors.prompts.border = '1px solid #06020F'

# Background color for prompts.
# Type: QssColor
c.colors.prompts.bg = '#06020F'

# Background color for the selected item in filename prompts.
# Type: QssColor
c.colors.prompts.selected.bg = '#4435C1'

# Foreground color of the statusbar.
# Type: QssColor
c.colors.statusbar.normal.fg = '#99cbf1'

# Background color of the statusbar.
# Type: QssColor
c.colors.statusbar.normal.bg = '#06020F'

# Foreground color of the statusbar in insert mode.
# Type: QssColor
c.colors.statusbar.insert.fg = '#06020F'

# Background color of the statusbar in insert mode.
# Type: QssColor
c.colors.statusbar.insert.bg = '#993763'

# Foreground color of the statusbar in passthrough mode.
# Type: QssColor
c.colors.statusbar.passthrough.fg = '#99cbf1'

# Background color of the statusbar in passthrough mode.
# Type: QssColor
c.colors.statusbar.passthrough.bg = '#180C9B'

# Foreground color of the statusbar in private browsing mode.
# Type: QssColor
c.colors.statusbar.private.fg = '#99cbf1'

# Background color of the statusbar in private browsing mode.
# Type: QssColor
c.colors.statusbar.private.bg = '#06020F'

# Foreground color of the statusbar in command mode.
# Type: QssColor
c.colors.statusbar.command.fg = '#99cbf1'

# Background color of the statusbar in command mode.
# Type: QssColor
c.colors.statusbar.command.bg = '#06020F'

# Foreground color of the statusbar in private browsing + command mode.
# Type: QssColor
c.colors.statusbar.command.private.fg = '#99cbf1'

# Background color of the statusbar in private browsing + command mode.
# Type: QssColor
c.colors.statusbar.command.private.bg = '#06020F'

# Foreground color of the statusbar in caret mode.
# Type: QssColor
c.colors.statusbar.caret.fg = '#99cbf1'

# Background color of the statusbar in caret mode.
# Type: QssColor
c.colors.statusbar.caret.bg = '#A935D2'

# Foreground color of the statusbar in caret mode with a selection.
# Type: QssColor
c.colors.statusbar.caret.selection.fg = '#99cbf1'

# Background color of the statusbar in caret mode with a selection.
# Type: QssColor
c.colors.statusbar.caret.selection.bg = '#A935D2'

# Background color of the progress bar.
# Type: QssColor
c.colors.statusbar.progress.bg = '#99cbf1'

# Default foreground color of the URL in the statusbar.
# Type: QssColor
c.colors.statusbar.url.fg = '#99cbf1'

# Foreground color of the URL in the statusbar on error.
# Type: QssColor
c.colors.statusbar.url.error.fg = '#4B4D64'

# Foreground color of the URL in the statusbar for hovered links.
# Type: QssColor
c.colors.statusbar.url.hover.fg = '#180C9B'

# Foreground color of the URL in the statusbar on successful load
# (http).
# Type: QssColor
c.colors.statusbar.url.success.http.fg = '#99cbf1'

# Foreground color of the URL in the statusbar on successful load
# (https).
# Type: QssColor
c.colors.statusbar.url.success.https.fg = '#6b8ea8'

# Foreground color of the URL in the statusbar when there's a warning.
# Type: QssColor
c.colors.statusbar.url.warn.fg = '#4B4D64'

# Background color of the tab bar.
# Type: QssColor
c.colors.tabs.bar.bg = '#06020F'

# Color for the tab indicator on errors.
# Type: QtColor
c.colors.tabs.indicator.error = '#4B4D64'

# Color gradient interpolation system for the tab indicator.
# Type: ColorSystem
# Valid values:
#   - rgb: Interpolate in the RGB color system.
#   - hsv: Interpolate in the HSV color system.
#   - hsl: Interpolate in the HSL color system.
#   - none: Don't show a gradient.
c.colors.tabs.indicator.system = 'none'

# Foreground color of unselected odd tabs.
# Type: QtColor
c.colors.tabs.odd.fg = '#99cbf1'

# Background color of unselected odd tabs.
# Type: QtColor
c.colors.tabs.odd.bg = '#06020F'

# Foreground color of unselected even tabs.
# Type: QtColor
c.colors.tabs.even.fg = '#99cbf1'

# Background color of unselected even tabs.
# Type: QtColor
c.colors.tabs.even.bg = '#06020F'

# Foreground color of selected odd tabs.
# Type: QtColor
c.colors.tabs.selected.odd.fg = '#99cbf1'

# Background color of selected odd tabs.
# Type: QtColor
c.colors.tabs.selected.odd.bg = '#180C9B'

# Foreground color of selected even tabs.
# Type: QtColor
c.colors.tabs.selected.even.fg = '#99cbf1'

# Background color of selected even tabs.
# Type: QtColor
c.colors.tabs.selected.even.bg = '#180C9B'

# Background color for webpages if unset (or empty to use the theme's
# color).
# Type: QtColor
c.colors.webpage.bg = '#99cbf1'

# Render all web contents using a dark theme. Example configurations
# from Chromium's `chrome://flags`:  - "With simple HSL/CIELAB/RGB-based
# inversion": Set   `colors.webpage.darkmode.algorithm` accordingly.  -
# "With selective image inversion": Set
# `colors.webpage.darkmode.policy.images` to `smart`.  - "With selective
# inversion of non-image elements": Set
# `colors.webpage.darkmode.threshold.text` to 150 and
# `colors.webpage.darkmode.threshold.background` to 205.  - "With
# selective inversion of everything": Combines the two variants   above.
# Type: Bool
c.colors.webpage.darkmode.enabled = False 

# Which algorithm to use for modifying how colors are rendered with
# darkmode. The `lightness-cielab` value was added with QtWebEngine 5.14
# and is treated like `lightness-hsl` with older QtWebEngine versions.
# Type: String
# Valid values:
#   - lightness-cielab: Modify colors by converting them to CIELAB color space and inverting the L value. Not available with Qt < 5.14.
#   - lightness-hsl: Modify colors by converting them to the HSL color space and inverting the lightness (i.e. the "L" in HSL).
#   - brightness-rgb: Modify colors by subtracting each of r, g, and b from their maximum value.
c.colors.webpage.darkmode.algorithm = 'lightness-cielab'

# Bindings for normal mode
config.bind(',M', 'hint links spawn mpv {hint-url}')
config.bind(',m', 'spawn mpv {url}')
config.bind(",V", 'hint links userscript youtube_downloader.sh')
config.bind(',v', 'spawn --userscript youtube_downloader.sh')
config.bind('<Ctrl-Shift-p>', 'hint links spawn --verbose --detach /home/gaffclant/Programming/Bash/fillplaylist.sh push {hint-url}')
config.bind('<Ctrl-Shift-o>', 'spawn --verbose --detach /home/gaffclant/Programming/Bash/fillplaylist.sh play')
config.bind('<Ctrl-Shift-d>', 'hint links spawn --verbose --detach mpv {hint-url} --input-ipc-server=/tmp/mpvsocket')

config.load_autoconfig()



import catppuccin
config.load_autoconfig()
catppuccin.setup(c, 'latte')


