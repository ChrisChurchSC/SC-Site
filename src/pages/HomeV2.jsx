import { useState, useEffect, useRef } from 'react'
import styles from './Home.module.css'
import LogoWordmark from '../components/LogoWordmark'
import { useNav } from '../context/NavContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { SITE_CONFIG_QUERY } from '../lib/queries'
import ClientStrip from '../components/ClientStrip'
import TestimonialStrip from '../components/TestimonialStrip'
import ContactCTA from '../components/ContactCTA'
import StatementCard from '../components/StatementCard'
import BuildGrowCards from '../components/BuildGrowCards'
import AudienceCards from '../components/AudienceCards'
import FeaturedCaseStudies from '../components/FeaturedCaseStudies'

/**
 * The homepage with the design canvas's MESSAGING — its words, in its order.
 *
 * Nothing about the page's design changes. Same grid, same cards, same client
 * strip, same reel, same testimonial marquee, same featured work, same
 * contact block, and the site's own nav rather than a bar of its own. It
 * imports Home.module.css rather than a stylesheet of its own, because there
 * is nothing here to style that the homepage does not already style.
 *
 * What actually differs from / is three things:
 *
 *   1. The order. The canvas leads on words instead of the reel, and the reel
 *      moves down to sit after the offer — so the page says what it is before
 *      it shows what it made.
 *   2. The words. The statement, the two card bodies, and the closing line
 *      are the canvas's. They are passed in as props; the components keep the
 *      live homepage's copy as their defaults, so / is untouched.
 *   3. One new section — Who we work with — which the live page has no
 *      equivalent of. See AudienceCards.
 *
 * Promoting this is a one-line change: point path="/" at HomeV2.
 */

let didLoad = false

const REEL_VIDEO_URL = 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'

/* ── The canvas's copy ─────────────────────────────────────────────────── */

/* The hero. Carries the h1, which is why the statement below it is an h2 —
   the live homepage has that the other way round because it has no headline
   above the statement. */
const HERO_EYEBROW = '[ Creative + Marketing, One Embedded Team ]'
const HERO = "We're Super-Conscious. We build and grow brands."

const WHO_WE_ARE = 'We are creatives who also do marketing.'
const WHO_WE_ARE_SUPPORT = [
  "Super-Conscious is your outsourced creative and marketing department. One embedded team handles both brand creation and growth media, so you're not stitching together a branding studio, a media shop, and whoever built your last campaign.",
  "You'll know your team, and you'll have access to them. No pooled or anonymous labor, no rotating bench — the same people, every time.",
  "Our thinking doesn't sit in a deck, either. Strategy goes straight into brand, creative, and paid media — then we test it against the data and adjust. And while AI helps us move faster, it doesn't do the thinking: every idea, every asset, is 100% ours.",
]

/* Build and Grow, with the canvas's price lines added. "From $4,500/mo ·
   Hourly retainer" is kept exactly as written although it names two billing
   models in one line: which of them is true is a pricing decision, not a typo
   to quietly correct here. Media is the live homepage's, unchanged. */
const OFFER = [
  {
    id: 'build',
    name: 'Build',
    body: 'We make your brand and its assets, from scratch or refreshed from what you have: brand strategy, identity, voice, messaging, website, app.',
    price: 'From $10,000 · Project-based',
    cta: 'How we build',
    href: '/services',
    media: '/build-card-compressed.mp4',
  },
  {
    id: 'grow',
    name: 'Grow',
    body: 'We take that brand to market and run it: campaigns, paid media, organic content, and an embedded marketing team, measured and optimized every month.',
    price: 'From $4,500/mo · Hourly retainer',
    cta: 'How we grow',
    href: '/services',
    media: '/grow-card.gif',
  },
]

const OFFER_FOOTNOTE = 'Most clients do both — but you can start wherever you are.'

const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

export default function HomeV2() {
  const { menuOpen, setMenuOpen } = useNav()
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  // noindex: a messaging variant to look at, not a page to be found.
  useMeta({ title: 'Super Conscious — homepage messaging v2', path: '/v2', noindex: true })

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

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
    <main className={styles.main}>

      {/* Intro card — unchanged from the live homepage */}
      <section className={`${styles.row12} ${styles.introRow}`}>
        <div className={styles.cornerNote} style={{ gridColumn: '1 / span 12' }}>
          <div className={styles.cornerWordmark}>
            <LogoWordmark fill="rgba(255,255,255,0.55)" />
          </div>
          <div className={styles.cornerTextStack}>
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

      {/* 1 — The canvas leads on the claim, not the reel */}
      <StatementCard eyebrow={HERO_EYEBROW} statement={HERO} support={null} as="h1" tall />

      {/* 2 — Who we have done it for */}
      <ClientStrip />

      {/* 3 — Who we are, in full */}
      <StatementCard
        eyebrow="[ Who We Are ]"
        statement={WHO_WE_ARE}
        support={WHO_WE_ARE_SUPPORT}
        as="h2"
      />

      {/* 4 — The offer, in two halves, now with the price lines */}
      <BuildGrowCards cards={OFFER} footnote={OFFER_FOOTNOTE} />

      {/* 5 — Who it is for. The one section the live page has no version of */}
      <AudienceCards />

      {/* 6 — The reel, demoted from hero: the page says it, then shows it */}
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

      {/* 7 — Proof, then 8 — the work it is about */}
      <TestimonialStrip />
      <FeaturedCaseStudies />

      {/* 9 — The ask */}
      <ContactCTA sub={CLOSING} />

      {reelOpen && (
        <div className={styles.reelOverlay} onClick={closeReel}>
          <button className={styles.reelClose} onClick={closeReel}>Close</button>
          <video
            ref={videoRef}
            src={siteConfig?.reelVideoUrl ?? REEL_VIDEO_URL}
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
  )
}
