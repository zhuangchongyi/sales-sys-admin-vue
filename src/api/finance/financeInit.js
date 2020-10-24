 import request from '@/utils/request';

 export function listFinanceInit(params) {
     return request({
         url: '/finance/init',
         method: 'get',
         params: params
     });
 }

 export function getFinanceInit(params) {
     return request({
         url: '/finance/init/' + params,
         method: 'get',
     });
 }

 export function deleteFinanceInit(params) {
     return request({
         url: '/finance/init/' + params,
         method: 'delete',
     });
 }

 export function addFinanceInit(params) {
     return request({
         url: '/finance/init',
         method: 'post',
         data: params
     });
 }
 export function updateFinanceInit(params) {
     return request({
         url: '/finance/init',
         method: 'put',
         data: params
     });
 }

 export function auditFinanceInit(params) {
     return request({
         url: '/finance/init/audit',
         method: 'put',
         data: params
     });
 }

 export function submitFinanceInit(status, params) {
     return request({
         url: '/finance/init/submit/' + status,
         method: 'put',
         data: params
     });
 }

 // =====================================以下是子表操作================================================//
 export function listFinanceInitSub(params) {
     return request({
         url: '/finance/initSub/list',
         method: 'get',
         params: params
     });
 }