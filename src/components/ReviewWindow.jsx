import styles from './ReviewWindow.module.css'

/**
 * THE REVIEW QUEUE — the screen for Build's "Review" step.
 *
 * THE MECHANISM IS REAL, and this draws it rather than dressing it up: a
 * push opens a numbered proposal holding what the files would become, it
 * writes nothing live, and a person merges it. That is what the sync CLI
 * actually does — `push` opens a review by default and `merge` is a separate,
 * human act.
 *
 * The three rows are sample, and the panel says so. What is NOT sample is the
 * shape: numbered, open until approved, and one of them already merged.
 */
const REVIEWS = [
  { n: '#128', title: 'Tone of voice — shorter sentences in product copy', by: 'comms-writer', state: 'open' },
  { n: '#127', title: 'Positioning — sharpen the second proof point', by: 'brand-strategist', state: 'open' },
  { n: '#126', title: 'Logo lockup — clear space on dark grounds', by: 'design-critic', state: 'merged' },
]

export default function ReviewWindow() {
  const open = REVIEWS.filter((r) => r.state === 'open').length

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Reviews</span>
        <span className={styles.badge}>Sample data</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Open</span>
        <span className={styles.tab}>Merged</span>
        <span className={styles.count}>{open} awaiting approval</span>
      </div>

      <ul className={styles.list}>
        {REVIEWS.map(({ n, title, by, state }) => (
          <li key={n} className={styles.row}>
            <span className={styles.num}>{n}</span>
            <span className={styles.body}>
              <span className={styles.title}>{title}</span>
              <span className={styles.by}>proposed by {by}</span>
            </span>
            <span className={state === 'merged' ? styles.merged : styles.open}>
              {state === 'merged' ? 'Merged' : 'Awaiting you'}
            </span>
          </li>
        ))}
      </ul>

      {/* The whole argument of the platform, in one line. */}
      <p className={styles.foot}>Nothing is live until a person merges it.</p>
    </div>
  )
}
