import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/views/common/Login'], resolve)
    },
    {
      path: '/index',
      name: 'index',
      meta: {auth: true},
      component: resolve => require(['@/views/common/Index'], resolve),
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {auth: true, title: "首页"},
          component: resolve => require(['@/views/home/Home'], resolve)
        },
        {
          path: '/prediction/exhprediction',
          name: 'exhprediction',
          meta: {auth: true, title: "展会报名管理"},
          component: resolve => require(['@/views/prediction/Exhprediction'], resolve)
        },
        {
          path: '/prediction/exhprediction_approve',
          name: 'exhpredictionApprove',
          meta: {auth: true, title: "展会报名审核"},
          component: resolve => require(['@/views/prediction/ExhpredictionApprove'], resolve)
        },
        {
          path: '/prediction/exhibitor',
          name: 'exhibitor',
          meta: {auth: true, title: "展商用户管理"},
          component: resolve => require(['@/views/prediction/Exhibitor'], resolve)
        },
        
      ]
    },
    {
      path: '/venue',
      name: 'venue',
      meta: {auth: true, title: "展馆管理", isRedirect: false},
      component: resolve => require(['@/views/common/Index'], resolve),
      children: [
        {
          path: '/plan/plan',
          name: 'plan',
          meta: {auth: true, title: "展馆平面图"},
          component: resolve => require(['@/views/venue/Plan'], resolve)
        },
        {
          path: '/venue/trader',
          name: 'trader',
          meta: {auth: true, title: "展馆管理"},
          component: resolve => require(['@/views/venue/Trader'], resolve)
        },
      ]
    },
    {
      path: '/booth',
      name: 'booth',
      redirect: 'noRedirect',
      meta: {auth: true, title: "展位管理", isRedirect: false},
      component: resolve => require(['@/views/common/Index'], resolve),
      children: [
        {
          path: '/booth/position',
          name: 'position',
          meta: {auth: true, title: "展位管理"},
          component: resolve => require(['@/views/booth/Position'], resolve)
        },
        {
          path: '/booth/position_design',
          name: 'positionDesign',
          meta: {auth: true, title: "展位设计"},
          component: resolve => require(['@/views/booth/PositionDesign'], resolve)
        },
        {
          path: '/booth/positiontype',
          name: 'positionType',
          meta: {auth: true, title: "展位分类"},
          component: resolve => require(['@/views/booth/PositionType'], resolve)
        },
      ]
    },
    {
      path: '/statistical',
      name: 'statistical',
      redirect: 'noRedirect',
      meta: {auth: true, title: "统计分析", isRedirect: false},
      component: resolve => require(['@/views/common/Index'], resolve),
      children: [
        {
          path: '/statistical/statistical_product',
          name: 'statisticalProduct',
          meta: {auth: true, title: "按产品类型统计"},
          component: resolve => require(['@/views/statistical/StatisticalProduct'], resolve)
        },
        {
          path: '/statistical/statistical_area',
          name: 'statistical_area',
          meta: {auth: true, title: "按光地展位面积统计"},
          component: resolve => require(['@/views/statistical/StatisticalArea'], resolve)
        },
        {
          path: '/statistical/statistical_confirm',
          name: 'statisticalConfirm',
          meta: {auth: true, title: "按确认信息统计"},
          component: resolve => require(['@/views/statistical/StatisticalConfirm'], resolve)
        },
      ]
    },
    {
      path: '/system',
      name: 'system',
      redirect: 'noRedirect',
      meta: {auth: true, title: "系统管理", isRedirect: false},
      component: resolve => require(['@/views/common/Index'], resolve),
      children: [
        {
          path: '/system/user',
          name: 'user',
          meta: {auth: true, title: "用户管理"},
          component: resolve => require(['@/views/system/User'], resolve)
        },
        {
          path: '/system/role',
          name: 'role',
          meta: {auth: true, title: "角色管理"},
          component: resolve => require(['@/views/system/Role'], resolve)
        },
        {
          path: '/system/resource',
          name: 'resource',
          meta: {auth: true, title: "资源管理"},
          component: resolve => require(['@/views/system/Resource'], resolve)
        },
        {
          path: '/system/permission',
          name: 'permission',
          meta: {auth: true, title: "权限管理"},
          component: resolve => require(['@/views/system/Permission'], resolve)
        },
        {
          path: '/system/codelist',
          name: 'codelist',
          meta: {auth: true, title: "代码集管理"},
          component: resolve => require(['@/views/system/Codelist'], resolve)
        },
        {
          path: '/system/mail',
          name: 'mail',
          meta: {auth: true, title: "邮箱管理"},
          component: resolve => require(['@/views/system/Mail'], resolve)
        },
      ]
    },
  ]
})

export default router