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

var path = require("path");

var vscode_uri_1 = require("vscode-uri");

var vscode_languageserver_types_1 = require("vscode-languageserver-types");

var vscode_css_languageservice_1 = require("vscode-css-languageservice");

var nodeFs_1 = require("../node/nodeFs");

var documentContext_1 = require("../utils/documentContext");

suite('Completions', function () {
  var assertCompletion = function assertCompletion(completions, expected, document, _offset) {
    var matches = completions.items.filter(function (completion) {
      return completion.label === expected.label;
    });
    assert.strictEqual(matches.length, 1, "".concat(expected.label, " should only existing once: Actual: ").concat(completions.items.map(function (c) {
      return c.label;
    }).join(', ')));
    var match = matches[0];

    if (expected.resultText && vscode_languageserver_types_1.TextEdit.is(match.textEdit)) {
      assert.strictEqual(vscode_languageserver_types_1.TextDocument.applyEdits(document, [match.textEdit]), expected.resultText);
    }
  };

  function assertCompletions(_x, _x2, _x3, _x4) {
    return _assertCompletions.apply(this, arguments);
  }

  function _assertCompletions() {
    _assertCompletions = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(value, expected, testUri, workspaceFolders) {
      var lang,
          offset,
          document,
          position,
          lsOptions,
          cssLanguageService,
          context,
          stylesheet,
          list,
          _iterator,
          _step,
          item,
          _args6 = arguments;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              lang = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : 'css';
              offset = value.indexOf('|');
              value = value.substr(0, offset) + value.substr(offset + 1);
              document = vscode_languageserver_types_1.TextDocument.create(testUri, lang, 0, value);
              position = document.positionAt(offset);

              if (!workspaceFolders) {
                workspaceFolders = [{
                  name: 'x',
                  uri: testUri.substr(0, testUri.lastIndexOf('/'))
                }];
              }

              lsOptions = {
                fileSystemProvider: (0, nodeFs_1.getNodeFSRequestService)()
              };
              cssLanguageService = lang === 'scss' ? (0, vscode_css_languageservice_1.getSCSSLanguageService)(lsOptions) : (0, vscode_css_languageservice_1.getCSSLanguageService)(lsOptions);
              context = (0, documentContext_1.getDocumentContext)(testUri, workspaceFolders);
              stylesheet = cssLanguageService.parseStylesheet(document);
              _context6.next = 12;
              return cssLanguageService.doComplete2(document, position, stylesheet, context);

            case 12:
              list = _context6.sent;

              if (expected.count) {
                assert.strictEqual(list.items.length, expected.count);
              }

              if (expected.items) {
                _iterator = _createForOfIteratorHelper(expected.items);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    item = _step.value;
                    assertCompletion(list, item, document, offset);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
              }

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _assertCompletions.apply(this, arguments);
  }

  test('CSS url() Path completion', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            testUri = vscode_uri_1.URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
            folders = [{
              name: 'x',
              uri: vscode_uri_1.URI.file(path.resolve(__dirname, '../../test')).toString(true)
            }];
            _context.next = 4;
            return assertCompletions('html { background-image: url("./|")', {
              items: [{
                label: 'about.html',
                resultText: 'html { background-image: url("./about.html")'
              }]
            }, testUri, folders);

          case 4:
            _context.next = 6;
            return assertCompletions("html { background-image: url('../|')", {
              items: [{
                label: 'about/',
                resultText: "html { background-image: url('../about/')"
              }, {
                label: 'index.html',
                resultText: "html { background-image: url('../index.html')"
              }, {
                label: 'src/',
                resultText: "html { background-image: url('../src/')"
              }]
            }, testUri, folders);

          case 6:
            _context.next = 8;
            return assertCompletions("html { background-image: url('../src/a|')", {
              items: [{
                label: 'feature.js',
                resultText: "html { background-image: url('../src/feature.js')"
              }, {
                label: 'data/',
                resultText: "html { background-image: url('../src/data/')"
              }, {
                label: 'test.js',
                resultText: "html { background-image: url('../src/test.js')"
              }]
            }, testUri, folders);

          case 8:
            _context.next = 10;
            return assertCompletions("html { background-image: url('../src/data/f|.asar')", {
              items: [{
                label: 'foo.asar',
                resultText: "html { background-image: url('../src/data/foo.asar')"
              }]
            }, testUri, folders);

          case 10:
            _context.next = 12;
            return assertCompletions("html { background-image: url('|')", {
              items: [{
                label: 'about.html',
                resultText: "html { background-image: url('about.html')"
              }]
            }, testUri, folders);

          case 12:
            _context.next = 14;
            return assertCompletions("html { background-image: url('/|')", {
              items: [{
                label: 'pathCompletionFixtures/',
                resultText: "html { background-image: url('/pathCompletionFixtures/')"
              }]
            }, testUri, folders);

          case 14:
            _context.next = 16;
            return assertCompletions("html { background-image: url('/pathCompletionFixtures/|')", {
              items: [{
                label: 'about/',
                resultText: "html { background-image: url('/pathCompletionFixtures/about/')"
              }, {
                label: 'index.html',
                resultText: "html { background-image: url('/pathCompletionFixtures/index.html')"
              }, {
                label: 'src/',
                resultText: "html { background-image: url('/pathCompletionFixtures/src/')"
              }]
            }, testUri, folders);

          case 16:
            _context.next = 18;
            return assertCompletions("html { background-image: url(\"/|\")", {
              items: [{
                label: 'pathCompletionFixtures/',
                resultText: "html { background-image: url(\"/pathCompletionFixtures/\")"
              }]
            }, testUri, folders);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('CSS url() Path Completion - Unquoted url', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            testUri = vscode_uri_1.URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
            folders = [{
              name: 'x',
              uri: vscode_uri_1.URI.file(path.resolve(__dirname, '../../test')).toString(true)
            }];
            _context2.next = 4;
            return assertCompletions('html { background-image: url(./|)', {
              items: [{
                label: 'about.html',
                resultText: 'html { background-image: url(./about.html)'
              }]
            }, testUri, folders);

          case 4:
            _context2.next = 6;
            return assertCompletions('html { background-image: url(./a|)', {
              items: [{
                label: 'about.html',
                resultText: 'html { background-image: url(./about.html)'
              }]
            }, testUri, folders);

          case 6:
            _context2.next = 8;
            return assertCompletions('html { background-image: url(../|src/)', {
              items: [{
                label: 'about/',
                resultText: 'html { background-image: url(../about/)'
              }]
            }, testUri, folders);

          case 8:
            _context2.next = 10;
            return assertCompletions('html { background-image: url(../s|rc/)', {
              items: [{
                label: 'about/',
                resultText: 'html { background-image: url(../about/)'
              }]
            }, testUri, folders);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('CSS @import Path completion', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            testUri = vscode_uri_1.URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
            folders = [{
              name: 'x',
              uri: vscode_uri_1.URI.file(path.resolve(__dirname, '../../test')).toString(true)
            }];
            _context3.next = 4;
            return assertCompletions("@import './|'", {
              items: [{
                label: 'about.html',
                resultText: "@import './about.html'"
              }]
            }, testUri, folders);

          case 4:
            _context3.next = 6;
            return assertCompletions("@import '../|'", {
              items: [{
                label: 'about/',
                resultText: "@import '../about/'"
              }, {
                label: 'scss/',
                resultText: "@import '../scss/'"
              }, {
                label: 'index.html',
                resultText: "@import '../index.html'"
              }, {
                label: 'src/',
                resultText: "@import '../src/'"
              }]
            }, testUri, folders);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  /**
   * For SCSS, `@import 'foo';` can be used for importing partial file `_foo.scss`
   */

  test('SCSS @import Path completion', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var testCSSUri, folders, testSCSSUri;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            testCSSUri = vscode_uri_1.URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
            folders = [{
              name: 'x',
              uri: vscode_uri_1.URI.file(path.resolve(__dirname, '../../test')).toString(true)
            }];
            /**
             * We are in a CSS file, so no special treatment for SCSS partial files
            */

            _context4.next = 4;
            return assertCompletions("@import '../scss/|'", {
              items: [{
                label: 'main.scss',
                resultText: "@import '../scss/main.scss'"
              }, {
                label: '_foo.scss',
                resultText: "@import '../scss/_foo.scss'"
              }]
            }, testCSSUri, folders);

          case 4:
            testSCSSUri = vscode_uri_1.URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/scss/main.scss')).toString(true);
            _context4.next = 7;
            return assertCompletions("@import './|'", {
              items: [{
                label: '_foo.scss',
                resultText: "@import './foo'"
              }]
            }, testSCSSUri, folders, 'scss');

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('Completion should ignore files/folders starting with dot', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var testUri, folders;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            testUri = vscode_uri_1.URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
            folders = [{
              name: 'x',
              uri: vscode_uri_1.URI.file(path.resolve(__dirname, '../../test')).toString(true)
            }];
            _context5.next = 4;
            return assertCompletions('html { background-image: url("../|")', {
              count: 4
            }, testUri, folders);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
});