import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Login from '@/views/common/Login'
import LoginEN from '@/views/common/LoginEN'
import Index from '@/views/common/Index'
import Home from '@/views/home/Home'
import Exhprediction from '@/views/prediction/exhprediction/Exhprediction'
import ExhpredictionApprove from '@/views/prediction/exhprediction/ExhpredictionApprove'
import Exhibitor from '@/views/prediction/exhibitor/Exhibitor'
import VenuePlan from '@/views/venue/plan/Plan'
import VenueTrader from '@/views/venue/trader/Trader'
import Position from '@/views/booth/position/Position'
import PositionDesign from '@/views/booth/design/PositionDesign'
import PositionType from '@/views/booth/type/PositionType'
import StatisticalProduct from '@/views/statistical/product/StatisticalProduct'
import StatisticalArea from '@/views/statistical/area/StatisticalArea'
import StatisticalConfirm from '@/views/statistical/confirm/StatisticalConfirm'
import BoothLog from '@/views/log/booth/BoothLog'
import SmsLog from '@/views/log/sms/SmsLog'
import User from '@/views/system/user/User'
import Role from '@/views/system/role/Role'
import Resource from '@/views/system/resource/Resource'
import Permission from '@/views/system/permission/Permission'
import Codelist from '@/views/system/codelist/Codelist'
import Mail from '@/views/system/mail/Mail'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      children: [
        {
          path: '/login/ch/Phone',
          name: 'login/ch/Phone',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/ch/Phone'], resolve)
        },
        {
          path: '/login/ch/Mailbox',
          name: 'login/ch/Mailbox',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/ch/Mailbox'], resolve)
        },
        {
          path: '/login/ch/Administrator',
          name: 'login/ch/Administrator',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/ch/Administrator'], resolve)
        },
        {
          path: '/login/ch/Reset',
          name: 'login/ch/Reset',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/ch/Reset'], resolve)
        },
        {
          path: '/login/ch/ForgetPassword',
          name: 'login/ch/ForgetPassword',
          meta: {auth: true, title: "忘记用户名", operation: true},
          component: resolve => require(['@/views/login/ch/ForgetPassword'], resolve)
        },
        {
          path: '/login/ch/ForgetUsername',
          name: 'login/ch/ForgetUsername',
          meta: {auth: true, title: "忘记密码", operation: true},
          component: resolve => require(['@/views/login/ch/ForgetUsername'], resolve)
        },
        {
          path: '/login/ch/Register',
          name: 'login/ch/Register',
          meta: {auth: true, title: "用户注册", operation: true},
          component: resolve => require(['@/views/login/ch/Register'], resolve)
        },
        {
          path: '/login/ch/Login',
          name: 'login/ch/Login',
          meta: {auth: true, title: "用户登录", operation: true},
          component: resolve => require(['@/views/login/ch/Login'], resolve)
        }
      ],
      redirect:'/login/ch/Login'
    },
    {
      path: '/',
      name: 'loginEN',
      component: LoginEN,
      children: [
        {
          path: '/login/en/Phone',
          name: 'login/en/Phone',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/en/Phone'], resolve)
        },
        {
          path: '/login/en/Mailbox',
          name: 'login/en/Mailbox',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/en/Mailbox'], resolve)
        },
        {
          path: '/login/en/Administrator',
          name: 'login/en/Administrator',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/en/Administrator'], resolve)
        },
        {
          path: '/login/en/Reset',
          name: 'login/en/Reset',
          meta: {auth: true, title: "账户重置", operation: true},
          component: resolve => require(['@/views/login/en/Reset'], resolve)
        },
        {
          path: '/login/en/ForgetPassword',
          name: 'login/en/ForgetPassword',
          meta: {auth: true, title: "忘记用户名", operation: true},
          component: resolve => require(['@/views/login/en/ForgetPassword'], resolve)
        },
        {
          path: '/login/en/ForgetUsername',
          name: 'login/en/ForgetUsername',
          meta: {auth: true, title: "忘记密码", operation: true},
          component: resolve => require(['@/views/login/en/ForgetUsername'], resolve)
        },
        {
          path: '/login/en/Register',
          name: 'login/en/Register',
          meta: {auth: true, title: "用户注册", operation: true},
          component: resolve => require(['@/views/login/en/Register'], resolve)
        },
        {
          path: '/login/en/Login',
          name: 'login/en/Login',
          meta: {auth: true, title: "用户登录", operation: true},
          component: resolve => require(['@/views/login/en/Login'], resolve)
        }
      ],
      redirect:'/login/en/Login'
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
              component: resolve => require(['@/views/prediction/exhprediction/Exhprediction'], resolve)
            },
            {
              path: '/prediction/exhprediction/edit',
              name: 'exhpredictionEdit',
              component: resolve => require(['@/views/prediction/exhprediction/ExhpredictionEdit'], resolve)
            },
            {
              path: '/prediction/exhprediction/edit_ENG',
              name: 'exhpredictionEdit_ENG',
              component: resolve => require(['@/views/prediction/exhprediction/ExhpredictionEdit_ENG'], resolve)
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
              component: resolve => require(['@/views/prediction/exhprediction/ExhpredictionApprove'], resolve)
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
              component: resolve => require(['@/views/prediction/exhibitor/ExhibitorList'], resolve)
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
              component: resolve => require(['@/views/venue/plan/Plan'], resolve)
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
              component: resolve => require(['@/views/venue/trader/Trader'], resolve)
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
              component: resolve => require(['@/views/booth/position/Position'], resolve)
            },
          ]
        },
        //----------展位管理-展位设计----------
        {
          path: '/booth/positionDesign',
          meta: {auth: true, title: "展位设计"},
          component: resolve => require(['@/views/ploter/Plot'], resolve)
          // component: PositionDesign,
          // children: [
          //   {
          //     path: '/',
          //     name: 'positionDesign',
          //     //component: resolve => require(['@/views/booth/design/PositionDesign'], resolve)
          //     component: resolve => require(['@/views/ploter/Plot'], resolve),
          //     props: true
          //   }
          // ]
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
              component: resolve => require(['@/views/booth/type/PositionType'], resolve)
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
              component: resolve => require(['@/views/statistical/product/StatisticalProduct'], resolve)
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
              component: resolve => require(['@/views/statistical/area/StatisticalArea'], resolve)
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
              component: resolve => require(['@/views/statistical/confirm/StatisticalConfirm'], resolve)
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
              component: resolve => require(['@/views/log/booth/BoothLog'], resolve)
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
              component: resolve => require(['@/views/log/sms/SmsLog'], resolve)
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
              component: resolve => require(['@/views/system/user/UserList'], resolve)
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
              component: resolve => require(['@/views/system/role/RoleList'], resolve)
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
              component: resolve => require(['@/views/system/resource/ResourceList'], resolve)
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
              component: resolve => require(['@/views/system/permission/PermissionList'], resolve)
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
              component: resolve => require(['@/views/system/codelist/CodelistList'], resolve)
            },
            {
              path: '/system/codelist/detail',
              name: 'codelist/detail',
              component: resolve => require(['@/views/system/codelist/CodelistDetail'], resolve)
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
              component: resolve => require(['@/views/system/mail/Mail'], resolve)
            },
          ]
        }
      ]
    },
  ]
})

export default router