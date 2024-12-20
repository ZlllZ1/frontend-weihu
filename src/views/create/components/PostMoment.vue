<template>
  <div class="pb-6">
    <div id="editor"></div>
    <div v-if="uploadProgress" class="flex gap-[10px] items-center ml-4">
      <span>{{ $t('message.videoUploadProgress') }}</span>
      <div class="w-[200px] h-5 bg-[#E0E0E0] rounded-lg overflow-hidden">
        <div
          class="h-full bg-[#1172F6] transition-all"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
      <span>{{ uploadProgress.toFixed(0) }}%</span>
    </div>
    <div
      class="flex items-center gap-4 justify-end fixed bottom-0 bg-white left-0 right-0 p-4 border-t border-[#EBECED]"
    >
      <button
        class="w-20 h-8 py-1 px-2 text-base rounded bg-blue text-white hover:bg-[#0E66E7]"
        @click="publish"
      >
        {{ $t('message.publish') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { publishCircle, uploadCircleImg } from '@/api/circle'
import ImageResize from 'quill-image-resize-module'

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

const MAX_VIDEO_DURATION = 300
const MAX_FILE_SIZE = 5 * 1024 * 1024
const store = useStore()
const { t } = useI18n()
const $toast = useToast()
const uploadProgress = ref(0)
const loading = ref(false)
let quill = null
const userInfo = computed(() => store.state.user.userInfo)

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: 1 }, { header: 2 }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
  ['link', 'image', 'video']
]

const getContent = () => {
  const delta = quill.getContents()
  const html = quill.root.innerHTML
  return { delta, html }
}

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
    formData.append('circleImg', file)
    formData.append('type', 'circleImg')
    formData.append('email', userInfo.value.email)
    try {
      const res = await uploadCircleImg(formData)
      if (res.data.code !== 200) return
      if (res.data.data.circleImgUrl) {
        const length = quill.getLength()
        quill.setSelection(length, 0)
        quill.insertEmbed(
          length,
          'image',
          res.data.data.circleImgUrl,
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

const publish = async () => {
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
  try {
    const data = {
      email: userInfo.value.email,
      content: html,
      delta
    }
    const res = await publishCircle(data)
    if (res.data.code !== 200) return
    quill.setContents([])
    $toast.success(t('message.publishSuccess'))
  } catch (error) {
    $toast.error(t('message.publishError'))
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
      imageResize: {
        displaySize: true,
        modules: ['Resize', 'DisplaySize', 'Toolbar']
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

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  quill = null
})
</script>

<style lang="scss">
@import '../styles/editor.scss';

#editor {
  @apply mb-4;
}
</style>
