 /* jshint esversion: 6 */
 import request from '@/utils/request';

 export function listScrap(params) {
     return request({
         url: '/warehouse/scrap',
         method: 'get',
         params: params
     });
 }

 export function addAndUpdateScrap(params) {
     return request({
         url: '/warehouse/scrap',
         method: 'post',
         data: params
     });
 }

 export function getScrap(params) {
     return request({
         url: '/warehouse/scrap/' + params,
         method: 'get',
     });
 }

 export function deleteScrap(params) {
     return request({
         url: '/warehouse/scrap/' + params,
         method: 'delete',
     });
 }

 export function auditScrap(params) {
     return request({
         url: '/warehouse/scrap/audit',
         method: 'put',
         data: params
     });
 }

 export function submitScrap(status, params) {
     return request({
         url: '/warehouse/scrap/submit/' + status,
         method: 'put',
         data: params
     });
 }

 // ========================================子表============================================//
 export function listScrapSub(params) {
     return request({
         url: '/warehouse/scrapSub',
         method: 'get',
         params: params
     });
 }