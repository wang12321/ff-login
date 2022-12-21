"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reqCheck = reqCheck;
exports.reqGet = reqGet;
var _axios = _interopRequireDefault(require("../utils/axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

// 组件内部封装的axios
// import request from "@/api/axios.js"       //调用项目封装的axios

// 获取验证图片  以及token
function reqGet(data) {
  return (0, _axios.default)({
    url: '/api/biz/lc/captcha/load',
    method: 'post',
    data: data
  });
}

// 滑动或者点选验证
function reqCheck(data) {
  return (0, _axios.default)({
    url: '/api/biz/lc/captcha/check',
    method: 'post',
    data: data
  });
}