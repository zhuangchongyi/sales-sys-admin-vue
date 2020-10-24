<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">销售管理系统</div>
            <el-form :model="loginForm" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" clearable placeholder="账号">
                        <!-- <el-button slot="prepend" :disabled="true" icon="el-icon-lx-people"></el-button> -->
                        <svg-icon slot="prepend" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="loginForm.password" show-password clearable @keyup.enter.native="submitForm()">
                        <svg-icon slot="prepend" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="loginForm.code" auto-complete="off" clearable placeholder="验证码" style="width: 60%" @keyup.enter.native="submitForm()">
                        <svg-icon slot="prepend" icon-class="validCode" class="el-input__icon input-icon" />
                    </el-input>
                    <div class="login-code">
                        <img :src="codeUrl" @click="getCode" />
                    </div>
                </el-form-item>
                <el-checkbox v-model="loginForm.remember" style="margin:0px 0px 25px 0px; color:#fff">记住密码</el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" :loading="loading" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">
                    <b>
                        Tips :
                        <i> {{ errorMsg }} </i>
                    </b>
                </p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import cookie from 'vue-cookie';
import { getCodeImg } from '@/api/auth';
import { encrypt, decrypt } from '@/utils/jsencrypt';
export default {
    data: function() {
        return {
            loginForm: {
                username: '',
                password: '',
                remember: false,
                code: '',
                uuid: ''
            },
            codeUrl: undefined,
            redirect: undefined,
            errorMsg: '',
            loading: false,
            rules: {
                username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
                code: [{ required: false, message: '请输入登录密码', trigger: 'blur' }]
            }
        };
    },
    watch: {
        $route: {
            handler(route) {
                this.redirect = route.query.redirect;
            },
            immediate: true
        }
    },
    created() {
        this.getCookie();
        this.getCode();
    },
    methods: {
        getCode() {
            getCodeImg().then(res => {
                if (res.success) {
                    this.codeUrl = 'data:image/gif;base64,' + res.data.img;
                    this.loginForm.uuid = res.data.uuid;
                } else {
                    this.msgError(res.message);
                }
            });
        },
        getCookie() {
            const username = cookie.get('username');
            const password = cookie.get('password');
            const remember = cookie.get('remember');
            this.loginForm = {
                username: username == undefined ? this.loginForm.username : username,
                password: password == undefined ? this.loginForm.password : decrypt(password),
                remember: remember == undefined ? false : Boolean(remember)
            };
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.errorMsg = '';
                    if (this.loginForm.remember) {
                        cookie.set('username', this.loginForm.username, { expires: 7 });
                        cookie.set('password', encrypt(this.loginForm.password), { expires: 7 });
                        cookie.set('remember', true, { expires: 7 });
                    } else {
                        cookie.delete('username');
                        cookie.delete('password');
                        cookie.delete('remember');
                    }
                    this.$store
                        .dispatch('Login', this.loginForm)
                        .then(() => {
                            this.$router.push(this.redirect || '/').catch(e => {
                                // this.$router.push({ path: '/' }).catch(e => {
                                console.log('login router', e);
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            this.errorMsg = err.message;
                            this.loading = false;
                            this.getCode();
                        });
                }
            });
        }
    }
};
</script>

<style scoped>
.login-code {
    width: 39%;
    height: 38px;
    float: right;
}
.login-code img {
    cursor: pointer;
    vertical-align: middle;
}
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
.login-tips i {
    color: #f94040;
}
</style>
