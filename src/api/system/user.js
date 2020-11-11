import request from '@/utils/request';

export function userListPage(params) {
  return request({
    url: '/system/user',
    method: 'get',
    params: params
  });
};

export function userListDialog(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: params
  });
};

export function addUser(params) {
  return request({
    url: '/system/user',
    method: 'post',
    data: params
  });
};
export function updateUser(params) {
  return request({
    url: '/system/user',
    method: 'put',
    data: params
  });
};
export function deleteUser(params) {
  return request({
    url: '/system/user/' + params,
    method: 'delete',
  });
};
export function getUser(params) {
  return request({
    url: '/system/user/' + params,
    method: 'get',
  });
};

export function listUser(params) {
  return request({
    url: '/system/user',
    method: 'get',
    params: params
  });
};

export function updateUserStatus(params) {
  return request({
    url: '/system/user/status',
    method: 'put',
    data: params
  });
};

export function resetPassword(params) {
  return request({
    url: '/system/user/resetPassword',
    method: 'put',
    data: params
  });
};

export function userRoleList(params) {
  return request({
    url: '/system/user/userRoleList/' + params,
    method: 'get',
  });
};

export function userRoleMenuList(params) {
  return request({
    url: '/system/user/userRoleMenuList/' + params,
    method: 'get',
  });
};

export function addUserRole(params) {
  return request({
    url: '/system/user/addUserRole',
    method: 'post',
    data: params
  });
};

export function changePassword(params) {
  return request({
    url: '/system/user/changePassword',
    method: 'put',
    data: params
  });
};