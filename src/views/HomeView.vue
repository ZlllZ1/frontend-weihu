<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
  <div class="bg-blue-500 text-white p-4">Hello Tailwind!</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld
  }
})
</script>
