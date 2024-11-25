<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-1 cursor-pointer"
    @mousedown.self="emit('closeLogin')"
  >
    <div
      class="bg-white w-[360px] h-[440px] py-6 px-4 rounded shadow-[0_0_20px_0_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out cursor-default"
      @click.stop
    >
      <div class="flex">
        <div
          v-for="(method, index) in loginMethod"
          :key="index"
          class="flex items-center"
        >
          <button
            class="hover:text-black py-1"
            :class="{ 'text-black': method.active }"
            @click="changeLoginMethod(method.value)"
          >
            <span
              class="border-b-rectangle"
              :class="{ active: method.active }"
              >{{ method.label }}</span
            >
          </button>
          <div
            v-if="index < loginMethod.length - 1"
            class="w-px h-4 bg-[#EBECED] mx-4"
          ></div>
        </div>
      </div>
      <component :is="currentComponent"></component>
      <div class="flex text-xs items-center">
        <div class="flex-1 h-px bg-[#EBECED] mr-2"></div>
        <span>其他方式登录</span>
        <div class="flex-1 h-px bg-[#EBECED] ml-2"></div>
      </div>
      <div class="py-6 flex items-center justify-center">
        <a href="/" class="inline-block">
          <img src="../../../assets/weChat.png" class="w-6 h-6" />
        </a>
      </div>
      <div class="text-xs">
        <span>未注册手机验证后自动登录，注册即代表同意</span>
        <a href="/" target="_blank" class="hover:text-black">《协议》</a>
        <a href="/" target="_blank" class="hover:text-black"
          >《隐私保护指引》</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, markRaw } from 'vue'
import PasswordLogin from './PasswordLogin.vue'
import PhoneLogin from './PhoneLogin.vue'
const emit = defineEmits(['closeLogin'])

const loginMethod = ref([
  {
    label: '手机号登录',
    value: 'phone',
    active: true,
    component: markRaw(PhoneLogin)
  },
  {
    label: '密码登录',
    value: 'password',
    active: false,
    component: markRaw(PasswordLogin)
  }
])
const currentComponent = computed(
  () => loginMethod.value.find(m => m.active)?.component
)

const changeLoginMethod = v => {
  loginMethod.value.forEach(m => {
    m.active = false
  })
  loginMethod.value.find(m => m.value === v).active = true
}
</script>

<style lang="scss" scoped>
.fixed {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.border-b-rectangle {
  @apply border-b-[3px] border-transparent py-1;
  &:hover {
    @apply border-blue;
  }
  &.active {
    @apply border-blue;
  }
}
</style>
