import styles from './MemoryCards.module.css'
import { Card } from './PlatformCards'
import { decisions, markers } from '../data/decisions'
import { inputCount } from '../data/brandInputs'

/**
 * WHAT DEFINED TOKENS ACTUALLY SOLVE — the three under the hero on
 * /platform/memory.
 *
 * THESE USED TO DESCRIBE THE MECHANISM: a question is settled, the rejected
 * option is kept, the open one is visible. All true, and all answers to "what
 * does it do" rather than "what does it fix". A brand does not have a problem
 * called "our decisions are not written down" — it has three problems that
 * come FROM that, and those are the cards now:
 *
 *   Re-briefing. Every job starts by reconstructing what the brand is, from
 *   whoever happens to be in the room.
 *   Drift. Two people write the same thing two ways and neither is wrong,
 *   because nothing said which was right.
 *   Guessing. What nobody defined gets filled in silently, and reads as
 *   settled to the next person.
 *
 * THE CARD IS THE PLATFORM CARD, borrowed rather than rebuilt — a page in this
 * family that drew its own version would be two designs of one thing.
 *
 * WHAT IS REAL AND WHAT IS NOT. The second and third previews draw out of
 * src/data/decisions.js: the spelling decision and its replacements happened,
 * and the four markers are conventions the repo already runs on. The first
 * preview is a product surface nobody has built, so it carries the Sample data
 * tag the rest of the site uses. That line matters more on this page than
 * anywhere else, because the record below is the one thing here that needs no
 * tag at all.
 *
 * THE HEADLINES ARE MINE AND UNAPPROVED.
 */

const byId = (id) => decisions.find((d) => d.id === id)

const SPELLING = byId('us-spelling')

/* NOTHING GETS RE-BRIEFED. The job arrives and the tokens it needs are already
   there — which is the whole benefit of defining them once. INVENTED, and
   tagged: no such request surface exists yet. */
function ResolvedPreview() {
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
        <span>{inputCount} defined</span>
      </div>
    </div>
  )
}

/* NOTHING DRIFTS. One definition, and everything downstream agrees with it.
   REAL: this decision was made, and these are three of the twelve
   replacements it actually caused. */
function ConsistentPreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>{SPELLING.path}</span>
        <span className={styles.ok}>Defined</span>
      </div>

      <p className={styles.quote}>{SPELLING.rule} {SPELLING.why}</p>

      {/* A card that said "twelve replacements" without showing one would be a
          claim about a claim. */}
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

/* NOBODY GUESSES. The expensive failure is not a wrong answer, it is a missing
   one that reads as settled — so what is undefined is named and addressed to
   whoever can close it. REAL: these four are the repo's own conventions. */
function GapsPreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Not defined yet</span>
        <span className={styles.sample}>{markers.length} open</span>
      </div>

      <div className={styles.lines}>
        {markers.map(({ tag, owner }) => (
          <span key={tag} className={styles.add}>
            <span className={styles.sign}>[ ]</span>
            <span>{tag} &nbsp;{owner}</span>
          </span>
        ))}
      </div>

      <p className={styles.alt}>
        <span className={styles.altKey}>Why it matters</span>
        An unanswered question that looks answered is the one thing nobody
        thinks to check.
      </p>
    </div>
  )
}

const CARDS = [
  {
    id: 'resolved',
    lead: 'Stop',
    rest: 'briefing the brand in from scratch',
    preview: <ResolvedPreview />,
  },
  {
    id: 'consistent',
    lead: 'Say',
    rest: 'it the same way without policing it',
    preview: <ConsistentPreview />,
  },
  {
    id: 'gaps',
    lead: 'See',
    rest: 'what nobody has defined yet',
    preview: <GapsPreview />,
  },
]

export default function MemoryCards() {
  return (
    <div className={styles.rowThree}>
      {CARDS.map((c) => <Card key={c.id} size="small" {...c} />)}
    </div>
  )
}
