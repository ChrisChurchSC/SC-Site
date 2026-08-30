import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import styles from './PlatformAgents.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ClientStrip from '../components/ClientStrip'
import ServiceFaq from '../components/ServiceFaq'
import AgentWindow from '../components/AgentWindow'
import AgentRail from '../components/AgentRail'
import HowItWorks from '../components/HowItWorks'
import DotNav from '../components/DotNav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'

/**
 * /platform/agents — the first of the six platform pages.
 *
 * THE ARGUMENT OF THE PAGE IS THE REFUSALS. Six specialist agents is a
 * feature anyone can claim and nobody can check. What each one will not do
 * is checkable, and it is the reason a draft out of this system can be sent
 * rather than merely read: an agent that cannot invent a claim cannot put one
 * in your copy.
 *
 * EVERY "WILL NOT" COMES FROM THE AGENT'S OWN DEFINITION, read from
 * src/data/agents.js — the same list the /v3 card and the Encode step draw.
 * Nothing on this page is written to fit the layout.
 *
 * The icons are this page's own, matching the homepage card's set so the six
 * are recognisable across surfaces.
 */

/* How a draft actually gets from an agent to something live. This is the
   sync CLI's real behaviour: a push opens a numbered review holding what the
   files would become, it writes nothing live, and merging is a person's
   job. */
const ICONS = [Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList]

const CELLS = [
  { r: 2, c: 3, i: 0 },
  { r: 4, c: 6, i: null },
  { r: 5, c: 2, i: 1 },
  { r: 7, c: 5, i: 2, accent: true },
  { r: 9, c: 3, i: null },
  { r: 10, c: 7, i: 3 },
  { r: 12, c: 2, i: 4 },

  { r: 2, c: -4, i: 3 },
  { r: 4, c: -7, i: null },
  { r: 5, c: -3, i: 4 },
  { r: 7, c: -5, i: 5, accent: true },
  { r: 9, c: -3, i: null },
  { r: 10, c: -6, i: 0 },
  { r: 12, c: -4, i: 1 },

  /* Under the card, across the middle — the rows below it are clear the
     whole width, so the field reads as one surface rather than two margins
     with a panel between them. */
  { r: 14, c: 11, i: 5 },
  { r: 15, c: 15, i: null },
  { r: 14, c: -13, i: 2 },
  { r: 16, c: -17, i: null },
  { r: 15, c: 20, i: 1, accent: true },

  /* And two above it, so the card is not sitting on the top edge of the
     pattern. */
  { r: 1, c: 13, i: null },
  { r: 1, c: -15, i: 4 },
]



const FAQS = [
  {
    q: 'Can an agent publish something without me seeing it?',
    a: 'No. Every draft is proposed as a numbered review and writes nothing live. A person merges it, and that is the only way anything lands.',
  },
  {
    q: 'What are they trained on?',
    a: 'Your repo — positioning, tone of voice, audience, proof points, and the claims somebody has already approved. Not a general model guessing at your brand from its name.',
  },
  {
    q: 'Can an agent learn from feedback?',
    a: 'Yes, though nothing retrains. What changes is the repo: a rejected review, an edit you made, a claim you struck out — those get written back into the brand files, and every agent reads the corrected version the next time it runs. The learning is a commit, so you can see exactly what it learned and when.',
  },
  {
    q: 'What happens when there is no proof point for a claim?',
    a: 'It writes [CLAIM NEEDED] where the sentence would have gone, with what it was looking for. The gap comes back to you as a gap rather than as something plausible.',
  },
  {
    q: 'Where do they run?',
    a: 'Anywhere the repo is connected — a terminal, Claude Desktop, the Conscious app. An agent is a file rather than a seat in one tool, so it goes where the brand goes.',
  },
  {
    q: 'Can we add our own?',
    a: 'Yes. An agent is a markdown file — a role, what it reads, its tools, and the thing it will not do. Adding one is adding a file.',
  },
  {
    q: 'Do they replace the people who write for us?',
    a: 'No. They draft and they refuse; every decision about what may be claimed still belongs to a person.',
  },
]

export default function PlatformAgents() {
  const cal = useCalDrawer()

  useMeta({
    title: 'Agents | Super Conscious',
    description: 'Six agents trained on your brand — and the one thing each of them will not do.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <div className={styles.field}>
          {/* The lines are a background on their own layer so the mask that
              fades them at the edges does not also fade the card. */}
          <span className={styles.lines} aria-hidden="true" />

          {/* Filled cells, some with an icon and some without — a field of
              six logos reads as a logo wall, and the empty ones are what
              make it read as a grid with things in it. */}
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

          {/* SET INTO THE GRID, not laid over it: the card is a grid item, so
              its edges fall on gridlines and it reads as cells that have been
              filled rather than a panel dropped on top. */}
          <div className={styles.heroCard}>
            <p className={styles.eyebrow}>[ Agents ]</p>
            <h1 className={styles.headline}>
              Trained on your brand, and honest about what they do not know.
            </h1>
            <p className={styles.intro}>
              Six specialists that draft out of your repo — in your voice, off your positioning,
              against claims somebody has already approved.
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
        <p className={styles.sectionEyebrow}>[ What they are ]</p>
        <h2 className={styles.blockHead} id="what">
          Not a chatbot. A role, written down.
        </h2>
        <p className={styles.blockIntro}>
          Each agent is a file in your repo — what it owns, what it reads, and the one thing
          it will not do. It drafts from your brand rather than from the internet, and it is
          specific enough to be wrong in a way you can correct.
        </p>

        <div className={styles.windowWrap}>
          <AgentWindow />
        </div>
      </section>

      <hr className={styles.divider} />

      <AgentRail />

      <hr className={styles.divider} />

      <HowItWorks slug="agents" />

      <hr className={styles.divider} />

      <ServiceFaq items={FAQS} headline="The ones we get asked about agents." />

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
      <DotNav />
    </main>
  )
}
