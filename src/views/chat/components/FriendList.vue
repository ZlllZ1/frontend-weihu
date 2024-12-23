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
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="friend in filteredFriends"
        :key="friend?.id"
        class="flex items-center p-3 hover:bg-warmGray-200 cursor-pointer rounded-xl"
        @click="openChat(friend?.friend?.email)"
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
            class="absolute -top-[2px] left-[30px] z-10 bg-red-600 rounded-full text-white w-3 h-3 text-xs flex items-center justify-center"
          >
            {{ friend?.myUnreadCount }}
          </div>
          <div
            class="absolute bottom-0 right-0 w-3 h-3 rounded-full"
            :class="friend?.friend?.online ? 'bg-green-500' : 'bg-warmGray-500'"
          ></div>
        </div>
        <div class="ml-3 flex-1 flex flex-col h-10 gap-1">
          <div class="mb-1 flex items-center justify-between">
            <div class="font-semibold w-24 truncate">
              {{ friend?.friend?.nickname }}
            </div>
            <span class="text-xs text-gray">{{
              friend?.lastMessage?.timestamp
            }}</span>
          </div>
          <div class="text-sm text-warmGray-500 w-[148px] truncate">
            {{ friend?.lastMessage?.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

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
      friend.name.toLowerCase().includes(lowercaseQuery) ||
      friend.message.toLowerCase().includes(lowercaseQuery)
  )
})

const openChat = email => {
  emit('open', email)
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
