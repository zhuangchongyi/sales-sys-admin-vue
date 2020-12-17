 import request from '@/utils/request';

 export function listPurchaseOrder(params) {
   return request({
     url: '/purchase/order',
     method: 'get',
     params: params
   });
 }

 export function listPurchaseOrderDialog(params) {
   return request({
     url: '/purchase/order/list',
     method: 'get',
     params: params
   });
 }

 export function getPurchaseOrder(params) {
   return request({
     url: '/purchase/order/' + params,
     method: 'get',
   });
 }

 export function deletePurchaseOrder(params) {
   return request({
     url: '/purchase/order/' + params,
     method: 'delete',
   });
 }

 export function addPurchaseOrder(params) {
   return request({
     url: '/purchase/order',
     method: 'post',
     data: params
   });
 }
 export function updatePurchaseOrder(params) {
   return request({
     url: '/purchase/order',
     method: 'put',
     data: params
   });
 }

 export function auditPurchaseOrder(params) {
   return request({
     url: '/purchase/order/audit',
     method: 'put',
     data: params
   });
 }

 export function submitPurchaseOrder(params) {
   return request({
     url: '/purchase/order/submit',
     method: 'put',
     data: params
   });
 }

 // =====================================以下是订单子表操作================================================//
 export function listPurchaseOrderSub(params) {
   return request({
     url: '/purchase/orderSub/list',
     method: 'get',
     params: params
   });
 }

 export function listPurchaseOrderSubDialog(params) {
   return request({
     url: '/purchase/orderSub',
     method: 'get',
     params: params
   });
 }