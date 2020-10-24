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
                 name: '/page/warehouse/otherOutbound/preview',
                 path: '/page/warehouse/otherOutbound/preview',
                 component: () => import('@/components/page/warehouse/otherOutbound/preview.vue'),
                 meta: {
                     title: '查看其他出库单'
                 }
             },
             {
                 path: '/page/warehouse/otherOutbound/add',
                 component: () => import('@/components/page/warehouse/otherOutbound/add.vue'),
                 meta: {
                     title: '新增其他出库单'
                 }
             },
             {
                 name: '/page/warehouse/otherOutbound/edit',
                 path: '/page/warehouse/otherOutbound/edit',
                 component: () => import('@/components/page/warehouse/otherOutbound/edit.vue'),
                 meta: {
                     title: '修改其他出库单'
                 }
             },
             {
                 name: '/page/warehouse/otherOutbound/preview',
                 path: '/page/warehouse/otherOutbound/preview',
                 component: () => import('@/components/page/warehouse/otherOutbound/preview.vue'),
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
             {
                 path: '/page/finance/init/add',
                 name: '/page/finance/init/add',
                 component: () => import('@/components/page/finance/init/add.vue'),
                 meta: {
                     title: '新增财务初始化'
                 }
             },
             {
                 path: '/page/finance/init/edit',
                 name: '/page/finance/init/edit',
                 component: () => import('@/components/page/finance/init/edit.vue'),
                 meta: {
                     title: '修改财务初始化'
                 }
             },
             {
                 path: '/page/finance/init/preview',
                 name: '/page/finance/init/preview',
                 component: () => import('@/components/page/finance/init/preview.vue'),
                 meta: {
                     title: '查看财务初始化'
                 }
             },
             {
                 name: '/page/finance/receivable/edit',
                 path: '/page/finance/receivable/edit',
                 component: () => import('@/components/page/finance/receivable/edit.vue'),
                 meta: {
                     title: '修改应收款单'
                 }
             },
             {
                 name: '/page/finance/receivable/add',
                 path: '/page/finance/receivable/add',
                 component: () => import('@/components/page/finance/receivable/add.vue'),
                 meta: {
                     title: '新增应收款单'
                 }
             },
             {
                 name: '/page/finance/receivable/preview',
                 path: '/page/finance/receivable/preview',
                 component: () => import('@/components/page/finance/receivable/preview.vue'),
                 meta: {
                     title: '查看应收款单'
                 }
             },
             {
                 name: '/page/finance/receivable/receipt',
                 path: '/page/finance/receivable/receipt',
                 component: () => import('@/components/page/finance/receivable/receipt.vue'),
                 meta: {
                     title: '收款'
                 }
             },
             {
                 path: '/page/finance/receipt/add',
                 component: () => import('@/components/page/finance/receipt/add.vue'),
                 meta: {
                     title: '新增收款单'
                 }
             },
             {
                 name: '/page/finance/receipt/edit',
                 path: '/page/finance/receipt/edit',
                 component: () => import('@/components/page/finance/receipt/edit.vue'),
                 meta: {
                     title: '修改收款单'
                 }
             },
             {
                 name: '/page/finance/receipt/preview',
                 path: '/page/finance/receipt/preview',
                 component: () => import('@/components/page/finance/receipt/preview.vue'),
                 meta: {
                     title: '查看收款单'
                 }
             }, {
                 name: '/page/finance/receipt/verifica',
                 path: '/page/finance/receipt/verifica',
                 component: () => import('@/components/page/finance/receipt/verifica.vue'),
                 meta: {
                     title: '核销收款单'
                 }
             },
         ]
     }
 ];

 export default new Router({
     mode: 'history',
     routes: constantRoutes
 });