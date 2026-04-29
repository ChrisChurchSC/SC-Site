import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], label'

export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
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
    }
  }, [])

  return <div ref={ref} className={`${styles.cursor} ${styles.hidden}`} />
}
