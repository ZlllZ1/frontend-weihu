<template>
  <div class="w-64 h-full bg-gray-10 flex flex-col">
    <div class="p-4 border-b border-warmGray-200">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('message.searchFriends')"
        class="w-full px-3 py-2 rounded-md border border-warmGray-300 focus:outline-none focus:ring-1 focus:border-transparent focus:ring-blue-500"
      />
    </div>
    <div v-if="filteredFriends.length" class="flex-1 overflow-y-auto">
      <div
        v-for="friend in filteredFriends"
        :key="friend?.id"
        class="flex items-center p-3 hover:bg-warmGray-200 cursor-pointer rounded-xl"
        @click="openChat(friend?.chatId, friend?.friend?.email)"
      >
        <div class="relative">
          <img
            :src="
              friend?.friend?.avatar || require('@/assets/avatar_default.png')
            "
            alt="avatar"
            class="w-10 h-10 rounded-full"
          />
          <div
            v-if="friend?.myUnreadCount"
            class="absolute -top-[2px] left-[30px] z-10 bg-red-600 rounded-full text-white w-4 h-4 text-xs flex items-center justify-center"
          >
            {{ friend?.myUnreadCount > 100 ? '99+' : friend?.myUnreadCount }}
          </div>
        </div>
        <div class="ml-3 flex-1 flex flex-col h-11">
          <div class="mb-1 flex items-center justify-between">
            <div class="w-16 truncate">
              {{ friend?.friend?.nickname }}
            </div>
            <span class="text-xs text-gray">{{
              convertToCST(friend?.lastMessage?.timestamp) || ''
            }}</span>
          </div>
          <div class="text-sm text-warmGray-500">
            <template v-if="friend?.lastMessage?.senderEmail"
              ><span v-if="friend?.lastMessage?.senderEmail === userInfo?.email"
                >[{{ $t('message.me') }}]:
              </span>
              <span
                v-else-if="friend?.lastMessage?.senderEmail !== userInfo?.email"
                >[{{ $t('message.f') }}]:
              </span></template
            >
            {{ processHtmlString(friend?.lastMessage?.content) }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <div class="text-gray">{{ $t('message.noFriends') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const props = defineProps({
  friends: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['open'])
const searchQuery = ref('')
const debouncedSearchQuery = ref('')

const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const debouncedSetSearchQuery = debounce(value => {
  debouncedSearchQuery.value = value
}, 300)

watchEffect(() => {
  debouncedSetSearchQuery(searchQuery.value)
})

const filteredFriends = computed(() => {
  if (!debouncedSearchQuery.value) return props.friends
  const lowercaseQuery = debouncedSearchQuery.value.toLowerCase()
  return props.friends.filter(
    friend =>
      friend.friend.nickname.toLowerCase().includes(lowercaseQuery) ||
      friend.lastMessage.content.toLowerCase().includes(lowercaseQuery)
  )
})

const openChat = (chatId, email) => emit('open', { chatId, email })

const convertToCST = isoString => {
  if (!isoString) return ''
  const date = new Date(isoString.replace('Z', '+00:00'))
  const utcTimestamp = date.getTime()
  const cstDate = new Date(utcTimestamp)
  const formattedDate =
    cstDate.toLocaleDateString().replace(/-/g, ' ') +
    ' ' +
    cstDate
      .toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
      .replace(/^\D*/, '')
  return formattedDate
}
const processHtmlString = htmlString => {
  if (/<video[^>]*>/i.test(htmlString)) return '[视频]'
  if (/<img[^>]*>/i.test(htmlString)) return '[图片]'
  let text = htmlString.replace(/<[^>]*>/g, '')
  text = text.replace(/&nbsp;/g, ' ').trim()
  if (text.length > 8) return text.substring(0, 8) + '...'
  return text
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #ebeced;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #ebeced;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ddd;
}
</style>
