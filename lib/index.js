"use strict";

var _vue = _interopRequireDefault(require("vue"));
var _index = _interopRequireDefault(require("./login/index"));
var _jsencrypt = _interopRequireDefault(require("jsencrypt"));
var _loginData = require("./login-data");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 引入

// 注册为全局组件
_vue.default.component('jwcLogin', _index.default);
_vue.default.config.productionTip = false;
_vue.default.prototype.$JSEncrypt = _jsencrypt.default;
_vue.default.prototype.$getInfo = _loginData.getInfoApi;
_vue.default.prototype.$logOut = _loginData.logOutApi;