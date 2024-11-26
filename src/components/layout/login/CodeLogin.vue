<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <input
        :value="account.trim()"
        type="text"
        placeholder="输入QQ邮箱/163邮箱"
        class="border-b border-[#EBECED] w-full"
        @input="updateAccount($event.target.value)"
      />
      <div class="border-b border-[#EBECED] w-full flex flex-1 justify-between">
        <input
          :value="authCode.trim()"
          type="text"
          placeholder="输入验证码"
          class="flex-1"
          @input="updateAuthCode($event.target.value)"
        />
        <button
          v-if="!authCodeTimer"
          class="text-blue hover:text-gray"
          @click="getAuthCode"
        >
          获取验证码
        </button>
        <span v-else class="flex items-center justify-center"
          >{{ authCodeTimer }}秒后可重发</span
        >
      </div>
      <div class="flex justify-end py-2">
        <a href="/" target="_blank" class="hover:text-black w-fit">反馈错误</a>
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
import request from '@/utils/request'

const account = ref('')
const authCode = ref('')
const authCodeTimer = ref(null)
let intervalId = null
const errorText = ref('')

const validateAccount = account => {
  const accountRegex = /[a-zA-Z0-9._%+-]+@(?:163\.com|qq\.com)/
  return accountRegex.test(account)
}

const updateAccount = value => (account.value = value.replace(/\s/g, ''))
const updateAuthCode = value => (authCode.value = value.replace(/\s/g, ''))

const getAuthCode = async () => {
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
  const res = await request.post('/login/sendAuthCode', {
    account: account.value
  })
  console.log(res)
  if (intervalId) clearInterval(intervalId)
  authCodeTimer.value = 60
  intervalId = setInterval(() => {
    authCodeTimer.value--
    if (authCodeTimer.value <= 0) {
      clearInterval(intervalId)
      authCodeTimer.value = null
      intervalId = null
    }
  }, 1000)
}

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
  if (!authCode.value.length) {
    errorText.value = '验证码不能为空'
    setTimeout(() => {
      errorText.value = ''
    }, 1000)
    return
  }
}
</script>

<style lang="scss" scoped>
input {
  @apply outline-none h-12;
}
.error-message {
  @apply block transition-opacity duration-300 ease-in-out;
}
</style>
