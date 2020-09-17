import request from '@/utils/request';

export function deptListData(params) {
  return request({
    url: '/system/dept',
    method: 'get',
    params: params
  });
};

export function addDept(params) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: params
  });
};

export function updateDept(params) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: params
  });
};

export function deleteDept(params) {
  return request({
    url: '/system/dept/' + params,
    method: 'delete',
  });
};

export function getDept(params) {
  return request({
    url: '/system/dept/' + params,
    method: 'get',
  });
};


export function treeselect(query) {
  return request({
    url: '/system/dept/selectTree',
    method: 'get',
    params: query
  });
};