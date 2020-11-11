import Vue from 'vue';
import router from './router';
import store from './store';
import {
  getToken
} from '@/utils/auth';
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false
});
const filterList = ['/add', '/edit', '/preview', '/preview2'];
const whiteList = ['/page/login'];
//  禁止鼠标右键
document.oncontextmenu = function () {
  return process.env.NODE_ENV === "production" ? false : true;
}
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  NProgress.start();
  document.title = `${to.meta.title} | ${process.env.VUE_APP_TITLE}`;
  // console.log("beforeEach to====", to, "======from", from);
  if (getToken()) { //已登录
    if (to.path === '/page/login') {
      next('/');
      NProgress.done();
    } else {
      if (store.getters.roles.length === 0) {
        //获取用户信息
        store.dispatch('GetInfo').then(res => {
          const roles = res.data.roles;
          store.dispatch('GenerateRoutes', {
            roles
          }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next({
              ...to,
              replace: true
            }); // hack方法 确保addRoutes已完成
          });
        }).catch(err => {
          store.dispatch('FedLogout').then(() => {
            next('/');
          });
        });
      } else { // 在拦截名单需进行校验权限
        if (filterList.indexOf(to.path.substring(to.path.lastIndexOf("/"))) !== -1) {
          let permissions = store.getters.permissions || [];
          if (permissions.indexOf('*:*:*') !== -1) {
            next();
          } else {
            let nextFlag = true;
            for (let i = 0; i < permissions.length; i++) {
              const perm = permissions[i];
              if (perm == to.meta.permission) {
                nextFlag = false;
                break
              }
            }
            if (nextFlag) {
              next('/page/403');
            } else {
              next();
            }
          }
        } else {
          next();
        }
      }
    }
  } else { //未登录
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next(`/page/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }

});
router.afterEach(() => {
  NProgress.done();
});