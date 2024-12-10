<template>
  <div
    v-if="postInfo && userInfo"
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="w-full flex gap-x-2">
      <div class="w-2/3 min-h-[100vh] flex flex-col gap-y-4">
        <div
          class="p-3 overflow-hidden w-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm"
        >
          <div class="flex justify-between items-center">
            <div class="flex gap-x-4">
              <img
                :src="
                  userInfo?.avatar || require('@/assets/avatar_default.png')
                "
                alt="user avatar"
                class="rounded-full w-16 h-16"
              />
              <div class="flex flex-col items-center justify-center mr-8">
                <span class="truncate w-[300px]">{{ userInfo?.nickname }}</span>
                <span class="truncate w-[300px] text-xs text-[#999]">{{
                  userInfo?.introduction
                }}</span>
              </div>
            </div>
            <button
              class="py-1 px-3 bg-red-200 rounded-xl text-sm text-red-600"
            >
              +{{ $t('message.follow') }}
            </button>
            <!-- <button
            class="py-1 px-3 rounded-xl bg-warmGray-300 text-sm text-warmGray-600"
          >
            {{ $t('message.cancel') }}{{ $t('message.follow') }}
          </button> -->
          </div>
          <div class="mt-8">
            <p class="text-[#999] indent-8 break-all">
              {{ postInfo?.introduction }}
            </p>
          </div>
          <div class="mt-4 flex items-center justify-center">
            <img
              :src="postInfo?.coverUrl"
              alt="cover"
              class="w-[500px] h-[250px] rounded-lg"
            />
          </div>
          <div class="flex text-base items-center py-8">
            <div class="flex-1 h-px bg-[#EBECED] mr-2"></div>
            <span class="px-3">{{ $t('message.main') }}</span>
            <div class="flex-1 h-px bg-[#EBECED] ml-2"></div>
          </div>
          <div class="mt-6 pb-[180px]">
            <span v-html="postInfo.content"></span>
          </div>
        </div>
        <div
          class="p-3 overflow-hidden w-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm min-h-64"
        >
          评论区域
        </div>
      </div>
      <div ref="rightColumn" class="w-[328px]">
        <div class="h-fit p-1 rounded-lg top-14" :class="{ fixed: isFixed }">
          <div class="shadow-[0_0_20px_0_rgba(0,0,0,0.1)] bg-white rounded-lg">
            <WeatherView />
          </div>
          <div class="flex items-center justify-between mt-4 px-8">
            <button
              class="flex items-center justify-center w-fit h-8 py-2 px-2 text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="$router.back()"
            >
              {{ $t('message.back') }}
            </button>
            <button
              class="flex items-center justify-center w-fit h-8 py-1 px-2 text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="goTop"
            >
              {{ $t('message.toTop') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { getPostInfo } from '@/api/post'

const rightColumn = ref(null)
const isFixed = ref(false)
const postId = window.location.pathname.split('/')[2]
const postInfo = ref(null)
const userInfo = ref(null)

const getInfo = async () => {
  const res = await getPostInfo(postId)
  if (res.data.code !== 200) return
  postInfo.value = res.data.data.post
  userInfo.value = res.data.data.user
}

const handleScroll = () => {
  if (!rightColumn.value) return
  const rect = rightColumn.value.getBoundingClientRect()
  isFixed.value = rect.top <= 56
}

const goTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await getInfo()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
