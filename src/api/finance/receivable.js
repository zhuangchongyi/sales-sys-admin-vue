 import request from '@/utils/request';

 export function listReceivable(params) {
     return request({
         url: '/finance/receivable',
         method: 'get',
         params: params
     });
 }

 export function getReceivable(params) {
     return request({
         url: '/finance/receivable/' + params,
         method: 'get',
     });
 }

 export function deleteReceivable(params) {
     return request({
         url: '/finance/receivable/' + params,
         method: 'delete',
     });
 }

 export function addReceivable(params) {
     return request({
         url: '/finance/receivable',
         method: 'post',
         data: params
     });
 }
 export function updateReceivable(params) {
     return request({
         url: '/finance/receivable',
         method: 'put',
         data: params
     });
 }

 export function auditReceivable(params) {
     return request({
         url: '/finance/receivable/audit',
         method: 'put',
         data: params
     });
 }

 export function submitReceivable(status, params) {
     return request({
         url: '/finance/receivable/submit/' + status,
         method: 'put',
         data: params
     });
 }

 export function getReceivableList(params) {
     return request({
         url: '/finance/receivable/clientele',
         method: 'get',
         params: params
     });
 }

 export function getClienteleReceivableList(params) {
     return request({
         url: '/finance/receivable/clienteleList',
         method: 'get',
         params: params
     });
 }