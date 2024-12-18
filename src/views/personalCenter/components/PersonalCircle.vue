<template>
  <div>
    <div class="flex items-center justify-around">
      <template v-for="header in headers" :key="header.value">
        <div
          class="w-1/2 flex items-center justify-center border-b border-[#EBECED] py-1 border-r border-l"
        >
          <button
            class="py-1 border-b-2 border-transparent hover:!border-blue hover:font-semibold"
            :class="{ 'font-semibold !border-blue': header.active }"
            @click="toggleHeader(header.value)"
          >
            {{ header.label }}
          </button>
        </div>
      </template>
    </div>
    <CircleList :key="activeHeaderValue" :type="activeHeaderValue" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CircleList from './CircleList.vue'

const activeHeaderValue = ref('after')
const headers = computed(() => [
  {
    label: '可见',
    value: 'after',
    active: activeHeaderValue.value === 'after'
  },
  {
    label: '不可见',
    value: 'before',
    active: activeHeaderValue.value === 'before'
  }
])

const toggleHeader = value => (activeHeaderValue.value = value)
</script>
