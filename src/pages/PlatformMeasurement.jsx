import { ChartNoAxesColumn, TrendingUp, Activity, Target, GitPullRequest, CheckCheck } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import styles from './PlatformMeasurement.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ClientStrip from '../components/ClientStrip'
import ServiceFaq from '../components/ServiceFaq'
import DiffWindow from '../components/DiffWindow'
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

const ICONS = [ChartNoAxesColumn, TrendingUp, Activity, Target, GitPullRequest, CheckCheck]

/* The same field as the agents page, cell for cell — the two are pages about
   one system and the hero is where that has to be obvious. Columns are
   counted from the left on the left and from the right on the right, so the
   pattern holds its distance from both edges at any width. */
const CELLS = [
  { r: 2, c: 3, i: 0 },
  { r: 4, c: 6, i: null },
  { r: 5, c: 2, i: 1 },
  { r: 7, c: 5, i: 4, accent: true },
  { r: 9, c: 3, i: null },
  { r: 10, c: 7, i: 2 },
  { r: 12, c: 2, i: 3 },

  { r: 2, c: -4, i: 5 },
  { r: 4, c: -7, i: null },
  { r: 5, c: -3, i: 0 },
  { r: 7, c: -5, i: 4, accent: true },
  { r: 9, c: -3, i: null },
  { r: 10, c: -6, i: 1 },
  { r: 12, c: -4, i: 2 },

  { r: 14, c: 11, i: 3 },
  { r: 15, c: 15, i: null },
  { r: 14, c: -13, i: 5 },
  { r: 16, c: -17, i: null },
  { r: 15, c: 20, i: 4, accent: true },

  { r: 1, c: 13, i: null },
  { r: 1, c: -15, i: 2 },
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
        <div className={styles.field}>
          <span className={styles.lines} aria-hidden="true" />

          {CELLS.map(({ r, c, i, accent }, k) => {
            const Icon = i === null ? null : ICONS[i]
            return (
              <span
                key={k}
                className={`${styles.cell}${accent ? ' ' + styles.cellAccent : ''}`}
                style={{ gridRow: r, gridColumn: c }}
                aria-hidden="true"
              >
                {Icon && <Icon size={15} strokeWidth={1.3} aria-hidden="true" />}
              </span>
            )
          })}

          <div className={styles.heroCard}>
            <p className={styles.eyebrow}>[ Measurement ]</p>
            <h1 className={styles.headline}>
              The brand gets sharper, and you can read the diff.
            </h1>
            <p className={styles.intro}>
              Results do not sit in a dashboard waiting to be remembered. What worked comes back
              as a proposed change to the brand itself — so the next round starts from it.
            </p>
            <div className={styles.actions}>
              <button className={styles.ctaFilled} onClick={cal.open}>Book a demo</button>
              <NavLink className={styles.ctaGhost} to="/pricing">See pricing</NavLink>
            </div>
          </div>
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
