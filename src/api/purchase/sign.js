 import request from '@/utils/request';

 export function listPurchaseSign(params) {
   return request({
     url: '/purchase/sign',
     method: 'get',
     params: params
   });
 }
 export function getPurchaseSign(params) {
   return request({
     url: '/purchase/sign/' + params,
     method: 'get',
   });
 }

 export function deletePurchaseSign(params) {
   return request({
     url: '/purchase/sign/' + params,
     method: 'delete',
   });
 }

 export function addPurchaseSign(params) {
   return request({
     url: '/purchase/sign',
     method: 'post',
     data: params
   });
 }
 export function updatePurchaseSign(params) {
   return request({
     url: '/purchase/sign',
     method: 'put',
     data: params
   });
 }

 export function auditPurchaseSign(params) {
   return request({
     url: '/purchase/sign/audit',
     method: 'put',
     data: params
   });
 }

 export function submitPurchaseSign(params) {
   return request({
     url: '/purchase/sign/submit',
     method: 'put',
     data: params
   });
 }

 // =====================================以下是订单子表操作================================================//
 export function listPurchaseSignSub(params) {
   return request({
     url: '/purchase/signSub/list',
     method: 'get',
     params: params
   });
 }