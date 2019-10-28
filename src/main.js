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



router.beforeEach((to, from, next)=> {

  let token = db.get('token')
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
