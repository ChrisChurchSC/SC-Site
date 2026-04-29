import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import LogoWordmark from '../components/LogoWordmark'
import Loader from '../components/Loader'
import { useNav } from '../context/NavContext'

let didLoad = false

export default function Home() {
  const gi = (n) => ({ backgroundImage: `url(/grid/img-${n}.png)`, backgroundSize: 'cover', backgroundPosition: 'center' })

  const { menuOpen, setMenuOpen } = useNav()
  const [loading, setLoading] = useState(!didLoad)
  const [reelOpen, setReelOpen] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)

  const closeReel = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    setReelOpen(false)
    setPlaying(true)
    setProgress(0)
  }

  const togglePlay = () => {
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  const toggleMute = () => {
    videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  const handleScrub = (e) => {
    const val = Number(e.target.value)
    if (videoRef.current?.duration) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration
    }
    setProgress(val)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (v?.duration) setProgress((v.currentTime / v.duration) * 100)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeReel() }
    if (reelOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reelOpen])

  useEffect(() => {
    document.body.classList.toggle('reel-open', reelOpen)
    return () => document.body.classList.remove('reel-open')
  }, [reelOpen])


  return (
    <>
    {loading && <Loader onDone={() => { didLoad = true; setLoading(false) }} />}
    <main className={styles.main}>

      {/* Intro card */}
      <section className={`${styles.row12} ${styles.introRow}`}>
        <div className={styles.cornerNote} style={{ gridColumn: '1 / span 12' }}>
          <div className={styles.cornerWordmark}>
            <LogoWordmark fill="rgba(255,255,255,0.55)" />
          </div>
          <p className={styles.cornerText}>The makers of high quality<br />brands and content</p>
        </div>
        <button
          className={styles.menuCard}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen : ''}`} />
          <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen : ''}`} />
        </button>
      </section>

      {/* Row 1 — Hero */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r169} ${styles.heroBlock}`} style={{ gridColumn: '1 / span 9', cursor: 'pointer', backgroundImage: 'url(/reel-preview.gif)', backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => setReelOpen(true)}>
          <span className={styles.label}>Brand · Content · Web</span>
          <span className={styles.csTag}>Reel</span>
          <button className={styles.playBtn}>
            <svg width="7" height="8" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <NavLink to="/work/world-within" className={`${styles.block} ${styles.r45} ${styles.blockLink} ${styles.wwCard}`} style={{ gridColumn: '10 / span 3' }}>
          <span className={styles.label}>002</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>World Within</p>
        </NavLink>
      </section>

      {/* Row 2 — 3 blocks, shifted right, gap at left + right */}
      <section className={styles.row12}>
        <NavLink to="/work/oxyle" className={`${styles.block} ${styles.r45} ${styles.blockLink}`} style={{ gridColumn: '2 / span 3' }}>
          <video src="/grid/oxyle-hero.mp4" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>003</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>Oxyle</p>
        </NavLink>
        <NavLink to="/work/deep-dive-films" className={`${styles.block} ${styles.r45} ${styles.blockLink}`} style={{ gridColumn: '5 / span 3' }}>
          <span className={styles.label}>004</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>Deep Dive Films</p>
        </NavLink>
        <NavLink to="/work/mindmatter" className={`${styles.block} ${styles.r45} ${styles.blockLink}`} style={{ gridColumn: '9 / span 3' }}>
          <span className={styles.label}>005</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>Mindmatter</p>
        </NavLink>
      </section>

      {/* Row 3 — 4 across, full width */}
      <section className={styles.row12}>
        <NavLink to="/work/concis-labs" className={`${styles.block} ${styles.r45} ${styles.blockLink}`} style={{ gridColumn: 'span 3' }}>
          <span className={styles.label}>006</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>Concis Labs</p>
        </NavLink>
        <NavLink to="/work/big-buoy" className={`${styles.block} ${styles.r45} ${styles.blockLink}`} style={{ gridColumn: 'span 3' }}>
          <span className={styles.label}>007</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>Big Buoy</p>
        </NavLink>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: 'span 3', ...gi(29) }}>
          <span className={styles.label}>008</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: 'span 3' }}>
          <span className={styles.label}>009</span>
        </div>
      </section>

      {/* Row 4 — two 16:9, gap in middle */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '1 / span 5' }}>
          <span className={styles.label}>010</span>
        </div>
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '7 / span 5' }}>
          <span className={styles.label}>011</span>
        </div>
      </section>

      {/* Row 5 — 9:16 trio, side by side */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '1 / span 3' }}>
          <video src="/grid/smashburger.mp4" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>012</span>
        </div>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '4 / span 3' }}>
          <video src="/grid/0421.mov" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>013</span>
        </div>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '7 / span 3' }}>
          <video src="/grid/nimruz-logo.mp4" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>014</span>
        </div>
      </section>

      {/* Row 6 — 9:16 + 4:5 mix, side by side */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '1 / span 3' }}>
          <span className={styles.label}>015</span>
        </div>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '4 / span 3' }}>
          <span className={styles.label}>016</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '7 / span 3' }}>
          <span className={styles.label}>017</span>
        </div>
      </section>

      {/* Row 7 — 3 blocks, left gap */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '3 / span 3' }}>
          <span className={styles.label}>018</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '6 / span 3' }}>
          <video src="/grid/big-crispy.mp4" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>019</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '9 / span 3' }}>
          <video src="/grid/empy-01.mov" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>020</span>
        </div>
      </section>

      {/* Row 8 — wide 16:9 + tall 9:16 */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '1 / span 7' }}>
          <video src="/grid/ww-sizzle.mp4" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>021</span>
        </div>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '9 / span 3' }}>
          <span className={styles.label}>022</span>
        </div>
      </section>

      {/* Row 9 — 4 square blocks */}
      <section className={styles.row12}>
        {['023','024','025','026'].map(n => (
          <div key={n} className={`${styles.block} ${styles.r11}`} style={{ gridColumn: 'span 3' }}>
            <span className={styles.label}>{n}</span>
          </div>
        ))}
      </section>

      {/* Row 10 — 9:16 pair + 4:5 */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '1 / span 3' }}>
          <span className={styles.label}>027</span>
        </div>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: '4 / span 3', ...gi(28) }}>
          <span className={styles.label}>028</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '8 / span 4' }}>
          <span className={styles.label}>029</span>
        </div>
      </section>

      {/* Row 11 — full-width 16:9 */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '1 / span 12' }}>
          <span className={styles.label}>030</span>
        </div>
      </section>

      {reelOpen && (
        <div className={styles.reelOverlay} onClick={closeReel}>
          <button className={styles.reelClose} onClick={closeReel}>Close</button>
          <video
            ref={videoRef}
            src="/reel.mp4"
            autoPlay
            playsInline
            className={styles.reelVideo}
            onClick={e => e.stopPropagation()}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setPlaying(false)}
          />
          <div className={styles.reelControls} onClick={e => e.stopPropagation()}>
            <button className={styles.reelCtrlBtn} onClick={togglePlay}>
              {playing ? (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <rect x="0" y="0" width="3" height="12" rx="1" fill="currentColor"/>
                  <rect x="7" y="0" width="3" height="12" rx="1" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M0 0L10 6L0 12V0Z" fill="currentColor"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              className={styles.reelScrub}
              min="0" max="100"
              value={progress}
              onChange={handleScrub}
              style={{ background: `linear-gradient(to right, rgba(255,255,255,0.8) ${progress}%, rgba(255,255,255,0.18) ${progress}%)` }}
            />
            <button className={styles.reelCtrlBtn} onClick={toggleMute}>
              {muted ? (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <path d="M0 4H3L7 0V12L3 8H0V4Z" fill="currentColor"/>
                  <path d="M9.5 4L13.5 8M13.5 4L9.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <path d="M0 4H3L7 0V12L3 8H0V4Z" fill="currentColor"/>
                  <path d="M9 3C10.3 4.1 11 5.5 11 7C11 8.5 10.3 9.9 9 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

    </main>

</>
  )
}
