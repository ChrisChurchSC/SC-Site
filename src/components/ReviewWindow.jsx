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
 * THE ROWS ARE OUTPUTS. What waits in this queue is the work an agent drafted
 * — an email, a post, a concept — not the brand's inputs. A person authors
 * positioning and tone of voice; nobody approves an agent's edit to them,
 * because agents do not write them.
 *
 * The three rows are sample, and the panel says so. What is NOT sample is the
 * shape: numbered, open until approved, and one of them already merged.
 */
const REVIEWS = [
  { n: '#128', title: 'Launch email — platform announcement', by: 'comms-writer', state: 'open' },
  { n: '#127', title: 'Always-on post — week 3, LinkedIn', by: 'comms-writer', state: 'open' },
  { n: '#126', title: 'Q3 campaign concept — audience and angle', by: 'brand-strategist', state: 'merged' },
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

      {/* THE PERSON, AND THE DECISION IN FRONT OF THEM. The queue said
          changes were waiting; this is what "a person approves it" looks
          like. */}
      <div className={styles.approve}>
        <span className={styles.reviewer}>
          <span className={styles.reviewerAvatar} aria-hidden="true">CC</span>
          <span className={styles.reviewerText}>
            <span className={styles.reviewerName}>Reviewing #128</span>
            <span className={styles.reviewerNote}>Launch email — platform announcement</span>
          </span>
        </span>

        <span className={styles.actions}>
          <span className={styles.reject}>Request change</span>
          <span className={styles.merge}>Approve &amp; merge</span>
        </span>
      </div>
    </div>
  )
}
