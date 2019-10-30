import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
// 静态路由 不需要权限的
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/login',
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
