 /* jshint esversion: 6 */
 import request from '@/utils/request';

 export function listShipments(params) {
     return request({
         url: '/sales/shipments',
         method: 'get',
         params: params
     });
 }

 export function listOutbound(params) {
     return request({
         url: '/sales/shipments/outbound',
         method: 'get',
         params: params
     });
 }

 export function getShipments(params) {
     return request({
         url: '/sales/shipments/' + params,
         method: 'get',
     });
 }

 export function deleteShipments(params) {
     return request({
         url: '/sales/shipments/' + params,
         method: 'delete',
     });
 }

 export function addAndUpdateShipments(params) {
     return request({
         url: '/sales/shipments',
         method: 'post',
         data: params
     });
 }
 export function updateShipments(params) {
     return request({
         url: '/sales/shipments',
         method: 'put',
         data: params
     });
 }
 export function auditShipments(params) {
     return request({
         url: '/sales/shipments/audit',
         method: 'put',
         data: params
     });
 }

 export function submitShipments(status, params) {
     return request({
         url: '/sales/shipments/submit/' + status,
         method: 'put',
         data: params
     });
 }

 // =====================================出库操作================================================//

 export function updateOutbound(params) {
     return request({
         url: '/sales/shipments/outbound',
         method: 'put',
         data: params
     });
 }
 export function auditOutbound(params) {
     return request({
         url: '/sales/shipments/outbound/audit',
         method: 'put',
         data: params
     });
 }
 // =====================================以下是订单子表操作================================================//
 export function listShipmentsSub(params) {
     return request({
         url: '/sales/shipmentsSub/list',
         method: 'get',
         params: params
     });
 }

 export function getShipmentsSub(params) {
     return request({
         url: '/sales/shipmentsSub/' + params,
         method: 'get',
     });
 }

 export function deleteShipmentsSub(params) {
     return request({
         url: '/sales/shipmentsSub/' + params,
         method: 'delete',
     });
 }

 export function addShipmentsSub(params) {
     return request({
         url: '/sales/shipmentsSub',
         method: 'post',
         data: params
     });
 }
 export function updateShipmentsSub(params) {
     return request({
         url: '/sales/shipmentsSub',
         method: 'put',
         data: params
     });
 }