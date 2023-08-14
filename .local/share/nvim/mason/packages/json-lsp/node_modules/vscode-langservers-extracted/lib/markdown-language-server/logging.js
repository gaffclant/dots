"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.reflect.construct.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.string.pad-start.js");

require("core-js/modules/es.object.get-prototype-of.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogFunctionLogger = void 0;

var md = require("vscode-markdown-languageservice");

var dispose_1 = require("./util/dispose");

var LogFunctionLogger = /*#__PURE__*/function (_dispose_1$Disposable) {
  _inherits(LogFunctionLogger, _dispose_1$Disposable);

  var _super = _createSuper(LogFunctionLogger);

  function LogFunctionLogger(_logFn, _config) {
    var _this;

    _classCallCheck(this, LogFunctionLogger);

    _this = _super.call(this);
    _this._logFn = _logFn;
    _this._config = _config;

    _this._register(_this._config.onDidChangeConfiguration(function () {
      _this._logLevel = LogFunctionLogger.readLogLevel(_this._config);
    }));

    _this._logLevel = LogFunctionLogger.readLogLevel(_this._config);
    return _this;
  }

  _createClass(LogFunctionLogger, [{
    key: "level",
    get: function get() {
      return this._logLevel;
    }
  }, {
    key: "log",
    value: function log(level, message, data) {
      if (this.level < level) {
        return;
      }

      this.appendLine("[".concat(this.toLevelLabel(level), " ").concat(LogFunctionLogger.now(), "] ").concat(message));

      if (data) {
        this.appendLine(LogFunctionLogger.data2String(data));
      }
    }
  }, {
    key: "toLevelLabel",
    value: function toLevelLabel(level) {
      switch (level) {
        case md.LogLevel.Off:
          return 'Off';

        case md.LogLevel.Debug:
          return 'Debug';

        case md.LogLevel.Trace:
          return 'Trace';
      }
    }
  }, {
    key: "appendLine",
    value: function appendLine(value) {
      this._logFn(value);
    }
  }], [{
    key: "now",
    value: function now() {
      var now = new Date();
      return String(now.getUTCHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getUTCSeconds()).padStart(2, '0') + '.' + String(now.getMilliseconds()).padStart(3, '0');
    }
  }, {
    key: "data2String",
    value: function data2String(data) {
      if (data instanceof Error) {
        if (typeof data.stack === 'string') {
          return data.stack;
        }

        return data.message;
      }

      if (typeof data === 'string') {
        return data;
      }

      return JSON.stringify(data, undefined, 2);
    }
  }, {
    key: "readLogLevel",
    value: function readLogLevel(config) {
      var _config$getSettings;

      switch ((_config$getSettings = config.getSettings()) === null || _config$getSettings === void 0 ? void 0 : _config$getSettings.markdown.server.log) {
        case 'trace':
          return md.LogLevel.Trace;

        case 'debug':
          return md.LogLevel.Debug;

        case 'off':
        default:
          return md.LogLevel.Off;
      }
    }
  }]);

  return LogFunctionLogger;
}(dispose_1.Disposable);

exports.LogFunctionLogger = LogFunctionLogger;