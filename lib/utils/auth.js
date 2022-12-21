"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToken = getToken;
exports.removeToken = removeToken;
exports.setToken = setToken;
var _jsCookie = _interopRequireDefault(require("js-cookie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var TokenKey = 'jmc-token';
function getToken() {
  return _jsCookie.default.get(TokenKey);
}
function setToken(token) {
  return _jsCookie.default.set(TokenKey, token);
}
function removeToken() {
  return _jsCookie.default.remove(TokenKey);
}