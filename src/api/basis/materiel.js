 /* jshint esversion: 6 */
 import request from '@/utils/request';

 export function listMateriel(params) {
   return request({
     url: '/basis/materiel',
     method: 'get',
     params: params
   });
 }

 export function getMateriel(params) {
   return request({
     url: '/basis/materiel/' + params,
     method: 'get',
   });
 }

 export function addMateriel(params) {
   return request({
     url: '/basis/materiel',
     method: 'post',
     data: params
   });
 }

 export function updateMateriel(params) {
   return request({
     url: '/basis/materiel',
     method: 'put',
     data: params
   });
 }

 export function deleteMateriel(params) {
   return request({
     url: '/basis/materiel/' + params,
     method: 'delete',
   });
 }


 export function listAllMateriel(params) {
   return request({
     url: '/basis/materiel/list',
     method: 'get',
     params: params
   });
 }

 export function getMaterielModels(params) {
   return request({
     url: '/basis/materiel/models',
     method: 'get',
     params: params
   });
 }

 export function updateMaterielModels(params) {
   return request({
     url: '/basis/materiel/models',
     method: 'put',
     data: params
   });
 }