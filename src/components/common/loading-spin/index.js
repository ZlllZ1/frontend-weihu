import Vue from 'vue'
import LoadingSpin from './loading-spin.vue'
const Indicator = Vue.extend(LoadingSpin)
let instance
const defaultOptions = {
  text: ''
}
export default {
  open(options = {}) {
    if (!instance) {
      instance = new Indicator({
        el: document.createElement('div')
      })
      document.body.appendChild(instance.$el)
    }
    if (instance.visible) return
    if (typeof options === 'string') {
      instance.text = options
    } else {
      const _options = { ...defaultOptions, ...options }
      Object.keys(_options).map(key => {
        instance[key] = _options[key]
      })
    }
    Vue.nextTick(() => {
      instance.visible = true
    })
  },
  close() {
    if (instance) {
      instance.visible = false
    }
  }
}
