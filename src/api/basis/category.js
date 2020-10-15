import request from '@/utils/request';

export function listCategory(params) {
    return request({
        url: '/basis/category',
        method: 'get',
        params: params
    });
};

export function getCategory(params) {
    return request({
        url: '/basis/category/' + params,
        method: 'get',
    });
};

export function addCategory(params) {
    return request({
        url: '/basis/category',
        method: 'post',
        data: params
    });
};

export function updateCategory(params) {
    return request({
        url: '/basis/category',
        method: 'put',
        data: params
    });
};

export function deleteCategory(params) {
    return request({
        url: '/basis/category/' + params,
        method: 'delete',
    });
};

export function treeselect(params) {
    return request({
        url: '/basis/category/selectTree',
        method: 'get',
        params: params
    });
};