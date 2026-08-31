import { KeyRound, Users, Wrench } from 'lucide-react'

import styles from './EmbedSection.module.css'
import AdoptWindow from './AdoptWindow'

/**
 * THE EMBEDDED TEAM — its own section on /services/grow.
 *
 * It was the fifth step of that page's how-it-works, which made it one beat
 * in a sequence about producing work. It is not a stage the engagement passes
 * through and leaves behind: it is the arrangement the whole engagement runs
 * under, and it is the part Chris wants read rather than scrolled past. Out
 * of the sequence, on its own.
 *
 * WHAT IT CLAIMS is what the step already claimed, said at more length: our
 * people work inside your team, in your platform, and the job finishes with
 * your people running it. No headcount, no ratio, no response time — none of
 * that is recorded anywhere in this repo, and a number here would be the kind
 * of detail nobody checks.
 *
 * The window is the one the step used, so the picture of adoption does not
 * fork into two versions of itself.
 *
 * THE WORDING IS MINE AND UNAPPROVED.
 */
const POINTS = [
  { Icon: Users, key: 'In your team', line: 'Beside your people, not reporting in.' },
  { Icon: Wrench, key: 'In your tools', line: 'Your repo, your reviews, your agents.' },
  { Icon: KeyRound, key: 'Handing it over', line: 'Until you run it without us.' },
]

export default function EmbedSection() {
  return (
    <section className={styles.section} aria-labelledby="embed">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>[ Embedded ]</p>
          <h2 className={styles.headline} id="embed">
            Our people inside your team, not alongside it.
          </h2>
          <p className={styles.body}>
            The platform produces the work. Somebody still has to run it, and for a while
            that is us — beside your team rather than instead of it.
          </p>

          <dl className={styles.points}>
          {POINTS.map(({ Icon, key, line }) => (
            <div key={key} className={styles.point}>
              <dt className={styles.pointKey}>
                <Icon className={styles.pointIcon} aria-hidden="true" />
                {key}
              </dt>
              <dd className={styles.pointLine}>{line}</dd>
            </div>
          ))}
          </dl>
        </div>

        {/* Cropped by the panel's right edge rather than framed by it. */}
        <div className={styles.visual}>
          <AdoptWindow />
        </div>
      </div>
    </section>
  )
}
