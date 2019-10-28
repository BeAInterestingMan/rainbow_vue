import Vue from 'vue'
import Vuex from 'vuex'
import  db from '@/utils/localstorage'
Vue.use(Vuex)

const state = {
   token: db.get('token'),
   user: db.get('user'),
   routes:[]

}


const mutations = {
   setToken(state,val){
    db.save('token',val)
    state.token=val
   },
   login(state, user){
    state.user = user;
    db.save('user',user)
  },
  logout(state){
    window.localStorage.removeItem('user');
    state.routes = [];
  },

  initMenu(state, menus){
    state.routes = menus;
  }

}

export default new Vuex.Store({
  state: state,
  mutations: mutations
 
 
})
