<template>
  <div
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
              <div class="introduction-container">
                <div class="self-introduction">
                  <span>{{ $t('message.individualResume') }} :</span>
                  <div class="flex items-center">
                    <span class="truncate max-w-64">{{
                      userInfo?.introduction || ''
                    }}</span>
                    <span class="toolTip">{{ userInfo?.introduction }}</span>
                  </div>
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
      ></div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'

const rightColumn = ref(null)
const isFixed = ref(false)

const handleScroll = () => {
  if (!rightColumn.value) return
  const rect = rightColumn.value.getBoundingClientRect()
  isFixed.value = rect.top <= 56
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
