import { Layers, Palette, TrendingUp, Building2, Briefcase, Users, User, Bot, Repeat, Check, Minus, X } from 'lucide-react'

import styles from './ComparisonTable.module.css'

/**
 * Competitive alternatives — the options, scored.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOTHING IN THIS TABLE IS SIGNED OFF. Every row name and descriptor, every
 * pricing value and every mark in the grid is mine. Seven of the nine rows
 * are claims about third parties made on our own site — the sort of thing
 * brand-strategist exists to approve or refuse. Read the notes below before
 * shipping this to a real audience.
 *
 * WHAT USED TO BE HERE. The rows came from Chris's strategy doc, "3.
 * Competitive Alternatives", which scored each option in prose: "what you
 * get" and "what you don't get", verbatim and approved. Those two columns
 * were removed on request. THE APPROVED COPY NOW LIVES NOWHERE ON THE SITE.
 * It is the most defensible material this section ever had — the doc's
 * "A reasonable fee and a team you'll know by name (and talk to all the
 * time)" argues harder than any pip can — so it is worth finding it a home,
 * in Verbal/ or as an expanded row, rather than losing it to a git history.
 *
 * WHAT A GRID CANNOT DO. With the prose gone, the whole argument rests on
 * marks we assigned ourselves. That is fine as a scan and weak as evidence:
 * a reader who disagrees with one square has no sentence to argue with. The
 * scores below are pitched to be defensible rather than flattering, and two
 * in particular are load-bearing:
 *
 *   WE DO NOT SWEEP THE ROW. Scalability is a partial, because we stay small
 *   on purpose and turn work away. A row that takes every mark in a table we
 *   wrote ourselves is a scorecard, not a comparison.
 *
 *   FULL-SERVICE KEEPS QUALITY AND SCALE. The argument against it is fee and
 *   lock-in, not competence. Marking down the one alternative a reader has
 *   most likely used, to flatter our own strip, would be the tell.
 *
 * BRAND PLATFORM IS THE COLUMN THAT ONLY WE HOLD, and it is the honest one
 * to lead on: it describes a thing that exists rather than a virtue anyone
 * can claim. Note it is not a clean sweep either — a branding studio ships
 * guidelines, an in-house team has a drive somewhere, a full-service agency
 * runs a portal. Those are partials, not zeroes. The distance between a PDF
 * of guidelines and a live platform is the actual claim, and pretending
 * everyone else has nothing would make it easier to disbelieve, not harder.
 *
 * "AI & STRATEGY" BUNDLES A TOOL AND A DISCIPLINE, which is the weakest of
 * the seven axes: a fractional CMO is all strategy and no AI, AI tools are
 * the reverse, and both land on the same middle mark for opposite reasons.
 * Scored as asked. If it stays, splitting it in two would say more.
 *
 * THE PRICING COLUMN CARRIES NO RATES, ON PURPOSE. It names how you pay, not
 * what you pay. The only dollar figures available were the ones in the
 * competitive research, lifted from Designity's and Primary's own marketing,
 * and that research says of itself: "not verified — useful as a bar to know
 * about, not a standard to cite." A competitor's self-reported number about
 * a third party is two removes from a fact. Our own retainer figure nobody
 * has given me. Real ranges come from Chris, or they do not go in.
 */

/* One column each. Order is Chris's, with Brand platform added last because
   it is the one that ends the row on the thing only we have. */
const ATTRIBUTES = [
  { key: 'speed',    label: 'Speed' },
  { key: 'flex',     label: 'Flexibility' },
  { key: 'quality',  label: 'Quality' },
  { key: 'scale',    label: 'Scale' },
  { key: 'eff',      label: 'Efficiency' },
  { key: 'ai',       label: 'AI & Strategy' },
  { key: 'platform', label: 'Brand Platform' },
]

/* 2 = holds it, 1 = partly or depends who you get, 0 = does not. The middle
   state is not a hedge — for a freelance bench or an in-house hire the true
   answer really is "whoever you happened to hire", and flattening that to a
   yes or a no would be the invented part. */
const FULL = 2
const SOME = 1
const NONE = 0

const ROWS = [
  {
    id: 'super-conscious',
    us: true,
    Icon: Layers,
    name: 'Super~Conscious',
    note: 'One embedded team, brand through growth',
    /* Scale is deliberately a partial — see the note above. */
    attrs: [FULL, FULL, FULL, SOME, FULL, FULL, FULL],
    cost: 'Project or subscription',
  },
  {
    id: 'branding-studio',
    Icon: Palette,
    name: 'A Branding Studio',
    note: 'Identity specialists, project by project',
    /* Platform is a partial, not a zero: guidelines are a document, which is
       the same job done once and then frozen. */
    attrs: [SOME, NONE, FULL, NONE, SOME, NONE, SOME],
    cost: 'Project fee',
  },
  {
    id: 'performance-agency',
    Icon: TrendingUp,
    name: 'A Performance Marketing Agency',
    note: 'Media buyers with a creative team attached',
    attrs: [FULL, SOME, SOME, FULL, SOME, SOME, NONE],
    cost: 'Retainer + % of spend',
  },
  {
    id: 'full-service',
    Icon: Building2,
    name: 'A Full-Service Agency',
    note: 'Everything under one roof, at one roof’s price',
    attrs: [NONE, NONE, FULL, FULL, NONE, SOME, SOME],
    cost: 'Retainer, high minimum',
  },
  {
    id: 'fractional-cmo',
    Icon: Briefcase,
    name: 'A Fractional CMO',
    note: 'Senior leadership, part time',
    attrs: [SOME, SOME, FULL, NONE, SOME, SOME, NONE],
    cost: 'Day rate',
  },
  {
    id: 'in-house',
    Icon: Users,
    name: 'An In-House Hire or Team',
    note: 'Your own people, on your payroll',
    attrs: [SOME, NONE, SOME, NONE, NONE, SOME, SOME],
    cost: 'Salaries + overhead',
  },
  {
    id: 'freelance',
    Icon: User,
    name: 'A Freelance Bench',
    note: 'A roster you brief and manage yourself',
    attrs: [FULL, FULL, SOME, SOME, FULL, NONE, NONE],
    cost: 'Hourly, or per project',
  },
  {
    id: 'ai-tools',
    Icon: Bot,
    name: 'AI Tools',
    note: 'Software you drive yourself',
    /* Credits what AI genuinely gives you. A row of pure downside, next to
       tools the reader uses daily, reads as a lie about the reader rather
       than about the tools. */
    attrs: [FULL, FULL, NONE, FULL, FULL, SOME, NONE],
    cost: 'Per seat',
  },
  {
    id: 'status-quo',
    Icon: Repeat,
    name: 'Keep On Keeping On',
    note: 'Doing exactly what you’re doing now',
    attrs: [NONE, NONE, NONE, NONE, NONE, NONE, NONE],
    cost: 'Nothing new',
  },
]

const STATE_WORD = ['No', 'Partly', 'Strong']
const STATE_ICON = [X, Minus, Check]
const STATE_CLASS = ['markNone', 'markSome', 'markFull']

function Mark({ level, styles }) {
  const Glyph = STATE_ICON[level] ?? X
  return <Glyph className={styles[STATE_CLASS[level] ?? 'markNone']} size={16} strokeWidth={2} aria-hidden="true" />
}

export default function ComparisonTable({ eyebrow = '[ Competitive Alternatives ]' }) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>You have a finite budget. Why would you spend it on us?</h2>

      {/* Scrolls rather than squashing: nine columns do not fit a phone, and
          a table that shrinks its own type to fit is unreadable before it is
          complete. */}
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner} scope="col">Option</th>
              {ATTRIBUTES.map(a => (
                <th key={a.key} className={styles.attrHead} scope="col">{a.label}</th>
              ))}
              <th className={styles.colHead} scope="col">Pricing</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ id, name, note, Icon, attrs, cost, us }) => (
              <tr key={id} className={us ? `${styles.row} ${styles.rowUs}` : styles.row}>
                <th className={styles.rowHead} scope="row">
                  {/* The flex lives on the wrapper, not the cell: a display
                      other than table-cell takes the <th> out of the row's
                      height and its border stops short of the gridline. */}
                  <span className={styles.rowLabel}>
                    <Icon className={styles.rowIcon} size={15} strokeWidth={1.5} aria-hidden="true" />
                    <span>
                      <span className={styles.rowName}>{name}</span>
                      <span className={styles.rowNote}>{note}</span>
                    </span>
                  </span>
                </th>

                {ATTRIBUTES.map((a, i) => (
                  <td key={a.key} className={styles.cellAttr}>
                    {/* The mark is decorative; the word is what a screen
                        reader gets, so the table still reads as a table
                        rather than as a grid of unlabelled squares. */}
                    <Mark level={attrs[i]} styles={styles} />
                    <span className={styles.sr}>{STATE_WORD[attrs[i]] ?? 'No'}</span>
                  </td>
                ))}

                <td className={styles.cellCost}>{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.legend}>
        {[2, 1, 0].map(level => (
          <span key={level} className={styles.legendState}>
            <Mark level={level} styles={styles} />
            {STATE_WORD[level]}
          </span>
        ))}
      </p>
    </section>
  )
}
