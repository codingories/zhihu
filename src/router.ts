import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/components/ColumnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'
import PostDetail from '@/views/PostDetail.vue'

import store from '@/store'
import signup from '@/views/Signup.vue'
import axios from 'axios'

const routerHistory = createWebHistory()
export const router = createRouter({
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
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/signup/',
      name: 'signup',
      component: signup
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }
  ]
})

// beforeEach当导航触发，接收函数的回调，to即将去的目标，from离开的目标，next是一个函数，来让路由继续前进
router.beforeEach((to, from, next) => {
  const {
    user,
    token
  } = store.state
  const {
    requiredLogin,
    redirectAlreadyLogin
  } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(
        () => {
          if (redirectAlreadyLogin) {
            next('/')
          } else {
            next()
          }
        }
      ).catch(e => {
        console.error(e)
        // 这边也有一个bug
        // localStorage.removeItem('token')
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})
