import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], label'

export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    // Skip on touch/stylus-only devices — no mouse cursor to replace
    if (window.matchMedia('(hover: none)').matches) return

    const el = ref.current
    if (!el) return

    // Force cursor:none on html/body for Safari compatibility
    document.documentElement.style.cursor = 'none'
    document.body.style.cursor = 'none'
    // Gates the global rule in Cursor.module.css, which would otherwise apply
    // on every route simply because this file is imported.
    document.documentElement.classList.add('sc-hide-cursor')

    const onMove = (e) => {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.classList.remove(styles.hidden)
      if (e.target.closest(INTERACTIVE)) {
        el.classList.add(styles.large)
      } else {
        el.classList.remove(styles.large)
      }
    }

    const onLeave = () => el.classList.add(styles.hidden)
    const onEnter = () => el.classList.remove(styles.hidden)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.documentElement.style.cursor = ''
      document.body.style.cursor = ''
      document.documentElement.classList.remove('sc-hide-cursor')
    }
  }, [])

  return <div ref={ref} className={`${styles.cursor} ${styles.hidden}`} />
}
