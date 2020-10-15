 /* jshint esversion: 6 */
 import request from '@/utils/request';

 export function listAdjustment(params) {
     return request({
         url: '/warehouse/adjustment',
         method: 'get',
         params: params
     });
 }

 export function addAndUpdateAdjustment(params) {
     return request({
         url: '/warehouse/adjustment',
         method: 'post',
         data: params
     });
 }

 export function getAdjustment(params) {
     return request({
         url: '/warehouse/adjustment/' + params,
         method: 'get',
     });
 }

 export function deleteAdjustment(params) {
     return request({
         url: '/warehouse/adjustment/' + params,
         method: 'delete',
     });
 }

 export function auditAdjustment(params) {
     return request({
         url: '/warehouse/adjustment/audit',
         method: 'put',
         data: params
     });
 }

 export function submitAdjustment(status, params) {
     return request({
         url: '/warehouse/adjustment/submit/' + status,
         method: 'put',
         data: params
     });
 }

 // ========================================子表============================================//
 export function listAdjustmentSub(params) {
     return request({
         url: '/warehouse/adjustmentSub',
         method: 'get',
         params: params
     });
 }