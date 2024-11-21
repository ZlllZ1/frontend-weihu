<template>
  <div class="absolute top-12 left-1/2 -translate-x-1/2">
    <span class="triangle"></span>
    <div
      class="bg-white w-[360px] h-[440px] rounded shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
    >
      私信框
    </div>
  </div>
</template>

<style lang="scss" scoped>
.triangle {
  @apply absolute w-8 h-4 -top-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center;
  &:after {
    @apply absolute content-[''] -bottom-[2px] rotate-[45deg] h-6 w-6 -m-3 bg-white;
  }
}
</style>
