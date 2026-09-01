import home from './Home.module.css'
import v3 from './HomeV3.module.css'
import styles from './About.module.css'
import AudienceCards from '../components/AudienceCards'
import ContactCTA from '../components/ContactCTA'
import DepartmentPanel from '../components/DepartmentPanel'
import DisciplinesSection from '../components/DisciplinesSection'
import EmbedSection from '../components/EmbedSection'
import FooterCard from '../components/FooterCard'
import StatementCard from '../components/StatementCard'
import TestimonialWall from '../components/TestimonialWall'
import TrustMosaic from '../components/TrustMosaic'
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

      {/* THE POSITIONING STATEMENT, VERBATIM from Strategy/positioning.md —
          the sentence the brand-strategist owns, rather than a version of it
          written for this page. */}
      <StatementCard
        eyebrow="[ About ]"
        statement={
          <>
            The embedded creative and marketing team
            <br />that builds your brand and then grows it.
          </>
        }
        support={null}
        as="h1"
        center
        display
        bare
        rule={false}
      />

      <hr className={v3.divider} />

      <TrustMosaic />

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
          are deliberately absent. */}
      <section className={styles.section} aria-labelledby="pov">
        <p className={styles.eyebrow}>[ Our point of view ]</p>
        <h2 className={styles.headline} id="pov">What we argue, and what is behind it.</h2>

        <div className={styles.list}>
          {POV.map(({ claim, behind }) => (
            <div key={claim} className={styles.item}>
              <h3 className={styles.claim}>{claim}</h3>
              <p className={styles.behind}>{behind}</p>
            </div>
          ))}
        </div>
      </section>

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
    claim: 'Build and grow, one embedded team.',
    behind:
      'Most of the field does one half — identity and web, or campaigns and content. We hold the record of a single engagement running from positioning through the site to paid media with the same named people on both phases.',
  },
  {
    claim: 'The same people who already know the brand.',
    behind:
      'Resourcing names individuals against accounts week by week, with job codes per project and utilisation tracked per person. It is a model we operate rather than a promise we make.',
  },
  {
    claim: 'Strategy that gets executed.',
    behind:
      'The thinking does not sit in a deck. In the engagement above it ran positioning to audience definition to site to paid media in one continuous line, and the strategy demonstrably reached the ad.',
  },
  {
    claim: 'We revisit that thinking through analytics.',
    behind:
      'On one programme an assumption was tested and changed — growth spiked only with media spend while organic plateaued flat — and that finding redirected the work rather than being noted and ignored.',
  },
  {
    claim: 'We start where you are.',
    behind:
      'A pair of proposals was re-cut inside a single call once the prospect named a budget. Scope moves to the money rather than the other way round.',
  },
  {
    claim: 'AI enhances the work, it does not do the work.',
    behind:
      'The argument is public: the agent definitions in our own brand repository are built around judgment rather than generation, and each one names the thing it refuses to invent.',
  },
]
