import request from '@/utils/request';

// 查询报价单信息
export function listQuotation(params) {
  return request({
    url: '/sales/quotation',
    method: 'get',
    params: params
  });
};

export function getQuotation(params) {
  return request({
    url: '/sales/quotation/' + params,
    method: 'get',
  });
};

export function deleteQuotation(params) {
  return request({
    url: '/sales/quotation/' + params,
    method: 'delete',
  });
};

export function addQuotation(params) {
  return request({
    url: '/sales/quotation',
    method: 'post',
    data: params
  });
};
export function updateQuotation(params) {
  return request({
    url: '/sales/quotation',
    method: 'put',
    data: params
  });
};

export function auditQuotation(params) {
  return request({
    url: '/sales/quotation/audit',
    method: 'put',
    data: params
  });
};

export function submitQuotation(params) {
  return request({
    url: '/sales/quotation/submit',
    method: 'put',
    data: params
  });
};

// =====================================以下是报价子表操作================================================//
export function listQuotationSub(params) {
  return request({
    url: '/sales/quotationSub/list',
    method: 'get',
    params: params
  });
};

export function getQuotationSub(params) {
  return request({
    url: '/sales/quotationSub/' + params,
    method: 'get',
  });
};

export function deleteQuotationSub(params) {
  return request({
    url: '/sales/quotationSub/' + params,
    method: 'delete',
  });
};

export function addQuotationSub(params) {
  return request({
    url: '/sales/quotationSub',
    method: 'post',
    data: params
  });
};
export function updateQuotationSub(params) {
  return request({
    url: '/sales/quotationSub',
    method: 'put',
    data: params
  });
};