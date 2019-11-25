import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import db from './utils/localStorage'
import 'element-ui/lib/theme-chalk/index.css'
import request from './utils/request'
//引入echarts
import echarts from 'echarts'
Vue.use(ElementUI)

Vue.use(db)

Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})
// 设置全局都可以使用 直接使用$getRequest
Vue.prototype.$getRequest = request.get;
Vue.prototype.$postRequest = request.post;
Vue.prototype.$deleteRequest = request.delete;
Vue.prototype.$putRequest = request.put;
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
