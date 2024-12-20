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
        :key="friend.id"
        class="flex items-center p-3 hover:bg-warmGray-200 cursor-pointer rounded-xl"
      >
        <div class="relative">
          <img
            :src="require('@/assets/bg_default.png')"
            alt="avatar"
            class="w-10 h-10 rounded-full"
          />
          <div
            class="absolute bottom-0 right-0 w-3 h-3 rounded-full"
            :class="friend.online ? 'bg-green-500' : 'bg-warmGray-500'"
          ></div>
        </div>
        <div class="ml-3 flex-1">
          <div class="mb-1 flex items-center justify-between">
            <span class="font-semibold">{{ friend.name }}</span>
            <span class="text-xs text-gray">{{ friend.time }}</span>
          </div>
          <div class="text-sm text-warmGray-500 w-[178px] truncate">
            {{ friend.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

const friends = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'path/to/avatar1.jpg',
    online: true,
    message: '上号上号上号',
    time: '2024-12-20 17:06'
  },
  {
    id: 2,
    name: '李四',
    avatar: 'path/to/avatar2.jpg',
    online: false,
    message: '吃了吗',
    time: '2024-12-20 17:06'
  },
  {
    id: 3,
    name: '张三',
    avatar: 'path/to/avatar1.jpg',
    online: true,
    message: '我敢',
    time: '2024-12-20 17:06'
  },
  {
    id: 4,
    name: '李四',
    avatar: 'path/to/avatar2.jpg',
    online: false,
    message: '901看看傻得可怜',
    time: '2024-12-20 17:06'
  },
  {
    id: 5,
    name: '张三',
    avatar: 'path/to/avatar1.jpg',
    online: true,
    message: '哈哈哈哈哈哈哈哈哈哈哈哈21321321',
    time: '2024-12-20 17:06'
  },
  {
    id: 6,
    name: '李四',
    avatar: 'path/to/avatar2.jpg',
    online: false,
    message: '离线',
    time: '2024-12-20 17:06'
  }
])

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
  if (!debouncedSearchQuery.value) return friends.value
  const lowercaseQuery = debouncedSearchQuery.value.toLowerCase()
  return friends.value.filter(
    friend =>
      friend.name.toLowerCase().includes(lowercaseQuery) ||
      friend.message.toLowerCase().includes(lowercaseQuery)
  )
})
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
