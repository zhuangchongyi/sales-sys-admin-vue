 import axios from 'axios';
 import store from '@/store';
 import {
   getToken,
   TokenKey
 } from '@/utils/auth';

 import {
   Notification,
   MessageBox,
   Message
 } from 'element-ui';

 axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
 //  问题：IE浏览器缓存了GET请求数据。解决方式：
 axios.defaults.headers['Cache-Control'] = 'no-cache';
 axios.defaults.headers['Pragma'] = 'no-cache';

 const service = axios.create({
   baseURL: process.env.VUE_APP_BASE_API,
   timeout: 10000
 });

 // 请求拦截器
 service.interceptors.request.use(
   config => {
     if (getToken()) {
       config.headers[TokenKey] = getToken() || '';
     }
     return config;
   },
   error => {
     console.log(error);
     Promise.reject();
   }
 );
 // 响应拦截器
 service.interceptors.response.use(
   response => {
     // console.log("response", response)
     let res = response.data;
     let code = res.code || 200;
     let msg = res.message || 'Error';
     if (code === 403) {
       MessageBox.confirm(
         '登录状态已过期，您可以继续留在该页面，或者重新登录',
         '系统提示', {
           confirmButtonText: '重新登录',
           cancelButtonText: '取消',
           type: 'warning'
         }
       ).then(() => {
         store.dispatch('FedLogout').then(() => {
           location.reload(); // 为了重新实例化vue-router对象 避免bug
         })
       }).catch(e => {})
     } else if (code === 500 || code === 401) {
       Notification.error({
         title: msg
       })
       return Promise.reject(new Error(msg))
     } else if (code !== 200) { //其他错误
       Message({
         message: msg,
         type: 'error'
       })
       return Promise.reject(msg)
     } else {
       return res;
     }
   },
   error => {
     let msg = error.message || 'Error';
     if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
       msg = "(T＿T)请求超时，请稍后处理";
     } else if (error.message.includes('status code 500')) {
       msg = "(T＿T)服务器请求失败 500";
     } else if (error.message.includes('status code 404')) {
       msg = "(T＿T)服务器请求无效 404";
     }
     Message({
       message: msg,
       type: 'error',
       duration: 5000
     });
     error.message = msg;
     return Promise.reject(error);
   }
 );

 export default service;