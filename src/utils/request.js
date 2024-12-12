import axios from 'axios'
import eventBus from '@/utils/eventBus'

class Request {
  constructor(config) {
    this.instance = axios.create(config)
    this.interceptors()
    this.pendingRequests = 0
    this.loadingTimer = null
    this.loadingDelay = 200
  }

  setStore(store) {
    this.store = store
  }

  clearUserInfo() {
    if (this.store) {
      this.store.commit('user/setToken', '')
      this.store.commit('user/setRefreshToken', '')
      this.store.commit('user/setUserInfo', null)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
  }

  showLoading() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
    }
    this.loadingTimer = setTimeout(() => {
      eventBus.emit('openLoading')
    }, this.loadingDelay)
  }

  hideLoading() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
    }
    eventBus.emit('closeLoading')
  }

  async refreshToken() {
    try {
      const response = await axios.post('/refreshToken', {
        refreshToken: localStorage.getItem('refreshToken')
      })
      const { token, refreshToken } = response.data
      this.store.commit('user/setToken', token)
      this.store.commit('user/setRefreshToken', refreshToken)
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      return token
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.clearUserInfo()
        eventBus.emit('openLogin')
      }
      return null
    }
  }

  interceptors() {
    this.instance.interceptors.request.use(
      config => {
        this.pendingRequests++
        if (this.pendingRequests === 1) this.showLoading()
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
        this.pendingRequests--
        if (this.pendingRequests === 0) this.hideLoading()
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      response => {
        this.pendingRequests--
        if (this.pendingRequests === 0) this.hideLoading()
        return response
      },
      async error => {
        this.pendingRequests--
        if (this.pendingRequests === 0) this.hideLoading()
        if (error.requiresAuth) {
          eventBus.emit('openLogin')
          return Promise.reject({ requiresAuth: true })
        }
        const originalRequest = error.config
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          const newToken = await this.refreshToken()
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.instance(originalRequest)
          } else {
            eventBus.emit('openLogin')
            return Promise.reject({ requiresAuth: true })
          }
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
