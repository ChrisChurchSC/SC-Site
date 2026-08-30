import styles from './SupportWindow.module.css'

/**
 * THE STANDING-WORK BOARD — the hero visual on Support.
 *
 * WHY NOT THE FLOW DIAGRAM. Support, Represent and Build were drawing the
 * same three-column picture with a different right-hand column, so three of
 * the four service pages were identical above the fold and only Grow read as
 * its own page. This is Support's own.
 *
 * WHY A BOARD. The flow diagram says "things go in and things come out",
 * which is what a project does. Support is not a project — it is the
 * arrangement for work with no project around it, arriving one piece at a
 * time and getting sorted. Four lanes says that; an arrow does not.
 *
 * THE FOUR LANES ARE CHRIS'S — Maintain, Tune, Enable, Extend, given as the
 * how-it-works section for this service. They come in as `pillars` from
 * services.js rather than being written here, so his words live in one place
 * and this file cannot quietly disagree with the data.
 *
 * NO COUNTS, NO AGES, NO STATUSES. The obvious way to make a board look alive
 * is a "4 open · last 2d" under each lane, and every one of those figures
 * would be invented — there is no support queue in the product to read them
 * from. The dashboard on Grow can carry sample numbers because it mirrors a
 * real table; this mirrors nothing, so it states the work and stops.
 */
export default function SupportWindow({ label = 'Support', pillars = [] }) {
  return (
    <div className={styles.window}>
      {/* Same chrome as RepoWindow and DashboardWindow: one product, seen on
          a different tab. */}
      <div className={styles.head}>
        <span className={styles.crumbMuted}>Super Conscious</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>SC-Brand</span>
        <span className={styles.private}>{label}</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Standing work</span>
        <span className={styles.tab}>Log</span>
      </div>

      <div className={styles.board}>
        {pillars.map(({ n, name, gloss, items }) => (
          <section key={name} className={styles.lane} aria-label={name}>
            <header className={styles.laneHead}>
              <span className={styles.laneN}>{n}</span>
              <h3 className={styles.laneName}>{name}</h3>
              {gloss && <p className={styles.laneGloss}>{gloss}</p>}
            </header>

            {/* Rows with a rule between them rather than the diagram's chips.
                Chips here would have made the board read as a fourth copy of
                the flow diagram's columns, which is the thing it exists to
                stop. */}
            <ul className={styles.items}>
              {items.map((item) => (
                <li key={item} className={styles.item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
