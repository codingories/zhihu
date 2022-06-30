import { createApp } from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

import { createRouter, createWebHistory } from 'vue-router'
import ColumnDetail from '@/components/ColumnDetail.vue'
import { createStore } from 'vuex'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    add (state) {
      state.count++
    }
  }
})

console.log('store', store.state.count)
store.commit('add')
console.log('store222', store.state.count)

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
