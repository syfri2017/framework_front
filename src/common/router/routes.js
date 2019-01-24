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
  component: resolve => require(['@/views/Index'], resolve)
}
  // ,
  // system
]
// 重新组织后导出
export default [
  ...frameIn
]
