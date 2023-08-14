"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var assert = require("assert");

var documentContext_1 = require("../utils/documentContext");

suite('HTML Document Context', function () {
  test('Context', function () {
    var docURI = 'file:///users/test/folder/test.html';
    var rootFolders = [{
      name: '',
      uri: 'file:///users/test/'
    }];
    var context = (0, documentContext_1.getDocumentContext)(docURI, rootFolders);
    assert.strictEqual(context.resolveReference('/', docURI), 'file:///users/test/');
    assert.strictEqual(context.resolveReference('/message.html', docURI), 'file:///users/test/message.html');
    assert.strictEqual(context.resolveReference('message.html', docURI), 'file:///users/test/folder/message.html');
    assert.strictEqual(context.resolveReference('message.html', 'file:///users/test/'), 'file:///users/test/message.html');
  });
});