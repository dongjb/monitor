(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('store')) :
  typeof define === 'function' && define.amd ? define(['store'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.monitor = factory(global.store));
}(this, (function (store) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var store__default = /*#__PURE__*/_interopDefaultLegacy(store);

  var rewriteHistory = function (eventName) {
      var originHistoryEvent = window.history[eventName];
      return function () {
          var rsEvt = originHistoryEvent.apply(null, arguments);
          var evt = new Event(eventName.toLocaleLowerCase());
          evt.arguments = arguments;
          window.dispatchEvent(evt);
          return rsEvt;
      };
  };

  var Duration = /** @class */ (function () {
      function Duration(config) {
          this.startTime = new Date().getTime();
          this.hiddenStartTime = this.startTime;
          this.duration = 0;
          this.hiddenDuration = 0;
          this.currURL = window.location.href.split('?')[0];
          this.onPageShow();
          this.onPageHide();
          this.onPageVisibilityChange();
          if ((config === null || config === void 0 ? void 0 : config.mode) === 'multiple') {
              this.initMultiple();
          }
      }
      Duration.prototype.onPageShow = function () {
          var _this = this;
          window.addEventListener('pageshow', function () {
              _this.startTime = new Date().getTime();
          });
      };
      Duration.prototype.onPageHide = function () {
          var _this = this;
          window.addEventListener('pagehide', function () {
              _this.duration = new Date().getTime() - _this.startTime;
              if (_this.duration <= 0)
                  return;
              store__default['default'].set('monitor-duration', _this.duration - _this.hiddenDuration);
          });
      };
      Duration.prototype.onPageVisibilityChange = function () {
          var _this = this;
          document.addEventListener('visibilitychange', function () {
              if (!document.hidden) {
                  var localHidden = store__default['default'].get('monitor-duration-hidden') || 0;
                  _this.hiddenDuration = new Date().getTime() - _this.hiddenStartTime;
                  store__default['default'].set('monitor-duration-hidden', _this.hiddenDuration + localHidden * 1);
              }
              else {
                  _this.hiddenStartTime = new Date().getTime();
              }
          });
      };
      Duration.prototype.initMultiple = function () {
          // 重写history对象中的pushState、replaceState事件
          window.history.pushState = rewriteHistory('pushState');
          window.history.replaceState = rewriteHistory('replaceState');
          this.onPopState();
          this.onPushState();
          this.onReplaceState();
      };
      Duration.prototype.onPopState = function () {
          var _this = this;
          window.addEventListener('popstate', function () {
              _this.setDurationAndURL('popstate');
          });
      };
      Duration.prototype.onPushState = function () {
          var _this = this;
          window.addEventListener('pushstate', function () {
              _this.setDurationAndURL('pushstate');
          });
      };
      Duration.prototype.onReplaceState = function () {
          var _this = this;
          window.addEventListener('replacestate', function () {
              _this.setDurationAndURL('replacestate');
          });
      };
      Duration.prototype.setDurationAndURL = function (type) {
          var t = new Date().getTime() - this.startTime - this.hiddenDuration;
          this.startTime = new Date().getTime();
          console.log("\u89E6\u53D1\u4E8B\u4EF6\uFF1A%c" + type, 'background: #606060; color: white; padding: 1px 10px; border-radius: 3px;');
          console.log("\u505C\u7559\u5728\uFF1A%c" + this.currURL, 'font-size: 18px;', "\uFF0C\u9875\u9762\u65F6\u957F\uFF1A" + t);
          store__default['default'].remove('monitor-duration-hidden');
          this.hiddenDuration = 0;
          this.currURL = window.location.href.split('?')[0];
      };
      return Duration;
  }());

  return Duration;

})));
