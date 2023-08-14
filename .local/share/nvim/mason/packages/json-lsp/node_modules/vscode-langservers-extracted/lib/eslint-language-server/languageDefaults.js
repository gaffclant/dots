"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var languageId2Config = new Map([['javascript', {
  ext: 'js',
  lineComment: '//',
  blockComment: ['/*', '*/']
}], ['javascriptreact', {
  ext: 'jsx',
  lineComment: '//',
  blockComment: ['/*', '*/']
}], ['typescript', {
  ext: 'ts',
  lineComment: '//',
  blockComment: ['/*', '*/']
}], ['typescriptreact', {
  ext: 'tsx',
  lineComment: '//',
  blockComment: ['/*', '*/']
}], ['html', {
  ext: 'html',
  lineComment: '//',
  blockComment: ['<!--', '-->']
}], ['vue', {
  ext: 'vue',
  lineComment: '//',
  blockComment: ['<!--', '-->']
}], ['coffeescript', {
  ext: 'coffee',
  lineComment: '#',
  blockComment: ['###', '###']
}], ['yaml', {
  ext: 'yaml',
  lineComment: '#',
  blockComment: ['#', '']
}], ['graphql', {
  ext: 'graphql',
  lineComment: '#',
  blockComment: ['#', '']
}]]);
var LanguageDefaults;

(function (LanguageDefaults) {
  function getLineComment(languageId) {
    var _languageId2Config$ge, _languageId2Config$ge2;

    return (_languageId2Config$ge = (_languageId2Config$ge2 = languageId2Config.get(languageId)) === null || _languageId2Config$ge2 === void 0 ? void 0 : _languageId2Config$ge2.lineComment) !== null && _languageId2Config$ge !== void 0 ? _languageId2Config$ge : '//';
  }

  LanguageDefaults.getLineComment = getLineComment;

  function getBlockComment(languageId) {
    var _languageId2Config$ge3, _languageId2Config$ge4;

    return (_languageId2Config$ge3 = (_languageId2Config$ge4 = languageId2Config.get(languageId)) === null || _languageId2Config$ge4 === void 0 ? void 0 : _languageId2Config$ge4.blockComment) !== null && _languageId2Config$ge3 !== void 0 ? _languageId2Config$ge3 : ['/**', '*/'];
  }

  LanguageDefaults.getBlockComment = getBlockComment;

  function getExtension(languageId) {
    var _languageId2Config$ge5;

    return (_languageId2Config$ge5 = languageId2Config.get(languageId)) === null || _languageId2Config$ge5 === void 0 ? void 0 : _languageId2Config$ge5.ext;
  }

  LanguageDefaults.getExtension = getExtension;
})(LanguageDefaults || (LanguageDefaults = {}));

exports.default = LanguageDefaults;