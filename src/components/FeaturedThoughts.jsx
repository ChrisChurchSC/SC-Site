import { NavLink } from 'react-router-dom'

/* THE WORK GRID'S CARDS, for the same reason ThoughtsIndex borrows them: a
   thought on the homepage should be the same object it is on /thoughts, and
   /thoughts already draws it with the case-study card. */
import cards from './WorkIndex.module.css'
import styles from './FeaturedThoughts.module.css'
import { fromStatic, fmtDate } from './ThoughtsIndex'
import { useSanity } from '../hooks/useSanity'
import { THOUGHTS_INDEX_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'

/**
 * FEATURED THOUGHTS — the three most recent, on the homepage.
 *
 * THE SAME SOURCE AS /THOUGHTS. Sanity first, the static set as fallback,
 * through the same shape and the same helpers ThoughtsIndex exports, so the
 * newest three here are the first three there. There is no "featured" flag
 * in either source; "featured" means "latest" until somebody adds one, at
 * which point this is the one place to read it.
 *
 * THE HEADLINE IS CHRIS'S (2026-09-02). It began as the /thoughts hero's
 * own line, "Ideas, notes, and process.", on the argument that a window
 * onto a page should say what the page says; he asked for this instead,
 * which reads as the studio speaking rather than as a category name. The
 * eyebrow is still the same label as the page.
 *
 * An <h2>, because DotNav derives the rail from this page's headings — a
 * section without one is a section the rail skips.
 */
const COUNT = 3

export default function FeaturedThoughts() {
  const { data: sanityThoughts } = useSanity(THOUGHTS_INDEX_QUERY)
  const items = (sanityThoughts && sanityThoughts.length ? sanityThoughts : fromStatic)
    .slice()
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, COUNT)

  if (items.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="featured-thoughts">
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>[ Thoughts ]</p>
          <h2 id="featured-thoughts" className={styles.headline}>What we're thinking about.</h2>
        </div>
        <NavLink to="/thoughts" className={styles.all}>All thoughts →</NavLink>
      </div>

      <div className={styles.grid}>
        {items.map(({ _id, title, slug, excerpt, publishedAt, heroUrl }) => (
          <NavLink key={_id ?? slug} to={`/thoughts/${slug}`} className={cards.card}>
            <span className={cards.cardMedia}>
              {heroUrl ? (
                <img className={cards.cardImg} src={sanityImg(heroUrl, { w: 900 })} alt="" loading="lazy" />
              ) : (
                <span className={cards.ph}>
                  {excerpt && <span className={cards.phLine}>{excerpt}</span>}
                </span>
              )}
            </span>
            <span className={cards.cardClient}>{title}</span>
            <p className={cards.meta}>{fmtDate(publishedAt)}</p>
          </NavLink>
        ))}
      </div>
    </section>
  )
}
