<template>
  <div
    class="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden"
  >
    <div
      class="flex items-center px-4 py-3 bg-white border-b border-warmGray-400"
    >
      <img
        :src="require('@/assets/bg_default.png')"
        alt="avatar"
        class="w-10 h-10 rounded-full border-2 border-white shadow-lg"
      />
      <span class="text-xl font-semibold text-gray-800 ml-3">Newl</span>
    </div>
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4"
    >
      <div
        v-for="(message, index) in messages"
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
    <div class="w-full h-[24vh] bg-white border-t border-warmGray-400 p-4">
      <textarea
        class="w-full h-full p-3 rounded-lg border border-warmGray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
        :placeholder="$t('message.enterMessages')"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick } from 'vue'

const messageContainer = ref(null)
const messages = ref([
  '你好！',
  '最近怎么样？',
  '我很好，谢谢关心。',
  '你呢？',
  '我也不错，最近在学习新技术。',
  '那太棒了！加油！',
  '谢谢鼓励！'
])

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

onMounted(scrollToBottom)
onUpdated(scrollToBottom)
</script>

<style lang="scss" scoped>
.flex-1 {
  flex: 1 1 0%;
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
