<template>
  <div class="py-6 px-4 flex flex-col">
    <div class="text-sm h-[135px]">
      <input
        :value="account.trim()"
        type="text"
        placeholder="输入QQ邮箱/163邮箱"
        class="border-b border-[#EBECED] w-full py-2 outline-none h-12"
        @input="updateAccount($event.target.value)"
      />
      <input
        :value="password.trim()"
        type="password"
        placeholder="输入密码"
        class="border-b border-[#EBECED] w-full py-2 outline-none h-12"
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
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { passwordLogin } from '@/api/login.js'
import { getUserInfo } from '@/api/user.js'
import { useStore } from 'vuex'

const store = useStore()

const emits = defineEmits(['closeLogin'])

const account = ref('')
const password = ref('')
const $toast = useToast()

const validateAccount = account => {
  const accountRegex = /[a-zA-Z0-9._%+-]+@(?:163\.com|qq\.com)/
  return accountRegex.test(account)
}

const updateAccount = value => (account.value = value.replace(/\s/g, ''))
const updatePassword = value => (password.value = value.replace(/\s/g, ''))

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
    if (!password.value.length) {
      $toast.error('密码不能为空')
      return
    }
    const res = await passwordLogin(account.value, password.value)
    if (res.data.code !== 200) return
    store.commit('user/setToken', res.data.data.token)
    localStorage.setItem('token', res.data.data.token)
    const { data } = await getUserInfo(account.value)
    if (data.code !== 200) return
    store.commit('user/setUserInfo', data.data)
    localStorage.setItem('userInfo', JSON.stringify(data.data))
    $toast.success('登录成功')
    emits('closeLogin')
  } catch (error) {
    $toast.error('邮箱或密码错误')
  }
}
</script>
