import home from './Home.module.css'
import v3 from './HomeV3.module.css'
import AudienceCards from '../components/AudienceCards'
import ContactCTA from '../components/ContactCTA'
import DepartmentPanel from '../components/DepartmentPanel'
import DisciplinesSection from '../components/DisciplinesSection'
import EmbedSection from '../components/EmbedSection'
import FooterCard from '../components/FooterCard'
import HowItWorks from '../components/HowItWorks'
import StatementCard from '../components/StatementCard'
import TestimonialWall from '../components/TestimonialWall'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { BUILD_EMBED, embedCopyFor } from './ServiceV3'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'

const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

/**
 * ABOUT, ON THE HOMEPAGE'S PATTERN.
 *
 * IT LIVES AT /studio. /about is 301d to /services by vercel.json — the
 * capabilities page lived there before the Services rename — so a page
 * mounted on /about would never reach React in production. That redirect is
 * left alone rather than removed, because it is the only thing catching old
 * inbound links.
 *
 * IT IS A NEW PAGE, NOT A REWRITE. /about-us is the careers page — what it is
 * like to work here, the realities, the open roles, the freelancer signup —
 * and the nav pointed both About and Careers at it. Rewriting it would have
 * deleted the careers content to make room for this. So Careers keeps
 * /about-us and About gets its own route.
 *
 * EVERY CLAIM IS GRADED. SC-Brand/Strategy/proof-points.md v2 grades twelve
 * studio claims A, B or C and says which may be said publicly: A as stated, B
 * "if we would actually show it", C "only as opinion, never as fact". This
 * page uses the B-graded ones and the positioning statement, and none of the
 * C ones.
 *
 * SPECIFICALLY NOT HERE:
 *   - "No pooled or anonymous labor" — graded C and marked do not publish.
 *   - "Measured and optimized every month" — C: we instrument well, but there
 *     is no record of a client being shown a readout against goals.
 *   - "Our creative output is always 100% our own" — C: no written AI-use
 *     policy exists.
 *   - The A-graded analytics figures. They are the strongest thing the studio
 *     owns — 1.3M impressions and $0.48 per subscriber on $8,599 of spend —
 *     and proof-points.md says they need client permission to name. Nothing
 *     in the repo records that permission, so the claim appears without the
 *     client and without the numbers.
 */
export default function About() {
  const cal = useCalDrawer()

  useMeta({
    title: 'About | Super Conscious',
    description: 'The embedded creative and marketing team that builds your brand and then grows it.',
    path: '/studio',
  })

  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      {/* CHRIS'S LINE ON TOP, positioning.md's UNDERNEATH. The short one is
          the claim and the long one is the definition, which is what a hero
          support line is for — and it keeps the sentence the brand-strategist
          owns on the page rather than replacing it.

          `tall` is the size change: the hero holds more room, not more type.
          `bottom` then pushes the copy to the floor of that room, and dropping
          `center` returns it to the page's own left edge — so the extra height
          opens above the type rather than around it.

          `supportSerif` sets the line under it in Signifier rather than the
          11px mono the display variant defaults to — it is a sentence to read,
          not a caption.

          `inset` lines the type up with the sections under it — bare cards
          start on the page edge, and every other page's hero does not.

          The break is written here rather than left to the measure: it falls
          after "embedded" so "creative department" — the thing being claimed —
          holds together on one line. */}
      <StatementCard
        eyebrow="[ About ]"
        statement={['Your embedded', 'creative department.']}
        statementLines
        support="The embedded creative and marketing team that builds your brand and then grows it."
        as="h1"
        display
        tall
        bottom
        bare
        inset
        supportSerif
        rule={false}
      />

      <hr className={v3.divider} />

      {/* Who we are for, in the words positioning.md uses. AudienceCards'
          default cards are those three, so this is the shared set rather than
          a retyped one. */}
      <AudienceCards
        eyebrow="[ Who we are for ]"
        headline="Challenger brands — new, pivoting, or fighting to stand out."
      />

      <hr className={v3.divider} />

      <EmbedSection
        eyebrow={embedCopyFor('build').eyebrow}
        headline={embedCopyFor('build').headline}
        body={null}
        points={BUILD_EMBED}
        visual={<DepartmentPanel />}
      />

      <hr className={v3.divider} />

      {/* THE POINT OF VIEW, from positioning.md, trimmed to the claims
          proof-points.md grades B — evidenced, and we would show the record
          if challenged. The C-graded ones are named in this file's header and
          are deliberately absent.

          ON THE RAIL, not on cards. Six claims side by side are six things to
          scan; on the rail they are read one at a time in order, and each one
          holds the page for its dwell — which is the right reading for a claim
          that is only worth anything with its evidence attached. It is the same
          component the services pages use, given its own steps rather than a
          slug, so there is one rail on the site and not two. */}
      <HowItWorks
        slug="point-of-view"
        eyebrow="[ What is behind it ]"
        headline="Our point of view."
        steps={POV}
        rail
      />

      <hr className={v3.divider} />

      <DisciplinesSection
        eyebrow="[ Disciplines ]"
        headline="Twelve disciplines, one bench."
      />

      <hr className={v3.divider} />

      <TestimonialWall />

      <hr className={v3.divider} />

      <ContactCTA sub={CLOSING} form={false} bare>
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}

/* Each claim is positioning.md's, and each "behind" line is what
   proof-points.md holds as the evidence for it — stated as what we would show
   rather than as a result. Claim numbers 3, 4, 8, 10, 11 and 12, all graded B. */
const POV = [
  {
    n: '01',
    name: 'Build and grow, one embedded team.',
    note: 'Most of the field does one half — identity and web, or campaigns and content. We hold the record of a single engagement running from positioning through the site to paid media with the same named people on both phases.',
  },
  {
    n: '02',
    name: 'The same people who already know the brand.',
    note: 'Resourcing names individuals against accounts week by week, with job codes per project and utilization tracked per person. It is a model we operate rather than a promise we make.',
  },
  {
    n: '03',
    name: 'Strategy that gets executed.',
    note: 'The thinking does not sit in a deck. In the engagement above it ran positioning to audience definition to site to paid media in one continuous line, and the strategy demonstrably reached the ad.',
  },
  {
    n: '04',
    name: 'We revisit that thinking through analytics.',
    note: 'On one program an assumption was tested and changed — growth spiked only with media spend while organic plateaued flat — and that finding redirected the work rather than being noted and ignored.',
  },
  {
    n: '05',
    name: 'We start where you are.',
    note: 'A pair of proposals was re-cut inside a single call once the prospect named a budget. Scope moves to the money rather than the other way round.',
  },
  {
    n: '06',
    name: 'AI enhances the work, it does not do the work.',
    note: 'The argument is public: the agent definitions in our own brand repository are built around judgment rather than generation, and each one names the thing it refuses to invent.',
  },
]
