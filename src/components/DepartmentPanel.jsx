import styles from './DepartmentPanel.module.css'
import { seatSeeds } from './AdoptWindow'
import { DISCIPLINES } from '../pages/Services'

/**
 * THE RESOURCING SHEET — the visual for "How we work" on /services/build.
 *
 * A GRID, NOT A STATUS LIST. The previous version was disciplines down the
 * left and a Running / On call chip on the right, which is a state table: it
 * says who is busy, and it says it twelve times. A resourcing sheet is
 * disciplines down and TIME ACROSS, with blocks where somebody is on the
 * work — and that shape is the argument, because the gaps are visible. You
 * can see that Film & photo is not on this project, and that Media only
 * arrives at the end.
 *
 * IT PAYS OFF THE TWO BULLETS BESIDE IT. Every discipline you would otherwise
 * hire is a row, whether or not it is used — that is "a whole department".
 * Most rows are mostly empty — that is "at the fraction you need". A state
 * chip could only ever carry the first.
 *
 * THE TWELVE ARE REAL and come from /services, where ten are the client's own
 * wording from the aboutPage document and Media and Search were added. Not
 * retyped here.
 *
 * THE ALLOCATION IS ILLUSTRATIVE and the sheet says so. It is shaped like a
 * Build actually runs — direction and design across the whole month, writing
 * early, engineering once there is something to build, media and search at
 * the end — but it is a picture of a month, not a record of one.
 *
 * NO HOURS, NO DAYS, NO FTE, NO RATE. A resourcing sheet in a studio has
 * numbers in the cells; every one of those here would be invented, and there
 * is no resourcing model in this repo to read them from. A filled block says
 * "on this" without quoting anybody.
 *
 * IT ALSO DOES NOT CLAIM "THE SAME PEOPLE EVERY TIME" — claim #5 in
 * proof-points.md, graded C and marked do-not-publish. Rows are disciplines,
 * not names, which is why the avatars carry nonsense initials rather than
 * anybody's. Those discs are AdoptWindow's, imported rather than redrawn.
 */

const WEEKS = ['W1', 'W2', 'W3', 'W4']

/* Which weeks each discipline is on, by name. A Build ramps: direction and
   design run throughout, writing lands early, engineering starts once there
   is something to build, and media and search arrive at the end. Anything
   not listed is on call all month — present in the department, not on this. */
const ALLOCATION = {
  'Creative direction': [1, 1, 1, 1],
  Writing: [1, 1, 1, 0],
  Design: [1, 1, 1, 1],
  Illustration: [0, 1, 1, 0],
  Production: [0, 0, 1, 1],
  Engineering: [0, 1, 1, 1],
  Media: [0, 0, 0, 1],
  Search: [0, 0, 0, 1],
}

const ROWS = DISCIPLINES.map(({ name }) => ({
  name,
  weeks: ALLOCATION[name] ?? [0, 0, 0, 0],
}))

const seeds = seatSeeds(0, ROWS.length)

export default function DepartmentPanel() {
  return (
    <div className={styles.panel} aria-hidden="true">
      <div className={styles.head}>
        <p className={styles.eyebrow}>Your department</p>
        <h3 className={styles.title}>This month</h3>
        <span className={styles.badge}>Illustrative</span>
      </div>

      <div className={styles.sheet}>
        <div className={styles.headRow}>
          <span>Discipline</span>
          {WEEKS.map((w) => <span key={w} className={styles.week}>{w}</span>)}
        </div>

        {ROWS.map(({ name, weeks }, i) => {
          const { colors, initials } = seeds[i]
          const on = weeks.some(Boolean)
          return (
            <div key={name} className={styles.row}>
              <span className={styles.who}>
                <span
                  className={on ? styles.avatar : styles.avatarOff}
                  style={on ? { background: `linear-gradient(140deg, ${colors[0]}, ${colors[1]})` } : undefined}
                >
                  {initials}
                </span>
                <span className={on ? styles.name : styles.nameOff}>{name}</span>
              </span>

              {weeks.map((v, w) => (
                <span key={w} className={styles.cell}>
                  {/* A run of consecutive weeks reads as one bar rather than
                      separate blocks — the cell's fill bleeds into its
                      neighbour where both are on. */}
                  <span
                    className={v ? styles.block : styles.blockOff}
                    data-start={v && !weeks[w - 1] ? '' : undefined}
                    data-end={v && !weeks[w + 1] ? '' : undefined}
                  />
                </span>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
