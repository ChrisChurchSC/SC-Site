import { NavLink } from 'react-router-dom'
import styles from './ClientStrip.module.css'
import { clientLogos } from '../data/clientLogos'
import { useComingSoon } from '../context/ComingSoonContext'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * A slim client strip, sized to sit under the showreel without competing
 * with it — one card in the grid's rhythm rather than a section of its own.
 *
 * It marquees because there are twenty clients and the strip is one row
 * tall. The list is duplicated so the -50% translate loops with no seam; the
 * second pass is hidden from assistive tech so the names are not announced
 * twice. Motion is dropped entirely under prefers-reduced-motion, which
 * leaves a static row — legible, just not the whole list at once.
 *
 * Entries render their `logo` file if they have one and their name set in
 * Signifier if they do not. See src/data/clientLogos.js for how to add real
 * logo files; today none are in the repo, so every entry is a name.
 */
function Entry({ name, logo, slug, comingSoon }) {
  const inner = logo
    ? <img src={logo} alt={name} className={styles.logo} loading="lazy" />
    : <span className={styles.name}>{name}</span>

  // Not linked if there is no case study, if it is hidden, or if it is still
  // being written — matching how the wall and the nav already treat these.
  const linkable = slug && !HIDDEN_SLUGS.has(slug) && !comingSoon.has(slug)
  if (!linkable) return <span className={styles.item}>{inner}</span>

  return <NavLink to={`/work/${slug}`} className={`${styles.item} ${styles.itemLink}`}>{inner}</NavLink>
}

export default function ClientStrip() {
  const comingSoon = useComingSoon()
  const pass = (hidden) => (
    <div className={styles.pass} aria-hidden={hidden || undefined}>
      {clientLogos.map(c => (
        <Entry key={`${hidden ? 'b' : 'a'}-${c.name}`} {...c} comingSoon={comingSoon} />
      ))}
    </div>
  )

  return (
    <div className={styles.strip}>
      <div className={styles.window}>
        <div className={styles.track}>
          {pass(false)}
          {pass(true)}
        </div>
      </div>
    </div>
  )
}
