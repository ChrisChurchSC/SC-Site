import { useEffect, useRef, useState } from 'react'

import styles from './HowItWorks.module.css'
import InputsWindow from './InputsWindow'
import DesignWindow from './DesignWindow'
import DeployWindow from './DeployWindow'
import AgentWindow from './AgentWindow'
import DraftWindow from './DraftWindow'
import ReviewWindow from './ReviewWindow'
import AdoptWindow from './AdoptWindow'
import AssetsGridWindow from './AssetsGridWindow'
import RepoWindow from './RepoWindow'
import AssetWindow from './AssetWindow'
import InMarketPanel from './InMarketPanel'
import DashboardWindow from './DashboardWindow'

/**
 * HOW IT WORKS — the operating loop of a service.
 *
 * The four words in each set are Chris's. The line under each is mine and is
 * not signed off.
 *
 * ONE COMPONENT, ONE SET PER SERVICE. Grow's four came first and this was
 * written for Grow alone; Support's four arrived the same way — his words,
 * given for this section — and a second component would have been the same
 * markup diverging quietly the first time either was touched. The set is
 * chosen by slug, and a service with no set renders nothing, so adding the
 * section to a page is a matter of giving it four steps rather than editing
 * this file's markup.
 *
 * GROW IS A LOOP, SUPPORT IS NOT, and the closing line is what says which.
 * Grow's fourth step feeds its first — compounding is what happens when the
 * measurement from one month is the starting position of the next — so the
 * rule under the row carries a return leg and the line says "and again".
 * Support does not run in months and has no return leg: it is standing work,
 * and its closing line says that instead. Giving Support a loop it does not
 * have would have been the tidier row and the wrong picture.
 *
 * Nothing here claims a result. Grow's "Compound" describes how the work is
 * organised — what was learned stays and gets reused — not an outcome anyone
 * is promised, and Support's four describe what gets done, not how well.
 */
const SETS = {
  /* THE AGENTS PAGE. Three steps, because three is what the mechanism
     actually has: it drafts out of the repo, it marks what it cannot source,
     and a person approves before anything lands. A fourth would be padding.
     
     The middle one is the argument — an agent that stops is worth more than
     one that fills the gap, and the marker is the thing it hands back. */
  agents: {
    headline: 'It reads your brand, drafts from it, and stops where it cannot source a claim.',
    steps: [
      {
        n: '01',
        name: 'It reads your brand',
        visual: 'inputs',
        note: 'Positioning, voice, audience, the claims already cleared — out of the repo, not out of a prompt somebody pasted.',
      },
      {
        n: '02',
        name: 'It drafts, and flags',
        visual: 'draft',
        note: 'In your voice, off your own positioning. Where there is no proof point it writes [CLAIM NEEDED] instead of something plausible.',
      },
      {
        n: '03',
        name: 'A person approves it',
        visual: 'review',
        note: 'Every change is proposed as a numbered review. Nothing an agent writes goes live until somebody merges it.',
      },
    ],
    loops: false,
  },


  build: {
    headline: 'Defined, designed, encoded — and in the hands of the people who use it.',
    steps: [
      {
        n: '01',
        name: 'Define',
        visual: 'inputs',
        note: 'Positioning, voice, story, audience, and what you are setting out to achieve.',
      },
      {
        n: '02',
        name: 'Design',
        visual: 'design',
        note: 'Identity, and the full system it runs on: type, color, components, imagery, motion, language.',
      },
      {
        n: '03',
        name: 'Encode',
        visual: 'repo',
        note: 'The brand becomes machine-readable, so your teams and AI can use it without getting it wrong.',
      },
      {
        n: '04',
        name: 'Deploy',
        visual: 'deploy',
        note: 'The foundational channels built from it: website, app, and the places you show up first.',
      },
      {
        n: '05',
        name: 'Adopt',
        visual: 'adopt',
        note: 'Teams, partners and agencies trained and working in it from day one.',
      },
    ],
    loops: false,
  },

  grow: {
    headline: 'Produced from the system, measured against what it moved, and starting each round further along.',
    steps: [
      {
        n: '01',
        name: 'Grow',
        visual: 'assets',
        note: 'Every asset, every channel, produced from the system — so the brand shows up more, and shows up right.',
      },
      {
        n: '02',
        name: 'Measure',
        visual: 'dashboard',
        note: 'Output and performance tied back to what drove it.',
      },
      {
        n: '03',
        name: 'Compound',
        visual: 'learning',
        note: 'Every decision and result makes the brand stronger, so each round starts ahead.',
      },
      {
        n: '04',
        name: 'Maintain',
        visual: 'repo',
        note: 'The brand stays current and consistent as teams, channels and products change.',
      },
      {
        n: '05',
        name: 'Embed',
        visual: 'adopt',
        note: 'Our people inside your team — standing things up, translating intent, and capturing decisions at the source.',
      },
    ],
    closing: 'And again the following month, from a better starting position.',
    loops: true,
  },


}

/* Each step shows the screen it is about, so the claim and the thing are on
   one row. Reused components rather than drawings — the asset view, the
   channel panel, the measurement window and the repo are all already built,
   and a second illustrated version of any of them would drift. */
/* One dwell, shared by the timer and the rule that draws it — they have to
   be the same number or the bar finishes somewhere other than the switch. */
const STEP_MS = 6000

const VISUALS = {
  /* The inputs, settled: what the work will be made from. */
  inputs: InputsWindow,
  /* Those same inputs, designed — the system rather than a sheet of posts. */
  design: DesignWindow,
  /* What comes out of the repo once it is being used. */
  deploy: DeployWindow,
  /* The people working in it — their teams on Build, ours on Grow. */
  adopt: AdoptWindow,
  /* One agent's definition — the file, for the step about reading a brand. */
  agent: AgentWindow,
  /* A draft with the marker in it, for the step about flagging. */
  draft: DraftWindow,
  /* The review queue, for the step about a person approving. */
  review: ReviewWindow,
  /* Where it lands: the repo, set up and documented. */
  repo: () => <RepoWindow big assets={false} agents />,
  /* The creative that got made. */
  assets: AssetsGridWindow,
  /* The same assets, seen by where they went. */
  market: InMarketPanel,
  /* The analytics. */
  dashboard: DashboardWindow,
  /* The learning: one asset against the account's own trailing average,
     which is the reading a decision to repeat or drop it comes from. */
  learning: AssetWindow,
}

export default function HowItWorks({ slug = 'grow' }) {
  const set = SETS[slug]
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [seen, setSeen] = useState(false)
  const sectionRef = useRef(null)

  /* Only while it is on screen. */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setSeen(entry.isIntersecting),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const count = set?.steps?.length ?? 0

  useEffect(() => {
    if (!seen || paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setActive((i) => (i + 1) % count), STEP_MS)
    return () => clearTimeout(t)
  }, [active, seen, paused, count])
  /* A service with no set has no section, rather than an empty one. */
  if (!set) return null

  const { headline, steps, closing, loops } = set
  const id = `how-it-works-${slug}`

  return (
    <section
      ref={sectionRef}
      className={`${styles.section}${loops ? '' : ' ' + styles.noLoop}`}
      aria-labelledby={id}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className={styles.eyebrow}>[ How it works ]</p>
      <h2 className={styles.headline} id={id}>
        {headline}
      </h2>

      {steps.some((s) => s.visual) ? (
        <div className={styles.split}>
          {/* THE STEPS AS A LIST YOU READ DOWN, one open at a time. The
              closed ones stay legible rather than being hidden: the set is
              the argument, and a single open row with three hidden ones is
              an accordion, not a story. */}
          <ol className={styles.rail}>
            {steps.map(({ n, name, note }, i) => (
              <li key={n} className={i === active ? styles.railOn : styles.railItem}>
                <button
                  type="button"
                  className={styles.railButton}
                  aria-expanded={i === active}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.railNum}>{n}</span>
                  <span className={styles.railName}>{name}</span>
                </button>
                {i === active && <p className={styles.railNote}>{note}</p>}
                {/* The rule under each row doubles as the progress bar: it
                    fills over the dwell on the open row, which is what the
                    reference does and what makes the timer legible rather
                    than surprising. */}
                <span className={styles.railRule} aria-hidden="true">
                  {i === active && (
                    <span
                      key={active}
                      className={styles.railFill}
                      style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                    />
                  )}
                </span>
              </li>
            ))}
          </ol>

          <div className={styles.stage}>
            {steps.map(({ n, visual }, i) => {
              const Visual = VISUALS[visual]
              if (!Visual || i !== active) return null
              return <Visual key={n} />
            })}
          </div>
        </div>
      ) : (
        <ol className={styles.steps}>
          {steps.map(({ n, name, note }) => (
            <li key={n} className={styles.step}>
              <span className={styles.num}>{n}</span>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.note}>{note}</p>
            </li>
          ))}
        </ol>
      )}

      {closing && (
        <p className={styles.loop}>
          {/* The return mark belongs to the loop. Support's row ends where it
              ends, so it gets a standing mark rather than one that says the
              work comes back round. */}
          <span className={styles.loopMark} aria-hidden="true">{loops ? '↺' : '·'}</span>
          {closing}
        </p>
      )}
    </section>
  )
}
