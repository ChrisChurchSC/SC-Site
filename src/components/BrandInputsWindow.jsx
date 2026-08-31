import styles from './BrandInputsWindow.module.css'
import { inputColumns, inputCount } from '../data/brandInputs'

/**
 * WHAT A DEFINED BRAND HOLDS — the hero window on /platform/memory, from the
 * design Chris gave for it.
 *
 * THE PAGE IS ABOUT WHAT THE BRAND KNOWS, so the hero draws the inventory of
 * it rather than a list of decisions. Decisions are one row of this taxonomy
 * (Learned).
 *
 * WHAT THAT COST, stated because it is easy to lose track of: the decision
 * record used to be the permanent hero, and it was the only window on this
 * site carrying "From SC-Brand" instead of "Sample data". It is now only in
 * one step of How it works, which rotates, so it is on screen for six seconds
 * a cycle. Two of the three cards below still draw real entries out of
 * decisions.js, and the markers section is real, so the page has not become a
 * mock-up — but the strongest single fact on it is no longer permanently
 * visible, and putting the record back as its own section is worth a decision
 * rather than a default.
 *
 * IT CARRIES A SAMPLE DATA TAG, and that is deliberate rather than timid. Some
 * of these are files in the working copy today — positioning, voice, proof
 * points, audience, design tokens, decisions. Most are not: no lexicon, no
 * iconography or sound, no prompt library, no expiry dates. So "37 defined"
 * describes what the platform captures, not what SC-Brand currently contains,
 * and every unbuilt surface on this site says so in the same words. The
 * decision record below is the one window that needs no tag; keeping that
 * distinction sharp is what makes it worth anything.
 *
 * COUNTS ARE DERIVED from src/data/brandInputs.js so the number in the header
 * and the number of chips underneath cannot disagree.
 */
export default function BrandInputsWindow({ bare = false, ratio }) {
  return (
    <div
      className={`${styles.window}${bare ? ` ${styles.bare}` : ''}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Inputs</span>
        <span className={styles.badge}>Defined</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>All</span>
        <span className={styles.tab}>Open questions</span>
        <span className={styles.sample}>Sample data</span>
        <span className={styles.count}>{inputCount} defined</span>
      </div>

      <div className={styles.body}>
        {inputColumns.map((column, i) => (
          <div key={i} className={styles.column}>
            {column.map(({ group, items }) => (
              <section key={group} className={styles.group}>
                <p className={styles.groupHead}>
                  {group}
                  <span className={styles.groupCount}>{items.length}</span>
                </p>
                <div className={styles.chips}>
                  {items.map((item) => (
                    <span key={item} className={styles.chip}>{item}</span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
