<template>
  <div class="loading-wrapper" :class="{ 'bg-transparent': transparent }">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup>
defineProps({
  transparent: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.loading-wrapper {
  @apply absolute inset-0 flex items-center justify-center bg-transparent;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-gray rounded-full;
  border-top-color: #9ca3af;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
