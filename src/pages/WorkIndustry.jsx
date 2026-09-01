import { Navigate, NavLink, useParams } from 'react-router-dom'

import home from './Home.module.css'
import v3 from './HomeV3.module.css'
/* The work grid's own stylesheet, so an industry page's cards are the cards
   from /work rather than a second set that drifts — the move ThoughtsIndex
   makes with the same file. */
import styles from './WorkIndustry.module.css'
import ContactCTA from '../components/ContactCTA'
import DisciplinesSection from '../components/DisciplinesSection'
import FooterCard from '../components/FooterCard'
import ServiceFaq from '../components/ServiceFaq'
import StatementCard from '../components/StatementCard'
import TestimonialCard from '../components/TestimonialCard'
import TrustMosaic from '../components/TrustMosaic'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { caseStudies } from '../data/caseStudies'
import { industries, industryBySlug } from '../data/industries'
import { projects } from '../data/projects'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

/* THE SAME EXCLUSIONS THE WALL MAKES, for the same reason: HIDDEN_SLUGS are
   studies somebody deliberately took down and a password means the project is
   not public. An industry page is another way into the same roster, so it has
   to honour both or it is a hole in the wall. */
const bySlug = new Map(projects.filter((p) => p.slug).map((p) => [p.slug, p]))

const entryFor = (slug) => {
  if (HIDDEN_SLUGS.has(slug)) return null
  const project = bySlug.get(slug)
  if (project?.password) return null

  /* THE ACCOUNT IS THE POINT. Every entry carries what actually happened in
     that engagement, in the words the repo already holds — a client's
     `relationship` in projects.js, or a case study's own `summary`. Nine of
     the eleven have one and they run 200 to 460 characters, which is the
     difference between a page that says "Food & Beverage" and one that says
     what we did for a mushroom grower and a natural wine brand.

     Nothing here is written for this page. If an entry has no account it
     falls back to its one-line descriptor, and if it has neither it still
     renders — the name and the disciplines are true on their own. */
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
 * ONE INDUSTRY, ON THE BUILD PAGE'S SHAPE.
 *
 * A statement, the work, who we are, what we do, a quote, the questions, the
 * ask — the order /services/build runs in, built from the sections that carry
 * their own copy.
 *
 * NO "HOW WE WORK" SECTION, and that is a restraint rather than an omission.
 * EmbedSection is on Build, but its words live in a PAGE constant inside
 * ServiceV3 and are not exported; copying them here would be two versions of
 * the same paragraph drifting apart the first time either is edited. Export
 * them from there and this page can render it too.
 *
 * THE STATEMENT IS THE INDUSTRY'S NAME. Not "we build brands in health &
 * wellness" — that is a claim about a track record, and the page below it is
 * two clients. The name says what the page is and the work makes the case.
 *
 * AN UNKNOWN SLUG REDIRECTS to the wall rather than rendering an empty shell,
 * the same way /services/:slug does.
 */
export default function WorkIndustry() {
  const { slug } = useParams()
  const cal = useCalDrawer()
  const industry = industryBySlug(slug)

  useMeta({
    title: industry ? `${industry.name} Case Studies | Super Conscious` : 'Case Studies | Super Conscious',
    description: industry
      ? `Brand and marketing work for ${industry.name.toLowerCase()} companies, from the Super Conscious studio.`
      : undefined,
    path: `/work/industry/${slug}`,
  })

  if (!industry) return <Navigate to="/work" replace />

  const entries = industry.clients.map(entryFor).filter(Boolean)

  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      <StatementCard
        eyebrow="[ Industry ]"
        statement={industry.name}
        support={null}
        as="h1"
        center
        display
        bare
        rule={false}
      />

      <hr className={v3.divider} />

      {/* WHAT ACTUALLY HAPPENED IN THIS CATEGORY. The first version of this
          page was a grid of thumbnails with the industry's name over it —
          four pages that differed in five strings and were otherwise
          identical, which is a filter rather than a page. This is the part
          that is specific, and all of it is the repo's own record. */}
      <section className={styles.section} aria-labelledby="industry-work">
        <p className={styles.eyebrow}>[ The work ]</p>
        <h2 className={styles.headline} id="industry-work">
          {entries.length === 1
            ? `One brand in ${industry.name.toLowerCase()}.`
            : `${entries.length} brands in ${industry.name.toLowerCase()}.`}
        </h2>

        <div className={styles.list}>
          {entries.map((e) => (
            <NavLink key={e.slug} to={`/work/${e.slug}`} className={styles.entry}>
              <div>
                <h3 className={styles.name}>{e.name}</h3>
                {e.line && <p className={styles.descriptor}>{e.line}</p>}
              </div>

              <div>
                {e.account && <p className={styles.account}>{e.account}</p>}
                {e.services.length > 0 && (
                  <div className={styles.tags}>
                    {e.services.map((w) => (
                      <span key={w} className={styles.tag}>{w}</span>
                    ))}
                  </div>
                )}
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <hr className={v3.divider} />

      <TrustMosaic />

      <hr className={v3.divider} />

      <DisciplinesSection
        eyebrow="[ Disciplines ]"
        headline="Twelve disciplines, one bench."
      />

      <hr className={v3.divider} />

      <TestimonialCard />

      <hr className={v3.divider} />

      <ServiceFaq />

      <ContactCTA sub={CLOSING} form={false} bare>
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}
