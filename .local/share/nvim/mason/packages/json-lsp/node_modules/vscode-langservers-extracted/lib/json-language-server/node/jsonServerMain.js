"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var node_1 = require("vscode-languageserver/node");

var runner_1 = require("../utils/runner");

var jsonServer_1 = require("../jsonServer");

var request_light_1 = require("request-light");

var vscode_uri_1 = require("vscode-uri");

var fs = require("fs"); // Create a connection for the server.


var connection = (0, node_1.createConnection)();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
process.on('unhandledRejection', function (e) {
  connection.console.error((0, runner_1.formatError)("Unhandled exception", e));
});

function getHTTPRequestService() {
  return {
    getContent: function getContent(uri, _encoding) {
      var headers = {
        'Accept-Encoding': 'gzip, deflate'
      };
      return (0, request_light_1.xhr)({
        url: uri,
        followRedirects: 5,
        headers: headers
      }).then(function (response) {
        return response.responseText;
      }, function (error) {
        return Promise.reject(error.responseText || (0, request_light_1.getErrorStatusDescription)(error.status) || error.toString());
      });
    }
  };
}

function getFileRequestService() {
  return {
    getContent: function getContent(location, encoding) {
      return new Promise(function (c, e) {
        var uri = vscode_uri_1.URI.parse(location);
        fs.readFile(uri.fsPath, encoding, function (err, buf) {
          if (err) {
            return e(err);
          }

          c(buf.toString());
        });
      });
    }
  };
}

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
  file: getFileRequestService(),
  http: getHTTPRequestService(),
  configureHttpRequests: request_light_1.configure
};
(0, jsonServer_1.startServer)(connection, runtime);