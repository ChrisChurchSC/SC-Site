import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { caseStudies as staticCaseStudies } from '../data/caseStudies'
import { useProjects } from '../context/ProjectsContext'
import styles from './CaseStudy.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { CASE_STUDY_QUERY } from '../lib/queries'
import { sanityImg, sanityImgProps } from '../lib/sanityImg'
import { workTitle, workDescription } from '../lib/workMeta'
import CaseStudyVideo from '../components/CaseStudyVideo'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = e => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])
  return isMobile
}

function MediaItem({ src, mobileSrc, alt = '', priority = false, hasWebsite = false, sound = false }) {
  const isMobile = useIsMobile()
  const chosen = isMobile && mobileSrc ? mobileSrc : src
  if (!chosen) return null
  const isVideo = chosen?.endsWith('.mp4') || chosen?.endsWith('.mov')
  const onLoad = (e) => { e.target.style.display = '' }
  const onError = (e) => { e.target.style.display = 'none' }
  if (isVideo) return (
    // When a "View website" button occupies the bottom-right, move the
    // video's own mute/play controls to the bottom-left to avoid overlap.
    <CaseStudyVideo key={chosen} src={chosen} onError={onError} controlsAlign={hasWebsite ? 'left' : 'right'} sound={sound} />
  )
  const img = sanityImgProps(chosen, { w: isMobile ? 900 : 1800, priority })
  return <img key={img.src} {...img} alt={alt} onLoad={onLoad} onError={onError} />
}

function WebsiteButton({ href }) {
  return (
    <a
      className={styles.websiteBtn}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => window.gtag?.('event', 'view_website', { url: href })}
    >
      View Website ↗
    </a>
  )
}

const servicesByType = {
  'Brand':           ['Brand Identity', 'Visual Language', 'Typography', 'Color System'],
  'Web':             ['Web Design', 'Development', 'UX/UI', 'Motion'],
  'Campaign':        ['Campaign Strategy', 'Art Direction', 'Content', 'Social'],
  'Brand + Web':     ['Brand Identity', 'Web Design', 'Development', 'Motion'],
  'Brand + Content': ['Brand Identity', 'Content Strategy', 'Social', 'Animation'],
  'Content':         ['Content Strategy', 'Social', 'Photography', 'Copywriting'],
  'Product':         ['Product Design', 'UX/UI', 'Prototyping', 'Visual Design'],
}

function buildPlaceholder(project) {
  const services = project.work ?? servicesByType[project.type] ?? ['Brand Identity', 'Web Design', 'Content', 'Motion']
  return {
    n: project.n,
    name: project.name,
    type: project.type,
    tagline: 'A complete creative system built to move at the speed of the market.',
    summary: 'A full creative engagement spanning brand identity, visual language, and launch communications. We partnered closely with the founding team to develop a system that could carry the weight of their ambition, from investor decks to product surfaces to public-facing campaigns. The work was built to scale.',
    services,
    outcomes: [
      { category: 'Brand', outcome: 'Delivered a cohesive visual identity system across every touchpoint from day one.' },
      { category: 'Launch', outcome: 'Shipped on schedule and within scope, ready for a full public rollout.' },
      { category: 'Impact', outcome: 'Established a lasting creative foundation the team continues to build on.' },
    ],
    sections: [
      { type: 'image-full', src: null },
      { type: 'text', heading: 'The Challenge', body: 'The team came to us with a clear vision but no visual language to carry it. They needed a brand that could hold up across investor materials, product surfaces, and public-facing campaigns, all at once, from day one.' },
      { type: 'image-grid', images: [
        { src: null, cols: 7, ratio: '16/9', tag: 'Reel' },
        { src: null, cols: 5, ratio: '4/5' },
      ]},
      { type: 'image-grid', images: [
        { src: null, cols: 4, ratio: '4/5' },
        { src: null, cols: 4, ratio: '4/5' },
        { src: null, cols: 4, ratio: '4/5' },
      ]},
      { type: 'text', heading: 'The Approach', body: 'We built the system from the inside out, starting with core identity, then extending into motion, typography, and a modular content framework that the team could run independently. Every decision was made to serve longevity over trend.' },
      { type: 'image-full', src: null },
      { type: 'image-grid', images: [
        { src: null, cols: 6, ratio: '16/9' },
        { src: null, cols: 6, ratio: '16/9' },
      ]},
      { type: 'image-grid', images: [
        { src: null, cols: 5, ratio: '4/5' },
        { src: null, cols: 7, ratio: '16/9' },
      ]},
      { type: 'image-full', src: null },
    ],
  }
}

export default function CaseStudy() {
  const isMobile = useIsMobile()
  const { slug, clientSlug, workSlug } = useParams()
  // When accessed via /work/:clientSlug/:workSlug, resolve the Sanity slug as "clientSlug-workSlug"
  const sanitySlug = workSlug ? `${clientSlug}-${workSlug}` : slug
  const clientSlugResolved = clientSlug ?? slug
  const { data: sanityCs } = useSanity(CASE_STUDY_QUERY, { slug: sanitySlug })
  const projects = useProjects()
  const project = projects.bySlug(clientSlugResolved)

  // Gate each page by its own password. Sub-projects use their own Sanity
  // doc rather than inheriting the parent client's password.
  const gateProject = workSlug ? projects.bySlug(sanitySlug) : project
  const gateResolved = !!gateProject
  const gatePassword = gateProject?.password

  const [manualUnlock, setManualUnlock] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  // Derived (not one-time state) so it re-evaluates once the project loads.
  const sessionUnlocked = typeof sessionStorage !== 'undefined'
    && sessionStorage.getItem(`cs_unlocked_${sanitySlug}`) === '1'
  const unlocked = manualUnlock || sessionUnlocked || (gateResolved && !gatePassword)

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pw === gatePassword) {
      sessionStorage.setItem(`cs_unlocked_${sanitySlug}`, '1')
      setManualUnlock(true)
    } else {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 600)
    }
  }

  // Normalize Sanity sections to match existing renderer expectations
  const normalizeSections = (sections) => sections?.map(s => {
    if (s._type === 'imageFullSection') return { type: 'image-full', src: s.src, mobileSrc: s.mobileSrc, ratio: s.ratio, mobileRatio: s.mobileRatio, website: s.website }
    if (s._type === 'textSection') return { type: 'text', heading: s.heading, body: s.body }
    if (s._type === 'imageGridSection') return { type: 'image-grid', images: s.images }
    return s
  }) ?? []

  const placeholder = project ? buildPlaceholder(project) : null
  const sanityStripped = sanityCs
    ? Object.fromEntries(Object.entries(sanityCs).filter(([, v]) => v !== null && v !== undefined))
    : null
  const normalizedSections = normalizeSections(sanityCs?.sections)
  const staticCs = staticCaseStudies[slug]
  // Sanity wins only when it actually carries case-study sections. A bare
  // project stub (name/type/year for the work grid, no sections) must not
  // shadow a hand-authored static case study — fall through to static first.
  const cs = (sanityCs && normalizedSections.length > 0)
    ? { ...placeholder, ...sanityStripped, sections: normalizedSections }
    : (staticCs
        ?? (sanityCs
            ? { ...placeholder, ...sanityStripped, sections: placeholder?.sections ?? [] }
            : placeholder))

  const heroImage = (cs?.sections ?? [])
    .flatMap(s => s._type === 'imageGridSection' ? (s.images ?? []) : [s])
    .map(s => s.src)
    .find(src => src && src.includes('/images/'))

  // Derived per render, never module-scoped: entry-server renders every route
  // in one process (twice each), so a shared Set would carry one case study's
  // images into the next.
  const isHero = (src) => !!src && src === heroImage
  const altFor = (src) =>
    isHero(src) ? `${cs.name}${cs.type ? ` — ${cs.type}` : ''} by Super Conscious` : ''
  useMeta({
    // Same helpers the prerender uses, so the rendered-DOM title cannot drift
    // from the one a non-JS crawler reads.
    title: cs ? workTitle(cs, cs.name) : 'Work | Super Conscious',
    description: cs ? workDescription(cs, cs.name) : 'Case study from Super Conscious.',
    image: heroImage,
    path: `/work/${slug}`,
  })

  if (!cs) return <main className={styles.main}><p className={styles.notFound}>Case study not found.</p></main>

  // Wait for the gate project to resolve before deciding the gate, so a
  // private page never flashes its content and a public one never flashes
  // the gate (and the gate never renders against an undefined project).
  if (!gateResolved) return <main className={styles.main} />

  // A coming-soon project has no live case study — show a notice rather than
  // rendering placeholder content as if the page were finished.
  if (gateProject.comingSoon) return (
    <main className={styles.main}>
      <div className={styles.gate}>
        <div className={styles.gateInner}>
          <p className={styles.gateNum}>{gateProject.n}</p>
          <h1 className={styles.gateName}>{gateProject.name}</h1>
          <p className={styles.gateSubtext}>This case study is coming soon.</p>
        </div>
      </div>
    </main>
  )

  if (!unlocked) return (
    <main className={styles.main}>
      <div className={styles.gate}>
        <div className={styles.gateInner}>
          <p className={styles.gateNum}>{project.n}</p>
          <h1 className={styles.gateName}>{project.name}</h1>
          <p className={styles.gateSubtext}>This case study is private.</p>
          <form className={styles.gateForm} onSubmit={handleUnlock}>
            <input
              className={`${styles.gateInput}${error ? ` ${styles.gateInputError}` : ''}`}
              type="password"
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              autoFocus
            />
            <span className={styles.gateError}>{error ? 'Incorrect password.' : ''}</span>
            <button type="submit" className={styles.gateSubmit}>Enter →</button>
          </form>
        </div>
      </div>
    </main>
  )

  return (
    <main className={styles.main}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.metaNum}>{cs.n}</span>
          <span className={styles.metaType}>{cs.type}</span>
          <span className={styles.metaYear}>{cs.year}</span>
        </div>
        <h1 className={styles.title}>{cs.name}</h1>
        {cs.tagline && <p className={styles.tagline}>{cs.tagline}</p>}
        <div className={styles.services}>
          {cs.services.map(s => (
            <span key={s} className={styles.serviceTag}>{s}</span>
          ))}
        </div>
      </header>

      {/* Overview */}
      <div className={styles.overview}>
        <p className={styles.overviewDesc}>{cs.summary}</p>
        {cs.partnerNote && <p className={styles.partnerNote}>{cs.partnerNote}</p>}
        {cs.outcomes?.length > 0 && (
          <div className={styles.outcomeCards}>
            {cs.outcomes.map(({ category, outcome }) => (
              <div key={category} className={styles.outcomeCard}>
                <span className={styles.outcomeCategory}>{category}</span>
                <p className={styles.outcomeText}>{outcome}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className={styles.sections}>
        {cs.sections.map((section, i) => {

          // Alt text for a wall of portfolio images with no per-image data.
          //
          // Every image carried `${cs.name} — case study image`: 29 identical
          // strings on /work/photon, 28 on /work/banzen. Repeated verbatim that
          // is noise to a screen reader and worth nothing in image search, and
          // the Sanity sections hold no alt, label, caption or title to do
          // better with — only `heading` on the text sections.
          //
          // So the first image, which is also the one used as og:image, gets a
          // real description, and the rest are marked decorative. An empty alt
          // on an image there is no honest text for is the correct answer, not
          // a fallback.
          if (section.type === 'image-full') {
            const useMobile = isMobile && section.mobileSrc
            const ar = useMobile ? (section.mobileRatio ?? '4/5') : (section.ratio ?? '16/9')
            return (
              <div key={i} className={styles.mediaFull} style={{ aspectRatio: ar }}>
                <MediaItem src={section.src} mobileSrc={section.mobileSrc} alt={altFor(section.src)} priority={isHero(section.src)} hasWebsite={!!section.website} sound={section.sound} />
                {section.website && <WebsiteButton href={section.website} />}
              </div>
            )
          }

          if (section.type === 'text') return (
            <div key={i} className={styles.textSection}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              <p className={styles.sectionBody}>{section.body}</p>
            </div>
          )

          if (section.type === 'image-grid') {
            const single = section.images.length === 1
            return (
              <div key={i} className={styles.mediaGrid}>
                {section.images.map((item, j) => {
                  const useMobile = isMobile && item.mobileSrc
                  const ar = useMobile ? (item.mobileRatio ?? '4/5') : (item.ratio ?? '16/9')
                  return (
                    <div
                      key={j}
                      className={styles.mediaGridItem}
                      style={{ gridColumn: `span ${item.cols}`, aspectRatio: ar }}
                    >
                      <MediaItem src={item.src} mobileSrc={item.mobileSrc} alt={altFor(item.src)} priority={isHero(item.src)} hasWebsite={!!item.website} sound={item.sound} />
                      {item.tag && <span className={styles.mediaTag}>{item.tag}</span>}
                      {item.website && <WebsiteButton href={item.website} />}
                    </div>
                  )
                })}
              </div>
            )
          }

          return null
        })}
      </div>

      {/* CTA */}
      <section className={styles.csCtaSection}>
        <NavLink
          to="/contact"
          className={styles.csCtaBtn}
          onClick={() => window.gtag?.('event', 'cta_click', { cta_location: 'case_study' })}
        >
          Start a project →
        </NavLink>
      </section>

    </main>
  )
}
