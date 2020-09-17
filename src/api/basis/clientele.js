import request from '@/utils/request';


export function listClientele(params) {
  return request({
    url: '/basis/clientele',
    method: 'get',
    params: params
  });
};

export function getClientele(params) {
  return request({
    url: '/basis/clientele/' + params,
    method: 'get',
  });
};

export function addClientele(params) {
  return request({
    url: '/basis/clientele',
    method: 'post',
    data: params
  });
};

export function updateClientele(params) {
  return request({
    url: '/basis/clientele',
    method: 'put',
    data: params
  });
};

export function deleteClientele(params) {
  return request({
    url: '/basis/clientele/' + params,
    method: 'delete',
  });
};

export function getProductClientele(params) {
  return request({
    url: '/basis/clientele/getClientele',
    method: 'get',
    params: params
  });
};