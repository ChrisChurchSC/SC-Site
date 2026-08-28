import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './HomeV2.module.css'
import LazyVideo from '../components/LazyVideo'
import ContactCTA from '../components/ContactCTA'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { SITE_CONFIG_QUERY } from '../lib/queries'
import { clientLogos } from '../data/clientLogos'
import { featuredCaseStudies } from '../data/featuredCaseStudies'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * The homepage, restructured to the copy order in the "Super-Conscious
 * Homepage" design canvas: a copy-led hero, then clients, then who we are,
 * then the offer, then who it is for, then the reel, then proof, then work,
 * then the ask.
 *
 * This is a SECOND homepage at /v2, not a replacement. The live one at / is
 * untouched, so the two can be compared side by side before either wins.
 * Promoting this one is a one-line change in App.jsx.
 *
 * WHY THIS DOES NOT REUSE StatementCard, ClientStrip, BuildGrowCards,
 * TestimonialStrip AND FeaturedCaseStudies. Those five carry the copy the
 * live homepage ships, and this version was asked to carry the canvas's copy
 * verbatim instead. Editing them in place would have rewritten the live
 * homepage as a side effect of building a variant. So the sections are
 * written out here, against the same data files, and the shared components
 * are left alone. ContactCTA IS reused, because it already takes its copy as
 * props — and because the site is meant to have exactly one submission path.
 *
 * The order below is the canvas's, and the differences from the live page
 * are: the reel moves out of the hero to its own section two thirds down,
 * and "Who we work with" is new.
 */

const REEL_VIDEO_URL = 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'

/** Canvas copy, verbatim. */
const NAV = [
  { label: 'Build', href: '/services' },
  { label: 'Grow', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about-us' },
]

const WHO_WE_ARE = [
  "Super-Conscious is your outsourced creative and marketing department. One embedded team handles both brand creation and growth media, so you're not stitching together a branding studio, a media shop, and whoever built your last campaign.",
  "You'll know your team, and you'll have access to them. No pooled or anonymous labor, no rotating bench — the same people, every time.",
  "Our thinking doesn't sit in a deck, either. Strategy goes straight into brand, creative, and paid media — then we test it against the data and adjust. And while AI helps us move faster, it doesn't do the thinking: every idea, every asset, is 100% ours.",
]

/* The two halves of the offer. The price lines are the canvas's own; see the
   note in the page report about "FROM $4,500/MO · HOURLY RETAINER" naming two
   different billing models in one line. Left verbatim rather than quietly
   corrected, because which one is true is a pricing decision, not a typo. */
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

const AUDIENCES = [
  {
    id: 'new',
    name: 'New',
    body: 'A brand that needs to be defined from scratch: identity, visual system, voice.',
    cta: 'See work for new brands',
  },
  {
    id: 'pivoting',
    name: 'Pivoting',
    body: 'An existing brand reworking what it has — a facelift, or a full-scale overhaul to retain and amplify relevancy.',
    cta: 'See work for pivots',
  },
  {
    id: 'underdog',
    name: 'Underdog',
    body: 'A brand in a crowded category that needs to stand out.',
    cta: 'See work for underdogs',
  },
]

/* THE ATTRIBUTIONS ARE NOT READY, AND THAT IS HANDLED THE WAY THE REST OF THE
   SITE ALREADY HANDLES IT. All three quotes came off the canvas attributed to
   "[CLIENT NAME]". TestimonialStrip established the rule for this: a
   bracketed name renders on the dev server so the byline can be reviewed with
   something in it, and is dropped from any build, because an unattributed
   quote is weak proof but a fabricated attribution is not proof at all.
   import.meta.env.DEV is false in every build, so this cannot ship by being
   forgotten. Fill in `person` and it renders for real. */
const PROOF = [
  {
    quote: "They've been our invisible production team for three years. They ship to our standards, communicate like part of the team, and never once tried to go around us to the client.",
    person: '[CLIENT NAME]',
  },
  {
    quote: 'Super-Conscious built the brand, then stayed and built the product. Years in, they still feel like our team.',
    person: '[CLIENT NAME]',
  },
  {
    quote: "They've become an extension of our marketing team. The content keeps shipping, the campaigns keep working, and the numbers keep moving.",
    person: '[CLIENT NAME]',
  },
]

const isPlaceholder = (s) => !s || /\[|\]/.test(s)
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src)

function Eyebrow({ children }) {
  return <p className={styles.eyebrow}>{children}</p>
}

/** The hero's concentric arcs. Decorative, so it is hidden from the tree. */
function HeroMark() {
  return (
    <svg className={styles.heroMark} viewBox="0 0 320 320" fill="none" aria-hidden="true">
      <line x1="160" y1="0" x2="160" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="160" cy="160" r="148" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="160" cy="160" r="112" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <path d="M160 12 A148 148 0 0 1 308 160" stroke="var(--v2-accent)" strokeWidth="1.5" opacity="0.9" />
      <path d="M48 160 A112 112 0 0 0 160 272" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="160" cy="160" r="3" fill="var(--v2-accent)" />
    </svg>
  )
}

export default function HomeV2() {
  const cal = useCalDrawer()
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  // noindex: this is a variant for comparison, not a page to be found.
  useMeta({ title: 'Super Conscious — homepage v2', path: '/v2', noindex: true })

  const [index, setIndex] = useState(featuredCaseStudies.length - 1) // Wonderwerk leads, as on the canvas
  const study = featuredCaseStudies[index]
  const step = (n) => setIndex((i) => (i + n + featuredCaseStudies.length) % featuredCaseStudies.length)

  return (
    <main className={styles.main}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className={styles.bar}>
        <NavLink to="/" className={styles.wordmark}>Super~Conscious</NavLink>
        <nav className={styles.barNav}>
          {NAV.map(({ label, href }) => (
            <NavLink key={label} to={href} className={styles.barLink}>{label}</NavLink>
          ))}
        </nav>
        <button className={styles.barCta} onClick={cal.open}>Book a Discovery Call</button>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Eyebrow>Creative + marketing, one embedded team</Eyebrow>
          <h1 className={styles.heroHeading}>We're Super-Conscious.<br />We build and grow brands.</h1>
          <div className={styles.heroActions}>
            <button className={styles.solidBtn} onClick={cal.open}>Book a Discovery Call →</button>
            <NavLink to="/work" className={styles.textLink}>See our work</NavLink>
          </div>
        </div>
        <HeroMark />
      </section>

      {/* ── Select clients ──────────────────────────────────────── */}
      <section className={styles.section}>
        <Eyebrow>Select clients</Eyebrow>
        <ul className={styles.clients}>
          {clientLogos
            .filter((c) => !c.slug || !HIDDEN_SLUGS.has(c.slug))
            .map(({ name }) => <li key={name} className={styles.client}>{name}</li>)}
        </ul>
      </section>

      {/* ── Who we are ──────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.split}`}>
        <Eyebrow>Who we are</Eyebrow>
        <div className={styles.splitBody}>
          <h2 className={styles.sectionHeading}>We are creatives who also do marketing.</h2>
          {WHO_WE_ARE.map((p) => <p key={p.slice(0, 24)} className={styles.prose}>{p}</p>)}
        </div>
      </section>

      {/* ── How we work ─────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.split}`}>
        <Eyebrow>How we work</Eyebrow>
        <div className={styles.splitBody}>
          <div className={styles.offer}>
            {OFFER.map(({ id, name, body, price, cta, href, media }) => (
              <NavLink key={id} to={href} className={styles.offerCard}>
                {isVideo(media)
                  ? <span className={styles.mediaLayer} aria-hidden="true"><LazyVideo src={media} className={styles.mediaVideo} /></span>
                  : <span className={styles.media} style={{ backgroundImage: `url(${media})` }} aria-hidden="true" />}
                <h3 className={styles.offerName}>{name}</h3>
                <p className={styles.offerBody}>{body}</p>
                <p className={styles.offerPrice}>{price}</p>
                <span className={styles.cardCta}>{cta} →</span>
              </NavLink>
            ))}
          </div>
          <p className={styles.footnote}>Most clients do both — but you can start wherever you are.</p>
        </div>
      </section>

      {/* ── Who we work with ────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.split}`}>
        <Eyebrow>Who we work with</Eyebrow>
        <div className={`${styles.splitBody} ${styles.audiences}`}>
          {AUDIENCES.map(({ id, name, body, cta }) => (
            <div key={id} className={styles.audience}>
              <h3 className={styles.audienceName}>{name}</h3>
              <p className={styles.audienceBody}>{body}</p>
              {/* Points at /work rather than a filtered view: the three
                  filtered routes the canvas implies do not exist yet. A link
                  to a page that is not there is worse than a broader one. */}
              <NavLink to="/work" className={styles.textLink}>{cta} →</NavLink>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reel ────────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.split}`}>
        <Eyebrow>Reel</Eyebrow>
        <div className={styles.splitBody}>
          {/* The canvas has a "[ SHOWREEL PLACEHOLDER — FINAL CUT TBD ]" box
              here. The site has a real reel, so it plays instead — a
              placeholder standing in front of finished work would be the one
              kind of dishonesty this page does not need. */}
          <video
            className={styles.reel}
            src={siteConfig?.reelVideoUrl ?? REEL_VIDEO_URL}
            poster="/reel-preview.gif"
            controls
            playsInline
            preload="none"
          />
        </div>
      </section>

      {/* ── Proof ───────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.split}`}>
        <Eyebrow>Proof</Eyebrow>
        <div className={`${styles.splitBody} ${styles.quotes}`}>
          {PROOF.map(({ quote, person }) => (
            <figure key={quote.slice(0, 24)} className={styles.quoteCard}>
              <blockquote className={styles.quote}>“{quote}”</blockquote>
              {isPlaceholder(person)
                ? (import.meta.env.DEV && <figcaption className={styles.quoteByPlaceholder}>— {person}</figcaption>)
                : <figcaption className={styles.quoteBy}>— {person}</figcaption>}
            </figure>
          ))}
        </div>
      </section>

      {/* ── Featured work ───────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.split}`}>
        <Eyebrow>Featured work</Eyebrow>
        <div className={styles.splitBody}>
          <div className={styles.study}>
            <div className={styles.studyMedia}>
              {study.media
                ? <LazyVideo src={study.media} className={styles.studyVideo} />
                : <span className={styles.studyEmpty} aria-hidden="true" />}
              <div className={styles.studyCaption}>
                <p className={styles.studyType}>{study.type}</p>
                <p className={styles.studyName}>{study.name}</p>
              </div>
            </div>
            <div className={styles.studyMeta}>
              <dl className={styles.stats}>
                {study.stats.map(({ value, label }) => (
                  <div key={label} className={styles.stat}>
                    <dt className={styles.statValue}>{value}</dt>
                    <dd className={styles.statLabel}>{label}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.studyNote}>More case studies in progress.</p>
              {study.href
                ? <NavLink to={study.href} className={styles.textLink}>Read the case study →</NavLink>
                : <NavLink to="/work" className={styles.textLink}>View all work →</NavLink>}
            </div>
          </div>
          <div className={styles.carouselBar}>
            <div className={styles.dots}>
              {featuredCaseStudies.map((c, i) => (
                <button
                  key={c.slug}
                  className={`${styles.dot}${i === index ? ' ' + styles.dotOn : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${c.name}`}
                  aria-current={i === index || undefined}
                />
              ))}
            </div>
            <div className={styles.arrows}>
              <button className={styles.arrow} onClick={() => step(-1)} aria-label="Previous case study">‹</button>
              <button className={styles.arrow} onClick={() => step(1)} aria-label="Next case study">›</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── The ask ─────────────────────────────────────────────── */}
      <ContactCTA sub="It might change your life. At minimum, we can answer your burning marketing questions." />

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div>
          <p className={styles.footWordmark}>Super~Conscious</p>
          <p className={styles.footTag}>Build your brand. Then grow it.</p>
        </div>
        <div className={styles.footCols}>
          <div className={styles.footCol}>
            <Eyebrow>Company</Eyebrow>
            <NavLink to="/work" className={styles.footLink}>Work</NavLink>
            <NavLink to="/about-us" className={styles.footLink}>About</NavLink>
            <NavLink to="/thoughts" className={styles.footLink}>Thoughts</NavLink>
            <NavLink to="/about-us" className={styles.footLink}>Careers</NavLink>
          </div>
          <div className={styles.footCol}>
            <Eyebrow>Connect</Eyebrow>
            <a href="mailto:hello@super-conscious.studio" className={styles.footLink}>hello@super-conscious.studio</a>
            <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noreferrer" className={styles.footLink}>LinkedIn</a>
          </div>
        </div>
      </footer>

    </main>
  )
}
