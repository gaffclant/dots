"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var node_1 = require("vscode-languageserver/node");

var server_1 = require("../server"); // Create a connection for the server.


var connection = (0, node_1.createConnection)();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
process.on('unhandledRejection', function (e) {
  connection.console.error("Unhandled exception ".concat(e));
});
(0, server_1.startVsCodeServer)(connection);