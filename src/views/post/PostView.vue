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
              <router-link
                :to="{ name: 'userInfo', params: { email: userInfo?.email } }"
              >
                <img
                  :src="
                    userInfo?.avatar || require('@/assets/avatar_default.png')
                  "
                  alt="user avatar"
                  class="rounded-full w-16 h-16"
                />
              </router-link>
              <div class="flex flex-col justify-center mr-8 gap-y-1">
                <router-link
                  :to="{ name: 'userInfo', params: { email: userInfo?.email } }"
                  ><span class="truncate w-[300px]">{{
                    userInfo?.nickname
                  }}</span></router-link
                >
                <span class="truncate w-[300px] text-xs text-[#999]">{{
                  userInfo?.introduction
                }}</span>
              </div>
            </div>
            <div v-if="storeUser?.email !== userInfo?.email">
              <button
                v-if="!userInfo?.isFollowing"
                class="py-1 px-3 bg-red-200 rounded-xl text-sm text-red-600"
                @click="follow()"
              >
                +{{ $t('message.follow') }}
              </button>
              <button
                v-else-if="userInfo?.isFollowing"
                class="py-1 px-3 rounded-xl bg-warmGray-300 text-sm text-warmGray-600"
                @click="follow()"
              >
                {{ $t('message.cancel') }}{{ $t('message.follow') }}
              </button>
            </div>
          </div>
          <div class="flex items-center text-[#999] mt-1 justify-between">
            <span class="text-xs">{{
              convertToCST(postInfo?.publishDate)
            }}</span>
            <div class="flex items-center justify-center gap-1">
              <img
                :src="require('./images/eye.svg')"
                alt="eye"
                class="w-4 h-4"
              />
              <span class="text-[14px]">{{ postInfo.lookNum }}</span>
            </div>
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
          class="p-4 overflow-hidden w-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm min-h-64"
        >
          <div class="border border-[#EBECED] w-full h-full rounded-sm">
            <div class="border-b border-[#EBECED] p-4">
              <span class="text-lg"
                >{{ postInfo.commentNum }} {{ $t('message.tiaoComment') }}</span
              >
            </div>
            <div class="p-2">评论内容</div>
          </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { useStore } from 'vuex'
import { followUser } from '@/api/user'
import { getPostInfo } from '@/api/post'
import { useToast } from 'vue-toast-notification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $toast = useToast()
const store = useStore()
const storeUser = computed(() => store.state.user.userInfo)
const rightColumn = ref(null)
const isFixed = ref(false)
const postId = window.location.pathname.split('/')[2]
const postInfo = ref(null)
const userInfo = ref(null)

const getInfo = async () => {
  const res = await getPostInfo(postId, storeUser.value.email)
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

const convertToCST = isoString => {
  const date = new Date(isoString)
  const utcOffsetMilliseconds = -8 * 60 * 60 * 1000
  const cstTime = new Date(date.getTime() + utcOffsetMilliseconds)
  const formattedDate =
    cstTime.toLocaleDateString().replace(/-/g, ' ') +
    ' ' +
    cstTime
      .toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/^\D*/, '')
  return formattedDate
}

const follow = async () => {
  try {
    const res = await followUser(storeUser.value.email, userInfo.value.email)
    if (res.data.code !== 200) return
    userInfo.value.isFollowing = !userInfo.value.isFollowing
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await getInfo()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
