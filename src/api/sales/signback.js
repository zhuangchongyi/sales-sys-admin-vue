  import request from '@/utils/request';

  // 查询签回单信息
  export function pageSignback(params) {
      return request({
          url: '/sales/signback',
          method: 'get',
          params: params
      });
  }

  export function getSignback(params) {
      return request({
          url: '/sales/signback/' + params,
          method: 'get',
      });
  }
  export function editSignback(params) {
      return request({
          url: '/sales/signback',
          method: 'put',
          data: params
      });
  }

  export function auditSignback(params) {
      return request({
          url: '/sales/signback/audit',
          method: 'put',
          data: params
      });
  }

  export function clienteleSignback(params) {
      return request({
          url: '/sales/signback/clientele',
          method: 'get',
          params: params
      });
  }

  export function financeSignback(params) {
      return request({
          url: '/sales/signback/finance',
          method: 'get',
          params: params
      });
  }
  // =====================================以下是订单子表操作================================================//
  export function listSignbackSub(params) {
      return request({
          url: '/sales/signbackSub/list',
          method: 'get',
          params: params
      });
  }

  export function financeSignbackSub(params) {
      return request({
          url: '/sales/signbackSub/finance',
          method: 'get',
          params: params
      });
  }