import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useNav } from '../context/NavContext'
import { useComingSoon } from '../context/ComingSoonContext'
import { useProjects } from '../context/ProjectsContext'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useSanity } from '../hooks/useSanity'
import { HOMEPAGE_GRID_QUERY } from '../lib/queries'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'
import { BLOCK_MAP } from '../lib/blockMap'
import logoSrc from '../assets/logo.svg'
import './Nav.css'

export default function Nav() {
  const { menuOpen, setMenuOpen } = useNav()
  const { open: openCalDrawer } = useCalDrawer()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [workOpen, setWorkOpen] = useState(false)
  const projects = useProjects()
  const { data: gridData } = useSanity(HOMEPAGE_GRID_QUERY)
  const caseStudies = projects.all.filter(p => parseInt(p.n, 10) < 100 && !HIDDEN_SLUGS.has(p.slug))
  const comingSoon = useComingSoon()

  // Map project slug -> externalUrl for any homepage grid tile that links
  // out, so the side nav links to the same destination as the grid tile
  // (e.g. Big Buoy, Pubkey) instead of an empty /work/<slug> placeholder.
  const externalBySlug = {}
  Object.values(BLOCK_MAP).forEach(entry => {
    if (entry?.externalUrl && entry?.slug) externalBySlug[entry.slug] = entry.externalUrl
  })
  gridData?.blocks?.forEach(b => {
    if (!b.externalUrl) return
    const slug = BLOCK_MAP[b.label]?.slug ?? b.projectSlug
    if (slug) externalBySlug[slug] = b.externalUrl
  })

  const extIcon = (
    <span className="nav-cs-ext" aria-hidden="true">
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square"/>
      </svg>
    </span>
  )

  // Side-nav list (does not affect /work or the homepage): hide YouTube,
  // drop Coming Soon entries (unless they link out), sort alphabetically.
  const navCaseStudies = caseStudies
    .filter(cs => cs.slug !== 'youtube')
    .filter(cs => externalBySlug[cs.slug] || !(cs.slug && comingSoon.has(cs.slug)))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
  const [bgImage, setBgImage] = useState(null)
  const [hoveredN, setHoveredN] = useState(null)
  const intervalRef = useRef(null)
  const frameRef = useRef(0)

  const startCycling = (cs) => {
    setHoveredN(cs.n)
    if (!cs.images?.length) return
    clearInterval(intervalRef.current)
    frameRef.current = 0
    setBgImage(cs.images[0])
    intervalRef.current = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % cs.images.length
      setBgImage(cs.images[frameRef.current])
    }, 120)
  }

  const stopCycling = () => {
    clearInterval(intervalRef.current)
    setBgImage(null)
    setHoveredN(null)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <>
      {/* Right side nav */}
      <nav className="nav-side">
        {/* Head */}
        <div className="nav-top-bar">
          <NavLink to="/" className="nav-side-head">
            <img src={logoSrc} alt="Super Conscious" width={28} height={33} />
          </NavLink>
          <button
            type="button"
            className="nav-book-btn"
            onClick={() => {
              window.gtag?.('event', 'cta_click', { cta_location: 'nav' })
              openCalDrawer()
            }}
          >
            Book a discovery call
          </button>
        </div>

        {/* Gradient strips */}
        <div className="nav-gradient-blocks">
          <div className="nav-grad-block nav-grad-1" />
          <div className="nav-grad-block nav-grad-2" />
          <div className="nav-grad-block nav-grad-3" />
        </div>

        {/* Action cards */}
        <div className="nav-action-cards">
          <NavLink to="/about" className="nav-card">
            <div className="nav-card-text">
              <p className="nav-card-title">Services</p>
              <p className="nav-card-sub">Design, motion, engineering.</p>
            </div>
          </NavLink>

          {/* Sits under Services, above Thoughts. /work already existed
              as the case study index — this is the first card-level route
              into it; until now the only ways in were the "see all" link at
              the bottom of this list and the drawer's button. */}
          <NavLink to="/work" className="nav-card">
            <div className="nav-card-text">
              <p className="nav-card-title">Work</p>
              <p className="nav-card-sub">Selected case studies.</p>
            </div>
          </NavLink>

          <NavLink to="/thoughts" className="nav-card">
            <div className="nav-card-text">
              <p className="nav-card-title">Thoughts</p>
              <p className="nav-card-sub">Ideas, notes, and process.</p>
            </div>
          </NavLink>

          <div className="nav-card-pair">
            <NavLink to="/careers" className="nav-card">
              <div className="nav-card-text">
                <p className="nav-card-title">Careers</p>
                <p className="nav-card-sub">Join the team.</p>
              </div>
            </NavLink>
            <NavLink to="/contact" className="nav-card" onClick={() => window.gtag?.('event', 'cta_click', { cta_location: 'nav_contact' })}>
              <div className="nav-card-text">
                <p className="nav-card-title">Contact</p>
                <p className="nav-card-sub">Get in touch.</p>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Case study list */}
        <ul className="nav-cs-list">
          {navCaseStudies.slice(0, 20).map(({ name, type, slug }, idx) => {
            const num = String(idx + 1).padStart(3, '0')
            const ext = slug ? externalBySlug[slug] : null
            // An externalUrl tile links out regardless of coming-soon state,
            // matching the homepage grid.
            const isComingSoon = slug && comingSoon.has(slug) && !ext
            const isExternal = ext && !ext.startsWith('/')
            const inner = <>
              <span className="nav-cs-num">{num}</span>
              <span className="nav-cs-name">{name}{isExternal && extIcon}</span>
              <span className="nav-cs-type">
                {!isExternal && type}
                {isComingSoon && <span className="nav-cs-tag">Soon</span>}
              </span>
            </>
            const className = `nav-cs-item${isComingSoon ? ' nav-cs-item--coming-soon' : ''}`
            if (ext && !ext.startsWith('/')) return (
              <a key={slug} href={ext} target="_blank" rel="noopener noreferrer" className={className}>
                {inner}
              </a>
            )
            return slug && !isComingSoon ? (
              <NavLink key={slug} to={ext || `/work/${slug}`} className={className}>
                {inner}
              </NavLink>
            ) : (
              <li key={slug || num} className={className}>
                {inner}
              </li>
            )
          })}
          <li className="nav-cs-item nav-cs-all">
            {/* A real link, not a button. This was the only path to the case
                study list on desktop, and a <button> is not a crawlable edge:
                /work had zero inbound links while sitting in the sitemap at
                priority 0.9. The click still opens the drawer, so the
                behaviour visitors know is unchanged — but the href is real,
                so a crawler can follow it and cmd-click opens the page. */}
            <NavLink
              to="/work"
              className="nav-cs-see-all"
              onClick={(e) => { e.preventDefault(); setWorkOpen(true) }}
            >See all case studies →</NavLink>
          </li>
        </ul>

        {/* Socials */}
        <div className="nav-socials">
          <a href="https://www.instagram.com/_super_conscious/" target="_blank" rel="noreferrer" className="nav-social-link">Instagram</a>
          <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noreferrer" className="nav-social-link">LinkedIn</a>
          <NavLink to="/privacy" className="nav-social-link">Privacy</NavLink>
          <NavLink to="/terms" className="nav-social-link">Terms</NavLink>
        </div>
      </nav>

      {/* Mobile hamburger — hidden on homepage, Home renders its own card */}
      {!isHome && (
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span className={menuOpen ? 'nav-hamburger-line open' : 'nav-hamburger-line'} />
          <span className={menuOpen ? 'nav-hamburger-line open' : 'nav-hamburger-line'} />
        </button>
      )}

      {menuOpen && (
        <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
          <NavLink to="/about" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Services</NavLink>
          <NavLink
            to="/work"
            className="nav-mobile-link"
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); setWorkOpen(true) }}
          >Work</NavLink>
          <NavLink to="/thoughts" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Thoughts</NavLink>
          <NavLink to="/careers" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Careers</NavLink>
          <NavLink to="/contact" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <div className="nav-mobile-socials">
            <a href="https://www.instagram.com/_super_conscious/" target="_blank" rel="noreferrer" className="nav-mobile-social-link">Instagram</a>
            <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noreferrer" className="nav-mobile-social-link">LinkedIn</a>
          </div>
        </div>
      )}

      {/* Preview image — centered in viewport beside drawer */}
      {workOpen && bgImage && (
        <div className="work-overlay-bg" style={{ backgroundImage: `url(${bgImage})` }} />
      )}

      {/* Backdrop */}
      <div className={`work-backdrop${workOpen ? ' work-backdrop--open' : ''}`} onClick={() => setWorkOpen(false)} />

      {/* Drawer */}
      <div className={`work-drawer${workOpen ? ' work-drawer--open' : ''}`}>
        <div className="work-drawer-header">
          <span className="work-overlay-label">Selected Work · {hoveredN || caseStudies[0]?.n || '001'} / {String(caseStudies.length).padStart(3, '0')}</span>
          <button className="work-overlay-close-card" onClick={() => setWorkOpen(false)}>Close</button>
        </div>
        <div className="work-overlay-list">
          {caseStudies.map((cs) => {
            const ext = cs.slug ? externalBySlug[cs.slug] : null
            const isComingSoon = cs.slug && comingSoon.has(cs.slug) && !ext
            const isExternal = ext && !ext.startsWith('/')
            const inner = <>
              <span className="work-overlay-num">{cs.n}</span>
              <span className="work-overlay-name">{cs.name}{isExternal && extIcon}</span>
              <span className="work-overlay-type">
                {!isExternal && cs.type}
                {isComingSoon && <span className="work-overlay-tag">Soon</span>}
              </span>
            </>
            const className = `work-overlay-item${isComingSoon ? ' work-overlay-item--coming-soon' : ''}`
            const hover = { onMouseEnter: () => startCycling(cs), onMouseLeave: stopCycling }
            if (ext && !ext.startsWith('/')) return (
              <a
                key={cs._id}
                href={ext}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                {...hover}
                onClick={() => setWorkOpen(false)}
              >
                {inner}
              </a>
            )
            return cs.slug && !isComingSoon ? (
              <NavLink
                key={cs._id}
                to={ext || `/work/${cs.slug}`}
                className={className}
                {...hover}
                onClick={() => setWorkOpen(false)}
              >
                {inner}
              </NavLink>
            ) : (
              <div key={cs._id} className={className} {...hover}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
