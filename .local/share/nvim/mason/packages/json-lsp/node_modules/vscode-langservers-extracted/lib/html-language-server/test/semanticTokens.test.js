"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.filter.js");

require("regenerator-runtime/runtime.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("mocha");

var assert = require("assert");

var languageModes_1 = require("../modes/languageModes");

var semanticTokens_1 = require("../modes/semanticTokens");

var nodeFs_1 = require("../node/nodeFs");

function assertTokens(_x, _x2, _x3, _x4) {
  return _assertTokens.apply(this, arguments);
}

function _assertTokens() {
  _assertTokens = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(lines, expected, ranges, message) {
    var document, workspace, languageModes, semanticTokensProvider, legend, actual, actualRanges, lastLine, lastCharacter, _loop, i;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            document = languageModes_1.TextDocument.create('test://foo/bar.html', 'html', 1, lines.join('\n'));
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
            semanticTokensProvider = (0, semanticTokens_1.newSemanticTokenProvider)(languageModes);
            legend = semanticTokensProvider.legend;
            _context9.next = 7;
            return semanticTokensProvider.getSemanticTokens(document, ranges);

          case 7:
            actual = _context9.sent;
            actualRanges = [];
            lastLine = 0;
            lastCharacter = 0;

            _loop = function _loop(i) {
              var lineDelta = actual[i],
                  charDelta = actual[i + 1],
                  len = actual[i + 2],
                  typeIdx = actual[i + 3],
                  modSet = actual[i + 4];
              var line = lastLine + lineDelta;
              var character = lineDelta === 0 ? lastCharacter + charDelta : charDelta;
              var tokenClassifiction = [legend.types[typeIdx]].concat(_toConsumableArray(legend.modifiers.filter(function (_, i) {
                return modSet & 1 << i;
              }))).join('.');
              actualRanges.push(t(line, character, len, tokenClassifiction));
              lastLine = line;
              lastCharacter = character;
            };

            for (i = 0; i < actual.length; i += 5) {
              _loop(i);
            }

            assert.deepStrictEqual(actualRanges, expected, message);

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _assertTokens.apply(this, arguments);
}

function t(startLine, character, length, tokenClassifiction) {
  return {
    startLine: startLine,
    character: character,
    length: length,
    tokenClassifiction: tokenClassifiction
  };
}

suite('HTML Semantic Tokens', function () {
  test('Variables', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var input;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script>',
            /*3*/
            '  var x = 9, y1 = [x];',
            /*4*/
            '  try {',
            /*5*/
            '    for (const s of y1) { x = s }',
            /*6*/
            '  } catch (e) {',
            /*7*/
            '    throw y1;',
            /*8*/
            '  }',
            /*9*/
            '</script>',
            /*10*/
            '</head>',
            /*11*/
            '</html>'];
            _context.next = 3;
            return assertTokens(input, [t(3, 6, 1, 'variable.declaration'), t(3, 13, 2, 'variable.declaration'), t(3, 19, 1, 'variable'), t(5, 15, 1, 'variable.declaration.readonly.local'), t(5, 20, 2, 'variable'), t(5, 26, 1, 'variable'), t(5, 30, 1, 'variable.readonly.local'), t(6, 11, 1, 'variable.declaration.local'), t(7, 10, 2, 'variable')]);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('Functions', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var input;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script>',
            /*3*/
            '  function foo(p1) {',
            /*4*/
            '    return foo(Math.abs(p1))',
            /*5*/
            '  }',
            /*6*/
            '  `/${window.location}`.split("/").forEach(s => foo(s));',
            /*7*/
            '</script>',
            /*8*/
            '</head>',
            /*9*/
            '</html>'];
            _context2.next = 3;
            return assertTokens(input, [t(3, 11, 3, 'function.declaration'), t(3, 15, 2, 'parameter.declaration'), t(4, 11, 3, 'function'), t(4, 15, 4, 'variable.defaultLibrary'), t(4, 20, 3, 'method.defaultLibrary'), t(4, 24, 2, 'parameter'), t(6, 6, 6, 'variable.defaultLibrary'), t(6, 13, 8, 'property.defaultLibrary'), t(6, 24, 5, 'method.defaultLibrary'), t(6, 35, 7, 'method.defaultLibrary'), t(6, 43, 1, 'parameter.declaration'), t(6, 48, 3, 'function'), t(6, 52, 1, 'parameter')]);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('Members', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var input;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script>',
            /*3*/
            '  class A {',
            /*4*/
            '    static x = 9;',
            /*5*/
            '    f = 9;',
            /*6*/
            '    async m() { return A.x + await this.m(); };',
            /*7*/
            '    get s() { return this.f; ',
            /*8*/
            '    static t() { return new A().f; };',
            /*9*/
            '    constructor() {}',
            /*10*/
            '  }',
            /*11*/
            '</script>',
            /*12*/
            '</head>',
            /*13*/
            '</html>'];
            _context3.next = 3;
            return assertTokens(input, [t(3, 8, 1, 'class.declaration'), t(4, 11, 1, 'property.declaration.static'), t(5, 4, 1, 'property.declaration'), t(6, 10, 1, 'method.declaration.async'), t(6, 23, 1, 'class'), t(6, 25, 1, 'property.static'), t(6, 40, 1, 'method.async'), t(7, 8, 1, 'property.declaration'), t(7, 26, 1, 'property'), t(8, 11, 1, 'method.declaration.static'), t(8, 28, 1, 'class'), t(8, 32, 1, 'property')]);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('Interfaces', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var input;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script type="text/typescript">',
            /*3*/
            '  interface Position { x: number, y: number };',
            /*4*/
            '  const p = { x: 1, y: 2 } as Position;',
            /*5*/
            '  const foo = (o: Position) => o.x + o.y;',
            /*6*/
            '</script>',
            /*7*/
            '</head>',
            /*8*/
            '</html>'];
            _context4.next = 3;
            return assertTokens(input, [t(3, 12, 8, 'interface.declaration'), t(3, 23, 1, 'property.declaration'), t(3, 34, 1, 'property.declaration'), t(4, 8, 1, 'variable.declaration.readonly'), t(4, 14, 1, 'property.declaration'), t(4, 20, 1, 'property.declaration'), t(4, 30, 8, 'interface'), t(5, 8, 3, 'function.declaration.readonly'), t(5, 15, 1, 'parameter.declaration'), t(5, 18, 8, 'interface'), t(5, 31, 1, 'parameter'), t(5, 33, 1, 'property'), t(5, 37, 1, 'parameter'), t(5, 39, 1, 'property')]);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('Readonly', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var input;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script type="text/typescript">',
            /*3*/
            '  const f = 9;',
            /*4*/
            '  class A { static readonly t = 9; static url: URL; }',
            /*5*/
            '  const enum E { A = 9, B = A + 1 }',
            /*6*/
            '  console.log(f + A.t + A.url.origin);',
            /*7*/
            '</script>',
            /*8*/
            '</head>',
            /*9*/
            '</html>'];
            _context5.next = 3;
            return assertTokens(input, [t(3, 8, 1, 'variable.declaration.readonly'), t(4, 8, 1, 'class.declaration'), t(4, 28, 1, 'property.declaration.static.readonly'), t(4, 42, 3, 'property.declaration.static'), t(4, 47, 3, 'interface.defaultLibrary'), t(5, 13, 1, 'enum.declaration'), t(5, 17, 1, 'enumMember.declaration.readonly'), t(5, 24, 1, 'enumMember.declaration.readonly'), t(5, 28, 1, 'enumMember.readonly'), t(6, 2, 7, 'variable.defaultLibrary'), t(6, 10, 3, 'method.defaultLibrary'), t(6, 14, 1, 'variable.readonly'), t(6, 18, 1, 'class'), t(6, 20, 1, 'property.static.readonly'), t(6, 24, 1, 'class'), t(6, 26, 3, 'property.static'), t(6, 30, 6, 'property.readonly.defaultLibrary')]);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  test('Type aliases and type parameters', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var input;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script type="text/typescript">',
            /*3*/
            '  type MyMap = Map<string, number>;',
            /*4*/
            '  function f<T extends MyMap>(t: T | number) : T { ',
            /*5*/
            '    return <T> <unknown> new Map<string, MyMap>();',
            /*6*/
            '  }',
            /*7*/
            '</script>',
            /*8*/
            '</head>',
            /*9*/
            '</html>'];
            _context6.next = 3;
            return assertTokens(input, [t(3, 7, 5, 'type.declaration'), t(3, 15, 3, 'interface.defaultLibrary')
            /* to investiagte */
            , t(4, 11, 1, 'function.declaration'), t(4, 13, 1, 'typeParameter.declaration'), t(4, 23, 5, 'type'), t(4, 30, 1, 'parameter.declaration'), t(4, 33, 1, 'typeParameter'), t(4, 47, 1, 'typeParameter'), t(5, 12, 1, 'typeParameter'), t(5, 29, 3, 'class.defaultLibrary'), t(5, 41, 5, 'type')]);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test('TS and JS', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var input;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script type="text/typescript">',
            /*3*/
            '  function f<T>(p1: T): T[] { return [ p1 ]; }',
            /*4*/
            '</script>',
            /*5*/
            '<script>',
            /*6*/
            '  window.alert("Hello");',
            /*7*/
            '</script>',
            /*8*/
            '</head>',
            /*9*/
            '</html>'];
            _context7.next = 3;
            return assertTokens(input, [t(3, 11, 1, 'function.declaration'), t(3, 13, 1, 'typeParameter.declaration'), t(3, 16, 2, 'parameter.declaration'), t(3, 20, 1, 'typeParameter'), t(3, 24, 1, 'typeParameter'), t(3, 39, 2, 'parameter'), t(6, 2, 6, 'variable.defaultLibrary'), t(6, 9, 5, 'method.defaultLibrary')]);

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  test('Ranges', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var input;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            input = [
            /*0*/
            '<html>',
            /*1*/
            '<head>',
            /*2*/
            '<script>',
            /*3*/
            '  window.alert("Hello");',
            /*4*/
            '</script>',
            /*5*/
            '<script>',
            /*6*/
            '  window.alert("World");',
            /*7*/
            '</script>',
            /*8*/
            '</head>',
            /*9*/
            '</html>'];
            _context8.next = 3;
            return assertTokens(input, [t(3, 2, 6, 'variable.defaultLibrary'), t(3, 9, 5, 'method.defaultLibrary')], [languageModes_1.Range.create(languageModes_1.Position.create(2, 0), languageModes_1.Position.create(4, 0))]);

          case 3:
            _context8.next = 5;
            return assertTokens(input, [t(6, 2, 6, 'variable.defaultLibrary')], [languageModes_1.Range.create(languageModes_1.Position.create(6, 2), languageModes_1.Position.create(6, 8))]);

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
});