import { NavLink } from 'react-router-dom'
import styles from './FeaturedWall.module.css'
import { featuredCaseStudies } from '../data/featuredCaseStudies'

/**
 * Featured work: a rail of the six case studies, as text.
 *
 * THE SIX ARE THE LIST, NOT A FILTER. featuredCaseStudies already holds
 * exactly OpenText, iScribe, Arbitrum, Smashburger, World Within and
 * Wonderwerk, with a note per entry explaining why each is there. This reads
 * that file rather than picking its own set — an earlier version assembled
 * the rail from BLOCK_MAP, which meant the featured set and this rail could
 * disagree about what was featured.
 *
 * NO IMAGES. Asked for, and it suits the data: only one of the six has media
 * anywhere in the repo, so an image-led rail was always going to be one real
 * picture and five holes. What is deliberately NOT here is a large empty
 * frame where a picture will go — an empty box does not read as a promise,
 * it reads as a failure to load. The card is the name and the measures until
 * there is something to show.
 *
 * THE MEASURES ARE ABSENT ON PURPOSE. Every value in that file is '––' and
 * its header says in capitals not to ship invented ones: there is no source
 * for them in the repo or in Sanity. They are set at the size a real figure
 * would be, so the gap reads as a missing number rather than as a design that
 * never had one.
 *
 * LINKING is per-entry, from the same file: World Within and Wonderwerk have
 * pages, the other four do not, and those render unlinked rather than being
 * dropped — they are the featured set whether or not the write-up exists.
 */
export default function FeaturedWall({ eyebrow = '[ Featured Work ]' }) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>Work that had to earn its place.</h2>
      <NavLink to="/work" className={styles.explore}>Explore</NavLink>

      <div className={styles.rail}>
        {featuredCaseStudies.map(({ slug, name, type, href, stats }) => {
          const inner = (
            <>
              <span className={styles.type}>{type}</span>
              <span className={styles.name}>{name}</span>
              <span className={styles.measures}>
                {stats.map(({ value, label }) => (
                  <span key={label} className={styles.measure}>
                    <span className={styles.measureValue}>{value}</span>
                    <span className={styles.measureLabel}>{label}</span>
                  </span>
                ))}
              </span>
            </>
          )
          return href
            ? <NavLink key={slug} to={href} className={styles.card}>{inner}</NavLink>
            : <div key={slug} className={`${styles.card} ${styles.cardFlat}`}>{inner}</div>
        })}
      </div>
    </section>
  )
}
