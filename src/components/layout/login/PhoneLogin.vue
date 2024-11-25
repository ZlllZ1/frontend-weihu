<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <div class="flex items-center border-b border-[#EBECED] w-full">
        <div class="mr-2 pr-2 border-r border-[#EBECED]">中国+86</div>
        <input
          v-model="phone"
          type="text"
          maxlength="11"
          placeholder="输入手机号"
          :class="{ 'text-red': phoneError }"
        />
      </div>
      <div class="border-b border-[#EBECED] w-full flex flex-1 justify-between">
        <input
          v-model="authCode"
          type="text"
          maxlength="6"
          placeholder="输入6位短信验证码"
        />
        <button
          v-if="!authCodeTimer"
          class="text-blue hover:text-gray"
          @click="getAuthCode"
        >
          获取短信验证码
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

const phone = ref('')
const authCode = ref('')
const authCodeTimer = ref(null)
const errorText = ref('')

const validatePhone = phone => {
  const phoneRegex = /0?(13|14|15|18|17)[0-9]{9}/
  return phoneRegex.test(phone)
}
const validateCode = code => {
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code)
}

const getAuthCode = () => {
  if (!validatePhone(phone.value)) {
    errorText.value = '手机号格式错误'
    setTimeout(() => {
      errorText.value = ''
    }, 1000)
    return
  }
  authCodeTimer.value = 60
  setInterval(() => {
    authCodeTimer.value--
    if (authCodeTimer.value === 0) {
      authCodeTimer.value = null
    }
  }, 1000)
}

const login = () => {
  if (!validatePhone(phone.value)) {
    errorText.value = '手机号格式错误'
    setTimeout(() => {
      errorText.value = ''
    }, 1000)
    return
  }
  if (!validateCode(authCode.value)) {
    errorText.value = '短信验证码格式错误'
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
