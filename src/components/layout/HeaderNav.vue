<template>
  <header
    class="shadow-[0_0_20px_0_rgba(0,0,0,0.1)] text-gray w-full sticky top-0 left-0"
  >
    <nav class="flex justify-between pl-14 pr-24 bg-white h-14">
      <div class="inline-flex items-center justify-center">
        <span class="text-3xl text-blue">微</span>
        <span class="text-3xl text-blue ml-1">乎</span>
        <div class="ml-8 w-[280px] flex flex-1 gap-px text-lg">
          <router-link to="/" class="flex-1 text-center justify-center"
            >首页</router-link
          >
          <router-link to="/create" class="flex-1 text-center justify-center"
            >创作中心</router-link
          >
          <router-link to="friend" class="flex-1 text-center justify-center"
            >朋友圈</router-link
          >
        </div>
      </div>
      <div class="inline-flex items-center justify-center gap-4">
        <input
          v-model="searchText"
          type="text"
          placeholder="输入要搜索的内容..."
          class="w-[350px] h-8 rounded-2xl px-3"
          @keyup.enter="search"
        />
        <button
          class="h-8 w-20 rounded-2xl text-white bg-blue hover:bg-[#0E66E7]"
          @click="search"
        >
          搜索
        </button>
      </div>
      <div class="inline-flex items-center justify-center gap-5">
        <div class="relative clickOut">
          <button class="hover:text-blue" @click.stop="toggleMessage">
            消息
          </button>
          <transition name="fade">
            <MessageCard v-if="showMessage" />
          </transition>
        </div>
        <div class="relative clickOut">
          <button class="hover:text-blue" @click.stop="togglePrivateLetter">
            私信
          </button>
          <transition name="fade">
            <PrivateLetterCard v-if="showPrivateLetter" />
          </transition>
        </div>
        <div class="relative clickOut">
          <button class="hover:text-blue" @click.stop="toggleLogin">
            注册/登录
          </button>
          <transition name="fade">
            <LoginCard v-if="showLogin" @closeLogin="closeLogin" />
          </transition>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MessageCard from './MessageCard.vue'
import PrivateLetterCard from './PrivateLetterCard.vue'
import LoginCard from './LoginCard.vue'

const searchText = ref('')
const showMessage = ref(false)
const showPrivateLetter = ref(false)
const showLogin = ref(false)

const search = () => {
  console.log(111)
}

const toggleMessage = () => {
  showMessage.value = !showMessage.value
  showPrivateLetter.value = false
  showLogin.value = false
}
const togglePrivateLetter = () => {
  showPrivateLetter.value = !showPrivateLetter.value
  showMessage.value = false
  showLogin.value = false
}
const toggleLogin = () => {
  showLogin.value = !showLogin.value
  showMessage.value = false
  showPrivateLetter.value = false
}

const handleClickOutside = event => {
  if (!event.target.closest('.clickOut')) {
    showMessage.value = false
    showPrivateLetter.value = false
    showLogin.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const closeLogin = () => (showLogin.value = false)
</script>

<style lang="scss" scoped>
nav {
  a {
    @apply flex items-center h-14 border-b-[3px] border-transparent font-medium;
    &:hover {
      @apply text-blue border-blue;
    }
    &.router-link-exact-active {
      @apply text-blue border-blue;
    }
  }
  input {
    @apply bg-[#F8F8FA] border border-[#F8F8FA] transition-all duration-300 ease-in-out;
    &:focus {
      @apply border-[#8A96A9] bg-white outline-transparent outline-0;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300 ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
