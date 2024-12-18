<template>
  <div class="flex flex-wrap p-8 gap-x-6 gap-y-4">
    <div
      v-if="loading && isInitialLoad"
      class="flex items-center justify-center h-[72vh] w-full"
    >
      加载中...
    </div>
    <div
      v-else-if="circleLists.length === 0"
      class="flex items-center justify-center h-[72vh] w-full"
    >
      暂无数据
    </div>
    <template v-else>
      <div
        v-for="circle in circleLists"
        :key="circle.id"
        class="w-[48%] h-48 border border-warmGray-300 rounded-md overflow-hidden p-2 flex justify-between flex-col"
      >
        <span
          class="cursor-pointer text-xs overflow-hidden"
          @click="viewDetail(circle)"
          v-html="circle?.content"
        ></span>
        <div class="flex flex-col gap-1 border-t border-warmGray-300 pt-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <a :href="`/userInfo/${circle?.user?.email}`" target="_blank"
                ><img
                  :src="circle?.user?.avatar"
                  alt="user avatar"
                  class="rounded-full w-8 h-8"
              /></a>
              <div class="flex items-center">
                <a
                  :href="`/userInfo/${circle?.user?.email}`"
                  target="_blank"
                  class="text-gray hover:text-black truncate w-20"
                >
                  {{ circle?.user?.nickname }}
                </a>
              </div>
            </div>
            <span class="text-xs text-gray">{{
              convertToCST(circle?.publishDate)
            }}</span>
          </div>
          <div class="flex items-center justify-end gap-2 text-sm">
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="viewDetail(circle)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                src="../../home/images/comment.svg"
                alt="comment"
              />
              <span class="text-[#8A8A8A] group-hover:text-blue"
                >{{ $t('message.comment') }}
                {{
                  circle?.commentNum > 1000 ? '999+' : circle?.commentNum
                }}</span
              >
            </div>
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="handlePraise(circle?.circleId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  circle?.isPraise
                    ? require('../../home/images/hasPraise.svg')
                    : require('../../home/images/praise.svg')
                "
                alt="praise"
              />
              <span
                class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                :class="{ 'text-[#FE4144]': circle?.isPraise }"
                >{{ $t('message.like') }}
                {{
                  circle?.praiseNum > 1000 ? '999+' : circle?.praiseNum
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div
    v-if="noMore && circleLists.length && !isInitialLoad"
    class="flex items-center justify-center border-t border-[#EBECED] p-4 w-full text-lg text-gray"
  >
    没有更多朋友圈了
  </div>
  <div
    v-if="circleInfo"
    class="fixed flex items-center justify-center flex-col bg-black bg-opacity-30 z-10 inset-0"
    @mousedown.self="closeCircleInfo"
  >
    <div
      class="mt-16 overflow-hidden w-[60%] h-[78%] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-md overflow-y-auto"
    >
      <div
        v-if="circleInfo"
        class="min-h-[280px] px-4 shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
      >
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center gap-4">
            <a :href="`/userInfo/${circleInfo?.user?.email}`" target="_blank">
              <img
                :src="circleInfo?.user?.avatar"
                alt="user avatar"
                class="rounded-full w-12 h-12"
              />
            </a>
            <div class="flex flex-col gap-1">
              <a
                :href="`/userInfo/${circleInfo?.user?.email}`"
                target="_blank"
                class="text-gray hover:text-black truncate w-64"
              >
                {{ circleInfo?.user?.nickname }}
              </a>
              <span class="text-xs text-gray">{{
                convertToCST(circleInfo?.publishDate)
              }}</span>
            </div>
          </div>
          <button class="text-gray hover:text-black" @click="closeCircleInfo">
            X
          </button>
        </div>
        <div class="py-2 border-t border-b border-[#EBECED]">
          <span v-html="circleInfo?.content"></span>
        </div>
        <div class="flex items-center justify-end pt-2 pb-6">
          <div
            class="flex items-center justify-end gap-1 group cursor-pointer"
            @click="handlePraise(circleInfo?.circleId)"
          >
            <img
              class="w-5 h-5 group-hover:text-black"
              :src="
                circleInfo?.isPraise
                  ? require('../../home/images/hasPraise.svg')
                  : require('../../home/images/praise.svg')
              "
              alt="praise"
            />
            <span
              class="text-[#8A8A8A] group-hover:text-[#FE4144]"
              :class="{ 'text-[#FE4144]': circleInfo?.isPraise }"
              >{{ $t('message.like') }}
              {{
                circleInfo?.praiseNum > 1000 ? '999+' : circleInfo?.praiseNum
              }}</span
            >
          </div>
        </div>
        <div
          v-if="praiseUsers?.length"
          class="px-5 pb-6 flex flex-wrap items-center justify-center w-full gap-1"
        >
          <template v-for="user in praiseUsers" :key="user?.email">
            <a :href="`/userInfo/${user?.email}`" target="_blank">
              <img
                :src="user?.avatar"
                alt="user avatar"
                class="w-10 h-10 rounded-full"
              />
            </a>
          </template>
        </div>
        <div>
          <template v-if="commentLists?.length">
            <div class="border border-[#EBECED] rounded-xs px-2 py-1">
              <template v-for="comment in commentLists" :key="comment?._id">
                <div
                  class="flex items-center p-[2px] justify-between"
                  :class="{
                    'border-b border-[#EBECED]':
                      comment !== commentLists[commentLists?.length - 1]
                  }"
                >
                  <div class="flex flex-col gap-[2px] ml-2 flex-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <a
                          :href="`/userInfo/${comment?.user?.email}`"
                          target="_blank"
                          class="text-gray hover:text-black truncate w-48 text-sm"
                        >
                          {{ comment?.user?.nickname }}
                        </a>
                        <template v-if="comment?.parentEmail">
                          <span class="mx-1"> &gt; </span>
                          <a
                            :href="`/userInfo/${comment?.parentEmail}`"
                            target="_blank"
                            class="text-gray hover:text-black truncate w-48 text-sm"
                          >
                            {{ comment?.parentUser?.nickname }}
                          </a>
                        </template>
                      </div>
                      <span class="text-xs text-gray">{{
                        convertToCST(comment?.publishDate)
                      }}</span>
                    </div>
                    <div
                      class="w-[242px] flex flex-wrap break-all"
                      v-html="comment?.content"
                    ></div>
                    <div class="flex items-center justify-end">
                      <button
                        class="text-gray hover:text-blue"
                        @click="
                          replyComment(
                            comment?._id,
                            comment?.user.email,
                            comment?.user.nickname
                          )
                        "
                      >
                        {{ $t('message.reply') }}
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <div
            v-else
            class="border-t border-[#EBECED] min-h-24 flex items-center justify-center"
          >
            {{ $t('message.noComments') }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-white mt-2 w-[60%] h-16 rounded-sm flex items-center px-4 justify-between"
    >
      <img
        :src="userInfo?.avatar"
        alt="user avatar"
        class="rounded-full w-10 h-10 mr-4"
      />
      <textarea
        ref="commentRef"
        v-model="commentText"
        type="text"
        :placeholder="commentPlaceHolder"
        class="w-[600px] outline-none h-10 rounded-xl overflow-hidden scroll-auto px-2 pt-1 resize-none text-sm"
        maxlength="100"
      ></textarea>
      <button
        class="h-8 w-24 rounded-2xl text-white bg-blue hover:bg-[#0E66E7]"
        @click="commentCircle"
      >
        {{ $t('message.comment') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  getMyCircles,
  praiseCircle,
  getPraiseUsers,
  getCircleComments,
  handleComment
} from '@/api/circle'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'

const props = defineProps({
  type: {
    type: String,
    default: 'after'
  },
  email: {
    type: String,
    default: ''
  }
})

const $toast = useToast()
const { t } = useI18n()
const store = useStore()
const circleLists = ref([])
const currentPage = ref(1)
const limit = ref(10)
const noMore = ref(false)
const isInitialLoad = ref(true)
const loading = ref(false)
const userInfo = computed(() => store.state.user.userInfo)
const circleInfo = ref(null)
const commentText = ref('')
const commentPlaceHolder = ref(t('message.commentText'))
const parentId = ref(null)
const parentEmail = ref(null)
const commentRef = ref(null)
const commentLists = ref([])
const parentNickname = ref('')
const praiseUsers = ref([])

watch(circleInfo, newValue => {
  if (newValue) getCommentLists()
})

const getPraiseUser = async circle => {
  try {
    const res = await getPraiseUsers(
      userInfo.value.email,
      circle.user.email,
      circle.circleId
    )
    if (res.data.code !== 200) return
    praiseUsers.value = res.data.data.praiseUsers
  } catch (error) {
    console.error(error)
  }
}

watch(circleInfo, newValue => {
  if (newValue) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = 'auto'
})

const replyComment = (commentId, email, nickname) => {
  parentId.value = commentId
  parentEmail.value = email
  parentNickname.value = nickname
  commentText.value = ''
  commentPlaceHolder.value = `${t('message.reply')} ${nickname} :`
  commentRef.value.focus()
}

const getCommentLists = async () => {
  try {
    if (loading.value) return
    loading.value = true
    const res = await getCircleComments(
      userInfo.value.email,
      circleInfo.value.user.email,
      circleInfo.value.circleId
    )
    if (res.data.code !== 200) return
    commentLists.value = res.data.data.comments
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const commentCircle = async () => {
  if (!commentText.value) return
  try {
    const res = await handleComment(
      userInfo.value.email,
      circleInfo.value.circleId,
      commentText.value,
      parentId.value,
      parentEmail.value,
      circleInfo.value.user.email
    )
    if (res.data.code !== 200) return
    circleLists.value = circleLists.value.map(circle => {
      if (circle.circleId === circleInfo.value.circleId) circle.commentNum += 1
      return circle
    })
    const newComment = {
      _id: res.data.data.commentId,
      circleId: circleInfo.value.circleId,
      content: commentText.value,
      parentId: parentId.value,
      parentEmail: parentEmail.value,
      publishDate: new Date().toISOString(),
      user: {
        email: userInfo.value.email,
        nickname: userInfo.value.nickname,
        own: userInfo.value.email === circleInfo.value.user.email
      },
      parentUser: {
        email: parentEmail.value,
        nickname: parentNickname.value,
        own: parentEmail.value === circleInfo.value.user.email
      }
    }
    if (!parentId.value) commentLists.value.push(newComment)
    else {
      const parentIndex = commentLists.value.findIndex(
        c => c._id === parentId.value
      )
      if (parentIndex !== -1)
        commentLists.value.splice(parentIndex + 1, 0, newComment)
    }
    commentText.value = ''
    parentId.value = null
    parentEmail.value = null
    commentPlaceHolder.value = t('message.commentText')
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const getCircles = async () => {
  try {
    if (loading.value) return
    loading.value = true
    const email = props.email || userInfo.value?.email
    const res = await getMyCircles(
      email,
      userInfo.value?.email,
      props.type,
      currentPage.value,
      limit.value
    )
    if (res.data.code !== 200) return
    circleLists.value = [...circleLists.value, ...res.data.data.circles]
    if (res.data.data.circles.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handlePraise = async circleId => {
  try {
    const res = await praiseCircle(userInfo.value.email, circleId)
    if (res.data.code !== 200) return
    circleLists.value = circleLists.value.map(circle => {
      if (circle.circleId === circleId) {
        if (circle.isPraise) {
          circle.praiseNum--
          praiseUsers.value = praiseUsers.value.filter(
            i => i.email !== userInfo.value.email
          )
        } else {
          circle.praiseNum++
          praiseUsers.value.unshift({
            email: userInfo.value.email,
            avatar: userInfo.value.avatar
          })
        }
        circle.isPraise = !circle.isPraise
      }
      return circle
    })
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const viewDetail = circle => {
  circleInfo.value = circle
  getPraiseUser(circle)
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
  await getCircles()
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
    circleLists.value.length > 0
  ) {
    await loadMore()
  }
}, 200)

const closeCircleInfo = () => {
  circleInfo.value = null
  praiseUsers.value = []
  commentLists.value = []
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  if (isInitialLoad.value) {
    await getCircles()
    isInitialLoad.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(
  () => props.type,
  () => {
    circleLists.value = []
    currentPage.value = 1
    noMore.value = false
    isInitialLoad.value = true
    getCircles()
  }
)

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
</script>

<style lang="scss" scoped>
textarea {
  @apply bg-[#F8F8FA] border border-[#F8F8FA] transition-all duration-300 ease-in-out;
  &:focus {
    @apply border-[#8A96A9] bg-white outline-transparent outline-0;
  }
}
</style>
