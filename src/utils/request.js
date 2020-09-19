import axios from 'axios';
import store from '@/store'
import {
  getToken,
  removeToken,
  TokenKey
} from '@/utils/auth'

import {
  Notification,
  MessageBox,
  Message
} from 'element-ui';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers[TokenKey] = getToken() || '';
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject();
  }
);
// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log("response", response)
    let res = response.data;
    let code = res.code || 200;
    let msg = res.message || 'error';
    if (code === 403) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // removeToken()
        store.dispatch('Logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 401) { //登录认证错误
      Message({
        message: msg,
        type: 'error',
      })
      return Promise.reject(new Error(msg));
    } else if (code === 500) { //请求服务器错误
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else {
      return res;
    }
  },
  error => {
    console.log("request error", error);
    let msg = error.message;
    if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
      msg = "请求超时，请稍后处理"
    } else if (error.message.includes('Request failed with status code 500')) {
      msg = "(T＿T)服务器请求失败"
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error);
  }
);

export default service;