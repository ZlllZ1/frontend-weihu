<template>
  <div class="mx-32 my-5 bg-white rounded-sm min-h-[100vh] flex">
    <div class="w-[15%] p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
      <div class="flex flex-col gap-y-6">
        <div
          v-for="item in nav"
          :key="item.value"
          class="flex items-center gap-x-2 cursor-pointer"
          @click="handleClick(item)"
        >
          <div class="w-full flex items-center justify-center text-base">
            <span
              class="border-b-2 border-transparent py-2 hover:!border-blue hover:font-semibold"
              :class="{ '!border-blue font-semibold': item.active }"
              >{{ item.label }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="w-[85%] px-8">
      <component :is="currentComponent" :setting="setting" />
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import HomePage from './components/HomePage.vue'
import FriendPage from './components/FriendPage.vue'
import PostPage from './components/PostPage.vue'
import AboutPage from './components/AboutPage.vue'
import ChatPage from './components/ChatPage.vue'
import { useStore } from 'vuex'

const store = useStore()
const setting = computed(() => store.state.user.userInfo.setting)

const nav = ref([
  {
    label: '主页',
    value: 'home',
    active: true,
    component: markRaw(HomePage)
  },
  {
    label: '私信',
    value: 'chat',
    active: false,
    component: markRaw(ChatPage)
  },
  {
    label: '朋友圈',
    value: 'friend',
    active: false,
    component: markRaw(FriendPage)
  },
  {
    label: '帖子',
    value: 'post',
    active: false,
    component: markRaw(PostPage)
  },
  {
    label: '关于',
    value: 'about',
    active: false,
    component: markRaw(AboutPage)
  }
])

const currentComponent = computed(
  () => nav.value.find(n => n.active)?.component
)

const handleClick = item => {
  nav.value.forEach(item => {
    item.active = false
  })
  item.active = true
}
</script>
