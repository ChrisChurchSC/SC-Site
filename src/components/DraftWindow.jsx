import styles from './DraftWindow.module.css'

/**
 * A DRAFT WITH THE MARKER IN IT — the screen for "it drafts, and flags what
 * it cannot source".
 *
 * The step says the agent writes in your voice and stops where it cannot
 * source a claim. This shows exactly that: three lines of copy, and the
 * fourth replaced by the marker.
 *
 * [CLAIM NEEDED: …] IS REAL. It is a string these agents genuinely write, and
 * the brand's own notes call the markers the product rather than
 * boilerplate. The copy around it is sample, which the tag says.
 */
const LINES = [
  'Your brand already lives in a hundred places. This puts it in one.',
  'Every asset, every channel, drafted from the same source — so the tenth thing you ship this month sounds like the first.',
]

export default function DraftWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>Library / Copy /</span>
        <span className={styles.name}>launch-email.md</span>
        <span className={styles.badge}>Draft</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Draft</span>
        <span className={styles.tab}>Sources</span>
        <span className={styles.by}>by comms-writer</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.body}>
        {LINES.map((l) => <p key={l} className={styles.line}>{l}</p>)}

        {/* WHERE IT STOPPED. Set in place of the sentence it would have
            written, because that is where it appears in a real draft. */}
        <div className={styles.marker}>
          <span className={styles.markerKey}>[ CLAIM NEEDED ]</span>
          <span className={styles.markerBody}>
            “cuts production time by half” — no proof point in Strategy/. Source it, or cut
            the sentence.
          </span>
        </div>

        <p className={`${styles.line} ${styles.lineDim}`}>
          Book a demo and see it running on your own brand.
        </p>
      </div>

      <p className={styles.foot}>Two claims sourced · one flagged · nothing invented</p>
    </div>
  )
}
