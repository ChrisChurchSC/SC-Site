import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

/**
 * Shared toast notification. `useToast` owns the state + auto-dismiss;
 * `<Toast>` renders the current toast. Used by the homepage grid and
 * client index pages so coming-soon cards behave identically.
 */
export function useToast(duration = 3500) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), duration)
    return () => clearTimeout(t)
  }, [toast, duration])

  const showToast = useCallback((msg) => setToast({ msg, ts: Date.now() }), [])

  return { toast, showToast }
}

export function Toast({ toast }) {
  if (!toast || typeof document === 'undefined') return null
  // Portal to <body> so an ancestor's transform (e.g. the page slideUp
  // animation) can't make `position: fixed` anchor to the page instead
  // of the viewport.
  return createPortal(
    <div key={toast.ts} className={styles.toast} role="status" aria-live="polite">
      {toast.msg}
    </div>,
    document.body,
  )
}
