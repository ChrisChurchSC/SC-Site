import styles from './InputsWindow.module.css'

/**
 * THE INPUTS, BEING DEFINED — the screen for Build's "Define" step.
 *
 * Define is not scoping a deliverable list; it is settling everything the
 * work will be made from. So this shows the inputs themselves, grouped by
 * the folder each one lands in.
 *
 * THE EIGHT GROUPS AND EVERY ITEM IN THEM ARE CHRIS'S, verbatim. This
 * previously showed the four repo folders, which are directory names; these
 * are the things actually being defined, which is what the step is about.
 *
 * LEGAL IS THE ONE WORTH NOTICING. Approved claims, disclaimers and expiry
 * dates are the machinery behind an agent refusing to invent a claim — the
 * only group here that can make a draft wrong rather than merely weak.
 */
const GROUPS = [
  { name: 'Strategy', items: ['Positioning', 'Voice', 'Lexicon', 'Narrative', 'Naming rules'] },
  { name: 'Goals', items: ['Business', 'Brand', 'Campaign', 'Asset-level'] },
  { name: 'Evidence', items: ['Proof points', 'Objections', 'Audience'] },
  { name: 'Legal', items: ['Approved claims', 'Disclaimers', 'Expiry dates'] },
  {
    name: 'Design',
    items: ['Tokens', 'Components', 'Iconography', 'Layout', 'Motion', 'Sound', 'Imagery direction', 'Illustration style'],
  },
  { name: 'Language', items: ['Headline patterns', 'Body copy', 'Microcopy', 'Dataviz conventions'] },
  { name: 'Learned', items: ['Decisions', 'Rejections with reasons', 'Exceptions', 'Candidate rules', 'Performance summary'] },
  { name: 'Operating', items: ['Channel specs', 'Agent definitions', 'Prompt library', 'Access rules', 'Provenance'] },
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
        {GROUPS.map(({ name, items }) => (
          <div key={name} className={styles.group}>
            <span className={styles.folder}>
              {name}
              <span className={styles.n}>{items.length}</span>
            </span>
            <div className={styles.chips}>
              {items.map((i) => <span key={i} className={styles.chip}>{i}</span>)}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
