import request from '@/utils/request';

export function listUnits(params) {
    return request({
        url: '/basis/units',
        method: 'get',
        params: params
    });
};

export function getUnits(params) {
    return request({
        url: '/basis/units/' + params,
        method: 'get',
    });
};


export function addUnits(params) {
    return request({
        url: '/basis/units',
        method: 'post',
        data: params
    });
};

export function updateUnits(params) {
    return request({
        url: '/basis/units',
        method: 'put',
        data: params
    });
};

export function deleteUnits(params) {
    return request({
        url: '/basis/units/' + params,
        method: 'delete',
    });
};