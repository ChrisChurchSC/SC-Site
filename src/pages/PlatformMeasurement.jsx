import { NavLink } from 'react-router-dom'

import styles from './PlatformMeasurement.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ClientStrip from '../components/ClientStrip'
import ServiceFaq from '../components/ServiceFaq'
import DiffWindow from '../components/DiffWindow'
import FlowDiagram from '../components/FlowDiagram'
import DashboardWindow from '../components/DashboardWindow'
import HowItWorks from '../components/HowItWorks'
import DotNav from '../components/DotNav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'

/**
 * /platform/measurement — the second of the six platform pages.
 *
 * THE ARGUMENT OF THE PAGE IS THE LOOP, NOT THE DASHBOARD. Charts are the
 * least differentiated thing this system does; every analytics tool on the
 * market draws them, and none of them can do the step after. An analytics
 * tool never saw the brief, so the most it can tell you is that a number
 * moved. Here the number arrives attached to the asset that earned it, the
 * agent that drafted it and the decision it came from — which is what makes
 * it possible to propose a change to the brand rather than merely report on
 * it.
 *
 * So the centre of the page is a diff, not a chart. What worked becomes a
 * proposed edit to the files every agent reads, and a person merges it. The
 * dashboard is still here, one section down, because the view is real and the
 * page should show it — but it is evidence for the argument rather than the
 * argument.
 *
 * EVERY FIGURE ON THIS PAGE IS SAMPLE and comes from src/data/dashboard.js,
 * which is the one place the site keeps them so two surfaces cannot disagree.
 * Both windows carry the visible Sample data tag.
 *
 * THE COPY IS UNAPPROVED. The headline, the intros and all six answers below
 * are mine and have not been signed off.
 */

/* WHAT COMES BACK. Categories of data rather than figures — the numbers
   live in src/data/dashboard.js and are drawn where they can carry a Sample
   data tag. These names are wording and have not been signed off. */
const RESULTS = [
  { name: 'Email', items: ['Sends', 'Opens', 'Clicks', 'Conversions'] },
  { name: 'Paid social', items: ['Spend', 'Impressions', 'CTR'] },
  { name: 'Organic', items: ['Sessions', 'Referrers'] },
  { name: 'Web', items: ['Sessions', 'Signups'] },
  { name: 'CRM', items: ['Pipeline', 'Closed won'] },
]

/* AND WHAT CHANGES BECAUSE OF IT. The right column is the point of the page:
   results do not end in a chart, they end in an edit to a file. Strategy
   holds what is true and Verbal holds how it sounds, so a lesson lands in
   one or the other. */
const CHANGES = [
  { name: 'Proof points', items: ['Sourced claims', 'Re-check dates'] },
  { name: 'Tone of voice', items: ['What lands', 'What to cut'] },
  { name: 'Channel notes', items: ['Where it works', 'What to stop'] },
  { name: 'The next brief', items: ['Starts from this'] },
]

/* The questions the page provokes. Every mechanism in an answer is real: the
   review, the '––' placeholder convention this site already follows, the
   split between Strategy and Verbal, and a diff being something you can read.
   THE WORDING IS MINE AND UNAPPROVED. */
const FAQS = [
  {
    q: 'How is this different from an analytics dashboard?',
    a: 'An analytics tool never saw the brief. It can tell you a number moved; it cannot tell you which asset, which draft, or which decision moved it. Here the result arrives joined to all three, which is why it can propose a change to the brand instead of only reporting one.',
  },
  {
    q: 'Where do the numbers come from?',
    a: 'Your own channels, connected to the workspace. Nothing is modelled or estimated.',
  },
  {
    q: 'What happens when a number has no source?',
    a: 'It shows as ––. A blank you can see is worth more than a figure you cannot check, and it is the same rule the agents follow when a claim has no proof point.',
  },
  {
    q: 'Does it change the brand on its own?',
    a: 'No. It proposes. Every change arrives as a numbered review holding what the files would become, and nothing lands until a person merges it.',
  },
  {
    q: 'What does it actually change?',
    a: 'Files, in plain language: a proof point you may now make, a way of saying something, a note on which channel earns its place. Strategy holds what is true and Verbal holds how it sounds, so a result lands in one or the other rather than in a settings panel.',
  },
  {
    q: 'Can we see what it learned?',
    a: 'That is the whole point. Every lesson is a diff with a date, a source and a name on it — readable, revertible, and yours whichever model you are running next year.',
  },
]

export default function PlatformMeasurement() {
  const cal = useCalDrawer()

  useMeta({
    title: 'Measurement | Super Conscious',
    description: 'What shipped, what it moved, and what the brand changes because of it.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>[ Measurement ]</p>
        <h1 className={styles.headline}>
          The brand gets sharper, and you can read the diff.
        </h1>
        <p className={styles.intro}>
          Results do not sit in a dashboard waiting to be remembered. What worked comes back
          as a proposed change to the brand itself &mdash; so the next round starts from it.
        </p>
        <div className={styles.actions}>
          <button className={styles.ctaFilled} onClick={cal.open}>Book a demo</button>
          <NavLink className={styles.ctaGhost} to="/pricing">See pricing</NavLink>
        </div>

        {/* THE LOOP, DRAWN. The same diagram the service heroes use, because
            it is the same repo in the middle — only what arrives and what
            changes are this page's. */}
        <div className={styles.flowWrap}>
          <FlowDiagram
            centre="Repo"
            inputs={RESULTS}
            inputsLabel="What comes back"
            outputs={CHANGES}
          />
        </div>
      </header>

      <div className={styles.strip}>
        <ClientStrip banner />
      </div>

      <section className={`${styles.block} ${styles.blockCentered}`} aria-labelledby="what">
        <p className={styles.sectionEyebrow}>[ What it is ]</p>
        <h2 className={styles.blockHead} id="what">
          A result, and the change it argues for.
        </h2>
        <p className={styles.blockIntro}>
          Measurement here ends in an edit, not a chart. What the quarter proved is proposed
          against the files every agent reads, with the evidence attached and a person&rsquo;s
          name on the merge.
        </p>

        <div className={styles.windowWrap}>
          <DiffWindow />
        </div>
      </section>

      <hr className={styles.divider} />

      {/* The view is real and the page should show it — but one section down,
          as evidence for the argument rather than as the argument. */}
      <section className={styles.block} aria-labelledby="view">
        <p className={styles.sectionEyebrow}>[ The view ]</p>
        <h2 className={styles.blockHead} id="view">
          What shipped, and what it moved.
        </h2>
        <p className={styles.blockIntro}>
          Every asset that leaves the library is tagged, so the quarter is a list rather than
          somebody&rsquo;s memory of it — and each figure traces back to the work that earned it.
        </p>

        <div className={styles.windowWrap}>
          <DashboardWindow />
        </div>
      </section>

      <hr className={styles.divider} />

      <HowItWorks slug="measurement" />

      <hr className={styles.divider} />

      <ServiceFaq items={FAQS} headline="The ones we get asked about measurement." />

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
      <DotNav />
    </main>
  )
}
