<template>
  <HeaderNav />
  <router-view />
  <LoginCard v-if="showLogin" @closeLogin="closeLogin" />
  <LoadingData v-if="showLoading"></LoadingData>
</template>

<script setup>
import { onMounted, onUnmounted, ref, provide, watch } from 'vue'
import HeaderNav from '@/components/layout/HeaderNav.vue'
import LoginCard from './components/layout/login/LoginCard.vue'
import eventBus from '@/utils/eventBus'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import WebSocketManager from '@/utils/websocket.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const $toast = useToast()
const showLogin = ref(false)
const showLoading = ref(false)
const wsManager = ref(null)

const openLoading = () => (showLoading.value = true)
const closeLoading = () => (showLoading.value = false)
const openLogin = () => (showLogin.value = true)
const closeLogin = () => (showLogin.value = false)

const handleMessage = message => {
  if (message.type === 'chat') {
    $toast.info(t('message.newMessage'))
  }
}

const initializeWebSocket = () => {
  if (wsManager.value) wsManager.value.disconnect()
  wsManager.value = new WebSocketManager(
    `ws://127.0.0.1:3007?token=${store.state.user.token}`
  )
  wsManager.value.addMessageHandler(handleMessage)
  wsManager.value.connect()
}

onMounted(() => {
  eventBus.on('openLogin', openLogin)
  eventBus.on('openLoading', openLoading)
  eventBus.on('closeLoading', closeLoading)
  if (store.state.user.token) initializeWebSocket()
})
onUnmounted(() => {
  eventBus.off('showLoginModal', openLogin)
  eventBus.off('openLoading', openLoading)
  eventBus.off('closeLoading', closeLoading)
  if (wsManager.value) {
    wsManager.value.removeMessageHandler(handleMessage)
    wsManager.value.disconnect()
  }
})

watch(
  () => store.state.user.token,
  newToken => {
    if (newToken) {
      initializeWebSocket()
    } else if (wsManager.value) {
      wsManager.value.disconnect()
    }
  }
)

provide('wsManager', wsManager)
</script>
