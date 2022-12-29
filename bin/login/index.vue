<template>
  <div class="login">
    <div class="login-wrap">
      <div class="header-wrap">
        <div class="header">
          <img src="../image/logo.png" alt="" srcset="">
        </div>
      </div>
      <div class="content-wrap">
        <div class="content">
          <div class="c-left">
            <img src="../image/leftbg.png" alt="" srcset="">
          </div>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="企业微信登录" name="first">
                <div class="qw-top">
                  <span class="type-one">请使用</span>
                  <img src="../image/qwicon.png" alt="">
                  <span class="type-two">iWork</span>
                  <span class="type-one">扫描二维码登录</span>
                </div>
                <div class="wxlogin">
                  <div id="wx_reg" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="账号密码登录" name="second">
                <div v-show="!showVerify" class="">
                  <h3 class="title">JMC账号登录</h3>
                  <el-form-item prop="username" class="input">
                    <el-input id="username-auto" v-model="loginForm.username" type="text" auto-complete="off"
                              placeholder="账号(账号是手机号或者完整邮箱)" size="medium"
                    >
                      <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password" class="input">
                    <el-input id="pw-auto" v-model="loginForm.password" type="password" auto-complete="off"
                              placeholder="密码" size="large" @keyup.enter.native="useVerify"
                    >
                      <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                  </el-form-item>
                  <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 40px">记住密码</el-checkbox>
                  <el-form-item style="width: 100%">
                    <el-button id="login-auto" :loading="loading" size="medium" type="primary" class="login-button"
                               @click.native.prevent="useVerify"
                    >
                      <span v-if="!loading">登 录</span>
                      <span v-else>登 录 中...</span>
                    </el-button>
                  </el-form-item>
                </div>
                <div v-show="showVerify" class="verify-wrap">
                  <div class="v-herder">
                    <div class="v-h-left" @click="showVerify = false">
                      <img src="../image/left.png" alt="">
                      <span>返回</span>
                    </div>
                    <div class="v-h-center">安全验证</div>
                    <div class="v-h-right" @click="reflash()">
                      <img src="../image/reflash.png" alt="">
                      <span>刷新</span>
                    </div>
                  </div>
                  <Verify ref="verify" mode="" captcha-type="blockPuzzle"
                          :img-size="{ width: '330px', height: '155px' }" @success="success"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPublicKey, wxloginconfig } from '../api/login'
import { loginApi } from '../login-data'

import Cookies from 'js-cookie'
import { encrypt, decrypt } from '../utils/jsencrypt'
import { Message } from 'element-ui'
import Verify from '../verifition/Verify'
export default {
  name: 'Login',
  props:{
    env:{
      type: String,
      default: 'dev'
    },
    identifier:{
      type: String,
      default: 'bpr'
    }
  },

  components: {
    Verify
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      showVerify: false,
      activeName: 'first',
      captchaVerification: '',
      publicKey: '',
      uid: '',
      isCodeOk: false,
      gtdata: '',
      account: undefined,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          {
            required: true,
            pattern: new RegExp(
                '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}'
            ),
            message: '密码长度为8-16个字符，需包含字母，数字及特殊字符',
            trigger: 'blur'
          },
          { min: 8, max: 16, message: '密码长度为8-16个字符' }
        ],
        confirmPassword: [
          {
            required: true,
            pattern: new RegExp(
                '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}'
            ),
            message: '密码长度为8-16个字符，需包含字母，数字及特殊字符',
            trigger: 'blur'
          },
          { min: 8, max: 16, message: '密码长度为8-16个字符' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      },
      iswxlogin: 2,
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    wxloginconfig().then((res) => {
      var temp = res.result
      // eslint-disable-next-line no-undef
      wx.config({
        beta: true,
        debug: true,
        appId: temp.corpid,
        timestamp: temp.timestamp,
        nonceStr: temp.nonceStr,
        signature: temp.signature,
        jsApiList: ['getLocation']
      })
      // eslint-disable-next-line no-undef
      wx.ready(function(res) { })
      // eslint-disable-next-line no-undef
      wx.error(function(res) {
        console.log('失败', res)
      })
    })
    var str = window.location.host
    var temp = 'PC'
    var state = this.identifier
    if (this.env === 'prod') {
      window.WwLogin({
        id: 'wx_reg',
        appid: 'wwb4831091dc524569',
        agentid: '1000112',
        redirect_uri:
            'https%3A%2F%2Fztool.jmc.com.cn%2Fapi%2Fbiz%2Flc%2Fwxlogin%2Flogin%3Fdomain%3D' +
            state,
        state: temp,
        href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDI0MHB4O30NCi5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9DQouaW1wb3dlckJveCAuaW5mb3tkaXNwbGF5OiBub25lO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjQwcHg7fQ0KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lfQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30='
      })
    } else {
      window.WwLogin({
        id: 'wx_reg',
        appid: 'ww15f4c7e6110b0909',
        agentid: '1000002',
        redirect_uri:
            'https%3A%2F%2Fuatztool.jmc.com.cn%2Fapi%2Fbiz%2Flc%2Fwxlogin%2Flogin%3Fdomain%3D' +
            state,
        state: temp,
        href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDI0MHB4O30NCi5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9DQouaW1wb3dlckJveCAuaW5mb3tkaXNwbGF5OiBub25lO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjQwcHg7fQ0KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lfQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30='
      })
    }
    if (this.$route.query && this.$route.query.network === 0) {
      setTimeout(() => {
        Message({
          message: '服务器异常，请重新扫码登录',
          type: 'error'
        })
      }, 1000)
    }
    if (localStorage.getItem('iswxlogin') === 2) {
      this.iswxlogin = 2
      this.activeName = 'first'
    } else {
      this.iswxlogin = 1
      this.activeName = 'second'
    }
  },
  methods: {
    reflash() {
      this.$refs.verify.refresh()
    },
    handleClick(tab, event) {
      if (tab.index === 0) {
        this.iswxlogin = 2
      } else if (tab.index === 1) {
        this.iswxlogin = 1
      } else {
        this.iswxlogin = 1
      }
    },
    success(params) {
      this.captchaVerification = params.captchaVerification
      this.showVerify = false
      this.doLogin()
    },
    useVerify() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$refs.verify.show()
          this.showVerify = true
          this.handleLogin()
        }
      })
    },
    changeLoginType(index) {
      this.iswxlogin = index
      localStorage.setItem('iswxlogin', this.iswxlogin)
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
            password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    doLogin() {
      this.loading = true
      if (this.loginForm.rememberMe) {
        Cookies.set('username', this.loginForm.username, { expires: 30 })
        Cookies.set('password', encrypt(this.loginForm.password), {
          expires: 30
        })
        Cookies.set('rememberMe', this.loginForm.rememberMe, {
          expires: 30
        })
      } else {
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      var encryptor = new this.$JSEncrypt()
      var pubKey =
          '-----BEGIN PUBLIC KEY-----' +
          this.publicKey +
          '-----END PUBLIC KEY-----'
      encryptor.setPublicKey(pubKey)
      // this.$store
      //   .dispatch('Login', )
      //   .then((res) => {
      const data = {
        username: this.loginForm.username,
        password: encryptor.encrypt(this.loginForm.password),
        uid: this.uid,
        captchaVerification: this.captchaVerification
      }
      loginApi(data).then(res => {
        this.loading = false
        if (res.code === 200 && res.result) {
          // Cookies.set('jmc-token', res.result.token)
          this.$emit('onLogin', res.result.token)
        } else {
          this.showVerify = false
        }
      }).catch(() => {
        this.loading = false
        this.showVerify = false
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          getPublicKey().then((res) => {
            this.publicKey = res.result.publicKey
            this.uid = res.result.uid
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
iframe {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 280px !important;
  height: 280px !important;
}

.wxlogin {
  width: 280px;
  height: 280px;
  margin: 0 auto;
  background-image: url("../image/border.png");
  background-size: cover;
}

.button {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 0 20px 0;
  font-size: 14px;
  font-weight: 700;
  color: #3399ea;
  text-align: center;
  cursor: pointer;
}

#wx_reg {
  text-align: center;
}

.verify-wrap {
  width: 330px;
  padding: 15px 30px;
}

.v-herder {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 330px;
  height: 40px;
  margin-bottom: 25px;
  border-radius: 0 0 0 0;
  opacity: 1;

  .v-h-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 52px;
    height: 40px;
    cursor: pointer;
    border-radius: 0 0 0 0;
    opacity: 1;

    img {
      width: 24px;
      height: 24px;
    }

    span {
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-size: 12px;
      font-weight: 400;
      color: #285fee;
    }
  }

  .v-h-center {
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, .65);
  }

  .v-h-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 56px;
    height: 40px;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }

    span {
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, .65);
    }
  }
}

.qw-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 0 20px 0;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: rgba(0, 0, 0, .45);
  text-align: center;

  img {
    width: auto;
    height: 18px;
    padding: 0 4px 0 8px;
  }

  .type-two {
    padding-right: 8px;
    color: #71b2f4;
  }
}

.login {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-image: url("../image/login-background.png");
  background-size: cover;

  .login-wrap {
    width: 100%;
    min-width: 860px;
    height: 100%;
    min-height: 640px;
  }

  .header-wrap {
    width: 100%;
    background: white;
  }

  .header {
    width: calc(100% - 360px);
    min-width: 820px;
    max-width: 1160px;
    height: 40px;
    margin: 0 auto;
    text-align: left;
    background: white;

    img {
      height: 40px;
    }
  }

  .content-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: calc(100% - 40px);
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 763px;
    height: 470px;
    padding-top: 20px;
    background: white;
    border-radius: 16px 16px 16px 16px;
    box-shadow: 0 16px 32px 1px rgba(0, 41, 120, .16);
    opacity: 1;

    .c-left {
      width: 332px;
      height: 430px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .el-tabs__nav {
      width: 100%;
    }

    .el-tabs__item.is-top {
      width: 50%;
      height: 60px;
      padding: 0 40px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-size: 18px;
      font-weight: 400;
      line-height: 60px;
      color: rgba(51, 51, 51, .65);
      text-align: center;
    }

    .el-tabs__item.is-top.is-active {
      color: #333;
    }

    .el-tabs__nav-wrap::after {
      height: 1px;
      color: rgba(0, 0, 0, .16);
    }

    .el-tabs__active-bar {
      background-color: #333;
    }
  }
}

.title {
  padding: 25px 0 24px 0;
  margin: 0 auto;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
  color: #000;
  text-align: center;
}

.input {
  width: 310px;
  height: 48px;
  margin: 0 auto;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
}

.login-form {
  width: 390px;
  padding: 0 0 5px 0;
  background-color: rgba(255, 255, 255, .6);
  border-radius: 6px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    width: 14px;
    height: 39px;
    margin-left: 2px;
  }
}

.login-button {
  width: 310px;
  height: 48px;
  margin-left: 40px;
  background: linear-gradient(90deg, #1e8dff 0%, #2245c4 100%);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
}

.login-tip {
  font-size: 13px;
  color: #bfbfbf;
  text-align: center;
}

.login-code {
  float: right;
  width: 33%;
  height: 38px;

  img {
    vertical-align: middle;
    cursor: pointer;
  }
}

.el-login-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  font-family: Arial;
  font-size: 12px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>
