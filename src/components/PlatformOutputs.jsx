import { useState } from 'react'

import styles from './PlatformOutputs.module.css'
import { tabs } from '../data/pricingTabs'

/**
 * WHAT YOU GET — the section under the platform.
 *
 * Build shows the project tiers, read from pricingTabs so the section cannot
 * describe something /pricing has stopped selling.
 *
 * Grow hands over its own pillars instead. It is bought by the hour, and a
 * section headed "what you get" answering with a rate card answers the wrong
 * question: the hours are how it is billed, and what you get is what they
 * are spent making.
 *
 * It was "What it makes", which described the platform's output. This says
 * the same cards from the buyer's side: not what the machine produces, but
 * what you are left holding.
 *
 * WHERE A TIER NAMES ITS OWN OUTPUTS, those are shown instead of its
 * deliverables. Campaign is the case: its deliverable list opens with
 * audience architecture and two strategy-and-concept lines, which are inputs
 * to a campaign rather than things it hands over — right on /pricing, wrong
 * under a heading that says what the platform makes.
 *
 * READ, NOT RETYPED. Every card here is a project tier out of pricingTabs —
 * the name, the summary, the deliverables and the footnote — so this section
 * cannot describe a tier the pricing page has stopped selling.
 *
 * NO FIGURES. The cards carried their price and unit for a while and no
 * longer do; the price lives on /pricing. The tie to pricing is now the
 * shared source rather than a number on the card.
 *
 * BRAND IS CUT HERE, and only here — it is still a tier and still on
 * /pricing. Three cards, three across.
 *
 * An earlier version of this section listed Product, Marketing and Sales.
 * Those are real audiences but nothing prices them, so the cards could only
 * ever have linked at pricing rather than carried it.
 */
/* THE DEFAULT SET: the project tiers, for a service bought as projects.
   A caller can hand over its own cards instead — see the `cards` prop.

   Brand is cut here and only here: still a tier, still on /pricing.
   Excluded by name rather than index so reordering the tiers cannot
   silently drop a different one. */
const CUT = new Set(['Brand'])

const projectCards = tabs
  .find((t) => t.id === 'project')
  .tiers.filter((t) => !CUT.has(t.name))
/**
 * One card. The pills pick which deliverable the well shows, so the list is
 * something you can look through rather than a label.
 *
 * The well is still a flat fill — there is no artwork in the repo for any of
 * these — so what changes on a click is the name in it. That is enough to
 * make the control legible now, and the moment images exist this is the one
 * place that has to change: give the well an <img> and keep the index.
 *
 * The pills are real buttons, so they are focusable and operable from the
 * keyboard without anything extra. aria-pressed carries the state, and the
 * well is aria-live so a screen reader hears the change it just made.
 */
function Card({ kicker, name, summary, items, note }) {
  const [active, setActive] = useState(0)

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <span className={styles.mediaLabel} aria-live="polite">{items[active]}</span>
      </div>

      {kicker && <span className={styles.kicker}>{kicker}</span>}
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.note}>{summary}</p>

      <div className={styles.chips}>
        {items.map((l, i) => (
          <button
            key={l}
            type="button"
            className={`${styles.chip}${i === active ? ' ' + styles.chipOn : ''}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {l}
          </button>
        ))}
      </div>

      {note && <p className={styles.footnote}>{note}</p>}
    </article>
  )
}

export default function PlatformOutputs({ cards }) {
  const TIERS = cards ?? projectCards

  return (
    <section className={styles.section} aria-labelledby="what-it-makes">
      <p className={styles.eyebrow}>[ What you get ]</p>
      <h2 className={styles.headline} id="what-it-makes">
        Everything the brand shows up as.
      </h2>

      <div className={styles.grid}>
        {TIERS.map(({ kicker, name, summary, lines, outputs, note, outputsNote }, i) => (
          <Card
            key={name}
            kicker={kicker ? String(i + 1).padStart(2, '0') : null}
            name={name}
            summary={summary}
            /* A tier that names its own outputs uses them; the rest fall
               back to their deliverables, which already read as outputs. */
            items={outputs ?? lines}
            note={outputsNote ?? note}
          />
        ))}
      </div>
    </section>
  )
}
