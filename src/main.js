import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import db from './utils/localstorage'
import 'element-ui/lib/theme-chalk/index.css'
import request from './utils/request'
import { initMenu } from './utils/menu';
Vue.use(ElementUI)

Vue.use(db)

Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})
// 设置全局都可以使用
Vue.prototype.$getRequest = request.get;
Vue.prototype.$postRequest = request.post;
Vue.prototype.$deleteRequest = request.delete;
Vue.prototype.$putRequest = request.put;
Vue.config.productionTip = false


// 路由卫士 发出请求之前拦截
router.beforeEach((to, from, next)=> {
 // 得到token密匙
  let token = db.get('token')
  // 如果token存在 则是正常登陆 否则判断是否是登陆 （登陆放行   不是登陆就去登陆）
  if(token){
    initMenu(router, store);
    next();
  }else{
    if (to.name == '/login') {
      next();
    }else{
      next('/login');
    }
  }

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
