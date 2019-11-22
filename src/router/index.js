import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { initMenu } from '../utils/menu';
import db from '@/utils/localStorage'
Vue.use(VueRouter)
// 静态路由 不需要权限的
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    hidden: true
  },
  // 默认进入系统首页
  {
    path: '/',
    redirect: '/layout',
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
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 白名单
const whiteList = ['/login']

// 路由卫士 发出请求之前拦截
router.beforeEach((to, from, next)=> {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  // 得到token密匙
 let token = db.get('token')
   // 得到用户
 let user = db.get('user')
 // 如果token和用户存在  则说明是正常登陆  放行  否则登陆
  if (token && token.length && user) {
          // 加载路由
          initMenu(router, store);
          // 放行
          next();
  } else {
    // 否则去到登陆页面;
    router.replace("/login")
  }
})

export default router
