import { useState } from 'react'

import styles from './HowItWorks.module.css'
import AssetsGridWindow from './AssetsGridWindow'
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
  build: {
    headline: 'Scoped, made, approved — and handed over as something you can run.',
    steps: [
      {
        n: '01',
        name: 'Scope',
        note: 'What it is and what it costs, agreed before anything starts.',
      },
      {
        n: '02',
        name: 'Make',
        note: 'The brand, the site, the campaign, the channels — built once and built properly.',
      },
      {
        n: '03',
        name: 'Review',
        note: 'Every change is proposed rather than published. A person approves it before it lands.',
      },
      {
        n: '04',
        name: 'Hand over',
        note: 'It goes into the repo set up and documented, so your team can use it without us in the room.',
      },
    ],
    closing: 'A project that ends, and leaves something behind that does not.',
    loops: false,
  },

  grow: {
    headline: 'Ship, distribute, measure — and start the next one further along.',
    steps: [
      {
        n: '01',
        name: 'Ship',
        visual: 'assets',
        note: 'The work gets made and goes out — drafted out of the repo, so it already sounds like you.',
      },
      {
        n: '02',
        name: 'Distribute',
        visual: 'market',
        note: 'It goes where your audience actually is. The channels are set up and fed, not just posted to.',
      },
      {
        n: '03',
        name: 'Measure',
        visual: 'dashboard',
        note: 'What it did comes back into the platform, against the asset that did it.',
      },
      {
        n: '04',
        name: 'Compound',
        visual: 'learning',
        note: 'Next month starts from what worked. Nothing gets rebuilt, and nothing gets guessed twice.',
      },
    ],
    closing: 'And again the following month, from a better starting position.',
    loops: true,
  },

  /* CHRIS'S FOUR VERBS FOR SUPPORT, in his order. The notes under them are
     mine and unsigned, and they deliberately say nothing Grow says: tuning
     here is speed and legibility, not conversion, because conversion
     optimisation is Grow's line and putting it on both pages would sell the
     same hour twice. */
  support: {
    headline: 'Maintain, tune, enable, extend — and none of it waits for a project.',
    steps: [
      {
        n: '01',
        name: 'Maintain',
        note: 'What is already live keeps working — the fix, the content change, the dependency nobody wants to think about.',
      },
      {
        n: '02',
        name: 'Tune',
        note: 'The weak parts get better where they are weak: page speed, accessibility, the line that never quite landed.',
      },
      {
        n: '03',
        name: 'Enable',
        note: 'Your own people can use the system without us in the room — access, templates, and an answer when they ask.',
      },
      {
        n: '04',
        name: 'Extend',
        note: 'It stretches to the format, the channel or the piece of collateral it was never drawn for.',
      },
    ],
    closing: 'Standing work, not a schedule — it runs for as long as the thing is live.',
    loops: false,
  },
}

/* Each step shows the screen it is about, so the claim and the thing are on
   one row. Reused components rather than drawings — the asset view, the
   channel panel, the measurement window and the repo are all already built,
   and a second illustrated version of any of them would drift. */
const VISUALS = {
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
  /* A service with no set has no section, rather than an empty one. */
  if (!set) return null

  const { headline, steps, closing, loops } = set
  const id = `how-it-works-${slug}`

  return (
    <section className={styles.section} aria-labelledby={id}>
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
                {/* The rule under each row fills on the open one, which is
                    what marks position without a progress bar of its own. */}
                <span className={styles.railRule} aria-hidden="true" />
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

      <p className={styles.loop}>
        {/* The return mark belongs to the loop. Support's row ends where it
            ends, so it gets a standing mark rather than one that says the
            work comes back round. */}
        <span className={styles.loopMark} aria-hidden="true">{loops ? '↺' : '·'}</span>
        {closing}
      </p>
    </section>
  )
}
