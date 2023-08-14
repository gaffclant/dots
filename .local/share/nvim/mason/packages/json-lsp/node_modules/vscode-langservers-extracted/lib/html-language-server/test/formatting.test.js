"use strict";

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.promise.js");

require("regenerator-runtime/runtime.js");

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

var path = require("path");

var fs = require("fs");

var assert = require("assert");

var languageModes_1 = require("../modes/languageModes");

var formatting_1 = require("../modes/formatting");

var nodeFs_1 = require("../node/nodeFs");

suite('HTML Embedded Formatting', function () {
  function assertFormat(_x, _x2, _x3, _x4, _x5) {
    return _assertFormat.apply(this, arguments);
  }

  function _assertFormat() {
    _assertFormat = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(value, expected, options, formatOptions, message) {
      var workspace, languageModes, rangeStartOffset, rangeEndOffset, document, range, result, actual;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              workspace = {
                settings: options,
                folders: [{
                  name: 'foo',
                  uri: 'test://foo'
                }]
              };
              languageModes = (0, languageModes_1.getLanguageModes)({
                css: true,
                javascript: true
              }, workspace, languageModes_1.ClientCapabilities.LATEST, (0, nodeFs_1.getNodeFileFS)());
              rangeStartOffset = value.indexOf('|');

              if (rangeStartOffset !== -1) {
                value = value.substr(0, rangeStartOffset) + value.substr(rangeStartOffset + 1);
                rangeEndOffset = value.indexOf('|');
                value = value.substr(0, rangeEndOffset) + value.substr(rangeEndOffset + 1);
              } else {
                rangeStartOffset = 0;
                rangeEndOffset = value.length;
              }

              document = languageModes_1.TextDocument.create('test://test/test.html', 'html', 0, value);
              range = languageModes_1.Range.create(document.positionAt(rangeStartOffset), document.positionAt(rangeEndOffset));

              if (!formatOptions) {
                formatOptions = languageModes_1.FormattingOptions.create(2, true);
              }

              _context13.next = 9;
              return (0, formatting_1.format)(languageModes, document, range, formatOptions, undefined, {
                css: true,
                javascript: true
              });

            case 9:
              result = _context13.sent;
              actual = languageModes_1.TextDocument.applyEdits(document, result);
              assert.strictEqual(actual, expected, message);

            case 12:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));
    return _assertFormat.apply(this, arguments);
  }

  function assertFormatWithFixture(_x6, _x7, _x8, _x9) {
    return _assertFormatWithFixture.apply(this, arguments);
  }

  function _assertFormatWithFixture() {
    _assertFormatWithFixture = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(fixtureName, expectedPath, options, formatOptions) {
      var input, expected;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              input = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'test', 'fixtures', 'inputs', fixtureName)).toString().replace(/\r\n/mg, '\n');
              expected = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'test', 'fixtures', 'expected', expectedPath)).toString().replace(/\r\n/mg, '\n');
              _context14.next = 4;
              return assertFormat(input, expected, options, formatOptions, expectedPath);

            case 4:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));
    return _assertFormatWithFixture.apply(this, arguments);
  }

  test('HTML only', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return assertFormat('<html><body><p>Hello</p></body></html>', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>');

          case 2:
            _context.next = 4;
            return assertFormat('|<html><body><p>Hello</p></body></html>|', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>');

          case 4:
            _context.next = 6;
            return assertFormat('<html>|<body><p>Hello</p></body>|</html>', '<html><body>\n  <p>Hello</p>\n</body></html>');

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('HTML & Scripts', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return assertFormat('<html><head><script></script></head></html>', '<html>\n\n<head>\n  <script></script>\n</head>\n\n</html>');

          case 2:
            _context2.next = 4;
            return assertFormat('<html><head><script>var x=1;</script></head></html>', '<html>\n\n<head>\n  <script>var x = 1;</script>\n</head>\n\n</html>');

          case 4:
            _context2.next = 6;
            return assertFormat('<html><head><script>\nvar x=2;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 2;\n  </script>\n</head>\n\n</html>');

          case 6:
            _context2.next = 8;
            return assertFormat('<html><head>\n  <script>\nvar x=3;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 3;\n  </script>\n</head>\n\n</html>');

          case 8:
            _context2.next = 10;
            return assertFormat('<html><head>\n  <script>\nvar x=4;\nconsole.log("Hi");\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 4;\n    console.log("Hi");\n  </script>\n</head>\n\n</html>');

          case 10:
            _context2.next = 12;
            return assertFormat('<html><head>\n  |<script>\nvar x=5;\n</script>|</head></html>', '<html><head>\n  <script>\n    var x = 5;\n  </script></head></html>');

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('HTLM & Scripts - Fixtures', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            assertFormatWithFixture('19813.html', '19813.html');
            assertFormatWithFixture('19813.html', '19813-4spaces.html', undefined, languageModes_1.FormattingOptions.create(4, true));
            assertFormatWithFixture('19813.html', '19813-tab.html', undefined, languageModes_1.FormattingOptions.create(1, false));
            assertFormatWithFixture('21634.html', '21634.html');

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('Script end tag', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return assertFormat('<html>\n<head>\n  <script>\nvar x  =  0;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 0;\n  </script>\n</head>\n\n</html>');

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('HTML & Multiple Scripts', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return assertFormat('<html><head>\n<script>\nif(x){\nbar(); }\n</script><script>\nfunction(x){    }\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    if (x) {\n      bar();\n    }\n  </script>\n  <script>\n    function(x) { }\n  </script>\n</head>\n\n</html>');

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  test('HTML & Styles', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return assertFormat('<html><head>\n<style>\n.foo{display:none;}\n</style></head></html>', '<html>\n\n<head>\n  <style>\n    .foo {\n      display: none;\n    }\n  </style>\n</head>\n\n</html>');

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test('EndWithNewline', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var options;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            options = languageModes_1.FormattingOptions.create(2, true);
            options.insertFinalNewline = true;
            _context7.next = 4;
            return assertFormat('<html><body><p>Hello</p></body></html>', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>\n', {}, options);

          case 4:
            _context7.next = 6;
            return assertFormat('<html>|<body><p>Hello</p></body>|</html>', '<html><body>\n  <p>Hello</p>\n</body></html>', {}, options);

          case 6:
            _context7.next = 8;
            return assertFormat('<html>|<body><p>Hello</p></body></html>|', '<html><body>\n  <p>Hello</p>\n</body>\n\n</html>\n', {}, options);

          case 8:
            _context7.next = 10;
            return assertFormat('<html><head><script>\nvar x=1;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 1;\n  </script>\n</head>\n\n</html>\n', {}, options);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  test('Inside script', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return assertFormat('<html><head>\n  <script>\n|var x=6;|\n</script></head></html>', '<html><head>\n  <script>\n  var x = 6;\n</script></head></html>');

          case 2:
            _context8.next = 4;
            return assertFormat('<html><head>\n  <script>\n|var x=6;\nvar y=  9;|\n</script></head></html>', '<html><head>\n  <script>\n  var x = 6;\n  var y = 9;\n</script></head></html>');

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  test('Range after new line', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return assertFormat('<html><head>\n  |<script>\nvar x=6;\n</script>\n|</head></html>', '<html><head>\n  <script>\n    var x = 6;\n  </script>\n</head></html>');

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  test('bug 36574', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return assertFormat('<script src="/js/main.js"> </script>', '<script src="/js/main.js"> </script>');

          case 2:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })));
  test('bug 48049', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return assertFormat(['<html>', '<head>', '</head>', '', '<body>', '', '    <script>', '        function f(x) { }', '        f(function () {', '        // ', '', '        console.log(" vsc crashes on formatting")', '        });', '    </script>', '', '', '', '        </body>', '', '</html>'].join('\n'), ['<html>', '', '<head>', '</head>', '', '<body>', '', '  <script>', '    function f(x) { }', '    f(function () {', '      // ', '', '      console.log(" vsc crashes on formatting")', '    });', '  </script>', '', '', '', '</body>', '', '</html>'].join('\n'));

          case 2:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('#58435', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var options, content, expected;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            options = {
              html: {
                format: {
                  contentUnformatted: 'textarea'
                }
              }
            };
            content = ['<html>', '', '<body>', '  <textarea name= "" id ="" cols="30" rows="10">', '  </textarea>', '</body>', '', '</html>'].join('\n');
            expected = ['<html>', '', '<body>', '  <textarea name="" id="" cols="30" rows="10">', '  </textarea>', '</body>', '', '</html>'].join('\n');
            _context12.next = 5;
            return assertFormat(content, expected, options);

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
});
/*
content_unformatted: Array(4)["pre", "code", "textarea", …]
end_with_newline: false
eol: "\n"
extra_liners: Array(3)["head", "body", "/html"]
indent_char: "\t"
indent_handlebars: false
indent_inner_html: false
indent_size: 1
max_preserve_newlines: 32786
preserve_newlines: true
unformatted: Array(1)["wbr"]
wrap_attributes: "auto"
wrap_attributes_indent_size: undefined
wrap_line_length: 120*/