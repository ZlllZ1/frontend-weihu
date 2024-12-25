<template>
  <div
    ref="scrollContainer"
    class="overflow-y-auto h-[392px]"
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
          <div>
            <a
              v-if="n.relatedItem.itemType === 'post'"
              :href="`/post/${n.relatedItem.itemId}`"
              target="_blank"
            >
              <img
                :src="n.relatedItem.detail.coverUrl"
                alt="cover"
                class="w-[76px] h-16 rounded-md"
              />
            </a>
          </div>
        </div>
        <div class="flex items-center justify-between px-2">
          <div class="truncate w-[200px] flex flex-col gap-1">
            <span v-if="n.relatedItem.detail.myContent"
              >{{ $t('message.me') }}:
              {{ n.relatedItem.detail.myContent }}</span
            >
            <span
              >{{ $t('message.content') }}:
              {{ n.relatedItem.detail.content }}</span
            >
          </div>
          <span class="text-xs">{{ convertToCST(n.createdAt) }}</span>
        </div>
      </div>
    </template>
    <div v-if="noMore" class="flex items-center justify-center py-2">
      {{ $t('message.noMore') }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { getNotifications, readNew } from '@/api/notification'

const store = useStore()
const notifications = ref([])
const userInfo = computed(() => store.state.user.userInfo)
const currentPage = ref(1)
const limit = ref(10)
const noMore = ref(false)
const scrollContainer = ref(null)
const loading = ref(false)

const getNotification = async () => {
  try {
    const res = await getNotifications(
      userInfo.value?._id,
      'comment',
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

const readNews = () => readNew(userInfo.value?._id, 'comment')

const loadMore = async () => {
  loading.value = true
  currentPage.value++
  await getNotification()
  loading.value = false
}

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

const handleScroll = () => {
  if (loading.value || noMore.value) return
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  if (scrollHeight - scrollTop - clientHeight < 20) loadMore()
}

onMounted(() => {
  getNotification()
})

onUnmounted(() => {
  readNews()
})
</script>
