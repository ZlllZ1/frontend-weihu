<template>
  <div
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="w-full flex gap-x-2">
      <div
        class="w-2/3 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] min-h-[100vh] pt-2 overflow-hidden rounded-sm"
      ></div>
      <div
        class="w-1/3 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-fit p-1 rounded-lg"
      >
        <WeatherView />
      </div>
    </div>
  </div>
</template>

<script setup>
import WeatherView from '@/components/common/weather/WeatherView.vue'
</script>
