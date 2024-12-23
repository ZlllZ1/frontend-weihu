<template>
  <div class="pb-6">
    <div class="p-4 text-[#999] rounded">
      <textarea
        :value="title"
        :placeholder="$t('message.enterTitle')"
        class="w-full outline-none scroll-auto p-2 resize-none text-2xl"
        maxlength="200"
        @input="updateTitle($event.target.value)"
      ></textarea>
      <div class="flex justify-end items-center">
        <span class="text-sm">{{ title.length }}/200</span>
      </div>
    </div>
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
    <div class="px-4 pb-24">
      <div class="text-lg">{{ $t('message.articleSetting') }}</div>
      <div class="mt-6">
        <span>{{ $t('message.uploadCover') }}</span>
        <div
          class="ml-24 mt-2 flex items-center justify-center mb-2 w-[150px] h-[100px] border border-dashed border-gray cursor-pointer rounded"
          :style="{
            backgroundImage: coverUrl ? `url('${coverUrl}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
          @click="coverRef.click()"
        >
          <span v-if="!coverUrl" class="text-xs text-[#999]"
            >+{{ $t('message.addCover') }}</span
          >
          <input
            ref="coverRef"
            type="file"
            class="hidden"
            accept=".jpeg,.png,.jpg"
            @change="coverChange"
          />
        </div>
        <span class="text-xs ml-24 text-[#999]">{{
          $t('message.imgFormat')
        }}</span>
      </div>
      <div class="mt-6">
        <span>{{ $t('message.articleIntroduction') }}</span>
        <div
          class="ml-24 mt-2 border border-dashed border-gray rounded overflow-hidden w-[480px] h-32"
        >
          <textarea
            :value="introduction"
            :placeholder="$t('message.enterArticleIntroduction')"
            class="w-full h-[80%] outline-none scroll-auto px-2 pt-2 resize-none text-sm"
            :minlength="100"
            :maxlength="200"
            @input="updateIntroduction($event.target.value)"
          ></textarea>
          <div class="flex justify-end items-center">
            <span class="text-sm text-[#999]"
              >{{ introduction.length }}/200</span
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center gap-4 justify-between fixed bottom-0 bg-white left-0 right-0 p-4 border-t border-[#EBECED]"
    >
      <div>
        <button
          class="w-fit h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
          @click="goTop"
        >
          {{ $t('message.toTop') }}
        </button>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center">
          <div class="w-52 mr-6 h-8">
            <VueDatePicker
              v-if="isScheduled"
              v-model="scheduledDate"
              :min-date="minDate"
              :enable-time-picker="true"
              :format="'yyyy-MM-dd HH:mm'"
              :placeholder="$t('message.selectSendTime')"
              hide-input-icon
            />
          </div>
          <label
            for="schedulePost"
            class="text-sm w-fit cursor-pointer"
            :class="{ 'text-blue': isScheduled }"
            >{{ $t('message.scheduledRelease') }}</label
          >
          <input
            id="schedulePost"
            v-model="isScheduled"
            type="checkbox"
            class="hidden"
          />
        </div>
        <button
          class="w-fit h-8 py-1 px-2 border border-gray text-sm rounded bg-white text-gray hover:bg-[#EBECED]"
          @click="saveToDraft"
        >
          {{ $t('message.saveToDraft') }}
        </button>
        <button
          class="w-20 h-8 py-1 px-2 text-base rounded bg-blue text-white hover:bg-[#0E66E7]"
          @click="publish"
        >
          {{ $t('message.publish') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import {
  uploadCover,
  publishPost,
  saveDraft,
  publishSchedulePost,
  uploadPostImg
} from '@/api/post'
import { useStore } from 'vuex'
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

const store = useStore()
const { t } = useI18n()
const $toast = useToast()

const MAX_VIDEO_DURATION = 30000
const MAX_FILE_SIZE = 5 * 1024 * 1024
let quill = null
const title = ref('')
const uploadProgress = ref(0)
const coverRef = ref(null)
const isScheduled = ref(false)
const scheduledDate = ref(null)
const introduction = ref('')
const loading = ref(false)
const coverUrl = ref('')
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
      const res = await uploadPostImg(formData)
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

const minDate = computed(() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 5)
  return date
})
const updateTitle = value => (title.value = value.replace(/\s/g, ''))
const updateIntroduction = value =>
  (introduction.value = value.replace(/\s/g, ''))

const coverChange = async event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('cover', file)
    formData.append('type', 'cover')
    formData.append('account', userInfo.value.email)
    try {
      const res = await uploadCover(formData)
      if (res.data.code !== 200) return
      coverUrl.value = res.data.data.coverUrl
      $toast.success(t('message.uploadCoverSuccess'))
    } catch (error) {
      $toast.error(t('message.uploadCoverFail'))
    }
  }
}

const getContent = () => {
  const delta = quill.getContents()
  const html = quill.root.innerHTML
  return { delta, html }
}

const saveToDraft = async () => {
  const { delta, html } = getContent()
  try {
    const data = {
      email: userInfo.value.email,
      title: title.value,
      content: html,
      coverUrl: coverUrl.value,
      introduction: introduction.value,
      draftDate: Date.now(),
      delta
    }
    const res = await saveDraft(data)
    if (res.data.code !== 200) return
    $toast.success(t('message.saveDraftSuccess'))
  } catch (error) {
    $toast.error(t('message.saveDraftError'))
  }
}

const publish = async () => {
  const isHtmlEmpty = html => {
    const text = html.replace(/<[^>]*>/g, '')
    if (text.trim() !== '') return false
    return !/<(img|video)[^>]*>/i.test(html)
  }
  const { delta, html } = getContent()
  if (!title.value) {
    $toast.error(t('message.titleEmpty'))
    return
  }
  if (isHtmlEmpty(html)) {
    $toast.error(t('message.contentEmpty'))
    return
  }
  if (isScheduled.value) {
    if (!scheduledDate.value) {
      $toast.error(t('message.selectSendTimeEmpty'))
      return
    }
  }
  if (!coverUrl.value) {
    $toast.error(t('message.coverEmpty'))
    return
  }
  if (!introduction.value || introduction.value.length < 100) {
    $toast.error(t('message.introductionEmpty'))
    return
  }
  try {
    const data = {
      email: userInfo.value.email,
      title: title.value,
      content: html,
      coverUrl: coverUrl.value,
      publishDate: isScheduled.value ? scheduledDate.value : null,
      introduction: introduction.value,
      delta
    }
    let res
    if (isScheduled.value) res = await publishSchedulePost(data)
    else res = await publishPost(data)
    if (res.data.code !== 200) return
    quill.setContents([])
    title.value = ''
    coverUrl.value = ''
    introduction.value = ''
    isScheduled.value = false
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

const goTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
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
  @apply h-[300px] mb-4;
}
.ql-editor {
  @apply min-h-[200px];
}
</style>
