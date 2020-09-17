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
  // {
  //   path: '/',
  //   component: () => import('@/components/common/Home.vue'),
  //   children: [{
  //       path: '/page/system/role',
  //       component: () => import('@/components/page/system/role/index.vue'),
  //       meta: {
  //         title: '角色管理'
  //       }
  //     },
  //     {
  //       path: '/page/system/dept',
  //       component: () => import('@/components/page/system/dept/index.vue'),
  //       meta: {
  //         title: '部门管理'
  //       }
  //     },
  //     {
  //       path: '/page/system/user',
  //       component: () => import('@/components/page/system/user/index.vue'),
  //       meta: {
  //         title: '用户档案'
  //       }
  //     },
  //     {
  //       path: '/page/basis/personnel',
  //       component: () => import('@/components/page/basis/personnel/index.vue'),
  //       meta: {
  //         title: '人员档案'
  //       }
  //     },
  //     {
  //       path: '/page/basis/materiel',
  //       component: () => import('@/components/page/basis/materiel/index.vue'),
  //       meta: {
  //         title: '产品档案'
  //       }
  //     },
  //     {
  //       path: '/page/basis/materielType',
  //       component: () => import('@/components/page/basis/materielType/index.vue'),
  //       meta: {
  //         title: '产品类别'
  //       }
  //     },
  //     {
  //       path: '/page/basis/warehouse',
  //       component: () => import('@/components/page/basis/warehouse/index.vue'),
  //       meta: {
  //         title: '仓库管理'
  //       }
  //     },
  //     {
  //       path: '/page/basis/units',
  //       component: () => import('@/components/page/basis/units/index.vue'),
  //       meta: {
  //         title: '单位管理'
  //       }
  //     },
  //     {
  //       path: '/page/basis/clientele',
  //       component: () => import('@/components/page/basis/clientele/index.vue'),
  //       meta: {
  //         title: '客户档案'
  //       }
  //     },
  //     {
  //       path: '/page/basis/clienteleType',
  //       component: () => import('@/components/page/basis/clienteleType/index.vue'),
  //       meta: {
  //         title: '客户类别'
  //       }
  //     },
  //     {
  //       name: '/page/basis/clienteleProduct',
  //       path: '/page/basis/clienteleProduct',
  //       component: () => import('@/components/page/basis/clienteleProduct/index.vue'),
  //       meta: {
  //         title: '产品客户价'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesPrice',
  //       component: () => import('@/components/page/sales/salesPrice/index.vue'),
  //       meta: {
  //         title: '销售报价'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesPrice/add',
  //       component: () => import('@/components/page/sales/salesPrice/add.vue'),
  //       meta: {
  //         title: '新增报价单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesPrice/edit',
  //       path: '/page/sales/salesPrice/edit',
  //       component: () => import('@/components/page/sales/salesPrice/edit.vue'),
  //       meta: {
  //         title: '修改报价单'
  //       }
  //     },
  //     {
  //       name: "/page/sales/salesPrice/preview",
  //       path: '/page/sales/salesPrice/preview',
  //       component: () => import('@/components/page/sales/salesPrice/preview.vue'),
  //       meta: {
  //         title: '查看报价单'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesOrder',
  //       component: () => import('@/components/page/sales/salesOrder/index.vue'),
  //       meta: {
  //         title: '销售订单'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesOrder/add',
  //       component: () => import('@/components/page/sales/salesOrder/add.vue'),
  //       meta: {
  //         title: '新增订单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesOrder/edit',
  //       path: '/page/sales/salesOrder/edit',
  //       component: () => import('@/components/page/sales/salesOrder/edit.vue'),
  //       meta: {
  //         title: '修改订单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesOrder/preview',
  //       path: '/page/sales/salesOrder/preview',
  //       component: () => import('@/components/page/sales/salesOrder/preview.vue'),
  //       meta: {
  //         title: '查看订单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesOrder/schedule',
  //       path: '/page/sales/salesOrder/schedule',
  //       component: () => import('@/components/page/sales/salesOrder/schedule.vue'),
  //       meta: {
  //         title: '查看订单进度'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesShipments',
  //       component: () => import('@/components/page/sales/salesShipments/index.vue'),
  //       meta: {
  //         title: '销售发货'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesShipments/add',
  //       component: () => import('@/components/page/sales/salesShipments/add.vue'),
  //       meta: {
  //         title: '新增发货单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesShipments/edit',
  //       path: '/page/sales/salesShipments/edit',
  //       component: () => import('@/components/page/sales/salesShipments/edit.vue'),
  //       meta: {
  //         title: '修改发货单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesShipments/preview',
  //       path: '/page/sales/salesShipments/preview',
  //       component: () => import('@/components/page/sales/salesShipments/preview.vue'),
  //       meta: {
  //         title: '查看发货单'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesSignBack',
  //       component: () => import('@/components/page/sales/salesSignBack/index.vue'),
  //       meta: {
  //         title: '销售签回'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesSignBack/add',
  //       component: () => import('@/components/page/sales/salesSignBack/add.vue'),
  //       meta: {
  //         title: '新增签回单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesSignBack/edit',
  //       path: '/page/sales/salesSignBack/edit',
  //       component: () => import('@/components/page/sales/salesSignBack/edit.vue'),
  //       meta: {
  //         title: '修改签回单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesSignBack/preview',
  //       path: '/page/sales/salesSignBack/preview',
  //       component: () => import('@/components/page/sales/salesSignBack/preview.vue'),
  //       meta: {
  //         title: '查看签回单'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesReturns',
  //       component: () => import('@/components/page/sales/salesReturns/index.vue'),
  //       meta: {
  //         title: '销售退货'
  //       }
  //     },
  //     {
  //       path: '/page/sales/salesReturns/add',
  //       component: () => import('@/components/page/sales/salesReturns/add.vue'),
  //       meta: {
  //         title: '新增退货单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesReturns/edit',
  //       path: '/page/sales/salesReturns/edit',
  //       component: () => import('@/components/page/sales/salesReturns/edit.vue'),
  //       meta: {
  //         title: '修改退货单'
  //       }
  //     },
  //     {
  //       name: '/page/sales/salesReturns/preview',
  //       path: '/page/sales/salesReturns/preview',
  //       component: () => import('@/components/page/sales/salesReturns/preview.vue'),
  //       meta: {
  //         title: '查看退货单'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/init',
  //       component: () => import('@/components/page/warehouse/init/index.vue'),
  //       meta: {
  //         title: '初始化'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/init/add',
  //       component: () => import('@/components/page/warehouse/init/add.vue'),
  //       meta: {
  //         title: '新增初始化'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/init/edit',
  //       path: '/page/warehouse/init/edit',
  //       component: () => import('@/components/page/warehouse/init/edit.vue'),
  //       meta: {
  //         title: '修改初始化'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/init/preview',
  //       path: '/page/warehouse/init/preview',
  //       component: () => import('@/components/page/warehouse/init/preview.vue'),
  //       meta: {
  //         title: '查看初始化'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/materialStorage',
  //       component: () => import('@/components/page/warehouse/materialStorage/index.vue'),
  //       meta: {
  //         title: '产品入库'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/materialStorage/add',
  //       component: () => import('@/components/page/warehouse/materialStorage/add.vue'),
  //       meta: {
  //         title: '新增产品入库单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/materialStorage/edit',
  //       path: '/page/warehouse/materialStorage/edit',
  //       component: () => import('@/components/page/warehouse/materialStorage/edit.vue'),
  //       meta: {
  //         title: '修改产品入库单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/materialStorage/preview',
  //       path: '/page/warehouse/materialStorage/preview',
  //       component: () => import('@/components/page/warehouse/materialStorage/preview.vue'),
  //       meta: {
  //         title: '查看产品入库单'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/salesOutbound',
  //       component: () => import('@/components/page/warehouse/salesOutbound/index.vue'),
  //       meta: {
  //         title: '销售出库'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/salesOutbound/add',
  //       component: () => import('@/components/page/warehouse/salesOutbound/add.vue'),
  //       meta: {
  //         title: '新增出库单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/salesOutbound/edit',
  //       path: '/page/warehouse/salesOutbound/edit',
  //       component: () => import('@/components/page/warehouse/salesOutbound/edit.vue'),
  //       meta: {
  //         title: '修改出库单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/salesOutbound/preview',
  //       path: '/page/warehouse/salesOutbound/preview',
  //       component: () => import('@/components/page/warehouse/salesOutbound/preview.vue'),
  //       meta: {
  //         title: '查看出库单'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/takeStock',
  //       component: () => import('@/components/page/warehouse/takeStock/index.vue'),
  //       meta: {
  //         title: '盘点'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/takeStock/add',
  //       component: () => import('@/components/page/warehouse/takeStock/add.vue'),
  //       meta: {
  //         title: '新增盘点单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/takeStock/edit',
  //       path: '/page/warehouse/takeStock/edit',
  //       component: () => import('@/components/page/warehouse/takeStock/edit.vue'),
  //       meta: {
  //         title: '修改盘点单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/takeStock/preview',
  //       path: '/page/warehouse/takeStock/preview',
  //       component: () => import('@/components/page/warehouse/takeStock/preview.vue'),
  //       meta: {
  //         title: '查看盘点单'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/returnsStorage',
  //       component: () => import('@/components/page/warehouse/returnsStorage/index.vue'),
  //       meta: {
  //         title: '退货入库'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/returnsStorage/add',
  //       component: () => import('@/components/page/warehouse/returnsStorage/add.vue'),
  //       meta: {
  //         title: '新增退货入库单'
  //       }
  //     }, {
  //       name: '/page/warehouse/returnsStorage/edit',
  //       path: '/page/warehouse/returnsStorage/edit',
  //       component: () => import('@/components/page/warehouse/returnsStorage/edit.vue'),
  //       meta: {
  //         title: '修改退货入库单'
  //       }
  //     }, {
  //       name: '/page/warehouse/returnsStorage/preview',
  //       path: '/page/warehouse/returnsStorage/preview',
  //       component: () => import('@/components/page/warehouse/returnsStorage/preview.vue'),
  //       meta: {
  //         title: '查看退货入库单'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/adjustment',
  //       component: () => import('@/components/page/warehouse/adjustment/index.vue'),
  //       meta: {
  //         title: '调整'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/adjustment/add',
  //       component: () => import('@/components/page/warehouse/adjustment/add.vue'),
  //       meta: {
  //         title: '新增调整单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/adjustment/edit',
  //       path: '/page/warehouse/adjustment/edit',
  //       component: () => import('@/components/page/warehouse/adjustment/edit.vue'),
  //       meta: {
  //         title: '修改调整单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/adjustment/preview',
  //       path: '/page/warehouse/adjustment/preview',
  //       component: () => import('@/components/page/warehouse/adjustment/preview.vue'),
  //       meta: {
  //         title: '查看调整单'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/scrap',
  //       component: () => import('@/components/page/warehouse/scrap/index.vue'),
  //       meta: {
  //         title: '报废'
  //       }
  //     },
  //     {
  //       path: '/page/warehouse/scrap/add',
  //       component: () => import('@/components/page/warehouse/scrap/add.vue'),
  //       meta: {
  //         title: '新增报废单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/scrap/edit',
  //       path: '/page/warehouse/scrap/edit',
  //       component: () => import('@/components/page/warehouse/scrap/edit.vue'),
  //       meta: {
  //         title: '修改报废单'
  //       }
  //     },
  //     {
  //       name: '/page/warehouse/scrap/preview',
  //       path: '/page/warehouse/scrap/preview',
  //       component: () => import('@/components/page/warehouse/scrap/preview.vue'),
  //       meta: {
  //         title: '查看报废单'
  //       }
  //     },
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
  //   ]
  // },
  // {
  //   path: '*',
  //   redirect: '/page/404',
  //   meta: {
  //     title: '404'
  //   }
  // }
]

export default new Router({
  mode: 'history',
  routes: constantRoutes
});