import { createApp } from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

import { createRouter, createWebHistory } from 'vue-router'
import ColumnDetail from '@/components/ColumnDetail.vue'

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
