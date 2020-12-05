 import Vue from 'vue';
 import App from './App.vue';
 import router from './router';
 import store from './store';
 import ElementUI from 'element-ui';
 import VueI18n from 'vue-i18n';
 import i18n from './lang';
 import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
 // import './assets/css/theme-green/index.css'; // 浅绿色主题
 import './assets/css/icon.css';
 import 'babel-polyfill';
 // icon
 import './icons';
 // 引入cookie
 import cookie from 'vue-cookie';
 // 引入自定义配置
 import './setting';
 import './permission';
 // 自定义指令
 import directive from './directive';
 //粒子动画
 //  import VueParticles from 'vue-particles'
 // cookie设置为全局变量
 Vue.prototype.$cookie = cookie;
 Vue.use(VueI18n);
 Vue.use(directive);
 //  Vue.use(VueParticles)
 Vue.use(ElementUI, {
   size: 'small',
   i18n: (key, value) => i18n.t(key, value)
 });

 Vue.config.productionTip = false;
 new Vue({
   router,
   i18n,
   store,
   render: h => h(App)
 }).$mount('#app');