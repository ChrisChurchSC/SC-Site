import { NavLink } from 'react-router-dom'
import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'

import styles from './PlatformAgents.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ClientStrip from '../components/ClientStrip'
import ServiceFaq from '../components/ServiceFaq'
import DotNav from '../components/DotNav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { agents } from '../data/agents'

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
const ICONS = [Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList]

/* How a draft actually gets from an agent to something live. This is the
   sync CLI's real behaviour: a push opens a numbered review holding what the
   files would become, it writes nothing live, and merging is a person's
   job. */
const CELLS = [
  { r: 2, c: 3, i: 0 },
  { r: 4, c: 6, i: null },
  { r: 5, c: 2, i: 1 },
  { r: 7, c: 5, i: 2, accent: true },
  { r: 9, c: 3, i: null },
  { r: 10, c: 7, i: 3 },
  { r: 12, c: 2, i: 4 },
  { r: 13, c: 5, i: null },
  { r: 15, c: 4, i: 5 },

  { r: 2, c: -4, i: 3 },
  { r: 4, c: -7, i: null },
  { r: 5, c: -3, i: 4 },
  { r: 7, c: -5, i: 5, accent: true },
  { r: 9, c: -3, i: null },
  { r: 10, c: -6, i: 0 },
  { r: 12, c: -4, i: 1 },
  { r: 13, c: -7, i: null },
  { r: 15, c: -5, i: 2 },
]

const FLOW = [
  {
    n: '01',
    name: 'It drafts',
    note: 'Out of the repo — your positioning, your voice, your approved claims. Not a general model guessing at your brand.',
  },
  {
    n: '02',
    name: 'It marks what it cannot source',
    note: 'A claim with no proof point behind it comes back flagged rather than invented. The gap is the output.',
  },
  {
    n: '03',
    name: 'A person approves it',
    note: 'Every change is proposed. Nothing an agent writes goes live until somebody merges it.',
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

      <section className={styles.block} aria-labelledby="roster">
        <p className={styles.eyebrow}>[ The six ]</p>
        <h2 className={styles.blockHead} id="roster">
          One for each part of the job.
        </h2>

        <div className={styles.grid}>
          {agents.map(({ name, does, wont }, i) => {
            const Icon = ICONS[i]
            return (
              <article key={name} className={styles.card}>
                <span className={styles.cardIcon}>
                  <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <h3 className={styles.cardName}>{name}</h3>
                <p className={styles.cardDoes}>{does}</p>
                {/* The refusal as the card's tag — the reference puts a
                    category chip here, and for these six the refusal is the
                    category that matters. */}
                <span className={styles.cardWont}>
                  <span className={styles.wontKey}>Will not</span> {wont}
                </span>
              </article>
            )
          })}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.block} aria-labelledby="how">
        <p className={styles.eyebrow}>[ How they work ]</p>
        <h2 className={styles.blockHead} id="how">
          A draft, a flag, and a person who says yes.
        </h2>

        <ol className={styles.flow}>
          {FLOW.map(({ n, name, note }) => (
            <li key={n} className={styles.step}>
              <span className={styles.stepNum}>{n}</span>
              <h3 className={styles.stepName}>{name}</h3>
              <p className={styles.stepNote}>{note}</p>
            </li>
          ))}
        </ol>
      </section>

      <hr className={styles.divider} />

      <ServiceFaq />

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
      <DotNav />
    </main>
  )
}
