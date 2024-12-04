import { createI18n } from 'vue-i18n'
import enUs from './en-us/index.js'
import zhCn from './zh-cn/index.js'

const messages = {
  'zh-cn': { ...zhCn },
  'en-us': { ...enUs }
}

const i18n = createI18n({
  locale: localStorage.getItem('language') || 'zh-cn',
  fallbackLocale: 'zh-cn',
  legacy: false,
  globalInjection: true,
  messages: messages
})

export default i18n
