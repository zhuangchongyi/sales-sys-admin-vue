<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">销售管理系统</div>
      <el-form :model="loginForm"
               :rules="rules"
               ref="login"
               label-width="0px"
               class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    clearable
                    placeholder="请输入账号">
            <el-button slot="prepend"
                       :disabled="true"
                       icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    placeholder="请输入密码"
                    v-model="loginForm.password"
                    show-password
                    clearable
                    @keyup.enter.native="submitForm()">
            <el-button slot="prepend"
                       :disabled="true"
                       icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-checkbox v-model="loginForm.remember"
                     style="margin:0px 0px 25px 0px; color:#fff">记住密码</el-checkbox>

        <div class="login-btn">
          <el-button type="primary"
                     :loading="loading"
                     @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips"><b>Tips : <i><span>{{errorMsg}}</span></i></b></p>
      </el-form>
    </div>
  </div>
</template>

<script>
import cookie from 'vue-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
export default {
  data: function () {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false,
        code: "",
        uuid: "",
      },
      redirect: undefined,
      errorMsg: '',
      loading: false,
      rules: {
        username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
      },
    };
  },
  watch: {
    $route: {
      handler (route) {
        this.redirect = route.query.redirect;
      },
      immediate: true
    }
  },
  created () {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    // getCode () {
    //   getCodeImg().then(res => {
    //     this.codeUrl = "data:image/gif;base64," + res.img;
    //     this.loginForm.uuid = res.uuid;
    //   });
    // },
    getCookie () {
      const username = cookie.get("username");
      const password = cookie.get("password");
      const remember = cookie.get('remember');
      console.log("remember", remember)
      this.loginForm = {
        username: username == undefined ? this.loginForm.username : username,
        password: password == undefined ? this.loginForm.password : decrypt(password),
        remember: remember == undefined ? false : Boolean(remember)
      };
    },
    submitForm () {
      this.$refs.login.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.remember) {
            cookie.set("username", this.loginForm.username, { expires: 30 });
            cookie.set("password", encrypt(this.loginForm.password), { expires: 30 });
            cookie.set('remember', true, { expires: 30 });
          } else {
            cookie.delete("username");
            cookie.delete("password");
            cookie.delete('remember');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch((e) => { console.log("login router", e) });
          }).catch(err => {
            console.log(err)
            this.errorMsg = err.message;
            this.loading = false;
            // this.getCode();
          });

        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid rgb(255, 255, 255);
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.login-tips span {
    color: #f56c6c;
}
</style>