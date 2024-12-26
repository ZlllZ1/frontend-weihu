<template>
  <section class="py-6 px-4 flex flex-col">
    <form class="text-sm h-[100px]" @submit.prevent="login">
      <label>
        <input
          :value="account.trim()"
          type="text"
          :placeholder="$t('message.enterEmail')"
          class="border-b border-[#EBECED] w-full outline-none h-12"
          @input="updateAccount($event.target.value)"
        />
      </label>
      <div class="border-b border-[#EBECED] w-full flex flex-1 justify-between">
        <label>
          <input
            :value="authCode.trim()"
            type="text"
            :placeholder="$t('message.enterAuthCode')"
            class="flex-1 outline-none h-12"
            @input="updateAuthCode($event.target.value)"
          />
        </label>
        <button
          v-if="!authCodeTimer"
          class="text-blue hover:text-gray"
          @click="getAuthCode"
        >
          {{ $t('message.getAuthCode') }}
        </button>
        <span v-else class="flex items-center justify-center">{{
          $t('message.afterSeconds', { seconds: authCodeTimer })
        }}</span>
      </div>
    </form>
    <div class="flex justify-end py-2 text-sm">
      <button class="hover:text-black w-fit" @click="openLog">
        {{ $t('message.feedbackError') }}
      </button>
    </div>
    <button
      class="bg-blue text-white rounded-sm h-9 hover:bg-[#0E66E7] mt-2"
      @click="login"
    >
      {{ $t('message.login') }}
    </button>
    <div
      v-if="showErrorLog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-1 cursor-pointer"
      @mousedown.self="showErrorLog = false"
    >
      <article
        class="w-[400px] h-[250px] cursor-default p-4 bg-white rounded-lg flex flex-col justify-between"
        @click.stop
      >
        <header
          class="text-md flex items-center justify-center text-black font-lg"
        >
          {{ $t('message.feedbackError') }}
        </header>
        <div class="flex items-center justify-center my-4">
          <textarea
            v-model="commitErrorLog"
            name="errorLog"
            :placeholder="$t('message.feedbackErrorContent')"
            class="border border-gray rounded-lg w-80 h-32 outline-none p-2"
          ></textarea>
        </div>
        <footer class="px-4 flex items-center justify-center">
          <button
            class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
            @click="showErrorLog = false"
          >
            {{ $t('message.cancel') }}
          </button>
          <button
            class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
            @click="commit"
          >
            {{ $t('message.commit') }}
          </button>
        </footer>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { sendAuthCode, codeLogin } from '@/api/login.js'
import { getUserInfo } from '@/api/user.js'
import { commitError } from '@/api/other'

const emits = defineEmits(['closeLogin'])

const { t } = useI18n()
const $toast = useToast()
const store = useStore()

// 验证码登录
const account = ref('')
const authCode = ref('')
const authCodeTimer = ref(null)
let intervalId = null

// 反馈错误
const showErrorLog = ref(false)
const commitErrorLog = ref('')

// 验证输入文本是否符合要求
const validateAccount = account => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(account)
}
const updateAccount = value => (account.value = value.replace(/\s/g, ''))
const updateAuthCode = value => (authCode.value = value.replace(/\s/g, ''))

// 获取验证码
const getAuthCode = async () => {
  try {
    if (!account.value.length) {
      $toast.error(t('message.emailEmpty'))
      return
    }
    if (!validateAccount(account.value)) {
      $toast.error(t('message.emailFormatError'))
      return
    }
    authCodeTimer.value = 60
    const res = await sendAuthCode(account.value)
    if (res.data.code !== 200) {
      authCodeTimer.value = null
      $toast.error(t('message.getAuthCodeError'))
      return
    }
    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(() => {
      authCodeTimer.value--
      if (authCodeTimer.value <= 0) {
        clearInterval(intervalId)
        authCodeTimer.value = null
        intervalId = null
      }
    }, 1000)
    $toast.success(t('message.getAuthCodeSuccess'))
  } catch (error) {
    authCodeTimer.value = null
    $toast.error(t('message.getAuthCodeError'))
  }
}

// 辅助函数(本地存token/refreshToken/userInfo)
const saveTokens = (token, refreshToken) => {
  store.commit('user/setToken', token)
  store.commit('user/setRefreshToken', refreshToken)
  localStorage.setItem('token', token)
  localStorage.setItem('refreshToken', refreshToken)
}
const saveUserInfo = userInfo => {
  store.commit('user/setUserInfo', userInfo)
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}
// 验证码登录
const login = async () => {
  try {
    if (!account.value.length) {
      $toast.error(t('message.emailEmpty'))
      return
    }
    if (!validateAccount(account.value)) {
      $toast.error(t('message.emailFormatError'))
      return
    }
    if (!authCode.value.length) {
      $toast.error(t('message.authCodeEmpty'))
      return
    }
    const res = await codeLogin(account.value, authCode.value)
    if (res.data.code !== 200) return
    saveTokens(res.data.data.token, res.data.data.refreshToken)
    const { data } = await getUserInfo(account.value)
    if (data.code !== 200) return
    saveUserInfo(data.data)
    emits('closeLogin')
    location.reload()
  } catch (error) {
    $toast.error(t('message.emailAuthCodeError'))
  }
}

// 打开反馈错误框
const openLog = () => (showErrorLog.value = true)

// 提交错误信息
const commit = async () => {
  if (!commitErrorLog.value.length) {
    $toast.error(t('message.commitErrorLogEmpty'))
    return
  }
  try {
    const res = await commitError(commitErrorLog.value)
    if (res.data.code !== 200) return
    $toast.success(t('message.commitErrorLogSuccess'))
    showErrorLog.value = false
  } catch (error) {
    $toast.error(t('message.commitErrorLogError'))
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
