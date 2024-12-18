<template>
  <div
    v-if="userInfo"
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="bg-white w-full relative shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
      <div
        class="h-32 bg-cover bg-center relative cursor-pointer"
        :style="{
          backgroundImage: `url(${
            userInfo.homeBg || require('@/assets/bg_default.png')
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
          {{ $t('message.uploadHomeBg') }}
        </span>
      </div>
      <div class="w-full">
        <div
          class="w-40 h-40 rounded-lg absolute bottom-12 left-6 border-4 border-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] overflow-hidden group cursor-pointer"
          @click="avatarFileInput.click()"
        >
          <img
            :src="
              store.state.user.userInfo.avatar ||
              require('@/assets/avatar_default.png')
            "
            class="rounded-sm h-full w-full"
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
        <div class="pl-[200px] pt-3 pb-6 h-full pr-4">
          <div class="flex justify-between items-center w-full">
            <span class="text-2xl">{{ userInfo?.nickname }}</span>
            <span
              >{{ $t('message.ipAddress') }}: {{ userInfo?.ipAddress }}</span
            >
          </div>
          <div class="flex justify-between mt-2">
            <div class="text-[#666] flex flex-col w-[400px] gap-2">
              <div class="flex items-center justify-between">
                <span
                  >{{ $t('message.gender') }}:
                  {{
                    userInfo?.sex === 0
                      ? $t('message.male')
                      : userInfo?.sex === 1
                      ? $t('message.female')
                      : $t('message.other')
                  }}</span
                >
                <span
                  >{{ $t('message.dateOfBirth') }}:
                  {{ userInfo?.birthDate }}</span
                >
              </div>
              <span>{{ $t('message.live') }}: {{ userInfo?.live }}</span>
              <div>
                <div class="introduction-container">
                  <span class="whitespace-nowrap mr-1">
                    {{ $t('message.individualResume') }}:
                  </span>
                  <span class="introduction-box">{{
                    userInfo?.introduction || ''
                  }}</span>
                  <div class="toolTip">{{ userInfo?.introduction }}</div>
                </div>
              </div>
            </div>
            <div class="flex items-end justify-center">
              <a
                href="/personalCenter/edit"
                class="w-[120px] h-8 px-4 rounded flex items-center justify-center text-sm py-px border border-blue text-blue hover:text-white hover:bg-blue"
              >
                {{ $t('message.edit') }}
              </a>
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
        <component :is="currentComponent" @handleChange="handleChange" />
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
import { ref, markRaw, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import PersonalPost from './components/PersonalPost.vue'
import PersonalCircle from './components/PersonalCircle.vue'
import PersonalFollow from './components/PersonalFollow.vue'
import PersonalFan from './components/PersonalFan.vue'
import PersonalPraise from './components/PersonalPraise.vue'
import PersonalCollect from './components/PersonalCollect.vue'
import PersonalFriend from './components/PersonalFriend.vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { useI18n } from 'vue-i18n'
import { getUserInfo, uploadAvatar, uploadHomeBg } from '@/api/user'
import { useToast } from 'vue-toast-notification'

const { t } = useI18n()
const $toast = useToast()
const rightColumn = ref(null)
const isFixed = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const activeHeaderValue = ref('post')
const personalHeaders = computed(() => [
  {
    label: t('message.post'),
    value: 'post',
    num: userInfo.value.postNum > 1000 ? '999+' : userInfo.value.postNum,
    active: activeHeaderValue.value === 'post',
    component: markRaw(PersonalPost)
  },
  {
    label: t('message.circleOfFriends'),
    value: 'circle',
    num: userInfo.value.circleNum > 1000 ? '999+' : userInfo.value.circleNum,
    active: activeHeaderValue.value === 'circle',
    component: markRaw(PersonalCircle)
  },
  {
    label: t('message.follow'),
    value: 'follow',
    num: userInfo.value.followNum > 1000 ? '999+' : userInfo.value.followNum,
    active: activeHeaderValue.value === 'follow',
    component: markRaw(PersonalFollow)
  },
  {
    label: t('message.fans'),
    value: 'fan',
    num: userInfo.value.fanNum > 1000 ? '999+' : userInfo.value.fanNum,
    active: activeHeaderValue.value === 'fan',
    component: markRaw(PersonalFan)
  },
  {
    label: t('message.friend'),
    value: 'friend',
    num: userInfo.value.friendNum > 1000 ? '999+' : userInfo.value.friendNum,
    active: activeHeaderValue.value === 'friend',
    component: markRaw(PersonalFriend)
  },
  {
    label: t('message.praise'),
    value: 'praise',
    num: userInfo.value.praiseNum > 1000 ? '999+' : userInfo.value.praiseNum,
    active: activeHeaderValue.value === 'praise',
    component: markRaw(PersonalPraise)
  },
  {
    label: t('message.collect'),
    value: 'collect',
    num: userInfo.value.collectNum > 1000 ? '999+' : userInfo.value.collectNum,
    active: activeHeaderValue.value === 'collect',
    component: markRaw(PersonalCollect)
  }
])

const bgFileInput = ref(null)
const avatarFileInput = ref(null)
const currentComponent = computed(() => {
  return personalHeaders.value.find(header => header.active)?.component
})

const getInfo = async () => {
  const res = await getUserInfo(userInfo?.value.email)
  if (res.data.code !== 200) return
  store.commit('user/setUserInfo', res.data.data)
  localStorage.setItem('userInfo', JSON.stringify(res.data.data))
}

const handleChange = data => {
  const { type, num } = data
  const user = { ...userInfo.value }
  switch (type) {
    case 'praise':
      user.praiseNum += num
      break
    case 'collect':
      user.collectNum += num
      break
    case 'follow':
      user.followNum += num
      break
    case 'unFollow':
      user.followNum += num
      break
    case 'delete':
      user.postNum += num
      break
    case 'deletePraise':
      user.praiseNum += num
      break
    case 'deleteCollect':
      user.collectNum += num
      break
  }
  store.commit('user/setUserInfo', user)
  localStorage.setItem('userInfo', JSON.stringify(user))
}

const handleBgChange = async event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('homeBg', file)
    formData.append('type', 'bg')
    formData.append('account', userInfo.value.email)
    try {
      const res = await uploadHomeBg(formData)
      if (res.data.code !== 200) return
      await getInfo()
      $toast.success(t('message.uploadSuccess'))
    } catch (error) {
      $toast.error(t('message.uploadError'))
    }
  }
}

const handleAvatarChange = async event => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('type', 'avatar')
    formData.append('account', userInfo.value.email)
    try {
      const res = await uploadAvatar(formData)
      if (res.data.code !== 200) return
      await getInfo()
      $toast.success(t('message.uploadSuccess'))
    } catch (error) {
      $toast.error(t('message.uploadError'))
    }
  }
}

const togglePersonalHeader = value => (activeHeaderValue.value = value)

const handleScroll = () => {
  if (!rightColumn.value) return
  const rect = rightColumn.value.getBoundingClientRect()
  isFixed.value = rect.top <= 56
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
