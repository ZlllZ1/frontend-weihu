import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/api/request.js'
import '@/styles/global.scss'
import './tailwind.css'
const app = createApp(App)
app.use(router).use(store)
app.config.globalProperties.$request = request
app.mount('#app')
