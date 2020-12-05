import request from '@/utils/request';

export function listSupplier(params) {
  return request({
    url: '/purchase/supplier',
    method: 'get',
    params: params
  });
};

export function listSupplierDialog(params) {
  return request({
    url: '/purchase/supplier/list',
    method: 'get',
    params: params
  });
};

export function getSupplier(params) {
  return request({
    url: '/purchase/supplier/' + params,
    method: 'get',
  });
};

export function addSupplier(params) {
  return request({
    url: '/purchase/supplier',
    method: 'post',
    data: params
  });
};

export function updateSupplier(params) {
  return request({
    url: '/purchase/supplier',
    method: 'put',
    data: params
  });
};

export function deleteSupplier(params) {
  return request({
    url: '/purchase/supplier/' + params,
    method: 'delete',
  });
};