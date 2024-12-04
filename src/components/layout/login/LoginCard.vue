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
      <component
        :is="currentComponent"
        @closeLogin="emit('closeLogin')"
      ></component>
      <div class="flex text-xs items-center">
        <div class="flex-1 h-px bg-[#EBECED] mr-2"></div>
        <span>{{ $t('message.otherLogin') }}</span>
        <div class="flex-1 h-px bg-[#EBECED] ml-2"></div>
      </div>
      <div class="py-6 flex items-center justify-center">
        <img
          src="../../../assets/weChat.png"
          class="w-6 h-6 cursor-pointer"
          @click="showCode = !showCode"
        />
      </div>
      <div
        v-if="showCode"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-1 cursor-pointer"
        @mousedown.self="showCode = false"
      >
        <div
          class="w-40 h-48 cursor-default p-2 bg-white rounded-lg flex flex-col items-center justify-center"
          @click.stop
        >
          <div class="bg-black w-full h-32"></div>
          <button class="text-sm mt-4 text-blue">
            {{ $t('message.refresh') }}
          </button>
        </div>
      </div>
      <div class="text-xs">
        <span>{{ $t('message.remind') }}</span>
        <a href="/protocol" target="_blank" class="hover:text-black">{{
          $t('message.protocol')
        }}</a>
        <a href="/privacyGuidelines" target="_blank" class="hover:text-black">{{
          $t('message.privacy')
        }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, markRaw } from 'vue'
import PasswordLogin from './PasswordLogin.vue'
import CodeLogin from './CodeLogin.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['closeLogin'])

const loginMethod = ref([
  {
    label: t('message.emailLogin'),
    value: 'code',
    active: true,
    component: markRaw(CodeLogin)
  },
  {
    label: t('message.passwordLogin'),
    value: 'password',
    active: false,
    component: markRaw(PasswordLogin)
  }
])
const currentComponent = computed(
  () => loginMethod.value.find(m => m.active)?.component
)
const showCode = ref(false)

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
