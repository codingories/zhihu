import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { router } from '@/router'
import store from './store'

axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})

axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 2000)
  return config
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
