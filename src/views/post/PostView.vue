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
              <span class="text-[14px]">{{ postInfo?.lookNum }}</span>
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
          <div class="mt-6 pb-[80px]">
            <span v-html="postInfo?.content"></span>
          </div>
        </div>
        <div
          class="p-4 overflow-hidden w-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm min-h-64"
        >
          <div class="border border-[#EBECED] w-full h-full rounded-sm">
            <div class="border-b border-[#EBECED] p-4">
              <span class="text-lg"
                >{{ postInfo?.commentNum }}
                {{ $t('message.tiaoComment') }}</span
              >
            </div>
            <template v-if="commentList?.length">
              <template v-for="comment in commentList" :key="comment?._id">
                <div
                  class="flex flex-col gap-2 items-center border-b border-[#EBECED] px-3 py-2"
                >
                  <div class="flex items-center gap-2 w-full">
                    <a
                      :href="`/userInfo/${comment?.user?.email}`"
                      target="_blank"
                      ><img
                        :src="comment?.user?.avatar"
                        alt="avatar"
                        class="rounded-full w-10 h-10"
                    /></a>
                    <div class="flex flex-col gap-y-1 w-full">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="truncate max-w-64">
                            <a
                              :href="`/userInfo/${comment?.user?.email}`"
                              target="_blank"
                            >
                              {{ comment?.user?.nickname }}</a
                            >
                          </div>
                          <span
                            v-if="comment?.user?.own"
                            class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg"
                            >{{ $t('message.owner') }}</span
                          >
                          <img
                            v-if="comment?.user?.email === storeUser?.email"
                            src="../home/images/self.svg"
                            alt="self"
                            class="rounded-full w-4 h-4"
                          />
                        </div>
                        <div
                          class="flex items-center gap-1 group cursor-pointer"
                          @click="
                            praiseComment(comment?._id, comment?.isPraise)
                          "
                        >
                          <img
                            class="w-5 h-5 group-hover:text-black"
                            :src="
                              comment?.isPraise
                                ? require('../home/images/hasPraise.svg')
                                : require('../home/images/praise.svg')
                            "
                            alt="praise"
                          />
                          <span
                            class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                            :class="{ 'text-[#FE4144]': comment?.isPraise }"
                          >
                            {{
                              comment?.praiseNum > 1000
                                ? '999+'
                                : comment?.praiseNum
                            }}</span
                          >
                        </div>
                      </div>
                      <div>
                        <span>{{ comment?.content }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray text-xs">{{
                          convertToCST(comment?.commentDate)
                        }}</span>
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
                  <div
                    v-if="comment?.replies?.length"
                    class="bg-warmGray-100 w-full rounded-lg py-1 px-2 text-sm"
                  >
                    <template
                      v-for="reply in comment?.replies.slice(0, 3)"
                      :key="reply?._id"
                    >
                      <div
                        class="flex items-center border-b border-warmGray-400 flex-col gap-1 py-1"
                      >
                        <div class="flex items-center gap-2 w-full">
                          <div class="flex items-center">
                            <a
                              :href="`/userInfo/${reply?.email}`"
                              target="_blank"
                              ><img
                                :src="reply?.user?.avatar"
                                alt="avatar"
                                class="rounded-full w-8 h-8"
                            /></a>
                          </div>
                          <div class="flex flex-col gap-1 w-full">
                            <div class="flex items-center justify-between">
                              <div class="flex items-center gap-2">
                                <div class="truncate max-w-64">
                                  <a
                                    :href="`/userInfo/${reply?.user?.email}`"
                                    target="_blank"
                                  >
                                    {{ reply?.user?.nickname }}</a
                                  >
                                </div>
                                &gt;
                                <div class="truncate max-w-64">
                                  <a
                                    :href="`/userInfo/${reply?.parentUser?.email}`"
                                    target="_blank"
                                  >
                                    {{ reply?.parentUser?.nickname }}</a
                                  >
                                </div>
                                <span
                                  v-if="reply?.user?.own"
                                  class="bg-red-100 text-red-600 text-xs px-1 py-[2px] rounded-lg"
                                  >{{ $t('message.owner') }}</span
                                >
                                <img
                                  v-if="reply?.user?.email === storeUser?.email"
                                  src="../home/images/self.svg"
                                  alt="self"
                                  class="rounded-full w-3 h-3"
                                />
                              </div>
                              <div
                                class="flex items-center gap-1 group cursor-pointer"
                                @click="
                                  praiseComment(
                                    reply?._id,
                                    reply?.isPraise,
                                    comment?._id
                                  )
                                "
                              >
                                <img
                                  class="w-5 h-5 group-hover:text-black"
                                  :src="
                                    reply?.isPraise
                                      ? require('../home/images/hasPraise.svg')
                                      : require('../home/images/praise.svg')
                                  "
                                  alt="praise"
                                />
                                <span
                                  class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                                  :class="{ 'text-[#FE4144]': reply?.isPraise }"
                                >
                                  {{
                                    reply?.praiseNum > 1000
                                      ? '999+'
                                      : reply?.praiseNum
                                  }}</span
                                >
                              </div>
                            </div>
                            <span>{{ reply.content }}</span>
                            <div
                              class="flex items-center justify-between"
                            ></div>
                          </div>
                        </div>
                        <div
                          class="flex items-center justify-between w-full pl-8 pr-4"
                        >
                          <span class="text-gray text-xs">{{
                            convertToCST(reply?.commentDate)
                          }}</span>
                          <button
                            class="text-gray hover:text-blue"
                            @click="
                              replyComment(
                                reply?._id,
                                reply?.user.email,
                                reply?.user.nickname
                              )
                            "
                          >
                            {{ $t('message.reply') }}
                          </button>
                        </div>
                      </div>
                    </template>
                    <div
                      class="flex items-center justify-end w-full pt-2 pb-1 text-sm text-gray hover:text-black"
                    >
                      <button
                        v-if="comment?.replies.length > 3"
                        @click="lookMore(comment, comment?.replies)"
                      >
                        {{ $t('message.viewMore') }} &gt;&gt;
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <div
              v-else
              class="flex items-center justify-center text-gray text-xl h-[65%]"
            >
              {{ $t('message.noComments') }}
            </div>
          </div>
        </div>
        <div
          class="fixed flex items-center justify-between py-1 px-2 bottom-0 h-16 bg-white w-[53.2%] shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-sm z-10"
        >
          <div class="nav-item inline-flex items-center justify-between gap-4">
            <div class="flex items-center">
              <img
                :src="storeUser?.avatar"
                alt="avatar"
                class="w-8 h-8 rounded-full mr-1"
              />
              <textarea
                ref="commentRef"
                v-model="commentText"
                type="text"
                :placeholder="commentPlaceHolder"
                class="w-[300px] outline-none rounded-xl overflow-hidden scroll-auto px-2 pt-2 resize-none text-sm"
                maxlength="100"
              ></textarea>
              <button
                class="h-8 w-20 p-1 ml-1 rounded-2xl text-white bg-blue hover:bg-[#0E66E7]"
                @click="handleComment"
              >
                {{ $t('message.comment') }}
              </button>
            </div>
            <div
              class="flex items-center gap-1 group cursor-pointer"
              @click="handlePraise(postInfo?.postId)"
            >
              <img
                class="w-5 h-5 group-hover:text-black"
                :src="
                  postInfo?.isPraise
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
                  postInfo?.isCollect
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
              class="flex items-center justify-center h-8 py-2 px-2 w-[72px] text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="$router.back()"
            >
              {{ $t('message.back') }}
            </button>
            <button
              class="flex items-center justify-center w-[72px] h-8 py-1 px-2 text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="goTop"
            >
              {{ $t('message.toTop') }}
            </button>
            <button
              class="flex items-center justify-center w-[88px] h-8 py-1 px-2 text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
              @click="toCommentPost"
            >
              {{ $t('message.toCommentPost') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template v-if="moreOriginComment && moreComments.length">
    <div
      class="fixed flex items-center justify-center bg-black bg-opacity-30 z-1 inset-0"
      @mousedown.self="closeMoreComment"
    >
      <div
        class="overflow-hidden w-[60%] h-[78%] bg-warmGray-200 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] rounded-md overflow-y-auto"
      >
        <div class="flex items-center flex-col p-4 gap-4 bg-white">
          <div class="w-full pb-2 flex items-center justify-between">
            <p>
              {{ $t('message.commentReply') }}
            </p>
            <button
              class="text-gray hover:text-black"
              @click="closeMoreComment"
            >
              X
            </button>
          </div>
          <div class="flex items-center gap-2 w-full">
            <a
              :href="`/userInfo/${moreOriginComment?.user?.email}`"
              target="_blank"
              ><img
                :src="moreOriginComment?.user?.avatar"
                alt="avatar"
                class="rounded-full w-10 h-10"
            /></a>
            <div class="flex flex-col gap-y-1 w-full">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="truncate max-w-64">
                    <a
                      :href="`/userInfo/${moreOriginComment?.user?.email}`"
                      target="_blank"
                    >
                      {{ moreOriginComment?.user?.nickname }}</a
                    >
                  </div>
                  <span
                    v-if="moreOriginComment?.user?.own"
                    class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg"
                    >{{ $t('message.owner') }}</span
                  >
                  <img
                    v-if="moreOriginComment?.user?.email === storeUser?.email"
                    src="../home/images/self.svg"
                    alt="self"
                    class="rounded-full w-4 h-4"
                  />
                </div>
                <div
                  class="flex items-center gap-1 group cursor-pointer"
                  @click="
                    praiseComment(
                      moreOriginComment?._id,
                      moreOriginComment?.isPraise
                    )
                  "
                >
                  <img
                    class="w-5 h-5 group-hover:text-black"
                    :src="
                      moreOriginComment?.isPraise
                        ? require('../home/images/hasPraise.svg')
                        : require('../home/images/praise.svg')
                    "
                    alt="praise"
                  />
                  <span
                    class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                    :class="{ 'text-[#FE4144]': moreOriginComment?.isPraise }"
                  >
                    {{
                      moreOriginComment?.praiseNum > 1000
                        ? '999+'
                        : moreOriginComment?.praiseNum
                    }}</span
                  >
                </div>
              </div>
              <div>
                <span>{{ moreOriginComment?.content }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray text-xs">{{
                  convertToCST(moreOriginComment?.commentDate)
                }}</span>
                <button
                  class="text-gray hover:text-blue"
                  @click="
                    replyComment(
                      moreOriginComment?._id,
                      moreOriginComment?.user.email,
                      moreOriginComment?.user.nickname
                    )
                  "
                >
                  {{ $t('message.reply') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full bg-white mt-4">
          <template v-for="reply in moreComments" :key="reply?._id">
            <div
              class="flex items-center border-b border-warmGray-400 px-4 flex-col gap-1 py-1"
            >
              <div class="flex items-center gap-2 w-full">
                <div class="flex items-center">
                  <a :href="`/userInfo/${reply?.email}`" target="_blank"
                    ><img
                      :src="reply?.user?.avatar"
                      alt="avatar"
                      class="rounded-full w-8 h-8"
                  /></a>
                </div>
                <div class="flex flex-col gap-1 w-full">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="truncate max-w-64">
                        <a
                          :href="`/userInfo/${reply?.user?.email}`"
                          target="_blank"
                        >
                          {{ reply?.user?.nickname }}</a
                        >
                      </div>
                      &gt;
                      <div class="truncate max-w-64">
                        <a
                          :href="`/userInfo/${reply?.parentUser?.email}`"
                          target="_blank"
                        >
                          {{ reply?.parentUser?.nickname }}</a
                        >
                      </div>
                      <span
                        v-if="reply?.user?.own"
                        class="bg-red-100 text-red-600 text-xs px-1 rounded-lg"
                        >{{ $t('message.owner') }}</span
                      >
                      <img
                        v-if="reply?.user?.email === storeUser?.email"
                        src="../home/images/self.svg"
                        alt="self"
                        class="rounded-full w-4 h-4"
                      />
                    </div>
                    <div
                      class="flex items-center gap-1 group cursor-pointer"
                      @click="
                        praiseComment(reply?._id, reply?.isPraise, comment?._id)
                      "
                    >
                      <img
                        class="w-5 h-5 group-hover:text-black"
                        :src="
                          reply?.isPraise
                            ? require('../home/images/hasPraise.svg')
                            : require('../home/images/praise.svg')
                        "
                        alt="praise"
                      />
                      <span
                        class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                        :class="{ 'text-[#FE4144]': reply?.isPraise }"
                      >
                        {{
                          reply?.praiseNum > 1000 ? '999+' : reply?.praiseNum
                        }}</span
                      >
                    </div>
                  </div>
                  <span>{{ reply.content }}</span>
                  <div class="flex items-center justify-between"></div>
                </div>
              </div>
              <div class="flex items-center justify-between w-full pl-8 pr-4">
                <span class="text-gray text-xs">{{
                  convertToCST(reply?.commentDate)
                }}</span>
                <button
                  class="text-gray hover:text-blue"
                  @click="
                    replyComment(
                      reply?._id,
                      reply?.user.email,
                      reply?.user.nickname
                    )
                  "
                >
                  {{ $t('message.reply') }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { useStore } from 'vuex'
import { followUser } from '@/api/user'
import {
  getPostInfo,
  praisePost,
  collectPost,
  updateShareNum,
  commentPost,
  getComments,
  praiseComments
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
const parentId = ref(null)
const parentEmail = ref(null)
const limit = ref(10)
const currentPage = ref(1)
const noMore = ref(false)
const isInitialLoad = ref(false)
const commentList = ref([])
const commentRef = ref(null)
const commentPlaceHolder = ref(t('message.commentText'))
const moreOriginComment = ref(null)
const moreComments = ref([])

const toCommentPost = () => {
  commentPlaceHolder.value = t('message.commentText')
  commentText.value = ''
  parentId.value = null
  parentEmail.value = null
  commentRef.value.focus()
}

watch(moreOriginComment, newValue => {
  if (newValue) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = 'auto'
})

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

const goTop = () =>
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })

const lookMore = async (originComment, comments) => {
  moreOriginComment.value = originComment
  moreComments.value = comments
}

const replyComment = async (commentId, email, nickname) => {
  parentId.value = commentId
  parentEmail.value = email
  commentText.value = ''
  commentPlaceHolder.value = `${t('message.reply')} ${nickname} :`
  commentRef.value.focus()
}

const handleComment = async () => {
  try {
    const res = await commentPost(
      storeUser.value.email,
      postInfo.value.postId,
      commentText.value,
      parentId.value,
      parentEmail.value,
      userInfo.value.email
    )
    if (res.data.code !== 200) return
    commentList.value = res.data.data.comments
    if (moreOriginComment.value) {
      commentList.value = commentList.value.map(comment => {
        if (comment._id === moreOriginComment.value._id) {
          moreComments.value = comment.replies
        }
        return comment
      })
    }
    commentText.value = ''
    postInfo.value.commentNum++
    parentId.value = null
    parentEmail.value = null
    $toast.success(t('message.commentSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.commentFail'))
  }
}

const closeMoreComment = () => {
  moreOriginComment.value = null
  moreComments.value = []
}

const praiseComment = async (commentId, isPraise, parentId) => {
  try {
    const res = await praiseComments(storeUser.value.email, commentId)
    if (res.data.code !== 200) return
    const updateComment = comment => {
      if (comment._id === commentId) {
        comment.isPraise = !isPraise
        comment.praiseNum += isPraise ? -1 : 1
      }
      return comment
    }
    const updateReply = reply => {
      if (reply._id === commentId) {
        reply.isPraise = !isPraise
        reply.praiseNum += isPraise ? -1 : 1
      }
      return reply
    }
    if (parentId) {
      commentList.value = commentList.value.map(comment => {
        if (comment._id === parentId) {
          comment.replies = comment.replies.map(updateReply)
        }
        return comment
      })
    } else {
      commentList.value = commentList.value.map(updateComment)
    }
  } catch (error) {
    console.error(error)
  }
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

const getComment = async () => {
  try {
    const res = await getComments(
      postId,
      userInfo.value.email,
      currentPage.value,
      limit.value
    )
    if (res.data.code !== 200) return
    commentList.value = [...commentList.value, ...res.data.data.comments]
    if (res.data.data.comments.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
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
  await getComment()
}

const handleScroll = () => {
  if (!rightColumn.value) return
  const rect = rightColumn.value.getBoundingClientRect()
  isFixed.value = rect.top <= 56
}

const handleLoadMore = debounce(async () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (
    documentHeight - windowHeight - scrollTop < 100 &&
    !noMore.value &&
    !isInitialLoad.value
  ) {
    await loadMore()
  }
}, 200)

onMounted(async () => {
  window.scrollTo({
    top: 0
  })
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', handleLoadMore)
  await getInfo()
  await getComment()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.addEventListener('scroll', handleLoadMore)
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
