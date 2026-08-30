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
 * EACH CARD IS BRAND-SPECIFIC, and the eyebrow says so with a slot rather
 * than a client name. Naming real clients here would claim those clients
 * have agents running, and the platform is not shipped — the studio's own
 * SC-Brand is the only repo with these six in it.
 *
 * The names, what each does and every refusal are read from
 * src/data/agents.js — the same list the homepage card, the Encode step and
 * the definition window use.
 */
const ICONS = [Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList]

export default function AgentRail() {
  return (
    <section className={styles.section} aria-labelledby="roster">
      <p className={styles.eyebrow}>[ The six ]</p>
      <h2 className={styles.headline} id="roster">One for each part of the job.</h2>
      <p className={styles.intro}>
        Every one of them is trained on your brand, not ours — same six roles, your
        positioning, your voice, your approved claims.
      </p>

      <div className={styles.rail}>
        {agents.map(({ name, does, wont }, i) => {
          const Icon = ICONS[i]
          return (
            <article key={name} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>
                  <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                </span>
                {/* The brand slot rather than a client name — see the note
                    above the component. */}
                <span className={styles.slot}>your brand</span>
              </div>

              <h3 className={styles.cardName}>{name}</h3>
              <p className={styles.cardDoes}>{does}</p>

              <p className={styles.cardWont}>
                <span className={styles.wontKey}>Will not</span> {wont.toLowerCase()}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
