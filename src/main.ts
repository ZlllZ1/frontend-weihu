import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/global.scss'
import './tailwind.css'

createApp(App).use(store).use(router).mount('#app')
