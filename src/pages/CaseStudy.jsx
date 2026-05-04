import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { caseStudies as staticCaseStudies } from '../data/caseStudies'
import { projects as staticProjects } from '../data/projects'
import styles from './CaseStudy.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { CASE_STUDY_QUERY, PROJECTS_QUERY } from '../lib/queries'

function MediaItem({ src, alt = '' }) {
  if (!src) return null
  const isVideo = src?.endsWith('.mp4') || src?.endsWith('.mov')
  if (isVideo) return (
    <video src={src} autoPlay muted loop playsInline onError={(e) => e.target.style.display = 'none'} />
  )
  return <img src={src} alt={alt} onError={(e) => e.target.style.display = 'none'} />
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
    summary: 'A full creative engagement spanning brand identity, visual language, and launch communications. We partnered closely with the founding team to develop a system that could carry the weight of their ambition — from investor decks to product surfaces to public-facing campaigns. The work was built to scale.',
    services,
    outcomes: [
      { category: 'Brand', outcome: 'Delivered a cohesive visual identity system across every touchpoint from day one.' },
      { category: 'Launch', outcome: 'Shipped on schedule and within scope, ready for a full public rollout.' },
      { category: 'Impact', outcome: 'Established a lasting creative foundation the team continues to build on.' },
    ],
    sections: [
      { type: 'image-full', src: null },
      { type: 'text', heading: 'The Challenge', body: 'The team came to us with a clear vision but no visual language to carry it. They needed a brand that could hold up across investor materials, product surfaces, and public-facing campaigns — all at once, from day one.' },
      { type: 'image-grid', images: [
        { src: null, cols: 7, ratio: '16/9', tag: 'Reel' },
        { src: null, cols: 5, ratio: '4/5' },
      ]},
      { type: 'image-grid', images: [
        { src: null, cols: 4, ratio: '4/5' },
        { src: null, cols: 4, ratio: '4/5' },
        { src: null, cols: 4, ratio: '4/5' },
      ]},
      { type: 'text', heading: 'The Approach', body: 'We built the system from the inside out — starting with core identity, then extending into motion, typography, and a modular content framework that the team could run independently. Every decision was made to serve longevity over trend.' },
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
  const { slug, clientSlug, workSlug } = useParams()
  // When accessed via /work/:clientSlug/:workSlug, resolve the Sanity slug as "clientSlug-workSlug"
  const sanitySlug = workSlug ? `${clientSlug}-${workSlug}` : slug
  const clientSlugResolved = clientSlug ?? slug
  const { data: sanityCs } = useSanity(CASE_STUDY_QUERY, { slug: sanitySlug })
  const projects = staticProjects
  const project = projects.find(p => p.slug === clientSlugResolved)

  const [unlocked, setUnlocked] = useState(() =>
    !project?.password || sessionStorage.getItem(`cs_unlocked_${slug}`) === '1'
  )
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pw === project.password) {
      sessionStorage.setItem(`cs_unlocked_${slug}`, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 600)
    }
  }

  // Normalize Sanity sections to match existing renderer expectations
  const normalizeSections = (sections) => sections?.map(s => {
    if (s._type === 'imageFullSection') return { type: 'image-full', src: s.src, ratio: s.ratio }
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
    ? { ...placeholder, ...sanityStripped, sections: normalizedSections.length > 0 ? normalizedSections : (placeholder?.sections ?? []), credits: [{ role: 'Creative Direction', name: 'Super Conscious' }, { role: 'Client', name: sanityCs.name }] }
    : (staticCaseStudies[slug] ?? placeholder)

  const moreProjects = projects.filter(p => p.slug !== slug).slice(0, 3)

  useMeta({
    title: cs ? `${cs.name} — Super Conscious` : 'Work — Super Conscious',
    description: cs?.tagline ?? cs?.summary?.slice(0, 155) ?? 'Case study from Super Conscious.',
  })

  if (!cs) return <main className={styles.main}><p className={styles.notFound}>Case study not found.</p></main>

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

          if (section.type === 'image-full') return (
            <div key={i} className={styles.mediaFull} style={{ aspectRatio: '16/9' }}>
              <MediaItem src={section.src} />
            </div>
          )

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
                {section.images.map((item, j) => (
                  <div
                    key={j}
                    className={styles.mediaGridItem}
                    style={{ gridColumn: `span ${item.cols}`, aspectRatio: single ? '16/9' : (item.ratio ?? '16/9') }}
                  >
                    <MediaItem src={item.src} />
                    {item.tag && <span className={styles.mediaTag}>{item.tag}</span>}
                  </div>
                ))}
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
          {moreProjects.map(p => (
            p.slug ? (
              <NavLink key={p.n} to={`/work/${p.slug}`} className={styles.moreCard}>
                <span className={styles.moreCardNum}>{p.n}</span>
                <span className={styles.moreCardName}>{p.name}</span>
              </NavLink>
            ) : (
              <div key={p.n} className={styles.moreCard}>
                <span className={styles.moreCardNum}>{p.n}</span>
                <span className={styles.moreCardName}>{p.name}</span>
              </div>
            )
          ))}
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
