import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './IndustryStories.module.css'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/* The same exclusions the wall makes: HIDDEN_SLUGS are studies somebody took
   down and a password means the project is not public. */
const bySlug = new Map(projects.filter((p) => p.slug).map((p) => [p.slug, p]))

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
      account: study.summary ?? study.tagline ?? null,
      services: study.services ?? (study.type ? study.type.split(' + ') : []),
    }
  }
  if (!project) return null
  return {
    slug,
    name: project.name,
    line: project.descriptor ?? null,
    account: project.relationship ?? project.descriptor ?? null,
    services: project.work ?? [],
  }
}

/**
 * CASE STUDIES, ONE AT A TIME — the reference's shape: a strip of clients
 * across the top, one of them lit, and a large passage underneath it.
 *
 * IT IS NOT A PULL QUOTE, and that is the one deliberate departure. The
 * reference sets a customer's own words over their photography, attributed to
 * a named person and their title. There is no such quote anywhere in this
 * repo: every testimonial is '[Name], [Role], [Company]' with a placeholder
 * flag, and TestimonialCard's own header says it wants a real quote from a
 * named person before it goes in front of a customer. Writing one and putting
 * a real company's name under it is the one thing this section must not do.
 *
 * SO THE LARGE TEXT IS WHAT WE ACTUALLY HOLD: the client's own account of the
 * engagement, out of projects.js, or a written case study's summary. It reads
 * at the same size and does the same job, and every word of it is already the
 * repo's. Swap it for real quotes the day there are any — the layout does not
 * change, only the source.
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
        {current.account && <p className={styles.account}>{current.account}</p>}

        <div className={styles.foot}>
          <NavLink to={`/work/${current.slug}`} className={styles.client}>
            {current.name}
          </NavLink>
          {current.line && <span className={styles.line}>{current.line}</span>}

          {current.services.length > 0 && (
            <span className={styles.tags}>
              {current.services.slice(0, 4).map((w) => (
                <span key={w} className={styles.tag}>{w}</span>
              ))}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
