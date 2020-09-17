<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn"
         @click="collapseChage">
      <i v-if="!collapse"
         class="el-icon-s-fold"></i>
      <i v-else
         class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">{{title}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen"
             @click="handleFullScreen">
          <el-tooltip effect="dark"
                      :content="fullscreen ? `取消全屏` : `全屏`"
                      placement="bottom"><i class="el-icon-rank"></i></el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark"
                      :content="message ? `有${message}条未读消息` : `消息中心`"
                      placement="bottom">
            <router-link to="/page/messageTabs"><i class="el-icon-bell"></i></router-link>
          </el-tooltip>
          <span class="btn-bell-badge"
                v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator"><img src="../../assets/img/avatar.gif" /></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name"
                     trigger="click"
                     @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided
                              command="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item divided
                              command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-drawer :visible.sync="drawer"
                   size="15%"
                   :with-header="false">
          <div class="demo-drawer-content"
               style="margin-top: 16px;">
            <el-form :model="form"
                     ref="form"
                     :rules="rules"
                     label-position="center"
                     label-width="100px">
              <el-form-item label="原密码"
                            prop="password">
                <el-input v-model="form.password"
                          placeholder="请输入原密码"
                          style="width:160px"
                          type="password"
                          clearable
                          show-password
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码"
                            prop="newPassword">
                <el-input v-model="form.newPassword"
                          placeholder="请输入新密码"
                          type="password"
                          style="width:160px"
                          clearable
                          show-password
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="checkPassword">
                <el-input v-model="form.checkPassword"
                          placeholder="请输入确认密码"
                          type="password"
                          clearable
                          show-password
                          style="width:160px"
                          autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div class="demo-drawer-footer"
                 style="margin-left: 32px;">
              <el-button type="primary"
                         @click="submitForm('form')"
                         :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
            </div>
          </div>
        </el-drawer>

      </div>
    </div>
  </div>
</template>
<script>
import bus from '../common/bus';
import { Logout } from '@/api/auth.js';
import { removeToken } from '@/utils/auth.js';
import { changePassword } from '@/api/system/user.js';

export default {
  data () {
    var validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      collapse: false,
      fullscreen: false,
      message: 2,

      drawer: false,
      loading: false,
      form: {},
      rules: {
        password: [
          { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePwd, trigger: 'blur' }
        ]
      },

    };
  },
  computed: {
    username () {
      return this.$store.getters.name || '';
    },
    title () {
      return process.env.VUE_APP_TITLE;
    },
    avator () {
      return this.$store.getters.avator;
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          changePassword(this.form).then(res => {
            this.loading = false;
            if (res.success) {
              this.msgSuccess("修改成功")
              setTimeout(() => {
                this.drawer = false;
                this.$alert('请重新登录系统', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('Logout').then(() => {
                    location.href = '/';
                  })
                })
              }, 1000);
            } else {
              this.msgError(res.message);
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command == 'logout') {
        this.$confirm('确定退出系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('Logout').then(() => {
            location.href = '/';
          })
        })
      } else if (command == 'changePwd') {
        this.drawer = true;
      }
    },
    // 侧边栏折叠
    collapseChage () {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen () {
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
  mounted () {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
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
    width: 250px;
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
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
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
