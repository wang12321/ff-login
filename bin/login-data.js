// 登录
import { login, getUserInfo } from './api/login'
import { setToken, removeToken } from './utils/auth'

export function loginApi(userInfo) {
  const username = userInfo.username.trim()
  // const password = md5(userInfo.password)
  const password = userInfo.password
  const code = userInfo.code
  const uuid = userInfo.uid
  const captchaVerification = userInfo.captchaVerification
  return new Promise((resolve, reject) => {
    login(username, password, code, uuid, captchaVerification).then(res => {
      if (res.code === 200 && res.result) {
        // Cookies.set('jmc-token', res.result.token)
        setToken(res.result.token)
      }
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

// 获取用户信息
export function getInfoApi() {
  return new Promise((resolve, reject) => {
    getUserInfo().then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

// 退出系统
export function logOutApi() {
  return new Promise((resolve, reject) => {
    removeToken()
    resolve()
  })
}
