import { Check, X, Users, Palette } from 'lucide-react'
import styles from './ComparisonTable.module.css'

/**
 * The comparison table: us, an in-house team, an agency.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE OTHER TWO ROWS ARE CLAIMS ABOUT PEOPLE WHO ARE NOT HERE, AND NOBODY
 * HAS SIGNED THEM OFF.
 *
 * The columns are safe: every one is drawn from something this site already
 * says about itself, cited below. Our own row is those claims restated.
 *
 * The in-house and agency rows are different in kind. Saying an in-house team
 * cannot do X, or that agencies do not do Y, is a claim about a third party
 * made on your own site — the sort of thing brand-strategist exists to
 * approve or refuse. They are written to be defensible rather than flattering
 * (both keep the columns they genuinely hold), and the site's own copy
 * already makes a version of the argument: the offer is defined as "so you're
 * not stitching together a branding studio, a media shop, and whoever built
 * your last campaign".
 *
 * That is a basis, not a sign-off. Read the two descriptions below as a
 * proposal and change or cut them.
 * ─────────────────────────────────────────────────────────────────────────
 */
const COLUMNS = [
  // "One embedded team handles both brand creation and growth media"
  { key: 'both', label: 'Brand + growth' },
  // "No pooled or anonymous labor, no rotating bench — the same people, every time."
  { key: 'same', label: 'The same people' },
  // "an embedded marketing team"
  { key: 'embedded', label: 'Embedded' },
  // "Strategy goes straight into brand, creative, and paid media"
  { key: 'straight', label: 'Strategy to execution' },
  // "then we test it against the data and adjust" / "measured and optimized every month"
  { key: 'measured', label: 'Measured' },
]

const ROWS = [
  {
    id: 'sc',
    name: 'Super~Conscious',
    note: 'One embedded team for brand and growth — the same people, every time.',
    us: true,
    has: { both: true, same: true, embedded: true, straight: true, measured: true },
  },
  {
    id: 'inhouse',
    name: 'In-house team',
    Icon: Users,
    /* PROPOSAL. Keeps the two an in-house team plainly does hold: they are
       your people and they are inside the business. */
    note: 'Your own people, but rarely the whole skill set brand and growth both need.',
    has: { both: false, same: true, embedded: true, straight: false, measured: false },
  },
  {
    id: 'agency',
    name: 'Creative agencies',
    Icon: Palette,
    /* PROPOSAL. Keeps the one an agency plainly does hold: it can cover both
       disciplines. What it is marked down on is continuity and proximity,
       which is the argument this site already makes. */
    note: 'Both disciplines, but on a rotating bench and at arm’s length from the work.',
    has: { both: true, same: false, embedded: false, straight: false, measured: false },
  },
]

export default function ComparisonTable({ eyebrow = '[ Why Us ]' }) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>The three ways this usually gets done.</h2>

      {/* Scrolls rather than squashing: five columns plus a name column does
          not fit a phone, and a table that shrinks its own type to fit is
          unreadable before it is complete. */}
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner} scope="col"><span className={styles.sr}>Option</span></th>
              {COLUMNS.map(c => (
                <th key={c.key} className={styles.colHead} scope="col">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ id, name, note, Icon, has, us }) => (
              <tr key={id} className={us ? styles.rowUs : styles.row}>
                <th className={styles.rowHead} scope="row">
                  <span className={styles.rowIcon} aria-hidden="true">
                    {Icon ? <Icon size={17} strokeWidth={1.5} /> : <span className={styles.mark}>S</span>}
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowName}>{name}</span>
                    <span className={styles.rowNote}>{note}</span>
                  </span>
                </th>
                {COLUMNS.map(c => (
                  <td key={c.key} className={styles.cell}>
                    {/* The icon is decorative; the word is what a screen
                        reader gets, so the table is still readable as a table
                        rather than as a grid of unlabelled marks. */}
                    <span aria-hidden="true">
                      {has[c.key] ? <Check size={20} strokeWidth={1.75} /> : <X size={20} strokeWidth={1.75} />}
                    </span>
                    <span className={styles.sr}>{has[c.key] ? 'Yes' : 'No'}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
