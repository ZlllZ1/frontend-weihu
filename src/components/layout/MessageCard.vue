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
            class="hover:text-blue"
            :class="{ 'text-blue': tab.selected }"
            :aria-label="`切换到${tab.label}标签`"
            @click="changeTab(tab.value)"
          >
            {{ tab.label }}
          </button>
          <div
            v-if="index < headerTab.length - 1"
            class="h-4 self-center w-px bg-[#EBECED]"
          ></div>
        </template>
      </div>
      <div class="flex-grow overflow-y-auto">
        <component :is="currentContent"></component>
      </div>
      <div
        class="flex flex-shrink-0 items-center py-4 px-2 justify-end h-10 border-t border-[#EBECED]"
      >
        <a class="hover:text-blue cursor-pointer"> 查看所有通知</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PraiseContent from './PraiseContent.vue'
import CommentContent from './CommentContent.vue'
import FollowContent from './FollowContent.vue'
const headerTab = ref([
  { label: '点赞', value: 0, selected: true, component: PraiseContent },
  { label: '评论', value: 1, selected: false, component: CommentContent },
  { label: '关注', value: 2, selected: false, component: FollowContent }
])
const currentContent = ref(headerTab.value[0].component)
const changeTab = value => {
  headerTab.value.forEach(tab => (tab.selected = false))
  const tab = headerTab.value.find(item => item.value === value)
  tab.selected = true
  currentContent.value = tab.component
}
</script>

<style lang="scss" scoped>
.triangle {
  @apply absolute w-8 h-4 -top-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center;
  &:after {
    @apply absolute content-[''] -bottom-[2px] rotate-[45deg] h-6 w-6 -m-3 bg-white;
  }
}
</style>
