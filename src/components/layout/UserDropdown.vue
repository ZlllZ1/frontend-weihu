<template>
  <div
    class="absolute top-12 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg w-[92px] shadow-sm"
  >
    <span class="triangle"></span>
    <div class="text-base text-[#888] z-[10] relative flex flex-col gap-2">
      <a
        href="/personalCenter"
        target="_blank"
        class="hover:bg-[#EEE] w-full rounded-lg flex items-center justify-center"
        >我的主页</a
      >
      <button class="hover:bg-[#EEE] w-full rounded-lg" @click="logout">
        退出
      </button>
    </div>
  </div>
</template>

<script setup>
import request from '@/utils/request'
import { useStore } from 'vuex'

const store = useStore()

const logout = async () => {
  const res = await request.post('/user/logout', {
    account: store.state.user.userInfo.email
  })
  if (res.code !== 200) return
  store.commit('user/setUserInfo', null)
  store.commit('user/setToken', null)
  localStorage.removeItem('userInfo')
  location.reload()
}
</script>

<style lang="scss" scoped>
.triangle {
  @apply absolute w-8 h-4 -top-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center;
  &:after {
    @apply absolute content-[''] -bottom-[2px] rotate-[45deg] h-6 w-6 -m-3 bg-white;
  }
}
</style>
