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
        @click="emit('closeDropdown')"
        >我的主页</a
      >
      <button class="hover:bg-[#EEE] w-full rounded-lg" @click="logout">
        退出
      </button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { logOut } from '@/api/login'
import { computed } from 'vue'

const emit = defineEmits('closeDropdown')
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)

const logout = async () => {
  try {
    const res = await logOut(userInfo.value.email)
    if (res.code !== 200) return
    store.commit('user/setUserInfo', null)
    store.commit('user/setToken', null)
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    location.reload()
  } catch (err) {
    console.log(err)
  }
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
