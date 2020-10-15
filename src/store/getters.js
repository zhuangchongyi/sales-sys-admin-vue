 /* jshint esversion: 6 */
 const getters = {
     token: state => state.user.token,
     username: state => state.user.username,
     name: state => state.user.name,
     userId: state => state.user.userId,
     avatar: state => state.user.avatar,
     dept: state => state.user.dept,
     roles: state => state.user.roles,
     permissions: state => state.user.permissions,
     menus: state => state.permission.menus,
 };
 export default getters;