 /* jshint esversion: 6 */
 import {
   constantRoutes
 } from '@/router'; //路由数组

 import {
   getRouters
 } from '@/api/system/menu';

 const permission = {
   state: {
     routes: [],
     menus: [],
     addRoutes: []
   },
   mutations: {
     SET_ROUTES: (state, routes) => {
       state.addRoutes = routes;
       state.routes = constantRoutes.concat(routes);
     },
     SET_MENUS: (state, menus) => {
       state.menus = state.menus.concat(menus);
     }
   },
   actions: {
     // 生成路由
     GenerateRoutes({
       commit
     }) {
       return new Promise(resolve => {
         // 向后端请求路由数据
         getRouters().then(res => {
           // 动态生成路由
           let accessedRoutes = filterAsyncRouter(res.data);
           // console.log("accessedRoutes", accessedRoutes);

           // 添加404转换路由
           accessedRoutes.push({
             path: '*',
             redirect: '/page/404',
             meta: {
               title: '404'
             }
           });
           commit('SET_ROUTES', accessedRoutes);

           // 动态生成菜单
           let accessedMenus = JSON.parse(JSON.stringify((res.data))); //复制一份新的
           accessedMenus = filterAsyncMenus(accessedMenus);
           // console.log("accessedMenus", accessedMenus);
           commit('SET_MENUS', accessedMenus);
           resolve(accessedRoutes);
         });
       });
     },

   }
 };

 // 遍历后台传来的路由字符串，转换为组件对象
 function filterAsyncRouter(asyncRouterMap) {
   return asyncRouterMap.filter(route => {
     if (route.component) {
       // Layout组件特殊处理
       if (route.component === 'Layout') {
         route.component = () => import('@/components/common/Home.vue');
       } else {
         route.path = loadPath(route.path);
         route.name = route.path;
         route.component = loadView(route.component);
       }
     }
     if (route.children != null && route.children && route.children.length) {
       route.children = filterAsyncRouter(route.children);
     }
     return true;
   });
 }

 // 菜单转换
 function filterAsyncMenus(asyncMenusMap) {
   return asyncMenusMap.filter(route => {
     if (route.hidden) {
       return false;
     }
     route.icon = route.meta.icon;
     route.index = route.path;
     route.title = route.meta.title;
     if (route.children != null && route.children && route.children.length) {
       route.children = filterAsyncMenus(route.children);
     }
     route.subs = route.children;
     return true;
   });
 }

 export const loadView = (view) => {
   if (view.indexOf('/', 0) === 0) {
     return (resolve) => require([`@/components/page${view}`], resolve);
   }
   return (resolve) => require([`@/components/page/${view}`], resolve);
 };
 export const loadPath = (view) => {
   if (view.indexOf('/', 0) === 0) {
     return `/page${view}`;
   }
   return `/page/${view}`;
 };

 export default permission;