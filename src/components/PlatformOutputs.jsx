import styles from './PlatformOutputs.module.css'
import { tabs } from '../data/pricingTabs'

/**
 * WHAT THE PLATFORM MAKES — the section under it, and the same four things
 * /pricing sells.
 *
 * WHERE A TIER NAMES ITS OWN OUTPUTS, those are shown instead of its
 * deliverables. Campaign is the case: its deliverable list opens with
 * audience architecture and two strategy-and-concept lines, which are inputs
 * to a campaign rather than things it hands over — right on /pricing, wrong
 * under a heading that says what the platform makes.
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
        {TIERS.map(({ kicker, name, summary, lines, outputs, note, outputsNote, price, unit }) => (
          <article key={kicker} className={styles.card}>
            <span className={styles.kicker}>{kicker}</span>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.note}>{summary}</p>

            <div className={styles.chips}>
              {/* A tier that names its own outputs uses them; the rest fall
                  back to their deliverables, which already read as outputs. */}
              {(outputs ?? lines).map((l) => <span key={l} className={styles.chip}>{l}</span>)}
            </div>

            {/* Only Campaign and Channels carry one, and it qualifies the
                price, so it sits with the price rather than the list. A tier
                can give this section a shorter note than /pricing shows —
                Campaign does, because its full scope caveat belongs beside a
                quote rather than beside a picture. */}
            {(outputsNote ?? note) && (
              <p className={styles.footnote}>{outputsNote ?? note}</p>
            )}

            <div className={styles.price}>
              <span className={styles.unit}>{unit}</span>
              <span className={styles.figure}>{money(price)}</span>
            </div>
          </article>
        ))}
      </div>

    </section>
  )
}
