import styles from './RepresentWindow.module.css'

/**
 * THE PUBLIC RECORD — the hero visual on Represent.
 *
 * WHY NOT THE FLOW DIAGRAM, AND WHY NOT SUPPORT'S BOARD. Three of the four
 * service pages used to draw the same three columns, and the fix for that is
 * not to give two of them the same new picture. Support is a board because
 * its work arrives loose and gets sorted into four lanes. Represent's does
 * not: each thing is one named moment that moves through a state — drafted,
 * checked, out. A register with a status column says that; a lane does not.
 *
 * THE ROWS ARE THE PILLARS, FLATTENED. Every row is an item from
 * services.js — the same list the other pages render, read here as "the
 * moments a brand gets spoken for" rather than as a capability list. Nothing
 * is written in this file, so the page and the data cannot drift.
 *
 * THE STATES ARE ILLUSTRATIVE AND THE PANEL SAYS SO. There is no represent
 * queue in the product to read a real state from, so these are assigned by
 * position and marked sample — the same bargain the Measurement window makes
 * with its figures, minus the claim to mirror a real table, because this
 * mirrors none.
 *
 * NO DATES. A date is a commitment, and a schedule of invented ones on a
 * page that already says "not signed off" was one fiction too many.
 */

/* Assigned by position rather than at random, so the panel looks the same on
   every render and in every screenshot. The cycle reads down the register:
   most things are drafted, fewer are checked, fewer still are out. */
const STATES = ['Out', 'In review', 'Drafted']

export default function RepresentWindow({ label = 'Represent', pillars = [] }) {
  const rows = pillars.flatMap(({ name, items }) =>
    items.map((item) => ({ group: name, item })),
  )

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>Super Conscious</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>SC-Brand</span>
        <span className={styles.private}>{label}</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Public record</span>
        <span className={styles.tab}>Archive</span>
        {/* Qualifies the State column, and it is on the tab row because it
            qualifies the whole view rather than one cell. */}
        <span className={styles.sample}>Sample states</span>
      </div>

      <div className={styles.body}>
        {/* The rail is the four, with what each holds. The counts are counted
            from the rows, not typed beside them, so the rail cannot claim a
            number the register does not show. */}
        <aside className={styles.rail} aria-label="Where a brand gets spoken for">
          {pillars.map(({ n, name, gloss, items }) => (
            <div key={name} className={styles.railItem}>
              <span className={styles.railN}>{n}</span>
              <h3 className={styles.railName}>{name}</h3>
              {gloss && <p className={styles.railGloss}>{gloss}</p>}
              <span className={styles.railCount}>{items.length}</span>
            </div>
          ))}
        </aside>

        <div className={styles.registerWrap}>
          <table className={styles.register}>
            <thead>
              <tr>
                <th className={styles.thText}>Moment</th>
                <th className={styles.thText}>Where</th>
                <th className={styles.thState}>State</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ group, item }, i) => {
                const state = STATES[i % STATES.length]
                return (
                  <tr key={`${group}-${item}`}>
                    <td className={styles.tdItem}>{item}</td>
                    <td className={styles.tdGroup}>{group}</td>
                    <td className={styles.tdState}>
                      <span className={`${styles.chip} ${styles[`chip${state.replace(' ', '')}`]}`}>
                        {state}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
