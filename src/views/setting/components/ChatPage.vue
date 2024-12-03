<template>
  <div class="py-6">
    <div class="border-b border-[#999]">
      <span>私信范围</span>
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
import { changeChatLimit } from '@/api/setting'

const store = useStore()
const $toast = useToast()
const setting = computed(() => store.state.user.userInfo.setting)
const userInfo = computed(() => store.state.user.userInfo)
const selectedLimit = ref(setting.value.chatLimit)

const range = ref([
  {
    label: '全部人可私信',
    value: 0
  },
  {
    label: '好友可私信',
    value: 3
  },
  {
    label: '关注和好友可私信',
    value: 7
  },
  {
    label: '关注、粉丝和好友可私信',
    value: 30
  },
  {
    label: '不可私信',
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
    $toast.success('修改成功')
  } catch (error) {
    $toast.error('修改失败')
  }
}
</script>
