import styles from './RepoCards.module.css'
import { Card } from './PlatformCards'
import { agents } from '../data/agents'

/**
 * THE THREE THINGS A REPO GIVES YOU — the cards under the hero on
 * /platform/repo, in the platform-card shape the other pages use.
 *
 * ALL THREE ARE DESCRIPTIONS OF THIS WORKING COPY rather than claims about a
 * product. One source: the files are the source, and everything else on this
 * site draws from them. Every change proposed: the sync CLI opens a numbered
 * review holding what the files would become and writes nothing live. Readable
 * by machines: the agent list in the third preview is the real one, read from
 * src/data/agents.js, which is also what the agents page and the homepage
 * card draw.
 *
 * THE WORDING IS MINE AND UNAPPROVED.
 */

/* One place, and what it holds. The paths are the ones this site already
   draws in its repo and diff windows. */
function SourcePreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>SC-Brand</span>
        <span className={styles.ok}>One source</span>
      </div>
      <div className={styles.lines}>
        {[
          ['Strategy/', 'positioning.md'],
          ['Verbal/', 'tone-of-voice.md'],
          ['Visual/', 'logo.svg'],
          ['Agents/', 'comms-writer.md'],
          ['Data/', 'metrics.csv'],
        ].map(([dir, file]) => (
          <span key={file} className={styles.fileRow}>
            <span className={styles.dir}>{dir}</span>
            <span className={styles.file}>{file}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* Nothing lands without a person. The states are the CLI's own: a push opens
   a review, merging is a person's job. */
function ReviewPreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Reviews</span>
        <span className={styles.ok}>2 open</span>
      </div>
      <div className={styles.rows}>
        <span className={styles.review}>
          <span className={styles.reviewNum}>#131</span>
          <span className={styles.reviewName}>What worked in Q3</span>
          <span className={styles.stateOpen}>Open</span>
        </span>
        <span className={styles.review}>
          <span className={styles.reviewNum}>#130</span>
          <span className={styles.reviewName}>Tone pass on the FAQ</span>
          <span className={styles.stateOpen}>Open</span>
        </span>
        <span className={styles.review}>
          <span className={styles.reviewNum}>#129</span>
          <span className={styles.reviewName}>Rate card update</span>
          <span className={styles.stateDone}>Merged</span>
        </span>
      </div>
      <p className={styles.foot}>Writes nothing live. Merging is a person&rsquo;s job.</p>
    </div>
  )
}

/* And what reads it. The six are the real ones. */
function MachinePreview() {
  return (
    <div className={styles.pane}>
      <div className={styles.paneHead}>
        <span className={styles.path}>Agents/</span>
        <span className={styles.ok}>Readable</span>
      </div>
      <div className={styles.rows}>
        {agents.map((a) => (
          <span key={a.name} className={styles.agentRow}>
            <span className={styles.file}>{a.name}.md</span>
            <span className={styles.tick}>Reads it</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const CARDS = [
  {
    id: 'source',
    lead: 'One source',
    rest: 'everything else is right against',
    preview: <SourcePreview />,
  },
  {
    id: 'reviews',
    lead: 'Every change',
    rest: 'proposed before it lands',
    preview: <ReviewPreview />,
  },
  {
    id: 'machines',
    lead: 'Readable',
    rest: 'by the tools you already use',
    preview: <MachinePreview />,
  },
]

export default function RepoCards() {
  return (
    <div className={styles.rowThree}>
      {CARDS.map((c) => <Card key={c.id} size="small" {...c} />)}
    </div>
  )
}
