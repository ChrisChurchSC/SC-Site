import { NavLink } from 'react-router-dom'
import styles from './FeaturedCaseStudies.module.css'
import LazyVideo from './LazyVideo'
import { featuredCaseStudies } from '../data/featuredCaseStudies'

/**
 * Featured case studies: four full-width 16:9 cards, stacked.
 *
 * Name and stats both live inside the card — name bottom-left, the four
 * measures along the bottom-right. The same four run across all four
 * entries (win rate, follower growth, SQL growth, time to market), so the
 * stack reads as one comparable table rather than four brag sheets.
 *
 * Entries with no `href` render as plain cards rather than links, which is
 * how the wall, the nav and the client strip already treat work that is
 * hidden, unpublished or unwritten. Three of the four are in that state
 * today; see src/data/featuredCaseStudies.js for which and why.
 *
 * Entries with no `media` render on an empty field. That is the designed
 * state for missing media, not a broken image.
 */
function Card({ name, type, href, media, stats }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const isVideo = media && /\.(mp4|webm|mov)$/i.test(media)

  const frame = (
    <div className={styles.frame}>
      {media && (isVideo
        ? <LazyVideo src={`${base}${media}`} className={styles.media} />
        : <img src={`${base}${media}`} alt="" loading="lazy" className={styles.media} />)}

      {type && <span className={styles.frameType}>{type}</span>}

      <div className={styles.frameFoot}>
        <span className={styles.frameName}>{name}</span>
        <dl className={styles.stats}>
          {stats.map(({ value, label }) => (
            <div key={label} className={styles.stat}>
              <dt className={styles.statLabel}>{label}</dt>
              <dd className={styles.statValue}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )

  return href
    ? <NavLink to={href} className={styles.entryLink}>{frame}</NavLink>
    : <article className={styles.entry}>{frame}</article>
}

export default function FeaturedCaseStudies() {
  return (
    <section className={styles.section} aria-label="Featured case studies">
      {featuredCaseStudies.map(c => <Card key={c.slug} {...c} />)}
    </section>
  )
}
