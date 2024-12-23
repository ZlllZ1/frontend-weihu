import WebSocketManager from '@/utils/websocket'

const chatModule = {
  namespaced: true,
  state: () => ({
    socket: null,
    isConnected: false
  }),
  getters: {
    getSocket: state => state.socket
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket
    },
    setConnected(state, isConnected) {
      state.isConnected = isConnected
    }
  },
  actions: {
    initWebSocket({ commit, rootState }) {
      const token = rootState.user.token
      if (!token) {
        console.error('Token not found. Cannot initialize WebSocket.')
        return
      }
      const wsUrl = `ws://127.0.0.1:3007?token=${token}`
      const wsManager = new WebSocketManager(wsUrl, {
        reconnectInterval: 3000,
        maxReconnectAttempts: 10
      })
      wsManager.setToken(token)
      wsManager.connect()
      commit('setSocket', wsManager)
      wsManager.on('open', () => {
        commit('setConnected', true)
      })
      wsManager.on('close', event => {
        commit('setConnected', false)
      })
      wsManager.on('error', error => {
        console.error('WebSocket error:', error)
      })
      wsManager.on('reconnectFailed', () => {
        console.error('WebSocket reconnection failed after maximum attempts')
      })
    }
  }
}

export default chatModule
