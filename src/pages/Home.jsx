import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import LogoWordmark from '../components/LogoWordmark'
import Loader from '../components/Loader'
import { useNav } from '../context/NavContext'
import { useSanity } from '../hooks/useSanity'
import { HOMEPAGE_GRID_QUERY } from '../lib/queries'

let didLoad = false

export default function Home() {
  const { menuOpen, setMenuOpen } = useNav()
  const { data: gridData } = useSanity(HOMEPAGE_GRID_QUERY)

  // Build a lookup map: label -> block data
  const grid = {}
  gridData?.blocks?.forEach(b => { grid[b.label] = b })

  // Prefix local paths with Vite base URL (needed for GitHub Pages /SC-Site/ subpath)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

  // Helper: render media for a block
  const blockMedia = (label, style = {}) => {
    const b = grid[label]
    if (!b) return null
    if (b.mediaType === 'video' && b.videoUrl) return (
      <video src={assetUrl(b.videoUrl)} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
    )
    if (b.mediaType === 'image' && b.imageUrl) return (
      <img src={assetUrl(b.imageUrl)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
    )
    return null
  }

  // Helper: wrap block in NavLink if it has a project
  const blockLink = (label, className, style, children) => {
    const b = grid[label]
    if (b?.projectSlug) return (
      <NavLink to={`/work/${b.projectSlug}`} className={className} style={style}>{children}</NavLink>
    )
    return <div className={className} style={style}>{children}</div>
  }
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
        <div className={`${styles.block} ${styles.r169} ${styles.heroBlock}`} style={{ gridColumn: '1 / span 9', cursor: 'pointer', backgroundImage: `url(${assetUrl('/reel-preview.gif')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => setReelOpen(true)}>
          <span className={styles.label}>Brand · Content · Web</span>
          <span className={styles.csTag}>Reel</span>
          <button className={styles.playBtn}>
            <svg width="7" height="8" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        {blockLink('002', `${styles.block} ${styles.r45} ${styles.blockLink} ${styles.wwCard}`, { gridColumn: '10 / span 3' }, <>
          <span className={styles.label}>002</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{grid['002']?.projectName || 'World Within'}</p>
        </>)}
      </section>

      {/* Row 2 */}
      <section className={styles.row12}>
        {blockLink('003', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '2 / span 3' }, <>
          {blockMedia('003')}
          <span className={styles.label}>003</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{grid['003']?.projectName || 'Oxyle'}</p>
        </>)}
        {blockLink('004', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '5 / span 3' }, <>
          {blockMedia('004')}
          <span className={styles.label}>004</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{grid['004']?.projectName || 'Deep Dive Films'}</p>
        </>)}
        {blockLink('005', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '9 / span 3' }, <>
          {blockMedia('005')}
          <span className={styles.label}>005</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{grid['005']?.projectName || 'Mindmatter'}</p>
        </>)}
      </section>

      {/* Row 3 */}
      <section className={styles.row12}>
        {blockLink('006', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('006')}
          <span className={styles.label}>006</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{grid['006']?.projectName || 'Concis Labs'}</p>
        </>)}
        {blockLink('007', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('007')}
          <span className={styles.label}>007</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{grid['007']?.projectName || 'Big Buoy'}</p>
        </>)}
        {blockLink('008', `${styles.block} ${styles.r45}`, { gridColumn: 'span 3' }, <>
          {blockMedia('008')}
          <span className={styles.label}>008</span>
        </>)}
        {blockLink('009', `${styles.block} ${styles.r45}`, { gridColumn: 'span 3' }, <>
          {blockMedia('009')}
          <span className={styles.label}>009</span>
        </>)}
      </section>

      {/* Row 4 */}
      <section className={styles.row12}>
        {blockLink('010', `${styles.block} ${styles.r169}`, { gridColumn: '1 / span 5' }, <>
          {blockMedia('010')}
          <span className={styles.label}>010</span>
        </>)}
        {blockLink('011', `${styles.block} ${styles.r169}`, { gridColumn: '7 / span 5' }, <>
          {blockMedia('011')}
          <span className={styles.label}>011</span>
        </>)}
      </section>

      {/* Row 5 */}
      <section className={styles.row12}>
        {blockLink('012', `${styles.block} ${styles.r916}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('012')}
          <span className={styles.label}>012</span>
        </>)}
        {blockLink('013', `${styles.block} ${styles.r916}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('013')}
          <span className={styles.label}>013</span>
        </>)}
        {blockLink('014', `${styles.block} ${styles.r916}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('014')}
          <span className={styles.label}>014</span>
        </>)}
      </section>

      {/* Row 6 */}
      <section className={styles.row12}>
        {blockLink('015', `${styles.block} ${styles.r45}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('015')}
          <span className={styles.label}>015</span>
        </>)}
        {blockLink('016', `${styles.block} ${styles.r916}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('016')}
          <span className={styles.label}>016</span>
        </>)}
        {blockLink('017', `${styles.block} ${styles.r45}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('017')}
          <span className={styles.label}>017</span>
        </>)}
      </section>

      {/* Row 7 */}
      <section className={styles.row12}>
        {blockLink('018', `${styles.block} ${styles.r45}`, { gridColumn: '3 / span 3' }, <>
          {blockMedia('018')}
          <span className={styles.label}>018</span>
        </>)}
        {blockLink('019', `${styles.block} ${styles.r45}`, { gridColumn: '6 / span 3' }, <>
          {blockMedia('019')}
          <span className={styles.label}>019</span>
        </>)}
        {blockLink('020', `${styles.block} ${styles.r45}`, { gridColumn: '9 / span 3' }, <>
          {blockMedia('020')}
          <span className={styles.label}>020</span>
        </>)}
      </section>

      {/* Row 8 */}
      <section className={styles.row12}>
        {blockLink('021', `${styles.block} ${styles.r169}`, { gridColumn: '1 / span 7' }, <>
          {blockMedia('021')}
          <span className={styles.label}>021</span>
        </>)}
        {blockLink('022', `${styles.block} ${styles.r916}`, { gridColumn: '9 / span 3' }, <>
          {blockMedia('022')}
          <span className={styles.label}>022</span>
        </>)}
      </section>

      {/* Row 9 */}
      <section className={styles.row12}>
        {['023','024','025','026'].map(n => (
          blockLink(n, `${styles.block} ${styles.r11}`, { gridColumn: 'span 3' }, <>
            {blockMedia(n)}
            <span className={styles.label}>{n}</span>
          </>)
        ))}
      </section>

      {/* Row 10 */}
      <section className={styles.row12}>
        {blockLink('027', `${styles.block} ${styles.r916}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('027')}
          <span className={styles.label}>027</span>
        </>)}
        {blockLink('028', `${styles.block} ${styles.r916}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('028')}
          <span className={styles.label}>028</span>
        </>)}
        {blockLink('029', `${styles.block} ${styles.r45}`, { gridColumn: '8 / span 4' }, <>
          {blockMedia('029')}
          <span className={styles.label}>029</span>
        </>)}
      </section>

      {/* Row 11 */}
      <section className={styles.row12}>
        {blockLink('030', `${styles.block} ${styles.r169}`, { gridColumn: '1 / span 12' }, <>
          {blockMedia('030')}
          <span className={styles.label}>030</span>
        </>)}
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
