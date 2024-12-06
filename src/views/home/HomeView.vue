<template>
  <div
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="w-full flex gap-x-2">
      <div
        class="w-2/3 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] min-h-[100vh] pt-2 overflow-hidden rounded-sm"
      >
        <div
          class="flex text-sm text-center justify-around border-b border-[#EBECED] pt-2 pb-2"
        >
          <template v-for="(header, index) in homeNav" :key="index">
            <div
              class="cursor-pointer border-b-2 border-transparent w-fit pb-2 hover:border-blue hover:font-semibold"
              :class="{ '!border-blue font-semibold': header.active }"
              @click="toggleHomeNav(header.value)"
            >
              <span>{{ header.label }}</span>
              <span class="text-gray ml-1">{{ header.num }}</span>
            </div>
          </template>
        </div>
        <keep-alive>
          <component :is="currentComponent" class="px-4 py-2" />
        </keep-alive>
      </div>
      <div
        class="w-1/3 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-fit p-1 rounded-lg"
      >
        <WeatherView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { markRaw, ref, computed } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import RecommendHome from './components/RecommendHome.vue'
import FollowHome from './components/FollowHome.vue'
import FriendHome from './components/FriendHome.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const homeNav = ref([
  {
    label: t('message.recommend'),
    value: 'recommend',
    active: true,
    component: markRaw(RecommendHome)
  },
  {
    label: t('message.follow'),
    value: 'follow',
    active: false,
    component: markRaw(FollowHome)
  },
  {
    label: t('message.friend'),
    value: 'friend',
    active: false,
    component: markRaw(FriendHome)
  }
])

const currentComponent = computed(() => {
  return homeNav.value.find(header => header.active)?.component
})

const toggleHomeNav = value => {
  homeNav.value.forEach(header => {
    header.active = header.value === value
  })
}
</script>
