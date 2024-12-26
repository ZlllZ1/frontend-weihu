<template>
  <section
    class="absolute top-12 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg w-[92px] shadow-sm"
  >
    <span class="triangle"></span>
    <div class="text-base text-[#888] z-[10] relative flex flex-col gap-2">
      <a
        href="/personalCenter"
        target="_blank"
        class="hover:bg-[#EEE] w-full rounded-lg flex items-center justify-center"
        @click="emit('closeDropdown')"
        >{{ $t('message.homePage') }}</a
      >
      <a
        href="/setting"
        target="_blank"
        class="hover:bg-[#EEE] w-full rounded-lg flex items-center justify-center"
        @click="emit('closeDropdown')"
        >{{ $t('message.setting') }}</a
      >
      <button class="hover:bg-[#EEE] w-full rounded-lg" @click="userLogout">
        {{ $t('message.logout') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import { useI18n } from 'vue-i18n'
import { logout } from '@/api/login'

const emit = defineEmits('closeDropdown')

const { t } = useI18n()
const store = useStore()
const $toast = useToast()

// 用户信息
const userInfo = computed(() => store.state.user.userInfo)

// 辅助函数(移除token/refreshToken/userInfo)
const removeInfo = () => {
  store.commit('user/setUserInfo', null)
  store.commit('user/setToken', null)
  store.commit('user/setRefreshToken', null)
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}
// 退出登录
const userLogout = async () => {
  try {
    const res = await logout(userInfo.value.email)
    if (res.data.code !== 200) return
    removeInfo()
    $toast.success(t('message.logoutSuccess'))
    location.reload()
  } catch (err) {
    $toast.error(t('message.logoutFail'))
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
