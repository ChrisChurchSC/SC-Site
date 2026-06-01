import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'
import styles from './LandingHub.module.css'

const HUB_PASSWORD = 'sc-preview'
const SESSION_KEY = 'landing_hub_unlocked'

const TEMPLATES = [
  {
    slug: 'build-template',
    track: 'Build',
    name: 'Build landing page',
    body: 'Productized scopes for net-new web, brand, sales, and content work.',
  },
  {
    slug: 'grow-template',
    track: 'Grow',
    name: 'Grow landing page',
    body: 'Always-on programs for pipeline, conversion, and channel growth.',
  },
  {
    slug: 'agency-template',
    track: 'Agency',
    name: 'Agency landing page',
    body: 'White-labeled staff augmentation for agency partners.',
  },
]

export default function LandingHub() {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [manualUnlock, setManualUnlock] = useState(false)

  const sessionUnlocked = typeof localStorage !== 'undefined'
    && localStorage.getItem(SESSION_KEY) === '1'
  const unlocked = manualUnlock || sessionUnlocked

  useMeta({
    title: 'Sales Decks | Super Conscious',
    path: '/landing-pages',
    noindex: true,
  })

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pw === HUB_PASSWORD) {
      localStorage.setItem(SESSION_KEY, '1')
      setManualUnlock(true)
    } else {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 600)
    }
  }

  if (!unlocked) return (
    <main className={styles.main}>
      <div className={styles.gate}>
        <div className={styles.gateInner}>
          <p className={styles.gateLabel}>Sales Decks</p>
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
      <header className={styles.header}>
        <p className={styles.eyebrow}>Internal</p>
        <h1 className={styles.headline}>Sales Decks.</h1>
        <p className={styles.intro}>
          Sales decks organized by call type. Intro decks are for first conversations — broad, credibility-first. Service-line decks go deeper on a specific capability once you know what the prospect needs.
        </p>
      </header>
      <hr className={styles.divider} />

      <div className={styles.sections}>
        <div className={styles.callGroup}>
          <p className={styles.callLabel}>Intro Call</p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <p className={styles.cardTag}>Deck</p>
              <p className={styles.cardName}>Intro Brand Deck</p>
              <p className={styles.cardBody}>The first-call deck. Covers who we are, how we work, and the brands we build and grow. Use it to establish credibility before or after any introductory conversation.</p>
              <div className={styles.cardActions}>
                <NavLink to="/capabilities" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTag}>Deck · Agency</p>
              <p className={styles.cardName}>Intro Agency Deck</p>
              <p className={styles.cardBody}>White-labeled version of the intro deck, reframed for agency partners. Positions SC as a production partner rather than a competing studio.</p>
              <div className={styles.cardActions}>
                <NavLink to="/agency-capabilities" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.callGroup}>
          <p className={styles.callLabel}>Follow-up Call</p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <p className={styles.cardTag}>Deck · Brand</p>
              <p className={styles.cardName}>Brand Systems Deck</p>
              <p className={styles.cardBody}>Send this once you know the prospect needs brand work. Goes deep on identity, voice, visual systems, and sales enablement: scope, process, and deliverables.</p>
              <div className={styles.cardActions}>
                <NavLink to="/brand-systems" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTag}>Deck · Content</p>
              <p className={styles.cardName}>Content Programs Deck</p>
              <p className={styles.cardBody}>Send this once you know the prospect needs content. Covers social, video, ads, email, editorial, and copy. Shows how ongoing programs are structured and priced.</p>
              <div className={styles.cardActions}>
                <NavLink to="/content-programs" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTag}>Deck · Product</p>
              <p className={styles.cardName}>Digital Products Deck</p>
              <p className={styles.cardBody}>Send this once you know the prospect needs a website or digital product. Covers scope, process, and what it looks like to design and ship in one engagement.</p>
              <div className={styles.cardActions}>
                <NavLink to="/digital-products" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.callGroup}>
          <p className={styles.callLabel}>SEO · AEO</p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <p className={styles.cardTag}>Index · AEO</p>
              <p className={styles.cardName}>AEO Landing Pages</p>
              <p className={styles.cardBody}>22 pages targeting high-intent search and AI-generated answer surfaces. Organized by service line: Brand Systems, Content Programs, Digital Products, and cross-vertical questions.</p>
              <div className={styles.cardActions}>
                <NavLink to="/lp" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.callGroup}>
          <p className={styles.callLabel}>Post Call Send Through</p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <p className={styles.cardTag}>Catalog</p>
              <p className={styles.cardName}>Creative Production Catalog</p>
              <p className={styles.cardBody}>Full-service reference to send after the call. All 27 fixed-scope packages and 106 individual services across Content, Brand, and Digital, with deliverables and pricing context.</p>
              <div className={styles.cardActions}>
                <NavLink to="/content-packages" className={styles.cardArrow}>Open →</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
