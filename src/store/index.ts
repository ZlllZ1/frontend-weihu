import { createStore } from 'vuex'
import userModule from './modules/user'
import chatModule from './modules/chat'

export default createStore({
  modules: {
    user: userModule,
    chat: chatModule
  }
})
