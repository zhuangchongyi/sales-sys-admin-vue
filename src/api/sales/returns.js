import request from '@/utils/request';

// 查询报价单信息
export function listReturns(params) {
    return request({
        url: '/sales/returns',
        method: 'get',
        params: params
    });
}

export function getReturns(params) {
    return request({
        url: '/sales/returns/' + params,
        method: 'get',
    });
}

export function deleteReturns(params) {
    return request({
        url: '/sales/returns/' + params,
        method: 'delete',
    });
}

export function addReturns(params) {
    return request({
        url: '/sales/returns',
        method: 'post',
        data: params
    });
}
export function editReturns(params) {
    return request({
        url: '/sales/returns',
        method: 'put',
        data: params
    });
}

export function auditReturns(params) {
    return request({
        url: '/sales/returns/audit',
        method: 'put',
        data: params
    });
}

export function submitReturns(status, params) {
    return request({
        url: '/sales/returns/submit/' + status,
        method: 'put',
        data: params
    });
}

export function submitReturnsStorage(status, params) {
    return request({
        url: '/sales/returns/submitStorage/' + status,
        method: 'put',
        data: params
    });
}

export function auditReturnsStorage(params) {
    return request({
        url: '/sales/returns/auditStorage',
        method: 'put',
        data: params
    });
}

// =====================================以下是子表操作================================================//
export function listReturnsSub(params) {
    return request({
        url: '/sales/returnsSub/list',
        method: 'get',
        params: params
    });
}