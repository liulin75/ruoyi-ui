<template>
  <div class="login">
    <!-- 左侧背景 -->
    <div class="login-left-view">
      <div class="logo">
        <img src="@/assets/logo/logo.png" alt="logo"></img>
        <h1 class="title">心理测评管理系统</h1>
      </div>

      <div class="left-img">
        <img src="@/assets/images/homepage.png" alt="logo"></img>
      </div>

      <div class="text-wrap">
        <h1> 一款兼具设计美学与高效开发的后台系统 </h1>
        <p> 美观实用的界面，经过视觉优化，确保卓越的用户体验 </p>
      </div>

      <!-- 几何装饰元素 -->
      <div class="geometric-decorations">
        <!-- 基础几何形状 -->
        <div class="geo-element circle-outline animate-fade-in-up" style="animation-delay: 0s"></div>
        <div
          class="geo-element square-rotated animate-fade-in-left"
          style="animation-delay: 0s"
        ></div>
        <div class="geo-element circle-small animate-fade-in-up" style="animation-delay: 0.3s"></div>

        <div
          class="geo-element square-bottom-right animate-fade-in-right"
          style="animation-delay: 0s"
        ></div>

        <!-- 背景泡泡 -->
        <div class="geo-element bg-bubble animate-scale-in" style="animation-delay: 0.5"></div>

        <!-- 太阳/月亮 -->
        <div
          class="geo-element circle-top-right animate-fade-in-down"
          style="animation-delay: 0.5"
        ></div>

        <!-- 装饰点 -->
        <div class="geo-element dot dot-top-left animate-bounce-in" style="animation-delay: 0s"></div>
        <div
          class="geo-element dot dot-top-right animate-bounce-in"
          style="animation-delay: 0s"
        ></div>
        <div
          class="geo-element dot dot-center-right animate-bounce-in"
          style="animation-delay: 0s"
        ></div>

        <!-- 叠加方块组 -->
        <div class="squares-group">
          <i
            class="geo-element square square-blue animate-fade-in-left-rotated-blue"
            style="animation-delay: 0.2s"
          ></i>
          <i
            class="geo-element square square-pink animate-fade-in-left-rotated-pink"
            style="animation-delay: 0.4s"
          ></i>
          <i
            class="geo-element square square-purple animate-fade-in-left-no-rotation"
            style="animation-delay: 0.6s"
          ></i>
        </div>
      </div>
    </div>
    <!-- 右侧表单 -->
     <div class="login-wrap">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="form">
          <h3 class="title1">欢迎回来</h3>
          <p class="sub-title">输入您的账号和密码登录</p>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img"/>
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right;" v-if="register">
              <router-link class="link-type" :to="'/register'">立即注册</router-link>
            </div>
          </el-form-item>
        </el-form>
     </div>
    
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2025 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login"
import Cookies from "js-cookie"
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
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
    this.getCode()
    this.getCookie()
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get("username")
      const password = Cookies.get("password")
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 })
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove("username")
            Cookies.remove("password")
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{})
          }).catch(() => {
            this.loading = false
            if (this.captchaEnabled) {
              this.getCode()
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "@/assets/styles/variables.scss";
// 颜色变量定义
$primary-base:#789cff;
$primary-light-7:#bbcbff;
$primary-light-8:#b5c9ff;
$primary-light-9:#c5d5ff;
$main-bg: #ffffff;

$bg-mix-light-9: rgba($primary-light-9, 0.3);
$bg-mix-light-8: rgba($primary-light-8, 0.3);
$bg-mix-light-7: rgba($primary-light-7, 0.3);
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  //background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  z-index: 1;
  flex: 1;
  margin: auto;
  overflow: hidden;
  border-radius: 5px;
  // opacity: 0;
  // transform: translateX(30px);
  // animation: slideInRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
::v-deep .el-input__prefix{
  left: 20px !important;
}
.login-wrap {
  flex: 1;
  .title1 {
    font-size: 34px;
    font-weight: 600;
    color: var(--art-text-gray-900) !important;
    margin: 0px auto 15px auto;
  }
  .sub-title{
    font-size: 14px;
    color: var(--art-text-gray-500) !important;
    margin-bottom: 10px;
  }
  .form {
    box-sizing: border-box;
    height: 100%;
    padding: 40px 0;
    widows: 100%;
    width: 400px;
    margin: auto;

    .title {
      font-size: 34px;
      font-weight: 600;
      color: var(--art-text-gray-900) !important;
      margin: 0px auto 30px auto;
      text-align: center;
    }

    .input-wrap {
      margin-top: 25px;

      .input-label {
        display: block;
        padding-bottom: 8px;
        font-size: 15px;
        font-weight: 500;
        color: var(--art-text-gray-800);
      }
    }

    .account-select :deep(.el-select__wrapper),
    .el-input,
    .login-btn {
      height: 40px !important;
    }

    .drag-verify {
      position: relative;
      width: 100%;
      padding-bottom: 20px;
      margin-top: 25px;

      .drag-verify-content {
        position: relative;
        z-index: 2;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 8px;
        transition: all 0.3s;

        &.error {
          border-color: #ff4d4f;
        }
      }

      .error-text {
        position: absolute;
        top: 0;
        z-index: 1;
        padding: 0 1px;
        margin-top: 10px;
        font-size: 13px;
        color: #f56c6c;
        transition: all 0.3s;

        &.show-error-text {
          transform: translateY(40px);
        }
      }
    }

    .forget-password {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 14px;
      color: var(--art-text-gray-500);

      a {
        color: var(--main-color);
        text-decoration: none;
      }
    }

    .login-btn {
      width: 100%;
      height: 40px !important;
      color: #fff;
      border: 0;
    }

    .back-btn {
      width: 100%;
      height: 40px !important;
    }

    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: var(--art-text-gray-800);

      a {
        color: var(--main-color);
        text-decoration: none;
      }
    }
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.login-left-view {
    position: relative;
    box-sizing: border-box;
    width: 65vw;
    height: 100%;
    padding: 15px;
    overflow: hidden;
    background-color: rgba($primary-light-7, 0.2);

    .logo {
      position: relative;
      z-index: 100;
      display: flex;
      align-items: center;
      img{
        width: 40px;
        margin-right: 10px;
      }
    }

    .left-img {
      position: absolute;
      inset: 0 0 10.5%;
      z-index: 10;
      width: 300px;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      animation: slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    .text-wrap {
      position: absolute;
      bottom: 80px;
      width: 100%;
      text-align: center;
      animation: slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;

      h1 {
        font-size: 24px;
        font-weight: 400;
        color: var(--art-gray-900) !important;
      }

      p {
        margin-top: 10px;
        font-size: 14px;
        color: var(--art-text-gray-600) !important;
      }
    }

    .geometric-decorations {
      .geo-element {
        position: absolute;
        opacity: 0;
        animation-fill-mode: forwards;
        animation-duration: 0.8s;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      // 动画 mixin
      @mixin fadeAnimation($direction: '', $rotation: 0deg) {
        from {
          opacity: 0;

          @if $direction == 'up' {
            transform: translateY(30px) rotate($rotation);
          } @else if $direction == 'down' {
            transform: translateY(-30px) rotate($rotation);
          } @else if $direction == 'left' {
            transform: translateX(-30px) rotate($rotation);
          } @else if $direction == 'right' {
            transform: translateX(30px) rotate($rotation);
          }
        }

        to {
          opacity: 1;

          @if $direction == 'up' or $direction == 'down' {
            transform: translateY(0) rotate($rotation);
          } @else {
            transform: translateX(0) rotate($rotation);
          }
        }
      }

      // 动画定义
      @keyframes fadeInUp {
        @include fadeAnimation('up');
      }

      @keyframes fadeInDown {
        @include fadeAnimation('down');
      }

      @keyframes fadeInLeft {
        @include fadeAnimation('left');
      }

      @keyframes fadeInLeftRotated {
        @include fadeAnimation('left', -25deg);
      }

      @keyframes fadeInRight {
        @include fadeAnimation('right');
      }

      @keyframes fadeInRightRotated {
        @include fadeAnimation('right', 45deg);
      }

      @keyframes fadeInLeftRotatedBlue {
        @include fadeAnimation('left', -10deg);
      }

      @keyframes fadeInLeftRotatedPink {
        @include fadeAnimation('left', 10deg);
      }

      @keyframes fadeInLeftNoRotation {
        @include fadeAnimation('left');
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }

        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }

        50% {
          opacity: 1;
          transform: scale(1.05);
        }

        70% {
          transform: scale(0.9);
        }

        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes lineGrow {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }

        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      // 动画类
      .animate-fade-in-up {
        animation-name: fadeInUp;
      }

      .animate-fade-in-down {
        animation-name: fadeInDown;
      }

      .animate-fade-in-left {
        animation-name: fadeInLeft;
      }

      .animate-fade-in-right {
        animation-name: fadeInRight;
      }

      .animate-scale-in {
        animation-name: scaleIn;
        animation-duration: 1.2s;
      }

      .animate-bounce-in {
        animation-name: bounceIn;
        animation-duration: 0.6s;
      }

      .animate-fade-in-left-rotated-blue {
        animation-name: fadeInLeftRotatedBlue;
      }

      .animate-fade-in-left-rotated-pink {
        animation-name: fadeInLeftRotatedPink;
      }

      .animate-fade-in-left-no-rotation {
        animation-name: fadeInLeftNoRotation;
      }

      // 基础几何形状
      .circle-outline {
        top: 10%;
        left: 25%;
        width: 42px;
        height: 42px;
        border: 2px solid $primary-light-8;
        border-radius: 50%;
      }

      .square-rotated {
        top: 50%;
        left: 16%;
        width: 60px;
        height: 60px;
        background-color: $bg-mix-light-8;

        &.animate-fade-in-left {
          animation-name: fadeInLeftRotated;
        }
      }

      .circle-small {
        bottom: 26%;
        left: 30%;
        width: 18px;
        height: 18px;
        background-color: $primary-light-8;
        border-radius: 50%;
      }

      // 太阳/月亮效果
      .circle-top-right {
        top: 3%;
        right: 3%;
        z-index: 100;
        width: 50px;
        height: 50px;
        cursor: pointer;
        background: $bg-mix-light-7;
        border-radius: 50%;
        transition: all 0.3s;

        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          content: '';
          background: linear-gradient(to right, #fcbb04, #fffc00);
          border-radius: 50%;
          opacity: 0;
          transition: all 0.5s;
          transform: translate(-50%, -50%);
        }

        &:hover {
          box-shadow: 0 0 36px #fffc00;

          &::after {
            opacity: 1;
          }
        }
      }

      .square-bottom-right {
        right: 10%;
        bottom: 10%;
        width: 50px;
        height: 50px;
        background-color: $primary-light-8;

        &.animate-fade-in-right {
          animation-name: fadeInRightRotated;
        }
      }

      // 背景泡泡
      .bg-bubble {
        top: -120px;
        right: -120px;
        width: 360px;
        height: 360px;
        background-color: $bg-mix-light-8;
        border-radius: 50%;
      }

      // 装饰点
      .dot {
        width: 14px;
        height: 14px;
        background-color: $primary-light-7;
        border-radius: 50%;

        &.dot-top-left {
          top: 140px;
          left: 100px;
        }

        &.dot-top-right {
          top: 140px;
          right: 120px;
        }

        &.dot-center-right {
          top: 46%;
          right: 22%;
          background-color: $primary-light-8;
        }
      }

      // 叠加方块组
      .squares-group {
        position: absolute;
        bottom: 18px;
        left: 20px;
        width: 140px;
        height: 140px;
        pointer-events: none;

        .square {
          position: absolute;
          display: block;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgb(64 87 167 / 12%);

          &.square-blue {
            top: 12px;
            left: 30px;
            z-index: 2;
            width: 50px;
            height: 50px;
            background-color: rgba($primary-base, 0.3);
          }

          &.square-pink {
            top: 30px;
            left: 48px;
            z-index: 1;
            width: 70px;
            height: 70px;
            background-color: rgba($primary-base, 0.15);
          }

          &.square-purple {
            top: 66px;
            left: 86px;
            z-index: 3;
            width: 32px;
            height: 32px;
            background-color: rgba($primary-base, 0.45);
          }
        }

        // 装饰线条
        &::after {
          position: absolute;
          top: 86px;
          left: 72px;
          width: 80px;
          height: 1px;
          content: '';
          background: linear-gradient(90deg, var(--el-color-primary-light-6), transparent);
          opacity: 0;
          transform: rotate(50deg);
          animation: lineGrow 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          animation-delay: 1.2s;
        }
      }
    }

    @media only screen and (max-width: 1600px) {
      width: 60vw;

      .text-wrap {
        bottom: 40px;
      }
    }

    @media only screen and (max-width: 1180px) {
      width: auto;
      height: auto;
      padding: 0;
      // 隐藏背景和其他内容，只保留 logo
      background: transparent;

      .left-img,
      .text-wrap,
      .geometric-decorations {
        display: none;
      }

      .logo {
        position: fixed;
        top: 15px;
        left: 25px;
        z-index: 1000;
      }
    }
  }

  // 暗色主题
  .dark .login-left-view {
    background-color: color-mix(in srgb, $primary-light-9 60%, #070707);

    @media only screen and (max-width: $device-ipad-pro) {
      background: transparent;
    }

    .geometric-decorations {
      // 月亮效果
      .circle-top-right {
        background-color: $bg-mix-light-8;
        box-shadow: 0 0 25px #333 inset;
        transition: all 0.3s ease-in-out 0.1s;
        rotate: -48deg;

        &::before {
          position: absolute;
          top: 0;
          left: 15px;
          width: 50px;
          height: 50px;
          content: '';
          background-color: $bg-mix-light-9;
          border-radius: 50%;
          transition: all 0.3s ease-in-out;
        }

        &:hover {
          background-color: transparent;
          box-shadow: 0 40px 25px #ddd inset;

          &::before {
            left: 18px;
          }

          &::after {
            opacity: 0;
          }
        }
      }

      .bg-bubble {
        background-color: $bg-mix-light-9;
      }

      // 其他元素颜色调整
      .square-rotated {
        background-color: $bg-mix-light-9;
      }

      .circle-small,
      .dot {
        background-color: $primary-light-8;
      }

      .square-bottom-right {
        background-color: $primary-light-9;
      }

      .dot.dot-top-right {
        background-color: $primary-light-8;
      }
    }

    // 方块组暗色调整
    .squares-group {
      .square {
        box-shadow: none;

        &.square-blue {
          background-color: rgba($primary-base, 0.18);
        }

        &.square-pink {
          background-color: rgba($primary-base, 0.1);
        }

        &.square-purple {
          background-color: rgba($primary-base, 0.2);
        }
      }

      &::after {
        background: linear-gradient(90deg, $primary-light-8, transparent);
      }
    }
  }
</style>
