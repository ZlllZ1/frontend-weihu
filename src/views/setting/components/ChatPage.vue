<template>
  <div class="py-6">
    <div class="border-b border-[#999] pb-2">
      <span>{{ $t('message.privateMessageRange') }}</span>
      <div class="flex flex-col gap-y-2 mt-3">
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
import { changeChatLimit } from '@/api/setting'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const $toast = useToast()
const setting = computed(() => store.state.user.userInfo.setting)
const userInfo = computed(() => store.state.user.userInfo)
const selectedLimit = ref(setting.value.chatLimit)

const range = ref([
  {
    label: t('message.chatAll'),
    value: 0
  },
  {
    label: t('message.chatFriend'),
    value: 3
  },
  {
    label: t('message.chatFollowFriend'),
    value: 7
  },
  {
    label: t('message.chatFollowFanFriend'),
    value: 30
  },
  {
    label: t('message.chatNone'),
    value: 180
  }
])

const handleChange = async item => {
  try {
    const res = await changeChatLimit(userInfo.value.email, item.value)
    if (res.data.code !== 200) return
    store.commit('user/updateSetting', {
      chatLimit: item.value
    })
    localStorage.setItem('userInfo', JSON.stringify(store.state.user.userInfo))
    $toast.success(t('message.modifySuccess'))
  } catch (error) {
    $toast.error(t('message.modifyError'))
  }
}
</script>
