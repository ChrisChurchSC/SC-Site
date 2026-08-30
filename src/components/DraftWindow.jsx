import styles from './DraftWindow.module.css'

/**
 * DRAFTING, IN CLAUDE CODE — the screen for "it drafts, and flags".
 *
 * IT IS A TERMINAL, because that is what Claude looks like: a title bar, a
 * prompt line, the agent working, and a status bar. Earlier versions of this
 * screen invented a document editor and then a chat panel, neither of which
 * exists — the platform does not ship a writing surface, the drafting
 * happens in Claude against the repo over MCP.
 *
 * WORDS AND STRATEGY, NOT VISUALS. What comes back is copy and the thinking
 * behind it. An agent does not make artwork, and a draft screen showing
 * layouts would claim it does.
 *
 * [CLAIM NEEDED: …] is a string these agents genuinely write, and the
 * brand's own notes call the markers the product rather than boilerplate.
 * The session around it is sample, which the tag says.
 */
export default function DraftWindow() {
  return (
    <div className={styles.window}>
      {/* The title bar, dots and all. */}
      <div className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true">
          <span className={styles.dotRed} />
          <span className={styles.dotAmber} />
          <span className={styles.dotGreen} />
        </span>
        <span className={styles.title}>SC-Brand — comms-writer — claude</span>
      </div>

      <div className={styles.body}>
        <p className={styles.prompt}>
          <span className={styles.caretGlyph}>›</span> draft the launch email for the platform
        </p>

        {/* What it read, before it wrote anything. */}
        <p className={styles.tool}>
          <span className={styles.bullet}>·</span> Read Verbal/tone-of-voice.md, Strategy/positioning.md
        </p>

        <p className={styles.out}>Your brand already lives in a hundred places. This puts it in one.</p>
        <p className={styles.out}>
          Every asset, every channel, drafted from the same source — so the tenth thing you
          ship this month sounds like the first.
        </p>

        {/* Where it stopped, in place of the sentence it would have written. */}
        <p className={styles.flag}>
          [CLAIM NEEDED: “cuts production time by half” — no proof point in Strategy/]
        </p>

        <p className={styles.out}>
          Book a demo and see it running on your own brand
          <span className={styles.caret} aria-hidden="true" />
        </p>

        <p className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          Composing… <span className={styles.dim}>(1 claim flagged)</span>
        </p>
      </div>

      <div className={styles.bar}>
        <span className={styles.barOn}>▸▸ mcp connected</span>
        <span className={styles.dim}>· SC-Brand · esc to interrupt</span>
        <span className={styles.sample}>Sample data</span>
      </div>
    </div>
  )
}
