import Vue from 'vue'
import VueRouter from 'vue-router'
import exhibition from './exhibition'
import exhibitor from './exhibitor'
import portal from './portal'
Vue.use(VueRouter)


const router = new VueRouter({
  // mode: 'history',
  routes: [
    ...exhibition,
    ...exhibitor,
    ...portal
  ]
})

export default router