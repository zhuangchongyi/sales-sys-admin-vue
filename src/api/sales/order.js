 /* jshint esversion: 6 */
 import request from '@/utils/request';

 // 查询报价单信息
 export function listOrder(params) {
     return request({
         url: '/sales/order',
         method: 'get',
         params: params
     });
 }
 export function listOrderPage(params) {
     return request({
         url: '/sales/order/list',
         method: 'get',
         params: params
     });
 }
 export function listReturnOrder(params) {
     return request({
         url: '/sales/order/returns',
         method: 'get',
         params: params
     });
 }

 export function getOrder(params) {
     return request({
         url: '/sales/order/' + params,
         method: 'get',
     });
 }

 export function deleteOrder(params) {
     return request({
         url: '/sales/order/' + params,
         method: 'delete',
     });
 }

 export function addOrder(params) {
     return request({
         url: '/sales/order',
         method: 'post',
         data: params
     });
 }
 export function updateOrder(params) {
     return request({
         url: '/sales/order',
         method: 'put',
         data: params
     });
 }

 export function auditOrder(params) {
     return request({
         url: '/sales/order/audit',
         method: 'put',
         data: params
     });
 }

 export function submitOrder(status, params) {
     return request({
         url: '/sales/order/submit/' + status,
         method: 'put',
         data: params
     });
 }

 export function checkCloseOrderSub(params) {
     return request({
         url: '/sales/order/checkClose',
         method: 'get',
         params: params
     });
 }

 export function closeOrder(params) {
     return request({
         url: '/sales/order/close',
         method: 'put',
         data: params
     });
 }
 // =====================================以下是订单子表操作================================================//
 export function listOrderSub(params) {
     return request({
         url: '/sales/orderSub/list',
         method: 'get',
         params: params
     });
 }

 export function getOrderSub(params) {
     return request({
         url: '/sales/orderSub',
         method: 'get',
         params: params
     });
 }

 export function listSignOrderSub(params) {
     return request({
         url: '/sales/orderSub/sign',
         method: 'get',
         params: params
     });
 }
 export function deleteOrderSub(params) {
     return request({
         url: '/sales/orderSub/' + params,
         method: 'delete',
     });
 }

 export function addOrderSub(params) {
     return request({
         url: '/sales/orderSub',
         method: 'post',
         data: params
     });
 }
 export function updateOrderSub(params) {
     return request({
         url: '/sales/orderSub',
         method: 'put',
         data: params
     });
 }