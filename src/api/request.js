import axios from 'axios'

class Request {
  constructor(config) {
    this.instance = axios.create(config)
    this.interceptors()
  }
  interceptors() {
    this.instance.interceptors.request.use(
      config => {
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      response => {
        return response.data
      },
      error => {
        return Promise.reject(error)
      }
    )
  }
  get(url, params) {
    return this.instance.get(url, { params })
  }
  post(url, data) {
    return this.instance.post(url, data)
  }
}

export default new Request({
  baseUrl: 'http://127.0.0.1:3000/api',
  timeout: 5000
})
