(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**************************************************!*\
  !*** E:/wx小程序/项目程序/广州白云技术学院/广州白云技术学院/pages.json ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23720191024001","_inBundle":false,"_integrity":"sha512-vJEk493Vdb8KueNzR2otzDi23rfyRcQBo/t1R41MwNGPk+AUB94gh10+HVLo98DRcvMzkuVofz3KXTAfEx24iw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23720191024001.tgz","_shasum":"18272814446a9bc6053bc92666ec7064a1767588","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a725c04ef762e5df78a9a69d140c2666e0de05fc","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23720191024001"};

/***/ }),
/* 7 */
/*!*******************************************************************!*\
  !*** E:/wx小程序/项目程序/广州白云技术学院/广州白云技术学院/pages.json?{"type":"style"} ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "广州白云工商技师学院" }, "pages/subhome/subhome": {}, "pages/detailpage/detailpage": {} }, "globalStyle": { "navigationBarTextStyle": "white", "navigationBarTitleText": "广州白云工商技师学院", "navigationStyle": "custom", "navigationBarBackgroundColor": "#B01C11", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),
/* 8 */
/*!******************************************************************!*\
  !*** E:/wx小程序/项目程序/广州白云技术学院/广州白云技术学院/pages.json?{"type":"stat"} ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__EC77A00" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */
/*!************************************************************!*\
  !*** E:/wx小程序/项目程序/广州白云技术学院/广州白云技术学院/pages/store/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 16));
var _request = __webpack_require__(/*! @/pages/utils/request */ 17);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({});var _default =


store;exports.default = _default;

/***/ }),
/* 16 */
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),
/* 17 */
/*!**************************************************************!*\
  !*** E:/wx小程序/项目程序/广州白云技术学院/广州白云技术学院/pages/utils/request.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.get = get;exports.post = post;exports.toLogin = toLogin;exports.openid = openid;exports.memberlogin = memberlogin;exports.getcloud = getcloud;exports.getStorageOpenid = getStorageOpenid;exports.default = exports.host = void 0;
var host = 'https://30.indoormap.com.cn';exports.host = host;



//请求封装
function request(url, method, data) {var header = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  wx.showLoading({
    title: '加载中' //数据请求前loading
  });
  return new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function success(res) {
        wx.hideLoading();
        resolve(res.data);
        //console.log(res)
      },
      fail: function fail(error) {
        wx.hideLoading();
        reject(false);
        //console.log(error)
      },
      complete: function complete() {
        wx.hideLoading();
      } });

  });
}
















function get(url, data) {
  return request(url, 'GET', data);
}
function post(url, data) {
  return request(url, 'POST', data);
}
// 

//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------


function toLogin() {
  var userInfo = wx.getStorageSync('userInfo');
  if (!userInfo) {
    wx.navigateTo({
      url: "/pages/login/main" });

  } else {
    return true;
  }
}

function openid() {
  var openid = wx.getStorageSync('openid');
  if (openid) {
    return openid;
  }
}

function memberlogin() {
  var memberInfo = wx.getStorageSync('memberInfo');
  if (memberInfo) {
    return memberInfo;
  }
}

function getcloud(name, data) {
  wx.showLoading({
    title: '加载中' //数据请求前loading
  });
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: function success(res) {
        wx.hideLoading();
        resolve(res.result);
      },
      fail: function fail(error) {
        wx.hideLoading();
        console.log(error);
        reject(false);

      },
      complete: function complete() {
        wx.hideLoading();
      } });

  });
}

//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------


function getStorageOpenid() {
  var openId = wx.getStorageSync("openId");
  if (openId) {
    return openId;
  } else {
    return '';
  }
}var _default =


{};exports.default = _default;

/***/ }),
/* 18 */
/*!***************************************************!*\
  !*** E:/wx小程序/项目程序/广州白云技术学院/广州白云技术学院/baseinfo.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
//主页banner
var homebanner = [
{
  title: '学校篇',
  id: 0,
  subtitle: '巍巍学府，源远流长',
  url: '/static/homebanner/test1.png',
  address: '/pages/subhome/subhome' },

{
  title: '学校篇',
  id: 1,
  subtitle: '巍巍学府，源远流长',
  url: '/static/homebanner/test1.png',
  address: '/pages/subhome/subhome' },

{
  title: '学校篇',
  id: 2,
  subtitle: '巍巍学府，源远流长',
  url: '/static/homebanner/test1.png',
  address: '/pages/subhome/subhome' },

{
  title: '学校篇',
  id: 3,
  subtitle: '巍巍学府，源远流长',
  url: '/static/homebanner/test1.png',
  address: '/pages/subhome/subhome' },

{
  title: '学校篇',
  id: 4,
  subtitle: '巍巍学府，源远流长',
  url: '/static/homebanner/test1.png',
  address: '/pages/subhome/subhome' },

{
  title: '学校篇',
  id: 5,
  subtitle: '巍巍学府，源远流长',
  url: '/static/homebanner/test1.png',
  address: '/pages/subhome/subhome' }];


//主页头部卡片信息
var homeheader = {
  navbg: 'https://30img.indoormap.com.cn/%E8%83%8C%E6%99%AF@3x.png',
  logo: 'data:image/png;base64,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',
  music: '/static/base/music-btn.png',
  wordleft: 'data:image/png;base64,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',
  wordright: 'data:image/png;base64,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'

  //主页头部title信息
};var hometitle = 'https://img.indoormap.com.cn/%E6%A0%87%E9%A2%98@3x.png';
//主页底部卡片信息
var foot = {
  footbg: 'data:image/png;base64,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',
  foottitle: 'data:image/png;base64,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'

  //二级菜单占位用信息
};var subpage = {
  info: [
  {
    name: '学校篇',
    children: [
    {
      title: '学校篇',
      id: 0,
      subtitle: '巍巍学府，源远流长',
      url: '/static/homebanner/test1.png',
      address: '/pages/detailpage/detailpage' },

    {
      title: '学校篇',
      id: 1,
      subtitle: '巍巍学府，源远流长',
      url: '/static/homebanner/test1.png',
      address: '/pages/detailpage/detailpage' },

    {
      title: '学校篇',
      id: 2,
      subtitle: '巍巍学府，源远流长',
      url: '/static/homebanner/test1.png',
      address: '/pages/detailpage/detailpage' },

    {
      title: '学校篇',
      id: 3,
      subtitle: '巍巍学府，源远流长',
      url: '/static/homebanner/test1.png',
      address: '/pages/detailpage/detailpage' },

    {
      title: '学校篇',
      id: 4,
      subtitle: '巍巍学府，源远流长',
      url: '/static/homebanner/test1.png',
      address: '/pages/detailpage/detailpage' },

    {
      title: '学校篇',
      id: 5,
      subtitle: '巍巍学府，源远流长',
      url: '/static/homebanner/test1.png',
      address: '/pages/detailpage/detailpage' }] }]






  /*
                                                    二级页面的title
                                                    */ };
var subtitle = {
  info: [{ name: '学校篇',
    schooltitle: 'data:image/png;base64,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',
    schoolsubtitle: 'data:image/png;base64,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' },
  { name: '学生篇',
    schooltitle: 'data:image/png;base64,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',
    schoolsubtitle: 'data:image/png;base64,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' }]



  /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    	二级页面foot
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */ };
var subfoot = {
  footbg: 'data:image/png;base64,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',
  foottitle: 'data:image/png;base64,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'

  /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      内容页面icon
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */ };
var detaillogo = {
  detaillogo: 'data:image/png;base64,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'


  /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           内容页面banner
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */ };
var detailbanner = {
  info: [
  {
    articleid: '3301',
    title: '改革开放中诞生',
    url: 'https://30img.indoormap.com.cn/zhumeng.jpeg' }] };var _default =




{
  homebanner: homebanner,
  homeheader: homeheader,
  hometitle: hometitle,
  foot: foot,
  subpage: subpage,
  subtitle: subtitle, //
  subfoot: subfoot, //二级页面页脚
  detaillogo: detaillogo, //内容页logo
  detailbanner: detailbanner };exports.default = _default;

/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 26);


/***/ }),
/* 26 */
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 27);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 27 */
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map