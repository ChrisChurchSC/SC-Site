import { NavLink } from 'react-router-dom'
import styles from './WorkGrid.module.css'
import { useComingSoon } from '../context/ComingSoonContext'
import { useSanity } from '../hooks/useSanity'
import { HOMEPAGE_GRID_QUERY } from '../lib/queries'
import { useProjects } from '../context/ProjectsContext'
import { BLOCK_MAP } from '../lib/blockMap'
import { groupFor } from '../lib/workGroup'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from './LazyVideo'
import { useToast, Toast } from './Toast'

/**
 * The curated work wall — a 12-column grid of case study blocks.
 *
 * This lived inline in the homepage until the homepage grew a positioning
 * top half (client strip, Build/Grow, featured case studies) and the wall
 * moved out from under it. It moved rather than being rebuilt: same blocks,
 * same Sanity-first / BLOCK_MAP-fallback media resolution, same coming-soon
 * and multi-project badges. Only the file it lives in changed.
 *
 * It is deliberately NOT the whole case study list. The grid is curated and
 * covers a subset; /work renders the complete index underneath it so every
 * case study keeps a crawlable anchor. Do not treat this as the hub — see
 * the note in Work.jsx.
 *
 * The Sanity query is still named HOMEPAGE_GRID_QUERY and the documents it
 * reads are still homepageGrid. Renaming those means a schema migration in
 * the studio and a re-key of live content for no behavioural gain, so the
 * name outlived the page it was named for.
 */
export default function WorkGrid() {
  const { data: gridData } = useSanity(HOMEPAGE_GRID_QUERY)
  const comingSoon = useComingSoon()
  const projects = useProjects()
  const { toast, showToast } = useToast()

  // Build a lookup map: label -> block data
  const grid = {}
  gridData?.blocks?.forEach(b => { grid[b.label] = b })

  // Prefix local paths with Vite base URL (needed for GitHub Pages /SC-Site/ subpath)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

  const isImageUrl = (url) => /\.(png|jpe?g|gif|webp|avif)$/i.test(url)

  // Render media — Sanity data first, static fallback second
  const blockMedia = (label, style = {}) => {
    const b = grid[label]
    const mediaStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    // Block 023: tile the video as a 3x3 grid inside the block (single video on mobile)
    if (label === '023' && b?.videoUrl) {
      const url = assetUrl(b.videoUrl)
      const mobile = typeof window !== 'undefined' && window.innerWidth <= 768
      if (mobile) return <LazyVideo src={url} style={mediaStyle} onError={e => e.target.style.display = 'none'} />
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <LazyVideo key={i} src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
          ))}
        </div>
      )
    }
    if (b?.mediaType === 'video' && b?.videoUrl) {
      const url = assetUrl(b.videoUrl)
      if (isImageUrl(url)) return <img src={sanityImg(url, { w: 900 })} alt="" loading="lazy" style={mediaStyle} onError={e => e.target.style.display = 'none'} />
      return <LazyVideo src={url} style={mediaStyle} onError={e => e.target.style.display = 'none'} />
    }
    if (b?.mediaType === 'image' && b?.imageUrl) return (
      <img src={sanityImg(b.imageUrl, { w: 900 })} alt="" loading="lazy" style={mediaStyle} onError={e => e.target.style.display = 'none'} />
    )
    const fallback = BLOCK_MAP[label]
    if (fallback?.img) {
      const url = assetUrl(fallback.img)
      if (isImageUrl(url)) return <img src={sanityImg(url, { w: 900 })} alt="" loading="lazy" style={mediaStyle} />
      return <LazyVideo src={url} style={mediaStyle} />
    }
    return null
  }

  // Wrap block in NavLink/anchor — BLOCK_MAP wins; Sanity externalUrl still overrides
  const blockLink = (label, className, style, children) => {
    const b = grid[label]
    const slug = BLOCK_MAP[label]?.slug ?? b?.projectSlug
    const externalUrl = b?.externalUrl ?? BLOCK_MAP[label]?.externalUrl
    const count = workCount(label)
    const badge = !externalUrl && count > 1 ? <span key="wb" className={styles.workBadge}>+{count} PROJECTS</span> : null
    const isComingSoon = slug && comingSoon.has(slug) && !externalUrl
    const csBadge = isComingSoon ? <span key="cs" className={styles.comingSoonBadge}>Coming Soon</span> : null
    const inner = <>{children}{badge}{csBadge}</>
    const finalClass = `${className}${isComingSoon ? ' ' + styles.blockComingSoon : ''}${externalUrl ? ' ' + styles.blockExternal : ''}`
    if (externalUrl) {
      const isInternal = externalUrl.startsWith('/')
      if (isInternal) return <NavLink to={externalUrl} className={finalClass} style={style}>{inner}</NavLink>
      return (
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" className={finalClass} style={style}>
          <span className={styles.extIcon} aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square"/>
            </svg>
          </span>
          {inner}
        </a>
      )
    }
    if (isComingSoon) return (
      <div className={finalClass} style={style} onClick={() => showToast(blockName(label) ? `${blockName(label)} — coming soon` : 'Case study coming soon')}>
        {inner}
      </div>
    )
    if (slug) return (
      <NavLink to={`/work/${slug}`} className={finalClass} style={style}>{inner}</NavLink>
    )
    return <div className={finalClass} style={style}>{inner}</div>
  }

  // Resolve project name — BLOCK_MAP slug drives the lookup
  const blockName = (label) => {
    const slug = BLOCK_MAP[label]?.slug ?? grid[label]?.projectSlug
    return slug ? projects.bySlug(slug)?.name : null
  }

  // Count distinct work items for a project
  const workCount = (label) => {
    const slug = BLOCK_MAP[label]?.slug ?? grid[label]?.projectSlug
    return slug ? (projects.bySlug(slug)?.subCount ?? 0) : 0
  }


  // Every block on the wall, in the order it was composed. The hand-built
  // rows this replaced carried eighteen different column spans across
  // twenty-one sections; grouping the blocks by Build and Grow made those
  // compositions impossible to keep, so the wall is a flowing grid now —
  // uniform 3-column, 4:5 cards, which was already its most common shape.
  //
  // Three labels are gone with the rows: 034, 035 and 047 were static
  // decorative images with no project behind them, placed to balance
  // particular rows. There are no particular rows any more.
  const LABELS = ['002','003','036','005','006','007','008','009','011','012','013','014','004','016','040','041','042','017','018','019','020','022','023','024','025','027','028','029','049','050','051','052','046','053','030','031','032','033','037','038','039','043','044','045','048']

  // Names that were hardcoded as fallbacks in the old markup, for blocks whose
  // project record does not always resolve.
  const FALLBACK_NAME = { '003': 'Oxyle', '006': 'Concis Labs', '007': 'Big Buoy', '004': 'Deep Dive Films' }

  const groupOf = (label) => {
    const slug = BLOCK_MAP[label]?.slug ?? grid[label]?.projectSlug
    return groupFor(slug ? projects.bySlug(slug)?.type : undefined, slug)
  }

  const build = LABELS.filter(l => groupOf(l) === 'build')
  const grow = LABELS.filter(l => groupOf(l) === 'grow')

  const renderBlock = (label) => blockLink(
    label,
    `${styles.block} ${styles.r45} ${styles.blockLink}${label === '002' ? ' ' + styles.wwCard : ''}`,
    undefined,
    <>
      {blockMedia(label)}
      <span className={styles.label}>{label}</span>
      <span className={styles.csTag}>Case Study</span>
      <p className={styles.blockTitle}>{blockName(label) || FALLBACK_NAME[label]}</p>
    </>,
  )

  const section = (title, labels) => labels.length > 0 && (
    <section className={styles.group} aria-label={`${title} work`}>
      <div className={styles.groupHead}>
        <h2 className={styles.groupTitle}>{title}</h2>
        <span className={styles.groupRule} aria-hidden="true" />
        <p className={styles.groupCount}>{String(labels.length).padStart(3, '0')}</p>
      </div>
      <div className={styles.row12}>
        {labels.map(renderBlock)}
      </div>
    </section>
  )

  return (
    <div className={styles.grid}>
      {section('Build', build)}
      {section('Grow', grow)}
      <Toast toast={toast} />
    </div>
  )
}
