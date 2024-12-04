<template>
  <div class="mx-32 my-5 min-h-[100vh] flex gap-x-3">
    <div
      class="w-[15%] p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] bg-white rounded"
    >
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
    <div
      class="w-[85%] px-8 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] bg-white rounded"
    >
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
import { useI18n } from 'vue-i18n'

const store = useStore()
const setting = computed(() => store.state.user.userInfo.setting)
const { t } = useI18n()

const nav = ref([
  {
    label: t('message.homePage'),
    value: 'home',
    active: true,
    component: markRaw(HomePage)
  },
  {
    label: t('message.privateLetter'),
    value: 'chat',
    active: false,
    component: markRaw(ChatPage)
  },
  {
    label: t('message.circleOfFriends'),
    value: 'friend',
    active: false,
    component: markRaw(FriendPage)
  },
  {
    label: t('message.post'),
    value: 'post',
    active: false,
    component: markRaw(PostPage)
  },
  {
    label: t('message.about'),
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
