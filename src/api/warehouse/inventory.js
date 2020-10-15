/*jshint esversion: 6*/
import request from '@/utils/request';

export function listInventory(params) {
    return request({
        url: '/warehouse/inventory',
        method: 'get',
        params: params
    });
}

export function addAndUpdateInventory(params) {
    return request({
        url: '/warehouse/inventory',
        method: 'post',
        data: params
    });
}

export function getInventory(params) {
    return request({
        url: '/warehouse/inventory/' + params,
        method: 'get',
    });
}

export function deleteInventory(params) {
    return request({
        url: '/warehouse/inventory/' + params,
        method: 'delete',
    });
}

export function auditInventory(params) {
    return request({
        url: '/warehouse/inventory/audit',
        method: 'put',
        data: params
    });
}

export function submitInventory(status, params) {
    return request({
        url: '/warehouse/inventory/submit/' + status,
        method: 'put',
        data: params
    });
}



// ========================================子表============================================//
export function listInventorySub(params) {
    return request({
        url: '/warehouse/inventorySub',
        method: 'get',
        params: params
    });
}