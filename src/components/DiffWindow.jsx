import { Compass } from 'lucide-react'

import styles from './DiffWindow.module.css'
import { agents } from '../data/agents'
import { dashboard } from '../data/dashboard'

/**
 * A REVIEW THAT CHANGES THE BRAND, PROPOSED OUT OF RESULTS — the window in
 * the "what it is" section of /platform/measurement.
 *
 * THE POINT OF THE PAGE IS THIS ONE SCREEN. Measurement here is not a
 * dashboard you read and close; it is the step where what worked gets written
 * back into the files every agent reads. So the window is not a chart. It is
 * a diff, with the numbers that justify it attached, waiting for a person.
 *
 * BRAND-STRATEGIST PROPOSES IT, and that is not arbitrary. It owns
 * positioning, audience and proof points, and the one thing it will not do is
 * invent a claim — which is exactly why it is allowed to add this one. The
 * claim is not invented; it has ninety days behind it. An agent whose refusal
 * is "invent a claim" adding a claim WITH a source is the mechanism working,
 * not an exception to it.
 *
 * THE FIGURES COME FROM src/data/dashboard.js rather than from here, so the
 * proof point this window proposes cites the same 5.1% the dashboard on this
 * page and the Grow hero already show. That file says plainly that every
 * figure in it is invented; the window carries the same Sample data tag the
 * other surfaces do.
 */
const AGENT = agents.find((a) => a.name === 'brand-strategist') ?? agents[0]

const [best, ...rest] = [...dashboard.channels].sort((a, b) => b.rate - a.rate)
const conversions = dashboard.stats.find((s) => s.label === 'conversions')?.value ?? '––'

/* The evidence, drawn from the same sample data the dashboard renders — a
   window that argued from figures the chart beside it does not show would be
   a window that had been written to look convincing. */
const EVIDENCE = [
  `${best.name} converts at ${best.rate}% — best of ${dashboard.channels.length} channels`,
  `${rest.map((c) => `${c.name} ${c.rate}%`).join(' · ')}`,
  `${conversions} conversions · ${dashboard.weeks.length} weeks`,
]

/* What the review would actually write. Two files, because the two kinds of
   thing results can teach are a claim you may now make and a way of saying
   it — Strategy holds what is true, Verbal holds how it sounds, and this
   repo keeps those apart on purpose. */
const DIFF = [
  {
    file: 'Strategy/proof-points.md',
    lines: [
      { sign: '+', text: `Email converts at ${best.rate}%, ahead of paid social and organic.` },
      { sign: '+', text: `Source: 90 days, ${conversions} conversions. Re-check quarterly.` },
    ],
  },
  {
    file: 'Verbal/tone-of-voice.md',
    lines: [
      { sign: '-', text: 'Lead with the offer.' },
      { sign: '+', text: 'Lead with the outcome. The offer lands second.' },
    ],
  },
]

const META = [
  ['Opened', 'Sep 02'],
  ['Source', '90 days'],
  ['Assets', '41 shipped'],
  ['Into', 'main'],
]

export default function DiffWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand / Reviews /</span>
        <span className={styles.name}>#131 what-worked</span>
        <span className={styles.badge}>Proposed</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Changes</span>
        <span className={styles.tab}>Evidence</span>
        <span className={styles.tab}>History</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.body}>
        {/* WHO PROPOSED IT AND ON WHAT. A diff with no provenance is a
            suggestion; with a name, a source and a window of time behind it,
            it is something a person can actually approve. */}
        <aside className={styles.side}>
          <div className={styles.who}>
            <span className={styles.avatar}>
              <Compass size={18} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span className={styles.whoText}>
              <span className={styles.whoName}>{AGENT.label ?? AGENT.name}</span>
              <span className={styles.whoDoes}>Proposed this from the quarter&rsquo;s results.</span>
            </span>
          </div>

          <dl className={styles.meta}>
            {META.map(([k, v]) => (
              <div key={k} className={styles.metaRow}>
                <dt className={styles.metaKey}>{k}</dt>
                <dd className={styles.metaValue}>{v}</dd>
              </div>
            ))}
          </dl>

          {/* The refusal is the reason this diff is allowed to exist: the
              agent that will not invent a claim is adding one that has a
              number behind it. */}
          <div className={styles.wont}>
            <span className={styles.wontKey}>Will not</span>
            <span className={styles.wontValue}>{AGENT.wont.toLowerCase()} — this one has a source</span>
          </div>
        </aside>

        <div className={styles.doc}>
          <section className={styles.sec}>
            <h4 className={styles.secHead}>Evidence</h4>
            {EVIDENCE.map((line) => (
              <p key={line} className={styles.secMono}>{line}</p>
            ))}
          </section>

          {DIFF.map(({ file, lines }) => (
            <section key={file} className={styles.sec}>
              <h4 className={styles.secHead}>{file}</h4>
              <div className={styles.hunk}>
                {lines.map(({ sign, text }) => (
                  <span
                    key={text}
                    className={`${styles.diffLine} ${sign === '+' ? styles.add : styles.cut}`}
                  >
                    <span className={styles.sign}>{sign}</span>
                    <span className={styles.diffText}>{text}</span>
                  </span>
                ))}
              </div>
            </section>
          ))}

          {/* The loop only closes on a person. Everything above is a
              proposal until this line happens. */}
          <div className={styles.foot}>
            <span className={styles.footNote}>
              Merging writes this into the brand. Every agent reads it on the next draft.
            </span>
            <span className={styles.footActions}>
              <span className={styles.ghost}>Request change</span>
              <span className={styles.primary}>Approve &amp; merge</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
