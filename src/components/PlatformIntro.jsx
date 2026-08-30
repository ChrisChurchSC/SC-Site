import styles from './PlatformIntro.module.css'
import RepoWindow from './RepoWindow'

/**
 * WHAT A BRAND PLATFORM IS — the first section under the hero.
 *
 * The format is the one Chris referenced: a small mono eyebrow, a headline
 * large enough to run to three lines, a short paragraph under it, and a wide
 * panel below carrying the picture. Everything is left-aligned and the
 * headline is deliberately allowed to wrap — the wrap is the layout.
 *
 * THE PANEL HOLDS THE REPO ITSELF, big. The hero diagram shows the same
 * window small, as one of three columns; here it is the subject, which is
 * what the section is about. Same component, so the two cannot drift.
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
  return (
    <section className={styles.section} aria-labelledby="platform-intro">
      <p className={styles.eyebrow}>{EYEBROW}</p>
      <h2 className={styles.headline} id="platform-intro">{HEADLINE}</h2>
      <p className={styles.body}>{BODY}</p>

      {/* The dot field is the panel's own, masked at the foot so it fades
          rather than stopping on a line. */}
      <div className={styles.panel}>
        <RepoWindow big />

        {/* Over the window, not inside it — the hero uses the same component
            and must not get this.

            STILL NOT A CONTROL. There is no tour file in the repo, so the
            mark is decorative and the layer is pointer-events: none. It
            carried a "coming soon" caption until that was cut, so nothing on
            screen now says it does not play — worth a target before this
            goes anywhere a customer sees. */}
        <div className={styles.play}>
          <span className={styles.playMark} aria-hidden="true">
            <svg viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="21" fill="var(--pink, #df4ed6)" />
              <path d="M18 14.5l12 7.5-12 7.5z" fill="#0a0a0a" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  )
}
