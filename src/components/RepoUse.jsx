import { FolderInput, Plug, ShieldCheck } from 'lucide-react'

import styles from './RepoUse.module.css'
import ClaudeCodeWindow from './ClaudeCodeWindow'

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
    line: 'Drag the folder into any model. A copy of it, as it is right now.',
  },
  {
    Icon: Plug,
    key: 'Or connect it',
    line: 'Over MCP it reads the live one, and can propose changes back.',
  },
  {
    Icon: ShieldCheck,
    key: 'Either way',
    line: 'Plain files that you own, readable without us.',
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
            {WAYS.map(({ Icon, key, line }) => (
              <div key={key} className={styles.way}>
                <dt className={styles.wayKey}>
                  <Icon className={styles.wayIcon} aria-hidden="true" />
                  {key}
                </dt>
                <dd className={styles.wayLine}>
                  {line}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* HOW IT IS ACTUALLY USED: a terminal, pointed at the folder. The
            previous version drew a drop zone over an invented model window,
            which promised a product surface nobody has built. This is the
            real client doing the real thing, and the row under it names the
            other models honestly rather than implying three integrations. */}
        <div className={styles.visual} aria-hidden="true">
          <ClaudeCodeWindow />
        </div>
      </div>
    </section>
  )
}
