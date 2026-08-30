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
 * THE CHANNEL FIGURES COME FROM src/data/dashboard.js, the one place the site
 * keeps its sample numbers, so this card and the window above it cannot
 * disagree. It carries the same Sample data tag. The other two previews have
 * no figures in them on purpose: what they show is a shape, and a shape does
 * not need a number to be honest.
 *
 * THE WORDING IS MINE AND UNAPPROVED.
 */

/* WHAT A RESULT IS ALLOWED TO BECOME. The marker is the point: brand-strategist
   will not invent a claim, so a proof point only lands when something behind
   it can be cited. */
function ProofPreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Strategy/proof-points.md</span>
        <span className={styles.ok}>Sourced</span>
      </div>
      <div className={styles.lines}>
        <span className={styles.add}>
          <span className={styles.sign}>+</span>
          <span>Email converts at 5.1%, ahead of paid social and organic.</span>
        </span>
        <span className={styles.meta}>90 days · 454 conversions · re-check quarterly</span>
      </div>
      <p className={styles.foot}>A claim the writer may now use, because it has something behind it.</p>
    </div>
  )
}

/* WHERE THE MONEY GOES NEXT. Scaled to the best of the three rather than to
   100, or three single-digit percentages render as three slivers and the
   comparison — the only thing this is for — disappears. */
function SpendPreview() {
  const best = Math.max(...dashboard.channels.map((c) => c.rate))
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
                style={{ width: `${Math.round((rate / best) * 100)}%` }}
              />
            </span>
            <span className={styles.barValue}>{rate}%</span>
          </span>
        ))}
      </div>
      <p className={styles.foot}>The next budget argues from this rather than from last year&rsquo;s split.</p>
    </div>
  )
}

/* AND WHAT THE NEXT BRIEF INHERITS. No figures — the claim here is that the
   carrying-over happens at all, which is a shape rather than a number. */
const CARRIES = [
  ['Starts from', 'the last quarter'],
  ['Proof points', 'carried forward'],
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
      <p className={styles.foot}>Nobody re-derives what was already settled.</p>
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
