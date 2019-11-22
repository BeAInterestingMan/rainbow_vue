import Vue from 'vue'
import Vuex from 'vuex'
import  db from '@/utils/localStorage'
Vue.use(Vuex)

const state = {
   token: db.get('token'),
   user: db.get('user'),
   routes:db.get('routes'),
   expireTime: db.get('expireTime')
}


const mutations = {
   setToken(state,val){
    db.save('token',val)
    state.token=val
   },
   user(state, user){
    state.user = user;
    db.save('user',user)
  },
  logout(state){
    db.clear();
  },

  initMenu(state, menus){
    db.save('routes',menus)
    state.routes = menus;
  },
  setExpireTime (state, val) {
    db.save('expireTime', val)
    state.expireTime = val
  },

}

export default new Vuex.Store({
  state: state,
  mutations: mutations
 
 
})
