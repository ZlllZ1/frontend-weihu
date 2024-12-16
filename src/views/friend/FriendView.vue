<template>
  <div
    class="flex flex-col gap-y-2 items-center mx-32 my-5 min-h-[100vh] overflow-hidden"
  >
    <div class="w-full flex gap-x-2">
      <div
        class="w-2/3 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.1)] min-h-[100vh] pt-2 overflow-hidden rounded-sm"
      >
        <div class="px-4 py-3">
          <div class="border-b border-gray py-2">筛选区域</div>
          <div class="flex items-center flex-wrap gap-y-2 gap-x-5 py-3">
            <template v-for="circle in circleLists" :key="circle?.circleId">
              <div
                class="w-[48%] h-48 border border-warmGray-300 rounded-md overflow-hidden p-2 flex justify-between flex-col"
              >
                <span v-html="circle?.content"></span>
                <div
                  class="flex flex-col gap-1 border-t border-warmGray-300 pt-1"
                >
                  <div class="flex items-center">
                    <a :href="`/userInfo/${circle.user.email}`" target="_blank"
                      ><img
                        :src="circle?.user?.avatar"
                        alt="user avatar"
                        class="rounded-full w-8 h-8"
                    /></a>
                    <div class="truncate w-32 ml-3">
                      <a
                        :href="`/userInfo/${circle.user.email}`"
                        target="_blank"
                        class="text-gray hover:text-black"
                      >
                        {{ circle?.user?.nickname }}
                      </a>
                    </div>
                  </div>
                  <div class="flex items-center justify-end gap-2 text-sm">
                    <div class="flex items-center gap-1 group cursor-pointer">
                      <img
                        class="w-5 h-5 group-hover:text-black"
                        src="../home/images/comment.svg"
                        alt="comment"
                      />
                      <span class="text-[#8A8A8A] group-hover:text-blue"
                        >{{ $t('message.comment') }}
                        {{
                          circle.commentNum > 1000 ? '999+' : circle.commentNum
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
                          circle.praise
                            ? require('../home/images/hasPraise.svg')
                            : require('../home/images/praise.svg')
                        "
                        alt="praise"
                      />
                      <span
                        class="text-[#8A8A8A] group-hover:text-[#FE4144]"
                        :class="{ 'text-[#FE4144]': circle.praise }"
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
        </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import WeatherView from '@/components/common/weather/WeatherView.vue'
import { useStore } from 'vuex'
import { getCircles } from '@/api/circle'

const store = useStore()
const rightColumn = ref(null)
const isFixed = ref(false)
const userInfo = computed(() => store.state.user.userInfo)
const limit = ref(10)
const currentPage = ref(1)
const circleLists = ref([])

const handleScroll = () => {
  if (!rightColumn.value) return
  const rect = rightColumn.value.getBoundingClientRect()
  isFixed.value = rect.top <= 56
}

const getCircle = async () => {
  const res = await getCircles(
    userInfo.value.email,
    currentPage.value,
    limit.value
  )
  if (res.data.code !== 200) return
  circleLists.value = res.data.data.circles
}

const handlePraise = async circleId => {
  console.log(111)
}

onMounted(() => {
  getCircle()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
