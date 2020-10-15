import request from '@/utils/request';

// 获取菜单路由
export function getRouters() {
    return request({
        url: '/system/menu/getRouters',
        method: 'get',
    });
};

export function menuPermission(params) {
    return request({
        url: '/system/menu/menuPermission/' + params,
        method: 'get',
    });
};