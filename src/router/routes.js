import system from './modules/system'

/**
 * 在主框架内显示
 */
const frameIn = [{
  path: '/',
  name: 'Login',
  hidden: true,
  component: resolve => require(['@/views/Login'], resolve)
},
{
  path: '/index',
  name: 'index',
  hidden: true,
  meta: {auth: true},
  component: resolve => require(['@/views/layout/Index'], resolve),
  children: [
    {
      path: '/home',
      name: '/home',
      meta: {auth: true, title: '首页'},
      component: resolve => require(['@/views/home'],resolve)
    },
    {
      path: '/home2',
      name: '/home2',
      meta: {auth: true, title: '首页222'},
      component: resolve => require(['@/views/home2'],resolve)
    }
  ]
}
  // ,
  // system
]
// 重新组织后导出
export default [
  ...frameIn
]
