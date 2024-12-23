<template>
  <div class="flex py-2 px-10 gap-4 h-screen">
    <FriendList
      class="bg-white rounded-xl w-1/5 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-[100vh]"
      :friends="friends"
      @open="handleOpen"
    />
    <ChatRoom
      :email="chatEmail"
      class="bg-white rounded-xl w-4/5 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] h-[100vh]"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChatRoom from './components/ChatRoom.vue'
import FriendList from './components/FriendList.vue'
import { getFriendLists } from '@/api/chat'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const friends = ref([])
const chatEmail = ref(null)

const getFriendList = async () => {
  try {
    const res = await getFriendLists(userInfo.value.email)
    if (res.data.code !== 200) return
    friends.value = res.data.data.friendLists
  } catch (error) {
    console.error(error)
  }
}

const handleOpen = email => (chatEmail.value = email)

onMounted(async () => {
  await getFriendList()
})
</script>
