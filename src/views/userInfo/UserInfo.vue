<template>
  <div
    v-if="user"
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="bg-white w-full relative shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
      <div
        class="h-32 bg-cover bg-center relative"
        :style="{
          backgroundImage: `url(${
            user?.homeBg || require('@/assets/bg_default.png')
          })`
        }"
      ></div>
      <div class="w-full">
        <div
          class="w-40 h-40 rounded-lg absolute bottom-12 left-6 border-4 border-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] overflow-hidden"
        >
          <img
            :src="user?.avatar || require('@/assets/avatar_default.png')"
            class="rounded-sm h-full w-full"
          />
        </div>
        <div class="pl-[200px] pt-3 pb-6 h-full pr-4">
          <div
            v-if="user?.ipAddress"
            class="flex justify-between items-center w-full"
          >
            <span class="text-2xl">{{ user?.nickname }}</span>
            <span>{{ $t('message.ipAddress') }}: {{ user?.ipAddress }}</span>
          </div>
          <div class="flex justify-between mt-2">
            <div class="text-[#666] flex flex-col w-[400px] gap-2">
              <div class="flex items-center justify-between">
                <span
                  >{{ $t('message.gender') }}:
                  {{
                    user?.sex === 0
                      ? $t('message.male')
                      : user?.sex === 1
                      ? $t('message.female')
                      : $t('message.other')
                  }}</span
                >
                <span
                  >{{ $t('message.dateOfBirth') }}: {{ user?.birthDate }}</span
                >
              </div>
              <div class="flex items-center justify-between">
                <span>{{ $t('message.live') }}: {{ user?.live }}</span>
                <span>{{ user?.age }} {{ $t('message.age') }}</span>
              </div>
              <div>
                <div class="introduction-container">
                  <span class="whitespace-nowrap mr-1">
                    {{ $t('message.individualResume') }}:
                  </span>
                  <span class="introduction-box">{{
                    user?.introduction || ''
                  }}</span>
                  <div class="toolTip">{{ user?.introduction }}</div>
                </div>
              </div>
            </div>
            <div v-if="user?.email !== userInfo?.email">
              <button
                v-if="!user?.isFollowing"
                class="py-1 px-3 bg-red-200 rounded-xl text-sm text-red-600"
                @click="follow()"
              >
                +{{ $t('message.follow') }}
              </button>
              <button
                v-else-if="user?.isFollowing"
                class="py-1 px-3 rounded-xl bg-warmGray-300 text-sm text-warmGray-600"
                @click="follow()"
              >
                {{ $t('message.cancel') }}{{ $t('message.follow') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex gap-x-2">
      <div
        class="w-2/3 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] min-h-[100vh] pt-2 overflow-hidden rounded-sm"
      >
        <div
          class="flex text-sm text-center justify-around border-b border-[#EBECED] pt-2 pb-2"
        >
          <template v-for="(header, index) in headers" :key="index">
            <div
              class="cursor-pointer border-b-2 border-transparent w-fit pb-2 hover:border-blue hover:font-semibold"
              :class="{ '!border-blue font-semibold': header.active }"
              @click="toggleHeader(header.value)"
            >
              <span>{{ header.label }}</span>
              <span class="text-gray ml-1">{{ header.num }}</span>
            </div>
          </template>
        </div>
        <component :is="currentComponent" :email="visitEmail" />
      </div>
      <div ref="rightColumn" class="w-[328px]">
        <div
          class="bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-fit p-1 rounded-lg top-14"
          :class="{ fixed: isFixed }"
        >
          <WeatherView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, markRaw } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { getOtherUserInfo, followUser } from '@/api/user'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import { useI18n } from 'vue-i18n'
import PersonalPost from '../personalCenter/components/PersonalPost.vue'
import PersonalCircle from '../personalCenter/components/PersonalCircle.vue'
import PersonalFollow from '../personalCenter/components/PersonalFollow.vue'
import PersonalFan from '../personalCenter/components/PersonalFan.vue'
import PersonalPraise from '../personalCenter/components/PersonalPraise.vue'
import PersonalCollect from '../personalCenter/components/PersonalCollect.vue'

const { t } = useI18n()
const $toast = useToast()
const store = useStore()
const rightColumn = ref(null)
const isFixed = ref(false)
const user = ref(null)
const userInfo = computed(() => store.state.user.userInfo)
const visitEmail = window.location.pathname.split('/')[2]
const headers = ref([])
const currentComponent = computed(() => {
  return headers.value.find(header => header.active)?.component
})

const generateHeader = t => {
  let headers = []
  const headerMap = {
    postNum: '帖子',
    followNum: '关注',
    fanNum: '粉丝',
    praiseNum: '点赞',
    collectNum: '收藏',
    circleNum: '朋友圈'
  }
  const componentMap = {
    postNum: markRaw(PersonalPost),
    followNum: markRaw(PersonalFollow),
    fanNum: markRaw(PersonalFan),
    praiseNum: markRaw(PersonalPraise),
    collectNum: markRaw(PersonalCollect),
    circleNum: markRaw(PersonalCircle)
  }
  const sortMap = {
    postNum: 1,
    followNum: 2,
    fanNum: 3,
    praiseNum: 4,
    collectNum: 5,
    circleNum: 6
  }
  for (const [key, value] of Object.entries(t)) {
    if (value !== null && value !== undefined && headerMap[key]) {
      headers.push({
        label: headerMap[key],
        num: value,
        component: componentMap[key],
        active: false,
        value: key.slice(0, -3),
        sort: sortMap[key]
      })
    }
  }
  if (headers.length > 0) headers[0].active = true
  headers.sort((a, b) => a.sort - b.sort)
  return headers
}

const toggleHeader = value => {
  headers.value.forEach(header => {
    header.active = header.value === value
  })
}

const handleScroll = () => {
  if (!rightColumn.value) return
  const rect = rightColumn.value.getBoundingClientRect()
  isFixed.value = rect.top <= 56
}

const follow = async () => {
  try {
    const res = await followUser(userInfo.value.email, user.value.email)
    if (res.data.code !== 200) return
    user.value.isFollowing = !user.value.isFollowing
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const getInfo = async () => {
  const res = await getOtherUserInfo(userInfo.value.email, visitEmail)
  if (res.data.code !== 200) return
  user.value = res.data.data
  headers.value = generateHeader(res.data.data)
}

onMounted(async () => {
  await getInfo()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.introduction-container {
  @apply relative flex max-w-[500px];
  .introduction-box {
    @apply inline-block truncate max-w-full;
  }
  .toolTip {
    @apply text-wrap absolute top-6 w-full left-1/2 -translate-x-1/2 max-w-[280px] break-all h-fit py-1 px-2 bg-black bg-opacity-80 text-white text-xs rounded-sm opacity-0 invisible;
  }
  &:hover .toolTip {
    @apply opacity-100 visible;
  }
}
</style>
