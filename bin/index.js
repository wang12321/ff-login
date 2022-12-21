import Vue from 'vue'
// 引入
import jwcLogin from './login/index'
import JSEncrypt from 'jsencrypt'
import { getInfoApi, logOutApi } from './login-data'

// 注册为全局组件
Vue.component('jwcLogin', jwcLogin)

Vue.config.productionTip = false
Vue.prototype.$JSEncrypt = JSEncrypt
Vue.prototype.$getInfo = getInfoApi
Vue.prototype.$logOut = logOutApi
