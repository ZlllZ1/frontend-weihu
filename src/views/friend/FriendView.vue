<template>
  <div
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="w-full flex gap-x-2">
      <div
        class="w-[600px] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] min-h-[100vh] pt-2 overflow-hidden rounded-sm"
      >
        <div class="px-4 py-3">
          <div class="border-b border-gray py-2">筛选区域</div>
          <div
            v-if="loading"
            class="flex items-center justify-center py-4 h-full"
          >
            {{ $t('message.loading') }}
          </div>
          <template v-else-if="circleLists?.length">
            <div class="flex items-center flex-wrap gap-y-2 gap-x-5 py-3">
              <template v-for="circle in circleLists" :key="circle?.circleId">
                <div
                  class="w-[48%] h-48 border border-warmGray-300 rounded-md overflow-hidden p-2 flex justify-between flex-col"
                >
                  <span
                    class="cursor-pointer text-xs overflow-hidden"
                    @click="viewDetail(circle)"
                    v-html="circle?.content"
                  ></span>
                  <div
                    class="flex flex-col gap-1 border-t border-warmGray-300 pt-1"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <a
                          :href="`/userInfo/${circle.user.email}`"
                          target="_blank"
                          ><img
                            :src="circle?.user?.avatar"
                            alt="user avatar"
                            class="rounded-full w-8 h-8"
                        /></a>
                        <div class="flex items-center">
                          <a
                            :href="`/userInfo/${circle.user.email}`"
                            target="_blank"
                            class="text-gray hover:text-black truncate w-20"
                          >
                            {{ circle?.user?.nickname }}
                          </a>
                          <img
                            v-if="circle.email === userInfo.email"
                            src="../home/images/self.svg"
                            alt="self"
                            class="rounded-full w-4 h-4 ml-1"
                          />
                        </div>
                      </div>
                      <span class="text-xs text-gray">{{
                        convertToCST(circle.publishDate)
                      }}</span>
                    </div>
                    <div class="flex items-center justify-end gap-2 text-sm">
                      <div
                        class="flex items-center gap-1 group cursor-pointer"
                        @click="viewDetail(circle)"
                      >
                        <img
                          class="w-5 h-5 group-hover:text-black"
                          src="../home/images/comment.svg"
                          alt="comment"
                        />
                        <span class="text-[#8A8A8A] group-hover:text-blue"
                          >{{ $t('message.comment') }}
                          {{
                            circle.commentNum > 1000
                              ? '999+'
                              : circle.commentNum
                          }}</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-1 group cursor-pointer"
                        @click="handlePraise(circle.circleId)"
                      >
                        <img
                          class="w-5 h-5 group-hover:text-black"
                          :src="
                            circle.isPraise
                              ? require('../home/images/hasPraise.svg')
                              : require('../home/images/praise.svg')
                          "
                          alt="praise"
                        />
                        <span
                          class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                          :class="{ 'text-[#FE4144]': circle.isPraise }"
                          >{{ $t('message.like') }}
                          {{
                            circle.praiseNum > 1000 ? '999+' : circle.praiseNum
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <div
            v-else
            class="flex items-center justify-center text-gray py-4 text-lg h-full"
          >
            {{ $t('message.noPosts') }}
          </div>
          <div
            v-if="noMore && circleLists.length"
            class="flex items-center justify-center text-gray py-4 text-lg"
          >
            {{ $t('message.noMore') }}
          </div>
        </div>
      </div>
      <div ref="rightColumn">
        <div
          class="bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] p-1 rounded-lg top-14 max-h-[80vh] overflow-y-auto overflow-x-hidden"
          :class="{ fixed: isFixed }"
        >
          <WeatherView />
          <div
            v-if="circleInfo"
            class="min-h-[280px] p-2 shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
          >
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-1">
                <img
                  :src="circleInfo?.user?.avatar"
                  alt="user avatar"
                  class="rounded-full w-8 h-8"
                />
                <span>{{ circleInfo?.user?.nickname }}</span>
              </div>
              <span class="text-xs text-gray">{{
                convertToCST(circleInfo?.publishDate)
              }}</span>
            </div>
            <div class="py-2 border-t border-b border-[#EBECED]">
              <span v-html="circleInfo?.content"></span>
            </div>
            <div class="flex items-center justify-end pt-2 pb-10">
              <div
                class="flex items-center justify-end gap-1 group cursor-pointer"
                @click="handlePraise(circleInfo.circleId)"
              >
                <img
                  class="w-5 h-5 group-hover:text-black"
                  :src="
                    circleInfo.isPraise
                      ? require('../home/images/hasPraise.svg')
                      : require('../home/images/praise.svg')
                  "
                  alt="praise"
                />
                <span
                  class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                  :class="{ 'text-[#FE4144]': circleInfo.isPraise }"
                  >{{ $t('message.like') }}
                  {{
                    circleInfo.praiseNum > 1000 ? '999+' : circleInfo.praiseNum
                  }}</span
                >
              </div>
            </div>
            <div>
              <span class="text-lg">{{ $t('message.comment') }}</span>
            </div>
          </div>
          <div
            v-else
            class="min-h-[200px] p-1 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] flex items-center justify-center"
          >
            {{ $t('message.viewCircleDetail') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { useStore } from 'vuex'
import { getCircles, praiseCircle } from '@/api/circle'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const { t } = useI18n()
const store = useStore()
const rightColumn = ref(null)
const isFixed = ref(false)
const userInfo = computed(() => store.state.user.userInfo)
const limit = ref(10)
const currentPage = ref(1)
const circleLists = ref([])
const circleInfo = ref(null)
const noMore = ref(false)
const isInitialLoad = ref(true)
const loading = ref(false)

const getCircle = async () => {
  try {
    if (loading.value) return
    loading.value = true
    const res = await getCircles(
      userInfo.value.email,
      currentPage.value,
      limit.value
    )
    if (res.data.code !== 200) return
    circleLists.value = [...circleLists.value, ...res.data.data.circles]
    if (res.data.data.circles.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handlePraise = async circleId => {
  try {
    const res = await praiseCircle(userInfo.value.email, circleId)
    if (res.data.code !== 200) return
    circleLists.value = circleLists.value.map(circle => {
      if (circle.circleId === circleId) {
        if (circle.isPraise) circle.praiseNum--
        else circle.praiseNum++
        circle.isPraise = !circle.isPraise
      }
      return circle
    })
    $toast.success(t('message.operateSuccess'))
  } catch (error) {
    console.error(error)
    $toast.error(t('message.operateFail'))
  }
}

const viewDetail = circle => (circleInfo.value = circle)

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const loadMore = async () => {
  if (noMore.value || isInitialLoad.value) return
  currentPage.value++
  await getCircle()
}

const handleScroll = debounce(async () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (
    documentHeight - windowHeight - scrollTop < 50 &&
    !noMore.value &&
    !isInitialLoad.value
  ) {
    await loadMore()
  }
}, 200)

onMounted(async () => {
  getCircle()
  if (isInitialLoad.value) {
    await getCircle()
    isInitialLoad.value = false
  }
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const convertToCST = isoString => {
  const date = new Date(isoString.replace('Z', '+00:00'))
  const utcTimestamp = date.getTime()
  const cstDate = new Date(utcTimestamp)
  const formattedDate =
    cstDate.toLocaleDateString().replace(/-/g, ' ') +
    ' ' +
    cstDate
      .toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
      .replace(/^\D*/, '')
  return formattedDate
}
</script>

<style lang="scss" scoped>
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
