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
import { onMounted, ref, computed } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { useStore } from 'vuex'
import { publishCircle } from '@/api/circle'

const store = useStore()
const { t } = useI18n()
const $toast = useToast()

const quill = ref(null)
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
  const delta = quill.value.getContents()
  const html = quill.value.root.innerHTML
  return { delta, html }
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
    $toast.success(t('message.publishSuccess'))
    setTimeout(() => {
      location.reload()
    }, 500)
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
