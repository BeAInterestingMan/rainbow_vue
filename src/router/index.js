import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    hidden: true
  }, {
    path: '/home',
    name: '系统首页',
    component: () => import('../views/home.vue'),
    hidden: true
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router
