import { Palette, TrendingUp, Building2, Briefcase, Users, User, Bot, Repeat, Check, Minus, X } from 'lucide-react'

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
 * BRAND PLATFORM IS THE COLUMN ONLY WE HOLD, and it is the honest one to
 * lead on: it describes a thing that exists rather than a virtue anyone can
 * claim. Every other row is a cross, on Chris's call, and the call is right
 * on the definition that matters — a live system that holds the positioning,
 * drafts in the brand's voice and refuses to invent a claim is not a thing
 * any of these options ships.
 *
 * THE ONE COUNTER-FACT, RECORDED SO NOBODY HAS TO REDISCOVER IT: brand-portal
 * and DAM products exist and are widely sold — Frontify, Bynder, Brandfolder
 * — and a branding studio or a full-service agency will often stand a client
 * up on one. Those were the partials this column used to carry. They are
 * crosses now because a portal stores approved files and a brand platform
 * does the work: different products, not different sizes of the same one.
 *
 * WHICH PUTS THE WEIGHT ON THE COLUMN'S NAME. "Brand Platform" is loose
 * enough that an agency with a Frontify tenant could say it has one, and a
 * reader who thinks that is what the column means will read eight crosses as
 * a stretch. Naming the capability instead of the category — the thing about
 * drafting in voice and refusing unsourced claims — would make every cross
 * unarguable. Worth doing before this page meets an audience.
 *
 * THE AXES ARE STRUCTURAL, NOT VIRTUES. This table used to score Speed,
 * Flexibility, Quality, Scale, Efficiency and AI, and it did not
 * differentiate anything — those are the things every agency claims, they
 * are the exact five buckets the competitive research found every rival
 * leading with, and a reader has no way to check any of them. Worse, we
 * scored full marks on all of them, which is what a table written by its own
 * winner always looks like and is the fastest way to be disbelieved.
 *
 * These seven ask what an alternative can hold GIVEN WHAT IT IS. A branding
 * studio cannot run growth media; it is not worse at it, it is not that. A
 * rotating agency bench cannot be the same people. A fractional CMO cannot
 * execute. AI tools cannot own an outcome. Each cross has a reason a reader
 * can name without trusting us, which is the only kind of comparison worth
 * putting on your own site.
 *
 * THERE WAS A SEVENTH COLUMN AND IT IS GONE: "Cheapest option", which went
 * to AI tools, a freelance bench and doing nothing, and which we lost
 * visibly. Cut on request.
 *
 * WHICH MEANS OUR ROW NOW TAKES EVERY MARK. That is worth knowing rather
 * than worrying about: it was fatal when the axes were Speed, Quality and
 * Efficiency, because those are unfalsifiable and a clean sweep of them is
 * just a boast. These six are structural and a reader can check each one
 * against what they already believe about a branding studio or an agency
 * bench, so a sweep reads as a definition rather than a claim.
 *
 * It does still mean nothing on this table costs us anything, and cost is
 * the bucket the competitive research found every rival leading with. If it
 * ever reads as too tidy, that column is the fix, and it is honest.
 *
 * IN-HOUSE IS THE CLOSEST ROW AND SHOULD STAY THAT WAY. It holds the same
 * people, embedded, and owning the outcome, because a team you employ
 * genuinely does. What it does not hold is both disciplines at once, the
 * platform, and the path from strategy to execution without hiring for
 * every part of it. Marking it down to make our row look better would break
 * the one comparison a founder is most likely to be making in their head.
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
/* Our own mark, in place of a stock glyph on our own row. Inlined rather
   than <img>: the path is fill="currentColor", so it takes the pink from
   .rowIcon exactly as the lucide icons around it do, and an <img> could not.
   The clip id is namespaced because several pages inline this same mark and
   duplicate ids in one document would cross-clip. viewBox is cropped to the
   mark's own bounds — the asset's is 0 0 75 75 with the shape inset, which
   would render it a third smaller than the icons it sits beside.

   strokeWidth is swallowed: the call site passes it for the lucide icons and
   it means nothing to a filled path. */
function ScMark({ className, size = 15, strokeWidth, ...rest }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="11 11 52 52"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#sc-mark-clip-comparison)">
        <path d="M58.07 43.71L56.14 30.12C56.09 29.78 56.03 29.45 55.96 29.12C55.96 29.06 55.94 29 55.92 28.94C55 24.68 52.72 20.81 49.4 17.93C45.74 14.75 41.04 13 36.19 13C26.5 13 18.39 19.86 16.45 28.97C16.45 28.97 16.45 28.99 16.45 29C16.16 30.35 16.01 31.75 16.01 33.19C16.01 39.84 17.82 44.38 19.41 48.39C20.72 51.69 21.86 54.54 21.86 58.02C21.86 58.73 21.86 59.36 21.86 59.36V61.57C21.85 61.75 21.92 61.92 22.04 62.05C22.17 62.18 22.34 62.25 22.51 62.25H34.2C34.2 62.25 34.21 62.25 34.22 62.25H38.17C38.17 62.25 38.17 62.25 38.18 62.25H48.15C48.33 62.25 48.5 62.18 48.62 62.06C48.74 61.94 48.82 61.76 48.82 61.59V56.58H52.74C53.55 56.58 54.2 55.92 54.2 55.12V45.11H56.88C57.23 45.11 57.57 44.96 57.8 44.69C58.03 44.42 58.13 44.07 58.08 43.73L58.07 43.71ZM36.19 14.34C40.72 14.34 45.1 15.97 48.53 18.94C51.45 21.47 53.5 24.81 54.45 28.5H17.93C20.02 20.36 27.41 14.34 36.19 14.34ZM34.62 60.9L29.62 51.44H42.77L37.77 60.9H34.62ZM43.48 50.1H28.91L23.91 40.63H48.48L43.48 50.1ZM49.19 39.3H23.2L18.2 29.83H54.19L49.19 39.3ZM20.65 47.89C19.1 44 17.34 39.58 17.34 33.19C17.34 32.54 17.37 31.89 17.44 31.26L22.21 40.28L27.92 51.08L33.11 60.9H23.18V59.36C23.18 59.36 23.18 58.73 23.18 58.01C23.18 54.27 21.94 51.17 20.64 47.89H20.65ZM53.53 43.76C53.16 43.76 52.86 44.06 52.86 44.43V55.11C52.86 55.18 52.8 55.24 52.73 55.24H48.14C47.77 55.24 47.47 55.54 47.47 55.91V60.92H39.27L44.46 51.1L50.17 40.3L54.94 31.27L56.71 43.78H53.52L53.53 43.76Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="sc-mark-clip-comparison">
          <rect width="42.09" height="49.24" fill="white" transform="translate(16 13)" />
        </clipPath>
      </defs>
    </svg>
  )
}

const ATTRIBUTES = [
  { key: 'both',     label: 'Brand + growth' },
  { key: 'same',     label: 'Same people' },
  { key: 'embedded', label: 'Embedded' },
  { key: 'straight', label: 'Strategy to execution' },
  { key: 'platform', label: 'Brand platform' },
  { key: 'outcome',  label: 'Owns the outcome' },
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
    Icon: ScMark,
    name: 'Super~Conscious',
    note: 'One embedded team, brand through growth',
    attrs: [FULL, FULL, FULL, FULL, FULL, FULL],
    cost: 'Project or subscription',
  },
  {
    id: 'branding-studio',
    Icon: Palette,
    name: 'A Branding Studio',
    note: 'Identity specialists, project by project',
    attrs: [NONE, SOME, NONE, NONE, SOME, NONE],
    cost: 'Project fee',
  },
  {
    id: 'performance-agency',
    Icon: TrendingUp,
    name: 'A Performance Marketing Agency',
    note: 'Media buyers with a creative team attached',
    attrs: [NONE, NONE, NONE, SOME, NONE, SOME],
    cost: 'Retainer + % of spend',
  },
  {
    id: 'full-service',
    Icon: Building2,
    name: 'A Full-Service Agency',
    note: 'Everything under one roof, at one roof’s price',
    attrs: [FULL, NONE, NONE, FULL, SOME, SOME],
    cost: 'Retainer, high minimum',
  },
  {
    id: 'fractional-cmo',
    Icon: Briefcase,
    name: 'A Fractional CMO',
    note: 'Senior leadership, part time',
    attrs: [NONE, FULL, SOME, NONE, NONE, NONE],
    cost: 'Day rate',
  },
  {
    id: 'in-house',
    Icon: Users,
    name: 'An In-House Hire or Team',
    note: 'Your own people, on your payroll',
    attrs: [SOME, FULL, FULL, SOME, SOME, FULL],
    cost: 'Salaries + overhead',
  },
  {
    id: 'freelance',
    Icon: User,
    name: 'A Freelance Bench',
    note: 'A roster you brief and manage yourself',
    attrs: [NONE, SOME, NONE, NONE, NONE, NONE],
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
    attrs: [NONE, NONE, NONE, NONE, NONE, NONE],
    cost: 'Per seat',
  },
  {
    id: 'status-quo',
    Icon: Repeat,
    name: 'Keep On Keeping On',
    note: 'Doing exactly what you’re doing now',
    attrs: [NONE, NONE, NONE, NONE, NONE, NONE],
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
