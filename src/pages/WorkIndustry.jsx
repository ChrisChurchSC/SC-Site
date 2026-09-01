import { Navigate, useParams } from 'react-router-dom'

import home from './Home.module.css'
import v3 from './HomeV3.module.css'
/* The work grid's own stylesheet, so an industry page's cards are the cards
   from /work rather than a second set that drifts — the move ThoughtsIndex
   makes with the same file. */
import styles from './WorkIndustry.module.css'
import AudienceCards from '../components/AudienceCards'
import ContactCTA from '../components/ContactCTA'
import DepartmentPanel from '../components/DepartmentPanel'
import EmbedSection from '../components/EmbedSection'
import IndustryStories from '../components/IndustryStories'
import DisciplinesSection from '../components/DisciplinesSection'
import FooterCard from '../components/FooterCard'
import ServiceFaq from '../components/ServiceFaq'
import StatementCard from '../components/StatementCard'
import TestimonialCard from '../components/TestimonialCard'
import TrustMosaic from '../components/TrustMosaic'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { BUILD_EMBED, embedCopyFor } from './ServiceV3'
import { industries, industryBySlug } from '../data/industries'
import { faqs } from '../data/pricingTabs'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'

const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'


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

  /* POINTS KEEP THEIR ICONS. An industry supplies the words; the icons stay
     BUILD_EMBED's, by position, so the three keep the meanings the shared
     section gave them and a data file does not have to import lucide. */
  const embedPoints = industry?.embed?.points
    ? industry.embed.points.map((pt, i) => ({ ...BUILD_EMBED[i], ...pt }))
    : BUILD_EMBED

  useMeta({
    title: industry ? `${industry.name} Case Studies | Super Conscious` : 'Case Studies | Super Conscious',
    description: industry
      ? `Brand and marketing work for ${industry.name.toLowerCase()} companies, from the Super Conscious studio.`
      : undefined,
    path: `/work/industry/${slug}`,
  })

  if (!industry) return <Navigate to="/work" replace />

  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      {industry.hero ? (
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>[ Industry ]</p>
            <h1 className={styles.heroHeadline}>{industry.name}</h1>
            <p className={styles.heroBody}>{industry.hero.lede}</p>

          </div>

          {/* FLAT GREY, 1:1, AND EMPTY. There is no artwork in this repo for
              any of this — the work cards say the same thing with the same
              treatment. A square fill is what a picture looks like when there
              is not one, and it is honest about that rather than dressing a
              screenshot of something else as this industry. */}
          <div className={styles.heroVisual} aria-hidden="true" />
        </section>
      ) : (
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
      )}

      <hr className={v3.divider} />

      {/* Only where an industry has written its three. No view toggle: a By
          industry switch on an industry page offers to re-sort the page by
          the thing the page is. */}
      {industry.situations && (
        <>
          <AudienceCards
            eyebrow="[ Who we work with ]"
            headline={`Three kinds of ${industry.name.toLowerCase()} brand.`}
            views={[
              { id: 'situation', label: 'By situation', cards: industry.situations },
              { id: 'stage', label: 'By company stage', cards: industry.stages },
            ]}
          />

          <hr className={v3.divider} />
        </>
      )}

      {/* The clients in this category, one at a time. */}
      <IndustryStories
        clients={industry.clients}
        headline={`${industry.name} work.`}
      />

      <hr className={v3.divider} />

      {/* HOW WE WORK, the same section /services/build runs, from the same
          constants rather than a retyped copy of them. It is true on any page
          that sells the studio, and this one had no account of how the work
          actually happens. */}
      <EmbedSection
        eyebrow={embedCopyFor('build').eyebrow}
        headline={industry.embed?.headline ?? embedCopyFor('build').headline}
        body={null}
        points={embedPoints}
        visual={<DepartmentPanel />}
      />

      <hr className={v3.divider} />

      <TrustMosaic />

      <hr className={v3.divider} />

      <DisciplinesSection
        eyebrow="[ Disciplines ]"
        headline={industry.disciplinesHeadline ?? 'Twelve disciplines, one bench.'}
      />

      <hr className={v3.divider} />

      <TestimonialCard />

      <hr className={v3.divider} />

      {/* The industry's own questions first, then the pricing list unchanged:
          ServiceFaq's header is explicit that answering the commercial ones
          differently from /pricing is worse than not answering them. */}
      <ServiceFaq items={industry.faq ? [...industry.faq, ...faqs] : undefined} />

      <ContactCTA sub={CLOSING} form={false} bare>
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}
