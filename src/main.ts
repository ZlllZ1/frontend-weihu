import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/global.scss'
import './tailwind.css'
import LoadingData from './components/common/loading-data/LoadingData.vue'

const app = createApp(App)

app.use(router).use(store)

app.component('LoadingData', LoadingData)

app.mount('#app')
