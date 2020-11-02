 import request from '@/utils/request';

 export function listReceipt(params) {
     return request({
         url: '/finance/receipt',
         method: 'get',
         params: params
     });
 }

 export function getReceipt(params) {
     return request({
         url: '/finance/receipt/' + params,
         method: 'get',
     });
 }

 export function deleteReceipt(params) {
     return request({
         url: '/finance/receipt/' + params,
         method: 'delete',
     });
 }

 export function addReceipt(params) {
     return request({
         url: '/finance/receipt',
         method: 'post',
         data: params
     });
 }
 export function updateReceipt(params) {
     return request({
         url: '/finance/receipt',
         method: 'put',
         data: params
     });
 }

 export function auditReceipt(params) {
     return request({
         url: '/finance/receipt/audit',
         method: 'put',
         data: params
     });
 }

 export function submitReceipt(status, params) {
     return request({
         url: '/finance/receipt/submit/' + status,
         method: 'put',
         data: params
     });
 }

 export function getReceiptList(params) {
     return request({
         url: '/finance/receipt/clientele',
         method: 'get',
         params: params
     });
 }

 export function getClienteleReceiptList(params) {
     return request({
         url: '/finance/receipt/clienteleList',
         method: 'get',
         params: params
     });
 }