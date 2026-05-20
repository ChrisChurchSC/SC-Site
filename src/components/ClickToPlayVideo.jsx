import { useRef, useState } from 'react'
import styles from './ClickToPlayVideo.module.css'

/**
 * Case study video that does NOT autoplay. Shows the first frame with a
 * play button; clicking plays the video with sound and native controls.
 */
export default function ClickToPlayVideo({ src, onError }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  const play = () => {
    const v = ref.current
    if (!v) return
    v.muted = false
    v.controls = true
    v.play?.().catch(() => {})
    setStarted(true)
  }

  return (
    <div className={styles.wrap}>
      <video
        ref={ref}
        src={src}
        playsInline
        preload="metadata"
        className={styles.video}
        onError={onError}
        onEnded={() => { setStarted(false); if (ref.current) ref.current.controls = false }}
      />
      {!started && (
        <button className={styles.playBtn} onClick={play} aria-label="Play video">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
            <path d="M0 0 20 12 0 24Z" fill="currentColor" />
          </svg>
        </button>
      )}
    </div>
  )
}
