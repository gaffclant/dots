"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Limiter = void 0;
/**
 * A helper to queue N promises and run them all with a max degree of parallelism. The helper
 * ensures that at any time no more than M promises are running at the same time.
 *
 * Taken from 'src/vs/base/common/async.ts'
 */

var Limiter = /*#__PURE__*/function () {
  function Limiter(maxDegreeOfParalellism) {
    _classCallCheck(this, Limiter);

    this._size = 0;
    this.maxDegreeOfParalellism = maxDegreeOfParalellism;
    this.outstandingPromises = [];
    this.runningPromises = 0;
  }

  _createClass(Limiter, [{
    key: "size",
    get: function get() {
      return this._size;
    }
  }, {
    key: "queue",
    value: function queue(factory) {
      var _this = this;

      this._size++;
      return new Promise(function (c, e) {
        _this.outstandingPromises.push({
          factory: factory,
          c: c,
          e: e
        });

        _this.consume();
      });
    }
  }, {
    key: "consume",
    value: function consume() {
      var _this2 = this;

      while (this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism) {
        var iLimitedTask = this.outstandingPromises.shift();
        this.runningPromises++;
        var promise = iLimitedTask.factory();
        promise.then(iLimitedTask.c, iLimitedTask.e);
        promise.then(function () {
          return _this2.consumed();
        }, function () {
          return _this2.consumed();
        });
      }
    }
  }, {
    key: "consumed",
    value: function consumed() {
      this._size--;
      this.runningPromises--;

      if (this.outstandingPromises.length > 0) {
        this.consume();
      }
    }
  }]);

  return Limiter;
}();

exports.Limiter = Limiter;