"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.regexp.exec.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceMap = void 0;

var defaultResourceToKey = function defaultResourceToKey(resource) {
  return resource.toString();
};

var ResourceMap = /*#__PURE__*/function (_Symbol$iterator) {
  function ResourceMap() {
    var toKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultResourceToKey;

    _classCallCheck(this, ResourceMap);

    this.map = new Map();
    this.toKey = toKey;
  }

  _createClass(ResourceMap, [{
    key: "set",
    value: function set(uri, value) {
      this.map.set(this.toKey(uri), {
        uri: uri,
        value: value
      });
      return this;
    }
  }, {
    key: "get",
    value: function get(resource) {
      var _this$map$get;

      return (_this$map$get = this.map.get(this.toKey(resource))) === null || _this$map$get === void 0 ? void 0 : _this$map$get.value;
    }
  }, {
    key: "has",
    value: function has(resource) {
      return this.map.has(this.toKey(resource));
    }
  }, {
    key: "size",
    get: function get() {
      return this.map.size;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.map.clear();
    }
  }, {
    key: "delete",
    value: function _delete(resource) {
      return this.map.delete(this.toKey(resource));
    }
  }, {
    key: "values",
    value: /*#__PURE__*/regeneratorRuntime.mark(function values() {
      var _iterator, _step, entry;

      return regeneratorRuntime.wrap(function values$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iterator = _createForOfIteratorHelper(this.map.values());
              _context.prev = 1;

              _iterator.s();

            case 3:
              if ((_step = _iterator.n()).done) {
                _context.next = 9;
                break;
              }

              entry = _step.value;
              _context.next = 7;
              return entry.value;

            case 7:
              _context.next = 3;
              break;

            case 9:
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);

              _iterator.e(_context.t0);

            case 14:
              _context.prev = 14;

              _iterator.f();

              return _context.finish(14);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, values, this, [[1, 11, 14, 17]]);
    })
  }, {
    key: "keys",
    value: /*#__PURE__*/regeneratorRuntime.mark(function keys() {
      var _iterator2, _step2, entry;

      return regeneratorRuntime.wrap(function keys$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iterator2 = _createForOfIteratorHelper(this.map.values());
              _context2.prev = 1;

              _iterator2.s();

            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 9;
                break;
              }

              entry = _step2.value;
              _context2.next = 7;
              return entry.uri;

            case 7:
              _context2.next = 3;
              break;

            case 9:
              _context2.next = 14;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](1);

              _iterator2.e(_context2.t0);

            case 14:
              _context2.prev = 14;

              _iterator2.f();

              return _context2.finish(14);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, keys, this, [[1, 11, 14, 17]]);
    })
  }, {
    key: "entries",
    value: /*#__PURE__*/regeneratorRuntime.mark(function entries() {
      var _iterator3, _step3, entry;

      return regeneratorRuntime.wrap(function entries$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _iterator3 = _createForOfIteratorHelper(this.map.values());
              _context3.prev = 1;

              _iterator3.s();

            case 3:
              if ((_step3 = _iterator3.n()).done) {
                _context3.next = 9;
                break;
              }

              entry = _step3.value;
              _context3.next = 7;
              return [entry.uri, entry.value];

            case 7:
              _context3.next = 3;
              break;

            case 9:
              _context3.next = 14;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](1);

              _iterator3.e(_context3.t0);

            case 14:
              _context3.prev = 14;

              _iterator3.f();

              return _context3.finish(14);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, entries, this, [[1, 11, 14, 17]]);
    })
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this.entries();
    }
  }]);

  return ResourceMap;
}(Symbol.iterator);

exports.ResourceMap = ResourceMap;