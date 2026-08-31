import styles from './RepoCards.module.css'
import { Card } from './PlatformCards'

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
    </div>
  )
}

/* AND WHAT READS IT — a field of the things a folder of markdown opens in.

   Five models and six places files live. Every mark was opened and looked at;
   Google Drive, VS Code, Gemini and Copilot are absent because logo.dev
   returns the wrong company or a blank for each of them.

   THE LAYOUT IS FIXED RATHER THAN RANDOM: this site prerenders, and a scatter
   generated at render time would differ between the server pass and the
   client one. Marks repeat in the outer rings, where they are texture rather
   than a claim — which is also why those rings are faded. */
const M = {
  claude: '/marks/claude.png',
  chatgpt: '/marks/chatgpt.png',
  grok: '/marks/grok.png',
  perplexity: '/marks/perplexity.png',
  mistral: '/marks/mistral.png',
  notion: '/marks/notion.png',
  obsidian: '/marks/obsidian.png',
  cursor: '/marks/cursor.png',
  linear: '/marks/linear.png',
  dropbox: '/marks/dropbox.png',
  github: '/marks/github.png',
}

/* row, column, and which ring it is in. Ring 0 is the middle and reads at
   full strength; 2 is the edge and is nearly gone. */
const FIELD = [
  [0, 1, 2, M.dropbox], [0, 3, 2, M.notion], [0, 5, 2, M.linear],
  [1, 0, 2, M.github], [1, 2, 1, M.obsidian], [1, 4, 1, M.cursor], [1, 6, 2, M.mistral],
  [2, 1, 1, M.perplexity], [2, 3, 0, M.chatgpt], [2, 5, 1, M.notion],
  [3, 0, 2, M.linear], [3, 2, 0, M.claude], [3, 4, 0, M.cursor], [3, 6, 2, M.dropbox],
  [4, 1, 1, M.grok], [4, 3, 0, M.obsidian], [4, 5, 1, M.github],
  [5, 0, 2, M.mistral], [5, 2, 1, M.chatgpt], [5, 4, 1, M.claude], [5, 6, 2, M.perplexity],
  [6, 1, 2, M.cursor], [6, 3, 2, M.grok], [6, 5, 2, M.notion],
]

function MachinePreview() {
  return (
    <div className={`${styles.pane} ${styles.paneField}`}>
      <div className={styles.field}>
        {FIELD.map(([row, col, ring, src], i) => (
          <span
            key={i}
            className={`${styles.tile} ${styles['ring' + ring]}`}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
          >
            <img className={styles.tileImg} src={src} alt="" width="20" height="20" loading="lazy" />
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
