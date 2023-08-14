"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var l10n = require("@vscode/l10n");

var initialized = false;
var pendingMessages = [];

var messageHandler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
    var l10nLog, i10lLocation;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (initialized) {
              _context.next = 23;
              break;
            }

            l10nLog = [];
            initialized = true;
            i10lLocation = e.data.i10lLocation;

            if (!i10lLocation) {
              _context.next = 16;
              break;
            }

            _context.prev = 5;
            _context.next = 8;
            return l10n.config({
              uri: i10lLocation
            });

          case 8:
            l10nLog.push("l10n: Configured to ".concat(i10lLocation.toString(), "."));
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](5);
            l10nLog.push("l10n: Problems loading ".concat(i10lLocation.toString(), " : ").concat(_context.t0, "."));

          case 14:
            _context.next = 17;
            break;

          case 16:
            l10nLog.push("l10n: No bundle configured.");

          case 17:
            _context.next = 19;
            return Promise.resolve().then(function () {
              return require('./main');
            });

          case 19:
            if (self.onmessage !== messageHandler) {
              pendingMessages.forEach(function (msg) {
                var _self$onmessage, _self;

                return (_self$onmessage = (_self = self).onmessage) === null || _self$onmessage === void 0 ? void 0 : _self$onmessage.call(_self, msg);
              });
              pendingMessages.length = 0;
            }

            l10nLog.forEach(console.log);
            _context.next = 24;
            break;

          case 23:
            pendingMessages.push(e);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 11]]);
  }));

  return function messageHandler(_x) {
    return _ref.apply(this, arguments);
  };
}();

self.onmessage = messageHandler;