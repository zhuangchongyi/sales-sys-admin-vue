 import request from '@/utils/request';

 export function listWriteoff(params) {
     return request({
         url: '/finance/writeoff',
         method: 'get',
         params: params
     });
 }

 export function getWriteoff(params) {
     return request({
         url: '/finance/writeoff/' + params,
         method: 'get',
     });
 }

 export function deleteWriteoff(params) {
     return request({
         url: '/finance/writeoff/' + params,
         method: 'delete',
     });
 }

 export function addWriteoff(params) {
     return request({
         url: '/finance/writeoff',
         method: 'post',
         data: params
     });
 }
 export function updateWriteoff(params) {
     return request({
         url: '/finance/writeoff',
         method: 'put',
         data: params
     });
 }

 export function auditWriteoff(params) {
     return request({
         url: '/finance/writeoff/audit',
         method: 'put',
         data: params
     });
 }

 export function listWriteoffSub(params) {
     return request({
         url: '/finance/writeoffSub',
         method: 'get',
         params: params
     });
 }