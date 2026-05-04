import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Home.module.css'
import LogoWordmark from '../components/LogoWordmark'
import Loader from '../components/Loader'
import { useNav } from '../context/NavContext'
import { useSanity } from '../hooks/useSanity'
import { HOMEPAGE_GRID_QUERY } from '../lib/queries'
import { projects as staticProjects } from '../data/projects'

let didLoad = false

// Static fallback for every grid block: slug drives the NavLink, img drives the media
const BLOCK_MAP = {
  '002': { slug: 'big-buoy' },
  '003': { slug: 'oxyle',             img: '/grid/oxyle-hero-compressed.mp4' },
  '004': { slug: 'deep-dive-films' },
  '005': { slug: 'offchain' },
  '006': { slug: 'concis-labs' },
  '007': { slug: 'girlfight' },
  '008': { slug: 'arbitrum' },
  '009': {},
  '010': { slug: 'opentext' },
  '011': { slug: 'world-within',      img: '/grid/ww-sizzle-compressed.mp4' },
  '012': { slug: 'aris' },
  '013': { slug: 'smashburger',       img: '/grid/smashburger-compressed.mp4' },
  '014': { slug: 'transcend',           img: '/grid/transcend-compressed.mp4' },
  '015': { slug: 'starchase' },
  '016': { slug: 'photon' },
  '017': { slug: 'soft-science',      img: '/grid/soft-science-compressed.mp4' },
  '018': { slug: 'tbt',               img: '/grid/0421-compressed.mp4' },
  '019': { slug: 'nimruz',            img: '/grid/nimruz-logo-compressed.mp4' },
  '020': { slug: 'gigs',              img: '/grid/0421-compressed.mp4' },
  '021': { slug: 'heard' },
  '022': { slug: 'industry-standard' },
  '023': { slug: 'yellow-dog' },
  '024': { slug: 'wonderwerk' },
  '025': { slug: 'coldwater-club' },
  '026': { slug: 'path-projects' },
  '027': { slug: 'novi',              img: '/grid/novi-compressed.jpg' },
  '028': { slug: 'hylands' },
  '029': { slug: 'perm-agriculture' },
  '030': { slug: 'smallhold' },
  '031': { slug: 'entropy',           img: '/grid/empy-01-compressed.mp4' },
  '032': { slug: 'banzen' },
  '033': { slug: 'print-parlor' },
  '034': { slug: 'infura' },
  '035': { slug: 'helen-maroulis' },
  '036': { slug: 'kindling' },
  '037': { slug: 'fieldston' },
}

export default function Home() {
  const { menuOpen, setMenuOpen } = useNav()
  const { data: gridData } = useSanity(HOMEPAGE_GRID_QUERY)

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
    if (b?.mediaType === 'video' && b?.videoUrl) {
      const url = assetUrl(b.videoUrl)
      if (isImageUrl(url)) return <img src={url} alt="" style={mediaStyle} onError={e => e.target.style.display = 'none'} />
      return <video src={url} autoPlay muted loop playsInline style={mediaStyle} onError={e => e.target.style.display = 'none'} />
    }
    if (b?.mediaType === 'image' && b?.imageUrl) return (
      <img src={b.imageUrl} alt="" style={mediaStyle} onError={e => e.target.style.display = 'none'} />
    )
    const fallback = BLOCK_MAP[label]
    if (fallback?.img) {
      const url = assetUrl(fallback.img)
      if (isImageUrl(url)) return <img src={url} alt="" style={mediaStyle} />
      return <video src={url} autoPlay muted loop playsInline style={mediaStyle} />
    }
    return null
  }

  // Wrap block in NavLink/anchor — BLOCK_MAP wins; Sanity externalUrl still overrides
  const blockLink = (label, className, style, children) => {
    const b = grid[label]
    const count = workCount(label)
    const badge = count > 1 ? <span key="wb" className={styles.workBadge}>{count}</span> : null
    const inner = badge ? <>{children}{badge}</> : children
    if (b?.externalUrl) {
      const isInternal = b.externalUrl.startsWith('/')
      if (isInternal) return <NavLink to={b.externalUrl} className={className} style={style}>{inner}</NavLink>
      return (
        <a href={b.externalUrl} target="_blank" rel="noopener noreferrer" className={className} style={style}>
          <span className={styles.extIcon}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2h8v8M10 2 4 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          {inner}
        </a>
      )
    }
    const fallback = BLOCK_MAP[label]
    if (fallback?.slug) return (
      <NavLink to={`/work/${fallback.slug}`} className={className} style={style}>{inner}</NavLink>
    )
    if (b?.projectSlug) return (
      <NavLink to={`/work/${b.projectSlug}`} className={className} style={style}>{inner}</NavLink>
    )
    return <div className={className} style={style}>{inner}</div>
  }

  // Resolve project name — BLOCK_MAP slug drives the lookup
  const blockName = (label) => {
    const slug = BLOCK_MAP[label]?.slug ?? grid[label]?.projectSlug
    return slug ? staticProjects.find(p => p.slug === slug)?.name : null
  }

  // Count distinct work items for a project
  const workCount = (label) => {
    const slug = BLOCK_MAP[label]?.slug ?? grid[label]?.projectSlug
    return slug ? (staticProjects.find(p => p.slug === slug)?.work?.length ?? 0) : 0
  }

  const [loading, setLoading] = useState(!didLoad)
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
    <>
    {loading && <Loader onDone={() => { didLoad = true; setLoading(false) }} />}
    <main className={styles.main}>

      {/* Intro card */}
      <section className={`${styles.row12} ${styles.introRow}`}>
        <div className={styles.cornerNote} style={{ gridColumn: '1 / span 12' }}>
          <div className={styles.cornerWordmark}>
            <LogoWordmark fill="rgba(255,255,255,0.55)" />
          </div>
          <p className={styles.cornerText}>The makers of high quality<br />brands and content</p>
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
        <div className={`${styles.block} ${styles.r169} ${styles.heroBlock}`} style={{ gridColumn: '1 / span 9', cursor: 'pointer', backgroundImage: `url(${assetUrl('/reel-preview.gif')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => setReelOpen(true)}>
          <span className={styles.label}>Brand · Content · Web</span>
          <span className={styles.csTag}>Reel</span>
          <button className={styles.playBtn}>
            <svg width="7" height="8" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="currentColor"/>
            </svg>
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
        {blockLink('004', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '5 / span 3' }, <>
          {blockMedia('004')}
          <span className={styles.label}>004</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('004') || 'Deep Dive Films'}</p>
        </>)}
        {blockLink('005', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '9 / span 3' }, <>
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

      {/* Placeholder A */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '1 / span 7' }}>
          <span className={styles.label}>038</span>
        </div>
        <div className={`${styles.block} ${styles.r11}`} style={{ gridColumn: '8 / span 5' }}>
          <span className={styles.label}>039</span>
        </div>
      </section>

      {/* Row 4 */}
      <section className={styles.row12}>
        {blockLink('010', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '1 / span 5' }, <>
          {blockMedia('010')}
          <span className={styles.label}>010</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('010')}</p>
        </>)}
        {blockLink('011', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '7 / span 6' }, <>
          {blockMedia('011')}
          <span className={styles.label}>011</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('011')}</p>
        </>)}
      </section>

      {/* Row 5 */}
      <section className={styles.row12}>
        {blockLink('012', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('012')}
          <span className={styles.label}>012</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('012')}</p>
        </>)}
        {blockLink('013', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('013')}
          <span className={styles.label}>013</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('013')}</p>
        </>)}
        {blockLink('014', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('014')}
          <span className={styles.label}>014</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('014')}</p>
        </>)}
      </section>

      {/* Placeholder B */}
      <section className={styles.row12}>
        {['040','041','042'].map(n => (
          <div key={n} className={`${styles.block} ${styles.r45}`} style={{ gridColumn: 'span 4' }}>
            <span className={styles.label}>{n}</span>
          </div>
        ))}
      </section>

      {/* Row 6 */}
      <section className={styles.row12}>
        {blockLink('015', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('015')}
          <span className={styles.label}>015</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('015')}</p>
        </>)}
        {blockLink('016', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('016')}
          <span className={styles.label}>016</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('016')}</p>
        </>)}
        {blockLink('017', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '7 / span 3' }, <>
          {blockMedia('017')}
          <span className={styles.label}>017</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('017')}</p>
        </>)}
      </section>

      {/* Row 7 */}
      <section className={styles.row12}>
        {blockLink('018', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '3 / span 3' }, <>
          {blockMedia('018')}
          <span className={styles.label}>018</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('018')}</p>
        </>)}
        {blockLink('019', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '6 / span 3' }, <>
          {blockMedia('019')}
          <span className={styles.label}>019</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('019')}</p>
        </>)}
        {blockLink('020', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '9 / span 3' }, <>
          {blockMedia('020')}
          <span className={styles.label}>020</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('020')}</p>
        </>)}
      </section>

      {/* Placeholder C */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r169}`} style={{ gridColumn: '1 / span 12' }}>
          <span className={styles.label}>043</span>
        </div>
      </section>

      {/* Row 8 */}
      <section className={styles.row12}>
        {blockLink('021', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '1 / span 7' }, <>
          {blockMedia('021')}
          <span className={styles.label}>021</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('021')}</p>
        </>)}
        {blockLink('022', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '9 / span 3' }, <>
          {blockMedia('022')}
          <span className={styles.label}>022</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('022')}</p>
        </>)}
      </section>

      {/* Row 9 */}
      <section className={styles.row12}>
        {blockLink('023', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('023')}
          <span className={styles.label}>023</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('023')}</p>
        </>)}
        {blockLink('024', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('024')}
          <span className={styles.label}>024</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('024')}</p>
        </>)}
        {blockLink('025', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('025')}
          <span className={styles.label}>025</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('025')}</p>
        </>)}
        {blockLink('026', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('026')}
          <span className={styles.label}>026</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('026')}</p>
        </>)}
      </section>

      {/* Placeholder D */}
      <section className={styles.row12}>
        {['044','045','046'].map(n => (
          <div key={n} className={`${styles.block} ${styles.r916}`} style={{ gridColumn: 'span 4' }}>
            <span className={styles.label}>{n}</span>
          </div>
        ))}
      </section>

      {/* Row 10 */}
      <section className={styles.row12}>
        {blockLink('027', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '1 / span 3' }, <>
          {blockMedia('027')}
          <span className={styles.label}>027</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('027')}</p>
        </>)}
        {blockLink('028', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '4 / span 3' }, <>
          {blockMedia('028')}
          <span className={styles.label}>028</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('028')}</p>
        </>)}
        {blockLink('029', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '8 / span 4' }, <>
          {blockMedia('029')}
          <span className={styles.label}>029</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('029')}</p>
        </>)}
      </section>

      {/* Row 11 */}
      <section className={styles.row12}>
        {blockLink('030', `${styles.block} ${styles.r169} ${styles.blockLink}`, { gridColumn: '1 / span 12' }, <>
          {blockMedia('030')}
          <span className={styles.label}>030</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('030')}</p>
        </>)}
      </section>

      {/* Placeholder E */}
      <section className={styles.row12}>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '2 / span 4' }}>
          <span className={styles.label}>047</span>
        </div>
        <div className={`${styles.block} ${styles.r45}`} style={{ gridColumn: '7 / span 4' }}>
          <span className={styles.label}>048</span>
        </div>
      </section>

      {/* Row 12 */}
      <section className={styles.row12}>
        {blockLink('031', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('031')}
          <span className={styles.label}>031</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('031')}</p>
        </>)}
        {blockLink('032', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('032')}
          <span className={styles.label}>032</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('032')}</p>
        </>)}
        {blockLink('033', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('033')}
          <span className={styles.label}>033</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('033')}</p>
        </>)}
        {blockLink('034', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: 'span 3' }, <>
          {blockMedia('034')}
          <span className={styles.label}>034</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('034')}</p>
        </>)}
      </section>

      {/* Row 13 */}
      <section className={styles.row12}>
        {blockLink('035', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '1 / span 5' }, <>
          {blockMedia('035')}
          <span className={styles.label}>035</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('035')}</p>
        </>)}
        {blockLink('036', `${styles.block} ${styles.r916} ${styles.blockLink}`, { gridColumn: '6 / span 3' }, <>
          {blockMedia('036')}
          <span className={styles.label}>036</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('036')}</p>
        </>)}
        {blockLink('037', `${styles.block} ${styles.r45} ${styles.blockLink}`, { gridColumn: '9 / span 4' }, <>
          {blockMedia('037')}
          <span className={styles.label}>037</span>
          <span className={styles.csTag}>Case Study</span>
          <p className={styles.blockTitle}>{blockName('037')}</p>
        </>)}
      </section>

      {/* Placeholder F */}
      <section className={styles.row12}>
        {['049','050','051'].map(n => (
          <div key={n} className={`${styles.block} ${styles.r11}`} style={{ gridColumn: 'span 4' }}>
            <span className={styles.label}>{n}</span>
          </div>
        ))}
      </section>

      {reelOpen && (
        <div className={styles.reelOverlay} onClick={closeReel}>
          <button className={styles.reelClose} onClick={closeReel}>Close</button>
          <video
            ref={videoRef}
            src="/reel.mp4"
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

</>
  )
}
