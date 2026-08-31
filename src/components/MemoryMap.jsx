import styles from './MemoryMap.module.css'
import { decisions, markers } from '../data/decisions'

/**
 * THE RECORD, LAID OUT — a full-width map of what memory holds, grouped by
 * the folder each decision lives in.
 *
 * THE DENSITY IS THE HONEST PART. The reference this is modelled on shows 33
 * workflows across seven departments, and its tiles are sized by hours per
 * month. This record holds three decisions and four marker types, and
 * src/data/decisions.js says in its first line that nothing in it is sample.
 * Filling the grid would mean inventing twenty-odd decisions the studio never
 * made, on the one page whose whole argument is that the record is real.
 *
 * So the shape is the reference's and the contents are ours: grouped, tiled,
 * coloured by state, with the count on each group. It gets denser as the
 * studio decides more things, which is the correct way for it to get denser.
 *
 * NO SIZE WEIGHTING. The reference sizes each box by hours saved. There is no
 * equivalent quantity on a decision — not one that is recorded anywhere — so
 * the tiles are even and the group is sized by how many it holds. A box
 * bigger than its neighbour would be saying something nobody measured.
 */

/* The folder a decision lives in, which is also how the repo groups it. */
const areaOf = (path) => path.split('/')[0]

const AREAS = [...new Set(decisions.map((d) => areaOf(d.path)))]

/* The rule, short enough to sit in a tile. The full line is on the record
   below; this is the label for it. */
const short = (rule) => (rule.length > 62 ? rule.slice(0, 60).trimEnd() + '…' : rule)

export default function MemoryMap() {
  const open = decisions.filter((d) => d.state === 'open').length

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.stat}>
          <b className={styles.statNum}>{decisions.length}</b> decisions
        </span>
        <span className={styles.sep} />
        <span className={styles.stat}>
          <b className={styles.statNum}>{open}</b> open
        </span>
        <span className={styles.sep} />
        <span className={styles.stat}>
          <b className={styles.statNum}>{markers.length}</b> kinds of gap
        </span>
        <span className={styles.dots} aria-hidden="true">
          <i /><i /><i />
        </span>
      </div>

      <div className={styles.body}>
        {AREAS.map((area) => {
          const inArea = decisions.filter((d) => areaOf(d.path) === area)
          return (
            <section key={area} className={styles.group} style={{ flexGrow: inArea.length }}>
              <p className={styles.groupHead}>
                {area}/ <span className={styles.groupCount}>{inArea.length}</span>
              </p>

              <div className={styles.tiles}>
                {inArea.map((d) => (
                  <article
                    key={d.id}
                    className={`${styles.tile} ${d.state === 'open' ? styles.tileOpen : styles.tileSettled}`}
                  >
                    <p className={styles.tileRule}>{short(d.rule)}</p>
                    <p className={styles.tileMeta}>
                      {d.path}
                      <span className={styles.tileDate}>{d.date}</span>
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        {/* The gaps get a group of their own: they are what the record holds
            where a decision has not been made yet, which is the other half of
            what this page claims. */}
        <section className={styles.group} style={{ flexGrow: 2 }}>
          <p className={styles.groupHead}>
            Open markers <span className={styles.groupCount}>{markers.length}</span>
          </p>
          <div className={styles.tiles}>
            {markers.map((m) => (
              <article key={m.tag} className={`${styles.tile} ${styles.tileMarker}`}>
                <p className={styles.tileTag}>[ {m.tag} ]</p>
                <p className={styles.tileMeta}>{m.owner}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <p className={styles.foot}>
        Grouped by the folder the decision lives in. Every entry is one the studio actually
        made — which is why there are this many and not more.
      </p>
    </div>
  )
}
