import request from '@/utils/request';

export function warehouseListPage(params) {
    return request({
        url: '/basis/warehouse',
        method: 'get',
        params: params
    });
};

export function getWarehouse(params) {
    return request({
        url: '/basis/warehouse/' + params,
        method: 'get',
    });
};


export function addWarehouse(params) {
    return request({
        url: '/basis/warehouse',
        method: 'post',
        data: params
    });
};

export function updateWarehouse(params) {
    return request({
        url: '/basis/warehouse',
        method: 'put',
        data: params
    });
};

export function deleteWarehouse(params) {
    return request({
        url: '/basis/warehouse/' + params,
        method: 'delete',
    });
};


export function initWarehouseList(params) {
    return request({
        url: '/basis/warehouse/init',
        method: 'get',
        params: params
    });
};