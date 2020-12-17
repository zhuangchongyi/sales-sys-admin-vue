 import request from '@/utils/request';

 export function listPayable(params) {
   return request({
     url: '/finance/payable',
     method: 'get',
     params: params
   });
 }

 export function getPayable(params) {
   return request({
     url: '/finance/payable/' + params,
     method: 'get',
   });
 }

 export function deletePayable(params) {
   return request({
     url: '/finance/payable/' + params,
     method: 'delete',
   });
 }

 export function addPayable(params) {
   return request({
     url: '/finance/payable',
     method: 'post',
     data: params
   });
 }
 export function updatePayable(params) {
   return request({
     url: '/finance/payable',
     method: 'put',
     data: params
   });
 }

 export function auditPayable(params) {
   return request({
     url: '/finance/payable/audit',
     method: 'put',
     data: params
   });
 }

 export function submitPayable(status, params) {
   return request({
     url: '/finance/payable/submit/' + status,
     method: 'put',
     data: params
   });
 }