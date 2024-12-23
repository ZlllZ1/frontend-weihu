import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/global.scss'
import './tailwind.css'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import LoadingData from './components/common/loading-data/LoadingData.vue'
import request from './utils/request'
import i18n from './i18n/index'
import VueLazyload from 'vue-lazyload'

const app = createApp(App)

app.use(router).use(store)

store.watch(
  state => state.user.token,
  newToken => {
    if (newToken) {
      app.config.globalProperties.$newToken = newToken
    }
  }
)

app.use(VueToast, {
  position: 'top-right',
  duration: 2000
})
app.use(i18n)
app.use(VueLazyload, {
  loading: require('./assets/loading.gif'),
  error: require('./assets/errorImg.png')
})

request.setStore(store)
request.interceptors()

app.component('LoadingData', LoadingData)

app.mount('#app')
