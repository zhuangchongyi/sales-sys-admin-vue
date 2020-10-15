 /* jshint esversion: 6 */
 import Vue from 'vue';
 import Router from 'vue-router';

 Vue.use(Router);
 export const constantRoutes = [{
         path: '/',
         redirect: '/page/index'
     },
     {
         path: '/',
         component: () => import('@/components/common/Home.vue'),
         children: [{
                 name: '/page/index',
                 path: '/page/index',
                 component: () => import('@/components/page/Dashboard.vue'),
                 meta: {
                     title: '系统首页'
                 }
             },
             {
                 name: '/page/messageTabs',
                 path: '/page/messageTabs',
                 component: () => import('@/components/page/messageTabs.vue'),
                 meta: {
                     title: '消息中心'
                 }
             }, {
                 name: '/page/icon',
                 path: '/page/icon',
                 component: () => import('@/components/page/Icon.vue'),
                 meta: {
                     title: '图标'
                 }
             },
             {
                 path: '/page/404',
                 component: () => import( /* webpackChunkName: "404" */ '@/components/page/404.vue'),
                 meta: {
                     title: '404'
                 }
             },
             {
                 path: '/page/403',
                 component: () => import( /* webpackChunkName: "403" */ '@/components/page/403.vue'),
                 meta: {
                     title: '403'
                 }
             },
             {
                 path: '/page/500',
                 component: () => import( /* webpackChunkName: "500" */ '@/components/page/500.vue'),
                 meta: {
                     title: '500'
                 }
             },
         ]
     },
     {
         name: '/page/login',
         path: '/page/login',
         component: () => import('@/components/page/Login.vue'),
         meta: {
             title: '登录'
         }
     },
     {
         path: '/',
         component: () => import('@/components/common/Home.vue'),
         children: [{
                 name: '/page/basis/clienteleProduct',
                 path: '/page/basis/clienteleProduct',
                 component: () => import('@/components/page/basis/clienteleProduct/index.vue'),
                 meta: {
                     title: '产品客户价',
                     permission: 'basis:clienteleProduct:list'
                 }
             },
             {
                 path: '/page/sales/quotation/add',
                 component: () => import('@/components/page/sales/quotation/add.vue'),
                 meta: {
                     title: '新增报价单',
                     permission: 'sales:quotation:add'
                 }
             },
             {
                 name: '/page/sales/quotation/edit',
                 path: '/page/sales/quotation/edit',
                 component: () => import('@/components/page/sales/quotation/edit.vue'),
                 meta: {
                     title: '修改报价单',
                     permission: 'sales:quotation:edit'

                 }
             },
             {
                 name: "/page/sales/quotation/preview",
                 path: '/page/sales/quotation/preview',
                 component: () => import('@/components/page/sales/quotation/preview.vue'),
                 meta: {
                     title: '查看报价单',
                     permission: 'sales:quotation:preview'

                 }
             }, {
                 name: "/page/sales/quotation/order",
                 path: '/page/sales/quotation/order',
                 component: () => import('@/components/page/sales/quotation/order.vue'),
                 meta: {
                     title: '生成订单',
                     permission: 'sales:quotation:order'

                 }
             },
             {
                 path: '/page/sales/order/add',
                 component: () => import('@/components/page/sales/order/add.vue'),
                 meta: {
                     title: '新增订单',
                     permission: 'sales:order:add'
                 }
             },
             {
                 name: '/page/sales/order/edit',
                 path: '/page/sales/order/edit',
                 component: () => import('@/components/page/sales/order/edit.vue'),
                 meta: {
                     title: '修改订单',
                     permission: 'sales:order:edit'
                 }
             },
             {
                 name: '/page/sales/order/preview',
                 path: '/page/sales/order/preview',
                 component: () => import('@/components/page/sales/order/preview.vue'),
                 meta: {
                     title: '查看订单',
                     permission: 'sales:order:preview'
                 }
             },
             {
                 name: '/page/sales/order/schedule',
                 path: '/page/sales/order/schedule',
                 component: () => import('@/components/page/sales/order/schedule.vue'),
                 meta: {
                     title: '查看订单进度',
                     permission: 'sales:order:schedule'
                 }
             },
             {
                 path: '/page/sales/shipments/add',
                 component: () => import('@/components/page/sales/shipments/add.vue'),
                 meta: {
                     title: '新增发货单',
                     permission: 'sales:shipments:add'
                 }
             },
             {
                 name: '/page/sales/shipments/edit',
                 path: '/page/sales/shipments/edit',
                 component: () => import('@/components/page/sales/shipments/edit.vue'),
                 meta: {
                     title: '修改发货单',
                     permission: 'sales:shipments:edit'
                 }
             },
             {
                 name: '/page/sales/shipments/preview',
                 path: '/page/sales/shipments/preview',
                 component: () => import('@/components/page/sales/shipments/preview.vue'),
                 meta: {
                     title: '查看发货单',
                     permission: 'sales:shipments:preview'
                 }
             },
             {
                 name: '/page/sales/signBack/edit',
                 path: '/page/sales/signBack/edit',
                 component: () => import('@/components/page/sales/signBack/edit.vue'),
                 meta: {
                     title: '修改签回单'
                 }
             },
             {
                 name: '/page/sales/signBack/preview',
                 path: '/page/sales/signBack/preview',
                 component: () => import('@/components/page/sales/signBack/preview.vue'),
                 meta: {
                     title: '查看签回单'
                 }
             },
             {
                 path: '/page/sales/returns/add',
                 component: () => import('@/components/page/sales/returns/add.vue'),
                 meta: {
                     title: '新增退货单'
                 }
             },
             {
                 name: '/page/sales/returns/edit',
                 path: '/page/sales/returns/edit',
                 component: () => import('@/components/page/sales/returns/edit.vue'),
                 meta: {
                     title: '修改退货单'
                 }
             },
             {
                 name: '/page/sales/returns/preview',
                 path: '/page/sales/returns/preview',
                 component: () => import('@/components/page/sales/returns/preview.vue'),
                 meta: {
                     title: '查看退货单'
                 }
             },
             {
                 path: '/page/warehouse/init/add',
                 component: () => import('@/components/page/warehouse/init/add.vue'),
                 meta: {
                     title: '新增初始化'
                 }
             },
             {
                 name: '/page/warehouse/init/edit',
                 path: '/page/warehouse/init/edit',
                 component: () => import('@/components/page/warehouse/init/edit.vue'),
                 meta: {
                     title: '修改初始化'
                 }
             },
             {
                 name: '/page/warehouse/init/preview',
                 path: '/page/warehouse/init/preview',
                 component: () => import('@/components/page/warehouse/init/preview.vue'),
                 meta: {
                     title: '查看初始化'
                 }
             },
             {
                 path: '/page/warehouse/storage/add',
                 component: () => import('@/components/page/warehouse/storage/add.vue'),
                 meta: {
                     title: '新增产品入库单'
                 }
             },
             {
                 name: '/page/warehouse/storage/edit',
                 path: '/page/warehouse/storage/edit',
                 component: () => import('@/components/page/warehouse/storage/edit.vue'),
                 meta: {
                     title: '修改产品入库单'
                 }
             },
             {
                 name: '/page/warehouse/storage/preview',
                 path: '/page/warehouse/storage/preview',
                 component: () => import('@/components/page/warehouse/storage/preview.vue'),
                 meta: {
                     title: '查看产品入库单'
                 }
             },
             {
                 name: '/page/warehouse/outbound/preview',
                 path: '/page/warehouse/outbound/preview',
                 component: () => import('@/components/page/warehouse/outbound/preview.vue'),
                 meta: {
                     title: '查看出库单'
                 }
             },
             {
                 path: '/page/warehouse/inventory/add',
                 component: () => import('@/components/page/warehouse/inventory/add.vue'),
                 meta: {
                     title: '新增盘点单'
                 }
             },
             {
                 name: '/page/warehouse/inventory/edit',
                 path: '/page/warehouse/inventory/edit',
                 component: () => import('@/components/page/warehouse/inventory/edit.vue'),
                 meta: {
                     title: '修改盘点单'
                 }
             },
             {
                 name: '/page/warehouse/inventory/preview',
                 path: '/page/warehouse/inventory/preview',
                 component: () => import('@/components/page/warehouse/inventory/preview.vue'),
                 meta: {
                     title: '查看盘点单'
                 }
             },
             {
                 name: '/page/warehouse/returns/edit',
                 path: '/page/warehouse/returns/edit',
                 component: () => import('@/components/page/warehouse/returns/edit.vue'),
                 meta: {
                     title: '修改退货入库单'
                 }
             },
             {
                 name: '/page/warehouse/returns/preview',
                 path: '/page/warehouse/returns/preview',
                 component: () => import('@/components/page/warehouse/returns/preview.vue'),
                 meta: {
                     title: '查看退货入库单'
                 }
             },
             {
                 path: '/page/warehouse/adjustment/add',
                 component: () => import('@/components/page/warehouse/adjustment/add.vue'),
                 meta: {
                     title: '新增调整单'
                 }
             },
             {
                 name: '/page/warehouse/adjustment/edit',
                 path: '/page/warehouse/adjustment/edit',
                 component: () => import('@/components/page/warehouse/adjustment/edit.vue'),
                 meta: {
                     title: '修改调整单'
                 }
             },
             {
                 name: '/page/warehouse/adjustment/preview',
                 path: '/page/warehouse/adjustment/preview',
                 component: () => import('@/components/page/warehouse/adjustment/preview.vue'),
                 meta: {
                     title: '查看调整单'
                 }
             },
             {
                 path: '/page/warehouse/scrap/add',
                 component: () => import('@/components/page/warehouse/scrap/add.vue'),
                 meta: {
                     title: '新增报废单'
                 }
             },
             {
                 name: '/page/warehouse/scrap/edit',
                 path: '/page/warehouse/scrap/edit',
                 component: () => import('@/components/page/warehouse/scrap/edit.vue'),
                 meta: {
                     title: '修改报废单'
                 }
             },
             {
                 name: '/page/warehouse/scrap/preview',
                 path: '/page/warehouse/scrap/preview',
                 component: () => import('@/components/page/warehouse/scrap/preview.vue'),
                 meta: {
                     title: '查看报废单'
                 }
             },
             //     {
             //       path: '/page/warehouse/standingStock/yprice',
             //       component: () => import('@/components/page/warehouse/standingStock/index.vue'),
             //       meta: {
             //         title: '现存量(有价)'
             //       }
             //     },
             //     {
             //       path: '/page/warehouse/standingStock/nprice',
             //       component: () => import('@/components/page/warehouse/standingStock/index2.vue'),
             //       meta: {
             //         title: '现存量(无价)'
             //       }
             //     },
             //     {
             //       path: '/page/warehouse/tradingRecord',
             //       component: () => import('@/components/page/warehouse/tradingRecord/index.vue'),
             //       meta: {
             //         title: '交易记录'
             //       }
             //     },
             //     {
             //       path: '/page/finance/accountInit',
             //       component: () => import('@/components/page/finance/accountInit/index.vue'),
             //       meta: {
             //         title: '财务初始化'
             //       }
             //     },
             //     {
             //       path: '/page/finance/accountReceivable',
             //       component: () => import('@/components/page/finance/accountReceivable/index.vue'),
             //       meta: {
             //         title: '应收款'
             //       }
             //     },
             //     {
             //       path: '/page/finance/accountReceivable/add',
             //       component: () => import('@/components/page/finance/accountReceivable/add.vue'),
             //       meta: {
             //         title: '新增应收款单'
             //       }
             //     },
             //     {
             //       name: '/page/finance/accountReceivable/edit',
             //       path: '/page/finance/accountReceivable/edit',
             //       component: () => import('@/components/page/finance/accountReceivable/edit.vue'),
             //       meta: {
             //         title: '修改应收款单'
             //       }
             //     },
             //     {
             //       name: '/page/finance/accountReceivable/preview',
             //       path: '/page/finance/accountReceivable/preview',
             //       component: () => import('@/components/page/finance/accountReceivable/preview.vue'),
             //       meta: {
             //         title: '查看应收款单'
             //       }
             //     },
             //     {
             //       path: '/page/finance/accountPayable',
             //       component: () => import('@/components/page/finance/accountPayable/index.vue'),
             //       meta: {
             //         title: '应付款'
             //       }
             //     },
             //     {
             //       path: '/page/finance/collection',
             //       component: () => import('@/components/page/finance/collection/index.vue'),
             //       meta: {
             //         title: '收款'
             //       }
             //     },
             //     {
             //       path: '/page/finance/collection/add',
             //       component: () => import('@/components/page/finance/collection/add.vue'),
             //       meta: {
             //         title: '新增收款单'
             //       }
             //     },
             //     {
             //       name: '/page/finance/collection/edit',
             //       path: '/page/finance/collection/edit',
             //       component: () => import('@/components/page/finance/collection/edit.vue'),
             //       meta: {
             //         title: '修改收款单'
             //       }
             //     },
             //     {
             //       name: '/page/finance/collection/preview',
             //       path: '/page/finance/collection/preview',
             //       component: () => import('@/components/page/finance/collection/preview.vue'),
             //       meta: {
             //         title: '查看收款单'
             //       }
             //     },
             //     {
             //       path: '/page/finance/statements',
             //       component: () => import('@/components/page/finance/statements/index.vue'),
             //       meta: {
             //         title: '对账单'
             //       }
             //     },
         ]
     }
 ];

 export default new Router({
     mode: 'history',
     routes: constantRoutes
 });