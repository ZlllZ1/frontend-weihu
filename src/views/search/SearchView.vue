<template>
  <div class="min-w-[100vw] min-h-[100vh] flex justify-center bg-white">
    <div class="flex flex-col h-full py-2 px-4 gap-3 w-[75%]">
      <div class="flex gap-2 w-full justify-center">
        <input
          v-model="searchQuery"
          type="text"
          class="w-[350px] h-10 rounded-xl px-3"
          :placeholder="$t('message.searchContent')"
        />
        <button
          class="h-10 w-20 rounded-xl text-white bg-blue hover:bg-[#0E66E7]"
          @click="handleSearch"
        >
          {{ $t('message.search') }}
        </button>
      </div>
      <div
        class="flex text-gray py-2 bg-white w-full border-b border-[#EBECED]"
      >
        <div class="flex gap-10">
          <template v-for="(h, index) in searchHeader" :key="index">
            <button
              class="py-1 hover:text-black border-b-2 border-transparent hover:border-blue"
              :class="{ 'text-black !border-blue': h.active }"
              @click="toggleHeader(h.value)"
            >
              {{ h.label }}
            </button>
          </template>
        </div>
      </div>
      <div class="bg-white flex flex-wrap gap-2">
        <template v-if="type === 'post'">
          <template v-for="s in searchResult" :key="s._id">
            <a
              :href="`/post/${s.postId}`"
              target="_blank"
              class="cursor-pointer flex flex-col gap-2 p-2 hover:bg-[#F5F5F5]"
            >
              <div class="flex items-center justify-center">
                <img
                  :src="s.coverUrl"
                  alt="cover"
                  class="w-[192px] h-[100px] rounded-sm"
                />
              </div>
              <div class="flex flex-col items-center gap-1 text-gray">
                <div class="w-[210px] truncate text-sm">
                  {{ s.title }}
                </div>
                <div class="w-[210px] truncate text-xs">
                  {{ s.introduction }}
                </div>
              </div>
              <div class="flex justify-between text-xs">
                <div class="flex items-center gap-1">
                  <div
                    class="flex items-center justify-center bg-[#FE4144] rounded-full w-4 h-4 text-white"
                  >
                    A
                  </div>
                  <div class="w-[80px] truncate">{{ s.user.nickname }}</div>
                </div>
                <span>{{ convertToCST(s.publishDate) }}</span>
              </div>
            </a>
          </template>
          <div
            v-if="!searchResult.length"
            class="flex items-center justify-center h-[350px] w-full text-gray"
          >
            {{ $t('message.noData') }}
          </div>
        </template>
      </div>
      <div class="bg-white w-full flex flex-wrap gap-2">
        <template v-if="type === 'user'">
          <template v-for="s in searchResult" :key="s._id">
            <a
              :href="`/userInfo/${s.email}`"
              target="_blank"
              class="cursor-pointer flex !items-baseline flex-col gap-2 py-2 px-4 hover:bg-[#F5F5F5] !h-[110px]"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="s.avatar"
                  alt="avatar"
                  class="w-[60px] h-[60px] rounded-full"
                />
                <div class="flex flex-col items-center gap-1">
                  <div class="w-[360px] truncate">
                    {{ s.nickname }}
                  </div>
                  <div class="w-[360px] truncate text-gray">
                    {{ s.introduction }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray">
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
            class="flex items-center justify-center h-[350px] w-full text-gray"
          >
            {{ $t('message.noData') }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { search } from '@/api/post'

const getQueryVariable = v => {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (pair[0] == v) {
      return decodeURIComponent(pair[1])
    }
  }
  return false
}
const searchQuery = ref(getQueryVariable('q') || '')
const type = ref(getQueryVariable('t') || 'post')
const searchResult = ref([])
const currentPage = ref(1)
const limit = ref(10)

const searchHeader = computed(() => {
  return [
    { label: '帖子', value: 'post', active: type.value === 'post' },
    { label: '用户', value: 'user', active: type.value === 'user' }
  ]
})

const convertToCST = isoString => {
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

const toggleHeader = v => {
  if (type.value === v) return
  type.value = v
}

const handleSearch = async () => {
  const res = await search(searchQuery.value, type.value)
  if (res.data.code !== 200) return
  searchResult.value = res.data.data?.results
}

watch(type, () => {
  searchResult.value = []
  handleSearch()
})

onMounted(() => {
  handleSearch()
  if (window.location.search) {
    const currentUrl = window.location.href
    const urlWithoutQuery = currentUrl.split('?')[0]
    window.history.replaceState(null, '', urlWithoutQuery)
  }
})
</script>

<style lang="scss" scoped>
input {
  @apply bg-[#F8F8FA] border border-[#F8F8FA] transition-all duration-300 ease-in-out;
  &:focus {
    @apply border-[#8A96A9] bg-white outline-transparent outline-0;
  }
}
</style>
