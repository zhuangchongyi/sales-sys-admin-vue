import request from '@/utils/request';

export function Login(query) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: query
    });
};

export function Logout() {
    return request({
        url: '/auth/logout',
        method: 'get',
    });
};

export function GetInfo() {
    return request({
        url: '/auth/getInfo',
        method: 'get',
    });
};