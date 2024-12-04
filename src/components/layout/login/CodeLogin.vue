<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <input
        :value="account.trim()"
        type="text"
        :placeholder="$t('message.enterQQOr163')"
        class="border-b border-[#EBECED] w-full outline-none h-12"
        @input="updateAccount($event.target.value)"
      />
      <div class="border-b border-[#EBECED] w-full flex flex-1 justify-between">
        <input
          :value="authCode.trim()"
          type="text"
          :placeholder="$t('message.enterAuthCode')"
          class="flex-1 outline-none h-12"
          @input="updateAuthCode($event.target.value)"
        />
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
      <div class="flex justify-end py-2">
        <a
          href="/feedbackError"
          target="_blank"
          class="hover:text-black w-fit"
          >{{ $t('message.feedbackError') }}</a
        >
      </div>
    </div>
    <button
      class="bg-blue text-white rounded-sm h-9 hover:bg-[#0E66E7] mt-2"
      @click="login"
    >
      {{ $t('message.login') }}
    </button>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { sendAuthCode, codeLogin } from '@/api/login.js'
import { getUserInfo } from '@/api/user.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    store.commit('user/setToken', res.data.data.token)
    localStorage.setItem('token', res.data.data.token)
    const userRes = await getUserInfo(account.value)
    if (userRes.data.code !== 200) return
    store.commit('user/setUserInfo', userRes.data.data)
    localStorage.setItem('userInfo', JSON.stringify(userRes.data.data))
    $toast.success(t('message.loginSuccess'))
    emits('closeLogin')
  } catch (error) {
    $toast.error(t('message.emailAuthCodeError'))
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
