<template>
  <div
    class="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden"
  >
    <div
      class="flex items-center px-4 py-3 bg-white border-b border-warmGray-400"
    >
      <a :href="`/userInfo/${chatInfo?.friend?.email}`" target="_blank">
        <img
          :src="
            chatInfo?.friend?.avatar || require('@/assets/avatar_default.png')
          "
          alt="avatar"
          class="w-10 h-10 rounded-full border-2 border-white shadow-lg"
      /></a>
      <a :href="`/userInfo/${chatInfo?.friend?.email}`" target="_blank"
        ><span class="text-lg ml-3">{{ chatInfo?.friend?.nickname }}</span></a
      >
    </div>
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto bg-warmGray-50 p-4 space-y-4"
    >
      <div
        v-for="(message, index) in chatInfo?.messages"
        :key="index"
        class="p-3 rounded-lg shadow-md"
        :class="
          index % 2 === 0
            ? 'bg-blue-100 ml-auto max-w-[70%]'
            : 'bg-white mr-auto max-w-[70%]'
        "
      >
        {{ message }}
      </div>
    </div>
    <div id="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { getChatInfos, uploadChatImg } from '@/api/chat'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'

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
const chatInfo = ref(null)
const chatId = ref(null)
const messageContainer = ref(null)
let quill = null
const uploadProgress = ref(0)
const loading = ref(false)

const getContent = () => {
  const delta = quill.getContents()
  const html = quill.root.innerHTML
  return { delta, html }
}

const toolbarOptions = [['link', 'image', 'video']]
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
    formData.append('postImg', file)
    formData.append('type', 'postImg')
    formData.append('email', userInfo.value.email)
    try {
      const res = await uploadChatImg(formData)
      if (res.data.code !== 200) return
      if (res.data.data.postImgUrl) {
        const length = quill.getLength()
        quill.setSelection(length, 0)
        quill.insertEmbed(
          length,
          'image',
          res.data.data.postImgUrl,
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
    const res = await getChatInfos(userInfo.value.email, chatId.value)
    if (res.data.code !== 200) return
    chatInfo.value = res.data.data
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.email,
  async (newEmail, oldEmail) => {
    if (newEmail === oldEmail) return
    await getChatInfo()
  },
  { immediate: true }
)

onMounted(() => {
  initEditor()
  scrollToBottom()
})
onUpdated(scrollToBottom)
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
