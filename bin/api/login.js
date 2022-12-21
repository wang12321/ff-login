import request from './request'

// 登录方法
export function login(mobile, password, code, uid, captchaVerification) {
  const data = {
    account: mobile,
    password,
    code,
    uid,
    captchaVerification
  }
  return request({
    url: '/lc/auth/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 查询用户列表
export function getUserInfo(query) {
  return request({
    url: '/lc/user/info',
    method: 'post',
    data: query
  })
}

// 登出方法
export function logout() {
  return request({
    url: '/lc/auth/logout',
    method: 'post'
  })
}

// 获取密码加密公钥
export function getPublicKey() {
  return request({
    url: '/lc/auth/publicKey',
    method: 'get'
  })
}
export function wxloginconfig(params) {
  var temp = window.location.href
  temp = temp.split('#')
  return request({
    url: '/lc/wxlogin/config?signUrl=' + temp[0],
    method: 'get'
  })
}
