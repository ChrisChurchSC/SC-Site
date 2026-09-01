import { NavLink } from 'react-router-dom'
import styles from './TrustMosaic.module.css'
import { clientLogos } from '../data/clientLogos'
import { useComingSoon } from '../context/ComingSoonContext'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * The client wall: a flat grid of clients.
 *
 * Built on the reference — equal tiles, an arrow on the ones you can follow,
 * and a single large card carrying a client, a number and a caption. The
 * earlier version of this file was a masonry of mixed footprints; that was a
 * different reference and it is gone, because a wall of equal tiles and a
 * wall of unequal ones are not variations of each other. Even tiles say "here
 * are the clients"; uneven ones say "some of these matter more".
 *
 * WHAT IS REAL HERE:
 *
 *   The names   — there are no client logo files in this repo. clientLogos
 *                 explains the fallback: a name set in Signifier reads as a
 *                 client list where an empty box reads as a broken page. Drop
 *                 SVGs into public/logos/ and the tiles render marks instead,
 *                 with no change here.
 *   The arrows  — only on clients with a case study that is published, not
 *                 hidden and not still being written. The same test the wall,
 *                 the nav and the client strip already use. An arrow on a
 *                 tile that goes nowhere is a promise the page cannot keep.
 */
/* THIS NUMBER IS NO LONGER THE ONE ON SCREEN, and that is the point to
   notice. It used to read clients.length — the wall shows what it counts, so
   the headline could not be wrong. It now says 100+, which is a claim about
   how many brands the studio has worked with over its life, not about how
   many logos are in this grid. Twenty-one are.
 
   That makes it the one line here nobody can check from the page, so it is
   Chris's to stand behind and brand-strategist's to approve. It is a claim
   about our own history rather than about a third party, which is the mildest
   kind — but if the wall ever grows past a hundred, put clients.length back
   and the problem disappears. */
const CLIENT_CLAIM = '100+'

/* THE HEADLINE IS A PROP so an industry page can name its category — but the
   wall still renders the whole roster, so the sentence has to stay true of
   what is under it. "Trusted by 100+ technology brands" would be false: three
   of the five technology clients are in this grid and the other eighteen
   tiles are not technology. "…technology companies among them" is true and
   says the same thing to the reader who came for it. */
export default function TrustMosaic({
  eyebrow = '[ Proof ]',
  headline = `Trusted by ${CLIENT_CLAIM} brands, and the people who run them.`,
}) {
  const comingSoon = useComingSoon()

  const clients = clientLogos.filter(c => !c.slug || !HIDDEN_SLUGS.has(c.slug))
  const linkable = c => c.slug && !HIDDEN_SLUGS.has(c.slug) && !comingSoon.has(c.slug)

  /* THREE ROWS, AND NO GAP AT THE END.
   *
   * Three rows of twenty does not divide: seven columns gives 21 slots and
   * leaves one empty, and an empty slot inside a stroked panel is a hole the
   * eye goes straight to. Rather than drop two clients to make the sum work,
   * the last tile widens to swallow whatever is left over.
   *
   * Computed, not hardcoded, so it stays right when a client is added or
   * removed — which is the thing a hand-set span would silently get wrong. */
  const COLS = 7
  const leftover = (COLS - (clients.length % COLS)) % COLS

  const Tile = ({ client, span = 1 }) => {
    const style = span > 1 ? { gridColumn: `span ${span}` } : undefined
    const inner = (
      <>
        {client.logo
          ? <img src={client.logo} alt={client.name} className={styles.logo} loading="lazy" />
          : <span className={styles.name}>{client.name}</span>}
      </>
    )
    if (!linkable(client)) return <div className={styles.tile} style={style}>{inner}</div>
    return (
      <NavLink to={`/work/${client.slug}`} className={`${styles.tile} ${styles.tileLink}`} style={style}>
        <span className={styles.arrow} aria-hidden="true">→</span>
        {inner}
      </NavLink>
    )
  }

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>{headline}</h2>

      {/* No feature card. It carried a client name and a missing number —
          every case-study stat in this repo is a placeholder — and once its
          film came off there was nothing in it but a large empty rectangle
          beside a full grid. An empty tile is not a placeholder for a good
          one; it just makes the wall look unfinished. Put it back when there
          is a real figure for it. */}
      {/* The stroke belongs to the wall, not to each tile: one outline around
          the whole thing reads as a single object, where twenty outlines read
          as twenty. It is also why the tiles inside stay borderless. */}
      <div className={styles.panel}>
        <div className={styles.grid}>
          {clients.map((c, i) => (
            <Tile key={c.name} client={c} span={i === clients.length - 1 ? leftover + 1 : 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
