import { NavLink, Navigate, useParams } from 'react-router-dom'

import styles from './ServiceV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FlowDiagram from '../components/FlowDiagram'
import DashboardWindow from '../components/DashboardWindow'
import InMarketPanel from '../components/InMarketPanel'
import ClientStrip from '../components/ClientStrip'
import PlatformIntro from '../components/PlatformIntro'
import PlatformOutputs from '../components/PlatformOutputs'
import HowItWorks from '../components/HowItWorks'
import FeaturedWall from '../components/FeaturedWall'
import TestimonialCard from '../components/TestimonialCard'
import ServiceFaq from '../components/ServiceFaq'
import DotNav from '../components/DotNav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { serviceBySlug } from '../data/services'

/**
 * One page per service, from one template.
 *
 * FOUR PAGES OR ONE COMPONENT. They differ in their words and not in their
 * shape, so a component per service would be four files diverging quietly —
 * the kind of thing where Build gets a fix and Represent does not. The route
 * is /services/:slug and the data is src/data/services.js.
 *
 * BUILD AND GROW ARE CHRIS'S WORDS. Support and Represent are drafts of
 * mine, and the page says so on those two rather than only in a comment: a
 * visitor reading an unsigned-off description of a service should be able to
 * tell, and so should whoever ships this.
 *
 * NO PRICE IS INVENTED. Build and Grow carry the figures that are on the
 * pricing page because both read the same numbers. Support and Represent
 * have no published rate, so they say that instead of guessing one.
 *
 * AN UNKNOWN SLUG REDIRECTS rather than rendering an empty shell — there are
 * exactly four services, and /services/anything-else is a typo.
 */
/* WHAT GROW'S HOURS MAKE — see the note at the mount below. Deliverables
   are Chris's own words from services.js; the website/app split and the App
   summary are mine. */
const GROW_CARDS = [
  {
    kicker: '01',
    name: 'Website',
    summary: 'The site stops being a launch and becomes something you tune every month.',
    lines: [
      'Conversion Optimization',
      'Landing Pages',
      'A/B Testing',
      'Ongoing SEO/AEO',
      'Analytics',
      /* mine */ 'Content Updates',
    ],
  },
  {
    kicker: '02',
    name: 'App',
    summary: 'What you shipped keeps shipping — new features, and the speed to hold them.',
    lines: [
      'New Features',
      'Performance',
      'Integrations',
      'Deployment',
      /* mine */ 'Release Notes',
    ],
  },
  {
    kicker: '03',
    name: 'Campaigns',
    summary: 'Budget moves toward what is working, on evidence rather than instinct.',
    lines: [
      'Ad Variants',
      'Audience Segments',
      'Creative Tests',
      'Performance Report',
      'Dashboards',
      /* mine */ 'Budget Shifts',
    ],
  },
  {
    kicker: '04',
    name: 'Channels',
    summary: 'The feed keeps moving at the volume the platforms want, without the work getting worse.',
    lines: [
      'Always-On Content',
      'Short-Form Video',
      'Email & SMS',
      'Channel Expansion',
      /* mine */ 'Channel Reporting',
    ],
  },
]
/* WHICH GROUND EACH HERO SITS ON. Keyed by hero visual, not by slug: the
   window and the colour under it are one decision, and splitting them across
   two lookups is how a page ends up teal with a purple panel in it.

   A service with no hero visual falls through to .top's pink default, which
   is Build. */
const GROUND = {
  dashboard: 'topPurple',
}

/* The services with a how-it-works set in HowItWorks.jsx. Represent has no
   four steps anybody has written, so it gets no section rather than an
   invented one.

   Grow's four and Support's four are Chris's words. Build's are mine and are
   not signed off. */
const HAS_STEPS = ['build', 'grow']

export default function ServiceV3() {
  const { slug } = useParams()
  const cal = useCalDrawer()
  const service = serviceBySlug(slug)

  useMeta({
    title: service ? `${service.name} | Super Conscious` : 'Services | Super Conscious',
    description: service?.tagline,
  })

  if (!service) return <Navigate to="/services" replace />

  return (
    <main className={styles.page}>
      <V3Nav />

      {/* The hero and its diagram share one ground, so the dot field runs
          behind both rather than stopping where the copy ends. They were
          siblings and the texture belonged to the diagram alone, which drew
          a line across the page at exactly the point the eye is still
          reading. */}
      {/* A GROUND PER SERVICE. Three of the four pages used to share the pink
          default, which is most of why they read as one page with the words
          swapped. The hue is picked off the hero visual rather than the slug,
          so a service that changes its window changes its ground with it. */}
      <div className={`${styles.top}${GROUND[service.heroVisual] ? ' ' + styles[GROUND[service.heroVisual]] : ''}`}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>[ {service.name} ]</p>
          <h1 className={styles.headline}>{service.tagline}</h1>

          {service.draft && (
            /* On the page, not only in the source. Someone reading this should
               be able to tell that nobody has signed it off yet. */
            <p className={styles.draftFlag}>
              Draft — this description has not been signed off yet.
            </p>
          )}

          <div className={styles.heroActions}>
            <button className={styles.ctaFilled} onClick={cal.open}>Book a demo</button>
            <NavLink className={styles.ctaGhost} to="/pricing">See pricing</NavLink>
          </div>
        </header>

        {/* THE REPO IS THE MIDDLE, not the service.

            The first version put the service name in the centre, which drew
            the wrong picture: it said the inputs become Build, and Build
            becomes a brand. What actually happens is that everything goes into
            the repo, and the outputs come out of it — the service is the work
            around that, not a stage in the middle of it. Putting the platform
            there is also the argument the rest of the site makes.

            The right column is this service's four pillars, from services.js.
            It used to be echoed by a "What it covers" section underneath;
            that is cut, so this diagram is now the only place the pillars
            appear on the page. */}
        {service.heroVisual === 'dashboard' ? (
          <div className={styles.heroWindow}>
            <div className={styles.heroSplit}>
              <DashboardWindow />
              <InMarketPanel />
            </div>
          </div>
        ) : (
          <FlowDiagram
            centre="Repo"
            outputs={service.pillars.map(({ name, items, outputs, media, status }) => ({
              name,
              media,
              status,
              /* A pillar that names its own outputs uses them; the rest fall
                 back to the first three deliverables, which read as outputs
                 already. */
              items: (outputs ?? items).slice(0, 3),
            }))}
          />
        )}
      </div>

      {/* Under the hero, not inside it: the block above carries the gradient
          and the dot field, and pulling the strip into that would put client
          names on top of the texture. Out here it does the job a strip does,
          which is to end the hero. Full bleed, so its rules run the width of
          the page rather than stopping at the reading margin. */}
      <div className={styles.clients}>
        <ClientStrip banner />
      </div>

      <hr className={styles.divider} />

      <PlatformIntro visual={service.heroVisual === 'dashboard' ? 'asset' : 'repo'} />

      {/* The section renders itself only for a service that has four steps,
          so this is a slug test rather than a list to keep in sync — see
          HowItWorks.jsx. Grow's four and Support's four are both Chris's. */}
      {HAS_STEPS.includes(service.slug) && (
        <>
          <hr className={styles.divider} />
          <HowItWorks slug={service.slug} />
        </>
      )}

      <hr className={styles.divider} />

      {/* Grow is bought by the hour, so its cards are what the hours make.
          Four, as Chris listed them: website, app, campaigns, channels.

          BRAND IS NOT ONE OF THEM here. Grow's Brand pillar is governance
          and upkeep — keeping the system coherent — which is what Support
          covers on the page next door. It is still in services.js and still
          in the hero diagram; it is only cut from this section.

          WEBSITE AND APP ARE ONE PILLAR IN THE DATA and two cards here. The
          split of its six deliverables between them is MINE and is not
          signed off: optimization, landing pages, testing and SEO read as
          site work; features and performance read as app work. The App
          summary is mine too — the pillar's own line is about the site. */}
      <PlatformOutputs cards={service.slug === 'grow' ? GROW_CARDS : undefined} />

      <hr className={styles.divider} />

      <div className={styles.featured}>
        <FeaturedWall />
      </div>

      <hr className={styles.divider} />

      <TestimonialCard variant={service.slug} />

      <hr className={styles.divider} />

      <ServiceFaq />

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />

      {/* Fixed to the viewport rather than in the flow, so it goes after
          everything else in the source. */}
      <DotNav />
    </main>
  )
}
