import Login from '@/views/exhibition/common/Login'
import LoginEN from '@/views/exhibition/common/LoginEN'
import Index from '@/views/exhibition/common/Index'
import Home from '@/views/exhibition/home/Home'
import Exhprediction from '@/views/exhibition/prediction/exhprediction/Exhprediction'
import ExhpredictionApprove from '@/views/exhibition/prediction/exhprediction/ExhpredictionApprove'
import Exhibitor from '@/views/exhibition/prediction/exhibitor/Exhibitor'
import VenuePlan from '@/views/exhibition/venue/plan/Plan'
import VenuePlanEN from '@/views/exhibition/venue/plan/PlanEN'
import VenueTrader from '@/views/exhibition/venue/trader/Trader'
import Position from '@/views/exhibition/booth/position/Position'
import PositionDesign from '@/views/exhibition/booth/design/PositionDesign'
import PositionSelect from '@/views/exhibition/booth/select/PositionSelect'
import PositionAnon from '@/views/exhibition/booth/anon/PositionAnon'
import PositionType from '@/views/exhibition/booth/type/PositionType'
import StatisProduct from '@/views/exhibition/statistical/product/StatisProduct'
import StatisArea from '@/views/exhibition/statistical/area/StatisArea'
import StatisConfirm from '@/views/exhibition/statistical/confirm/StatisConfirm'
import BoothLog from '@/views/exhibition/log/booth/BoothLog'
import SmsLog from '@/views/exhibition/log/sms/SmsLog'
import User from '@/views/system/user/User'
import Role from '@/views/system/role/Role'
import Resource from '@/views/system/resource/Resource'
import Permission from '@/views/system/permission/Permission'
import Codelist from '@/views/system/codelist/Codelist'
import Mail from '@/views/system/mail/Mail'
import ExhpredictionEdit from '@/views/exhibition/prediction/exhprediction/ExhpredictionEdit'
import ExhpredictionConfirm from '@/views/exhibition/prediction/exhprediction/ExhpredictionConfirm'
import ExhpredictionEditEN from '@/views/exhibition/prediction/exhprediction/ExhpredictionEdit_ENG'
import Product from '@/views/exhibition/prediction/exhibitor/Product'
import Confirm from '@/views/exhibition/prediction/exhibitor/Confirm'

export default [
  {
    path: '/',
    name: 'login',
    component: Login,
    children: [
      {
        path: '/exhibition/login/ch/Phone',
        name: 'exhibition/login/ch/Phone',
        meta: {auth: true, title: "账户重置", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/Phone'], resolve)
      },
      {
        path: '/exhibition/login/ch/Mailbox',
        name: 'exhibition/login/ch/Mailbox',
        meta: {auth: true, title: "账户重置", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/Mailbox'], resolve)
      },
      {
        path: '/exhibition/login/ch/Administrator',
        name: 'exhibition/login/ch/Administrator',
        meta: {auth: true, title: "账户重置", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/Administrator'], resolve)
      },
      {
        path: '/exhibition/login/ch/Reset',
        name: 'exhibition/login/ch/Reset',
        meta: {auth: true, title: "账户重置", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/Reset'], resolve)
      },
      {
        path: '/exhibition/login/ch/ForgetPassword',
        name: 'exhibition/login/ch/ForgetPassword',
        meta: {auth: true, title: "忘记用户名", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/ForgetPassword'], resolve)
      },
      {
        path: '/exhibition/login/ch/ForgetUsername',
        name: 'exhibition/login/ch/ForgetUsername',
        meta: {auth: true, title: "忘记密码", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/ForgetUsername'], resolve)
      },
      {
        path: '/exhibition/login/ch/Register',
        name: 'exhibition/login/ch/Register',
        meta: {auth: true, title: "用户注册", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/Register'], resolve)
      },
      {
        path: '/exhibition/login/ch/Login',
        name: 'exhibition/login/ch/Login',
        meta: {auth: true, title: "用户登录", operation: true},
        component: resolve => require(['@/views/exhibition/login/ch/Login'], resolve)
      }
    ],
    redirect:'/exhibition/login/ch/Login'
  },
  {
    path: '/',
    name: 'loginEN',
    component: LoginEN,
    children: [
      {
        path: '/exhibition/login/en/ForgetPassword',
        name: 'exhibition/login/en/ForgetPassword',
        meta: {auth: true, title: "忘记用户名", operation: true},
        component: resolve => require(['@/views/exhibition/login/en/ForgetPassword'], resolve)
      },
      {
        path: '/exhibition/login/en/ForgetUsername',
        name: 'exhibition/login/en/ForgetUsername',
        meta: {auth: true, title: "忘记密码", operation: true},
        component: resolve => require(['@/views/exhibition/login/en/ForgetUsername'], resolve)
      },
      {
        path: '/exhibition/login/en/Register',
        name: 'exhibition/login/en/Register',
        meta: {auth: true, title: "用户注册", operation: true},
        component: resolve => require(['@/views/exhibition/login/en/Register'], resolve)
      },
      {
        path: '/exhibition/login/en/Login',
        name: 'exhibition/login/en/Login',
        meta: {auth: true, title: "用户登录", operation: true},
        component: resolve => require(['@/views/exhibition/login/en/Login'], resolve)
      }
    ],
    redirect:'/exhibition/login/en/Login'
  },
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
            component: resolve => require(['@/views/exhibition/home/homeList'], resolve)
          },
          {
            path: '/home/detail',
            name: 'home/detail',
            meta: {auth: true, title: "首页详情"},
            component: resolve => require(['@/views/exhibition/home/homeDetail'], resolve)
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
            meta: {keepAlive: true},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionList'], resolve)
          },
          {
            path: '/prediction/exhprediction/detail',
            name: 'exhpredictionDetail',
            meta: {auth: true, title: "展会报名管理详情", keepAlive: false},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionDetail'], resolve)
          },
          {
            path: '/prediction/exhprediction/insert',
            name: 'exhpredictionInsert',
            meta: {auth: true, title: "展会报名管理新增", keepAlive: false},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionEdit'], resolve)
          },
          {
            path: '/prediction/exhprediction/update',
            name: 'exhpredictionUpdate',
            meta: {auth: true, title: "展会报名管理编辑", keepAlive: false},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionEdit'], resolve)
          },
          {
            path: '/prediction/exhprediction/insert_ENG',
            name: 'exhpredictionInsert_ENG',
            meta: {auth: true, title: "展会报名管理新增", keepAlive: false},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionEdit_ENG'], resolve)
          },
          {
            path: '/prediction/exhprediction/update_ENG',
            name: 'exhpredictionUpdate_ENG',
            meta: {auth: true, title: "展会报名管理编辑", keepAlive: false},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionEdit_ENG'], resolve)
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
            meta: {keepAlive: true},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionApproveList'], resolve)
          },
          {
            path: '/prediction/exhprediction_approve/detail',
            name: 'exhpredictionApproveDetail',
            meta: {auth: true, title: "展会报名审核详情", keepAlive: false},
            component: resolve => require(['@/views/exhibition/prediction/exhprediction/ExhpredictionDetail'], resolve)
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
            component: resolve => require(['@/views/exhibition/prediction/exhibitor/ExhibitorList'], resolve)
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
            component: resolve => require(['@/views/exhibition/venue/plan/Plan'], resolve),
          },
        ]
      },
       //----------展馆管理-展馆平面图----------
       {
        path: '/plan/planEN',
        meta: {auth: true, title: "展馆平面图"},
        component: VenuePlanEN,
        children: [
          {
            path: '/',
            name: 'planEN',
            component: resolve => require(['@/views/exhibition/venue/plan/PlanEN'], resolve),
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
            component: resolve => require(['@/views/exhibition/venue/trader/TraderList'], resolve)
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
            meta: {keepAlive: true},
            component: resolve => require(['@/views/exhibition/booth/position/PositionList'], resolve)
          },
          {
            path: '/booth/position/analysis',
            name: 'positionAnalysis',
            meta: {auth: true, title: "展位分析", keepAlive: false},
            component: resolve => require(['@/views/exhibition/booth/position/PositionAnalysis'], resolve)
          },
        ]
      },
      
      //----------展位管理-展位选择----------
      {
        path: '/booth/select',
        meta: {auth: true, title: "展位选择"},
        component: PositionSelect,
        children: [
          {
            path: '/',
            name: 'positionSelect',
            component: resolve => require(['@/views/exhibition/booth/select/PositionSelect'], resolve)
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
            //component: resolve => require(['@/views/booth/design/PositionDesign'], resolve)
            component: resolve => require(['@/views/exhibition/ploter/Plot'], resolve),
            props: true
          }
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
            component: resolve => require(['@/views/exhibition/booth/type/PositionTypeList'], resolve)
          },
        ]
      },
      //----------统计分析-按产品类型统计----------
      {
        path: '/statistical/statisProduct',
        meta: {auth: true, title: "按产品类型统计"},
        component: StatisProduct,
        children: [
          {
            path: '/',
            name: 'statisProduct',
            component: resolve => require(['@/views/exhibition/statistical/product/StatisProductEcharts'], resolve)
          },
          {
            path: '/statistical/statisProductList',
            name: 'statislProductList',
            meta: {auth: true, title: "按产品类型统计企业列表"},
            component: resolve => require(['@/views/exhibition/statistical/product/StatisProAreaList'], resolve)
          },
        ]
      },
      //----------统计分析-按光地展位面积统计----------
      {
        path: '/statistical/statisArea',
        meta: {auth: true, title: "按光地展位面积统计"},
        component: StatisArea,
        children: [
          {
            path: '/',
            name: 'statisArea',
            component: resolve => require(['@/views/exhibition/statistical/area/StatisAreaEcharts'], resolve)
          },
          {
            path: '/statistical/statisAreaList',
            name: 'statisAreaList',
            meta: {auth: true, title: "按光地展位面积统计企业列表"},
            component: resolve => require(['@/views/exhibition/statistical/product/StatisProAreaList'], resolve)
          },
        ]
      },
      //----------统计分析-按确认信息统计----------
      {
        path: '/statistical/statisConfirm',
        meta: {auth: true, title: "按确认信息统计"},
        component: StatisConfirm,
        children: [
          {
            path: '/',
            name: 'statisConfirm',
            component: resolve => require(['@/views/exhibition/statistical/confirm/StatisConfirmEcharts'], resolve)
          },
          {
            path: '/statistical/statisConfirmList',
            name: 'statisConfirmList',
            meta: {auth: true, title: "按确认信息统计企业列表"},
            component: resolve => require(['@/views/exhibition/statistical/confirm/StatisConfirmList'], resolve)
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
            component: resolve => require(['@/views/exhibition/log/booth/BoothLogList'], resolve)
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
            component: resolve => require(['@/views/exhibition/log/sms/SmsLogList'], resolve)
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
            meta: {keepAlive: true},
            component: resolve => require(['@/views/system/codelist/CodelistList'], resolve)
          },
          {
            path: '/system/codelist/detail',
            name: 'codelist/detail',
            meta: {auth: true, title: "代码集详情", keepAlive: false},
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
            component: resolve => require(['@/views/system/mail/MailList'], resolve)
          },
        ]
      },
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
      //------------------报名英文-----------
      {
        path: '/exhpredictionEn',
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
      },
    ]
  }
]