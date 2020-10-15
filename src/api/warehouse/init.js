import request from '@/utils/request';

export function listInit(params) {
    return request({
        url: '/warehouse/init',
        method: 'get',
        params: params
    });
};

export function addAndUpdateInit(params) {
    return request({
        url: '/warehouse/init',
        method: 'post',
        data: params
    });
};

export function getInit(params) {
    return request({
        url: '/warehouse/init/' + params,
        method: 'get',
    });
};

export function deleteInit(params) {
    return request({
        url: '/warehouse/init/' + params,
        method: 'delete',
    });
};



// ========================================子表============================================//
export function listInitSub(params) {
    return request({
        url: '/warehouse/initSub',
        method: 'get',
        params: params
    });
};