<template>
  <section class="py-6 px-4 flex flex-col">
    <form class="text-sm h-[100px]" @submit.prevent="login">
      <label>
        <input
          :value="account.trim()"
          type="text"
          :placeholder="$t('message.enterEmail')"
          class="border-b border-[#EBECED] w-full py-2 outline-none h-12"
          @input="updateAccount($event.target.value)"
        />
        <input
          :value="password.trim()"
          type="password"
          :placeholder="$t('message.enterPassword')"
          class="border-b border-[#EBECED] w-full py-2 outline-none h-12"
          @input="updatePassword($event.target.value)"
        />
      </label>
    </form>
    <div class="flex justify-end py-2 text-sm">
      <button class="hover:text-black w-fit" @click="showForgetPassword = true">
        {{ $t('message.forgetPassword') }}
      </button>
    </div>
    <button
      class="bg-blue text-white rounded-sm h-9 hover:bg-[#0E66E7] mt-2"
      @click="login"
    >
      {{ $t('message.login') }}
    </button>
    <div
      v-if="showForgetPassword"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-1 cursor-pointer"
      @mousedown.self="showForgetPassword = false"
    >
      <article
        class="w-[400px] h-[250px] cursor-default p-4 bg-white rounded-lg"
        @click.stop
      >
        <header
          class="text-lg flex items-center justify-center text-black font-lg"
        >
          {{ $t('message.forgetPassword') }}
        </header>
        <section v-if="forgetPasswordStep === 0" class="text-sm h-[100px] mt-3">
          <form @submit.prevent="gotoNext">
            <label>
              <input
                :value="forgetAccount.trim()"
                type="text"
                :placeholder="$t('message.enterEmail')"
                class="border-b border-[#EBECED] w-full outline-none h-12"
                @input="updateForgetAccount($event.target.value)"
              />
            </label>
            <div class="border-b border-[#EBECED] w-full flex justify-between">
              <label class="flex-grow">
                <input
                  :value="authCode.trim()"
                  type="text"
                  :placeholder="$t('message.enterAuthCode')"
                  class="w-full outline-none h-12"
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
          <div class="px-4 flex items-center justify-center mt-8">
            <button
              class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="cancelNext"
            >
              {{ $t('message.cancel') }}
            </button>
            <button
              class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
              @click="gotoNext"
            >
              {{ $t('message.nextStep') }}
            </button>
          </div>
        </section>
        <section
          v-else-if="forgetPasswordStep === 1"
          class="text-sm h-[100px] mt-3"
        >
          <div class="border-b border-[#EBECED] w-full flex justify-between">
            <label class="flex-grow">
              <input
                v-model="newPassword"
                type="text"
                :placeholder="$t('message.newPassword')"
                class="w-full outline-none h-12"
                minLength="6"
                maxlength="20"
              />
            </label>
          </div>
          <div
            class="border-b border-[#EBECED] w-full flex flex-1 justify-between"
          >
            <label>
              <input
                v-model="newPasswordAgain"
                type="password"
                :placeholder="$t('message.newPasswordAgain')"
                minLength="6"
                maxlength="20"
                class="flex-1 outline-none h-12"
              />
            </label>
          </div>
          <div class="px-4 flex items-center justify-center mt-8">
            <button
              class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="cancelNext"
            >
              {{ $t('message.cancel') }}
            </button>
            <button
              class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
              @click="saveChangePassword"
            >
              {{ $t('message.commit') }}
            </button>
          </div>
        </section>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { passwordLogin, sendAuthCode, judgeAuthCode } from '@/api/login.js'
import { getUserInfo } from '@/api/user.js'
import { savePassword } from '@/api/other'

const emits = defineEmits(['closeLogin'])

const { t } = useI18n()
const $toast = useToast()
const store = useStore()

// 验证密码登录
const account = ref('')
const password = ref('')

// 忘记密码处理
const showForgetPassword = ref(false)
const forgetAccount = ref('')
const forgetPasswordStep = ref(0)

// 验证码
const authCode = ref('')
const authCodeTimer = ref(null)
let intervalId = null

// 输入新密码/再次输入新密码
const newPassword = ref('')
const newPasswordAgain = ref('')

// 验证输入文本是否符合要求
const validateAccount = account => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(account)
}
const updateAccount = value => (account.value = value.replace(/\s/g, ''))
const updatePassword = value => (password.value = value.replace(/\s/g, ''))
const updateForgetAccount = value =>
  (forgetAccount.value = value.replace(/\s/g, ''))
const updateAuthCode = value => (authCode.value = value.replace(/\s/g, ''))

// 获取验证码
const getAuthCode = async () => {
  try {
    if (!forgetAccount.value.length) {
      $toast.error(t('message.emailEmpty'))
      return
    }
    if (!validateAccount(forgetAccount.value)) {
      $toast.error(t('message.emailFormatError'))
      return
    }
    authCodeTimer.value = 60
    const res = await sendAuthCode(forgetAccount.value)
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
// 密码登录
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
    if (!password.value.length) {
      $toast.error(t('message.passwordEmpty'))
      return
    }
    const res = await passwordLogin(account.value, password.value)
    if (res.data.code !== 200) return
    saveTokens(res.data.data.token, res.data.data.refreshToken)
    const { data } = await getUserInfo(account.value)
    if (data.code !== 200) return
    saveUserInfo(data.data)
    emits('closeLogin')
    location.reload()
  } catch (error) {
    $toast.error(t('message.emailPasswordError'))
  }
}

// 取消修改密码
const cancelNext = () => {
  forgetPasswordStep.value = 0
  forgetAccount.value = ''
  authCode.value = ''
  showForgetPassword.value = false
}

// 修改密码下一步
const gotoNext = async () => {
  try {
    if (!forgetAccount.value.length) {
      $toast.error(t('message.emailEmpty'))
      return
    }
    if (!validateAccount(forgetAccount.value)) {
      $toast.error(t('message.emailFormatError'))
      return
    }
    if (!authCode.value.length) {
      $toast.error(t('message.authCodeEmpty'))
      return
    }
    const res = await judgeAuthCode(forgetAccount.value, authCode.value)
    if (res.data.code !== 200) return
    forgetPasswordStep.value = 1
    authCode.value = ''
  } catch (error) {
    $toast.error(t('message.authCodeError'))
  }
}

// 修改密码
const saveChangePassword = async () => {
  if (!newPassword.value.length) {
    $toast.error(t('message.newPasswordEmpty'))
    return
  }
  if (!newPasswordAgain.value.length) {
    $toast.error(t('message.newPasswordAgainEmpty'))
    return
  }
  if (newPassword.value !== newPasswordAgain.value) {
    $toast.error(t('message.newPasswordNotEqual'))
    return
  }
  try {
    const res = await savePassword(forgetAccount.value, newPassword.value)
    if (res.data.code !== 200) return
    $toast.success(t('message.modifySuccess'))
    cancelNext()
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}
</script>
