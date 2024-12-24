<template>
  <div
    v-if="loading"
    class="flex text-gray items-center justify-center py-4 h-full"
  >
    {{ $t('message.loading') }}
  </div>
  <template v-else-if="posts.length">
    <template v-for="post in posts" :key="post.postId">
      <div
        id="post-container"
        class="p-4 border-b border-[rgb(235,236,237)] h-[230px] overflow-hidden w-full flex justify-between flex-col"
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
              v-lazy="post.coverUrl"
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
            <router-link
              :to="{ name: 'userInfo', params: { email: post?.user?.email } }"
              ><img
                :src="
                  post.user.avatar || require('@/assets/avatar_default.png')
                "
                alt="user avatar"
                class="rounded-full w-8 h-8"
            /></router-link>
            <div class="flex items-center">
              <router-link
                :to="{ name: 'userInfo', params: { email: post?.user?.email } }"
                class="truncate w-16 text-[#8A8A8A] hover:text-black"
                >{{ post.user.nickname }}</router-link
              >
              <img
                v-if="post.user.isFollowing"
                src="../images/follow.svg"
                alt="follow"
                class="rounded-full w-4 h-4"
              />
              <img
                v-if="post.user.email === userInfo?.email"
                src="../images/self.svg"
                alt="self"
                class="rounded-full w-4 h-4"
              />
              <img
                v-if="!post?.show && post.email === userInfo?.email"
                src="@/assets/lock.svg"
                alt="lock"
                class="w-5 h-5"
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-12">
            <router-link
              :to="{ name: 'post', params: { postId: post.postId } }"
              class="flex items-center gap-1 group"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                src="../images/comment.svg"
                alt="comment"
              />
              <span class="text-[#8A8A8A] group-hover:text-blue"
                >{{ $t('message.comment') }}
                {{ post.commentNum > 1000 ? '999+' : post.commentNum }}</span
              ></router-link
            >
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="handlePraise(post.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  post.praise
                    ? require('../images/hasPraise.svg')
                    : require('../images/praise.svg')
                "
                alt="praise"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                :class="{ 'text-[#FE4144]': post.praise }"
                >{{ $t('message.like') }}
                {{ post.praiseNum > 1000 ? '999+' : post.praiseNum }}</span
              >
            </div>
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="handleCollect(post.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  post.collect
                    ? require('../images/hasCollect.svg')
                    : require('../images/collect.svg')
                "
                alt="collect"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FF8C00]"
                :class="{ 'text-[#FF8C00]': post.collect }"
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
                src="../images/share.svg"
                alt="share"
              />
              <span class="text-[#8A8A8A] group-hover:text-black">{{
                $t('message.share')
              }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="post.email === userInfo.email"
          class="flex items-center justify-end pb-2 relative"
        >
          <button @click="() => (post.active = !post.active)">...</button>
          <div
            v-if="post.active"
            class="overflow-hidden text-xs absolute w-16 flex flex-col items-center h-12 rounded-lg bg-white bottom-[20px] border border-gray p-1"
          >
            <button
              class="h-1/2 hover:bg-warmGray-200 w-full rounded-lg"
              @click="handleDelete(post.postId)"
            >
              {{ $t('message.delete') }}
            </button>
            <button
              v-if="post.show"
              class="h-1/2 hover:bg-warmGray-200 w-full rounded-lg"
              @click="handleHide(post.postId)"
            >
              {{ $t('message.hide') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </template>
  <div
    v-else
    class="flex items-center justify-center text-gray py-4 text-lg h-full"
  >
    {{ $t('message.noPosts') }}
  </div>
  <div
    v-if="noMore && posts.length"
    class="flex items-center justify-center text-gray py-4 text-lg"
  >
    {{ $t('message.noMore') }}
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import {
  getPosts,
  praisePost,
  collectPost,
  updateShareNum,
  deletePost,
  hidePost
} from '@/api/post'
import { useToast } from 'vue-toast-notification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $toast = useToast()
const store = useStore()
const posts = ref([])
const currentPage = ref(1)
const limit = ref(10)
const userInfo = computed(() => store.state.user.userInfo)
const noMore = ref(false)
const isInitialLoad = ref(true)
const loading = ref(false)

const clipIntroduction = introduction => {
  if (introduction.length > 80) return introduction.slice(0, 80) + '...'
  return introduction
}

const handleDelete = async postId => {
  try {
    const res = await deletePost(postId, userInfo.value.email)
    if (res.data.code !== 200) return
    posts.value = posts.value.filter(post => post.postId !== postId)
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const handleHide = async postId => {
  try {
    const res = await hidePost(postId, userInfo.value.email)
    if (res.data.code !== 200) return
    posts.value = posts.value.filter(post => post.postId !== postId)
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const getHomePosts = async () => {
  try {
    if (loading.value) return
    loading.value = true
    const res = await getPosts(
      userInfo.value?.email,
      currentPage.value,
      limit.value,
      'recommend'
    )
    if (res.data.code !== 200) return
    res.data.data.posts = res.data.data.posts.map(post => {
      return {
        ...post,
        active: false
      }
    })
    posts.value = [...posts.value, ...res.data.data.posts]
    if (res.data.data.posts.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
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

const handlePraise = async postId => {
  try {
    const res = await praisePost(userInfo.value.email, postId)
    if (res.data.code !== 200) return
    posts.value = posts.value.map(post => {
      if (post.postId === postId) {
        if (post.praise) post.praiseNum--
        else post.praiseNum++
        return { ...post, praise: !post.praise }
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
    const res = await collectPost(userInfo.value.email, postId)
    if (res.data.code !== 200) return
    posts.value = posts.value.map(post => {
      if (post.postId === postId) {
        if (post.collect) post.collectNum--
        else post.collectNum++
        return { ...post, collect: !post.collect }
      }
      return post
    })
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
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
  await getHomePosts()
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
    await getHomePosts()
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
