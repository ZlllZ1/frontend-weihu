<template>
  <div class="mx-4 my-5 min-h-[100vh] flex gap-x-3">
    <div
      class="w-[15%] p-2 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] bg-white rounded h-full"
    >
      <div class="flex flex-col items-center justify-center gap-y-2">
        <template v-for="nav in sideNav" :key="nav.value">
          <button
            class="w-full py-3 hover:bg-[#EBECED] rounded-lg"
            :class="{ 'bg-[#EBECED]': nav.active }"
            @click="changeNav(nav.value)"
          >
            <span
              class="w-fit border-b-2 border-transparent py-2"
              :class="{ '!border-blue font-semibold': nav.active }"
            >
              {{ nav.label }}
            </span>
          </button>
        </template>
      </div>
    </div>
    <div
      class="w-[85%] px-8 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] bg-white rounded"
    >
      <keep-alive>
        <component :is="currentComponent"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PostMoment from './components/PostMoment.vue'
import PostTopic from './components/PostTopic.vue'

const { t } = useI18n()

const sideNav = ref([
  {
    label: t('message.postTopic'),
    value: 'postTopic',
    active: true,
    component: markRaw(PostTopic)
  },
  {
    label: t('message.postMoment'),
    value: 'postMoment',
    active: false,
    component: markRaw(PostMoment)
  }
])

const currentComponent = computed(
  () => sideNav.value.find(nav => nav.active).component
)

const changeNav = v => {
  const activeNav = sideNav.value.find(nav => nav.active)
  if (v === activeNav.value) return
  activeNav.active = false
  sideNav.value.find(nav => nav.value === v).active = true
}
</script>
