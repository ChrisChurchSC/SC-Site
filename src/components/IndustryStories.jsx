import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './IndustryStories.module.css'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/* The same exclusions the wall makes: HIDDEN_SLUGS are studies somebody took
   down and a password means the project is not public. */
const bySlug = new Map(projects.filter((p) => p.slug).map((p) => [p.slug, p]))

/* THE THREE MEASURES, LABELS ONLY.
 *
 * featuredCaseStudies.js says it in capitals: its stat values are invented
 * and are not these clients' results, and "an invented percentage sitting
 * under the word OpenText is a claim about a named company's results,
 * attributed to us, on a page meant to win work". The same is true here, so
 * none of those numbers is reused.
 *
 * The LABELS are reusable — that file calls them final, and they are the
 * three things the studio measures. So the section shows what we would report
 * against, with the repo's own missing-value mark where the figure goes and
 * the same tag FeaturedWall carries. Put real, sourced numbers in METRICS and
 * delete the tag in the same change, not before.
 *
 * There is no per-client source for any of this: the Sanity project schema
 * has no stats field, and caseStudies.js carries qualitative outcomes rather
 * than metrics — which is why the values do not vary by client. */
const TBC = '––'

const MEASURES = ['Audience growth', 'SQL growth', 'Win rate']


const entryFor = (slug) => {
  if (HIDDEN_SLUGS.has(slug)) return null
  const project = bySlug.get(slug)
  if (project?.password) return null

  const study = caseStudies[slug]
  if (study) {
    return {
      slug,
      name: study.name,
    }
  }
  if (!project) return null
  return {
    slug,
    name: project.name,
  }
}

/**
* CASE STUDIES, AS A ROTATING RAIL.
 *
 * NO TABS. It was a strip of client names that switched the panel, which is
 * the reference's shape and, on a page whose job is to be read down, four
 * more things to click. The rail advances on its own and can be scrolled by
 * hand; nothing has to be pressed to see all four.
 *
 * ONE CARD PER CLIENT, each on the 16:9 frame, content bottom-left.
 *
 * NO QUOTE AND NO FIGURES. There is no attributed quote anywhere in this repo
 * — every testimonial is '[Name], [Role], [Company]' with a placeholder flag
 * — and featuredCaseStudies.js says in capitals that its stat values are
 * invented and are not these clients' results. So a card carries the name and
 * the three measures the studio reports against, with the repo's own
 * missing-value mark where each figure goes. Put sourced numbers in METRICS
 * and the card is finished.
 *
 * IT ROTATES ONLY IF THE READER WANTS MOTION. prefers-reduced-motion stops
 * the timer outright, and hover or focus inside the rail pauses it, so it
 * cannot move under somebody reading or tabbing through it.
 *
 * NO PHOTOGRAPH. There is no artwork for any of this, which is why the work
 * cards are flat fills too.
 */
export default function IndustryStories({ clients = [], eyebrow = '[ Case studies ]', headline }) {
  const entries = clients.map(entryFor).filter(Boolean)
  const railRef = useRef(null)
  const [paused, setPaused] = useState(false)

  /* Advances by one card's width. scrollTo rather than an index into state:
     the rail is scrollable by hand too, so the DOM is the source of truth for
     where it is — reading it back means a manual scroll is not undone by the
     next tick. */
  const advance = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.firstElementChild
    if (!card) return
    const step = card.getBoundingClientRect().width + 16
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8
    rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + step, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (paused || entries.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(advance, 5000)
    return () => clearInterval(id)
  }, [advance, paused, entries.length])

  if (entries.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="industry-stories">
      <p className={styles.eyebrow}>{eyebrow}</p>
      {headline && <h2 className={styles.headline} id="industry-stories">{headline}</h2>}

      <div
        className={styles.rail}
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {entries.map((e) => (
          <article className={styles.card} key={e.slug}>
            <div className={styles.cardBody}>
              <p className={styles.client}>{e.name}</p>

              <dl className={styles.metrics}>
                {MEASURES.map((label) => (
                  <div key={label} className={styles.metric}>
                    <dt className={styles.metricLabel}>{label}</dt>
                    <dd className={styles.metricValue}>{TBC}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
