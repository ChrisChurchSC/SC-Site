import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import v3 from './HomeV3.module.css'
import LogoWordmark from '../components/LogoWordmark'
import LazyVideo from '../components/LazyVideo'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { SITE_CONFIG_QUERY } from '../lib/queries'
import { buildDisciplines } from '../data/buildPackages'
import { growDisciplines } from '../data/growPackages'
import { featuredCaseStudies } from '../data/featuredCaseStudies'
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

/* The bar is the only navigation on this page, so it carries the site's
   actual routes rather than a shortened set. Every one of these resolves —
   see App.jsx. Careers is not a route of its own on this branch (the About
   page carries it), so it is not listed as though it were. */
/* The panel's columns are the real discipline lists off the Services page —
   imported, not retyped, so they cannot drift from what that page shows.

   WHAT THE PANEL CANNOT DO YET: the discipline NAME is the link, and the
   items under it are text. Every one of them would otherwise point at
   /services, because that is the only destination that exists — the page has
   no section ids to anchor to and there are no per-discipline pages. Thirty
   links to one URL is not depth, it is the appearance of depth. When the
   anchors or the pages exist, give each item an href and nothing else here
   changes. */
const NAV_LINKS = [
  // No page. Nothing on this site is a platform, and there is no route that
  // could honestly carry the word, so it renders unlinked rather than
  // pointing somewhere it does not describe — the same treatment the client
  // strip and the featured set give work that has no page yet.
  { label: 'Platform', href: null },
  { label: 'Services', href: '/services', panel: 'services' },
  { label: 'Case Studies', href: '/work', panel: 'work' },
  { label: 'Company', href: '/about-us', panel: 'company' },
  // No page either. The rates DO exist — they are on /services, and the
  // Build and Grow cards on this page quote them — but a nav item called
  // Pricing that lands you halfway down another page is a worse promise than
  // no link. Unlinked until it has somewhere of its own to go.
  { label: 'Pricing', href: null },
]

/* Company's panel. Every one of these is a real route — see App.jsx. */
const COMPANY_LINKS = [
  { label: 'About', href: '/about-us', note: 'Who we are, and who is on the team.' },
  { label: 'Thoughts', href: '/thoughts', note: 'Ideas, notes, and process.' },
  { label: 'Contact', href: '/contact', note: 'Start a conversation.' },
]

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
  const cal = useCalDrawer()
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  // noindex: a messaging variant to look at, not a page to be found.
  useMeta({ title: 'Super Conscious — homepage v3', path: '/v3', noindex: true })

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

  const [openMenu, setOpenMenu] = useState(null)
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

  // Escape closes the nav panel as well as the reel — a hover panel with no
  // keyboard way out is a trap for anyone who opened it by tabbing into it.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpenMenu(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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

      {/* The nav. It is the only navigation on the page — the side nav is
          gone — so it carries the routes, the booking CTA, and the panel. */}
      <section className={`${styles.row12} ${styles.introRow} ${v3.topBar}`}>
        <div
          className={v3.navShell}
          style={{ gridColumn: '1 / span 12' }}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className={`${styles.cornerNote} ${v3.barCard}`}>
            <NavLink to="/" className={styles.cornerWordmark} aria-label="Super Conscious, home">
              <LogoWordmark fill="rgba(255,255,255,0.7)" />
            </NavLink>

            <nav className={v3.navLinks} aria-label="Main">
              {NAV_LINKS.map(({ label, href, panel }) => {
                const open = panel && openMenu === panel
                const inner = (
                  <>
                    {label}
                    {panel && <span className={`${v3.chev}${open ? ' ' + v3.chevOpen : ''}`} aria-hidden="true" />}
                  </>
                )
                const shared = {
                  className: `${v3.navLink}${open ? ' ' + v3.navLinkOpen : ''}${href ? '' : ' ' + v3.navLinkFlat}`,
                  onMouseEnter: () => setOpenMenu(panel ?? null),
                  onFocus: () => setOpenMenu(panel ?? null),
                }
                return href
                  ? <NavLink key={label} to={href} {...shared} aria-expanded={panel ? open : undefined}>{inner}</NavLink>
                  : <span key={label} {...shared}>{inner}</span>
              })}
            </nav>

            <div className={v3.navActions}>
              <button className={v3.navCta} onClick={cal.open} onMouseEnter={() => setOpenMenu(null)}>Book a Discovery Call</button>
            </div>
          </div>

          {openMenu === 'services' && (
            /* Statement on the left, numbered services on the right, as in the
               reference. The promo card comes off this panel: the reference
               has no room for one, and the left column is doing that job. */
            <div className={`${v3.panel} ${v3.panelService}`}>
              <div className={v3.svcIntro}>
                <p className={v3.panelTag}>[ The Service ]</p>
                {/* The site's own descriptor for Services — the wording the
                    nav card uses on / and /v2. Not a new claim written for a
                    menu. */}
                <p className={v3.svcStatement}>Build the brand, then grow it.</p>
                <NavLink to="/contact" className={v3.svcIntroCta}>Talk to us →</NavLink>
              </div>

              <div className={v3.svcGrid}>
                {[...buildDisciplines, ...growDisciplines].map(({ tag, name }, i) => (
                  /* Every row lands on /services — there are no per-discipline
                     pages and the page has no anchors. Six rows to one
                     destination is repetitive; thirty would have been a lie
                     about depth, which is why the sub-items are gone. */
                  <NavLink key={name} to="/services" className={v3.svcRow}>
                    <span className={v3.svcNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={v3.svcBody}>
                      <span className={v3.svcName}>{name}</span>
                      {/* The discipline's own one-liner, off the Services page. */}
                      <span className={v3.svcNote}>{tag}</span>
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {openMenu === 'company' && (
            <div className={v3.panel}>
              <div className={v3.panelWork}>
                {COMPANY_LINKS.map(({ label, href, note }) => (
                  <NavLink key={label} to={href} className={v3.workItem}>
                    <span className={v3.workName}>{label}</span>
                    <span className={v3.workType}>{note}</span>
                  </NavLink>
                ))}
              </div>
              <NavLink to="/contact" className={v3.panelPromo}>
                <span className={v3.panelPromoTag}>Talk to us</span>
                <span className={v3.panelPromoName}>Start a project</span>
                <span className={v3.panelPromoCta}>Get in touch →</span>
              </NavLink>
            </div>
          )}

          {openMenu === 'work' && (
            <div className={v3.panel}>
              <div className={v3.panelWork}>
                {featuredCaseStudies.map(({ slug, name, type, href }) => (
                  href
                    ? <NavLink key={slug} to={href} className={v3.workItem}>
                        <span className={v3.workName}>{name}</span>
                        <span className={v3.workType}>{type}</span>
                      </NavLink>
                    /* Unlinked where there is no page — the same treatment the
                       wall, the client strip and the featured set already give
                       these. Shown, not pretended to be reachable. */
                    : <span key={slug} className={`${v3.workItem} ${v3.workItemFlat}`}>
                        <span className={v3.workName}>{name}</span>
                        <span className={v3.workType}>{type}</span>
                      </span>
                ))}
              </div>
              <NavLink to="/work" className={v3.panelPromo}>
                <span className={v3.panelPromoTag}>Everything</span>
                <span className={v3.panelPromoName}>All work</span>
                <span className={v3.panelPromoCta}>View the wall →</span>
              </NavLink>
            </div>
          )}
        </div>
      </section>

      {/* 1 — The canvas leads on the claim, not the reel */}
      <StatementCard eyebrow={HERO_EYEBROW} statement={HERO} support={null} as="h1" tall center />

      {/* 2 — Who we have done it for */}
      {/* A card bar, like the wordmark at the top of the page: same ground,
          same radius, same inset — see .barInset. No label; a row of client
          names does not need to be told what it is. */}
      <div className={v3.barInset}><ClientStrip outlined /></div>

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
