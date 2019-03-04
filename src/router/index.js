import Vue from 'vue'
import VueRouter from 'vue-router'
import exhibitionRouter from './exhibitionRouter'
import portalRouter from './portalRouter'
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    ...exhibitionRouter,
    ...portalRouter
  ]
})

export default router