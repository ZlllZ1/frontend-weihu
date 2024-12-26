<template>
  <section class="flex pt-2 mb-10 px-10 gap-4 h-[85vh]">
    <FriendList
      class="bg-white rounded-xl w-1/5 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-[85vh]"
      :friends="friends"
      @open="handleOpen"
    />
    <ChatRoom
      :email="chatEmail"
      class="bg-white rounded-xl w-4/5 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-[85vh]"
      @send="handleSend"
      @refresh="handleRefresh"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useStore } from 'vuex'
import eventBus from '@/utils/eventBus'
import ChatRoom from './components/ChatRoom.vue'
import FriendList from './components/FriendList.vue'
import { getFriendLists, readMessages } from '@/api/chat'

const store = useStore()

// 用户信息
const userInfo = computed(() => store.state.user.userInfo)

// 聊天对象
const chatEmail = ref(null)

// 好友列表
const friends = ref([])
const getFriendList = async () => {
  try {
    const res = await getFriendLists(userInfo.value.email)
    if (res.data.code !== 200) return
    friends.value = res.data.data.friendLists
  } catch (error) {
    console.error(error)
  }
}

// 监听新消息, 更新好友列表(将用户提至最上方,未读+1)
const newMessage = inject('newMessage')
watch(newMessage, newValue => {
  if (newValue) {
    const friendIndex = friends.value.findIndex(
      f => f.chatId === newValue.data.chatId
    )
    if (friendIndex !== -1) {
      const friend = friends.value.splice(friendIndex, 1)[0]
      friend.myUnreadCount += 1
      friend.updatedAt = newValue.data.message.timestamp
      friend.lastMessage = {
        content: newValue.data.message.content,
        senderEmail: newValue.data.message.senderEmail,
        timestamp: newValue.data.message.timestamp
      }
      friends.value.unshift(friend)
    }
  }
})

// 刷新消息,已读消息,去红点
const refresh = async data => {
  try {
    if (!friends.value.find(f => f.chatId === data.chatId).myUnreadCount) return
    const res = await readMessages(
      data.chatId,
      userInfo.value.email,
      data.email
    )
    if (res.data.code !== 200) return
    friends.value.find(f => f.chatId === data.chatId).myUnreadCount = 0
  } catch (error) {
    console.error(error)
  }
}
const handleRefresh = data => refresh(data)

// 打开聊天窗口
const handleOpen = data => {
  const unreadCount = friends.value.find(
    f => f.chatId === data.chatId
  ).myUnreadCount
  eventBus.emit('sendUnreadCount', unreadCount)
  refresh(data)
  chatEmail.value = data.email
}

// 发送消息,更新好友列表
const handleSend = data => {
  const friend = friends.value.find(f => f.chatId === data.chatId)
  if (friend) {
    friend.lastMessage = data.lastMessage
    friend.updatedAt = data.updatedAt
  }
}

onMounted(() => {
  getFriendList()
})
</script>
