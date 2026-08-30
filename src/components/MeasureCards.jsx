import styles from './MeasureCards.module.css'
import { Card } from './PlatformCards'
import { dashboard } from '../data/dashboard'

/**
 * WHAT MEASUREMENT DOES FOR THE BRAND — the three under the hero on
 * /platform/measurement.
 *
 * The card is the platform card, borrowed rather than rebuilt: same chrome,
 * same 4:5, same headline with the first word lit and the rest muted, same
 * arrow. A page in the same family that drew its own version of this card
 * would be two designs of one thing.
 *
 * THESE ARE THE THREE THINGS A NUMBER IS FOR. Not what the dashboard
 * displays — the page shows that above — but what having it changes about the
 * brand: a claim you are now allowed to make, a decision about where the
 * money goes, and a next round that starts from the last one instead of from
 * scratch. Each preview is the artifact that thing produces.
 *
 * EVERY FIGURE COMES FROM src/data/dashboard.js, the one place the site keeps
 * its sample numbers, so these cards and the window above them cannot
 * disagree. The card that shows figures carries the Sample data tag. The
 * other two show a shape rather than a number, which is the part that is true
 * whoever the client turns out to be.
 *
 * THE WORDING IS MINE AND UNAPPROVED.
 */

const [best, ...rest] = [...dashboard.channels].sort((a, b) => b.rate - a.rate)
const conversions = dashboard.stats.find((s) => s.label === 'conversions')?.value ?? '––'

/* WHAT A RESULT IS ALLOWED TO BECOME. The struck line is the argument: the
   claim was already being made, it just had nothing behind it. brand-strategist
   will not invent one, so this lands only because ninety days do. */
function ProofPreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Strategy/proof-points.md</span>
        <span className={styles.ok}>Sourced</span>
      </div>

      <div className={styles.lines}>
        <span className={styles.cut}>
          <span className={styles.sign}>–</span>
          <span>Our email marketing performs well.</span>
        </span>
        <span className={styles.add}>
          <span className={styles.sign}>+</span>
          <span>Email converts at {best.rate}%, ahead of paid social and organic.</span>
        </span>
        <span className={styles.add}>
          <span className={styles.sign}>+</span>
          <span>Source: 90 days, {conversions} conversions. Re-check quarterly.</span>
        </span>
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className={styles.rowKey}>Proposed by</dt>
          <dd className={styles.rowValue}>brand-strategist</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.rowKey}>Cited in</dt>
          <dd className={styles.rowValue}>2 drafts</dd>
        </div>
      </dl>

    </div>
  )
}

/* WHERE THE MONEY GOES NEXT. Scaled to the best of the three rather than to
   100, or three single-digit percentages render as three slivers and the
   comparison — the only thing this is for — disappears. */
function SpendPreview() {
  const topRate = Math.max(...dashboard.channels.map((c) => c.rate))
  const weeks = dashboard.weeks
  const peak = Math.max(...weeks)
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Conversion by channel</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.bars}>
        {dashboard.channels.map(({ name, rate }, i) => (
          <span key={name} className={styles.barRow}>
            <span className={styles.barName}>{name}</span>
            <span className={styles.track}>
              <span
                className={`${styles.fill}${i === 0 ? ' ' + styles.fillBest : ''}`}
                style={{ width: `${Math.round((rate / topRate) * 100)}%` }}
              />
            </span>
            <span className={styles.barValue}>{rate}%</span>
          </span>
        ))}
      </div>

      {/* The trend under the comparison: which way the whole thing is going,
          from the same eight weeks the dashboard charts. */}
      <div className={styles.trend}>
        <span className={styles.trendLabel}>Conversions, 8 weeks</span>
        <span className={styles.spark}>
          {weeks.map((v, i) => (
            <span key={i} className={styles.sparkBar} style={{ height: `${Math.round((v / peak) * 100)}%` }} />
          ))}
        </span>
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className={styles.rowKey}>Best</dt>
          <dd className={styles.rowValue}>{best.name}, {best.rate}%</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.rowKey}>Worst</dt>
          <dd className={styles.rowValue}>{rest[rest.length - 1].name}, {rest[rest.length - 1].rate}%</dd>
        </div>
      </dl>

    </div>
  )
}

/* AND WHAT THE NEXT BRIEF INHERITS. No figures — the claim here is that the
   carrying-over happens at all, which is a shape rather than a number. */
const CARRIES = [
  ['Starts from', 'the last quarter'],
  ['Proof points', '2 carried forward'],
  ['Tone', 'the version that landed'],
  ['Channels', 'ranked by what returned'],
]

function CompoundPreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Next brief</span>
        <span className={styles.ok}>Inherited</span>
      </div>

      <dl className={styles.rows}>
        {CARRIES.map(([k, v]) => (
          <div key={k} className={styles.row}>
            <dt className={styles.rowKey}>{k}</dt>
            <dd className={styles.rowValue}>{v}</dd>
          </div>
        ))}
      </dl>

      {/* The round before it, merged, and the round after — the loop as three
          beats rather than as a sentence about a loop. */}
      <div className={styles.chain}>
        <span className={styles.chainStep}>
          <span className={styles.chainDotDone} />
          <span className={styles.chainText}>Q3 results</span>
          <span className={styles.chainNote}>read</span>
        </span>
        <span className={styles.chainStep}>
          <span className={styles.chainDotDone} />
          <span className={styles.chainText}>Review #131</span>
          <span className={styles.chainNote}>merged</span>
        </span>
        <span className={styles.chainStep}>
          <span className={styles.chainDotNow} />
          <span className={styles.chainText}>Q4 brief</span>
          <span className={styles.chainNoteNow}>opens here</span>
        </span>
      </div>

    </div>
  )
}

const CARDS = [
  {
    id: 'prove',
    lead: 'Prove',
    rest: 'what the brand is allowed to claim',
    preview: <ProofPreview />,
  },
  {
    id: 'spend',
    lead: 'Spend',
    rest: 'where the work actually earns it',
    preview: <SpendPreview />,
  },
  {
    id: 'compound',
    lead: 'Compound',
    rest: 'so the next round starts further along',
    preview: <CompoundPreview />,
  },
]

export default function MeasureCards() {
  return (
    <div className={styles.rowThree}>
      {CARDS.map((c) => <Card key={c.id} size="small" {...c} />)}
    </div>
  )
}
