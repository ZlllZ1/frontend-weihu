<template>
  <div class="pb-6">
    <div id="editor"></div>
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
import { onMounted, computed, onUnmounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { publishCircle, uploadCircleImg } from '@/api/circle'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const store = useStore()
const { t } = useI18n()
const $toast = useToast()

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
        if (!quill) console.log('quill is null')
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

const publish = async () => {
  const { delta, html } = getContent()
  if (!html.replace(/<[^>]*>/g, '').trim()) {
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
          image: imageHandler
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
