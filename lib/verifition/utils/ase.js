"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aesEncrypt = aesEncrypt;
var _cryptoJs = _interopRequireDefault(require("crypto-js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
function aesEncrypt(word) {
  var keyWord = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'XwKsGlMcdPMEhR1B';
  var key = _cryptoJs.default.enc.Utf8.parse(keyWord);
  var srcs = _cryptoJs.default.enc.Utf8.parse(word);
  var encrypted = _cryptoJs.default.AES.encrypt(srcs, key, {
    mode: _cryptoJs.default.mode.ECB,
    padding: _cryptoJs.default.pad.Pkcs7
  });
  return encrypted.toString();
}