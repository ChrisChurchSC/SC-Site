import { useState, useEffect, useRef } from 'react'
import styles from './Home.module.css'
import LogoWordmark from '../components/LogoWordmark'
import Loader from '../components/Loader'
import { useNav } from '../context/NavContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { SITE_CONFIG_QUERY } from '../lib/queries'
import ClientStrip from '../components/ClientStrip'
import StatementCard from '../components/StatementCard'
import BuildGrowCards from '../components/BuildGrowCards'
import FeaturedCaseStudies from '../components/FeaturedCaseStudies'

let didLoad = false

const REEL_VIDEO_URL = 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://super-conscious.studio/#organization',
      name: 'Super Conscious',
      url: 'https://super-conscious.studio',
      logo: 'https://super-conscious.studio/favicon-dark.png',
      sameAs: [
        'https://www.instagram.com/_super_conscious/',
        'https://www.linkedin.com/company/super-conscious/',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Philadelphia',
        addressRegion: 'PA',
        addressCountry: 'US',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://super-conscious.studio/#website',
      url: 'https://super-conscious.studio',
      name: 'Super Conscious',
      publisher: { '@id': 'https://super-conscious.studio/#organization' },
    },
  ],
}

export default function Home() {
  const { menuOpen, setMenuOpen } = useNav()
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  useMeta({ title: 'Creative Studio for Brand, Content & Digital Products | Super Conscious', path: '/', schema: HOME_SCHEMA })

  // Prefix local paths with Vite base URL (needed for GitHub Pages /SC-Site/ subpath)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

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
        <div className={`${styles.introCard} ${styles.logoCard}`} style={{ gridColumn: '1 / span 4' }}>
          <div className={styles.cornerWordmark}>
            <LogoWordmark fill="rgba(255,255,255,0.55)" />
          </div>
        </div>
        <div className={`${styles.introCard} ${styles.descriptorCard}`} style={{ gridColumn: '5 / span 8' }}>
          <div className={styles.cornerTextStack}>
            {/* The page headline, and now marked up as one. This text was
                already here as a <p>, so the homepage shipped with no <h1> at
                all. The tag change is style-neutral — .cornerText is selected
                by class, never by element. */}
            <h1 className={styles.cornerText}>{siteConfig?.homeHeroTitle ?? 'For challenger brands — new, pivoting, or fighting to stand out —\nSuper-Conscious is the embedded creative and marketing team that builds your brand and then grows it.'}</h1>
            {siteConfig?.homeHeroTagline && <p className={styles.cornerSub}>{siteConfig.homeHeroTagline}</p>}
          </div>
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
        <div className={`${styles.block} ${styles.r169} ${styles.heroBlock}`} style={{ gridColumn: '1 / span 12', cursor: 'pointer' }} onClick={() => setReelOpen(true)}>
          <video
            className={styles.heroReel}
            src={siteConfig?.reelVideoUrl ?? REEL_VIDEO_URL}
            poster={assetUrl('/reel-preview.gif')}
            autoPlay
            muted
            loop
            playsInline
          />
          <span className={styles.label}>Showreel</span>
          <button className={styles.playBtn} aria-label="Play showreel with sound">
            <svg width="8" height="9" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="currentColor"/>
            </svg>
            <span>Watch with sound</span>
          </button>
        </div>
      </section>

      {/* Client strip — sits under the reel, above the wall */}
      <ClientStrip />

      {/* What we are, at size — the hinge into Build and Grow */}
      <StatementCard />

      {/* Build / Grow two-up — the offer, before the work that proves it */}
      <BuildGrowCards />

      {/* Featured case studies — four, with their numbers */}
      <FeaturedCaseStudies />


      {reelOpen && (
        <div className={styles.reelOverlay} onClick={closeReel}>
          <button className={styles.reelClose} onClick={closeReel}>Close</button>
          <video
            ref={videoRef}
            src={siteConfig?.reelVideoUrl ?? 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'}
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
