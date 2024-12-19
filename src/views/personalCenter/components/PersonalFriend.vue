<template>
  <div
    v-if="loading"
    class="flex text-gray items-center justify-center py-4 h-full"
  >
    {{ $t('message.loading') }}
  </div>
  <template v-else-if="users.length">
    <div v-for="user in users" :key="user?.email">
      <div class="border-b border-[#EBECED]">
        <div class="px-4 py-2 flex items-center justify-between">
          <div class="flex items-center">
            <router-link
              :to="{ name: 'userInfo', params: { email: user?.email } }"
              ><img
                :src="user?.avatar"
                alt="avatar"
                class="rounded-full w-14 h-14 mr-2"
            /></router-link>
            <div class="flex flex-col">
              <div class="flex items-center">
                <router-link
                  :to="{ name: 'userInfo', params: { email: user?.email } }"
                  ><span>{{ user?.nickname }}</span></router-link
                >
                <img
                  v-if="user.sex === 0 || users.sex === 1"
                  :src="
                    user.sex === 0
                      ? require('../images/male.svg')
                      : require('../images/female.svg')
                  "
                  alt="sex"
                  class="ml-2 w-4 h-4"
                />
              </div>
              <span class="text-gray truncate max-w-[200px]">{{
                user?.introduction
              }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <template v-if="!email">
              <div v-if="user?.token" class="flex items-center gap-1">
                <div
                  class="w-0 h-0 border-4 border-[#4CAF50] rounded-full"
                ></div>
                <span>{{ $t('message.online') }}</span>
              </div>
              <span v-else>{{ handleTime(user?.lastLoginDate) }}</span>
            </template>
            <div v-if="user.email !== userInfo.email">
              <button
                v-if="!user?.isFollowing"
                class="py-1 px-3 bg-red-200 rounded-xl text-sm text-red-600"
                @click="follow(user?.email)"
              >
                +{{ $t('message.follow') }}
              </button>
              <button
                v-else-if="user?.isFollowing"
                class="py-1 px-3 rounded-xl bg-warmGray-300 text-sm text-warmGray-600"
                @click="follow(user?.email)"
              >
                {{ $t('message.cancel') }}{{ $t('message.follow') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <div
    v-else-if="users.length === 0 && !loading"
    class="flex items-center justify-center text-gray flex-col gap-3 text-xl w-full h-full"
  >
    <span>{{ $t('message.noFriend') }}</span>
    <div>
      <span>{{ $t('message.goto') }} </span>
      <router-link :to="{ name: 'home' }" class="hover:text-blue">
        {{ $t('message.home') }}
      </router-link>
      <span> {{ $t('message.know') }}</span>
    </div>
  </div>
  <div
    v-if="noMore && users.length"
    class="flex items-center justify-center text-gray py-4 text-lg"
  >
    {{ $t('message.noMore') }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getOnesInfo } from '@/api/user'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { followUser } from '@/api/user'
import { useToast } from 'vue-toast-notification'

const emit = defineEmits(['handleChange'])
const props = defineProps({
  email: {
    type: String,
    default: ''
  }
})

const $toast = useToast()
const { t } = useI18n()
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const users = ref([])
const loading = ref(false)
const noMore = ref(false)
const isInitialLoad = ref(true)
const currentPage = ref(1)
const limit = ref(10)

const handleTime = time => {
  const givenTime = new Date(time)
  const now = new Date()
  const diffMs = now - givenTime
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMs < 3600000) {
    return t('message.ltHourOnline')
  } else if (diffDays < 1) {
    return t('message.hourOnline', { hour: diffHours })
  } else if (diffDays < 7) {
    return t('message.dayOnline', { day: diffDays })
  } else {
    return t('message.dayOnline', { day: 7 })
  }
}

const follow = async email => {
  try {
    const res = await followUser(userInfo.value?.email, email)
    if (res.data.code !== 200) return
    users.value = users.value.map(user => {
      if (user?.email === email) {
        if (user?.isFollowing)
          emit('handleChange', { type: 'unFollow', num: -1 })
        else emit('handleChange', { type: 'follow', num: 1 })
        return { ...user, isFollowing: !user.isFollowing }
      }
      return user
    })
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const getInfo = async () => {
  try {
    if (loading.value) return
    loading.value = true
    const emailToUse = props.email || userInfo.value?.email
    const userEmail = props.email ? userInfo.value?.email : ''
    const res = await getOnesInfo(
      emailToUse,
      currentPage.value,
      limit.value,
      'friend',
      userEmail
    )
    if (res.data.code !== 200) return
    users.value = [...users.value, ...res.data.data.users]
    if (res.data.data.users.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const loadMore = async () => {
  if (noMore.value || isInitialLoad.value) return
  currentPage.value++
  await getInfo()
}

const handleScroll = debounce(async () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (
    documentHeight - windowHeight - scrollTop < 50 &&
    !noMore.value &&
    !isInitialLoad.value &&
    !loading.value &&
    users.value.length > 0
  ) {
    await loadMore()
  }
}, 200)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  if (isInitialLoad.value) {
    await getInfo()
    isInitialLoad.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
