"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

require("core-js/modules/es.object.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = exports.nullOrUndefined = exports.boolean = void 0;
var toString = Object.prototype.toString;

function boolean(value) {
  return value === true || value === false;
}

exports.boolean = boolean;

function nullOrUndefined(value) {
  return value === null || value === undefined;
}

exports.nullOrUndefined = nullOrUndefined;

function string(value) {
  return toString.call(value) === '[object String]';
}

exports.string = string;