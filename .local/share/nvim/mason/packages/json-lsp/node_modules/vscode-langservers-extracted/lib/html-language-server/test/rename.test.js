"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var assert = require("assert");

var languageModes_1 = require("../modes/languageModes");

var nodeFs_1 = require("../node/nodeFs");

function testRename(_x, _x2, _x3) {
  return _testRename.apply(this, arguments);
}

function _testRename() {
  _testRename = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(value, newName, expectedDocContent) {
    var offset, document, workspace, languageModes, javascriptMode, position, workspaceEdit, edits, newDocContent;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            offset = value.indexOf('|');
            value = value.substr(0, offset) + value.substr(offset + 1);
            document = languageModes_1.TextDocument.create('test://test/test.html', 'html', 0, value);
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
            javascriptMode = languageModes.getMode('javascript');
            position = document.positionAt(offset);

            if (!javascriptMode) {
              _context6.next = 18;
              break;
            }

            _context6.next = 10;
            return javascriptMode.doRename(document, position, newName);

          case 10:
            workspaceEdit = _context6.sent;

            if (!workspaceEdit || !workspaceEdit.changes) {
              assert.fail('No workspace edits');
            }

            edits = workspaceEdit.changes[document.uri.toString()];

            if (!edits) {
              assert.fail("No edits for file at ".concat(document.uri.toString()));
            }

            newDocContent = languageModes_1.TextDocument.applyEdits(document, edits);
            assert.strictEqual(newDocContent, expectedDocContent, "Expected: ".concat(expectedDocContent, "\nActual: ").concat(newDocContent));
            _context6.next = 19;
            break;

          case 18:
            assert.fail('should have javascriptMode but no');

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _testRename.apply(this, arguments);
}

function testNoRename(_x4, _x5) {
  return _testNoRename.apply(this, arguments);
}

function _testNoRename() {
  _testNoRename = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(value, newName) {
    var offset, document, workspace, languageModes, javascriptMode, position, workspaceEdit;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            offset = value.indexOf('|');
            value = value.substr(0, offset) + value.substr(offset + 1);
            document = languageModes_1.TextDocument.create('test://test/test.html', 'html', 0, value);
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
            javascriptMode = languageModes.getMode('javascript');
            position = document.positionAt(offset);

            if (!javascriptMode) {
              _context7.next = 14;
              break;
            }

            _context7.next = 10;
            return javascriptMode.doRename(document, position, newName);

          case 10:
            workspaceEdit = _context7.sent;
            assert.ok((workspaceEdit === null || workspaceEdit === void 0 ? void 0 : workspaceEdit.changes) === undefined, 'Should not rename but rename happened');
            _context7.next = 15;
            break;

          case 14:
            assert.fail('should have javascriptMode but no');

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _testNoRename.apply(this, arguments);
}

suite('HTML Javascript Rename', function () {
  test('Rename Variable', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var input, output;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            input = ['<html>', '<head>', '<script>', 'const |a = 2;', 'const b = a + 2', '</script>', '</head>', '</html>'];
            output = ['<html>', '<head>', '<script>', 'const h = 2;', 'const b = h + 2', '</script>', '</head>', '</html>'];
            _context.next = 4;
            return testRename(input.join('\n'), 'h', output.join('\n'));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('Rename Function', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var input, output;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            input = ['<html>', '<head>', '<script>', "const name = 'cjg';", 'function |sayHello(name) {', "console.log('hello', name)", '}', 'sayHello(name)', '</script>', '</head>', '</html>'];
            output = ['<html>', '<head>', '<script>', "const name = 'cjg';", 'function sayName(name) {', "console.log('hello', name)", '}', 'sayName(name)', '</script>', '</head>', '</html>'];
            _context2.next = 4;
            return testRename(input.join('\n'), 'sayName', output.join('\n'));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('Rename Function Params', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var input, output;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            input = ['<html>', '<head>', '<script>', "const name = 'cjg';", 'function sayHello(|name) {', "console.log('hello', name)", '}', 'sayHello(name)', '</script>', '</head>', '</html>'];
            output = ['<html>', '<head>', '<script>', "const name = 'cjg';", 'function sayHello(newName) {', "console.log('hello', newName)", '}', 'sayHello(name)', '</script>', '</head>', '</html>'];
            _context3.next = 4;
            return testRename(input.join('\n'), 'newName', output.join('\n'));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('Rename Class', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var input, output;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            input = ['<html>', '<head>', '<script>', "class |Foo {}", "const foo = new Foo()", '</script>', '</head>', '</html>'];
            output = ['<html>', '<head>', '<script>', "class Bar {}", "const foo = new Bar()", '</script>', '</head>', '</html>'];
            _context4.next = 4;
            return testRename(input.join('\n'), 'Bar', output.join('\n'));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('Cannot Rename literal', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var stringLiteralInput, numberLiteralInput;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            stringLiteralInput = ['<html>', '<head>', '<script>', "const name = |'cjg';", '</script>', '</head>', '</html>'];
            numberLiteralInput = ['<html>', '<head>', '<script>', "const num = |2;", '</script>', '</head>', '</html>'];
            _context5.next = 4;
            return testNoRename(stringLiteralInput.join('\n'), 'something');

          case 4:
            _context5.next = 6;
            return testNoRename(numberLiteralInput.join('\n'), 'hhhh');

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
});