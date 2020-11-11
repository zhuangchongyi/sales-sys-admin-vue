import request from '@/utils/request';

export function listOnline() {
  return request({
    url: '/monitor/online',
    method: 'get',
  });
};

export function countOnline() {
  return request({
    url: '/monitor/online/count',
    method: 'get',
  });
};

export function deleteOnline(params) {
  return request({
    url: '/monitor/online',
    method: 'delete',
    params: params
  });
};