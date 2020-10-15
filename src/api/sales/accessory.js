 /* jshint esversion: 6 */
 import request from '@/utils/request';

 export function listAccessory(params) {
     return request({
         url: '/sales/accessory',
         method: 'get',
         params: params
     });
 }

 export function updateAccessory(params) {
     return request({
         url: '/sales/accessory',
         method: 'put',
         data: params
     });
 }

 export function deleteAccessory(params) {
     return request({
         url: '/sales/accessory/' + params,
         method: 'delete',
     });
 }

 export function downloadFile(params) {
     return request({
         url: '/download/accessory/' + params,
         method: 'get',
         responseType: 'blob'

     });
 }