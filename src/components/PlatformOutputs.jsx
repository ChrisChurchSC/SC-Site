import { NavLink } from 'react-router-dom'

import styles from './PlatformOutputs.module.css'
import { tabs } from '../data/pricingTabs'

/**
 * WHAT THE PLATFORM MAKES — the section under it, and the same four things
 * /pricing sells.
 *
 * READ, NOT RETYPED. Every card here is a project tier out of pricingTabs:
 * the name, the summary, the deliverables, the footnote, the price and its
 * unit. Nothing is duplicated, so this section cannot quote a price the
 * pricing page has stopped charging — which is exactly what "tied to the
 * pricing" has to mean for it to be worth anything.
 *
 * BRAND IS CUT HERE, and only here — it is still a tier and still on
 * /pricing. Three cards, three across.
 *
 * An earlier version of this section listed Product, Marketing and Sales.
 * Those are real audiences but nothing prices them, so the cards could only
 * ever have linked at pricing rather than carried it.
 */
const project = tabs.find((t) => t.id === 'project')
const CUT = new Set(['Brand'])
const TIERS = project.tiers.filter((t) => !CUT.has(t.name))

const money = (n) => `$${n.toLocaleString('en-US')}`

export default function PlatformOutputs() {
  return (
    <section className={styles.section} aria-labelledby="what-it-makes">
      <p className={styles.eyebrow}>[ What it makes ]</p>
      <h2 className={styles.headline} id="what-it-makes">
        One store, and everything that comes out of it.
      </h2>

      <div className={styles.grid}>
        {TIERS.map(({ kicker, name, summary, lines, note, price, unit }) => (
          <article key={kicker} className={styles.card}>
            <span className={styles.kicker}>{kicker}</span>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.note}>{summary}</p>

            <p className={styles.chipsLabel}>Individual deliverables — pick what you need</p>
            <div className={styles.chips}>
              {lines.map((l) => <span key={l} className={styles.chip}>{l}</span>)}
            </div>

            {/* Only Campaign and Channels carry one. It qualifies the price,
                so it sits with the price rather than with the list. */}
            {note && <p className={styles.footnote}>{note}</p>}

            <div className={styles.price}>
              <span className={styles.unit}>{unit}</span>
              <span className={styles.figure}>{money(price)}</span>
            </div>
          </article>
        ))}
      </div>

      {/* The threshold is a property of the order rather than of any one
          card, which is why /pricing renders it above the four and this
          renders it under them. Chris's line, read from the same place. */}
      <p className={styles.priceLine}>
        {project.perk}
        <br />
        <NavLink className={styles.priceLink} to="/pricing">See full pricing</NavLink>
      </p>
    </section>
  )
}
