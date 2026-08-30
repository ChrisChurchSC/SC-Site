import styles from './ScopeWindow.module.css'
import { serviceBySlug } from '../data/services'

/**
 * THE SCOPE, AS A WINDOW — the screen for Build's "Scope" step.
 *
 * It is the four Build pillars with what each one covers, read from
 * services.js. Nothing here is written: the pillar names and every
 * deliverable count come from the same list /pricing sells from, so a scope
 * screen cannot show a line the studio does not offer.
 *
 * NO PRICES ON IT. They were cut from the cards further down the page, and a
 * figure here would put them back in a quieter place.
 */
export default function ScopeWindow() {
  const build = serviceBySlug('build')
  const pillars = build?.pillars ?? []
  const total = pillars.reduce((n, p) => n + p.items.length, 0)

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Scope</span>
        <span className={styles.badge}>Agreed</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>In scope</span>
        <span className={styles.tab}>Timeline</span>
        <span className={styles.count}>{total} deliverables</span>
      </div>

      <ul className={styles.list}>
        {pillars.map(({ n, name, items }) => (
          <li key={n} className={styles.row}>
            <span className={styles.num}>{n}</span>
            <span className={styles.rowName}>{name}</span>
            <span className={styles.rowCount}>{items.length}</span>
            <span className={styles.check} aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </li>
        ))}
      </ul>

      <p className={styles.foot}>Priced before it starts. Nothing added without a conversation.</p>
    </div>
  )
}
