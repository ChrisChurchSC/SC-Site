import { useState } from 'react'

import styles from './PlatformOutputs.module.css'
import pricing from '../pages/PricingV3.module.css'
import Tier, { money } from './PricingTier'
import ExtendsWires from './ExtendsWires'
import { useCalDrawer } from '../context/CalDrawerContext'
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

   Brand platform is cut here, and only here: still a tier, still on /pricing
   where it now leads, and with a section of its own further up this page — so
   listing it again in "what it extends to" was the page saying it twice.

   MATCH THIS TO THE TIER NAME. The set excludes by name, so renaming the tier
   in pricingTabs without renaming it here silently puts it back.

   Excluded by name rather than index so reordering the tiers cannot silently
   drop a different one. */
const CUT = new Set(['Brand platform'])

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
export function Card({ kicker, name, summary, items, note, footer }) {
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
      {footer}
    </article>
  )
}

export default function PlatformOutputs({ cards, service = 'build' }) {
  const cal = useCalDrawer()
  /* GROW IS THE PRICING PAGE'S GROW SECTION (2026-09-02), the same swap
     Build got: the billing toggle and the four hour buckets as the pricing
     page's own price-led cards. The period is this section's own state, as
     it is the pricing page's. */
  const isGrow = !cards && service === 'grow'
  const growTab = isGrow ? tabs.find((t) => t.id === 'subscription') : null
  const [period, setPeriod] = useState(growTab?.periods?.[0]?.id ?? 'monthly')
  const p = growTab?.periods?.find((x) => x.id === period)
  /* THE BUILD SET IS THE PRICING PAGE'S BUILD SECTION, LAID OUT AS IT IS
     THERE (2026-09-02): Brand platform as the wide lead card, the "and
     everything it extends to" hub, the wires, and the three under it as
     this section's own card with the price and button hung underneath —
     the same composition BuySection draws on /pricing, with the same
     data attributes the wires find their ends by. Chris's call: the
     section should be the Build part of /pricing, exactly. Grow still
     hands in its own cards and gets the plain grid below. */
  const projectTiers = cards || isGrow ? null : tabs.find((t) => t.id === 'project').tiers
  const pricingMode = Boolean(projectTiers || isGrow)
  const lead = projectTiers?.find((t) => t.name === 'Brand platform') ?? null
  const rest = projectTiers ? projectTiers.filter((t) => t !== lead) : null
  /* The plain grid, for a caller that hands in its own cards. Neither
     service does now; both render their pricing section above. */
  const TIERS = cards ?? projectCards

  return (
    <section className={styles.section} aria-labelledby="what-it-makes">
      {/* Pairs with the section above it: that one is what a brand platform
          is made of, this one is how far it reaches. Grow renders the same
          component with its own cards, where the label reads as what the
          hours produce rather than as an extension of the platform — worth
          watching if this label is ever made per-service. */}
      {/* TWO HEADINGS FOR TWO JOBS. On Build the section is the pricing
          page's Build section — the lead card, the hub, the three under it,
          each with a price and its deliverables — so it says so. On Grow,
          which hands in its own output cards, the older line stands: what
          the platform extends to. Chris's call, 2026-09-02: a section about
          pricing and deliverables should be labelled as one. */}
      <p className={styles.eyebrow}>
        {pricingMode ? '[ Pricing & deliverables ]' : '[ Everything a brand platform extends to ]'}
      </p>
      <h2 className={styles.headline} id="what-it-makes">
        {pricingMode ? 'What it costs, and what you get.' : 'Everything the brand shows up as.'}
      </h2>

      {isGrow && growTab.periods && (
        <div className={pricing.periods} role="group" aria-label="Billing period">
          {growTab.periods.map((x) => (
            <button
              key={x.id}
              type="button"
              className={x.id === period ? pricing.periodOn : pricing.period}
              aria-pressed={x.id === period}
              onClick={() => setPeriod(x.id)}
            >
              {x.label}
              {x.badge && <span className={pricing.saveBadge}>{x.badge}</span>}
            </button>
          ))}
        </div>
      )}

      {isGrow && (
        <div className={pricing.tiers}>
          {growTab.tiers.map((tier) => (
            <Tier
              key={tier.kicker}
              tier={tier}
              variant="subscription"
              months={p?.months ?? 1}
              discount={p?.discount ?? 0}
              unitOverride={p?.unit}
              onCta={cal.open}
            />
          ))}
        </div>
      )}

      {projectTiers ? (
        <div className={pricing.extends}>
          {lead && <ExtendsWires count={rest.length} />}
          {lead && (
            <div className={pricing.lead} data-lead-card>
              <Tier tier={lead} variant="project" onCta={cal.open} />
            </div>
          )}
          {lead && (
            <p className={pricing.extendsLabel} data-extends-label>
              And everything it extends to
            </p>
          )}
          <div className={`${pricing.tiers}${lead ? ' ' + pricing.tiersMirror : ''}`} data-extends-grid>
            {rest.map((t) => (
              <Card
                key={t.name}
                kicker={t.kicker}
                name={t.name}
                summary={t.summary}
                items={t.outputs ?? t.lines}
                note={t.outputsNote ?? t.note}
                footer={
                  <div className={pricing.mirrorFoot}>
                    <p className={pricing.priceRow}>
                      {t.unit && <span className={pricing.unitAbove}>{t.unit}</span>}
                      <span className={`${pricing.price} ${pricing.priceQuiet}`}>{money(t.price)}</span>
                    </p>
                    <button className={pricing.cta} onClick={cal.open}>{t.cta}</button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      ) : isGrow ? null : (
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
      )}
    </section>
  )
}
