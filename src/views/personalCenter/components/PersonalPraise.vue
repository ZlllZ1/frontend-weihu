<template>
  <div v-if="loading" class="flex items-center justify-center py-4 h-full">
    {{ $t('message.loading') }}
  </div>
  <template v-if="posts.length">
    <template v-for="post in posts" :key="post.postId">
      <div
        class="p-4 border-b border-[rgb(235,236,237)] h-[220px] overflow-hidden w-full flex justify-between flex-col"
      >
        <div class="title-container">
          <div class="title">
            {{ post.title }}
          </div>
          <span class="title-reminder">
            {{ post.title }}
          </span>
        </div>
        <div class="py-2 flex">
          <router-link :to="{ name: 'post', params: { postId: post.postId } }">
            <img
              :src="post.coverUrl"
              alt="post cover"
              class="w-[190px] h-[105px]"
            />
          </router-link>
          <div class="py-1 px-2 flex-1 relative">
            <router-link
              :to="{ name: 'post', params: { postId: post.postId } }"
              class="inline-flex"
            >
              <span class="text-[#8A8A8A] hover:text-black break-all">
                {{ clipIntroduction(post.introduction) }}
              </span>
            </router-link>
            <router-link
              :to="{ name: 'post', params: { postId: post.postId } }"
              class="absolute right-0 bottom-1 text-[#09408E] hover:text-blue"
            >
              {{ $t('message.readFull') }} &gt;
            </router-link>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-x-3">
            <img
              :src="post.user.avatar || require('@/assets/avatar_default.png')"
              alt="user avatar"
              class="rounded-full w-8 h-8"
            />
            <div class="flex items-center">
              <span class="truncate w-16 text-[#8A8A8A] hover:text-black">{{
                post.user.nickname
              }}</span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-12">
            <router-link
              :to="{ name: 'post', params: { postId: post.postId } }"
              class="flex items-center gap-1 group"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                src="../../home/images/comment.svg"
                alt="comment"
              />
              <span class="text-[#8A8A8A] group-hover:text-blue"
                >{{ $t('message.comment') }}
                {{ post.commentNum > 1000 ? '999+' : post.commentNum }}</span
              ></router-link
            >
            <div
              :to="{ name: 'post', params: { postId: post.postId } }"
              class="flex items-center gap-1 group cursor-pointer"
              @click="handlePraise(post.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  post.isPraise
                    ? require('../../home/images/hasPraise.svg')
                    : require('../../home/images/praise.svg')
                "
                alt="praise"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                :class="{ 'text-[#FE4144]': post.isPraise }"
                >{{ $t('message.like') }}
                {{ post.praiseNum > 1000 ? '999+' : post.praiseNum }}</span
              >
            </div>
            <div
              :to="{ name: 'post', params: { postId: post.postId } }"
              class="flex items-center gap-1 group cursor-pointer"
              @click="handleCollect(post.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  post.isCollect
                    ? require('../../home/images/hasCollect.svg')
                    : require('../../home/images/collect.svg')
                "
                alt="collect"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FF8C00]"
                :class="{ 'text-[#FF8C00]': post.isCollect }"
                >{{ $t('message.collect') }}
                {{ post.collectNum > 1000 ? '999+' : post.collectNum }}</span
              >
            </div>
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="copyUrl(post)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                src="../../home/images/share.svg"
                alt="share"
              />
              <span class="text-[#8A8A8A] group-hover:text-black">{{
                $t('message.share')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
  <div
    v-else-if="posts.length === 0 && !loading"
    class="flex items-center justify-center text-gray flex-col gap-3 text-xl w-full h-full"
  >
    <span>{{ $t('message.noPraise') }}</span>
    <div>
      <span>{{ $t('message.go') }} </span>
      <router-link :to="{ name: 'home' }" class="hover:text-blue">
        {{ $t('message.home') }}
      </router-link>
      <span> {{ $t('message.haveALook') }}</span>
    </div>
  </div>
  <div
    v-if="noMore && posts.length"
    class="flex items-center justify-center text-gray py-4 text-lg"
  >
    {{ $t('message.noMore') }}
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { getMyPosts } from '@/api/post'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import { useI18n } from 'vue-i18n'
import { praisePost, collectPost, updateShareNum } from '@/api/post'

const emit = defineEmits(['handleChange'])
const props = defineProps({
  email: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()
const $toast = useToast()
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const posts = ref([])
const loading = ref(false)
const noMore = ref(false)
const isInitialLoad = ref(true)
const currentPage = ref(1)
const limit = ref(10)

const clipIntroduction = introduction => {
  if (introduction.length > 80) return introduction.slice(0, 80) + '...'
  return introduction
}

const getPosts = async () => {
  try {
    if (loading.value) return
    loading.value = true
    const emailToUse = props.email || userInfo.value?.email
    const userEmail = props.email ? userInfo.value?.email : ''
    const res = await getMyPosts(
      emailToUse,
      currentPage.value,
      limit.value,
      'praise',
      userEmail
    )
    if (res.data.code !== 200) return
    posts.value = [...posts.value, ...res.data.data.posts]
    if (res.data.data.posts.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handlePraise = async postId => {
  try {
    const res = await praisePost(userInfo.value?.email, postId)
    if (res.data.code !== 200) return
    posts.value = posts.value.map(post => {
      if (post.postId === postId) {
        if (post.isPraise) {
          post.praiseNum--
          emit('handleChange', { type: 'praise', num: -1 })
        } else {
          post.praiseNum++
          emit('handleChange', { type: 'praise', num: 1 })
        }
        return { ...post, isPraise: !post.isPraise }
      }
      return post
    })
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const handleCollect = async postId => {
  try {
    const res = await collectPost(userInfo.value?.email, postId)
    if (res.data.code !== 200) return
    posts.value = posts.value.map(post => {
      if (post.postId === postId) {
        if (post.isCollect) {
          post.collectNum--
          emit('handleChange', { type: 'collect', num: -1 })
        } else {
          post.collectNum++
          emit('handleChange', { type: 'collect', num: 1 })
        }
        return { ...post, isCollect: !post.isCollect }
      }
      return post
    })
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const copyUrl = async post => {
  try {
    const url = window.location.origin + '/post/' + post.postId
    navigator.clipboard.writeText(url)
    if (post.email === userInfo.value.email) {
      $toast.success(t('message.copySuccess'))
      return
    }
    const res = await updateShareNum(post.postId)
    if (res.data.code !== 200) return
    $toast.success(t('message.copySuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.copySuccess'))
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
  await getPosts()
}

const handleScroll = debounce(async () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (
    documentHeight - windowHeight - scrollTop < 50 &&
    !noMore.value &&
    !isInitialLoad.value
  ) {
    await loadMore()
  }
}, 200)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  if (isInitialLoad.value) {
    await getPosts()
    isInitialLoad.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.title-container {
  @apply w-full text-lg relative h-7;
  .title {
    @apply w-[600px] font-semibold truncate;
  }
  .title-reminder {
    @apply font-semibold opacity-0 absolute top-0 pointer-events-none;
  }
  &:hover {
    .title {
      @apply opacity-0;
    }
    .title-reminder {
      @apply opacity-100;
    }
  }
}
</style>
