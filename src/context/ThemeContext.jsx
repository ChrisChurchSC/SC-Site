import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // SSR/SSG-safe: no localStorage during the Node render. Defaults to 'dark'
  // (matches index.html's background); the mount effect adopts the stored value.
  const [theme, setTheme] = useState('dark')

  // Adopt the stored choice once, after hydration. Keyed on [] deliberately:
  // reading storage on every theme change fought the toggle, because the click
  // landed before the new value was written and the stale read reverted it.
  useEffect(() => {
    const stored = localStorage.getItem('sc-theme')
    if (stored && stored !== 'dark') setTheme(stored)
  }, [])

  // Apply and persist every change.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sc-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
