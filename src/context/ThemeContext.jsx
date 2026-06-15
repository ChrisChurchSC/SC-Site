import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // SSR/SSG-safe: no localStorage during the Node render. Defaults to 'dark'
  // (matches index.html's background), then the effect syncs the stored value.
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const stored = localStorage.getItem('sc-theme')
    if (stored && stored !== theme) { setTheme(stored); return }
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
