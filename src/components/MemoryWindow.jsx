import styles from './MemoryWindow.module.css'
import { decisions, openCount } from '../data/decisions'

/**
 * THE DECISION RECORD — the hero of /platform/memory.
 *
 * THE ONE WINDOW ON THIS SITE THAT IS NOT A MOCK-UP. The dashboard runs on
 * invented figures and says so; the review queue draws three plausible rows
 * and says so. This draws three decisions the studio actually made, on the
 * dates it made them, in the files they govern — so it carries "From SC-Brand"
 * where its siblings carry "Sample data". That difference is the page's
 * argument and it should not be quietly lost in a later restyle.
 *
 * WHY IS A FIELD, NOT A FOOTNOTE. The rule alone is what a repo already shows.
 * What no version history gives you is the sentence explaining why the rule
 * won, and it is the first thing lost when the person who decided it leaves.
 * So `why` renders on every row and `instead` renders wherever it exists.
 *
 * THE OPEN ROW IS DELIBERATELY LAST AND DELIBERATELY UGLY. A record that only
 * showed resolved questions would be a highlight reel, and a highlight reel
 * is exactly what a brand deck already is. The £-figures entry is the most
 * useful thing on the page precisely because it is unfinished.
 *
 * ROWS COME FROM src/data/decisions.js so this window and anything else that
 * draws them cannot disagree, and so the line references are checked in one
 * place. THE FRAMING COPY IS MINE AND UNAPPROVED; the decisions are Chris's.
 */
export default function MemoryWindow({ bare = false, ratio }) {
  return (
    <div
      className={`${styles.window}${bare ? ` ${styles.bare}` : ''}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Memory</span>
        {/* Not "Sample data". Every row below is real, and the tag is where
            the page says so. */}
        <span className={styles.badge}>From SC-Brand</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Decisions</span>
        <span className={styles.tab}>Open</span>
        <span className={styles.count}>
          {openCount} still open
        </span>
      </div>

      <ul className={styles.list}>
        {decisions.map(({ id, rule, date, path, by, state, why, instead, open }) => (
          <li key={id} className={styles.entry}>
            <div className={styles.entryHead}>
              <h3 className={styles.rule}>{rule}</h3>
              <span className={state === 'open' ? styles.stateOpen : styles.stateSettled}>
                {state === 'open' ? 'Open' : 'Settled'}
              </span>
            </div>

            <p className={styles.meta}>
              <span className={styles.path}>{path}</span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.date}>{date}</span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.by}>{by}</span>
            </p>

            <p className={styles.why}>{why}</p>

            {instead && (
              <p className={styles.instead}>
                <span className={styles.insteadKey}>Instead of</span>
                {instead}
              </p>
            )}

            {open && (
              <p className={styles.open}>
                <span className={styles.openKey}>Still open</span>
                {open}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
