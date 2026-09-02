import styles from './InputsWindow.module.css'
import { inputGroups, inputCount } from '../data/brandInputs'

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
 * THE LIST MOVED TO src/data/brandInputs.js and did not change. Three things
 * draw it now — this window on Build's Define step, the same window as the
 * memory hero, and the Define card — and a list copied into three files is a
 * list that will disagree with itself. The memory page briefly had a second
 * component drawing its own copy; this is that mistake being undone.
 *
 * LEGAL IS THE ONE WORTH NOTICING. Approved claims, disclaimers and expiry
 * dates are the machinery behind an agent refusing to invent a claim — the
 * only group here that can make a draft wrong rather than merely weak.
 */

/* The one being read right now. Named rather than random so the highlighted
   group and the scan line always agree. */
const READING = 'Strategy'

export default function InputsWindow({ reading = false, ratio }) {
  return (
    <div className={styles.window} style={ratio ? { aspectRatio: ratio } : undefined}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Inputs</span>
        <span className={styles.badge}>{reading ? 'Source' : 'Defined'}</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>All</span>
        {reading && <span className={styles.ro}>read-only</span>}
        <span className={styles.tab}>Open questions</span>
        <span className={styles.count}>{inputCount} defined</span>
      </div>

      {reading && (
        /* The act, not the artifact: what it is reading, and how far in. */
        <div className={styles.scan}>
          <span className={styles.scanDot} aria-hidden="true" />
          <span className={styles.scanText}>
            comms-writer is reading Strategy/positioning.md
          </span>
          <span className={styles.scanCount}>24 of 37</span>
        </div>
      )}

      <div className={styles.list}>
        {inputGroups.map(({ name, items }) => (
          <div key={name} className={`${styles.group}${reading && name === READING ? ' ' + styles.groupOn : ''}`}>
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
