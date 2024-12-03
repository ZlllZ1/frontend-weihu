const userModule = {
  namespaced: true,
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null
  }),
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setToken(state, token) {
      state.token = token
    },
    updateSetting(state, setting) {
      state.userInfo.setting = { ...state.userInfo.setting, ...setting }
    }
  },
  actions: {}
}

export default userModule
