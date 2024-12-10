import axios from 'axios'
import eventBus from '@/utils/eventBus'

class Request {
  constructor(config) {
    this.instance = axios.create(config)
    this.interceptors()
  }

  setStore(store) {
    this.store = store
  }

  clearUserInfo() {
    if (this.store) {
      this.store.commit('user/setToken', '')
      this.store.commit('user/setUserInfo', null)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  interceptors() {
    this.instance.interceptors.request.use(
      config => {
        if (config.requiresAuth) {
          if (!this.store || !this.store.state.user.token) {
            eventBus.emit('openLogin')
            return Promise.reject({ requiresAuth: true })
          }
          config.headers.Authorization = `Bearer ${this.store.state.user.token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      response => response,
      error => {
        if (error.requiresAuth) {
          eventBus.emit('openLogin')
          return Promise.reject({ requiresAuth: true })
        }
        if (error.response && error.response.status === 401) {
          this.clearUserInfo()
          eventBus.emit('openLogin')
          return Promise.reject({ requiresAuth: true })
        }
        return Promise.reject(error)
      }
    )
  }
  get(url, params, config = {}) {
    return this.instance.get(url, { params, ...config })
  }
  post(url, data, config = {}) {
    return this.instance.post(url, data, config)
  }
}

export default new Request({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3007',
  timeout: 5000
})
