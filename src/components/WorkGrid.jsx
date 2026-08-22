import { NavLink } from 'react-router-dom'
import styles from './WorkGrid.module.css'
import { useComingSoon } from '../context/ComingSoonContext'
import { useSanity } from '../hooks/useSanity'
import { HOMEPAGE_GRID_QUERY } from '../lib/queries'
import { useProjects } from '../context/ProjectsContext'
import { BLOCK_MAP } from '../lib/blockMap'
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

  return (
    <div className={styles.grid}>
      {/* Row 2 */}
      <section className={styles.row12}>
        {blockLink('002', `${styles.block} ${styles.r45} ${styles.blockLink} ${styles.wwCard}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('002')}
          <span className={styles.label}>002</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('002')}</p>
        </>)}
        {blockLink('003', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('003')}
          <span className={styles.label}>003</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('003') || 'Oxyle'}</p>
        </>)}
        {blockLink('036', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('036')}
          <span className={styles.label}>036</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('036')}</p>
        </>)}
        {blockLink('005', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '10 / span 3' }, <>
          {blockMedia('005')}
          <span className={styles.label}>005</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('005')}</p>
        </>)}
      </section>

      {/* Row 3 */}
      <section className={styles.row12}>
        {blockLink('006', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('006')}
          <span className={styles.label}>006</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('006') || 'Concis Labs'}</p>
        </>)}
        {blockLink('007', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('007')}
          <span className={styles.label}>007</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('007') || 'Big Buoy'}</p>
        </>)}
        {blockLink('008', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('008')}
          <span className={styles.label}>008</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('008')}</p>
        </>)}
        {blockLink('009', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('009')}
          <span className={styles.label}>009</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('009')}</p>
        </>)}
      </section>

      {/* Row 3 */}
      <section className={styles.row12}>
        {blockLink('011', `${styles.block} ${styles.r11} ${styles.blockLink}`, { gridColumn: '8 / span 5' }, <>
          {blockMedia('011')}
          <span className={styles.label}>011</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('011')}</p>
        </>)}
      </section>

      {/* Row 4 */}
      <section className={styles.row12}>
        {blockLink('012', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '1 / span 5' }, <>
          {blockMedia('012')}
          <span className={styles.label}>012</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('012')}</p>
        </>)}
        {blockLink('013', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '7 / span 6' }, <>
          {blockMedia('013')}
          <span className={styles.label}>013</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('013')}</p>
        </>)}
      </section>

      {/* Row 5 */}
      <section className={styles.row12}>
        {blockLink('014', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('014')}
          <span className={styles.label}>014</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('014')}</p>
        </>)}
        {blockLink('004', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '4 / span 6' }, <>
          {blockMedia('004')}
          <span className={styles.label}>004</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('004') || 'Deep Dive Films'}</p>
        </>)}
        {blockLink('016', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '10 / span 3' }, <>
          {blockMedia('016')}
          <span className={styles.label}>016</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('016')}</p>
        </>)}
      </section>

      {/* Row 5b */}
      <section className={styles.row12}>
        {blockLink('040', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('040')}
          <span className={styles.label}>040</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('040')}</p>
        </>)}
        {blockLink('041', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('041')}
          <span className={styles.label}>041</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('041')}</p>
        </>)}
        {blockLink('042', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('042')}
          <span className={styles.label}>042</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('042')}</p>
        </>)}
      </section>

      {/* Row 6 */}
      <section className={styles.row12}>
        {blockLink('017', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('017')}
          <span className={styles.label}>017</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('017')}</p>
        </>)}
        {blockLink('018', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('018')}
          <span className={styles.label}>018</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('018')}</p>
        </>)}
        {blockLink('019', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('019')}
          <span className={styles.label}>019</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('019')}</p>
        </>)}
      </section>

      {/* Row 7 */}
      <section className={styles.row12}>
        {blockLink('020', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('020')}
          <span className={styles.label}>020</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('020')}</p>
        </>)}
        {blockLink('022', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('022')}
          <span className={styles.label}>022</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('022')}</p>
        </>)}
      </section>

      {/* Row 7b */}
      <section className={styles.row12}>
        {blockLink('023', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '1 / span 12' }, <>
          {blockMedia('023')}
          <span className={styles.label}>023</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('023')}</p>
        </>)}
      </section>

      {/* Row 8 */}
      <section className={styles.row12}>
        {blockLink('024', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('024')}
          <span className={styles.label}>024</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('024')}</p>
        </>)}
        {blockLink('025', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '9 / span 3' }, <>
          {blockMedia('025')}
          <span className={styles.label}>025</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('025')}</p>
        </>)}
      </section>

      {/* Row 9 */}
      <section className={styles.row12}>
        {blockLink('027', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('027')}
          <span className={styles.label}>027</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('027')}</p>
        </>)}
        {blockLink('028', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('028')}
          <span className={styles.label}>028</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('028')}</p>
        </>)}
        {blockLink('029', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('029')}
          <span className={styles.label}>029</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('029')}</p>
        </>)}
      </section>

      {/* Google */}
      <section className={styles.row12}>
        {blockLink('049', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '3 / span 8' }, <>
          {blockMedia('049')}
          <span className={styles.label}>049</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('049')}</p>
        </>)}
      </section>

      {/* New work row: YouTube / Spot & Tango / SurvivorNet */}
      <section className={styles.row12}>
        {blockLink('050', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('050')}
          <span className={styles.label}>050</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('050')}</p>
        </>)}
        {blockLink('051', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: 'span 5' }, <>
          {blockMedia('051')}
          <span className={styles.label}>051</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('051')}</p>
        </>)}
        {blockLink('052', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('052')}
          <span className={styles.label}>052</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('052')}</p>
        </>)}
      </section>

      {/* Row 9b */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r916}`} style={{ gridColumn: 'span 4' }}>
          <LazyVideo src="https://cdn.sanity.io/files/ppq16wpu/production/ebefe364a979525232d38c45f383881d12bba783.mp4" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>047</span>
        </div>
        {blockLink('046', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: 'span 8' }, <>
          {blockMedia('046')}
          <span className={styles.label}>046</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('046')}</p>
        </>)}
      </section>

      {/* Row 9c — Deep Dive Films */}
      <section className={styles.row12}>
        {blockLink('053', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '3 / span 8' }, <>
          {blockMedia('053')}
          <span className={styles.label}>053</span>
          <span className={styles.csTag}>Visit Site</span>
          <p className={styles.blockTitle}>Deep Dive Films</p>
        </>)}
      </section>

      {/* Row 10 */}
      <section className={styles.row12}>
        {blockLink('030', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('030')}
          <span className={styles.label}>030</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('030')}</p>
        </>)}
        {blockLink('031', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('031')}
          <span className={styles.label}>031</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('031')}</p>
        </>)}
        {blockLink('032', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '8 / span 4' }, <>
          {blockMedia('032')}
          <span className={styles.label}>032</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('032')}</p>
        </>)}
      </section>

      {/* Row 11 */}
      <section className={styles.row12}>
        {blockLink('033', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '1 / span 12' }, <>
          {blockMedia('033')}
          <span className={styles.label}>033</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('033')}</p>
        </>)}
      </section>

      {/* Row 11b */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '2 / span 4' }}>
          <img src={sanityImg("https://cdn.sanity.io/images/ppq16wpu/production/3b72e768eff83d9af86bcad7873197610df48634-900x1125.png", { w: 900 })} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>034</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '7 / span 4' }}>
          <img src={sanityImg("https://cdn.sanity.io/images/ppq16wpu/production/6e924b2b6714c40f8b3370e33887742277bd4dff-900x1125.png", { w: 900 })} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>035</span>
        </div>
      </section>

      {/* Row 12 */}
      <section className={styles.row12}>
        {blockLink('037', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('037')}
          <span className={styles.label}>037</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('037')}</p>
        </>)}
        {blockLink('038', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('038')}
          <span className={styles.label}>038</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('038')}</p>
        </>)}
        {blockLink('039', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('039')}
          <span className={styles.label}>039</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('039')}</p>
        </>)}
      </section>

      {/* Row 13 */}
      <section className={styles.row12}>
        {blockLink('043', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '1 / span 5' }, <>
          {blockMedia('043')}
          <span className={styles.label}>043</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('043')}</p>
        </>)}
        {blockLink('044', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '6 / span 3' }, <>
          {blockMedia('044')}
          <span className={styles.label}>044</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('044')}</p>
        </>)}
        {blockLink('045', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '9 / span 4' }, <>
          {blockMedia('045')}
          <span className={styles.label}>045</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('045')}</p>
        </>)}
      </section>

      {/* Row 14 */}
      <section className={styles.row12}>
        {blockLink('048', `${styles.block} ${styles.r11} ${styles.blockLink}`, { gridColumn: 'span 4' }, <>
          {blockMedia('048')}
          <span className={styles.label}>048</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('048')}</p>
        </>)}
      </section>

      <Toast toast={toast} />
    </div>
  )
}
