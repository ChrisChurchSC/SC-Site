import styles from './PlatformIntro.module.css'
import { PLATFORM_PAGES } from './V3Nav'

/**
 * WHAT A BRAND PLATFORM IS — the first section under the hero.
 *
 * The format is the one Chris referenced: a small mono eyebrow, a headline
 * large enough to run to three lines, a short paragraph under it, and a wide
 * panel below carrying the picture. Everything is left-aligned and the
 * headline is deliberately allowed to wrap — the wrap is the layout.
 *
 * THE PANEL HOLDS THE SIX PLATFORM PAGES, not a decorative canvas. They are
 * read from PLATFORM_PAGES, the same list the nav and the pricing card use,
 * so a seventh capability appears here the moment it exists anywhere else.
 * The hero above already shows the repo, so repeating that window here would
 * have said the same thing twice.
 *
 * THE HEADLINE AND THE PARAGRAPH ARE MINE and have not been signed off. The
 * six names and their notes are existing copy.
 */
const EYEBROW = '[ The Platform ]'
const HEADLINE = 'Your brand, in one place you can open.'
const BODY =
  'A brand platform is the structure everything is made from — positioning, ' +
  'voice, assets, agents and data held together rather than scattered across ' +
  'drives and decks. It is what the work comes out of, and what it goes back into.'

export default function PlatformIntro() {
  return (
    <section className={styles.section} aria-labelledby="platform-intro">
      <p className={styles.eyebrow}>{EYEBROW}</p>
      <h2 className={styles.headline} id="platform-intro">{HEADLINE}</h2>
      <p className={styles.body}>{BODY}</p>

      {/* The dot field is the panel's own, masked at the foot so the grid
          fades rather than stopping on a line. */}
      <div className={styles.panel}>
        <div className={styles.grid}>
          {PLATFORM_PAGES.map(({ name, note }) => (
            <article key={name} className={styles.card}>
              <h3 className={styles.cardName}>{name}</h3>
              <p className={styles.cardNote}>{note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
