import { useEffect, useRef, useState } from 'react'
import styles from './CaseStudyVideo.module.css'
import { REAL_AUDIO_VIDEOS } from '../data/videoAudio'

/**
 * Case study video: autoplays muted and loops, lazy-loads when near the
 * viewport, and pauses when offscreen. Corner controls let the viewer
 * unmute for sound and — for clips longer than 10s — pause/play.
 */
export default function CaseStudyVideo({ src, onError, rootMargin = '300px', controlsAlign = 'right' }) {
  const ref = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false) // explicit viewer intent
  const [playing, setPlaying] = useState(true)
  const [duration, setDuration] = useState(0)
  // The build-time manifest (scripts/gen-video-audio.mjs) is authoritative for
  // bundled /cs/ videos: it lists only clips whose audio is actually audible, so
  // a silent AAC track no longer shows a mute button. Other sources (e.g. Sanity)
  // fall back to live client-side track detection below.
  const manifestKnows = typeof src === 'string' && src.startsWith('/cs/')
  const [hasAudio, setHasAudio] = useState(manifestKnows ? REAL_AUDIO_VIDEOS.has(src) : false)
  const audioChecked = useRef(manifestKnows) // manifest answer is final; skip client probing

  const markAudio = (has) => {
    if (audioChecked.current) return
    audioChecked.current = true
    setHasAudio(has)
  }

  // Detect whether the clip actually carries an audio track, across engines:
  // Gecko exposes mozHasAudio, WebKit/Safari expose audioTracks, and Blink
  // exposes a decoded-byte counter that only grows once audio decodes (resolved
  // during playback in onTimeUpdate). If none exist, leave the button hidden.
  const onLoadedMetadata = (e) => {
    const v = e.target
    setDuration(v.duration || 0)
    if (typeof v.mozHasAudio === 'boolean') return markAudio(v.mozHasAudio)
    if (v.audioTracks && typeof v.audioTracks.length === 'number') return markAudio(v.audioTracks.length > 0)
  }

  const onTimeUpdate = (e) => {
    if (audioChecked.current) return
    const v = e.target
    if (typeof v.webkitAudioDecodedByteCount === 'number') {
      if (v.webkitAudioDecodedByteCount > 0) markAudio(true)
      else if (v.currentTime > 0.7) markAudio(false) // played long enough with no audio decoded
    }
  }

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
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {(showPlayPause || hasAudio) && (
      <div className={`${styles.controls}${controlsAlign === 'left' ? ` ${styles.controlsLeft}` : ''}`}>
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
        {hasAudio && (
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
        )}
      </div>
      )}
    </div>
  )
}
