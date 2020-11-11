 /* jshint esversion: 6 */
 import request from '@/utils/request';

 // 查询客户产品信息
 export function listProduct(params) {
   return request({
     url: '/basis/clienteleProduct',
     method: 'get',
     params: params
   });
 }

 export function listProductDialog(params) {
   return request({
     url: '/basis/clienteleProduct/list',
     method: 'get',
     params: params
   });
 }

 export function getProduct(params) {
   return request({
     url: '/basis/clienteleProduct/' + params,
     method: 'get',
   });
 }

 export function deleteProduct(params) {
   return request({
     url: '/basis/clienteleProduct/' + params,
     method: 'delete',
   });
 }

 export function addProduct(params) {
   return request({
     url: '/basis/clienteleProduct',
     method: 'post',
     data: params
   });
 }
 export function updateProduct(params) {
   return request({
     url: '/basis/clienteleProduct',
     method: 'put',
     data: params
   });
 }

 export function listClienteleMateriel(params) {
   return request({
     url: '/basis/clienteleProduct/listMateriel',
     method: 'get',
     params: params
   });
 }