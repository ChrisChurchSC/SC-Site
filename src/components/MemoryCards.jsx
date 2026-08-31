import styles from './MemoryCards.module.css'
import { Card } from './PlatformCards'
import { decisions } from '../data/decisions'
import { inputGroups, inputCount } from '../data/brandInputs'

/**
 * DEFINE, GOVERNANCE, USAGE — the three under the hero on /platform/memory,
 * named by Chris.
 *
 * THE THREE ARE A SEQUENCE, not a list, and the cards are ordered to say so:
 * the brand gets written down, changes to it go past a person, and everything
 * downstream reads from the result. Each one is still argued as the thing it
 * fixes rather than the thing it is — re-briefing, silent edits, and work that
 * drifts because nobody could see the source.
 *
 * THE CARD IS THE PLATFORM CARD, borrowed rather than rebuilt — a page in this
 * family that drew its own version would be two designs of one thing.
 *
 * WHAT IS REAL AND WHAT IS NOT, which matters more on this page than any
 * other. GOVERNANCE draws the spelling decision out of src/data/decisions.js:
 * that decision was made, on that date, and those three replacements are three
 * of the twelve it actually caused — so it needs no tag. DEFINE and USAGE draw
 * product surfaces nobody has built yet and carry the Sample data tag the rest
 * of the site uses. The counts in DEFINE come from src/data/brandInputs.js, so
 * they agree with the hero window above.
 *
 * THE HEADLINES ARE MINE AND UNAPPROVED.
 */

const SPELLING = decisions.find((d) => d.id === 'us-spelling')

/* DEFINE. What the brand knows, written down once — so no job starts by
   reconstructing it from whoever is in the room. */
function DefinePreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>SC-Brand / Inputs</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <p className={styles.quote}>
        The brand written down once, instead of re-briefed every time.
      </p>

      <div className={styles.lines}>
        {inputGroups.slice(0, 4).map(({ group, items }) => (
          <span key={group} className={styles.add}>
            <span className={styles.sign}>&rarr;</span>
            <span>{group} &nbsp;{items.length}</span>
          </span>
        ))}
      </div>

      <div className={styles.stamp}>
        <span>{inputGroups.length} groups</span>
        <span>{inputCount} defined</span>
      </div>
    </div>
  )
}

/* GOVERNANCE. Nothing lands without a person, and what did land says who and
   when. The mechanism is the sync CLI's own: a push opens a numbered review
   holding what the files would become and writes nothing live. */
function GovernancePreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>{SPELLING.path}</span>
        <span className={styles.ok}>Merged</span>
      </div>

      <p className={styles.quote}>{SPELLING.rule} {SPELLING.why}</p>

      {/* Three of the twelve, as they were actually made. A card that said
          "twelve replacements" without showing one is a claim about a claim. */}
      <div className={styles.lines}>
        {[['colour', 'color'], ['behaviour', 'behavior'], ['judgement', 'judgment']].map(([from, to]) => (
          <span key={from} className={styles.add}>
            <span className={styles.sign}>&rarr;</span>
            <span>{from} &nbsp;{to}</span>
          </span>
        ))}
      </div>

      <div className={styles.stamp}>
        <span>{SPELLING.date}</span>
        <span>{SPELLING.by}</span>
      </div>
    </div>
  )
}

/* USAGE. The point of defining it: the work pulls from the same source every
   time, without anyone policing it. */
function UsagePreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Write a launch post</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <p className={styles.quote}>
        Resolved from memory before a word was written.
      </p>

      <div className={styles.lines}>
        {['Positioning', 'Voice', 'Lexicon', 'Proof points'].map((token) => (
          <span key={token} className={styles.add}>
            <span className={styles.sign}>&rarr;</span>
            <span>{token}</span>
          </span>
        ))}
      </div>

      <div className={styles.stamp}>
        <span>No brief written</span>
        <span>{inputCount} available</span>
      </div>
    </div>
  )
}

const CARDS = [
  {
    id: 'define',
    lead: 'Define',
    rest: 'the brand once, in one place',
    preview: <DefinePreview />,
  },
  {
    id: 'governance',
    lead: 'Governance',
    rest: 'so nothing changes without a person',
    preview: <GovernancePreview />,
  },
  {
    id: 'usage',
    lead: 'Usage',
    rest: 'every job reads from the same source',
    preview: <UsagePreview />,
  },
]

export default function MemoryCards() {
  return (
    <div className={styles.rowThree}>
      {CARDS.map((c) => <Card key={c.id} size="small" {...c} />)}
    </div>
  )
}
