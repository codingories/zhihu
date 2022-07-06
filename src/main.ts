import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { router } from '@/router'
import store from './store'

// axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
//   console.log(res.data)
// })

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
