import { NavLink } from 'react-router-dom'
import styles from './FeaturedWall.module.css'
import LazyVideo from './LazyVideo'
import { BLOCK_MAP } from '../lib/blockMap'
import { featuredCaseStudies } from '../data/featuredCaseStudies'
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
 * NO STAGGER. The reference steps each card lower than the last; asked for
 * aligned, so they sit on one baseline. Worth knowing what that costs: the
 * drift was what stopped the row reading as a filmstrip, and a flat row of
 * equal cards is a filmstrip. The width and the bleed off the right edge are
 * now doing that work alone.
 */
/* THE MEASURES ARE SHARED AND THE NUMBERS ARE ABSENT.
 *
 * featuredCaseStudies uses one set of labels across every case study on
 * purpose — its own comment says so: the section should read as one
 * comparable table rather than four unrelated brag sheets. So the labels are
 * taken from it rather than restated here, and they are the same under every
 * card because that is the design.
 *
 * Every value is '––'. That file says in capitals not to ship invented ones:
 * there is no source for these anywhere in the repo or in Sanity. They are
 * set at the size a real figure would be, so the gap reads as a missing
 * number rather than as a design that never had one. */
const MEASURES = featuredCaseStudies[0]?.stats ?? []

const NAME = slug => slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

export default function FeaturedWall({ eyebrow = '[ Featured Work ]' }) {
  const comingSoon = useComingSoon()

  const linkable = slug => !HIDDEN_SLUGS.has(slug) && !comingSoon.has(slug)

  /* CASE STUDIES ONLY. Every card here now goes somewhere: a block needs both
     media AND a published, non-hidden, not-still-being-written case study to
     appear. Before, a block with a file but no write-up rendered unlinked —
     which made a section called Featured Work partly a gallery of things you
     cannot read about.
     
     Six at most. The wall at /work is the catalogue; this is a rail. */
  const cards = Object.values(BLOCK_MAP)
    .filter(b => b.img && b.slug)
    .filter(b => linkable(b.slug))
    .slice(0, 6)
  const isVideo = src => /\.(mp4|webm|mov)$/i.test(src)

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>Work that had to earn its place.</h2>
      <NavLink to="/work" className={styles.explore}>Explore</NavLink>

      {/* Scrolls rather than wraps, and runs off the right edge on purpose —
          the row continuing past the frame is what says there is more. */}
      <div className={styles.rail}>
        {cards.map(c => {
          const inner = (
            <>
              <span className={styles.media} aria-hidden="true">
                {isVideo(c.img)
                  ? <LazyVideo src={c.img} className={styles.mediaEl} />
                  : <img src={c.img} alt="" className={styles.mediaEl} loading="lazy" />}
              </span>
              <span className={styles.caption}>
                <span className={styles.name}>{NAME(c.slug)}</span>
                <span className={styles.measures}>
                  {MEASURES.map(({ value, label }) => (
                    <span key={label} className={styles.measure}>
                      <span className={styles.measureValue}>{value}</span>
                      <span className={styles.measureLabel}>{label}</span>
                    </span>
                  ))}
                </span>
              </span>
            </>
          )
          return <NavLink key={c.slug} to={`/work/${c.slug}`} className={styles.card}>{inner}</NavLink>
        })}
      </div>
    </section>
  )
}
