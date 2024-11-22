<template>
  <HeaderNav />
  <router-view />
  <LoginCard v-if="showLogin" @closeLogin="closeLogin" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import HeaderNav from '@/components/layout/HeaderNav.vue'
import LoginCard from './components/layout/LoginCard.vue'
import eventBus from '@/utils/eventBus'

const showLogin = ref(false)
const openLogin = () => (showLogin.value = true)
const closeLogin = () => (showLogin.value = false)
onMounted(() => {
  eventBus.on('openLogin', openLogin)
})
onUnmounted(() => {
  eventBus.off('showLoginModal', openLogin)
})
</script>
