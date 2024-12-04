<template>
  <div class="mx-32 my-5 bg-white rounded-sm relative">
    <div class="bg-white w-full relative shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
      <div
        class="h-56 bg-cover bg-center relative cursor-pointer"
        :style="{
          backgroundImage: `url(${
            userInfo?.homeBg || require('@/assets/bg_default.png')
          })`
        }"
        @click="bgFileInput.click()"
      >
        <input
          ref="bgFileInput"
          type="file"
          class="hidden outline-none h-8"
          @change="handleBgChange"
        />
        <span
          class="border border-white border-opacity-80 absolute top-4 right-4 text-white bg-black bg-opacity-20 text-opacity-80 px-2 py-1 text-sm rounded"
        >
          {{ $t('message.uploadHomeBg') }}
        </span>
      </div>
      <div
        class="w-40 h-40 rounded-lg absolute top-48 left-6 border-4 border-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] overflow-hidden group cursor-pointer"
        @click="avatarFileInput.click()"
      >
        <img
          :src="userInfo?.avatar || require('@/assets/avatar_default.png')"
          class="rounded-sm"
          alt="个人头像"
        />
        <input
          ref="avatarFileInput"
          type="file"
          class="hidden outline-none h-8"
          @change="handleAvatarChange"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      <span class="absolute top-[380px] left-[24px]"
        >{{ $t('message.ipAddress') }}：{{ userInfo?.ipAddress }}</span
      >
      <div class="pl-[220px] py-3 h-full pr-4">
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center pr-8 justify-center">
            <template v-if="!changeNickname">
              <span class="text-2xl">{{ userInfo?.nickname }}</span>
              <span
                class="ml-4 text-base text-blue cursor-pointer"
                @click="changeNickname = true"
                >{{ $t('message.modify') }}</span
              >
            </template>
            <template v-else>
              <span class="text-2xl">{{ $t('message.nickname') }}</span>
              <input
                v-model="newNickname"
                type="text"
                class="ml-4 border border-gray rounded w-64 px-2 outline-none h-8"
                maxlength="20"
              />
              <button
                class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                @click="changeNickname = false"
              >
                {{ $t('message.cancel') }}
              </button>
              <button
                class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                @click="saveChangeNickname"
              >
                {{ $t('message.save') }}
              </button>
            </template>
          </div>
          <a href="/personalCenter" class="text-sm text-[#666] hover:text-blue"
            >{{ $t('message.return') }} &gt;</a
          >
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">{{ $t('message.sex') }}</div>
          <div
            v-if="!changeSex"
            class="flex items-center justify-between flex-1 px-8"
          >
            <span>
              {{
                userInfo?.sex === 0
                  ? $t('message.male')
                  : userInfo?.sex === 1
                  ? $t('message.female')
                  : userInfo?.sex === 2
                  ? $t('message.other')
                  : ''
              }}
            </span>
            <button class="ml-4 text-base text-blue" @click="changeSex = true">
              {{ $t('message.modify') }}
            </button>
          </div>
          <div v-else class="flex items-center justify-between flex-1 px-8">
            <div class="flex items-center">
              <span>{{ $t('message.male') }}</span
              ><input
                v-model="sex"
                :value="0"
                type="radio"
                class="mr-6 ml-2 outline-none h-8"
              />
              <span>{{ $t('message.female') }}</span
              ><input
                v-model="sex"
                :value="1"
                type="radio"
                class="mr-6 ml-2 outline-none h-8"
              />
              <span>{{ $t('message.other') }}</span
              ><input
                v-model="sex"
                :value="2"
                type="radio"
                class="mr-6 ml-2 outline-none h-8"
              />
            </div>
            <div>
              <button
                class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                @click="changeSex = false"
              >
                {{ $t('message.cancel') }}
              </button>
              <button
                class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                @click="saveChangeSex"
              >
                {{ $t('message.save') }}
              </button>
            </div>
          </div>
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">
            {{ $t('message.dateOfBirth') }}
          </div>
          <div
            v-if="!changeBirthDate"
            class="flex items-center justify-between flex-1 px-8"
          >
            <span>{{ userInfo?.birthDate }}</span>
            <button
              class="ml-4 text-base text-blue"
              @click="changeBirthDate = true"
            >
              {{ $t('message.modify') }}
            </button>
          </div>
          <div v-else class="flex items-center justify-between flex-1 px-8">
            <div class="w-64">
              <VueDatePicker
                v-model="birthDate"
                input-format="yyyy-MM-dd"
                :placeholder="$t('message.pickDate')"
                :enable-time-picker="false"
                :format="format"
                hide-offset-dates
                :max-date="new Date()"
                hide-input-icon
                locale="zh-CN"
                :select-text="$t('message.select')"
                :cancel-text="$t('message.cancel')"
                :clearable="false"
              />
            </div>
            <div>
              <button
                class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                @click="changeBirthDate = false"
              >
                {{ $t('message.cancel') }}
              </button>
              <button
                class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                @click="saveChangeBirthDate"
              >
                {{ $t('message.save') }}
              </button>
            </div>
          </div>
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">{{ $t('message.live') }}</div>
          <div
            v-if="!changeLive"
            class="flex items-center justify-between flex-1 px-8"
          >
            <span>{{ userInfo?.live }}</span>
            <button class="ml-4 text-base text-blue" @click="changeLive = true">
              {{ $t('message.modify') }}
            </button>
          </div>
          <div v-else class="flex items-center justify-between flex-1 px-8">
            <div class="w-64">
              <input
                v-model="newLive"
                type="text"
                class="ml-4 border border-gray rounded w-64 px-2 outline-none h-8"
                maxlength="20"
              />
            </div>
            <div>
              <button
                class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                @click="changeLive = false"
              >
                {{ $t('message.cancel') }}
              </button>
              <button
                class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                @click="saveChangeLive"
              >
                {{ $t('message.save') }}
              </button>
            </div>
          </div>
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">
            {{ $t('message.individualResume') }}
          </div>
          <div
            v-if="!changeIntroduction"
            class="flex items-center justify-between flex-1 px-8"
          >
            <div class="password-container">
              <span class="pass-word">{{ userInfo?.introduction || '' }}</span>
              <div class="toolTip">{{ userInfo?.introduction }}</div>
            </div>
            <button
              class="ml-4 text-base text-blue"
              @click="changeIntroduction = true"
            >
              {{ $t('message.modify') }}
            </button>
          </div>
          <div v-else class="flex flex-col flex-1 px-8 gap-2">
            <textarea
              v-model="introduction"
              :placeholder="$t('message.enterIndividualResume')"
              maxlength="200"
              class="outline-none h-8 w-full border border-gray rounded p-2 min-h-32 text-sm"
            ></textarea>
            <div class="flex items-center gap-3 justify-end">
              <button
                class="w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                @click="cancelIntroduction"
              >
                {{ $t('message.cancel') }}
              </button>
              <button
                class="w-16 h-8 py-1 px-2 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                @click="saveChangeIntroduction"
              >
                {{ $t('message.save') }}
              </button>
            </div>
          </div>
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">{{ $t('message.email') }}</div>
          <div
            v-if="!changeEmail"
            class="flex items-center justify-between flex-1 px-8"
          >
            <span>{{ userInfo?.email }}</span>
            <button
              class="ml-4 text-base text-blue"
              @click="changeEmail = true"
            >
              {{ $t('message.modify') }}
            </button>
          </div>
          <div v-else class="flex items-center justify-between flex-1 px-8">
            <template v-if="changeEmailStep === 0">
              <div class="flex flex-col gap-2">
                <div
                  class="w-72 pl-2 border border-gray rounded flex items-center justify-between"
                >
                  <input
                    :value="email"
                    type="text"
                    :placeholder="$t('message.enterOriginalEmail')"
                    maxlength="20"
                    class="w-48 text-sm outline-none h-8"
                    @input="updateAccount($event.target.value)"
                  />
                  <button
                    v-if="!authCodeTimer"
                    class="text-blue text-sm px-2 rounded"
                    @click="getAuthCode('old')"
                  >
                    {{ $t('message.getAuthCode') }}
                  </button>
                  <span
                    v-else
                    class="flex items-center justify-center text-xs mr-2 text-gray"
                    >{{
                      ($t('message.afterSeconds'), { seconds: authCodeTimer })
                    }}</span
                  >
                </div>
                <input
                  :value="authCode"
                  type="text"
                  :placeholder="$t('message.enterAuthCode')"
                  class="border border-gray rounded px-2 w-48 text-sm outline-none h-8"
                  @input="updateAuthCode($event.target.value)"
                />
              </div>
              <div>
                <button
                  class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                  @click="cancelEmail"
                >
                  {{ $t('message.cancel') }}
                </button>
                <button
                  class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                  @click="nextEmailStep"
                >
                  {{ $t('message.nextStep') }}
                </button>
              </div>
            </template>
            <template v-else-if="changeEmailStep === 1">
              <div class="flex flex-col gap-2">
                <div
                  class="w-72 pl-2 border border-gray rounded flex items-center justify-between"
                >
                  <input
                    :value="email"
                    type="text"
                    :placeholder="$t('message.enterNewEmail')"
                    maxlength="20"
                    class="w-48 text-sm outline-none h-8"
                    @input="updateAccount($event.target.value)"
                  />
                  <button
                    v-if="!authCodeTimer"
                    class="text-blue text-sm px-2 rounded"
                    @click="getAuthCode"
                  >
                    {{ $t('message.getAuthCode') }}
                  </button>
                  <span
                    v-else
                    class="flex items-center justify-center text-xs mr-2 text-gray"
                    >{{
                      ($t('message.afterSeconds'), { seconds: authCodeTimer })
                    }}</span
                  >
                </div>
                <input
                  type="text"
                  :value="authCode"
                  :placeholder="$t('message.getAuthCode')"
                  class="border border-gray rounded px-2 w-48 text-sm outline-none h-8"
                  @input="updateAuthCode($event.target.value)"
                />
              </div>
              <div>
                <button
                  class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                  @click="cancelEmail"
                >
                  {{ $t('message.cancel') }}
                </button>
                <button
                  class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                  @click="saveChangeEmail"
                >
                  {{ $t('message.save') }}
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">
            {{ $t('message.password') }}
          </div>
          <div
            v-if="!changePassword"
            class="flex items-center justify-between flex-1 px-8 relative"
          >
            <div class="password-container">
              <span class="pass-word">{{ userInfo?.password || '' }}</span>
              <span class="toolTip">{{ userInfo?.password }}</span>
            </div>
            <button
              class="ml-4 text-base text-blue"
              @click="changePassword = true"
            >
              {{ $t('message.modify') }}
            </button>
          </div>
          <div v-else class="flex justify-between items-center px-8 flex-1">
            <template v-if="changePasswordStep === 0">
              <div class="flex flex-col gap-2">
                <div
                  class="w-72 pl-2 border border-gray rounded flex items-center justify-between"
                >
                  <input
                    :value="email"
                    type="text"
                    :placeholder="$t('message.enterEmail')"
                    maxlength="20"
                    class="w-48 text-sm outline-none h-8"
                    @input="updateAccount($event.target.value)"
                  />
                  <button
                    v-if="!authCodeTimer"
                    class="text-blue text-sm px-2 rounded"
                    @click="getAuthCode"
                  >
                    {{ $t('message.getAuthCode') }}
                  </button>
                  <span
                    v-else
                    class="flex items-center justify-center text-xs mr-2 text-gray"
                    >{{
                      ($t('message.afterSeconds'), { seconds: authCodeTimer })
                    }}</span
                  >
                </div>
                <input
                  type="text"
                  :value="authCode"
                  :placeholder="$t('message.enterAuthCode')"
                  class="border border-gray rounded px-2 w-48 text-sm outline-none h-8"
                  @input="updateAuthCode($event.target.value)"
                />
              </div>
              <div>
                <button
                  class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                  @click="cancelPassword"
                >
                  {{ $t('message.cancel') }}
                </button>
                <button
                  class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                  @click="nextPasswordStep"
                >
                  {{ $t('message.nextStep') }}
                </button>
              </div>
            </template>
            <template v-else-if="changePasswordStep === 1">
              <div class="flex flex-col gap-2">
                <div class="w-72 flex flex-col gap-2">
                  <input
                    v-model="oldPassword"
                    type="text"
                    :placeholder="$t('message.enterOldPassword')"
                    class="border border-gray rounded px-2 w-64 text-sm outline-none h-8"
                  />
                  <input
                    v-model="newPassword"
                    type="text"
                    :placeholder="$t('message.enterNewPassword')"
                    class="border border-gray rounded px-2 w-64 text-sm outline-none h-8"
                    minLength="6"
                    maxlength="20"
                  />
                </div>
              </div>
              <div>
                <button
                  class="ml-6 w-16 h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
                  @click="cancelPassword"
                >
                  {{ $t('message.cancel') }}
                </button>
                <button
                  class="w-16 h-8 py-1 px-2 ml-3 text-sm rounded bg-blue text-white hover:bg-[#0E66E7]"
                  @click="saveChangePassword"
                >
                  {{ $t('message.save') }}
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="border-b border-[#999] py-8 flex items-center">
          <div class="w-32 border-r border-gray">
            {{ $t('message.registrationDate') }}
          </div>
          <span class="px-8">{{ userInfo?.registrationDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {
  getUserInfo,
  saveNickname,
  saveSex,
  saveEmail,
  savePassword,
  saveIntroduction,
  saveBirthDate,
  uploadAvatar,
  uploadHomeBg,
  saveLive
} from '@/api/user'
import { judgeAuthCode, sendAuthCode } from '@/api/login'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const bgFileInput = ref(null)
const avatarFileInput = ref(null)
const changeNickname = ref(false)
const newNickname = ref('')
const changeSex = ref(false)
const changeEmail = ref(false)
const email = ref('')
const changeEmailStep = ref(0)
const authCodeTimer = ref(null)
let intervalId = null
const $toast = useToast()
const authCode = ref('')
const sex = ref(userInfo?.value.sex)
const changePassword = ref(false)
const changePasswordStep = ref(0)
const oldPassword = ref('')
const newPassword = ref('')
const changeIntroduction = ref(false)
const introduction = ref(userInfo.value.introduction)
const changeBirthDate = ref(false)
const birthDate = ref(userInfo.value.birthDate)
const changeLive = ref(false)
const newLive = ref(userInfo.value.live)

const format = date =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

const getInfo = async () => {
  const res = await getUserInfo(userInfo?.value.email)
  if (res.data.code !== 200) return
  store.commit('user/setUserInfo', res.data.data)
  localStorage.setItem('userInfo', JSON.stringify(res.data.data))
}

const handleBgChange = async event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('homeBg', file)
    formData.append('type', 'bg')
    formData.append('account', userInfo.value.email)
    try {
      const res = await uploadHomeBg(formData)
      if (res.data.code !== 200) return
      await getInfo()
      $toast.success(t('message.uploadSuccess'))
    } catch (error) {
      $toast.error(t('message.uploadError'))
    }
  }
}

const handleAvatarChange = async event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('type', 'avatar')
    formData.append('account', userInfo.value.email)
    try {
      const res = await uploadAvatar(formData)
      if (res.data.code !== 200) return
      await getInfo()
      $toast.success(t('message.uploadSuccess'))
    } catch (error) {
      $toast.error(t('message.uploadError'))
    }
  }
}

const saveChangeNickname = async () => {
  try {
    const res = await saveNickname(userInfo.value.email, newNickname.value)
    if (res.data.code !== 200) return
    changeNickname.value = false
    getInfo()
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

const saveChangeSex = async () => {
  try {
    const res = await saveSex(userInfo.value.email, sex.value)
    if (res.data.code !== 200) return
    changeSex.value = false
    getInfo()
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

const saveChangeLive = async () => {
  try {
    const res = await saveLive(userInfo.value.email, newLive.value)
    if (res.data.code !== 200) return
    changeLive.value = false
    getInfo()
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

const validateAccount = account => {
  const accountRegex = /[a-zA-Z0-9._%+-]+@(?:163\.com|qq\.com)/
  return accountRegex.test(account)
}
const updateAccount = value => (email.value = value.replace(/\s/g, ''))
const updateAuthCode = value => (authCode.value = value.replace(/\s/g, ''))

const getAuthCode = async (type = '') => {
  if (email.value !== userInfo.value.email && type === 'old') {
    $toast.error(t('message.enterOldEmail'))
    return
  }
  if (!email.value.length) {
    $toast.error(t('message.emailEmpty'))
    return
  }
  if (!validateAccount(email.value)) {
    $toast.error(t('message.emailFormatError'))
    return
  }
  try {
    const res = await sendAuthCode(email.value)
    if (res.data.code !== 200) return
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
    $toast.success(t('message.getAuthCodeSuccess'))
  } catch (error) {
    $toast.error(t('message.getAuthCodeError'))
  }
}

const cancelEmail = () => {
  intervalId = null
  authCodeTimer.value = null
  email.value = ''
  authCode.value = ''
  changeEmailStep.value = 0
  changeEmail.value = false
  clearInterval(intervalId)
}

const cancelPassword = () => {
  intervalId = null
  authCodeTimer.value = null
  email.value = ''
  authCode.value = ''
  changePasswordStep.value = 0
  changePassword.value = false
  clearInterval(intervalId)
}

const cancelIntroduction = () => {
  changeIntroduction.value = false
  introduction.value = ''
}

const nextEmailStep = async () => {
  try {
    const res = await judgeAuthCode(email.value, authCode.value)
    if (res.data.code !== 200) return
    email.value = ''
    authCode.value = ''
    authCodeTimer.value = null
    intervalId = null
    changeEmailStep.value = 1
    clearInterval(intervalId)
  } catch (error) {
    $toast.error(t('message.authCodeError'))
  }
}

const nextPasswordStep = async () => {
  try {
    const res = await judgeAuthCode(email.value, authCode.value)
    if (res.data.code !== 200) return
    email.value = ''
    authCode.value = ''
    authCodeTimer.value = null
    intervalId = null
    changePasswordStep.value = 1
    clearInterval(intervalId)
  } catch (error) {
    $toast.error(t('message.authCodeError'))
  }
}

const saveChangeEmail = async () => {
  try {
    const judgeRes = await judgeAuthCode(email.value, authCode.value)
    if (judgeRes.data.code !== 200) return
    const saveRes = await saveEmail(userInfo.value.email, email.value)
    if (saveRes.data.code !== 200) return
    const res = await getUserInfo(email.value)
    if (res.data.code !== 200) return
    store.commit('user/setUserInfo', res.data.data)
    localStorage.setItem('userInfo', JSON.stringify(res.data.data))
    email.value = ''
    authCode.value = ''
    authCodeTimer.value = null
    intervalId = null
    changeEmailStep.value = 0
    changeEmail.value = false
    clearInterval(intervalId)
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

const saveChangePassword = async () => {
  try {
    if (userInfo.value.password !== oldPassword.value) {
      $toast.error(t('message.oldPasswordError'))
      return
    }
    if (newPassword.value.length < 6) {
      $toast.error(t('message.newPasswordLength'))
      return
    }
    const saveRes = await savePassword(userInfo.value.email, newPassword.value)
    if (saveRes.data.code !== 200) return
    const res = await getUserInfo(userInfo.value.email)
    if (res.data.code !== 200) return
    store.commit('user/setUserInfo', res.data.data)
    localStorage.setItem('userInfo', JSON.stringify(res.data.data))
    oldPassword.value = ''
    newPassword.value = ''
    authCode.value = ''
    authCodeTimer.value = null
    intervalId = null
    changePasswordStep.value = 0
    changePassword.value = false
    clearInterval(intervalId)
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

const saveChangeIntroduction = async () => {
  try {
    const res = await saveIntroduction(userInfo.value.email, introduction.value)
    if (res.data.code !== 200) return
    changeIntroduction.value = false
    getInfo()
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

const saveChangeBirthDate = async () => {
  try {
    const res = await saveBirthDate(
      userInfo.value.email,
      format(birthDate.value)
    )
    if (res.data.code !== 200) return
    changeBirthDate.value = false
    getInfo()
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style lang="scss" scoped>
input {
  @apply outline-none h-8;
}
textarea {
}
.password-container {
  @apply relative inline-block max-w-96;
  .pass-word {
    @apply inline-block truncate max-w-full;
  }
  .toolTip {
    @apply text-wrap absolute top-6 w-full left-1/2 -translate-x-1/2 max-w-[200px] break-all h-fit py-1 px-2 bg-black bg-opacity-80 text-white text-xs rounded-sm opacity-0 invisible;
  }
  &:hover .toolTip {
    @apply opacity-100 visible;
  }
}
</style>
