<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <input
        v-model="account"
        type="text"
        placeholder="输入手机号或邮箱"
        class="border-b border-[#EBECED] w-full py-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="输入密码"
        class="border-b border-[#EBECED] w-full py-2"
      />
      <div class="flex justify-end py-2">
        <a href="/" target="_blank" class="hover:text-black w-fit">忘记密码</a>
      </div>
    </div>
    <button
      class="bg-blue text-white rounded-sm h-9 hover:bg-[#0E66E7] mt-2"
      @click="login"
    >
      登录
    </button>
  </div>
  <ToastView v-if="errorText.length">
    <span>{{ errorText }}</span>
  </ToastView>
</template>

<script setup>
import { ref } from 'vue'
import ToastView from '@/components/common/ToastView.vue'

const account = ref('')
const password = ref('')
const errorText = ref('')

const login = () => {
  errorText.value = '账号或密码错误'
  setTimeout(() => {
    errorText.value = ''
  }, 1000)
}
</script>

<style lang="scss" scoped>
input {
  @apply outline-none h-12;
}
</style>
