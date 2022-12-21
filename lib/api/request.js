"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _elementUi = require("element-ui");
var _auth = require("../utils/auth");
var _errorCode = _interopRequireDefault(require("./errorCode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
_axios.default.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
var service = _axios.default.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '/api/biz',
  // process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 60000
});
// request拦截器
service.interceptors.request.use(function (config) {
  // 是否需要设置 token
  var isToken = (config.headers || {}).isToken === false;
  if ((0, _auth.getToken)() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + (0, _auth.getToken)(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }

  if (config.responseType == 'blob') {
    config.headers['Content-Type'] = 'application/vnd.ms-excel;charset=UTF-8';
  }
  config.headers['from'] = 'PC';
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    var url = config.url + '?';
    for (var _i = 0, _Object$keys = Object.keys(config.params); _i < _Object$keys.length; _i++) {
      var propName = _Object$keys[_i];
      var value = config.params[propName];
      var part = encodeURIComponent(propName) + '=';
      if (value !== null && typeof value !== 'undefined') {
        if (_typeof(value) === 'object') {
          for (var _i2 = 0, _Object$keys2 = Object.keys(value); _i2 < _Object$keys2.length; _i2++) {
            var key = _Object$keys2[_i2];
            var params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + '=';
            url += subPart + encodeURIComponent(value[key]) + '&';
          }
        } else {
          url += part + encodeURIComponent(value) + '&';
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  // console.log(config.data);
  return config;
}, function (error) {
  console.log(error);
  Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(function (res) {
  // 未设置状态码则默认成功状态
  var code = res.data.code || 200;
  // 获取错误信息
  var msg = _errorCode.default[code] || res.data.msg || _errorCode.default['default'];
  if (code === 401) {} else if (code === 500) {
    (0, _elementUi.Message)({
      message: msg,
      type: 'error'
    });
    return Promise.reject(new Error(msg));
  } else if (code === 11004) {
    return res.data;
  } else if (code === 11005) {
    return res.data;
  } else if (code !== 200) {
    (0, _elementUi.Message)({
      message: msg,
      type: 'error'
    });
    return Promise.reject('error');
  } else {
    return res.data;
  }
}, function (error) {
  console.log('err' + error);
  var message = error.message;
  if (message == 'Network Error') {
    message = '后端接口连接异常';
  } else if (message.includes('timeout')) {
    message = '系统接口请求超时';
  } else if (message.includes('Request failed with status code')) {
    message = '系统接口' + message.substr(message.length - 3) + '异常';
  }
  (0, _elementUi.Message)({
    message: message,
    type: 'error',
    duration: 5 * 1000
  });
  return Promise.reject(error);
});
var _default = service;
exports.default = _default;