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
  }, 
  {
    path: '/layout',
    name: '系统首页',
    component: () => import('../views/layout.vue'),
    // 进入layout后会默认进入首页信息
    redirect: '/layout/info',
    hidden: true,
    children:[{
      path: 'info',
      name: '系统信息',
      component: () => import('../views/info.vue'),
    }]
  },
  // {
  //   path: '/systemInfo',
  //   name: '系统首页',
  //   redirect: '/systemInfo/info',
  //   component: () => import('../views/layout.vue'),
  //   children:[{
  //     path: 'info',
  //     name: '系统信息',
  //     component: () => import('../views/info.vue'),
  //   }]
  // }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router
