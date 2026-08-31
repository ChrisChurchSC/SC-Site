import { NavLink } from 'react-router-dom'

import styles from './PlatformLoop.module.css'
import { PLATFORM_PAGES } from './V3Nav'

/**
 * THE SIX, IN THE ORDER THEY ACTUALLY RUN — the hero of /platform.
 *
 * THE NAV IS AN INDEX; THIS IS A SEQUENCE. PLATFORM_PAGES is ordered for a
 * menu, where Repo and Agents lead because they are what somebody is looking
 * for. Work does not happen in that order: the repo holds the inputs, agents
 * draft from them, a person merges, the decision is recorded, the asset
 * lands, and the result comes back and changes the inputs. So the order here
 * is deliberate and different, and the return at the foot is the point —
 * this is the only page that gets to show the whole circuit.
 *
 * NAMES, NOTES AND LINKS COME FROM V3Nav rather than being retyped. If a row
 * is renamed or a page ships, the nav and this diagram move together; a
 * second hand-written copy of the six would be stale within a release. The
 * rows with no href render unlinked, exactly as the nav panel renders them.
 *
 * WHAT EACH ONE DOES IN THE LOOP is written here, because it is a different
 * sentence from the nav's: the menu says what a page is about, and this says
 * what the step hands to the next one.
 */

/* Working order, plus the handoff. Keyed to PLATFORM_PAGES by name. */
const SEQUENCE = [
  { name: 'Repo', hands: 'Holds what the brand is made of.' },
  { name: 'Agents', hands: 'Draft from it, and mark what they cannot back up.' },
  { name: 'Reviews', hands: 'A person merges. Nothing goes live on its own.' },
  { name: 'Memory', hands: 'The decision is written down with its reason.' },
  { name: 'Library', hands: 'What got made, and what each thing rests on.' },
  { name: 'Measurement', hands: 'What it moved — which changes the repo again.' },
]

const byName = (name) => PLATFORM_PAGES.find((p) => p.name === name)

export default function PlatformLoop() {
  return (
    <div className={styles.loop}>
      <ol className={styles.list}>
        {SEQUENCE.map(({ name, hands }, i) => {
          const page = byName(name)
          if (!page) return null
          const { Icon, href } = page

          const inner = (
            <>
              <span className={styles.icon}>
                {Icon && <Icon size={15} strokeWidth={1.5} aria-hidden="true" />}
              </span>
              <span className={styles.body}>
                <span className={styles.name}>
                  {name}
                  {!href && <span className={styles.soon}>Soon</span>}
                </span>
                <span className={styles.hands}>{hands}</span>
              </span>
            </>
          )

          return (
            <li key={name} className={styles.step}>
              <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
              {href
                ? <NavLink to={href} className={`${styles.row} ${styles.rowLink}`}>{inner}</NavLink>
                /* No page yet, so no link and no hover — the nav panel's rule. */
                : <span className={styles.row}>{inner}</span>}
            </li>
          )
        })}
      </ol>

      {/* The return. Without it this is a list of six features; with it, it is
          the argument — the last step feeds the first, which is why the brand
          gets better rather than just getting used. */}
      <p className={styles.return}>
        <span className={styles.returnMark} aria-hidden="true">↺</span>
        And the next round starts from what the last one proved.
      </p>
    </div>
  )
}
