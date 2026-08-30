import styles from './InputsWindow.module.css'

/**
 * THE INPUTS, BEING DEFINED — the screen for Build's "Define" step.
 *
 * Define is not scoping a deliverable list; it is settling everything the
 * work will be made from. So this shows the inputs themselves, grouped by
 * the folder each one lands in.
 *
 * THE STRUCTURE IS THE REAL ONE. Strategy holds what is true — positioning,
 * audience, proof points, the messaging house, the competitive landscape.
 * Verbal holds how it sounds. Visual is the design system. Data is the
 * numbers. That split is set in the brand repo's own README and mirrors the
 * agent split: the strategist decides what may be claimed, the writer decides
 * how it is said.
 *
 * The states are sample. What is not sample is that these are the things
 * that get defined, and where each one ends up.
 */
const GROUPS = [
  {
    folder: 'Strategy/',
    items: ['Positioning', 'Audience', 'Proof points', 'Messaging house', 'Competitive landscape'],
  },
  {
    folder: 'Verbal/',
    items: ['Tone of voice', 'Copy standards'],
  },
  {
    folder: 'Visual/',
    items: ['Logo', 'Type', 'Color', 'Photography'],
  },
  {
    folder: 'Data/',
    items: ['Channels', 'Metrics'],
  },
]

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0)

export default function InputsWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Inputs</span>
        <span className={styles.badge}>Defined</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>All</span>
        <span className={styles.tab}>Open questions</span>
        <span className={styles.count}>{TOTAL} defined</span>
      </div>

      <div className={styles.list}>
        {GROUPS.map(({ folder, items }) => (
          <div key={folder} className={styles.group}>
            <span className={styles.folder}>{folder}</span>
            <div className={styles.chips}>
              {items.map((i) => (
                <span key={i} className={styles.chip}>
                  <svg className={styles.tick} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* The reason this step exists at all. */}
      <p className={styles.foot}>Everything the work gets made from, settled before it starts.</p>
    </div>
  )
}
