import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { caseStudies as staticCaseStudies } from '../data/caseStudies'
import { useProjects } from '../context/ProjectsContext'
import styles from './CaseStudy.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { CASE_STUDY_QUERY, HOMEPAGE_GRID_QUERY } from '../lib/queries'
import { BLOCK_MAP } from '../lib/blockMap'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'
import ClickToPlayVideo from '../components/ClickToPlayVideo'

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

function MediaItem({ src, mobileSrc, alt = '' }) {
  const isMobile = useIsMobile()
  const chosen = isMobile && mobileSrc ? mobileSrc : src
  if (!chosen) return null
  const isVideo = chosen?.endsWith('.mp4') || chosen?.endsWith('.mov')
  const onLoad = (e) => { e.target.style.display = '' }
  const onError = (e) => { e.target.style.display = 'none' }
  if (isVideo) return (
    <ClickToPlayVideo key={chosen} src={chosen} onError={onError} />
  )
  const optimized = sanityImg(chosen, { w: isMobile ? 900 : 1800 })
  return <img key={optimized} src={optimized} alt={alt} loading="lazy" onLoad={onLoad} onError={onError} />
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
    credits: [
      { role: 'Creative Direction', name: 'Super Conscious' },
      { role: 'Brand Identity', name: 'Super Conscious' },
      { role: 'Client', name: project.name },
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
  const { data: gridData } = useSanity(HOMEPAGE_GRID_QUERY)
  const projects = useProjects()
  const project = projects.bySlug(clientSlugResolved)

  // Map project slug → grid block. Prefer BLOCK_MAP[label].slug (covers blocks
  // without a Sanity project ref) and fall back to projectSlug from Sanity.
  // For blocks whose media is on a static path (BLOCK_MAP.img), expose that as videoUrl/imageUrl too.
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const isImg = (u) => /\.(png|jpe?g|gif|webp|avif)$/i.test(u || '')
  const gridBySlug = {}
  gridData?.blocks?.forEach(b => {
    const slug = BLOCK_MAP[b.label]?.slug ?? b.projectSlug
    if (!slug) return
    const fallbackImg = BLOCK_MAP[b.label]?.img
    const fallbackUrl = fallbackImg ? (fallbackImg.startsWith('/') ? `${base}${fallbackImg}` : fallbackImg) : null
    gridBySlug[slug] = {
      mediaType: b.mediaType ?? (fallbackImg && !isImg(fallbackImg) ? 'video' : (fallbackImg ? 'image' : null)),
      videoUrl: b.videoUrl ?? (fallbackImg && !isImg(fallbackImg) ? fallbackUrl : null),
      imageUrl: b.imageUrl ?? (fallbackImg && isImg(fallbackImg) ? fallbackUrl : null),
    }
  })

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
    if (s._type === 'imageFullSection') return { type: 'image-full', src: s.src, mobileSrc: s.mobileSrc, ratio: s.ratio, mobileRatio: s.mobileRatio }
    if (s._type === 'textSection') return { type: 'text', heading: s.heading, body: s.body }
    if (s._type === 'imageGridSection') return { type: 'image-grid', images: s.images }
    return s
  }) ?? []

  const placeholder = project ? buildPlaceholder(project) : null
  const sanityStripped = sanityCs
    ? Object.fromEntries(Object.entries(sanityCs).filter(([, v]) => v !== null && v !== undefined))
    : null
  const normalizedSections = normalizeSections(sanityCs?.sections)
  const cs = sanityCs
    ? { ...placeholder, ...sanityStripped, sections: normalizedSections.length > 0 ? normalizedSections : (placeholder?.sections ?? []), credits: sanityCs.partner
        ? [
            { role: 'Produced by', name: sanityCs.partner },
            { role: 'Client', name: sanityCs.client ?? sanityCs.name },
          ]
        : [
            { role: 'Creative Direction', name: 'Super Conscious' },
            { role: 'Client', name: sanityCs.name },
          ] }
    : (staticCaseStudies[slug] ?? placeholder)

  const moreProjects = projects.all.filter(p => p.slug !== slug).slice(0, 3)

  const heroImage = (cs?.sections ?? [])
    .flatMap(s => s._type === 'imageGridSection' ? (s.images ?? []) : [s])
    .map(s => s.src)
    .find(src => src && src.includes('/images/'))
  const csSchema = cs ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.name,
    description: cs.tagline ?? cs.summary,
    url: `https://super-conscious.studio/work/${slug}`,
    image: heroImage,
    creator: { '@type': 'Organization', name: 'Super Conscious', url: 'https://super-conscious.studio' },
    author: { '@type': 'Organization', name: 'Super Conscious' },
  } : null
  useMeta({
    title: cs ? `${cs.name} | Super Conscious` : 'Work | Super Conscious',
    description: cs?.tagline ?? cs?.summary?.slice(0, 155) ?? 'Case study from Super Conscious.',
    image: heroImage,
    path: `/work/${slug}`,
    schema: csSchema,
  })

  if (!cs) return <main className={styles.main}><p className={styles.notFound}>Case study not found.</p></main>

  // Wait for the sub-project doc to resolve before deciding the gate, so a
  // private page never flashes its content and a public one never flashes the gate.
  if (workSlug && !gateResolved) return <main className={styles.main} />

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

          if (section.type === 'image-full') {
            const useMobile = isMobile && section.mobileSrc
            const ar = useMobile ? (section.mobileRatio ?? '4/5') : (section.ratio ?? '16/9')
            return (
              <div key={i} className={styles.mediaFull} style={{ aspectRatio: ar }}>
                <MediaItem src={section.src} mobileSrc={section.mobileSrc} alt={`${cs.name} — case study image`} />
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
                      <MediaItem src={item.src} mobileSrc={item.mobileSrc} alt={`${cs.name} — case study image`} />
                      {item.tag && <span className={styles.mediaTag}>{item.tag}</span>}
                    </div>
                  )
                })}
              </div>
            )
          }

          return null
        })}
      </div>

      {/* More Work */}
      <div className={styles.moreWork}>
        <span className={styles.moreWorkLabel}>More Work</span>
        <div className={styles.moreWorkGrid}>
          {moreProjects.map(p => {
            const g = gridBySlug[p.slug]
            const thumb = g?.mediaType === 'video' && g?.videoUrl
              ? <LazyVideo src={g.videoUrl} className={styles.moreCardThumb} />
              : g?.imageUrl
                ? <img src={sanityImg(g.imageUrl, { w: 800 })} alt={`${p.name} case study thumbnail`} loading="lazy" className={styles.moreCardThumb} />
                : null
            const inner = (
              <>
                {thumb}
                {thumb && <div className={styles.moreCardScrim} />}
                <span className={styles.moreCardNum}>{p.n}</span>
                <span className={styles.moreCardName}>{p.name}</span>
              </>
            )
            return p.slug ? (
              <NavLink key={p.n} to={`/work/${p.slug}`} className={styles.moreCard}>{inner}</NavLink>
            ) : (
              <div key={p.n} className={styles.moreCard}>{inner}</div>
            )
          })}
        </div>
      </div>

      {/* Credits */}
      <footer className={styles.credits}>
        <span className={styles.creditsLabel}>Credits</span>
        <div className={styles.creditsList}>
          {cs.credits.map(({ role, name }) => (
            <div key={role} className={styles.creditRow}>
              <span className={styles.creditRole}>{role}</span>
              <span className={styles.creditName}>{name}</span>
            </div>
          ))}
        </div>
      </footer>

    </main>
  )
}
