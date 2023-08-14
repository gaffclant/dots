"use strict";

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.regexp.to-string.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("mocha");

var assert = require("assert");

var vscode_uri_1 = require("vscode-uri");

var path_1 = require("path");

var vscode_languageserver_types_1 = require("vscode-languageserver-types");

var vscode_css_languageservice_1 = require("vscode-css-languageservice");

var documentContext_1 = require("../utils/documentContext");

var nodeFs_1 = require("../node/nodeFs");

suite('Links', function () {
  var cssLanguageService = (0, vscode_css_languageservice_1.getCSSLanguageService)({
    fileSystemProvider: (0, nodeFs_1.getNodeFSRequestService)()
  });

  var assertLink = function assertLink(links, expected, document) {
    var matches = links.filter(function (link) {
      return document.offsetAt(link.range.start) === expected.offset;
    });
    assert.strictEqual(matches.length, 1, "".concat(expected.offset, " should only existing once: Actual: ").concat(links.map(function (l) {
      return document.offsetAt(l.range.start);
    }).join(', ')));
    var match = matches[0];
    assert.strictEqual(document.getText(match.range), expected.value);
    assert.strictEqual(match.target, expected.target);
  };

  function assertLinks(_x, _x2, _x3, _x4) {
    return _assertLinks.apply(this, arguments);
  }

  function _assertLinks() {
    _assertLinks = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(value, expected, testUri, workspaceFolders) {
      var lang,
          offset,
          document,
          context,
          stylesheet,
          links,
          _iterator,
          _step,
          item,
          _args5 = arguments;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              lang = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : 'css';
              offset = value.indexOf('|');
              value = value.substr(0, offset) + value.substr(offset + 1);
              document = vscode_languageserver_types_1.TextDocument.create(testUri, lang, 0, value);

              if (!workspaceFolders) {
                workspaceFolders = [{
                  name: 'x',
                  uri: testUri.substr(0, testUri.lastIndexOf('/'))
                }];
              }

              context = (0, documentContext_1.getDocumentContext)(testUri, workspaceFolders);
              stylesheet = cssLanguageService.parseStylesheet(document);
              _context5.next = 9;
              return cssLanguageService.findDocumentLinks2(document, stylesheet, context);

            case 9:
              links = _context5.sent;
              assert.strictEqual(links.length, expected.length);
              _iterator = _createForOfIteratorHelper(expected);

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  item = _step.value;
                  assertLink(links, item, document);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _assertLinks.apply(this, arguments);
  }

  function getTestResource(path) {
    return vscode_uri_1.URI.file((0, path_1.resolve)(__dirname, '../../test/linksTestFixtures', path)).toString(true);
  }

  test('url links', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            testUri = getTestResource('about.css');
            folders = [{
              name: 'x',
              uri: getTestResource('')
            }];
            _context.next = 4;
            return assertLinks('html { background-image: url("hello.html|")', [{
              offset: 29,
              value: '"hello.html"',
              target: getTestResource('hello.html')
            }], testUri, folders);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('url links - untitled', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            testUri = 'untitled:untitled-1';
            folders = [{
              name: 'x',
              uri: getTestResource('')
            }];
            _context2.next = 4;
            return assertLinks('@import url("base.css|");")', [{
              offset: 12,
              value: '"base.css"',
              target: 'untitled:base.css'
            }], testUri, folders);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('node module resolving', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            testUri = getTestResource('about.css');
            folders = [{
              name: 'x',
              uri: getTestResource('')
            }];
            _context3.next = 4;
            return assertLinks('html { background-image: url("~foo/hello.html|")', [{
              offset: 29,
              value: '"~foo/hello.html"',
              target: getTestResource('node_modules/foo/hello.html')
            }], testUri, folders);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('node module subfolder resolving', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            testUri = getTestResource('subdir/about.css');
            folders = [{
              name: 'x',
              uri: getTestResource('')
            }];
            _context4.next = 4;
            return assertLinks('html { background-image: url("~foo/hello.html|")', [{
              offset: 29,
              value: '"~foo/hello.html"',
              target: getTestResource('node_modules/foo/hello.html')
            }], testUri, folders);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
});