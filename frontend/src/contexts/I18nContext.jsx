import React, { createContext, useContext, useEffect, useState } from 'react'
import { en, my, th, zh, vi, fr, ja } from '../i18n/locales'

let I18nContext = createContext()

let STORAGE_KEY = 'avere-lang'
let SUPPORTED = ['en', 'my', 'th', 'zh', 'vi', 'fr', 'ja']
let dictionaries = { en, my, th, zh, vi, fr, ja }

let htmlLang = {
  en: 'en',
  my: 'my',
  th: 'th',
  zh: 'zh-CN',
  vi: 'vi',
  fr: 'fr',
  ja: 'ja',
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), obj)
}

export function I18nProvider({ children }) {
  let [lang, setLangState] = useState(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEY)
      return SUPPORTED.includes(saved) ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
    document.documentElement.lang = htmlLang[lang] || 'en'
  }, [lang])

  let setLang = (next) => {
    if (!SUPPORTED.includes(next)) return
    setLangState(next)
  }

  let t = (key) => {
    let dict = dictionaries[lang] || en
    let value = getByPath(dict, key)
    if (value != null) return value
    let fallback = getByPath(en, key)
    return fallback != null ? fallback : key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t, supported: SUPPORTED }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  let ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export { I18nContext }
