<template>
  <div class="flex items-center py-2 px-10 gap-4">
    <FriendList
      class="bg-white rounded-xl w-1/5 h-[86vh] shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
    />
    <ChatRoom
      class="bg-white rounded-xl w-4/5 h-[86vh] shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
    />
  </div>
</template>

<script setup>
import ChatRoom from './components/ChatRoom.vue'
import FriendList from './components/FriendList.vue'
</script>
