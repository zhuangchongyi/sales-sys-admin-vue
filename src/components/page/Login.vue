<template>
    <div class="login-wrap">
        <!--引入粒子特效 https://blog.csdn.net/Fly_1213/article/details/105798197-->
        <vue-particles
            color="#fff"
            :particleOpacity="0.7"
            :particlesNumber="60"
            shapeType="circle"
            :particleSize="4"
            linesColor="#fff"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="2"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
        >
        </vue-particles>

        <div class="ms-login">
            <div class="ms-title">{{ $t('login.title') }}</div>
            <el-form :model="loginForm" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" clearable :placeholder="$t('login.username')" :readonly="loading">
                        <!-- <el-button slot="prepend" :disabled="true" icon="el-icon-lx-people"></el-button> -->
                        <svg-icon slot="prepend" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" :placeholder="$t('login.password')" v-model="loginForm.password" show-password clearable :readonly="loading">
                        <svg-icon slot="prepend" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="loginForm.code" auto-complete="off" clearable :placeholder="$t('login.code')" style="width: 60%" :readonly="loading">
                        <svg-icon slot="prepend" icon-class="validCode" class="el-input__icon input-icon" />
                    </el-input>
                    <div class="login-code">
                        <img :src="codeUrl" @click="getCode" />
                    </div>
                </el-form-item>
                <el-checkbox v-model="loginForm.remember" style="margin:0px 0px 25px 0px; color:#fff">{{ $t('login.rememberMeHint') }}</el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" size="small" round :loading="loading" @click="submitForm()">{{ $t('login.loginBtn') }}</el-button>
                </div>
                <p class="login-tips">
                    {{ errorMsg }}
                </p>
            </el-form>
        </div>
    </div>
</template>

<script>
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
            errorMsg: this.$t('login.welcome'),
            loading: false,
            rules: {
                username: [{ required: true, message: this.$t('login.usernameHint'), trigger: 'blur' }],
                password: [{ required: true, message: this.$t('login.passwordHint'), trigger: 'blur' }],
                code: [{ required: false, message: this.$t('login.codeHint'), trigger: 'blur' }]
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
    mounted() {
        // 绑定enter事件
        this.enterKeyup();
    },
    destroyed() {
        // 销毁enter事件
        this.enterKeyupDestroyed();
    },
    methods: {
        enterKeyupDestroyed() {
            document.removeEventListener('keyup', this.enterKey);
        },
        enterKeyup() {
            document.addEventListener('keyup', this.enterKey);
        },
        // 监听页面回车事件
        enterKey(event) {
            const code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
            if (!this.loading && code == 13) {
                this.submitForm();
            }
        },
        getCode() {
            getCodeImg().then(res => {
                if (res.success) {
                    this.codeUrl = 'data:image/gif;base64,' + res.data.img;
                    this.loginForm.uuid = res.data.uuid;
                    this.rules.code[0].required = res.data.verify;
                } else {
                    this.msgError(res.message);
                }
            });
        },
        getCookie() {
            const username = this.$cookie.get('username');
            const password = this.$cookie.get('password');
            const remember = this.$cookie.get('remember');
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
                    this.$store
                        .dispatch('Login', this.loginForm)
                        .then(() => {
                            if (this.loginForm.remember) {
                                this.$cookie.set('username', this.loginForm.username, { expires: 7 });
                                this.$cookie.set('password', encrypt(this.loginForm.password), { expires: 7 });
                                this.$cookie.set('remember', true, { expires: 7 });
                            } else {
                                this.$cookie.delete('username');
                                this.$cookie.delete('password');
                                this.$cookie.delete('remember');
                            }
                            this.$router.push({ path: this.redirect || '/' }).catch(e => {});
                        })
                        .catch(err => {
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
    background-image: url(../../assets/img/starry.jpg);
    /* background-size: 100%; */
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
    color: #d3d7f7;
}
</style>
