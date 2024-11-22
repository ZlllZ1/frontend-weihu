class EventBus {
  events = {}

  emit(key, data) {
    this.events[key]?.forEach(fn => {
      try {
        fn(data)
      } catch (e) {
        console.error(`Error in event handler for ${key}:`, e)
      }
    })
  }

  on(key, handler) {
    if (!this.events[key]) {
      this.events[key] = []
    }
    this.events[key].push(handler)
    return () => this.off(key, handler)
  }

  off(key, handler) {
    if (!this.events[key]) return
    const index = this.events[key].indexOf(handler)
    if (index > -1) {
      this.events[key].splice(index, 1)
    }
  }

  once(key, handler) {
    const handleOnce = data => {
      handler(data)
      this.off(key, handleOnce)
    }
    return this.on(key, handleOnce)
  }

  clear(key) {
    if (key) {
      delete this.events[key]
    } else {
      this.events = {}
    }
  }
}

export default new EventBus()
