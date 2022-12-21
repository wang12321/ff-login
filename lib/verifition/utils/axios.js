"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// axios.defaults.baseURL = process.env.BASE_API

var service = _axios.default.create({
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  }
});
service.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  Promise.reject(error);
});

// response interceptor
service.interceptors.response.use(function (response) {
  var res = response.data;
  return res;
}, function (error) {});
var _default = service;
exports.default = _default;