import request from '@/utils/request';

export function rolePageList(params) {
    return request({
        url: '/system/role',
        method: 'get',
        params: params
    });
};

export function addRole(params) {
    return request({
        url: '/system/role',
        method: 'post',
        data: params
    });
};

export function updateRole(params) {
    return request({
        url: '/system/role',
        method: 'put',
        data: params
    });
};

export function getRole(params) {
    return request({
        url: '/system/role/' + params,
        method: 'get',
    });
};

export function deleteRole(params) {
    return request({
        url: '/system/role/' + params,
        method: 'delete',
    });
};


export function roleUserList(params) {
    return request({
        url: '/system/role/roleUserList',
        method: 'get',
        params: params
    });
};

export function addRoleMenu(params) {
    return request({
        url: '/system/role/addRoleMenu',
        method: 'post',
        data: params
    });
};