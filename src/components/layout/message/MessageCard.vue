<template>
  <div class="absolute top-12 left-1/2 -translate-x-1/2">
    <span class="triangle"></span>
    <div
      class="flex flex-col relative bg-white w-[360px] h-[440px] rounded shadow-sm"
    >
      <div
        class="flex items-center justify-evenly h-12 w-full border-b border-[#EBECED] flex-shrink-0"
      >
        <template v-for="(tab, index) in headerTab" :key="index">
          <button
            class="hover:text-blue division flex-1"
            :class="{ 'text-blue': tab.selected }"
            @click="changeTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </template>
      </div>
      <div class="flex-grow overflow-y-auto">
        <component :is="currentContent"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import PraiseContent from './PraiseContent.vue'
import CommentContent from './CommentContent.vue'
import FollowContent from './FollowContent.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const headerTab = [
  {
    label: t('message.praise'),
    value: 0,
    selected: true,
    component: markRaw(PraiseContent)
  },
  {
    label: t('message.comment'),
    value: 1,
    selected: false,
    component: markRaw(CommentContent)
  },
  {
    label: t('message.follow'),
    value: 2,
    selected: false,
    component: markRaw(FollowContent)
  }
]
const currentContent = ref(headerTab[0].component)
const changeTab = value => {
  headerTab.forEach(tab => (tab.selected = false))
  const tab = headerTab.find(item => item.value === value)
  tab.selected = true
  currentContent.value = markRaw(tab.component)
}
</script>

<style lang="scss" scoped>
.triangle {
  @apply absolute w-8 h-4 -top-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center;
  &:after {
    @apply absolute content-[''] -bottom-[2px] rotate-[45deg] h-6 w-6 -m-3 bg-white;
  }
}
.division {
  @apply relative;
  &:not(:last-child) {
    &::after {
      @apply content-[''] absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-[#EBECED];
    }
  }
}
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
</style>
