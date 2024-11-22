<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-1 cursor-pointer"
    @mousedown.self="emit('closeLogin')"
  >
    <div
      class="bg-white w-[360px] h-[440px] rounded shadow-[0_0_20px_0_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out cursor-default"
      @click.stop
    >
      登录框
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['closeLogin'])
</script>

<style lang="scss" scoped>
.fixed {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
