import system from './modules/system'

/**
 * 在主框架内显示
 */
const frameIn = [{
  path: '/',
  name: 'Login',
  component: resolve => require(['@/views/Login'], resolve)
},
{
  path: '/index',
  name: 'index',
  meta: {auth: true},
  component: resolve => require(['@/views/layout/Index'], resolve)
}
  // ,
  // system
]
// 重新组织后导出
export default [
  ...frameIn
]
