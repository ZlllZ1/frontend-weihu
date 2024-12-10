<template>
  <div v-if="weatherData" class="weather-card rounded-lg overflow-hidden">
    <div class="weather-background p-4">
      <div class="flex justify-between items-center mb-3">
        <span class="text-lg font-semibold text-white">{{ date }}</span>
        <span class="text-2xl font-bold text-white">{{ formattedTime }}</span>
      </div>
      <div class="mb-3">
        <div class="text-xl font-medium text-white">
          <span>{{ weatherData.province }} · {{ weatherData.city }}</span>
        </div>
        <span class="text-white opacity-80">{{
          weekDay[weatherData.casts[0].week]
        }}</span>
      </div>
      <div class="flex items-center justify-between mb-4">
        <div class="text-6xl font-bold text-white">
          <span v-if="isDayTime">{{ weatherData.casts[0].daytemp }}°</span>
          <span v-else>{{ weatherData.casts[0].nighttemp }}°</span>
        </div>
        <div class="text-right">
          <div class="text-2xl text-white">
            <span v-if="isDayTime">{{ weatherData.casts[0].dayweather }}</span>
            <span v-else>{{ weatherData.casts[0].nightweather }}</span>
          </div>
          <div class="text-white opacity-80">
            <span v-if="isDayTime">{{ weatherData.casts[0].daywind }}风</span>
            <span v-else>{{ weatherData.casts[0].nightwind }}风</span>
          </div>
        </div>
      </div>
      <div class="flex justify-between text-sm text-white opacity-80">
        <div>
          {{ $t('message.highest') }}
          {{
            Math.max(
              weatherData.casts[0].daytemp,
              weatherData.casts[0].nighttemp
            )
          }}°
        </div>
        <div>
          {{ $t('message.lowest') }}
          {{
            Math.min(
              weatherData.casts[0].daytemp,
              weatherData.casts[0].nighttemp
            )
          }}°
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import request from '@/utils/request'
import { computed, onMounted, ref, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const weatherData = ref(null)
const cityInfo = ref(null)
const weekDay = [
  '',
  t('message.Monday'),
  t('message.Tuesday'),
  t('message.Wednesday'),
  t('message.Thursday'),
  t('message.Friday'),
  t('message.Saturday'),
  t('message.Sunday')
]
const time = ref('')
const intervalId = ref(null)

const date = computed(() => {
  const now = weatherData.value?.casts[0].date
  const part = now.split('-')
  return `${part[0]}${t('message.year')}${part[1]}${t('message.month')}${
    part[2]
  }${t('message.day')}`
})

const formattedTime = computed(() => {
  const [hours, minutes, seconds] = time.value.split(':')
  return `${hours?.padStart(2, '0')}:${minutes?.padStart(
    2,
    '0'
  )}:${seconds?.padStart(2, '0')}`
})

const updateTime = () => {
  let [hours, minutes, seconds] = time.value.split(':').map(Number)
  seconds++
  if (seconds >= 60) {
    seconds = 0
    minutes++
    if (minutes >= 60) {
      minutes = 0
      hours++
      if (hours >= 24) {
        hours = 0
      }
    }
  }
  time.value = `${hours}:${minutes}:${seconds}`
}

const isDayTime = computed(() => {
  if (!weatherData.value?.reporttime) return false
  const [datePart, timePart] = weatherData.value.reporttime.split(' ')
  const [year, month, day] = datePart.split('-')
  const [hour, minute, second] = timePart.split(':')
  const reportDate = new Date(year, month - 1, day, hour, minute, second)
  const reportHour = reportDate.getHours()
  return reportHour >= 6 && reportHour < 18
})

const getCity = () => {
  return new Promise((resolve, reject) => {
    AMapLoader.load({
      key: '1cefab37151fe80bdfd575a8d8545da9',
      version: '2.0',
      plugins: ['AMap.CitySearch']
    })
      .then(AMap => {
        const citySearch = new AMap.CitySearch()
        resolve(citySearch.config.adcode)
      })
      .catch(e => {
        console.error('AMap加载失败:', e)
        reject(e)
      })
  })
}

const getWeatherData = async cityCode => {
  try {
    const res = await request.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=1cefab37151fe80bdfd575a8d8545da9&city=${cityCode}&extensions=all`
    )
    weatherData.value = res.data.forecasts[0]
  } catch (error) {
    console.error('获取天气数据失败:', error)
  }
}

onMounted(async () => {
  cityInfo.value = await getCity()
  await getWeatherData(cityInfo.value)
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  time.value = `${hours}:${minutes}:${seconds}`
  intervalId.value = setInterval(updateTime, 1000)
})
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<style lang="scss" scoped>
.weather-card {
  width: 320px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.weather-background {
  background: linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%);
  position: relative;
  overflow: hidden;
}

.weather-background::before,
.weather-background::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.weather-background::before {
  width: 140px;
  height: 140px;
  top: -70px;
  right: -70px;
}

.weather-background::after {
  width: 80px;
  height: 80px;
  bottom: -40px;
  left: -40px;
}
</style>
