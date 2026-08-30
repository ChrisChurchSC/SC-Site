import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'

import styles from './AgentRail.module.css'
import { agents } from '../data/agents'

/**
 * THE SIX, AS A RAIL — the same shape as the featured work section: copy on
 * the page grid, cards bleeding off the right edge.
 *
 * WHY A RAIL RATHER THAN A GRID. A grid of six says "here is the set, that
 * is all of it". A rail says "here are some of them" — which is the truer
 * shape, because an agent is instantiated per brand and the six are a
 * starting roster rather than a catalogue.
 *
 * THE BRAND-SPECIFIC POINT IS MADE ONCE, in the intro above the rail. It was
 * a "your brand" chip on all six cards, which is six identical badges saying
 * nothing — a label has to vary to be worth reading. The card label is the
 * discipline instead: the part of the job that agent owns.
 *
 * Naming real clients there would claim those clients have agents running,
 * and the platform is not shipped — the studio's own SC-Brand is the only
 * repo with these six in it.
 *
 * The names, what each does and every refusal are read from
 * src/data/agents.js — the same list the homepage card, the Encode step and
 * the definition window use.
 */
const DISCIPLINE = {
  'brand-strategist': 'Strategy',
  'comms-writer': 'Copy',
  'media-strategist': 'Media',
  'design-critic': 'Design',
  'sales-analyst': 'Sales',
  'studio-ops': 'Operations',
}

const ICONS = [Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList]

export default function AgentRail() {
  return (
    <section className={styles.section} aria-labelledby="roster">
      <p className={styles.eyebrow}>[ Who they are ]</p>
      <h2 className={styles.headline} id="roster">One for each part of the job.</h2>
      <p className={styles.intro}>
        Every one of them is trained on your brand, not ours — same six roles, your
        positioning, your voice, your approved claims.
      </p>

      <div className={styles.rail}>
        <div className={styles.track}>
          {[false, true].map((dup) => (
            <div key={String(dup)} className={styles.pass} aria-hidden={dup || undefined}>
              {agents.map(({ name, label, does, wont }, i) => {
                const Icon = ICONS[i]
                return (
                  <article key={name} className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={styles.cardIcon}>
                        <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                      </span>
                      <span className={styles.slot}>{DISCIPLINE[name] ?? 'Agent'}</span>
                    </div>

                    <h3 className={styles.cardName}>{label}</h3>
                    <p className={styles.cardDoes}>{does}</p>

                    <p className={styles.cardWont}>
                      <span className={styles.wontKey}>Will not</span> {wont.toLowerCase()}
                    </p>
                  </article>
                )
              })}
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
