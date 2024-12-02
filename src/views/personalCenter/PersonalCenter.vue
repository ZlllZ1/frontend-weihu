<template>
  <div
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] rounded-sm"
  >
    <div class="bg-white w-full relative shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
      <div
        class="h-32 bg-cover bg-center relative cursor-pointer"
        :style="{
          backgroundImage: `url(${
            store.state.user.userInfo.homeBg ||
            require('@/assets/bg_default.png')
          })`
        }"
        @click="bgFileInput.click()"
      >
        <input
          ref="bgFileInput"
          type="file"
          class="hidden"
          @change="handleBgChange"
        />
        <span
          class="border border-white border-opacity-80 absolute top-4 right-4 text-white bg-black bg-opacity-20 text-opacity-80 px-2 py-1 text-sm rounded"
        >
          上传主页背景图
        </span>
      </div>
      <div class="h-32 w-full">
        <div
          class="w-40 h-40 rounded-lg absolute bottom-6 left-6 border-4 border-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] overflow-hidden group cursor-pointer"
          @click="avatarFileInput.click()"
        >
          <img
            :src="
              store.state.user.userInfo.avatar ||
              require('@/assets/avatar_default.png')
            "
            class="rounded-sm"
            alt="个人头像"
          />
          <input
            ref="avatarFileInput"
            type="file"
            class="hidden"
            @change="handleAvatarChange"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
        <div class="pl-[200px] py-3 h-full pr-4">
          <div class="flex justify-between items-center w-full">
            <span class="text-2xl">{{
              store.state.user.userInfo.nickname
            }}</span>
          </div>
          <div class="flex justify-between mt-8">
            <div>基本资料</div>
            <a
              href="/personalCenter/edit"
              class="w-[120px] h-8 px-4 rounded flex items-center justify-center text-sm py-px border border-blue text-blue hover:text-white hover:bg-blue"
            >
              编辑个人资料
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex gap-x-2">
      <div
        class="w-2/3 bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] min-h-[100vh] pt-2"
      >
        <div
          class="flex text-sm text-center justify-around border-b border-[#EBECED] pt-2 pb-2"
        >
          <template v-for="(header, index) in personalHeaders" :key="index">
            <div
              class="cursor-pointer border-b-2 border-transparent w-fit pb-2 hover:border-blue hover:font-semibold"
              :class="{ '!border-blue font-semibold': header.active }"
              @click="togglePersonalHeader(header.value)"
            >
              <span>{{ header.label }}</span>
              <span class="text-gray ml-1">{{ header.num }}</span>
            </div>
          </template>
        </div>
        <component :is="currentComponent" class="px-4 py-2" />
      </div>
      <div class="w-1/3 bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] h-fit">
        右侧区域
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import { useStore } from 'vuex'
import PersonalPost from './components/PersonalPost.vue'
import PersonalQuestion from './components/PersonalQuestion.vue'
import PersonalCircle from './components/PersonalCircle.vue'
import PersonalFollow from './components/PersonalFollow.vue'
import PersonalFan from './components/PersonalFan.vue'
import PersonalPraise from './components/PersonalPraise.vue'
import PersonalCollect from './components/PersonalCollect.vue'
import PersonalShare from './components/PersonalShare.vue'

const personalHeaders = ref([
  {
    label: '发帖',
    value: 'post',
    num: 0,
    active: true,
    component: markRaw(PersonalPost)
  },
  {
    label: '提问',
    value: 'question',
    num: 0,
    active: false,
    component: markRaw(PersonalQuestion)
  },
  {
    label: '朋友圈',
    value: 'circle',
    num: 0,
    active: false,
    component: markRaw(PersonalCircle)
  },
  {
    label: '关注',
    value: 'follow',
    num: 0,
    active: false,
    component: markRaw(PersonalFollow)
  },
  {
    label: '粉丝',
    value: 'fan',
    num: 0,
    active: false,
    component: markRaw(PersonalFan)
  },
  {
    label: '点赞',
    value: 'praise',
    num: 0,
    active: false,
    component: markRaw(PersonalPraise)
  },
  {
    label: '收藏',
    value: 'collect',
    num: 0,
    active: false,
    component: markRaw(PersonalCollect)
  },
  {
    label: '转发',
    value: 'share',
    num: 0,
    active: false,
    component: markRaw(PersonalShare)
  }
])

const store = useStore()
const bgFileInput = ref(null)
const avatarFileInput = ref(null)
const currentComponent = computed(() => {
  return personalHeaders.value.find(header => header.active)?.component
})

const handleBgChange = event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
  }
}

const handleAvatarChange = event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
  }
}

const togglePersonalHeader = value => {
  personalHeaders.value.forEach(header => {
    header.active = header.value === value
  })
}
</script>
