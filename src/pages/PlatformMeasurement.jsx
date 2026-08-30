import { NavLink } from 'react-router-dom'

import styles from './PlatformMeasurement.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ClientStrip from '../components/ClientStrip'
import ServiceFaq from '../components/ServiceFaq'
import DiffWindow from '../components/DiffWindow'
import MeasureCards from '../components/MeasureCards'
import EmailCaptureForm from '../components/EmailCaptureForm'
import FlowDiagram from '../components/FlowDiagram'
import DashboardWindow from '../components/DashboardWindow'
import HowItWorks from '../components/HowItWorks'
import DotNav from '../components/DotNav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { dashboard } from '../data/dashboard'

/**
 * /platform/measurement — the second of the six platform pages.
 *
 * THE PAGE IS ANALYTICS FIRST, AND THE LOOP IS WHAT HAPPENS AFTER. This page
 * led with the diff for a version, which put the argument before the thing:
 * Measurement is a dashboard, and a visitor who has not been shown one has no
 * reason to care what the system does with it. So the dashboard is the hero.
 *
 * Then the differentiator, in order. The flow diagram shows every channel
 * arriving in one place and joining to the work that earned it — which is
 * what an analytics tool cannot do, because it never saw the brief. And the
 * diff is the payoff: what the numbers proved, proposed as an edit to the
 * files every agent reads, waiting on a person.
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
    q: 'Where do the numbers come from?',
    a: 'Your own channels, connected to the workspace. Nothing is modelled or estimated.',
  },
  {
    q: 'What happens when a number has no source?',
    a: 'It shows as ––. A blank you can see is worth more than a figure you cannot check, and it is the same rule the agents follow when a claim has no proof point.',
  },
  {
    q: 'How is this different from an analytics dashboard?',
    a: 'An analytics tool never saw the brief. It can tell you a number moved; it cannot tell you which asset, which draft, or which decision moved it. Here the result arrives joined to all three, which is why it can propose a change to the brand instead of only reporting one.',
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
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>[ Measurement ]</p>
          <h1 className={styles.headline}>
            What shipped, and what it moved.
          </h1>
          <p className={styles.intro}>
            Every channel in one view, each figure joined to the asset that earned it &mdash; so
            performance reads as the work that produced it rather than as a row in a chart.
          </p>
          <div className={styles.formWrap}>
            <EmailCaptureForm
              styles={styles}
              variant="compact"
              placeholder="What's your work email?"
              submitLabel="Book a walkthrough"
              subject="Measurement page — demo request"
              requestType="platform-measurement-demo"
              confirmMessage="Thanks — we will send over a couple of times to walk you through it."
            />
            {/* Says what the form does, and nothing about how fast anyone
                replies. Response times are Chris's to keep. */}
            <p className={styles.formNote}>We&rsquo;ll follow up by email.</p>
          </div>
        </div>

        {/* THE VIEW ITSELF, on a ground of its own. Measurement is a dashboard
            before it is anything else, and the top of the page is where that
            gets shown rather than described. */}
        <div className={styles.heroStage}>
          <DashboardWindow ratio="1 / 1" bare />
        </div>
      </header>

      <section className={styles.cardsBlock} aria-label="What measurement does for the brand">
        <MeasureCards />
      </section>

      <hr className={styles.divider} />

      <div className={styles.strip}>
        <ClientStrip banner />
      </div>

      <section className={`${styles.block} ${styles.blockCentered}`} aria-labelledby="what">
        <p className={styles.sectionEyebrow}>[ What it measures ]</p>
        <h2 className={styles.blockHead} id="what">
          Every channel, joined to the work.
        </h2>
        <p className={styles.blockIntro}>
          Results arrive in one place and attach to the asset that earned them, the agent that
          drafted it and the brief behind it. An analytics tool can tell you a number moved. It
          cannot tell you which piece of work moved it.
        </p>

        <div className={styles.flowWrap}>
          <FlowDiagram
            centre="Repo"
            inputs={RESULTS}
            inputsLabel="What comes back"
            outputs={CHANGES}
          />
        </div>
      </section>

      <hr className={styles.divider} />

      {/* AND THE PAYOFF. Everything above is a report until this happens. */}
      <section className={`${styles.block} ${styles.blockCentered}`} aria-labelledby="next">
        <p className={styles.sectionEyebrow}>[ What happens next ]</p>
        <h2 className={styles.blockHead} id="next">
          The brand gets sharper, and you can read the diff.
        </h2>
        <p className={styles.blockIntro}>
          What the quarter proved is proposed against the files every agent reads &mdash; a claim
          you may now make, a way of saying it &mdash; with the evidence attached and a
          person&rsquo;s name on the merge.
        </p>

        <div className={styles.windowWrap}>
          <DiffWindow />
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
