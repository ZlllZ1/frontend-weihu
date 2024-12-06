<template>
  <div v-for="post in posts" :key="post._id">{{ post.title }}</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getPosts } from '@/api/post'

const posts = ref([])
const currentPage = ref(1)
const limit = computed(() => currentPage.value * 10)

const getHomePosts = async () => {
  const res = await getPosts(currentPage.value, limit.value)
  if (res.data.code !== 200) return
  posts.value = res.data.data.posts
}
onMounted(() => {
  getHomePosts()
})
</script>
