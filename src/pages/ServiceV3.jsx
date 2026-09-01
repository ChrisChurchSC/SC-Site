import { NavLink, Navigate, useParams } from 'react-router-dom'

import styles from './ServiceV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import PlatformOutputs from '../components/PlatformOutputs'
import EmbedSection from '../components/EmbedSection'
import AudienceCards from '../components/AudienceCards'
import StatementCard from '../components/StatementCard'
import DepartmentPanel from '../components/DepartmentPanel'
import DisciplinesSection from '../components/DisciplinesSection'
import BrandTokens from '../components/BrandTokens'
import AssetsGridWindow from '../components/AssetsGridWindow'
import DashboardWindow from '../components/DashboardWindow'
import TrustMosaic from '../components/TrustMosaic'
import ComparisonTable from '../components/ComparisonTable'
import FeaturedWall from '../components/FeaturedWall'
import TestimonialCard from '../components/TestimonialCard'
import ServiceFaq from '../components/ServiceFaq'
import DotNav from '../components/DotNav'
import { KeyRound, SlidersHorizontal, Users } from 'lucide-react'

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
    kicker: '03',
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
/* The per-service coloured grounds are gone with the dot field. Each hero
   used to sit on a gradient picked off its visual — pink for Build, purple
   for Grow — which was doing the work of telling four service pages apart.
   There are two now, and they are flat. */


/* HOW WE WORK, on Build, in the shape EmbedSection already draws for Grow.

   THE THREE PAY OFF "FRACTIONAL" rather than restating "one team". The
   headline claims a fractional department, and a claim in a headline that
   nothing underneath it collects is the kind of sentence this whole system
   exists to refuse — so the first says what a department is (every
   discipline you would otherwise hire), the second says what fractional
   means (it flexes with the work, not with headcount), and the third is the
   part that makes it a department rather than a supplier.

   "FRACTIONAL" IS A WORDING CHANGE FROM THE POSITIONING DOC, made on
   request. Strategy/positioning.md says "outsourced creative and marketing
   department"; this section says fractional, which claims something slightly
   different — outsourced is where the work happens, fractional is how much of
   a department you are buying. The second is the better sentence and it is
   the one Chris asked for, but the doc and the site now disagree on the word,
   and the doc is the one brand-strategist owns. Worth reconciling there.

   ONE SENTENCE OF HIS IS HELD OUT, deliberately and reversibly. He wrote
   "No pooled or anonymous labor, no rotating bench — the same people, every
   time." Strategy/proof-points.md carries that as claim #5, grades it C and
   says in as many words: do not publish this one. Its warning is specific —
   freelance capacity is load-bearing rather than overflow, and the primary
   writer across four major accounts is engaged freelance. What survives is
   the half that IS evidenced: claim #4, grade B, backed by weekly resourcing
   that names individuals and a pod structure with named clients. A
   governance hold, not an editorial opinion; one line to restore. */
/* ONE SEQUENCE, TWO SERVICES. Grow was a different page — its own hero with
   a dashboard beside it, a how-it-works, no client wall, no comparison. It
   runs Build's order now, with its own words in it: hero, proof, who we work
   with, how we work, the platform diagram, what it extends to, why us, work,
   testimonial, questions.

   WHAT THAT COST, and it is worth knowing rather than discovering: Grow's
   how-it-works is no longer rendered. Its four steps — Grow, Measure,
   Compound, Maintain — are Chris's own words and are still in
   HowItWorks.jsx, unused. Mirroring the pages exactly is what removed them;
   putting the section back is one line if the four are worth more than the
   symmetry.

   THE COPY BELOW IS MINE AND UNAPPROVED. */
/* The build page's own embed copy, exported alongside BUILD_EMBED for the
   same reason. */
export const embedCopyFor = (slug) => PAGE[slug]?.embed ?? PAGE.build.embed

const PAGE = {
  build: {
    statement: 'We build brand platforms.',
    embed: {
      eyebrow: '[ How we work ]',
      headline: <>Your fractional creative<br />and marketing<br />department.</>,
    },
    platform: {
      eyebrow: '[ Brand platform ]',
      headline: 'What a brand is made of.',
      intro: 'Everything the brand is made of goes into one place, and everything it makes comes out of it — so the next piece of work starts from the thing itself rather than from a summary of it.',
    },
  },
  grow: {
    statement: 'We take brands to market.',
    embed: {
      eyebrow: '[ How we work ]',
      headline: <>The same team that<br />built it, running it<br />every month.</>,
    },
    platform: {
      eyebrow: '[ Growth platform ]',
      headline: 'What the brand shows up as, every month.',
      intro: 'The work is produced from the brand rather than from a brief about it — so what goes out in month six still sounds like what went out in month one, and what it earns comes back in.',
    },
  },
}

/* EXPORTED so the industry pages can render the same section. It was kept
   private and that is why they went without one: the alternative was a second
   copy of this paragraph, and two copies of a paragraph drift the first time
   either is edited. One source, two pages — the arrangement the footer and
   the disciplines list already use. */
export const BUILD_EMBED = [
  {
    Icon: Users,
    key: 'A whole department',
    line: 'Design, writing, film, motion, media and engineering in one team — not six hires.',
  },
  {
    Icon: SlidersHorizontal,
    key: 'At the fraction you need',
    line: 'It flexes with the work rather than with your headcount.',
  },
  {
    Icon: KeyRound,
    key: 'People you know',
    line: 'Embedded in your team, and you have access to them.',
  },
]

/* GROW'S THREE, mirroring Build's: what the arrangement is, what it costs
   you, and who you are dealing with. MINE AND UNAPPROVED. */
const GROW_EMBED = [
  { Icon: Users, key: 'One team, both halves', line: 'Whoever built the brand runs the campaigns against it.' },
  { Icon: SlidersHorizontal, key: 'Scales with the work', line: 'Up for a launch, down between them, without a hiring round.' },
  { Icon: KeyRound, key: 'People you know', line: 'Embedded in your team, and you have access to them.' },
]

/* GROW'S DIAGRAM IS A DIFFERENT SENTENCE. Build's reads inputs → system →
   pillars: what a brand is made of. Grow's reads platform → content →
   dashboard: what the brand already is, the work produced from it every
   month, and the numbers that come back.

   The left column is Grow's own pillars out of services.js — the platform is
   what feeds the month, not an abstraction. The middle is the asset grid and
   the right is the dashboard, both of them real windows this site already
   draws, so the last two stages are screens rather than lists of nouns. */
/* BRAND IS CUT FROM THIS COLUMN, and only from here. Grow's Brand pillar is
   governance and upkeep — keeping the system coherent — which is the input to
   a month rather than a thing the month produces. PlatformOutputs already
   cuts it from Grow's cards for the same reason; this matches that. It is
   still in services.js and still on /pricing.

   Excluded by name rather than index, so reordering the pillars cannot
   silently drop a different one. */
const GROW_CUT = new Set(['Brand'])

const GROW_INPUTS = (serviceBySlug('grow')?.pillars ?? [])
  .filter(({ name }) => !GROW_CUT.has(name))
  /* A MOSAIC AND A NAME, NO CHIPS. media: 'placeholder' is the four-tile grey
     bento FlowDiagram's Column already draws — the same treatment Build's
     output cards use — and dropping items takes the deliverable chips off
     with it.

     THE TILES ARE FLAT FILLS, as every asset tile on this site is: there is
     no artwork in this repo, and a case study still standing in for "the
     website we run" would be a picture of somebody else's month. The card's
     shape does not change when real images arrive. */
  .map(({ name }) => ({ name, media: 'placeholder' }))

export default function ServiceV3() {
  const { slug } = useParams()
  const cal = useCalDrawer()
  const service = serviceBySlug(slug)

  useMeta({
    title: service ? `${service.name} | Super Conscious` : 'Services | Super Conscious',
    description: service?.tagline,
  })

  const page = PAGE[service.slug]

  if (!service || !page) return <Navigate to="/services" replace />

  return (
    <main className={styles.page}>
      <V3Nav />

      {/* BOTH SERVICES OPEN ON THE HOMEPAGE'S CARD. Grow had a hero of its
          own with a dashboard beside it; mirroring the pages retired it, and
          the service hero, the client strip and the coloured ground went with
          it. */}
      <StatementCard
        eyebrow={`[ ${service.name} ]`}
        statement={page.statement}
        support={null}
        as="h1"
        tall
        center
        display
      >
        {/* ONE WAY OUT, and it is the quiet one. The nav's Start a project is
            there for anyone ready to ask. */}
        <div className={styles.heroActions}>
          <NavLink className={styles.ctaGhost} to="/pricing">See pricing</NavLink>
        </div>
      </StatementCard>

      {/* WHO WE HAVE DONE IT FOR. TrustMosaic is the homepage's
          client wall — the same twenty names, read rather than scrolled past.
          It replaces the strip that used to sit under the hero: proof belongs
          in a section of its own, not as texture under a heading. */}
      <hr className={styles.divider} />
      <TrustMosaic />

      {/* WHO IT IS FOR. The three kinds of brand are Chris's,
          straight out of positioning.md, and AudienceCards already drew them
          for the homepage — so this is the same component rather than a
          second copy that would drift from it.

          ITS THREE LINKS ALL GO TO /work. There is no new / pivoting /
          underdog taxonomy on a project and no filtered route to send them
          to; that decision and its reasoning live in AudienceCards. Turning
          them into three real destinations needs one tag per project, which
          is a call about clients rather than code. */}
      <hr className={styles.divider} />
      <AudienceCards />

      {/* HOW WE WORK, both services, same shape and same resourcing sheet —
          the words and the three points come from PAGE and from
          BUILD_EMBED / GROW_EMBED. See BUILD_EMBED for the sentence of
          Chris's held back and why. */}
      <hr className={styles.divider} />
        {/* body={null}: no paragraph. The headline makes the claim and the
            three points collect it, so the sentence between them was
            restating both. Grow passes nothing and keeps its own. */}
      <EmbedSection
        eyebrow={page.embed.eyebrow}
        headline={page.embed.headline}
        body={null}
        points={service.slug === 'grow' ? GROW_EMBED : BUILD_EMBED}
        visual={<DepartmentPanel />}
      />

      {/* Grow is bought by the hour, so its cards are what the hours make.
   Three: website, campaigns, channels. App was a fourth and is cut — see the
   note on the pillar rename in services.js.

          BRAND IS NOT ONE OF THEM here. Grow's Brand pillar is governance
          and upkeep — keeping the system coherent — which is what Support
          covers on the page next door. It is still in services.js and still
          in the hero diagram; it is only cut from this section.

          WEBSITE AND APP ARE ONE PILLAR IN THE DATA and two cards here. The
          split of its six deliverables between them is MINE and is not
          signed off: optimization, landing pages, testing and SEO read as
          site work; features and performance read as app work. The App
          summary is mine too — the pillar's own line is about the site. */}
      <hr className={styles.divider} />

      {/* THE BENCH ITSELF, straight after the section that says you get a
          department. That section shows the twelve as a resourcing grid —
          names and hours — and never says what any of them is; this does.
          The headline is Chris's own line from /services, where it sits
          above 'the full list is below'.

          ONE RULE ABOVE IT, not two. The rule that used to close the section
          above is the one this section opens on — adding a second left an
          empty band between two lines. A section takes a divider with it;
          inserting one means using the seam that is already there. */}
      <DisciplinesSection
        eyebrow="[ Disciplines ]"
        headline="Twelve disciplines, one bench."
      />

      <hr className={styles.divider} />

      {/* THE PLATFORM DIAGRAM, both services. Before "what it extends to",
          because what the brand is made of has to land before the list of
          things it shows up as. The right column is the service's own
          pillars; everything else is shared. */}
      <BrandTokens
        slug={service.slug}
        eyebrow={page.platform.eyebrow}
        headline={page.platform.headline}
        intro={page.platform.intro}
        inputs={service.slug === 'grow' ? GROW_INPUTS : undefined}
        centreVisual={service.slug === 'grow' ? <AssetsGridWindow /> : undefined}
        outputsVisual={service.slug === 'grow' ? <DashboardWindow /> : undefined}
      />

      <hr className={styles.divider} />

      <PlatformOutputs cards={service.slug === 'grow' ? GROW_CARDS : undefined} />

      {/* WHY US. ComparisonTable is the homepage's.
          ITS OWN HEADER SAYS NOTHING IN IT IS SIGNED OFF — every row name and
          every mark is ours, and seven of the nine rows are claims about
          third parties. It is here because Chris asked for a why-us beat and
          this is the section the site already has for it; it is the first
          thing to pull if the register is ever enforced on this page. */}
      <hr className={styles.divider} />
      <ComparisonTable />

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
