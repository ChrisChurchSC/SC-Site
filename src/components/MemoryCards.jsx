import styles from './MemoryCards.module.css'
import { Card } from './PlatformCards'
import { decisions, markers } from '../data/decisions'
import { inputGroups, inputCount } from '../data/brandInputs'
import { corpus } from '../data/brandCorpus'

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

/* DEFINE — the taxonomy as a table, in the shape Chris gave for it: a name, a
   number, a status and a bar that means something.

   THE COUNTS AND THE BARS ARE REAL. Each row is a group out of
   src/data/brandInputs.js and the bar is that group's share of the largest
   one, so Design at eight reads twice Evidence at three because it is. The
   last row is the four open markers out of decisions.js — conventions the repo
   actually runs on — which is what stops the table being four identical green
   rows. Pink on that row because pink is the thing being pointed at. */
const DEFINE_ROWS = (() => {
  const groups = ['Strategy', 'Design', 'Evidence']
    .map((name) => inputGroups.find((g) => g.group === name))
    .filter(Boolean)
  const max = Math.max(...groups.map((g) => g.items.length), markers.length)
  return [
    ...groups.map((g) => ({
      name: g.group,
      count: g.items.length,
      state: 'Defined',
      fill: g.items.length / max,
    })),
    { name: 'Open questions', count: markers.length, state: 'Open', open: true, fill: markers.length / max },
  ]
})()

function DefinePreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>SC-Brand / Inputs</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.table}>
        <div className={styles.thead}>
          <span>Input</span>
          <span className={styles.tnum}>Defined</span>
          <span className={styles.tstate}>Status</span>
        </div>

        {DEFINE_ROWS.map(({ name, count, state, open, fill }) => (
          <div key={name} className={styles.trow}>
            <span className={styles.tname}>{name}</span>
            <span className={styles.tnum}>{count}</span>
            <span className={open ? styles.pillOpen : styles.pill}>{state}</span>
            <span className={styles.bar}>
              <i
                className={open ? styles.barFillOpen : styles.barFill}
                style={{ width: `${Math.round(fill * 100)}%` }}
              />
            </span>
          </div>
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

/* USAGE — what gets read, by discipline, in the shape of the app's own
   dashboard.

   THIS ONE NEEDS NO SAMPLE TAG. Every number is the real corpus: 33 files
   across the five folders of the working copy, counted in
   src/data/brandCorpus.js. The ring is those five shares and the total in the
   middle is their sum, so the chart cannot disagree with the map further down
   the page.

   WHAT IT DOES NOT CLAIM. Nothing here counts how often a file was actually
   read — no such number is recorded anywhere, and a donut of invented reads on
   the page arguing that the record is real would be the worst possible place
   to put one. It shows what is there to be read, which is a fact. */
const FOLDER_COLORS = ['#8b52e0', '#7040c4', '#5a33a6', '#42277d', '#2a1a4d']

const BY_FOLDER = (() => {
  const counts = {}
  for (const f of corpus) {
    const area = f.path.split('/')[0]
    counts[area] = (counts[area] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, count], i) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .map((row, i) => ({ ...row, color: FOLDER_COLORS[i] }))
})()

const FILE_TOTAL = BY_FOLDER.reduce((n, r) => n + r.count, 0)

function UsagePreview() {
  /* r chosen so the circumference is 100 and a segment's length is its
     percentage — no arithmetic to get wrong at render time. */
  const R = 15.9155
  let offset = 0

  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Read from memory</span>
        <span className={styles.ok}>From SC-Brand</span>
      </div>

      <p className={styles.tlabel}>By discipline</p>

      <div className={styles.donutRow}>
        <div className={styles.donutWrap}>
          <svg className={styles.donut} viewBox="0 0 42 42" aria-hidden="true">
            {BY_FOLDER.map(({ name, count, color }) => {
              const len = (count / FILE_TOTAL) * 100
              const el = (
                <circle
                  key={name}
                  cx="21"
                  cy="21"
                  r={R}
                  fill="none"
                  stroke={color}
                  strokeWidth="5"
                  strokeDasharray={`${len} ${100 - len}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += len
              return el
            })}
          </svg>
          <span className={styles.donutTotal}>{FILE_TOTAL}</span>
        </div>

        <dl className={styles.legend}>
          {BY_FOLDER.map(({ name, count, color }) => (
            <div key={name} className={styles.legendRow}>
              <dt className={styles.legendKey}>
                <span className={styles.swatch} style={{ background: color }} />
                {name}
              </dt>
              <dd className={styles.legendNum}>{count}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.stamp}>
        <span>{FILE_TOTAL} files</span>
        <span>{BY_FOLDER.length} disciplines</span>
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
