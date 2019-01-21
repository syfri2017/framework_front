import index from '@/views/Index'
export default {
  path: '/system',
  name: 'system',
  meta: { title: '系统管理' },
  component: index,
  children: (pre => [
    {
      path: '/system/user',
      name: '${pre}user',
      meta: { title: '用户管理' },
      component: () => import('@/views/system/User')
    },
    {
      path: '/system/role',
      name: '${pre}role',
      meta: { title: '角色管理' },
      component: () => import('@/views/system/Role')
    }
  ])('system-')
}
