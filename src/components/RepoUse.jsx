import { FolderInput, Plug, ShieldCheck } from 'lucide-react'

import styles from './RepoUse.module.css'

/**
 * HOW YOU USE IT — the card on /platform/repo, in the panel shape the two
 * service pages use.
 *
 * TWO PATHS, KEPT APART ON PURPOSE. Chris described it as "drag and drop into
 * an LLM and it will connect", which is two different things said as one:
 *
 *   Dropping the folder in ATTACHES A COPY of the files as they were at that
 *   moment. It works today, in any model, with no setup — and it is stale the
 *   moment the brand moves.
 *
 *   Connecting over MCP READS THE LIVE ONE and can propose changes back as
 *   reviews. That is what the app already does with Claude Desktop.
 *
 * Collapsing the two would promise that a dropped folder stays current, which
 * it does not. The card leads with the drop because it is the one anybody can
 * do in the next minute, and names the connection as the step up.
 *
 * THE WORDING IS MINE AND UNAPPROVED.
 */
const WAYS = [
  {
    Icon: FolderInput,
    key: 'Drop it in',
    line: 'Drag the folder into Claude, ChatGPT or Grok. It reads your positioning, voice and approved claims as source. No setup, any model.',
    note: 'A copy, as it is right now.',
  },
  {
    Icon: Plug,
    key: 'Or connect it',
    line: 'Over MCP the model reads the live repo instead of a copy — and can propose changes back as reviews rather than telling you what it would change.',
    note: 'The current one, both ways.',
  },
  {
    Icon: ShieldCheck,
    key: 'Either way',
    line: 'It is plain files that you own. Readable without us, and not tied to whichever model is current this year.',
  },
]

export default function RepoUse() {
  return (
    <section className={styles.section} aria-labelledby="repo-use">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>[ How you use it ]</p>
          <h2 className={styles.headline} id="repo-use">
            Drop it into a model, or connect it.
          </h2>
          <p className={styles.body}>
            It is a folder of plain files, which is what makes it useful to a machine. The
            quickest version takes about ten seconds.
          </p>

          <dl className={styles.ways}>
            {WAYS.map(({ Icon, key, line, note }) => (
              <div key={key} className={styles.way}>
                <dt className={styles.wayKey}>
                  <Icon className={styles.wayIcon} aria-hidden="true" />
                  {key}
                </dt>
                <dd className={styles.wayLine}>
                  {line}
                  {note && <span className={styles.wayNote}>{note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The drop itself: a folder over a model's window, and what it knows
            once it lands. Decorative — the list beside it is the content. */}
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.drop}>
            <span className={styles.dropHead}>
              <span className={styles.dropCrumb}>Claude</span>
              <span className={styles.dropBadge}>Connected</span>
            </span>

            <span className={styles.dropZone}>
              <span className={styles.folder}>
                <FolderInput size={20} strokeWidth={1.4} />
                SC-Brand
              </span>
              <span className={styles.dropHint}>Drop to use as source</span>
            </span>

            <span className={styles.reads}>
              {['Strategy/positioning.md', 'Verbal/tone-of-voice.md', 'Agents/comms-writer.md', 'Data/metrics.csv'].map((f) => (
                <span key={f} className={styles.readRow}>
                  <span className={styles.readTick} />
                  {f}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
