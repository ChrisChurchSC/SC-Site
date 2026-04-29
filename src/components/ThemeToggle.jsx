import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <span className={`theme-track${isLight ? ' theme-track--light' : ''}`}>
        <span className={`theme-thumb${isLight ? ' theme-thumb--light' : ''}`} />
      </span>
    </button>
  )
}
