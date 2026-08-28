import styles from './ComparisonTable.module.css'

/**
 * Competitive alternatives — what you get, and what you don't.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PROVENANCE. The first six rows and the headline are Chris's own copy from
 * the strategy doc's "3. Competitive Alternatives", reproduced verbatim,
 * including the curly apostrophes and the sentence fragments. Do not tidy
 * them here — if the wording needs work it is comms-writer's call, made in
 * Verbal/, not a silent edit in a component.
 *
 * Two rows are NOT his: FREELANCE and AI TOOLS, marked below. They were
 * added on request, written in the same shape and voice, and they are claims
 * about third parties made on our own site — brand-strategist signs those
 * off or strikes them. Everything in the first six is already approved copy.
 *
 * WHY THIS SHAPE BEAT THE LAST ONE. The previous table was five boolean
 * columns and a tick grid. Every column asked something of a *team*, so any
 * row that was not a team scored zero before anyone looked at it — the
 * AI-tools row in particular was five crosses by construction, which is
 * rhetorically loud and analytically empty. This structure cannot do that:
 * every alternative is credited with the thing it genuinely gives you before
 * it is marked down, so the argument is a trade-off rather than a verdict.
 * "Keep On Keeping On" is the strongest row for exactly that reason.
 *
 * WE ARE NOT A ROW, deliberately. The headline asks why you would spend on
 * us; the table answers by exhausting the alternatives. Adding an
 * all-green Super~Conscious row would turn an honest comparison back into a
 * scorecard.
 */

const ROWS = [
  {
    id: 'branding-studio',
    name: 'A Branding Studio',
    get: 'Top-notch identity and website',
    lack: 'Anything beyond that. You’ll have to wait and see how customers react.',
  },
  {
    id: 'performance-agency',
    name: 'A Performance Marketing Agency',
    get: 'Data-driven campaigns and brand-flavored messaging that convert',
    lack: 'Help with the upfront. If the ICP hasn’t been clearly defined or the web experience is subpar, all that engagement may go nowhere.',
  },
  {
    id: 'full-service',
    name: 'A Full-Service Agency',
    get: 'Strategy, branding, and creative all under one roof',
    lack: 'A reasonable fee and a team you’ll know by name (and talk to all the time).',
  },
  {
    id: 'fractional-cmo',
    name: 'A Fractional CMO',
    get: 'Senior strategic leadership',
    lack: 'Senior creative and production leadership to bring all of that good strategy to life.',
  },
  {
    id: 'in-house',
    name: 'An In-House Hire or Team',
    get: 'Total control, full-time attention',
    lack: 'The flexibility and long-term cost savings that overhead can never compete with.',
  },
  {
    /* NOT SIGNED OFF — written to request, in the doc's voice. */
    id: 'freelance',
    name: 'A Freelance Bench',
    get: 'A specific skill, on demand, at a rate you set',
    lack: 'Anyone holding the whole. You are the strategy, the brief and the quality bar — every time, for every one of them.',
  },
  {
    /* NOT SIGNED OFF — written to request, in the doc's voice. Credits the
       thing AI genuinely gives you, because a row of pure downside next to
       tools the reader uses daily reads as a lie about the reader, not about
       the tools. The downside is the site's existing position: "while AI
       helps us move faster, it doesn't do the thinking." */
    id: 'ai-tools',
    name: 'AI Tools',
    get: 'Volume, speed, and a first draft at almost no cost',
    lack: 'The judgment to know which draft was worth having. It will make you a hundred versions of the wrong thing, confidently.',
  },
  {
    id: 'status-quo',
    name: 'Keep On Keeping On',
    get: 'Nothing new, you’re just doing what you’ve been doing',
    lack: 'New leads, new wins, and new money flowing into your coffers.',
  },
]

export default function ComparisonTable({ eyebrow = '[ Competitive Alternatives ]' }) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>You have a finite budget. Why would you spend it on us?</h2>

      {/* Scrolls rather than squashing: three prose columns do not fit a
          phone, and a table that shrinks its own type to fit is unreadable
          before it is complete. */}
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner} scope="col">Alternative</th>
              <th className={styles.colHead} scope="col">What you get</th>
              <th className={styles.colHead} scope="col">What you don’t get</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ id, name, get, lack }) => (
              <tr key={id} className={styles.row}>
                <th className={styles.rowHead} scope="row">{name}</th>
                <td className={styles.cellGet}>{get}</td>
                <td className={styles.cellLack}>{lack}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
