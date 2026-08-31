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
  {
    key: 'In your team',
    line: 'Working the platform beside your people rather than reporting into them from outside.',
  },
  {
    key: 'In your tools',
    line: 'The repo, the reviews and the agents your team already uses — the same ones we work in.',
  },
  {
    key: 'Handing it over',
    line: 'Standing things up, translating intent, and capturing decisions where they are made.',
  },
]

export default function EmbedSection() {
  return (
    <section className={styles.section} aria-labelledby="embed">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>[ Embedded ]</p>
        <h2 className={styles.headline} id="embed">
          Our people inside your team, not alongside it.
        </h2>
        <p className={styles.body}>
          The platform produces the work; somebody still has to run it. That is the
          arrangement here — our team in your tools, on your problems, until running it is
          something your people do without us in the room.
        </p>

        <dl className={styles.points}>
          {POINTS.map(({ key, line }) => (
            <div key={key} className={styles.point}>
              <dt className={styles.pointKey}>{key}</dt>
              <dd className={styles.pointLine}>{line}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.visual}>
        <AdoptWindow />
      </div>
    </section>
  )
}
