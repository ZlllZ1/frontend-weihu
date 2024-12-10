<template>
  <HeaderNav />
  <router-view />
  <LoginCard v-if="showLogin" @closeLogin="closeLogin" />
  <LoadingData v-if="showLoading"></LoadingData>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import HeaderNav from '@/components/layout/HeaderNav.vue'
import LoginCard from './components/layout/login/LoginCard.vue'
import eventBus from '@/utils/eventBus'

const showLogin = ref(false)
const showLoading = ref(false)

const openLoading = () => (showLoading.value = true)
const closeLoading = () => (showLoading.value = false)
const openLogin = () => (showLogin.value = true)
const closeLogin = () => (showLogin.value = false)
onMounted(() => {
  eventBus.on('openLogin', openLogin)
  eventBus.on('openLoading', openLoading)
  eventBus.on('closeLoading', closeLoading)
})
onUnmounted(() => {
  eventBus.off('showLoginModal', openLogin)
  eventBus.off('openLoading', openLoading)
  eventBus.off('closeLoading', closeLoading)
})
</script>
