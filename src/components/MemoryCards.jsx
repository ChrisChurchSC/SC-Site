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
    .map((name) => inputGroups.find((g) => g.name === name))
    .filter(Boolean)
  const max = Math.max(...groups.map((g) => g.items.length), markers.length)
  return [
    ...groups.map((g) => ({
      name: g.name,
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

/* USAGE — what there is to read, charted five ways, in the shape of the app's
   own dashboard.

   NOT ONE INVENTED NUMBER IN IT, which is the whole reason this card can carry
   "From SC-Brand" instead of a Sample data tag. Every figure is computed here
   from src/data/brandCorpus.js, which was generated by reading the working
   copy: 33 files, five folders, five file types, ~78,759 tokens. The charts
   cannot disagree with the map further down the page because they are the same
   numbers.

   WHAT IT STILL DOES NOT CLAIM. Nothing anywhere records how often a file was
   actually read, so there is no usage-over-time chart and there should not be
   one — a sparkline of invented reads on the page arguing the record is real
   would be the worst line on this site. Every chart here answers "what is
   there to read", which is a question the disk can answer. */
const FOLDER_COLORS = ['#8b52e0', '#7040c4', '#5a33a6', '#42277d', '#2a1a4d']

const STATS = (() => {
  const folders = new Set()
  const types = new Set()
  let tokens = 0
  for (const f of corpus) {
    folders.add(f.path.split('/')[0])
    types.add(f.path.slice(f.path.lastIndexOf('.')))
    tokens += f.tokens
  }
  return { files: corpus.length, tokens, folders: folders.size, types: types.size }
})()

/* Files per folder, for the ring. */
const BY_FOLDER = (() => {
  const counts = {}
  for (const f of corpus) {
    const area = f.path.split('/')[0]
    counts[area] = (counts[area] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .map((row, i) => ({ ...row, color: FOLDER_COLORS[i] }))
})()

/* Tokens per folder, which is a different ranking from file count — Strategy
   holds twelve files and nearly half the words. Worth its own chart for
   exactly that reason. */
const TOKENS_BY_FOLDER = (() => {
  const sums = {}
  for (const f of corpus) {
    const area = f.path.split('/')[0]
    sums[area] = (sums[area] || 0) + f.tokens
  }
  const rows = Object.entries(sums).map(([name, tokens]) => ({ name, tokens }))
    .sort((a, b) => b.tokens - a.tokens)
  const max = rows[0].tokens
  return rows.map((r) => ({ ...r, fill: r.tokens / max }))
})()

/* What the memory is made of, by extension. */
const BY_TYPE = (() => {
  const counts = {}
  for (const f of corpus) {
    const ext = f.path.slice(f.path.lastIndexOf('.'))
    counts[ext] = (counts[ext] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .map((row, i) => ({ ...row, color: FOLDER_COLORS[i] }))
})()

const LARGEST = corpus.slice(0, 3).map((f) => ({
  name: f.path.split('/').pop(),
  tokens: f.tokens,
  fill: f.tokens / corpus[0].tokens,
}))

const kilo = (n) => `${Math.round(n / 100) / 10}k`

function UsagePreview() {
  /* r chosen so the circumference is 100 and a segment's length is its own
     percentage — no arithmetic to get wrong at render time. */
  const R = 15.9155
  let offset = 0

  return (
    <div className={`${styles.pane} ${styles.paneDense}`}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Read from memory</span>
        <span className={styles.ok}>From SC-Brand</span>
      </div>

      <div className={styles.statStrip}>
        {[
          ['Files', STATS.files],
          ['Tokens', kilo(STATS.tokens)],
          ['Folders', STATS.folders],
          ['Types', STATS.types],
        ].map(([label, value]) => (
          <div key={label} className={styles.statCell}>
            <p className={styles.statLabel}>{label}</p>
            <p className={styles.statNum}>{value}</p>
          </div>
        ))}
      </div>

      <div className={styles.chartRow}>
        <div className={styles.donutWrap}>
          <svg className={styles.donut} viewBox="0 0 42 42" aria-hidden="true">
            {BY_FOLDER.map(({ name, count, color }) => {
              const len = (count / STATS.files) * 100
              const el = (
                <circle
                  key={name}
                  cx="21"
                  cy="21"
                  r={R}
                  fill="none"
                  stroke={color}
                  strokeWidth="6"
                  strokeDasharray={`${len} ${100 - len}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += len
              return el
            })}
          </svg>
          <span className={styles.donutTotal}>{STATS.files}</span>
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

      <div className={styles.chartBlock}>
        <p className={styles.tlabel}>Tokens by folder</p>
        {TOKENS_BY_FOLDER.map(({ name, tokens, fill }) => (
          <div key={name} className={styles.miniRow}>
            <span className={styles.miniName}>{name}</span>
            <span className={styles.miniTrack}>
              <i className={styles.miniFill} style={{ width: `${Math.round(fill * 100)}%` }} />
            </span>
            <span className={styles.miniNum}>{kilo(tokens)}</span>
          </div>
        ))}
      </div>

      <div className={styles.chartBlock}>
        <p className={styles.tlabel}>By file type</p>
        <div className={styles.stack}>
          {BY_TYPE.map(({ name, count, color }) => (
            <i
              key={name}
              className={styles.stackSeg}
              style={{ width: `${(count / STATS.files) * 100}%`, background: color }}
            />
          ))}
        </div>
        <div className={styles.chips}>
          {BY_TYPE.map(({ name, count, color }) => (
            <span key={name} className={styles.chip}>
              <span className={styles.swatch} style={{ background: color }} />
              {name} {count}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chartBlock}>
        <p className={styles.tlabel}>Largest</p>
        {LARGEST.map(({ name, tokens, fill }) => (
          <div key={name} className={styles.miniRow}>
            <span className={styles.miniName}>{name}</span>
            <span className={styles.miniTrack}>
              <i className={styles.miniFill} style={{ width: `${Math.round(fill * 100)}%` }} />
            </span>
            <span className={styles.miniNum}>{kilo(tokens)}</span>
          </div>
        ))}
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
