import { NavLink } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'
import { MOCK_PAGES } from '../lib/mockLandingPages'
import styles from './LandingIndex.module.css'

const CATEGORIES = [
  {
    label: 'Brand Systems',
    slugs: [
      'what-does-a-brand-system-include',
      'how-long-does-a-brand-system-take',
      'brand-system-cost',
      'brand-guidelines-vs-brand-system',
      'when-to-invest-in-a-brand-system',
      'what-is-a-verbal-identity',
      'brand-consistency-across-a-team',
    ],
  },
  {
    label: 'Content Programs',
    slugs: [
      'what-is-a-content-program',
      'how-to-build-a-b2b-content-program',
      'content-program-cost',
      'how-long-until-content-marketing-works',
      'what-is-a-thought-leadership-program',
      'how-to-measure-a-content-program',
    ],
  },
  {
    label: 'Digital Products',
    slugs: [
      'what-does-a-digital-product-design-engagement-include',
      'how-much-does-product-design-cost',
      'how-long-to-design-a-web-app',
      'design-system-vs-brand-system',
      'what-to-look-for-in-a-product-design-studio',
    ],
  },
  {
    label: 'Cross-vertical',
    slugs: [
      'brand-or-content-first',
      'do-i-need-a-brand-system-before-content',
      'creative-studio-vs-freelancer',
      'what-to-ask-a-creative-agency',
    ],
  },
]

export default function LandingIndex() {
  useMeta({ title: 'AEO Pages | Super Conscious', path: '/lp', noindex: true })

  return (
    <main className={styles.main}>
      <nav className={styles.topNav}>
        <NavLink to="/landing-pages" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10 7H4M4 7L7 4M4 7L7 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sales Hub
        </NavLink>
      </nav>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Index · AEO</p>
        <h1 className={styles.headline}>AEO Landing Pages</h1>
        <p className={styles.intro}>
          {Object.keys(MOCK_PAGES).length} pages targeting high-intent search and AI-generated answers. Organized by service line.
        </p>
      </header>

      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <div key={cat.label} className={styles.category}>
            <p className={styles.catLabel}>{cat.label}</p>
            <div className={styles.list}>
              {cat.slugs.map(slug => {
                const page = MOCK_PAGES[slug]
                if (!page) return null
                return (
                  <NavLink key={slug} to={`/lp/${slug}`} className={styles.item}>
                    <span className={styles.itemText}>{page.heroHeadline}</span>
                    <svg className={styles.itemIcon} viewBox="0 0 20 20" fill="none">
                      <path d="M4 16L16 4M16 4H8M16 4V12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
