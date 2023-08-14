"use strict";

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.flags.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.concat.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var assert = require("assert");

var words = require("../utils/strings");

var fs = require("fs");

var path = require("path");

suite('HTML Language Configuration', function () {
  var config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../html/language-configuration.json')).toString());

  function createRegex(str) {
    if (typeof str === 'string') {
      return new RegExp(str, 'g');
    }

    return new RegExp(str.pattern, str.flags);
  }

  var wordRegex = createRegex(config.wordPattern);

  function assertWord(value, expected) {
    var offset = value.indexOf('|');
    value = value.substr(0, offset) + value.substring(offset + 1);
    var actualRange = words.getWordAtText(value, offset, wordRegex);
    assert(actualRange.start <= offset);
    assert(actualRange.start + actualRange.length >= offset);
    assert.strictEqual(value.substr(actualRange.start, actualRange.length), expected);
  }

  test('Words Basic', function () {
    assertWord('|var x1 = new F<A>(a, b);', 'var');
    assertWord('v|ar x1 = new F<A>(a, b);', 'var');
    assertWord('var| x1 = new F<A>(a, b);', 'var');
    assertWord('var |x1 = new F<A>(a, b);', 'x1');
    assertWord('var x1| = new F<A>(a, b);', 'x1');
    assertWord('var x1 = new |F<A>(a, b);', 'F');
    assertWord('var x1 = new F<|A>(a, b);', 'A');
    assertWord('var x1 = new F<A>(|a, b);', 'a');
    assertWord('var x1 = new F<A>(a, b|);', 'b');
    assertWord('var x1 = new F<A>(a, b)|;', '');
    assertWord('var x1 = new F<A>(a, b)|;|', '');
    assertWord('var x1 = |  new F<A>(a, b)|;|', '');
  });
  test('Words Multiline', function () {
    assertWord('console.log("hello");\n|var x1 = new F<A>(a, b);', 'var');
    assertWord('console.log("hello");\n|\nvar x1 = new F<A>(a, b);', '');
    assertWord('console.log("hello");\n\r |var x1 = new F<A>(a, b);', 'var');
  });
  var onEnterBeforeRules = config.onEnterRules.map(function (r) {
    return createRegex(r.beforeText);
  });

  function assertBeforeRule(text, expectedMatch) {
    var _iterator = _createForOfIteratorHelper(onEnterBeforeRules),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var reg = _step.value;
        var start = new Date().getTime();
        assert.strictEqual(reg.test(text), expectedMatch);
        var totalTime = new Date().getTime() - start;
        assert.ok(totalTime < 200, "Evaluation of ".concat(reg.source, " on ").concat(text, " took ").concat(totalTime, "ms]"));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  test('OnEnter Before', function () {
    assertBeforeRule('<button attr1=val1 attr2=val2', false);
    assertBeforeRule('<button attr1=val1 attr2=val2>', true);
    assertBeforeRule('<button attr1=\'val1\' attr2="val2">', true);
    assertBeforeRule('<button attr1=val1 attr2=val2></button>', false);
  });
});