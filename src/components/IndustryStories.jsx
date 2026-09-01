import { useState } from 'react'
import { NavLink } from 'react-router-dom'

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
      line: study.industry ?? null,
    }
  }
  if (!project) return null
  return {
    slug,
    name: project.name,
    line: project.descriptor ?? null,
  }
}

/**
 * CASE STUDIES, ONE AT A TIME — the reference's shape: a strip of clients
 * across the top, one of them lit, and a large passage underneath it.
 *
 * NO QUOTE. There is no attributed quote anywhere in this repo — every
 * testimonial is '[Name], [Role], [Company]' with a placeholder flag — and
 * Chris asked for the name and the measures instead. What each client got
 * still reads on its own page, which the link under the measures goes to.
 *
 * NO PHOTOGRAPH BEHIND IT. There is no artwork for any of this, which is why
 * the work cards are flat fills too. A stock image of a cargo ship would be a
 * picture of somebody else's client.
 *
 * THE STRIP IS NAMES, NOT LOGOS. clientLogos.js exists but does not cover
 * this roster, and a strip where half the marks were wordmarks and half were
 * set in Signifier would read as broken rather than as mixed.
 */
export default function IndustryStories({ clients = [], eyebrow = '[ Case studies ]' }) {
  const entries = clients.map(entryFor).filter(Boolean)
  const [active, setActive] = useState(0)

  if (entries.length === 0) return null

  const current = entries[Math.min(active, entries.length - 1)]

  return (
    <section className={styles.section} aria-labelledby="industry-stories">
      <div className={styles.strip}>
        <p className={styles.eyebrow} id="industry-stories">{eyebrow}</p>

        <div className={styles.tabs}>
          {entries.map((e, i) => (
            <button
              key={e.slug}
              type="button"
              className={i === active ? styles.tabOn : styles.tab}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* aria-live so the change a click makes is announced, the way the
          work cards' well is. */}
      <div className={styles.panel} aria-live="polite">
        <p className={styles.client}>{current.name}</p>

        <dl className={styles.metrics}>
          {MEASURES.map((label) => (
            <div key={label} className={styles.metric}>
              <dt className={styles.metricLabel}>{label}</dt>
              <dd className={styles.metricValue}>{TBC}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.foot}>
          {/* THE TAG STAYS WHILE THE FIGURES ARE MISSING. It is what stops
              four named clients appearing to have published results. */}
          <span className={styles.provisional}>Figures not published</span>
          {current.line && <span className={styles.line}>{current.line}</span>}
          <NavLink to={`/work/${current.slug}`} className={styles.more}>
            See the work →
          </NavLink>
        </div>
      </div>
    </section>
  )
}
