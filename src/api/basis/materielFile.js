import request from '@/utils/request';

export function listMaterielFile(params) {
  return request({
    url: '/basis/materielFile',
    method: 'get',
    params: params
  });
};

export function updateMaterielFile(params) {
  return request({
    url: '/basis/materielFile',
    method: 'put',
    data: params
  });
};

export function deleteMaterielFile(params) {
  return request({
    url: '/basis/materielFile/' + params,
    method: 'delete',
  });
};

export function downloadFile(params) {
  return request({
    url: '/download/materiel/' + params,
    method: 'get',
    responseType: 'blob'
  });
};