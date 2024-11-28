import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/global.scss'
import './tailwind.css'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import LoadingData from './components/common/loading-data/LoadingData.vue'

const app = createApp(App)

app.use(router).use(store)
app.use(VueToast, {
  position: 'top-right',
  duration: 2000
})

app.component('LoadingData', LoadingData)

app.mount('#app')
