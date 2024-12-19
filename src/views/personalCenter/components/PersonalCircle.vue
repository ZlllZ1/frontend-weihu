<template>
  <div>
    <div v-if="!props.email" class="flex items-center justify-around">
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
    <CircleList
      :key="activeHeaderValue"
      :type="activeHeaderValue"
      :email="email"
      @handleChange="handleChange"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CircleList from './CircleList.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['handleChange'])
const props = defineProps({
  email: {
    type: String,
    default: ''
  }
})

const activeHeaderValue = ref('after')
const headers = computed(() => [
  {
    label: t('message.visible'),
    value: 'after',
    active: activeHeaderValue.value === 'after'
  },
  {
    label: t('message.invisible'),
    value: 'before',
    active: activeHeaderValue.value === 'before'
  }
])

const toggleHeader = value => (activeHeaderValue.value = value)

const handleChange = data => emit('handleChange', data)
</script>
