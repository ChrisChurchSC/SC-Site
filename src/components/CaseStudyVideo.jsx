import { useEffect, useRef, useState } from 'react'
import styles from './CaseStudyVideo.module.css'

/**
 * Case study video: autoplays muted and loops, lazy-loads when near the
 * viewport, and pauses when offscreen. Corner controls let the viewer
 * unmute for sound and — for clips longer than 10s — pause/play.
 */
export default function CaseStudyVideo({ src, onError, rootMargin = '300px' }) {
  const ref = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false) // explicit viewer intent
  const [playing, setPlaying] = useState(true)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true); setInView(true)
      return
    }
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { setShouldLoad(true); setInView(true) }
        else setInView(false)
      }
    }, { rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])

  useEffect(() => {
    const vid = ref.current
    if (!vid || !shouldLoad) return
    vid.muted = muted
    if (inView && !paused) vid.play?.().catch(() => {})
    else vid.pause?.()
  }, [inView, shouldLoad, muted, paused])

  const toggleSound = () => {
    const v = ref.current
    if (!v) return
    const next = !muted
    setMuted(next)
    v.muted = next
    v.play?.().catch(() => {})
  }

  const togglePlay = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) { setPaused(false); v.play?.().catch(() => {}) }
    else { setPaused(true); v.pause?.() }
  }

  const showPlayPause = duration > 10

  return (
    <div className={styles.wrap}>
      <video
        ref={ref}
        src={shouldLoad ? src : undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className={styles.video}
        onError={onError}
        onLoadedMetadata={e => setDuration(e.target.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className={styles.controls}>
        {showPlayPause && (
          <button
            className={styles.ctrlBtn}
            onClick={togglePlay}
            aria-label={playing ? 'Pause video' : 'Play video'}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
            )}
          </button>
        )}
        <button
          className={styles.ctrlBtn}
          onClick={toggleSound}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3Z" fill="currentColor" />
              <path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3Z" fill="currentColor" />
              <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
