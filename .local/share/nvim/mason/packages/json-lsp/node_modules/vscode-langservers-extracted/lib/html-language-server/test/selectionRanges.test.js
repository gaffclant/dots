"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.concat.js");

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("mocha");

var assert = require("assert");

var languageModes_1 = require("../modes/languageModes");

var selectionRanges_1 = require("../modes/selectionRanges");

var nodeFs_1 = require("../node/nodeFs");

function assertRanges(_x, _x2) {
  return _assertRanges.apply(this, arguments);
}

function _assertRanges() {
  _assertRanges = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(content, expected) {
    var message, offset, workspace, languageModes, document, actualRanges, offsetPairs, curr;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            message = "".concat(content, " gives selection range:\n");
            offset = content.indexOf('|');
            content = content.substr(0, offset) + content.substr(offset + 1);
            workspace = {
              settings: {},
              folders: [{
                name: 'foo',
                uri: 'test://foo'
              }]
            };
            languageModes = (0, languageModes_1.getLanguageModes)({
              css: true,
              javascript: true
            }, workspace, languageModes_1.ClientCapabilities.LATEST, (0, nodeFs_1.getNodeFileFS)());
            document = languageModes_1.TextDocument.create('test://foo.html', 'html', 1, content);
            _context4.next = 8;
            return (0, selectionRanges_1.getSelectionRanges)(languageModes, document, [document.positionAt(offset)]);

          case 8:
            actualRanges = _context4.sent;
            assert.strictEqual(actualRanges.length, 1);
            offsetPairs = [];
            curr = actualRanges[0];

            while (curr) {
              offsetPairs.push([document.offsetAt(curr.range.start), document.getText(curr.range)]);
              curr = curr.parent;
            }

            message += "".concat(JSON.stringify(offsetPairs), "\n but should give:\n").concat(JSON.stringify(expected), "\n");
            assert.deepStrictEqual(offsetPairs, expected, message);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _assertRanges.apply(this, arguments);
}

suite('HTML SelectionRange', function () {
  test('Embedded JavaScript', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return assertRanges('<html><head><script>  function foo() { return ((1|+2)*6) }</script></head></html>', [[48, '1'], [48, '1+2'], [47, '(1+2)'], [47, '(1+2)*6'], [46, '((1+2)*6)'], [39, 'return ((1+2)*6)'], [22, 'function foo() { return ((1+2)*6) }'], [20, '  function foo() { return ((1+2)*6) }'], [12, '<script>  function foo() { return ((1+2)*6) }</script>'], [6, '<head><script>  function foo() { return ((1+2)*6) }</script></head>'], [0, '<html><head><script>  function foo() { return ((1+2)*6) }</script></head></html>']]);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('Embedded CSS', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return assertRanges('<html><head><style>foo { display: |none; } </style></head></html>', [[34, 'none'], [25, 'display: none'], [24, ' display: none; '], [23, '{ display: none; }'], [19, 'foo { display: none; }'], [19, 'foo { display: none; } '], [12, '<style>foo { display: none; } </style>'], [6, '<head><style>foo { display: none; } </style></head>'], [0, '<html><head><style>foo { display: none; } </style></head></html>']]);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('Embedded style', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return assertRanges('<div style="color: |red"></div>', [[19, 'red'], [12, 'color: red'], [11, '"color: red"'], [5, 'style="color: red"'], [1, 'div style="color: red"'], [0, '<div style="color: red"></div>']]);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
});