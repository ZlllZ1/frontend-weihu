<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <input
        :value="account.trim()"
        type="text"
        placeholder="输入QQ邮箱/163邮箱"
        class="border-b border-[#EBECED] w-full py-2"
        @input="updateAccount($event.target.value)"
      />
      <input
        :value="password.trim()"
        type="password"
        placeholder="输入密码"
        class="border-b border-[#EBECED] w-full py-2"
        @input="updatePassword($event.target.value)"
      />
      <div class="flex justify-end py-2">
        <a href="/forgetPassword" target="_blank" class="hover:text-black w-fit"
          >忘记密码</a
        >
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

const validateAccount = account => {
  const accountRegex = /[a-zA-Z0-9._%+-]+@(?:163\.com|qq\.com)/
  return accountRegex.test(account)
}

const updateAccount = value => (account.value = value.replace(/\s/g, ''))
const updatePassword = value => (password.value = value.replace(/\s/g, ''))

const login = () => {
  if (!account.value.length) {
    errorText.value = '邮箱不能为空'
    setTimeout(() => {
      errorText.value = ''
    }, 1000)
    return
  }
  if (!validateAccount(account.value)) {
    errorText.value = '邮箱格式错误'
    setTimeout(() => {
      errorText.value = ''
    }, 1000)
    return
  }
  if (!password.value.length) {
    errorText.value = '密码不能为空'
    setTimeout(() => {
      errorText.value = ''
    }, 1000)
    return
  }
  errorText.value = '邮箱或密码错误'
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
