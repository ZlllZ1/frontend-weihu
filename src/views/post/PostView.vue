<template>
  <div
    v-if="postInfo && userInfo"
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="w-full flex gap-x-2">
      <div class="w-2/3 min-h-[100vh] flex flex-col gap-y-4 mb-16">
        <div
          class="p-3 overflow-hidden bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm"
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
                <div class="truncate w-[300px]">
                  <router-link
                    :to="{
                      name: 'userInfo',
                      params: { email: userInfo?.email }
                    }"
                    >{{ userInfo?.nickname }}</router-link
                  >
                </div>
                <span class="truncate w-[300px] text-xs text-[#999]">{{
                  userInfo?.introduction
                }}</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-2 w-20">
              <div
                class="flex items-center gap-1 group cursor-pointer"
                @click="copyUrl()"
              >
                <img
                  class="w-5 h-5 group-hover:text-black"
                  src="../home/images/share.svg"
                  alt="share"
                />
                <span class="text-[#8A8A8A] group-hover:text-black">{{
                  $t('message.share')
                }}</span>
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
        <div
          class="fixed flex items-center justify-between py-1 px-2 bottom-0 h-16 bg-white w-[672px] shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm"
        >
          <div class="nav-item inline-flex items-center justify-between gap-4">
            <textarea
              v-model="commentText"
              type="text"
              :placeholder="$t('message.commentText')"
              class="w-[360px] outline-none rounded-xl overflow-hidden scroll-auto px-2 pt-2 resize-none text-sm"
            ></textarea>
            <button
              class="h-8 w-20 rounded-2xl text-white bg-blue hover:bg-[#0E66E7]"
              @click="comment"
            >
              {{ $t('message.comment') }}
            </button>
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="handlePraise(postInfo?.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  postInfo.isPraise
                    ? require('../home/images/hasPraise.svg')
                    : require('../home/images/praise.svg')
                "
                alt="praise"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                :class="{ 'text-[#FE4144]': postInfo?.isPraise }"
                >{{ $t('message.like') }}
                {{
                  postInfo?.praiseNum > 1000 ? '999+' : postInfo?.praiseNum
                }}</span
              >
            </div>
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="handleCollect(postInfo?.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  postInfo.isCollect
                    ? require('../home/images/hasCollect.svg')
                    : require('../home/images/collect.svg')
                "
                alt="collect"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FF8C00]"
                :class="{ 'text-[#FF8C00]': postInfo?.isCollect }"
                >{{ $t('message.collect') }}
                {{
                  postInfo?.collectNum > 1000 ? '999+' : postInfo?.collectNum
                }}</span
              >
            </div>
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
import {
  getPostInfo,
  praisePost,
  collectPost,
  updateShareNum
} from '@/api/post'
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
const commentText = ref('')

const copyUrl = async () => {
  try {
    const url = window.location.origin + '/post/' + postInfo.value.postId
    navigator.clipboard.writeText(url)
    if (postInfo.value.email === userInfo.value.email) {
      $toast.success(t('message.copySuccess'))
      return
    }
    const res = await updateShareNum(postInfo.value.postId)
    if (res.data.code !== 200) return
    $toast.success(t('message.copySuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.copySuccess'))
  }
}

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

const handlePraise = async postId => {
  try {
    const res = await praisePost(userInfo.value.email, postId)
    if (res.data.code !== 200) return
    if (postInfo.value.isPraise) postInfo.value.praiseNum--
    else postInfo.value.praiseNum++
    postInfo.value.isPraise = !postInfo.value.isPraise
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const handleCollect = async postId => {
  try {
    const res = await collectPost(userInfo.value.email, postId)
    if (res.data.code !== 200) return
    if (postInfo.value.isCollect) postInfo.value.collectNum--
    else postInfo.value.collectNum++
    postInfo.value.isCollect = !postInfo.value.isCollect
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

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

const comment = async () => {
  console.log('评论')
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await getInfo()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.nav-item {
  textarea {
    @apply bg-[#F8F8FA] border border-[#F8F8FA] transition-all duration-300 ease-in-out;
    &:focus {
      @apply border-[#8A96A9] bg-white outline-transparent outline-0;
    }
  }
}
</style>
