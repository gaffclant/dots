"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var node_1 = require("vscode-languageserver/node");

var runner_1 = require("../utils/runner");

var cssServer_1 = require("../cssServer");

var nodeFs_1 = require("./nodeFs"); // Create a connection for the server.


var connection = (0, node_1.createConnection)();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
process.on('unhandledRejection', function (e) {
  connection.console.error((0, runner_1.formatError)("Unhandled exception", e));
});
var runtime = {
  timer: {
    setImmediate: function (_setImmediate) {
      function setImmediate(_x) {
        return _setImmediate.apply(this, arguments);
      }

      setImmediate.toString = function () {
        return _setImmediate.toString();
      };

      return setImmediate;
    }(function (callback) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var handle = setImmediate.apply(void 0, [callback].concat(args));
      return {
        dispose: function dispose() {
          return clearImmediate(handle);
        }
      };
    }),
    setTimeout: function (_setTimeout) {
      function setTimeout(_x2, _x3) {
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
  },
  file: (0, nodeFs_1.getNodeFSRequestService)()
};
(0, cssServer_1.startServer)(connection, runtime);