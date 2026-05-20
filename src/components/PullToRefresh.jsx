import { useEffect, useRef, useState } from 'react'
import './PullToRefresh.css'

const THRESHOLD = 72   // px of (damped) pull needed to trigger a reload
const MAX_PULL = 110   // px the indicator can travel
const RESISTANCE = 0.5 // drag damping — pull feels heavier the further you go

export default function PullToRefresh() {
  const [pull, setPull] = useState(0)
  const [status, setStatus] = useState('idle') // idle | pulling | ready | refreshing
  const startY = useRef(0)
  const tracking = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('ontouchstart' in window)) return

    const onStart = (e) => {
      if (window.scrollY > 0 || status === 'refreshing') return
      startY.current = e.touches[0].clientY
      tracking.current = true
    }

    const onMove = (e) => {
      if (!tracking.current) return
      if (window.scrollY > 0) { tracking.current = false; setPull(0); setStatus('idle'); return }
      const raw = e.touches[0].clientY - startY.current
      if (raw <= 0) { setPull(0); setStatus('idle'); return }
      // Block the browser's native pull-to-refresh while we drive our own
      if (e.cancelable) e.preventDefault()
      const damped = Math.min(MAX_PULL, raw * RESISTANCE)
      setPull(damped)
      setStatus(damped >= THRESHOLD ? 'ready' : 'pulling')
    }

    const onEnd = () => {
      if (!tracking.current) return
      tracking.current = false
      if (status === 'ready') {
        setStatus('refreshing')
        setPull(THRESHOLD)
        setTimeout(() => window.location.reload(), 600)
      } else {
        setPull(0)
        setStatus('idle')
      }
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [status])

  const progress = Math.min(1, pull / THRESHOLD)
  const visible = status !== 'idle'

  return (
    <div
      className={`ptr ptr--${status}`}
      aria-hidden={!visible}
      style={{
        transform: `translate(-50%, ${visible ? pull - 8 : -48}px)`,
        opacity: visible ? Math.min(1, progress + 0.2) : 0,
        transition: tracking.current ? 'none' : 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.2s ease',
      }}
    >
      <svg
        className="ptr-glyph"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        style={{ transform: `rotate(${progress * 300}deg)` }}
      >
        {/* circular reload arrow */}
        <path
          d="M20 12a8 8 0 1 1-2.34-5.66"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
