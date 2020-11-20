<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{ $t('login.title') }}</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? $t('header.nuFullscreen') : $t('header.fullscreen')" placement="bottom"><i class="el-icon-rank"></i></el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message ? `${message} ${$t('header.unreadMessage')}` : $t('header.message')" placement="bottom">
                        <router-link to="/page/messageTabs"><i class="el-icon-bell"></i></router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 中英文转换 -->
                <el-dropdown class="btn-international" trigger="click" @command="handleSetLanguage">
                    <el-tooltip effect="dark" :content="$t('switchMsg')" placement="bottom">
                        <div>
                            <svg-icon class-name="international-icon" icon-class="language" />
                        </div>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :disabled="language === 'zh'" command="zh">
                            中文
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="language === 'en'" command="en">
                            English
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="../../assets/img/avatar.gif" /></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="changePwd">{{ $t('header.changePwd.title') }}</el-dropdown-item>
                        <el-dropdown-item divided command="logout">{{ $t('header.logout') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- 侧边弹出栏 -->
                <el-drawer :visible.sync="drawer" size="20%" :with-header="false">
                    <div class="demo-drawer-content" style="margin-top: 16px;">
                        <el-form :model="form" ref="form" :rules="rules" label-position="center" label-width="auto">
                            <el-form-item :label="$t('header.changePwd.password')" prop="password">
                                <el-input
                                    v-model="form.password"
                                    :placeholder="$t('header.changePwd.password')"
                                    style="width:160px"
                                    type="password"
                                    clearable
                                    show-password
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('header.changePwd.newPassword')" prop="newPassword">
                                <el-input
                                    v-model="form.newPassword"
                                    :placeholder="$t('header.changePwd.newPassword')"
                                    type="password"
                                    style="width:160px"
                                    clearable
                                    show-password
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('header.changePwd.checkPassword')" prop="checkPassword">
                                <el-input
                                    v-model="form.checkPassword"
                                    :placeholder="$t('header.changePwd.checkPassword')"
                                    type="password"
                                    clearable
                                    show-password
                                    style="width:160px"
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="demo-drawer-footer" style="margin-left: 32px;">
                            <el-button type="primary" @click="submitForm" :loading="loading">{{ loading ? $t('header.changePwd.submiting') : $t('header.changePwd.submit') }}</el-button>
                        </div>
                    </div>
                </el-drawer>
            </div>
        </div>
    </div>
</template>
<script>
import bus from './bus';
import { Logout } from '@/api/auth.js';
import { removeToken } from '@/utils/auth.js';
import { changePassword } from '@/api/system/user.js';
import cookie from 'vue-cookie';
import { decrypt } from '@/utils/jsencrypt';

export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            drawer: false,
            loading: false,
            form: {},
            rules: {
                password: [{ required: true, message: this.$t('header.changePwd.passwordHint'), trigger: 'blur' }],
                newPassword: [{ required: true, message: this.$t('header.changePwd.newPasswordHint'), trigger: 'blur' }],
                checkPassword: [
                    { required: true, message: this.$t('header.changePwd.checkPasswordHint'), trigger: 'blur' },
                    { validator: this.validatePwd, trigger: 'blur' }
                ]
            },
            message: 0,
            timer: ''
        };
    },
    computed: {
        language() {
            return this.$store.getters.language;
        },
        username() {
            return this.$store.getters.username;
        },
        title() {
            return process.env.VUE_APP_TITLE;
        },
        avator() {
            return this.$store.getters.avator;
        }
    },
    methods: {
        //切换语言
        handleSetLanguage(lang) {
            this.$i18n.locale = lang;
            this.$store.dispatch('app/setLanguage', lang);
        },
        validatePwd(rule, value, callback) {
            if (value !== this.form.newPassword) {
                callback(new Error(this.$t('header.changePwd.twoPasswordHint')));
            } else {
                callback();
            }
        },
        // 获取消息通知数
        getMessageCount() {
            this.message++;
            console.log('getMessageCount');
        },
        // 修改密码提交按钮
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.form.password !== decrypt(cookie.get('password'))) {
                        this.msgError('输入原始密码不正确');
                        return;
                    }
                    this.loading = true;
                    changePassword(this.form)
                        .then(res => {
                            this.loading = false;
                            if (res.success) {
                                this.drawer = false;
                                this.$cookie.delete('password');
                                this.$store.dispatch('Logout').then(() => {});
                                this.$alert('修改成功，请重新登录', '提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning'
                                }).then(() => {
                                    location.href = '/';
                                });
                            } else {
                                this.msgError(res.message);
                            }
                        })
                        .catch(e => {
                            this.drawer = false;
                            this.msgError(e);
                        });
                }
            });
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'logout') {
                this.$confirm('确定退出系统吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store
                        .dispatch('Logout')
                        .then(() => {
                            location.href = '/';
                        })
                        .catch(e => {
                            console.log(e);
                        });
                });
            } else if (command == 'changePwd') {
                this.drawer = true;
                this.loading = false;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        // 定时获取消息通知数
        // this.timer = setInterval(this.getMessageCount, 1000*60);

        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
    // beforeDestroy() {
    //     console.log('beforeDestroy');
    //     clearInterval(this.timer);
    // }
};
</script>
<style scoped>
.btn-international {
    color: #fff;
    font-size: 22px;
}
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    /* width: 250px; */
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    font-size: 24px;
}
.btn-international,
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    margin-right: 5px;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
