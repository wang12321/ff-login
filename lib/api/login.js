"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfo = getInfo;
exports.getPublicKey = getPublicKey;
exports.getUserInfo = getUserInfo;
exports.login = login;
exports.logout = logout;
exports.wxloginconfig = wxloginconfig;
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 登录方法
function login(mobile, password, code, uid, captchaVerification) {
  var data = {
    account: mobile,
    password: password,
    code: code,
    uid: uid,
    captchaVerification: captchaVerification
  };
  return (0, _request.default)({
    url: '/lc/auth/login',
    method: 'post',
    data: data
  });
}

// 获取用户详细信息
function getInfo() {
  return (0, _request.default)({
    url: '/getInfo',
    method: 'get'
  });
}

// 查询用户列表
function getUserInfo(query) {
  return (0, _request.default)({
    url: '/lc/user/info',
    method: 'post',
    data: query
  });
}

// 登出方法
function logout() {
  return (0, _request.default)({
    url: '/lc/auth/logout',
    method: 'post'
  });
}

// 获取密码加密公钥
function getPublicKey() {
  return (0, _request.default)({
    url: '/lc/auth/publicKey',
    method: 'get'
  });
}
function wxloginconfig(params) {
  var temp = window.location.href;
  temp = temp.split('#');
  return (0, _request.default)({
    url: '/lc/wxlogin/config?signUrl=' + temp[0],
    method: 'get'
  });
}