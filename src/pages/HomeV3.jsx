import { useState, useEffect, useRef } from 'react'
import styles from './Home.module.css'
import v3 from './HomeV3.module.css'
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
 * Homepage v3 — a third direction, alongside / and /v2.
 *
 * IT STARTS AS AN EXACT COPY OF /v2, deliberately. A variant that begins from
 * a blank page cannot be compared with the one it is meant to be an
 * alternative to; starting from where v2 landed means every difference from
 * here is a decision rather than an accident of what got rebuilt.
 *
 * It has its OWN stylesheet — HomeV3.module.css, also a copy — so the two can
 * diverge without either one moving the other. The shared components they
 * both render (StatementCard, ClientStrip, BuildGrowCards, AudienceCards,
 * TestimonialStrip, FeaturedCaseStudies, ContactCTA) take their copy and
 * their variants as props, so v3 changes what it passes rather than what
 * they contain — which is what keeps / and /v2 untouched as this moves.
 *
 * noindex, and absent from the sitemap.
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

/**
 * A section and the label that names it. Every passage on this page carries
 * one, so the page can be read by its labels alone.
 *
 * StatementCard and AudienceCards render their own eyebrow — they already
 * had one — so they are NOT wrapped in this; wrapping them would print two.
 */
function Labelled({ label, children }) {
  return (
    <div className={v3.labelled}>
      <p className={v3.eyebrow}>{label}</p>
      {children}
    </div>
  )
}

export default function HomeV3() {
  const { menuOpen, setMenuOpen } = useNav()
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  // noindex: a messaging variant to look at, not a page to be found.
  useMeta({ title: 'Super Conscious — homepage v3', path: '/v3', noindex: true })

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
    <main className={`${styles.main} ${v3.stack}`}>

      {/* Intro card — unchanged from the live homepage */}
      <section className={`${styles.row12} ${styles.introRow} ${v3.topBar}`}>
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
      <StatementCard eyebrow={HERO_EYEBROW} statement={HERO} support={null} as="h1" tall center />

      {/* 2 — Who we have done it for */}
      {/* A card bar, like the wordmark at the top of the page: same ground,
          same radius, same inset — see .barInset. No label; a row of client
          names does not need to be told what it is. */}
      <div className={v3.barInset}><ClientStrip /></div>

      {/* 3 — The offer, in two halves, with the price lines */}
      <Labelled label="[ How We Work ]"><BuildGrowCards cards={OFFER} footnote={OFFER_FOOTNOTE} /></Labelled>

      {/* 4 — Who we are, in full, behind the offer it explains */}
      <StatementCard
        eyebrow="[ Who We Are ]"
        statement={WHO_WE_ARE}
        support={WHO_WE_ARE_SUPPORT}
        as="h2"
        serif
        bare
      />

      {/* 5 — Who it is for. The one section the live page has no version of */}
      <AudienceCards />

      {/* 6 — The reel, demoted from hero: the page says it, then shows it */}
      <Labelled label="[ Reel ]">
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
          {/* The block's own "Showreel" caption is dropped here: the section
              carries a [ Reel ] label now, and naming it twice — once in the
              page's label column and once inside the frame — reads as an
              oversight. The live homepage keeps its caption, because there
              the reel is the hero and has no label above it. */}
          <button className={styles.playBtn} aria-label="Play showreel with sound">
            <svg width="8" height="9" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="currentColor"/>
            </svg>
            <span>Watch with sound</span>
          </button>
        </div>
      </section>
      </Labelled>

      {/* 7 — Proof, then 8 — the work it is about */}
      <Labelled label="[ Proof ]"><TestimonialStrip /></Labelled>
      <Labelled label="[ Featured Work ]"><FeaturedCaseStudies /></Labelled>

      {/* 9 — The ask */}
      <Labelled label="[ Get In Touch ]"><ContactCTA sub={CLOSING} /></Labelled>

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
