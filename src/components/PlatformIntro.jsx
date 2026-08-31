import styles from './PlatformIntro.module.css'
import RepoWindow from './RepoWindow'
import AssetWindow from './AssetWindow'

/**
 * WHAT A BRAND PLATFORM IS — the first section under the hero.
 *
 * The format is the one Chris referenced: a small mono eyebrow, a headline
 * large enough to run to three lines, a short paragraph under it, and a wide
 * panel below carrying the picture. Everything is left-aligned and the
 * headline is deliberately allowed to wrap — the wrap is the layout.
 *
 * THE PANEL HOLDS A WINDOW, and which one depends on the service. Build
 * shows the repo itself, big — its hero shows the same window small as one
 * of three columns, and here it is the subject. Grow shows a single live
 * asset with its numbers beside it, because that is what Grow does with
 * what is in the repo: puts it out and watches it.
 *
 * THE HEADLINE AND THE PARAGRAPH ARE MINE and have not been signed off.
 */
const EYEBROW = '[ The Platform ]'
const HEADLINE = 'Your brand, in one place you can open.'
const BODY =
  'A brand platform is the structure everything is made from — positioning, ' +
  'voice, assets, agents and data held together rather than scattered across ' +
  'drives and decks. It is what the work comes out of, and what it goes back into.'

export default function PlatformIntro({ visual = 'repo' }) {
  return (
    <section className={styles.section} aria-labelledby="platform-intro">
      <p className={styles.eyebrow}>{EYEBROW}</p>
      <h2 className={styles.headline} id="platform-intro">{HEADLINE}</h2>
      <p className={styles.body}>{BODY}</p>

      {/* The dot field is the panel's own, masked at the foot so it fades
          rather than stopping on a line. */}
      <div className={styles.panel}>
        {visual === 'asset' ? <AssetWindow /> : <RepoWindow big />}

        {/* Over the window, not inside it — the hero uses the same component
            and must not get this.

            On BOTH windows now. It used to be suppressed over the asset view,
            where the triangle landed on the chart and covered the thing it
            was advertising — but Grow shows that view, so that page had no
            play button at all. The wash under the mark is the fix: with its
            own ground it reads against whatever is behind it.

            STILL NOT A CONTROL. There is no tour file in this repo, so it
            carries the same "Coming soon" tip the platform cards use rather
            than sitting there silently pretending to play something. */}
        <div className={styles.play}>
          <span className={styles.playMark} data-tip="Coming soon">
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <circle cx="22" cy="22" r="21" fill="var(--pink, #df4ed6)" />
              <path d="M18 14.5l12 7.5-12 7.5z" fill="#0a0a0a" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  )
}
