<template>
  <header
    class="shadow-[0_0_20px_0_rgba(0,0,0,0.1)] text-gray w-full sticky top-0 left-0 z-20"
  >
    <nav class="flex justify-between px-10 bg-white h-14">
      <section class="inline-flex items-center justify-center">
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
          <router-link to="/friend" class="flex-1 text-center justify-center">{{
            $t('message.circleOfFriends')
          }}</router-link>
          <router-link to="/chat" class="flex-1 text-center justify-center">{{
            $t('message.chat')
          }}</router-link>
        </div>
      </section>
      <section
        class="nav-item inline-flex items-center justify-center gap-4 relative"
      >
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('message.searchContent')"
          class="w-[350px] h-8 rounded-2xl px-3"
          @keyup.enter="handleSearch"
          @focus="isFocused = true"
          @blur="handleBlur"
        />
        <button
          class="h-8 w-20 rounded-2xl text-white bg-blue hover:bg-[#0E66E7]"
          @click="handleSearch"
        >
          {{ $t('message.search') }}
        </button>
        <div
          v-if="isFocused || isHoveringResults"
          class="w-full rounded-sm absolute right-[50px] top-[56px] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-[400px] overflow-y-auto"
          @mouseenter="isHoveringResults = true"
          @mouseleave="isHoveringResults = false"
        >
          <div
            class="flex items-center justify-around py-2 border-b border-[#EBECED]"
          >
            <template v-for="(h, index) in searchHeader" :key="index">
              <button
                class="py-1 hover:text-black"
                :class="{ 'text-black': h.active }"
                @click="toggleHeader(h.value)"
              >
                {{ h.label }}
              </button>
            </template>
          </div>
          <template v-if="type === 'post'">
            <template v-for="s in searchResult" :key="s._id">
              <a
                :href="`/post/${s.postId}`"
                target="_blank"
                class="cursor-pointer flex items-center gap-2 p-2 hover:bg-[#F5F5F5] !h-[85px]"
                @mousedown.prevent="handleResultClick()"
              >
                <img
                  :src="s.coverUrl"
                  alt="cover"
                  class="w-[85px] h-[60px] rounded-sm"
                />
                <div class="flex flex-col items-center gap-1">
                  <div class="w-[310px] truncate">
                    {{ $t('message.title') }}: {{ s.title }}
                  </div>
                  <div class="w-[310px] truncate">
                    {{ $t('message.introduction') }}: {{ s.introduction }}
                  </div>
                </div>
              </a>
            </template>
            <div
              v-if="!searchResult.length"
              class="flex items-center justify-center h-[350px] text-gray"
            >
              {{ $t('message.noData') }}
            </div>
          </template>
          <template v-else-if="type === 'user'">
            <template v-for="s in searchResult" :key="s._id">
              <a
                :href="`/userInfo/${s.email}`"
                target="_blank"
                class="cursor-pointer flex !items-baseline flex-col gap-2 py-2 px-4 hover:bg-[#F5F5F5] !h-[110px]"
                @mousedown.prevent="handleResultClick()"
              >
                <div class="flex items-center gap-2">
                  <img
                    :src="s.avatar"
                    alt="avatar"
                    class="w-[60px] h-[60px] rounded-full"
                  />
                  <div class="flex flex-col items-center gap-1">
                    <div class="w-[310px] truncate">
                      {{ s.nickname }}
                    </div>
                    <div class="w-[310px] truncate">
                      {{ s.introduction }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span
                    >{{ $t('message.post') }}:
                    {{ s.postNum > 10000 ? '9999+' : s.postNum }}</span
                  >
                  <span
                    >{{ $t('message.follow') }}:
                    {{ s.followNum > 10000 ? '9999+' : s.followNum }}</span
                  >
                  <span
                    >{{ $t('message.fans') }}:
                    {{ s.fanNum > 10000 ? '9999+' : s.fanNum }}</span
                  >
                </div>
              </a>
            </template>
            <div
              v-if="!searchResult.length"
              class="flex items-center justify-center h-[350px] text-gray"
            >
              {{ $t('message.noData') }}
            </div>
          </template>
        </div>
      </section>
      <section class="inline-flex items-center justify-center gap-4">
        <div class="relative clickOut">
          <button class="hover:text-blue relative" @click.stop="toggleMessage">
            {{ $t('message.message') }}
          </button>
          <div
            v-if="newNotification"
            class="rounded-full border-4 border-[#FE4144] w-0 h-0 absolute top-0 -right-1"
          ></div>
          <transition name="fade">
            <MessageCard v-if="showMessage" />
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
      </section>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import eventBus from '@/utils/eventBus'
import MessageCard from './message/MessageCard.vue'
import LoginCard from './login/LoginCard.vue'
import UserDropdown from './UserDropdown.vue'
import { judgeNewNotification } from '@/api/notification'
import { search } from '@/api/post'

const store = useStore()
const { locale } = useI18n()

// 用户信息
const userInfo = computed(() => store.state.user.userInfo)

// 显示消息框/登录框/下拉框
const showMessage = ref(false)
const showLogin = ref(false)
const showDropdown = ref(false)

// 搜索
const searchQuery = ref('')
const searchResult = ref([])
const isFocused = ref(false)
const isHoveringResults = ref(false)
const type = ref('post')
const searchHeader = computed(() => {
  return [
    { label: '帖子', value: 'post', active: type.value === 'post' },
    { label: '用户', value: 'user', active: type.value === 'user' }
  ]
})

// 切换语言
const currentLanguage = ref(localStorage.getItem('language') || 'zh-cn')
const changeLanguage = () => {
  locale.value = currentLanguage.value
  localStorage.setItem('language', currentLanguage.value)
}
watch(currentLanguage, changeLanguage)

// 是否有新消息
const newNotification = ref(false)
const judgeNew = async () => {
  if (!localStorage.getItem('token')) return
  const res = await judgeNewNotification(userInfo.value._id)
  if (res.data.code !== 200) return
  newNotification.value = res.data.data.new
}

// 搜索框失去焦点
const handleBlur = () => {
  setTimeout(() => {
    if (!isHoveringResults.value) isFocused.value = false
  }, 100)
}

// 点击跳转搜索结果
const handleResultClick = () => {
  setTimeout(() => {
    isFocused.value = false
    isHoveringResults.value = false
  }, 100)
}

// 切换搜素类型
const toggleHeader = v => {
  if (type.value === v) return
  type.value = v
}

// 防抖搜索
const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}
const debouncedSearch = debounce(async query => {
  const res = await search(query, type.value)
  if (res.data.code !== 200) return
  searchResult.value = res.data.data?.results
}, 500)

// 监听搜索框输入搜索
watch(searchQuery, newQuery => {
  if (newQuery === '') {
    searchResult.value = []
    return
  }
  if (isFocused.value || isHoveringResults.value) debouncedSearch(newQuery)
})
// 搜索类型变化 重新搜索
watch(type, () => {
  if (isFocused.value || isHoveringResults.value) {
    searchResult.value = []
    debouncedSearch(searchQuery.value)
  }
})

// 点击搜索跳转
const handleSearch = () => {
  if (!localStorage.getItem('token')) {
    eventBus.emit('openLogin')
    return
  }
  if (searchQuery.value === '') return
  let route = router.resolve({
    path: '/search',
    query: { q: searchQuery.value, t: type.value }
  })
  window.open(route.href, '_blank')
}

// 切换消息框/登录框/下拉框的显示状态(互斥)
const toggleMessage = () => {
  if (!localStorage.getItem('token')) {
    eventBus.emit('openLogin')
    return
  }
  showMessage.value = !showMessage.value
  showLogin.value = false
  showDropdown.value = false
}
const toggleLogin = () => {
  showLogin.value = !showLogin.value
  showMessage.value = false
  showDropdown.value = false
}
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  showMessage.value = false
  showLogin.value = false
}
// 点击区域外关闭
const handleClickOutside = event => {
  if (!event.target.closest('.clickOut')) {
    showMessage.value = false
    showLogin.value = false
    showDropdown.value = false
  }
}
// 关闭登录框
const closeLogin = () => (showLogin.value = false)

// 登录框显示时禁止页面滚动
watch(showLogin, (newValue, oldValue) => {
  if (oldValue === newValue) return
  document.body.style.overflow = newValue ? 'hidden' : 'auto'
})

onMounted(() => {
  judgeNew()
  document.addEventListener('click', handleClickOutside)
  eventBus.on('refreshNotification', () => judgeNew())
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  eventBus.off('refreshNotification', () => judgeNew())
})
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
