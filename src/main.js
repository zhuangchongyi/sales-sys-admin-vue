import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import {
  messages
} from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
// icon
import './assets/icons';
// 引入cookie
import cookie from 'vue-cookie';
// 引入自定义配置
import './setting'
import {
  getToken
} from '@/utils/auth';
// 自定义指令
import permission from './directive'
//导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// cookie设置为全局变量
Vue.prototype.$cookie = cookie;
Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(permission);
Vue.use(ElementUI, {
  size: 'small'
});
const i18n = new VueI18n({
  locale: 'zh',
  messages
});

NProgress.configure({
  showSpinner: false
})
const whiteList = ['/page/login'];
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = process.env.VUE_APP_TITLE;
  console.log("beforeEach to====", to, "======from", from)
  if (getToken()) { //已登录
    if (to.path === '/page/login') {
      next('/')
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        //获取用户信息
        store.dispatch('GetInfo').then(res => {
          // console.log("用户信息GetInfo", res)
          const roles = res.data.roles;
          store.dispatch('GenerateRoutes', {
            roles
          }).then(accessRoutes => {
            // console.log("router.beforeEach.accessRoutes", accessRoutes)
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({
              ...to,
              replace: true
            }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          store.dispatch('FedLogout').then(() => {
            Message.error(err)
            next('/')
          })
        })
      } else {
        next();
      }
    }
  } else { //未登录
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/page/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done()
    }
  }


});
router.afterEach(() => {
  NProgress.done()
})

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');