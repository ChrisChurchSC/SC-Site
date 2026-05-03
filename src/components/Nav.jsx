import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useContact } from '../context/ContactContext'
import { useNav } from '../context/NavContext'
import { projects as staticProjects } from '../data/projects'
import { useSanity } from '../hooks/useSanity'
import { PROJECTS_QUERY } from '../lib/queries'
import logoSrc from '../assets/logo.svg'
import './Nav.css'

const CONTACT_EMAIL = 'contact@super-conscious.studio'

const actionCards = [
  { label: 'Capabilities', sub: 'Brand, content, and product.',  to: '/about',    action: null },
  { label: 'Careers',      sub: 'Join the team.',                to: '/about-us', action: null },
  { label: 'Thoughts',     sub: 'Ideas, notes, and process.',    to: '/thoughts', action: null },
]

export default function Nav() {
  const { openContact } = useContact()
  const { menuOpen, setMenuOpen } = useNav()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [workOpen, setWorkOpen] = useState(false)
  const { data: sanityProjects } = useSanity(PROJECTS_QUERY)
  const caseStudies = sanityProjects?.length ? sanityProjects : staticProjects
  const [copied, setCopied] = useState(false)
  const [bgImage, setBgImage] = useState(null)
  const intervalRef = useRef(null)
  const frameRef = useRef(0)

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startCycling = (cs) => {
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
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <>
      {/* Right side nav */}
      <nav className="nav-side">
        {/* Head logo */}
        <NavLink to="/" className="nav-side-head">
          <img src={logoSrc} alt="Super Conscious" width={28} height={33} />
        </NavLink>

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
              <p className="nav-card-title">Capabilities</p>
              <p className="nav-card-sub">Brand, content, and product.</p>
            </div>
          </NavLink>

          <NavLink to="/thoughts" className="nav-card">
            <div className="nav-card-text">
              <p className="nav-card-title">Thoughts</p>
              <p className="nav-card-sub">Ideas, notes, and process.</p>
            </div>
          </NavLink>

          <div className="nav-card-pair">
            <NavLink to="/about-us" className="nav-card">
              <div className="nav-card-text">
                <p className="nav-card-title">Careers</p>
                <p className="nav-card-sub">Join the team.</p>
              </div>
            </NavLink>
            <div style={{ position: 'relative' }}>
              {copied && <span className="copy-bubble">Copied!</span>}
              <button className="nav-card nav-card--full" onClick={copyEmail}>
                <div className="nav-card-text">
                  <p className="nav-card-title">Contact</p>
                  <p className="nav-card-sub">Get in touch.</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Case study list */}
        <ul className="nav-cs-list">
          {caseStudies.slice(0, 20).map(({ n, name, type, year, slug }) => {
            const inner = <>
              <span className="nav-cs-num">{n}</span>
              <span className="nav-cs-name">{name}</span>
              <span className="nav-cs-type">{type}</span>
              <span className="nav-cs-year">{year}</span>
            </>
            return slug ? (
              <NavLink key={n} to={`/work/${slug}`} className="nav-cs-item">
                {inner}
              </NavLink>
            ) : (
              <li key={n} className="nav-cs-item">
                {inner}
              </li>
            )
          })}
          <li className="nav-cs-item nav-cs-all">
            <button className="nav-cs-see-all" onClick={() => setWorkOpen(true)}>See all case studies →</button>
          </li>
        </ul>

        {/* Socials */}
        <div className="nav-socials">
          <a href="https://www.instagram.com/_super_conscious/" target="_blank" rel="noreferrer" className="nav-social-link">Instagram</a>
          <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noreferrer" className="nav-social-link">LinkedIn</a>
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
          <NavLink to="/about" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>About</NavLink>
          <button className="nav-mobile-link" onClick={() => { setMenuOpen(false); setWorkOpen(true) }}>Work</button>
          <button className="nav-mobile-link" onClick={() => { setMenuOpen(false); openContact() }}>Contact</button>
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
          <span className="work-overlay-label">Selected Work — 001 / {String(caseStudies.length).padStart(3, '0')}</span>
          <button className="work-overlay-close-card" onClick={() => setWorkOpen(false)}>Close</button>
        </div>
        <div className="work-overlay-list">
          {caseStudies.map((cs) => {
            const inner = <>
              <span className="work-overlay-num">{cs.n}</span>
              <span className="work-overlay-name">{cs.name}</span>
              <span className="work-overlay-type">{cs.type}</span>
              <span className="work-overlay-year">{cs.year}</span>
            </>
            return cs.slug ? (
              <NavLink
                key={cs.n}
                to={`/work/${cs.slug}`}
                className="work-overlay-item"
                onMouseEnter={() => startCycling(cs)}
                onMouseLeave={stopCycling}
                onClick={() => setWorkOpen(false)}
              >
                {inner}
              </NavLink>
            ) : (
              <div
                key={cs.n}
                className="work-overlay-item"
                onMouseEnter={() => startCycling(cs)}
                onMouseLeave={stopCycling}
              >
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
