import styles from './PlatformIntro.module.css'
import PlatformFlow from './PlatformFlow'
import { useCalDrawer } from '../context/CalDrawerContext'

/**
 * WHAT A BRAND PLATFORM IS — the first section under the hero.
 *
 * The format is the one Chris referenced: a small mono eyebrow, a headline
 * large enough to run to three lines, a short paragraph under it, and a wide
 * panel below carrying the picture. Everything is left-aligned and the
 * headline is deliberately allowed to wrap — the wrap is the layout.
 *
 * THE PANEL HOLDS THE REVIEW LOOP as a canvas — see PlatformFlow. It is the
 * platform's actual argument: a change is drafted, proposed, approved by a
 * person, and only then does it land. The hero above already shows the repo
 * window, so repeating that here would have said the same thing twice.
 *
 * THE HEADLINE AND THE PARAGRAPH ARE MINE and have not been signed off.
 */
const EYEBROW = '[ The Platform ]'
const HEADLINE = 'Your brand, in one place you can open.'
const BODY =
  'A brand platform is the structure everything is made from — positioning, ' +
  'voice, assets, agents and data held together rather than scattered across ' +
  'drives and decks. It is what the work comes out of, and what it goes back into.'

export default function PlatformIntro() {
  const cal = useCalDrawer()

  return (
    <section className={styles.section} aria-labelledby="platform-intro">
      <p className={styles.eyebrow}>{EYEBROW}</p>
      <h2 className={styles.headline} id="platform-intro">{HEADLINE}</h2>
      <p className={styles.body}>{BODY}</p>

      <div className={styles.actions}>
        <button className={styles.cta} onClick={cal.open}>Book a demo</button>
      </div>

      {/* The dot field is the panel's own, masked at the foot so it fades
          rather than stopping on a line. */}
      <div className={styles.panel}>
        <PlatformFlow />
      </div>
    </section>
  )
}
