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
export default function TrustMosaic({ eyebrow = '[ Proof ]' }) {
  const comingSoon = useComingSoon()

  const clients = clientLogos.filter(c => !c.slug || !HIDDEN_SLUGS.has(c.slug))
  const linkable = c => c.slug && !HIDDEN_SLUGS.has(c.slug) && !comingSoon.has(c.slug)

  const Tile = ({ client }) => {
    const inner = (
      <>
        {client.logo
          ? <img src={client.logo} alt={client.name} className={styles.logo} loading="lazy" />
          : <span className={styles.name}>{client.name}</span>}
      </>
    )
    if (!linkable(client)) return <div className={styles.tile}>{inner}</div>
    return (
      <NavLink to={`/work/${client.slug}`} className={`${styles.tile} ${styles.tileLink}`}>
        <span className={styles.arrow} aria-hidden="true">→</span>
        {inner}
      </NavLink>
    )
  }

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>
        Trusted by {clients.length} brands, and the people who run them.
      </h2>

      {/* No feature card. It carried a client name and a missing number —
          every case-study stat in this repo is a placeholder — and once its
          film came off there was nothing in it but a large empty rectangle
          beside a full grid. An empty tile is not a placeholder for a good
          one; it just makes the wall look unfinished. Put it back when there
          is a real figure for it. */}
      <div className={styles.grid}>
        {clients.map(c => <Tile key={c.name} client={c} />)}
      </div>
    </section>
  )
}
