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
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
const whiteList = ['/login']

// console.log(token);
// console.log(user);
// console.log(userRouter.length);
// 路由卫士 发出请求之前拦截
router.beforeEach((to, from, next)=> {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  // 得到token密匙
 let token = db.get('token')
   // 得到用户
 let user = db.get('user')
   // 得到用户所属菜单
 let userRouter = db.get('userRouter')
 // 如果token和用户存在  则说明是正常登陆  放行  否则登陆
  if (token.length && user) {
    console.log(11111)
    // 如果用户路由不存在 去后台请求  存在  直接放行（此种情况在关闭浏览器无需登陆时出现）
      if (!userRouter.length) {
        console.log(22222)
          initMenu(router, store);
          next();
      } else {
        console.log(333333)
        next();
      }
  } else {
    console.log(44444)
    next('/login')
  }
})

export default router
