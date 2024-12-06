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
            maxlength="200"
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
          @click="saveToDrafts"
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
    <span v-html="test"></span>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { uploadCover, publishPost } from '@/api/post'
import { useStore } from 'vuex'

const store = useStore()
const { t } = useI18n()
const $toast = useToast()

const quill = ref(null)
const title = ref('')
const coverRef = ref(null)
const isScheduled = ref(false)
const scheduledDate = ref(null)
const introduction = ref('')
const coverUrl = ref('')
const userInfo = computed(() => store.state.user.userInfo)

const test = ref('')

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

const minDate = computed(() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 10)
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
  const delta = quill.value.getContents()
  const html = quill.value.root.innerHTML
  return { delta, html }
}

const saveToDrafts = () => {
  console.log('存至草稿箱')
}

const publish = async () => {
  const { html } = getContent()
  if (!title.value) {
    $toast.error(t('message.titleEmpty'))
    return
  }
  if (!html.replace(/<[^>]*>/g, '').trim()) {
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
  if (!introduction.value) {
    $toast.error(t('message.introductionEmpty'))
    return
  }
  try {
    const data = {
      email: userInfo.value.email,
      title: title.value,
      content: html,
      coverUrl: coverUrl.value,
      scheduledDate: isScheduled.value ? scheduledDate.value : null,
      introduction: introduction.value
    }
    const res = await publishPost(data)
    if (res.data.code !== 200) return
    $toast.success(t('message.publishSuccess'))
    title.value = ''
    coverUrl.value = ''
    introduction.value = ''
    quill.value.setContents([])
  } catch (error) {
    $toast.error(t('message.publishError'))
  }
}

const initEditor = () => {
  const container = document.getElementById('editor')
  quill.value = new Quill(container, {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
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
