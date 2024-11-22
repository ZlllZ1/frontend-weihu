const userModule = {
  namespaced: true,
  state: () => ({
    userInfo: null,
    token: null
  }),
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setToken(state, token) {
      state.token = token
    }
  },
  actions: {}
}

export default userModule
