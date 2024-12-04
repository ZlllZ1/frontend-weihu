<template>
  <div class="py-6">
    <div class="border-b border-[#999]">
      <span>{{ $t('message.postVisibility') }}</span>
      <div class="flex items-center justify-around py-4">
        <template v-for="item in range" :key="item.value">
          <label :for="'range-' + item.value" class="flex items-center gap-x-2">
            <span>{{ item.label }}</span>
            <input
              :id="'range-' + item.value"
              v-model="selectedLimit"
              type="radio"
              :value="item.value"
              @change="handleChange(item)"
            />
          </label>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import { changePostLimit } from '@/api/setting'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const $toast = useToast()
const setting = computed(() => store.state.user.userInfo.setting)
const userInfo = computed(() => store.state.user.userInfo)
const selectedLimit = ref(setting.value.postLimit)

const range = ref([
  {
    label: t('message.allVisible'),
    value: 0
  },
  {
    label: t('message.visibleOnly'),
    value: 1
  },
  {
    label: t('message.visibleThree'),
    value: 3
  },
  {
    label: t('message.visibleWeek'),
    value: 7
  },
  {
    label: t('message.visibleMonth'),
    value: 30
  },
  {
    label: t('message.visibleHalfYear'),
    value: 180
  },
  {
    label: t('message.visibleYear'),
    value: 360
  }
])

const handleChange = async item => {
  try {
    const res = await changePostLimit(userInfo.value.email, item.value)
    if (res.data.code !== 200) return
    store.commit('user/updateSetting', {
      postLimit: item.value
    })
    localStorage.setItem('userInfo', JSON.stringify(store.state.user.userInfo))
    $toast.success('修改成功')
  } catch (error) {
    $toast.error('修改失败')
    selectedLimit.value = setting.value.postLimit
  }
}
</script>
