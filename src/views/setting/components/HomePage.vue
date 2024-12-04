<template>
  <div class="flex flex-col">
    <div
      v-for="(option, index) in options"
      :key="option.value"
      class="flex items-center gap-x-2 py-6"
      :class="{ 'border-b border-[#999]': index !== options.length - 1 }"
    >
      <div class="w-full flex items-center text-base">
        <span class="w-[20%]">{{ option.label }}</span>
        <input
          v-model="option.selected"
          type="checkbox"
          class="ml-8 w-5 h-5"
          @change="handleChange(option)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toast-notification'
import {
  changeShowIp,
  changeShowFan,
  changeShowFollow,
  changeShowPraise,
  changeShowCollect,
  changeShowShare,
  changeShowFriend,
  changeShowLive
} from '@/api/setting'
import { useI18n } from 'vue-i18n'

const store = useStore()
const userInfo = computed(() => store.state.user.userInfo)
const setting = computed(() => store.state.user.userInfo.setting)
const $toast = useToast()
const { t } = useI18n()

const options = ref([
  {
    label: t('message.showIp'),
    value: 'showIp',
    selected: setting.value.showIp
  },
  {
    label: t('message.showFan'),
    value: 'showFan',
    selected: setting.value.showFan
  },
  {
    label: t('message.showFollow'),
    value: 'showFollow',
    selected: setting.value.showFollow
  },
  {
    label: t('message.showPraise'),
    value: 'showPraise',
    selected: setting.value.showPraise
  },
  {
    label: t('message.showCollect'),
    value: 'showCollect',
    selected: setting.value.showCollect
  },
  {
    label: t('message.showShare'),
    value: 'showShare',
    selected: setting.value.showShare
  },
  {
    label: t('message.showFriend'),
    value: 'showFriend',
    selected: setting.value.showFriend
  },
  {
    label: t('message.showLive'),
    value: 'showLive',
    selected: setting.value.showLive
  }
])

const useFunc = option => {
  switch (option.value) {
    case 'showIp':
      return changeShowIp(userInfo.value.email, option.selected)
    case 'showFan':
      return changeShowFan(userInfo.value.email, option.selected)
    case 'showFollow':
      return changeShowFollow(userInfo.value.email, option.selected)
    case 'showPraise':
      return changeShowPraise(userInfo.value.email, option.selected)
    case 'showCollect':
      return changeShowCollect(userInfo.value.email, option.selected)
    case 'showShare':
      return changeShowShare(userInfo.value.email, option.selected)
    case 'showFriend':
      return changeShowFriend(userInfo.value.email, option.selected)
    case 'showLive':
      return changeShowLive(userInfo.value.email, option.selected)
  }
}

const handleChange = async option => {
  try {
    const res = await useFunc(option)
    if (res.data.code !== 200) return
    store.commit('user/updateSetting', {
      [option.value]: option.selected
    })
    localStorage.setItem('userInfo', JSON.stringify(store.state.user.userInfo))
    $toast.success('修改成功')
  } catch (error) {
    $toast.error('修改失败')
    options.value.find(item => item.value === option.value).selected =
      !option.selected
  }
}
</script>
