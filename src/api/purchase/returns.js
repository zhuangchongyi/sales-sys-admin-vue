 import request from '@/utils/request';

 export function listPurchaseReturns(params) {
   return request({
     url: '/purchase/returns',
     method: 'get',
     params: params
   });
 }

 export function listPurchaseReturnsDialog(params) {
   return request({
     url: '/purchase/returns/list',
     method: 'get',
     params: params
   });
 }

 export function getPurchaseReturns(params) {
   return request({
     url: '/purchase/returns/' + params,
     method: 'get',
   });
 }

 export function deletePurchaseReturns(params) {
   return request({
     url: '/purchase/returns/' + params,
     method: 'delete',
   });
 }

 export function addPurchaseReturns(params) {
   return request({
     url: '/purchase/returns',
     method: 'post',
     data: params
   });
 }
 export function updatePurchaseReturns(params) {
   return request({
     url: '/purchase/returns',
     method: 'put',
     data: params
   });
 }

 export function auditPurchaseReturns(params) {
   return request({
     url: '/purchase/returns/audit',
     method: 'put',
     data: params
   });
 }

 export function submitPurchaseReturns(params) {
   return request({
     url: '/purchase/returns/submit',
     method: 'put',
     data: params
   });
 }

 // =====================================子表操作================================================//

 export function listPurchaseReturnsSub(params) {
   return request({
     url: '/purchase/returnsSub/list',
     method: 'get',
     params: params
   });
 }

 // =====================================采购入库操作================================================//

 export function listPurchaseOutbound(params) {
   return request({
     url: '/purchase/outbound',
     method: 'get',
     params: params
   });
 }

 export function getPurchaseOutbound(params) {
   return request({
     url: '/purchase/outbound/' + params,
     method: 'get',
   });
 }

 export function updatePurchaseOutbound(params) {
   return request({
     url: '/purchase/outbound',
     method: 'put',
     data: params
   });
 }

 export function auditPurchaseOutbound(params) {
   return request({
     url: '/purchase/outbound/audit',
     method: 'put',
     data: params
   });
 }