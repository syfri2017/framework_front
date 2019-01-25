import Vue from 'vue'
import Router from 'vue-router'
// 路由数据
import routes from './routes'
import axios from 'axios'
Vue.use(Router)

const router = new Router({
  routes
})
export default router
