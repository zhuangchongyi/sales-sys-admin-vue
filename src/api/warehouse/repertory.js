/*jshint esversion: 6*/
import request from '@/utils/request';

export function listRepertoryPage(params) {
    return request({
        url: '/warehouse/repertory',
        method: 'get',
        params: params
    });
};


export function listRepertoryData(params) {
    return request({
        url: '/warehouse/repertory/list',
        method: 'get',
        params: params
    });
};