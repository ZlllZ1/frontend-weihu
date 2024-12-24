<template>
  <div class="flex flex-col h-full bg-white shadow-lg rounded-lg">
    <div
      class="flex items-center px-4 py-3 bg-white border-b border-warmGray-400"
    >
      <a
        v-if="chatInfo?.friend?.email"
        :href="`/userInfo/${chatInfo?.friend?.email}`"
        target="_blank"
      >
        <img
          :src="
            chatInfo?.friend?.avatar || require('@/assets/avatar_default.png')
          "
          alt="avatar"
          class="w-10 h-10 rounded-full border-2 border-white shadow-lg"
      /></a>
      <a
        v-if="chatInfo?.friend?.email"
        :href="`/userInfo/${chatInfo?.friend?.email}`"
        target="_blank"
        ><span class="text-lg ml-3">{{ chatInfo?.friend?.nickname }}</span></a
      >
      <span v-if="!chatInfo?.friend?.email" class="text-lg ml-3 py-1">{{
        $t('message.selectFriend')
      }}</span>
    </div>
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto bg-warmGray-50 p-4"
      @scroll="handleScroll"
    >
      <div
        v-if="unreadCount"
        class="sticky top-0 left-0 right-0 h-fit text-center"
      >
        <span
          class="text-blue hover:text-[#09408E] cursor-pointer"
          @click="gotoUnread"
          >{{ unreadCount }}{{ $t('message.tiaomessages') }}</span
        >
      </div>
      <div
        v-if="noMore && chatInfo.messages.length"
        class="flex items-center my-4 text-gray"
      >
        <div class="flex-1 h-px bg-[#EBECED] mr-2"></div>
        <span>{{ $t('message.noMore') }}</span>
        <div class="flex-1 h-px bg-[#EBECED] ml-2"></div>
      </div>
      <template v-for="(message, index) in chatInfo?.messages" :key="index">
        <div
          :ref="setMessageRef(index)"
          class="p-3 rounded-lg shadow-md"
          :class="
            message.senderEmail === userInfo.email
              ? 'bg-blue-100 ml-auto max-w-[50%]'
              : 'bg-white mr-auto max-w-[50%]'
          "
        >
          <span v-html="message.content"></span>
        </div>
        <div
          class="text-xs mt-1 mb-3"
          :class="
            message.senderEmail === userInfo.email
              ? 'flex items-center justify-end'
              : 'bg-blue-100'
          "
        >
          {{ convertToCST(message.timestamp) }}
        </div>
      </template>
    </div>
    <div id="editor"></div>
    <div class="flex items-center justify-end px-3 pb-4">
      <button
        class="w-20 h-8 py-1 px-2 text-base rounded bg-blue text-white hover:bg-[#0E66E7]"
        @click="sendMessage"
      >
        {{ $t('message.send') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  nextTick,
  watch,
  computed,
  onUnmounted,
  inject
} from 'vue'
import { useStore } from 'vuex'
import { getChatInfos, uploadChatImg } from '@/api/chat'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { sendMessages } from '@/api/chat'
import eventBus from '@/utils/eventBus'

const emit = defineEmits(['send', 'refresh'])
const VideoBlot = Quill.import('formats/video')
class CustomVideoBlot extends VideoBlot {
  static create(value) {
    const node = super.create(value)
    node.setAttribute('controls', 'true')
    node.setAttribute('playsinline', 'true')
    node.setAttribute('webkit-playsinline', 'true')
    return node
  }
}
CustomVideoBlot.blotName = 'custom-video'
CustomVideoBlot.tagName = 'VIDEO'

Quill.register(CustomVideoBlot)
Quill.register('modules/imageResize', ImageResize)
const MAX_VIDEO_DURATION = 3000
const MAX_FILE_SIZE = 5 * 1024 * 1024
const { t } = useI18n()
const $toast = useToast()
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const props = defineProps({
  email: {
    type: String,
    default: ''
  }
})
const chatInfo = ref({})
const chatId = ref(null)
const messageContainer = ref(null)
let quill = null
const uploadProgress = ref(0)
const loading = ref(false)
const newMessage = inject('newMessage')
const currentPage = ref(1)
const limit = 100
const noMore = ref(false)
const unreadCount = ref(0)
const messageRefs = ref([])

watch(newMessage, newValue => {
  const { data } = newValue || {}
  if (chatId.value !== data?.chatId) return
  const [email1, email2] = data.chatId.split('_')
  const friendEmail = email1 === userInfo.value.email ? email2 : email1
  const newChat = {
    chatId: chatId.value,
    content: data.message?.content,
    isRead: true,
    timestamp: data.message?.timestamp,
    senderEmail: friendEmail
  }
  chatInfo.value.messages.push(newChat)
  emit('refresh', { chatId: chatId.value, email: chatInfo.value.friend.email })
})

const getContent = () => {
  const delta = quill.getContents()
  const html = quill.root.innerHTML
  return { delta, html }
}

const firstUnreadMessageIndex = computed(() => {
  if (!chatInfo.value?.messages || chatInfo.value.messages.length === 0)
    return -1
  return Math.max(chatInfo.value.messages.length - unreadCount.value, 0)
})

const setMessageRef = index => el => {
  if (el) messageRefs.value[index] = el
}

const gotoUnread = () => {
  const index = firstUnreadMessageIndex.value
  if (index >= 0 && index < messageRefs.value.length) {
    messageRefs.value[index].scrollIntoView({
      behavior: 'smooth'
    })
    nextTick(() => {
      unreadCount.value = 0
    })
  }
}

const sendMessage = async () => {
  const isHtmlEmpty = html => {
    const text = html.replace(/<[^>]*>/g, '')
    if (text.trim() !== '') return false
    return !/<(img|video)[^>]*>/i.test(html)
  }
  const { delta, html } = getContent()
  if (isHtmlEmpty(html)) {
    $toast.error(t('message.contentEmpty'))
    return
  }
  if (!props.email) {
    $toast.error(t('message.selectFriend'))
    return
  }
  try {
    const res = await sendMessages(
      chatId.value,
      html,
      userInfo.value.email,
      props.email
    )
    if (res.data.code !== 200) return
    const message = {
      chatId: chatId.value,
      content: html,
      isRead: false,
      timestamp: new Date().toISOString(),
      senderEmail: userInfo.value.email
    }
    chatInfo.value.messages.push(message)
    const data = {
      chatId: chatId.value,
      lastMessage: {
        content: html,
        senderEmail: userInfo.value.email,
        timestamp: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    }
    emit('send', data)
    quill.setContents([])
    scrollToBottom()
  } catch (error) {
    console.error('Message send error:', error)
    $toast.error(t('message.sendFail'))
  }
}

const toolbarOptions = [['image', 'video']]
const imageHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()
  input.onchange = async () => {
    const file = input.files[0]
    if (file.size > MAX_FILE_SIZE) {
      $toast.error(t('message.imageTooLarge'))
      return
    }
    const formData = new FormData()
    formData.append('chatImg', file)
    formData.append('type', 'chatImg')
    formData.append('email', userInfo.value.email)
    try {
      const res = await uploadChatImg(formData)
      if (res.data.code !== 200) return
      if (res.data.data.chatImgUrl) {
        const length = quill.getLength()
        quill.setSelection(length, 0)
        quill.insertEmbed(
          length,
          'image',
          res.data.data.chatImgUrl,
          'user',
          range => {
            quill.setSelection(range.index + 1)
          }
        )
      }
    } catch (error) {
      console.error('Image upload error:', error)
    }
  }
}
const getVideoDuration = file => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    video.onerror = e => {
      reject(e)
    }
    video.src = URL.createObjectURL(file)
  })
}
const videoHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'video/*')
  input.click()
  input.onchange = async () => {
    const file = input.files[0]
    try {
      if (loading.value) return
      loading.value = true
      const duration = await getVideoDuration(file)
      if (duration > MAX_VIDEO_DURATION) {
        $toast.error(
          t('message.videoTooLong', { maxDuration: MAX_VIDEO_DURATION / 60 })
        )
        return
      }
      const workerUrl = new URL(
        '../../../utils/video-worker.js',
        import.meta.url
      )
      const worker = new Worker(workerUrl)
      worker.onmessage = e => {
        const { type, progress, videoUrl, message } = e.data
        if (type === 'progress') {
          uploadProgress.value = progress
          if (uploadProgress.value === 100)
            setTimeout(() => {
              uploadProgress.value = 0
            }, 3000)
        } else if (type === 'success') {
          const secureVideoUrl = videoUrl.replace('http://', 'https://')
          const length = quill.getLength()
          quill.insertEmbed(length, 'custom-video', secureVideoUrl, 'user')
          quill.setSelection(length + 1)
          worker.terminate()
        } else if (type === 'error') worker.terminate()
      }
      worker.postMessage({
        file,
        email: userInfo.value.email,
        token: localStorage.getItem('token')
      })
    } catch (error) {
      console.error('Video upload error:', error)
      $toast.error(t('message.videoUploadError'))
    } finally {
      loading.value = false
    }
  }
}

const initEditor = () => {
  const container = document.getElementById('editor')
  quill = new Quill(container, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: imageHandler,
          video: videoHandler
        }
      },
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: false
      },
      clipboard: {
        matchVisual: true
      }
    },
    placeholder: t('message.enterContent')
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const getChatInfo = async () => {
  try {
    if (!props.email) return
    chatId.value = [props.email, userInfo.value.email].sort().join('_')
    const res = await getChatInfos(
      userInfo.value.email,
      chatId.value,
      currentPage.value,
      limit
    )
    if (res.data.code !== 200) return
    if (!chatInfo.value.messages || res.data.data.messages)
      chatInfo.value.messages = []
    chatInfo.value.messages = [
      ...res.data.data.messages,
      ...chatInfo.value.messages
    ]
    chatInfo.value = {
      ...chatInfo.value,
      ...res.data.data,
      messages: chatInfo.value.messages
    }
    if (res.data.data.messages.length < limit) noMore.value = true
    if (currentPage.value === 1) scrollToBottom()
  } catch (error) {
    console.error(error)
  }
}

const loadMore = async () => {
  if (noMore.value) return
  const scrollHeight = messageContainer.value.scrollHeight
  const scrollTop = messageContainer.value.scrollTop
  currentPage.value++
  await getChatInfo()
  nextTick(() => {
    const newScrollHeight = messageContainer.value.scrollHeight
    messageContainer.value.scrollTop =
      newScrollHeight - scrollHeight + scrollTop
  })
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

const handleScroll = debounce(async () => {
  const atTop = messageContainer.value.scrollTop === 0
  if (atTop && !noMore.value) {
    await loadMore()
  }
}, 500)

watch(
  () => props.email,
  async (newEmail, oldEmail) => {
    if (newEmail === oldEmail) return
    await getChatInfo()
  },
  { immediate: true }
)

const handleKeyDown = async event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    sendMessage()
  }
}

onMounted(() => {
  initEditor()
  scrollToBottom()
  document.addEventListener('keydown', handleKeyDown)
  eventBus.on('sendUnreadCount', unread => {
    if (unread) unreadCount.value = unread
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  eventBus.off('sendUnreadCount')
  unreadCount.value = 0
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
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/^\D*/, '')
  return formattedDate
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
#editor {
  @apply h-[150px] mb-4;
}
</style>
