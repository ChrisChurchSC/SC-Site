import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import LogoWordmark from '../components/LogoWordmark'
import Loader from '../components/Loader'
import { useNav } from '../context/NavContext'
import { useComingSoon } from '../context/ComingSoonContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { HOMEPAGE_GRID_QUERY, SITE_CONFIG_QUERY } from '../lib/queries'
import { useProjects } from '../context/ProjectsContext'
import { BLOCK_MAP } from '../lib/blockMap'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'

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
  const { data: gridData } = useSanity(HOMEPAGE_GRID_QUERY)
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  const comingSoon = useComingSoon()
  const projects = useProjects()
  useMeta({ path: '/', schema: HOME_SCHEMA })

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
    // Block 023: tile the video as a 3x3 grid inside the block
    if (label === '023' && b?.videoUrl) {
      const url = assetUrl(b.videoUrl)
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
    const count = workCount(label)
    const badge = count > 1 ? <span key="wb" className={styles.workBadge}>+{count} PROJECTS</span> : null
    const slug = BLOCK_MAP[label]?.slug ?? b?.projectSlug
    const isComingSoon = slug && comingSoon.has(slug) && !b?.externalUrl
    const csBadge = isComingSoon ? <span key="cs" className={styles.comingSoonBadge}>Coming Soon</span> : null
    const inner = <>{children}{badge}{csBadge}</>
    const finalClass = `${className}${isComingSoon ? ' ' + styles.blockComingSoon : ''}`
    if (b?.externalUrl) {
      const isInternal = b.externalUrl.startsWith('/')
      if (isInternal) return <NavLink to={b.externalUrl} className={finalClass} style={style}>{inner}</NavLink>
      return (
        <a href={b.externalUrl} target="_blank" rel="noopener noreferrer" className={finalClass} style={style}>
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
      <div className={finalClass} style={style} onClick={() => setToast({ msg: blockName(label) ? `${blockName(label)} — coming soon` : 'Case study coming soon', ts: Date.now() })}>
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

  const [loading, setLoading] = useState(!didLoad)
  const [reelOpen, setReelOpen] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

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
        <div className={styles.cornerNote} style={{ gridColumn: '1 / span 12' }}>
          <div className={styles.cornerWordmark}>
            <LogoWordmark fill="rgba(255,255,255,0.55)" />
          </div>
          <div className={styles.cornerTextStack}>
            <p className={styles.cornerText}>{siteConfig?.homeHeroTitle ?? 'The makers and purveyors of\nhigh quality brands, content, and digital products'}</p>
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
        <div className={`${styles.block} ${styles.r169} ${styles.heroBlock}`} style={{ gridColumn: '1 / span 9', cursor: 'pointer' }} onClick={() => setReelOpen(true)}>
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
        {blockLink('002', `${styles.block} ${styles.r45} ${styles.blockLink} ${styles.wwCard}`, { gridColumn: '10 / span 3' }, <>
          {blockMedia('002')}
          <span className={styles.label}>002</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('002')}</p>
        </>)}
      </section>

      {/* Row 2 */}
      <section className={styles.row12}>
        {blockLink('003', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '2 / span 3' }, <>
          {blockMedia('003')}
          <span className={styles.label}>003</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('003') || 'Oxyle'}</p>
        </>)}
        {blockLink('004', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '5 / span 5' }, <>
          {blockMedia('004')}
          <span className={styles.label}>004</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('004') || 'Deep Dive Films'}</p>
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
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '1 / span 7' }}>
          <img src={sanityImg("https://cdn.sanity.io/images/ppq16wpu/production/7ea8fad6d92324bb7ed52d4a260da47580a06d8c-2001x1096.png", { w: 1400 })} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className={styles.label}>010</span>
        </div>
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
        {blockLink('015', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('015')}
          <span className={styles.label}>015</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('015')}</p>
        </>)}
        {blockLink('016', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '7 / span 3' }, <>
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
        {blockLink('020', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '3 / span 3' }, <>
          {blockMedia('020')}
          <span className={styles.label}>020</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('020')}</p>
        </>)}
        {blockLink('021', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '6 / span 3' }, <>
          {blockMedia('021')}
          <span className={styles.label}>021</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('021')}</p>
        </>)}
        {blockLink('022', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '9 / span 3' }, <>
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
        {blockLink('026', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('026')}
          <span className={styles.label}>026</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('026')}</p>
        </>)}
        {blockLink('027', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('027')}
          <span className={styles.label}>027</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('027')}</p>
        </>)}
        {blockLink('028', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('028')}
          <span className={styles.label}>028</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('028')}</p>
        </>)}
        {blockLink('029', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
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
        {blockLink('036', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('036')}
          <span className={styles.label}>036</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('036')}</p>
        </>)}
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

      {/* Row 15 */}
      <section className={styles.row12}>
        {blockLink('053', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '3 / span 8' }, <>
          {blockMedia('053')}
          <span className={styles.label}>053</span>
          <span className={styles.csTag}>Visit Site</span>
          <p className={styles.blockTitle}>Deep Dive Films</p>
        </>)}
      </section>

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

      {toast && <div key={toast.ts} className={styles.toast} role="status" aria-live="polite">{toast.msg}</div>}

    </main>

</>
  )
}
