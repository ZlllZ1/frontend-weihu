class WebSocketManager {
  constructor(url) {
    this.url = url
    this.socket = null
    this.isConnected = false
    this.reconnectInterval = 5000
    this.heartbeatInterval = 30000
    this.heartbeatTimer = null
    this.reconnectTimer = null
    this.messageHandlers = new Set()
  }

  connect() {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log('WebSocket connected')
      this.isConnected = true
      this.startHeartbeat()
      this.emit('open')
    }

    this.socket.onmessage = event => {
      const message = JSON.parse(event.data)
      this.messageHandlers.forEach(handler => handler(message))
    }

    this.socket.onclose = () => {
      console.log('WebSocket disconnected')
      this.isConnected = false
      this.stopHeartbeat()
      this.scheduleReconnect()
      this.emit('close')
    }

    this.socket.onerror = error => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
    }
  }

  send(message) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Message not sent.')
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'heartbeat' })
    }, this.heartbeatInterval)
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
  }

  scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect...')
        this.connect()
        this.reconnectTimer = null
      }, this.reconnectInterval)
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler)
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler)
  }

  emit(event, data) {
    // 可以在这里添加自定义事件处理逻辑
  }
}

export default WebSocketManager
