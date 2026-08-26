import { useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton } from './primitives'

/* Media — the components that hold pictures and time.
 *
 * Each one exists because the naive version is worse in a specific way: a
 * carousel with no position makes people click twice to find out they have
 * seen it all, a gallery with no thumbnails makes them click every one, and a
 * before/after with a fixed split is a picture of a comparison rather than a
 * comparison.
 */

export function Carousel({ slides }) {
  const [i, setI] = useState(0)
  const last = slides.length - 1

  return (
    <div className={s.carousel}>
      <div className={s.carouselWindow}>
        <div
          className={s.carouselTrack}
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {slides.map((s) => (
            <div key={s} className={s.slide}>
              <span className={s.slideNum}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={s.carouselControls}>
        <div className={s.dots}>
          {slides.map((s, n) => (
            <button
              key={s}
              type="button"
              className={`${s.xDot} ${n === i ? s.dotOn : ''}`}
              onClick={() => setI(n)}
              aria-label={`Go to slide ${n + 1}`}
            />
          ))}
        </div>
        <div className={s.arrows}>
          <button
            type="button"
            className={s.arrow}
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            className={s.arrow}
            onClick={() => setI((n) => Math.min(last, n + 1))}
            disabled={i === last}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export function Gallery({ items }) {
  const [on, setOn] = useState(0)
  return (
    <div className={s.gallery}>
      <span className={s.galleryMain}>
        <span className={s.galleryNum}>{on + 1}</span>
      </span>
      <div className={s.galleryThumbs}>
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={`${s.galleryThumb} ${n === on ? s.galleryThumbOn : ''}`}
            onClick={() => setOn(n)}
            aria-label={`Image ${n + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* Range input rather than a drag handler: it is keyboard-operable for free
   and cannot get stuck mid-drag when the pointer leaves the element. */
export function BeforeAfter({ labels = ['Before', 'After'] }) {
  const [pos, setPos] = useState(50)
  return (
    <div className={s.baWrap}>
      <div className={s.ba}>
        <span className={s.baAfter}><span className={s.baTag}>After</span></span>
        <span className={s.baBefore} style={{ width: `${pos}%` }}>
          <span className={s.baTag}>Before</span>
        </span>
        <span className={s.baLine} style={{ left: `${pos}%` }} />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={s.baRange}
        aria-label="Reveal"
      />
    </div>
  )
}

export function VideoControls({ duration = 154, title }) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [pos, setPos] = useState(28)

  return (
    <div className={s.videoWrap}>
      <div className={s.videoBar}>
        <button
          type="button"
          className={s.videoBtn}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❙❙' : '▶'}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className={s.videoScrub}
          aria-label="Scrub"
        />
        <span className={s.videoTime}>0:{String(Math.round(pos * 0.6)).padStart(2, '0')}</span>
        <button
          type="button"
          className={s.videoBtn}
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  )
}

/* ── Feedback patterns (NEW) ─────────────────────────────────────────────── */

export function ProgressBar({ value, onChange, label = 'Upload' }) {
  const [pct, setPct] = useState(38)
  return (
    <div className={s.progressWrap}>
      <div className={s.progressTrack}>
        <div className={s.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={s.progressMeta}>
        <span className={s.progressPct}>{pct}%</span>
        <div className={s.arrows}>
          <button type="button" className={s.arrow} onClick={() => setPct((p) => Math.max(0, p - 12))}>−</button>
          <button type="button" className={s.arrow} onClick={() => setPct((p) => Math.min(100, p + 12))}>+</button>
        </div>
      </div>
    </div>
  )
}
