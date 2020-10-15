 /* jshint esversion: 6 */
 import {
     Login,
     Logout,
     GetInfo
 } from '@/api/auth';
 import {
     getToken,
     setToken,
     removeToken
 } from '@/utils/auth';

 const user = {
     state: {
         token: getToken(),
         name: undefined,
         username: undefined,
         userId: undefined,
         avatar: undefined,
         dept: undefined,
         roles: [],
         permissions: []
     },

     mutations: {
         SET_TOKEN: (state, token) => {
             state.token = token;
         },
         SET_NAME: (state, name) => {
             state.name = name;
         },
         SET_USERNAME: (state, username) => {
             state.username = username;
         },
         SET_USERID: (state, userId) => {
             state.userId = userId;
         },
         SET_AVATAR: (state, avatar) => {
             state.avatar = avatar;
         },
         SET_DEPT: (state, dept) => {
             state.dept = dept;
         },
         SET_ROLES: (state, roles) => {
             state.roles = roles;
         },
         SET_PERMISSIONS: (state, permissions) => {
             state.permissions = permissions;
         }
     },

     actions: {
         // 登录
         Login({
             commit
         }, userInfo) {
             return new Promise((resolve, reject) => {
                 Login(userInfo).then(res => {
                     setToken(res.data.token);
                     commit('SET_TOKEN', res.data.token);
                     localStorage.setItem('loginTime', res.data.loginTime);
                     resolve();
                 }).catch(error => {
                     reject(error);
                 });
             });
         },

         // 获取用户信息
         GetInfo({
             commit,
             state
         }) {
             return new Promise((resolve, reject) => {
                 GetInfo(state.token).then(res => {
                     console.log(res)
                     const user = res.data.user;
                     const avatar = user.avatar == "" ? require("@/assets/img/avatar.gif") : user.avatar;
                     if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                         commit('SET_ROLES', res.data.roles);
                         commit('SET_PERMISSIONS', res.data.permissions);
                     } else {
                         commit('SET_ROLES', ['ROLE_DEFAULT']);
                     }
                     commit('SET_ROLES', user.roles);
                     commit('SET_USERNAME', user.username);
                     commit('SET_NAME', user.nickname);
                     commit('SET_USERID', user.userId);
                     commit('SET_AVATAR', avatar);
                     commit('SET_DEPT', user.dept);
                     resolve(res);
                 }).catch(error => {
                     reject(error);
                 });
             });
         },

         // 退出系统
         Logout({
             commit,
             state
         }) {
             return new Promise((resolve, reject) => {
                 Logout(state.token).then(() => {
                     removeToken();
                     commit('SET_TOKEN', '');
                     commit('SET_ROLES', []);
                     commit('SET_PERMISSIONS', []);
                     resolve();
                 }).catch(error => {
                     reject(error);
                 });
             });
         },

         // 前端 登出
         FedLogout({
             commit
         }) {
             return new Promise(resolve => {
                 removeToken();
                 commit('SET_TOKEN', '');
                 resolve();
             });
         }
     }
 };

 export default user;