<template>
  <header
    class="shadow-[0_0_20px_0_rgba(0,0,0,0.1)] text-gray w-full sticky top-0 left-0 z-20"
  >
    <nav class="flex justify-between px-2 bg-white h-14">
      <div class="inline-flex items-center justify-center">
        <router-link to="/" class="flex items-center cursor-pointer">
          <span class="text-3xl text-blue">{{ $t('message.wei') }}</span>
          <span class="text-3xl text-blue ml-1">{{ $t('message.hu') }}</span>
        </router-link>
        <div class="nav-item ml-8 flex w-[320px] flex-1 gap-px text-lg">
          <router-link to="/" class="flex-1 text-center justify-center">{{
            $t('message.home')
          }}</router-link>
          <router-link to="/create" class="flex-1 text-center justify-center">{{
            $t('message.creativeCenter')
          }}</router-link>
          <router-link to="friend" class="flex-1 text-center justify-center">{{
            $t('message.circleOfFriends')
          }}</router-link>
        </div>
      </div>
      <div class="nav-item inline-flex items-center justify-center gap-4">
        <input
          v-model="searchText"
          type="text"
          :placeholder="$t('message.searchContent')"
          class="w-[350px] h-8 rounded-2xl px-3"
          @keyup.enter="search"
        />
        <button
          class="h-8 w-20 rounded-2xl text-white bg-blue hover:bg-[#0E66E7]"
          @click="search"
        >
          {{ $t('message.search') }}
        </button>
      </div>
      <div class="inline-flex items-center justify-center gap-4">
        <div class="relative clickOut">
          <button class="hover:text-blue" @click.stop="toggleMessage">
            {{ $t('message.message') }}
          </button>
          <transition name="fade">
            <MessageCard v-if="showMessage" />
          </transition>
        </div>
        <div class="relative clickOut">
          <button class="hover:text-blue" @click.stop="togglePrivateLetter">
            {{ $t('message.privateLetter') }}
          </button>
          <transition name="fade">
            <PrivateLetterCard v-if="showPrivateLetter" />
          </transition>
        </div>
        <div v-if="!userInfo" class="relative clickOut ml-2">
          <button class="hover:text-blue" @click.stop="toggleLogin">
            {{ $t('message.login') }}
          </button>
          <transition name="fade">
            <LoginCard v-if="showLogin" @closeLogin="closeLogin" />
          </transition>
        </div>
        <div v-else class="relative clickOut ml-2">
          <img
            :src="userInfo.avatar || require('@/assets/avatar_default.png')"
            alt="user avatar"
            class="rounded-full w-8 h-8 cursor-pointer"
            @click.stop="toggleDropdown"
          />
          <transition name="fade">
            <UserDropdown
              v-if="showDropdown"
              @closeDropdown="showDropdown = false"
            />
          </transition>
        </div>
        <select
          v-model="currentLanguage"
          class="shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-lg outline-none cursor-pointer px-1 py-[2px]"
          @change="changeLanguage"
        >
          <option value="zh-cn">中文</option>
          <option value="en-us">English</option>
        </select>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import MessageCard from './message/MessageCard.vue'
import PrivateLetterCard from './PrivateLetterCard.vue'
import LoginCard from './login/LoginCard.vue'
import UserDropdown from './UserDropdown.vue'
import eventBus from '@/utils/eventBus'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = ref(localStorage.getItem('language') || 'zh-cn')
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const searchText = ref('')
const showMessage = ref(false)
const showPrivateLetter = ref(false)
const showLogin = ref(false)
const showDropdown = ref(false)
const changeLanguage = () => {
  locale.value = currentLanguage.value
  localStorage.setItem('language', currentLanguage.value)
}

watch(currentLanguage, changeLanguage)

const search = () => {
  if (!localStorage.getItem('token')) {
    eventBus.emit('openLogin')
    return
  }
  console.log('搜索')
}

const toggleMessage = () => {
  if (!localStorage.getItem('token')) {
    eventBus.emit('openLogin')
    return
  }
  showMessage.value = !showMessage.value
  showPrivateLetter.value = false
  showLogin.value = false
  showDropdown.value = false
}
const togglePrivateLetter = () => {
  if (!localStorage.getItem('token')) {
    eventBus.emit('openLogin')
    return
  }
  showPrivateLetter.value = !showPrivateLetter.value
  showMessage.value = false
  showLogin.value = false
  showDropdown.value = false
}
const toggleLogin = () => {
  showLogin.value = !showLogin.value
  showMessage.value = false
  showPrivateLetter.value = false
  showDropdown.value = false
}
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  showMessage.value = false
  showPrivateLetter.value = false
  showLogin.value = false
}

const handleClickOutside = event => {
  if (!event.target.closest('.clickOut')) {
    showMessage.value = false
    showPrivateLetter.value = false
    showLogin.value = false
    showDropdown.value = false
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
.nav-item {
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
