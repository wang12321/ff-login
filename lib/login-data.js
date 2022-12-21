"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfoApi = getInfoApi;
exports.logOutApi = logOutApi;
exports.loginApi = loginApi;
var _login = require("./api/login");
var _auth = require("./utils/auth");
// 登录

function loginApi(userInfo) {
  var username = userInfo.username.trim();
  // const password = md5(userInfo.password)
  var password = userInfo.password;
  var code = userInfo.code;
  var uuid = userInfo.uid;
  var captchaVerification = userInfo.captchaVerification;
  return new Promise(function (resolve, reject) {
    (0, _login.login)(username, password, code, uuid, captchaVerification).then(function (res) {
      if (res.code === 200 && res.result) {
        // Cookies.set('jmc-token', res.result.token)
        (0, _auth.setToken)(res.result.token);
      }
      resolve(res);
    }).catch(function (error) {
      reject(error);
    });
  });
}

// 获取用户信息
function getInfoApi() {
  return new Promise(function (resolve, reject) {
    (0, _login.getUserInfo)().then(function (res) {
      resolve(res);
    }).catch(function (error) {
      reject(error);
    });
  });
}

// 退出系统
function logOutApi() {
  return new Promise(function (resolve, reject) {
    (0, _auth.removeToken)();
    resolve();
  });
}