<template>
  <div class="loading-overlay" :class="{ 'bg-transparent': transparent }">
    <div class="loading-wrapper">
      <div class="loading-spinner"></div>
    </div>
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
.loading-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading-wrapper {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid #e5e7eb;
  border-top-color: #9ca3af;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.55, 0.25, 0.25, 0.7) infinite;
  will-change: transform;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bg-transparent {
  background-color: transparent;
}
</style>
