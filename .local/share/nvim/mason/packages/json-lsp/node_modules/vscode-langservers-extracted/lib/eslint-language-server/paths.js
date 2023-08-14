"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUri = exports.normalizePath = exports.getFileSystemPath = exports.isUNC = exports.normalizeDriveLetter = void 0;

var fs = require("fs");

var vscode_uri_1 = require("vscode-uri");

var Is = require("./is");
/**
 * Special functions to deal with path conversions in the context of ESLint
 */

/**
 * Normalizes the drive letter to upper case which is the default in Node but not in
 * VS Code.
 */


function normalizeDriveLetter(path) {
  if (process.platform !== 'win32' || path.length < 2 || path[1] !== ':') {
    return path;
  }

  return path[0].toUpperCase() + path.substring(1);
}

exports.normalizeDriveLetter = normalizeDriveLetter;
/**
 * Check if the path follows this pattern: `\\hostname\sharename`.
 *
 * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
 * @return A boolean indication if the path is a UNC path, on none-windows
 * always false.
 */

function isUNC(path) {
  if (process.platform !== 'win32') {
    // UNC is a windows concept
    return false;
  }

  if (!path || path.length < 5) {
    // at least \\a\b
    return false;
  }

  var code = path.charCodeAt(0);

  if (code !== 92
  /* CharCode.Backslash */
  ) {
    return false;
  }

  code = path.charCodeAt(1);

  if (code !== 92
  /* CharCode.Backslash */
  ) {
    return false;
  }

  var pos = 2;
  var start = pos;

  for (; pos < path.length; pos++) {
    code = path.charCodeAt(pos);

    if (code === 92
    /* CharCode.Backslash */
    ) {
      break;
    }
  }

  if (start === pos) {
    return false;
  }

  code = path.charCodeAt(pos + 1);

  if (isNaN(code) || code === 92
  /* CharCode.Backslash */
  ) {
    return false;
  }

  return true;
}

exports.isUNC = isUNC;

function getFileSystemPath(uri) {
  var result = uri.fsPath;

  if (process.platform === 'win32' && result.length >= 2 && result[1] === ':') {
    // Node by default uses an upper case drive letter and ESLint uses
    // === to compare paths which results in the equal check failing
    // if the drive letter is lower case in th URI. Ensure upper case.
    result = result[0].toUpperCase() + result.substr(1);
  }

  if (process.platform === 'win32' || process.platform === 'darwin') {
    try {
      var realpath = fs.realpathSync.native(result); // Only use the real path if only the casing has changed.

      if (realpath.toLowerCase() === result.toLowerCase()) {
        result = realpath;
      }
    } catch (_unused) {// Silently ignore errors from `fs.realpathSync` to handle scenarios where
      // the file being linted is not yet written to disk. This occurs in editors
      // such as Neovim for non-written buffers.
    }
  }

  return result;
}

exports.getFileSystemPath = getFileSystemPath;

function normalizePath(path) {
  if (path === undefined) {
    return undefined;
  }

  if (process.platform === 'win32') {
    return path.replace(/\\/g, '/');
  }

  return path;
}

exports.normalizePath = normalizePath;

function getUri(documentOrUri) {
  return Is.string(documentOrUri) ? vscode_uri_1.URI.parse(documentOrUri) : documentOrUri instanceof vscode_uri_1.URI ? documentOrUri : vscode_uri_1.URI.parse(documentOrUri.uri);
}

exports.getUri = getUri;