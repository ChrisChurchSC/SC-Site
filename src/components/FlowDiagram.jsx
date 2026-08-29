import styles from './FlowDiagram.module.css'

/**
 * The hero diagram: what goes into the platform, and what comes out.
 *
 * THREE COLUMNS AND TWO ARROWS. Inputs on the left, the repo in the middle,
 * outputs on the right — the shape of the reference, and the shape of the
 * actual claim: everything the brand is goes into one place, and everything
 * the brand says comes out of it.
 *
 * THE DATA COMES IN AS PROPS, one flow per service, from services.js. The
 * right-hand column of each is that service's own pillars — Chris's names,
 * unchanged. The left-hand column is the material an engagement starts from,
 * and that framing is mine; it is marked in the data file.
 *
 * THE MIDDLE PANEL IS DELIBERATELY BLANK. The reference fills its centre
 * with skeleton rows, which reads as "a table, redacted"; ours is the repo's
 * own file list, greyed. It is a diagram of a flow rather than a screenshot,
 * and a legible fake UI in the middle would compete with the real one
 * further down the page.
 *
 * Decorative as a whole: the columns are labelled for a screen reader, and
 * the arrows are aria-hidden because "arrow" is not information.
 */
/* Six rows of nothing, at the widths a file list has. Keyed by index because
   they are positions rather than things. */
const ROWS = [72, 58, 84, 46, 66, 52]

function Column({ label, groups, side }) {
  return (
    <div className={styles.column} aria-label={label}>
      {groups.map(({ name, items }) => (
        <div key={name} className={styles.node}>
          <span className={styles.nodeName}>{name}</span>
          <span className={styles.chips}>
            {items.map((i) => <span key={i} className={styles.chip}>{i}</span>)}
          </span>
          <span className={`${styles.arrow} ${side === 'in' ? styles.arrowIn : styles.arrowOut}`} aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}

export default function FlowDiagram({ inputs, centre, outputs }) {
  return (
    <div className={styles.wrap}>
      {/* The wash behind it, which the reference uses to tie the three
          columns into one object. Pink rather than orange, and low enough
          that the cards still read as sitting on the page. */}
      <div className={styles.ground} aria-hidden="true" />

      <div className={styles.flow}>
        <Column label="What goes in" groups={inputs} side="in" />

        <div className={styles.centre}>
          <div className={styles.centreHead}>
            <span className={styles.centreMark} aria-hidden="true" />
            <span className={styles.centreName}>{centre}</span>
          </div>
          <div className={styles.centreBody} aria-hidden="true">
            {ROWS.map((w, i) => (
              <span key={i} className={styles.row}>
                <span className={styles.rowIcon} />
                <span className={styles.rowBar} style={{ width: `${w}%` }} />
              </span>
            ))}
          </div>
        </div>

        <Column label="What comes out" groups={outputs} side="out" />
      </div>
    </div>
  )
}
