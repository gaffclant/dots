"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var browser_1 = require("vscode-languageserver/browser");

var server_1 = require("../server");

var messageReader = new browser_1.BrowserMessageReader(self);
var messageWriter = new browser_1.BrowserMessageWriter(self);
var connection = (0, browser_1.createConnection)(messageReader, messageWriter);
(0, server_1.startVsCodeServer)(connection);