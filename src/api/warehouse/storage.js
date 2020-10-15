 /* jshint esversion: 6 */
 import request from '@/utils/request';

 export function listStorage(params) {
     return request({
         url: '/warehouse/storage',
         method: 'get',
         params: params
     });
 }

 export function addAndUpdateStorage(params) {
     return request({
         url: '/warehouse/storage',
         method: 'post',
         data: params
     });
 }

 export function getStorage(params) {
     return request({
         url: '/warehouse/storage/' + params,
         method: 'get',
     });
 }

 export function deleteStorage(params) {
     return request({
         url: '/warehouse/storage/' + params,
         method: 'delete',
     });
 }

 export function auditStorage(params) {
     return request({
         url: '/warehouse/storage/audit',
         method: 'put',
         data: params
     });
 }

 export function submitStorage(status, params) {
     return request({
         url: '/warehouse/storage/submit/' + status,
         method: 'put',
         data: params
     });
 }

 // ========================================子表============================================//
 export function listStorageSub(params) {
     return request({
         url: '/warehouse/storageSub',
         method: 'get',
         params: params
     });
 }