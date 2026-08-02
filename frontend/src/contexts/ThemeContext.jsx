import React, { createContext, useContext, useEffect, useState } from 'react'

let ThemeContext = createContext()

let STORAGE_KEY = 'avere-theme'

function getSystemDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme) {
  let root = document.documentElement
  let dark = theme === 'dark' || (theme === 'system' && getSystemDark())
  root.classList.toggle('dark', dark)
  root.dataset.theme = theme
}

export function ThemeProvider({ children }) {
  let [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system'
    } catch {
      return 'system'
    }
  })

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    let mq = window.matchMedia('(prefers-color-scheme: dark)')
    let onChange = () => applyTheme('system')
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [theme])

  let setTheme = (next) => {
    if (!['light', 'dark', 'system'].includes(next)) return
    setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  let ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export { ThemeContext }
