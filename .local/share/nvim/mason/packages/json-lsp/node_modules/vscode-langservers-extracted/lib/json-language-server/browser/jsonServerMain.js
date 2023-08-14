"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var browser_1 = require("vscode-languageserver/browser");

var jsonServer_1 = require("../jsonServer");

var messageReader = new browser_1.BrowserMessageReader(self);
var messageWriter = new browser_1.BrowserMessageWriter(self);
var connection = (0, browser_1.createConnection)(messageReader, messageWriter);
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
var runtime = {
  timer: {
    setImmediate: function setImmediate(callback) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var handle = setTimeout.apply(void 0, [callback, 0].concat(args));
      return {
        dispose: function dispose() {
          return clearTimeout(handle);
        }
      };
    },
    setTimeout: function (_setTimeout) {
      function setTimeout(_x, _x2) {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function (callback, ms) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      var handle = setTimeout.apply(void 0, [callback, ms].concat(args));
      return {
        dispose: function dispose() {
          return clearTimeout(handle);
        }
      };
    })
  }
};
(0, jsonServer_1.startServer)(connection, runtime);