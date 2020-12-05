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
   //  新增修改明细页面
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
         name: "/page/sales/quotation/preview2",
         path: '/page/sales/quotation/preview2',
         component: () => import('@/components/page/sales/quotation/preview2.vue'),
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
         name: '/page/sales/order/preview2',
         path: '/page/sales/order/preview2',
         component: () => import('@/components/page/sales/order/preview2.vue'),
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
           title: '修改签回单',
           permission: 'sales:signback:edit'
         }
       },
       {
         name: '/page/sales/signBack/preview',
         path: '/page/sales/signBack/preview',
         component: () => import('@/components/page/sales/signBack/preview.vue'),
         meta: {
           title: '查看签回单',
           permission: 'sales:signback:preview'
         }
       },
       {
         path: '/page/sales/returns/add',
         component: () => import('@/components/page/sales/returns/add.vue'),
         meta: {
           title: '新增退货单',
           permission: 'sales:returns:add'
         }
       },
       {
         name: '/page/sales/returns/edit',
         path: '/page/sales/returns/edit',
         component: () => import('@/components/page/sales/returns/edit.vue'),
         meta: {
           title: '修改退货单',
           permission: 'sales:returns:edit'
         }
       },
       {
         name: '/page/sales/returns/preview',
         path: '/page/sales/returns/preview',
         component: () => import('@/components/page/sales/returns/preview.vue'),
         meta: {
           title: '查看退货单',
           permission: 'sales:returns:preview'
         }
       },
       {
         path: '/page/warehouse/init/add',
         component: () => import('@/components/page/warehouse/init/add.vue'),
         meta: {
           title: '新增初始化',
           permission: 'warehouse:init:add'
         }
       },
       {
         name: '/page/warehouse/init/edit',
         path: '/page/warehouse/init/edit',
         component: () => import('@/components/page/warehouse/init/edit.vue'),
         meta: {
           title: '修改初始化',
           permission: 'warehouse:init:edit'
         }
       },
       {
         name: '/page/warehouse/init/preview',
         path: '/page/warehouse/init/preview',
         component: () => import('@/components/page/warehouse/init/preview.vue'),
         meta: {
           title: '查看初始化',
           permission: 'warehouse:init:preview'
         }
       },
       {
         path: '/page/warehouse/storage/add',
         component: () => import('@/components/page/warehouse/storage/add.vue'),
         meta: {
           title: '新增产品入库单',
           permission: 'warehouse:storage:add'
         }
       },
       {
         name: '/page/warehouse/storage/edit',
         path: '/page/warehouse/storage/edit',
         component: () => import('@/components/page/warehouse/storage/edit.vue'),
         meta: {
           title: '修改产品入库单',
           permission: 'warehouse:storage:edit'
         }
       },
       {
         name: '/page/warehouse/storage/preview',
         path: '/page/warehouse/storage/preview',
         component: () => import('@/components/page/warehouse/storage/preview.vue'),
         meta: {
           title: '查看产品入库单',
           permission: 'warehouse:storage:preview'
         }
       },
       {
         name: '/page/warehouse/otherOutbound/preview',
         path: '/page/warehouse/otherOutbound/preview',
         component: () => import('@/components/page/warehouse/otherOutbound/preview.vue'),
         meta: {
           title: '查看其他出库单',
           permission: 'warehouse:otherOutbound:preview'
         }
       },
       {
         path: '/page/warehouse/otherOutbound/add',
         component: () => import('@/components/page/warehouse/otherOutbound/add.vue'),
         meta: {
           title: '新增其他出库单',
           permission: 'warehouse:otherOutbound:add'
         }
       },
       {
         name: '/page/warehouse/otherOutbound/edit',
         path: '/page/warehouse/otherOutbound/edit',
         component: () => import('@/components/page/warehouse/otherOutbound/edit.vue'),
         meta: {
           title: '修改其他出库单',
           permission: 'warehouse:otherOutbound:edit'
         }
       },
       {
         name: '/page/warehouse/outbound/preview',
         path: '/page/warehouse/outbound/preview',
         component: () => import('@/components/page/warehouse/outbound/preview.vue'),
         meta: {
           title: '查看出库单',
           permission: 'warehouse:outbound:preview'
         }
       },
       {
         name: '/page/warehouse/outbound/edit',
         path: '/page/warehouse/outbound/edit',
         component: () => import('@/components/page/warehouse/outbound/edit.vue'),
         meta: {
           title: '修改出库单',
           permission: 'warehouse:outbound:edit'
         }
       },
       {
         path: '/page/warehouse/inventory/add',
         component: () => import('@/components/page/warehouse/inventory/add.vue'),
         meta: {
           title: '新增盘点单',
           permission: 'warehouse:inventory:add'
         }
       },
       {
         name: '/page/warehouse/inventory/edit',
         path: '/page/warehouse/inventory/edit',
         component: () => import('@/components/page/warehouse/inventory/edit.vue'),
         meta: {
           title: '修改盘点单',
           permission: 'warehouse:inventory:edit'
         }
       },
       {
         name: '/page/warehouse/inventory/preview',
         path: '/page/warehouse/inventory/preview',
         component: () => import('@/components/page/warehouse/inventory/preview.vue'),
         meta: {
           title: '查看盘点单',
           permission: 'warehouse:inventory:preview'
         }
       },
       {
         name: '/page/warehouse/returns/edit',
         path: '/page/warehouse/returns/edit',
         component: () => import('@/components/page/warehouse/returns/edit.vue'),
         meta: {
           title: '修改退货入库单',
           permission: 'warehouse:returns:edit'
         }
       },
       {
         name: '/page/warehouse/returns/preview',
         path: '/page/warehouse/returns/preview',
         component: () => import('@/components/page/warehouse/returns/preview.vue'),
         meta: {
           title: '查看退货入库单',
           permission: 'warehouse:returns:preview'
         }
       },
       {
         path: '/page/warehouse/adjustment/add',
         component: () => import('@/components/page/warehouse/adjustment/add.vue'),
         meta: {
           title: '新增调整单',
           permission: 'warehouse:adjustment:add'
         }
       },
       {
         name: '/page/warehouse/adjustment/edit',
         path: '/page/warehouse/adjustment/edit',
         component: () => import('@/components/page/warehouse/adjustment/edit.vue'),
         meta: {
           title: '修改调整单',
           permission: 'warehouse:adjustment:edit'
         }
       },
       {
         name: '/page/warehouse/adjustment/preview',
         path: '/page/warehouse/adjustment/preview',
         component: () => import('@/components/page/warehouse/adjustment/preview.vue'),
         meta: {
           title: '查看调整单',
           permission: 'warehouse:adjustment:preview'
         }
       },
       {
         path: '/page/warehouse/scrap/add',
         component: () => import('@/components/page/warehouse/scrap/add.vue'),
         meta: {
           title: '新增报废单',
           permission: 'warehouse:scrap:add'
         }
       },
       {
         name: '/page/warehouse/scrap/edit',
         path: '/page/warehouse/scrap/edit',
         component: () => import('@/components/page/warehouse/scrap/edit.vue'),
         meta: {
           title: '修改报废单',
           permission: 'warehouse:scrap:edit'
         }
       },
       {
         name: '/page/warehouse/scrap/preview',
         path: '/page/warehouse/scrap/preview',
         component: () => import('@/components/page/warehouse/scrap/preview.vue'),
         meta: {
           title: '查看报废单',
           permission: 'warehouse:scrap:preview'
         }
       },
       {
         path: '/page/finance/init/add',
         name: '/page/finance/init/add',
         component: () => import('@/components/page/finance/init/add.vue'),
         meta: {
           title: '新增财务初始化',
           permission: 'finance:init:add'
         }
       },
       {
         path: '/page/finance/init/edit',
         name: '/page/finance/init/edit',
         component: () => import('@/components/page/finance/init/edit.vue'),
         meta: {
           title: '修改财务初始化',
           permission: 'finance:init:edit'
         }
       },
       {
         path: '/page/finance/init/preview',
         name: '/page/finance/init/preview',
         component: () => import('@/components/page/finance/init/preview.vue'),
         meta: {
           title: '查看财务初始化',
           permission: 'finance:init:preview'
         }
       },
       {
         name: '/page/finance/receivable/edit',
         path: '/page/finance/receivable/edit',
         component: () => import('@/components/page/finance/receivable/edit.vue'),
         meta: {
           title: '修改应收款单',
           permission: 'finance:receivable:edit'
         }
       },
       {
         name: '/page/finance/receivable/add',
         path: '/page/finance/receivable/add',
         component: () => import('@/components/page/finance/receivable/add.vue'),
         meta: {
           title: '新增应收款单',
           permission: 'finance:receivable:add'
         }
       },
       {
         name: '/page/finance/receivable/preview',
         path: '/page/finance/receivable/preview',
         component: () => import('@/components/page/finance/receivable/preview.vue'),
         meta: {
           title: '查看应收款单',
           permission: 'finance:receivable:preview'
         }
       },
       {
         path: '/page/finance/receipt/add',
         component: () => import('@/components/page/finance/receipt/add.vue'),
         meta: {
           title: '新增收款单',
           permission: 'finance:receipt:add'
         }
       },
       {
         name: '/page/finance/receipt/edit',
         path: '/page/finance/receipt/edit',
         component: () => import('@/components/page/finance/receipt/edit.vue'),
         meta: {
           title: '修改收款单',
           permission: 'finance:receipt:edit'
         }
       },
       {
         name: '/page/finance/receipt/preview',
         path: '/page/finance/receipt/preview',
         component: () => import('@/components/page/finance/receipt/preview.vue'),
         meta: {
           title: '查看收款单',
           permission: 'finance:receipt:preview'
         }
       },
       {
         name: '/page/finance/writeoff/add',
         path: '/page/finance/writeoff/add',
         component: () => import('@/components/page/finance/writeoff/add.vue'),
         meta: {
           title: '新增核销',
           permission: 'finance:writeoff:add'
         }
       },
       {
         name: '/page/finance/writeoff/preview',
         path: '/page/finance/writeoff/preview',
         component: () => import('@/components/page/finance/writeoff/preview.vue'),
         meta: {
           title: '查看核销',
           permission: 'finance:writeoff:preview'
         }
       },
       {
         name: '/page/purchase/order/add',
         path: '/page/purchase/order/add',
         component: () => import('@/components/page/purchase/order/add.vue'),
         meta: {
           title: '新增采购订单',
           permission: 'purchase:order:add'
         }
       },
       {
         name: '/page/purchase/order/preview',
         path: '/page/purchase/order/preview',
         component: () => import('@/components/page/purchase/order/preview.vue'),
         meta: {
           title: '查看采购订单',
           permission: 'purchase:order:preview'
         }
       },
       {
         name: '/page/purchase/order/edit',
         path: '/page/purchase/order/edit',
         component: () => import('@/components/page/purchase/order/edit.vue'),
         meta: {
           title: '修改采购订单',
           permission: 'purchase:order:edit'
         }
       },
       {
         name: '/page/purchase/sign/add',
         path: '/page/purchase/sign/add',
         component: () => import('@/components/page/purchase/sign/add.vue'),
         meta: {
           title: '新增采购订单',
           permission: 'purchase:order:add'
         }
       },
       {
         name: '/page/purchase/sign/preview',
         path: '/page/purchase/sign/preview',
         component: () => import('@/components/page/purchase/sign/preview.vue'),
         meta: {
           title: '查看采购订单',
           permission: 'purchase:order:preview'
         }
       },
       {
         name: '/page/purchase/sign/edit',
         path: '/page/purchase/sign/edit',
         component: () => import('@/components/page/purchase/sign/edit.vue'),
         meta: {
           title: '修改采购订单',
           permission: 'purchase:order:edit'
         }
       },
     ]
   }
 ];

 export default new Router({
   mode: 'history',
   routes: constantRoutes
 });