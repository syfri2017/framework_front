import Index from '@/views/exhibition/common/Index'
import VenuePlan from '@/views/exhibition/venue/plan/Plan'
import VenuePlanEN from '@/views/exhibition/venue/plan/PlanEN'
import PositionAnon from '@/views/exhibition/booth/anon/PositionAnon'
import ExhpredictionEdit from '@/views/exhibition/prediction/exhprediction/ExhpredictionEdit'
import Product from '@/views/exhibition/prediction/exhibitor/Product'
import Confirm from '@/views/exhibition/prediction/exhibitor/Confirm'
import ExhpredictionConfirm from '@/views/exhibition/prediction/exhprediction/ExhpredictionConfirm'
import ExhpredictionEditEN from '@/views/exhibition/prediction/exhprediction/ExhpredictionEdit_ENG'

export default [
  //----------展馆平面图无登录查看----------
  {
    path: '/plan/planAnon',
    meta: {auth: true, title: "展馆平面图"},
    component: VenuePlan,
    children: [
      {
        path: '/',
        name: 'planAnon',
        component: resolve => require(['@/views/exhibition/venue/plan/Plan'], resolve),
      },
    ]
  },
  //----------展馆平面图英文无登录查看----------
  {
    path: '/plan/planAnonEN',
    meta: {auth: true, title: "展馆平面图"},
    component: VenuePlanEN,
    children: [
      {
        path: '/',
        name: 'planAnonEN',
        component: resolve => require(['@/views/exhibition/venue/plan/PlanEN'], resolve),
      },
    ]
  },
  //----------展位无登录查看----------
  {
    path: '/booth/anon',
    meta: {auth: true, title: "展位选择"},
    component: PositionAnon,
    children: [
      {
        path: '/',
        name: 'positionAnon',
        component: resolve => require(['@/views/exhibition/booth/anon/PositionAnon'], resolve)
      },
    ]
  },

  //-------------------------------------------------------中文展商端--------------------------------------------------
  {
    path: '/exhibitor',
    name: 'exhibitor',
    redirect: 'exhprediction',
    meta: {auth: true},
    component: Index,
    children: [
      //--------------展商端报名----------------
      {
        path: '/exhprediction',
        meta: {auth: true, title: "展会报名"},
        component: ExhpredictionEdit,
        children: [
          {
            path: '/',
            name: 'exhpredictionEdit',
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionEdit'], resolve)
          },
        ]
      },
      //----------展商报名-信息确认----------
      {
        path: '/exhprediction/confirm',
        meta: {auth: true, title: "报名信息确认"},
        component: ExhpredictionConfirm,
        children: [
          {
            path: '/',
            name: 'exhpredictionConfirm',
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionConfirm'], resolve)
          },
        ]
      },
      //----------展馆管理-展位选择----------
      {
        path: '/plan/plan',
        meta: {auth: true, title: "展位选择"},
        component: VenuePlan,
        children: [
          {
            path: '/',
            name: 'plan',
            component: resolve => require(['@/views/exhibition/venue/plan/Plan'], resolve),
          },
        ]
      },
      //----------展商端-展位选择----------
      {
        path: '/plan/planEN',
        meta: {auth: true, title: "Booth Selection"},
        component: VenuePlanEN,
        children: [
          {
            path: '/',
            name: 'planEN',
            component: resolve => require(['@/views/exhibition/venue/plan/PlanEN'], resolve),
          },
        ]
      },
      //----------展商端-产品介绍---------
      {
        path: '/exhibitor/product',
        meta: {auth: true, title: "产品介绍"},
        component: Product,
        children: [
          {
            path: '/',
            name: 'exhibitorProduct',
            component: resolve => require(['@/views/exhibition/prediction/exhibitor/ProductList'], resolve)
          },
        ]
      },
      //----------展商端-信息确认---------
      {
        path: '/exhibitor/confirm',
        meta: {auth: true, title: "信息确认"},
        component: Confirm,
        children: [
          {
            path: '/',
            name: 'exhibitorConfirm',
            component: resolve => require(['@/views/exhibition/prediction/exhibitor/ConfirmList'], resolve)
          },
        ]
      }
    ]
  },


  //-------------------------------------------------------英文展商端--------------------------------------------------
  {
    path: '/exhibitorEN',
    name: 'exhibitorEN',
    redirect: 'exhpredictionEN',
    meta: {auth: true},
    component: Index,
    children: [
      //------------------报名英文-----------
      {
        path: '/exhpredictionEN',
        meta: {auth: true, title: "Exhibition Registration"},
        component: ExhpredictionEditEN,
        children: [
          {
            path: '/',
            name: 'exhpredictionEdit_ENG',
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionEdit_ENG'], resolve)
          },
          
        ]
      },
      //----------展馆管理-展位选择----------
      {
        path: '/plan/plan',
        meta: {auth: true, title: "展位选择"},
        component: VenuePlan,
        children: [
          {
            path: '/',
            name: 'plan',
            component: resolve => require(['@/views/exhibition/venue/plan/Plan'], resolve),
          },
        ]
      },
      //----------英文-展商端-产品介绍---------
      {
        path: '/exhibitor/productEN',
        meta: {auth: true, title: "Product Introduction"},
        component: Product,
        children: [
          {
            path: '/',
            name: 'exhibitorProductEN',
            component: resolve => require(['@/views/exhibition/prediction/exhibitor/ProductList'], resolve)
          },
        ]
      },
      
      //----------英文-展商端-信息确认---------
      {
        path: '/exhibitor/confirmEN',
        meta: {auth: true, title: "Verify Message"},
        component: Confirm,
        children: [
          {
            path: '/',
            name: 'exhibitorConfirmEN',
            component: resolve => require(['@/views/exhibition/prediction/exhibitor/ConfirmList'], resolve)
          },
        ]
      }
    ]
  }
]