import { NavLink } from 'react-router-dom'
import styles from './TrustMosaic.module.css'
import { clientLogos } from '../data/clientLogos'
import { featuredCaseStudies } from '../data/featuredCaseStudies'
import { useComingSoon } from '../context/ComingSoonContext'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * The client wall: a flat grid of clients, and one feature card.
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
 *   The number  — '––'. Every stat in featuredCaseStudies is a placeholder
 *                 and that file says not to ship invented ones. It is set at
 *                 the size a real figure would be, so the gap reads as a
 *                 missing number rather than as a design that never had one.
 *
 * The feature card is Wonderwerk: the one case study with a page, a film and
 * somewhere to go.
 */
export default function TrustMosaic({ eyebrow = '[ Proof ]' }) {
  const comingSoon = useComingSoon()

  const clients = clientLogos.filter(c => !c.slug || !HIDDEN_SLUGS.has(c.slug))
  const linkable = c => c.slug && !HIDDEN_SLUGS.has(c.slug) && !comingSoon.has(c.slug)

  const feature = featuredCaseStudies.find(cs => cs.slug === 'wonderwerk') ?? featuredCaseStudies[0]
  const stat = feature?.stats?.[0]

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

      <div className={styles.wall}>
        <div className={styles.grid}>
          {clients.map(c => <Tile key={c.name} client={c} />)}
        </div>

        {feature && (
          <NavLink to={feature.href ?? '/work'} className={styles.feature}>
            {/* No film here. The card looped the Wonderwerk montage behind
                the type, which put a moving picture directly beside a grid of
                still names — the motion pulled the eye off the wall the
                section exists to show, and the card needed a heavy scrim to
                stay legible over it, which made the film hard to see anyway.
                It is doing neither job well, so it does neither. The montage
                still plays in the Services panel and on the featured work
                below, where nothing competes with it. */}
            <span className={styles.arrow} aria-hidden="true">→</span>
            <span className={styles.featureBody}>
              <span className={styles.featureClient}>{feature.name}</span>
              {stat && (
                <>
                  <span className={styles.featureValue}>{stat.value}</span>
                  <span className={styles.featureLabel}>{stat.label}</span>
                </>
              )}
            </span>
          </NavLink>
        )}
      </div>
    </section>
  )
}
