import { NavLink } from 'react-router-dom'
import styles from './FeaturedWall.module.css'
import LazyVideo from './LazyVideo'
import { BLOCK_MAP } from '../lib/blockMap'
import { useComingSoon } from '../context/ComingSoonContext'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * Featured work: a run of portrait cards, each stepped further down than the
 * last, running off the right edge.
 *
 * THE MEDIA IS REAL AND NOT CHOSEN BY ME. It comes from BLOCK_MAP, which is
 * the repo's existing slug-to-media map — the same one the homepage grid and
 * the case study pages' More Work thumbnails already use. Every entry with an
 * `img` is a piece of work with a file behind it; entries without one are
 * skipped rather than rendered as an empty frame.
 *
 * That also means nobody has to keep two lists in step. Add media to a block
 * in BLOCK_MAP and it appears here.
 *
 * Linking follows the same test as everywhere else on this page: published,
 * not hidden, not still being written. A card with no page is shown and not
 * linked rather than dropped — the work exists even when the write-up does
 * not.
 *
 * THE STAGGER is the whole idea of the reference: each card sits lower than
 * the one before it, so the row reads as a drift rather than a filmstrip. It
 * is computed from the index and wraps, so it stays a rhythm however many
 * cards there are instead of a hand-set list of offsets.
 */
const NAME = slug => slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

export default function FeaturedWall({ eyebrow = '[ Featured Work ]' }) {
  const comingSoon = useComingSoon()

  const cards = Object.values(BLOCK_MAP)
    .filter(b => b.img && b.slug)
    .filter(b => !HIDDEN_SLUGS.has(b.slug))

  const linkable = slug => !HIDDEN_SLUGS.has(slug) && !comingSoon.has(slug)
  const isVideo = src => /\.(mp4|webm|mov)$/i.test(src)

  /* Four steps, then it repeats. Enough to read as a drift, few enough that
     the row does not walk off the bottom of the section. */
  const STEPS = [0, 34, 68, 34]

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>Work that had to earn its place.</h2>
      <NavLink to="/work" className={styles.explore}>Explore</NavLink>

      {/* Scrolls rather than wraps, and runs off the right edge on purpose —
          the row continuing past the frame is what says there is more. */}
      <div className={styles.rail}>
        {cards.map((c, i) => {
          const inner = (
            <>
              <span className={styles.media} aria-hidden="true">
                {isVideo(c.img)
                  ? <LazyVideo src={c.img} className={styles.mediaEl} />
                  : <img src={c.img} alt="" className={styles.mediaEl} loading="lazy" />}
              </span>
              <span className={styles.name}>{NAME(c.slug)}</span>
            </>
          )
          const style = { marginTop: STEPS[i % STEPS.length] }
          return linkable(c.slug)
            ? <NavLink key={c.slug} to={`/work/${c.slug}`} className={styles.card} style={style}>{inner}</NavLink>
            : <div key={c.slug} className={`${styles.card} ${styles.cardFlat}`} style={style}>{inner}</div>
        })}
      </div>
    </section>
  )
}
