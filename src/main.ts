import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/request'
import '@/styles/global.scss'
import './tailwind.css'
import LoadingData from './components/common/loading-spin/index'

const app = createApp(App)
app.use(router).use(store)
app.config.globalProperties.$request = request
app.config.globalProperties.$loading = LoadingData
app.mount('#app')
