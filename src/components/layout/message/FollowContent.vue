<template>
  <section
    ref="scrollContainer"
    class="overflow-y-auto h-[372px]"
    @scroll="handleScroll"
  >
    <template v-for="n in notifications" :key="n._id">
      <div
        class="border-b border-[#EBECED]"
        :class="n.isRead ? '' : 'bg-warmGray-100'"
      >
        <div class="py-1 px-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <a :href="`/userInfo/${n.sender.email}`" target="_blank">
              <img
                :src="n.sender.avatar"
                alt="user avatar"
                class="rounded-full w-10 h-10"
              />
            </a>
            <div class="flex flex-col justify-center gap-1">
              <a :href="`/userInfo/${n.sender.email}`" target="_blank">
                <div class="w-32 truncate hover:text-black">
                  {{ n.sender.nickname }}
                </div>
              </a>
              <span>{{ n.content }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end text-xs pr-2">
          {{ convertToCST(n.createdAt) }}
        </div>
      </div>
    </template>
    <div
      v-if="noMore"
      class="flex items-center justify-center py-2"
      :class="{ 'h-full': !notifications.length }"
    >
      {{ $t('message.noMore') }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import eventBus from '@/utils/eventBus'
import { getNotifications, readNew } from '@/api/notification'

const store = useStore()

// 用户信息
const userInfo = computed(() => store.state.user.userInfo)

// 容器对象
const scrollContainer = ref(null)

// 分页
const currentPage = ref(1)
const limit = ref(10)

// 加载/没有更多
const noMore = ref(false)
const loading = ref(false)

// 通知
const notifications = ref([])
// 获取通知
const getNotification = async () => {
  try {
    const res = await getNotifications(
      userInfo.value?._id,
      'follow',
      currentPage.value,
      limit.value
    )
    if (res.data.code !== 200) return
    notifications.value = [
      ...notifications.value,
      ...res.data.data.notifications
    ]
    if (res.data.data.notifications.length < limit.value) noMore.value = true
  } catch (error) {
    console.error(error)
  }
}

// 转换时间
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

// 防抖加载更多
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
  loading.value = true
  currentPage.value++
  await getNotification()
  loading.value = false
}
const handleScroll = debounce(() => {
  if (loading.value || noMore.value) return
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  if (scrollHeight - scrollTop - clientHeight < 20) loadMore()
}, 200)

// 去除红点
const readNews = () => {
  readNew(userInfo.value?._id, 'follow')
  eventBus.emit('refreshNotification')
}

onMounted(() => {
  getNotification()
})

onUnmounted(() => {
  readNews()
})
</script>
