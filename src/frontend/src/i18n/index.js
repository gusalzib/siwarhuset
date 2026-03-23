import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import sv from '../locales/sv.json'
import ar from '../locales/ar.json'

const messages = {
  en,
  sv,
  ar
}

const savedLocale = localStorage.getItem('locale') || 'sv'

export default createI18n({
  locale: savedLocale,
  fallbackLocale: 'en',
  messages
})
