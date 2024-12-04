<template>
  <div class="absolute top-12 left-1/2 -translate-x-1/2">
    <span class="triangle"></span>
    <div
      class="flex flex-col relative bg-white w-[360px] h-[440px] rounded shadow-sm"
    >
      <div
        class="flex items-center justify-evenly h-12 w-full border-b border-[#EBECED] flex-shrink-0"
      >
        {{ $t('message.myPrivateMessage') }}
      </div>
      <div class="flex-grow overflow-y-auto">
        <div>1</div>
      </div>
      <div
        class="flex flex-shrink-0 items-center py-4 px-2 justify-end h-10 border-t border-[#EBECED]"
      >
        <a class="hover:text-blue cursor-pointer">{{
          $t('message.viewAllPrivateMessages')
        }}</a>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.triangle {
  @apply absolute w-8 h-4 -top-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center;
  &:after {
    @apply absolute content-[''] -bottom-[2px] rotate-[45deg] h-6 w-6 -m-3 bg-white;
  }
}
</style>
