"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

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

function setupMain() {
  return _setupMain.apply(this, arguments);
}

function _setupMain() {
  _setupMain = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var l10nLog, i10lLocation;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            l10nLog = [];
            i10lLocation = process.env['VSCODE_L10N_BUNDLE_LOCATION'];

            if (!i10lLocation) {
              _context.next = 12;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return l10n.config({
              uri: i10lLocation
            });

          case 6:
            l10nLog.push("l10n: Configured to ".concat(i10lLocation.toString()));
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            l10nLog.push("l10n: Problems loading ".concat(i10lLocation.toString(), " : ").concat(_context.t0));

          case 12:
            _context.next = 14;
            return Promise.resolve().then(function () {
              return require('./main');
            });

          case 14:
            l10nLog.forEach(console.log);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 9]]);
  }));
  return _setupMain.apply(this, arguments);
}

setupMain();