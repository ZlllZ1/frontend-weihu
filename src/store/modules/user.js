const userModule = {
  namespaced: true,
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null
  }),
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setToken(state, token) {
      state.token = token
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken
    },
    updateSetting(state, setting) {
      state.userInfo.setting = { ...state.userInfo.setting, ...setting }
    }
  },
  actions: {}
}

export default userModule
