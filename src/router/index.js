import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Login from '@/views/common/Login'
import Index from '@/views/common/Index'
import Home from '@/views/home/Home'
import Exhprediction from '@/views/prediction/Exhprediction'
import ExhpredictionApprove from '@/views/prediction/ExhpredictionApprove'
import Exhibitor from '@/views/prediction/Exhibitor'
import VenuePlan from '@/views/venue/Plan'
import VenueTrader from '@/views/venue/Trader'
import Position from '@/views/booth/Position'
import PositionType from '@/views/booth/PositionType'
import PositionDesign from '@/views/booth/PositionDesign'
import StatisticalProduct from '@/views/statistical/StatisticalProduct'
import StatisticalArea from '@/views/statistical/StatisticalArea'
import StatisticalConfirm from '@/views/statistical/StatisticalConfirm'
import BoothLog from '@/views/log/BoothLog'
import SmsLog from '@/views/log/SmsLog'
import User from '@/views/system/User'
import Role from '@/views/system/Role'
import Resource from '@/views/system/Resource'
import Permission from '@/views/system/Permission'
import Codelist from '@/views/system/Codelist'
import Mail from '@/views/system/Mail'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      redirect: 'home',
      meta: {auth: true},
      component: Index,
      children: [
        //----------首页----------
        {
          path: '/home',
          meta: {auth: true, title: "首页"},
          component: Home,
          children: [
            {
              path: '/',
              name: 'home',
              component: resolve => require(['@/views/home/homeList'], resolve)
            },
            {
              path: '/home/detail',
              name: 'home/detail',
              meta: {auth: true, title: "首页详情", operation: true},
              component: resolve => require(['@/views/home/homeDetail'], resolve)
            }
          ]
        },
        //----------展会报名管理----------
        {
          path: '/prediction/exhprediction',
          meta: {auth: true, title: "展会报名管理"},
          component: Exhprediction,
          children: [
            {
              path: '/',
              name: 'exhprediction',
              component: resolve => require(['@/views/prediction/Exhprediction'], resolve)
            },
          ]
        },
        //----------展会报名审核----------
        {
          path: '/prediction/exhprediction_approve',
          meta: {auth: true, title: "展会报名审核"},
          component: ExhpredictionApprove,
          children: [
            {
              path: '/',
              name: 'exhpredictionApprove',
              component: resolve => require(['@/views/prediction/ExhpredictionApprove'], resolve)
            },
          ]
        },
        //----------展商用户管理----------
        {
          path: '/prediction/exhibitor',
          meta: {auth: true, title: "展商用户管理"},
          component: Exhibitor,
          children: [
            {
              path: '/',
              name: 'exhibitor',
              component: resolve => require(['@/views/prediction/Exhibitor'], resolve)
            },
          ]
        },
        //----------展馆管理-展馆平面图----------
        {
          path: '/plan/plan',
          meta: {auth: true, title: "展馆平面图"},
          component: VenuePlan,
          children: [
            {
              path: '/',
              name: 'plan',
              component: resolve => require(['@/views/venue/Plan'], resolve)
            },
          ]
        },
        //----------展馆管理-展馆管理----------
        {
          path: '/venue/trader',
          meta: {auth: true, title: "展馆管理"},
          component: VenueTrader,
          children: [
            {
              path: '/',
              name: 'trader',
              component: resolve => require(['@/views/venue/Trader'], resolve)
            },
          ]
        },
        //----------展位管理-展位管理----------
        {
          path: '/booth/position',
          meta: {auth: true, title: "展位管理"},
          component: Position,
          children: [
            {
              path: '/',
              name: 'position',
              component: resolve => require(['@/views/booth/Position'], resolve)
            },
          ]
        },
        //----------展位管理-展位设计----------
        {
          path: '/booth/positionDesign',
          meta: {auth: true, title: "展位设计"},
          component: PositionDesign,
          children: [
            {
              path: '/',
              name: 'positionDesign',
              component: resolve => require(['@/views/booth/PositionDesign'], resolve)
            },
          ]
        },
        //----------展位管理-展位分类----------
        {
          path: '/booth/positionType',
          meta: {auth: true, title: "展位分类"},
          component: PositionType,
          children: [
            {
              path: '/',
              name: 'positionType',
              component: resolve => require(['@/views/booth/PositionType'], resolve)
            },
          ]
        },
        //----------统计分析-按产品类型统计----------
        {
          path: '/statistical/statistical_product',
          meta: {auth: true, title: "按产品类型统计"},
          component: StatisticalProduct,
          children: [
            {
              path: '/',
              name: 'statisticalProduct',
              component: resolve => require(['@/views/statistical/StatisticalProduct'], resolve)
            },
          ]
        },
        //----------统计分析-按光地展位面积统计----------
        {
          path: '/statistical/statistical_area',
          meta: {auth: true, title: "按光地展位面积统计"},
          component: StatisticalArea,
          children: [
            {
              path: '/',
              name: 'statisticalArea',
              component: resolve => require(['@/views/statistical/StatisticalArea'], resolve)
            },
          ]
        },
        //----------统计分析-按确认信息统计----------
        {
          path: '/statistical/statistical_confirm',
          meta: {auth: true, title: "按确认信息统计"},
          component: StatisticalConfirm,
          children: [
            {
              path: '/',
              name: 'statisticalConfirm',
              component: resolve => require(['@/views/statistical/StatisticalConfirm'], resolve)
            },
          ]
        },
        //----------日志管理-展位日志----------
        {
          path: '/log/boothLog',
          meta: {auth: true, title: "展位日志"},
          component: BoothLog,
          children: [
            {
              path: '/',
              name: 'boothLog',
              component: resolve => require(['@/views/log/BoothLog'], resolve)
            },
          ]
        },
        //----------日志管理-短信日志----------
        {
          path: '/log/smsLog',
          meta: {auth: true, title: "短信日志"},
          component: SmsLog,
          children: [
            {
              path: '/',
              name: 'smsLog',
              component: resolve => require(['@/views/log/SmsLog'], resolve)
            },
          ]
        },
        //----------系统管理-用户管理----------
        {
          path: '/system/user',
          meta: {auth: true, title: "用户管理"},
          component: User,
          children: [
            {
              path: '/',
              name: 'user',
              component: resolve => require(['@/views/system/User'], resolve)
            },
          ]
        },
        //----------系统管理-角色管理----------
        {
          path: '/system/role',
          meta: {auth: true, title: "角色管理"},
          component: Role,
          children: [
            {
              path: '/',
              name: 'role',
              component: resolve => require(['@/views/system/Role'], resolve)
            },
          ]
        },
        //----------系统管理-资源管理----------
        {
          path: '/system/resource',
          meta: {auth: true, title: "资源管理"},
          component: Resource,
          children: [
            {
              path: '/',
              name: 'resource',
              component: resolve => require(['@/views/system/Resource'], resolve)
            },
          ]
        },
        //----------系统管理-权限管理----------
        {
          path: '/system/permission',
          meta: {auth: true, title: "权限管理"},
          component: Permission,
          children: [
            {
              path: '/',
              name: 'permission',
              component: resolve => require(['@/views/system/Permission'], resolve)
            },
          ]
        },
        //----------系统管理-代码集管理----------
        {
          path: '/system/codelist',
          meta: {auth: true, title: "代码集管理"},
          component: Codelist,
          children: [
            {
              path: '/',
              name: 'codelist',
              component: resolve => require(['@/views/system/Codelist'], resolve)
            },
          ]
        },
        //----------系统管理-邮箱管理----------
        {
          path: '/system/mail',
          meta: {auth: true, title: "邮箱管理"},
          component: Mail,
          children: [
            {
              path: '/',
              name: 'mail',
              component: resolve => require(['@/views/system/Mail'], resolve)
            },
          ]
        }
      ]
    },
  ]
})

export default router