<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <input
        :value="account.trim()"
        type="text"
        placeholder="输入QQ邮箱/163邮箱"
        class="border-b border-[#EBECED] w-full outline-none h-12"
        @input="updateAccount($event.target.value)"
      />
      <div class="border-b border-[#EBECED] w-full flex flex-1 justify-between">
        <input
          :value="authCode.trim()"
          type="text"
          placeholder="输入验证码"
          class="flex-1 outline-none h-12"
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
        <a href="/feedbackError" target="_blank" class="hover:text-black w-fit"
          >反馈错误</a
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
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { sendAuthCode, codeLogin } from '@/api/login.js'
import { getUserInfo } from '@/api/user.js'

const emits = defineEmits(['closeLogin'])
const store = useStore()
const account = ref('')
const authCode = ref('')
const authCodeTimer = ref(null)
let intervalId = null
const $toast = useToast()

const validateAccount = account => {
  const accountRegex = /[a-zA-Z0-9._%+-]+@(?:163\.com|qq\.com)/
  return accountRegex.test(account)
}

const updateAccount = value => (account.value = value.replace(/\s/g, ''))
const updateAuthCode = value => (authCode.value = value.replace(/\s/g, ''))

const getAuthCode = async () => {
  try {
    if (!account.value.length) {
      $toast.error('邮箱不能为空')
      return
    }
    if (!validateAccount(account.value)) {
      $toast.error('邮箱格式错误')
      return
    }
    const res = await sendAuthCode(account.value)
    if (res.code !== 200) return
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
    $toast.success('获取验证码成功')
  } catch (error) {
    $toast.error('获取验证码失败')
  }
}

const login = async () => {
  try {
    if (!account.value.length) {
      $toast.error('邮箱不能为空')
      return
    }
    if (!validateAccount(account.value)) {
      $toast.error('邮箱格式错误')
      return
    }
    if (!authCode.value.length) {
      $toast.error('验证码不能为空')
      return
    }
    const res = await codeLogin(account.value, authCode.value)
    if (res.code !== 200) return
    store.commit('user/setToken', res.data.token)
    localStorage.setItem('token', res.data.token)
    const { code, data } = await getUserInfo(account.value)
    if (code !== 200) return
    store.commit('user/setUserInfo', data)
    localStorage.setItem('userInfo', JSON.stringify(data))
    $toast.success('登录成功')
    emits('closeLogin')
  } catch (error) {
    $toast.error('邮箱或验证码错误')
  }
}
</script>
