import { useState } from 'react'
import { Check } from 'lucide-react'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { tabs, TBC, faqs } from '../data/pricingTabs'
import { deliverableNotes } from '../data/deliverables'

/**
 * The pricing page: two ways to buy, one tab each.
 *
 * Project is the four Build pillars, scoped and priced before they start.
 * Subscription is ongoing support by the hour, monthly or annual. The
 * platform is the wide card under the projects rather than a tab of its own,
 * because it is what the projects leave behind rather than a third thing to
 * choose between.
 *
 * EVERY NUMBER HERE IS ONE CHRIS GAVE. The pillars, the hour tiers, the
 * $20,000 platform threshold, the $7,500 platform start and the 10% annual
 * discount. Nothing is rounded for looks and nothing is derived from a rate
 * card that disagrees with them — see the note at the top of the data file.
 *
 * TABS ARE BUTTONS, NOT ROUTES. One page, two views; separate URLs would be
 * two pages to keep in step.
 */

/* Two decimals only when a rate needs them — a discounted $165 is $148.50,
   and $148.5 reads as a typo. Whole figures stay whole. */
const money = (n) =>
  typeof n === 'number'
    ? '$' +
      n.toLocaleString('en-US', {
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : n

/**
 * THE TWO TABS READ IN A DIFFERENT ORDER, and it is a real difference rather
 * than a style.
 *
 * On Subscription the number IS the product — you are choosing between
 * $4,500 and $15,000 of the same thing, so the figure leads and the heading
 * above it is the rate that produced it.
 *
 * On Project you are choosing between a brand and a website. The name is
 * what you are buying and the price is a consequence, so the name leads, the
 * price moves to the foot above the button, and the deliverables sit between
 * as the quietest thing on the card.
 */
function Tier({ tier, variant, months = 1, discount = 0, unitOverride }) {
  const empty = tier.price === TBC
  const nameLed = variant === 'project'

  /* Derived rather than a second set of figures: one number per tier cannot
     drift from another that does not exist. */
  const amount =
    typeof tier.price === 'number'
      ? Math.round(tier.price * months * (1 - discount))
      : tier.price

  /* The effective hourly rate falls with the discount — paying 10% less for
     the same hours IS a 10% lower rate, and a discounted total beside a list
     rate would quote two different deals on one card. */
  const rate = tier.rate ? tier.rate * (1 - discount) : null
  const unit = unitOverride ?? tier.unit

  const price = (
    <p className={`${styles.priceRow}${nameLed ? ' ' + styles.priceRowFoot : ''}`}>
      {nameLed && unit && <span className={styles.unitAbove}>{unit}</span>}
      <span
        className={`${styles.price}${nameLed ? ' ' + styles.priceQuiet : ''}${
          empty ? ' ' + styles.priceEmpty : ''
        }`}
      >
        {money(amount)}
      </span>
      {!nameLed && unit && <span className={styles.unit}>{unit}</span>}
    </p>
  )

  return (
    <div className={`${styles.tier}${tier.featured ? ' ' + styles.tierFeatured : ''}`}>
      <p className={styles.kicker}>{tier.kicker}</p>
      <h3 className={`${styles.tierName}${nameLed ? ' ' + styles.tierNameLead : ''}`}>
        {rate ? `${money(rate)} per hour` : tier.name}
      </h3>

      {!nameLed && price}

      <p className={`${styles.summary}${nameLed ? ' ' + styles.summaryLead : ''}`}>
        {tier.summary}
      </p>

      {/* PILLS ON PROJECT, labelled, because a middot-joined line read as one
          thing bought whole. These are separate deliverables picked against a
          starting price, and a chip per item says so without a sentence.
          Bullets on Subscription, where the lists are three long and each
          item is a claim about the tier rather than something to choose. */}
      {nameLed ? (
        <div className={styles.inventory}>
          <p className={styles.inventoryLabel}>Individual deliverables — pick what you need</p>
          <ul className={styles.pills}>
            {tier.lines.map((l) => (
              /* No entry means no tooltip rather than an empty bubble — the
                 CSS only draws one when the attribute is present. */
              <li key={l} className={styles.pill} data-tip={deliverableNotes[l] || undefined}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className={styles.lines}>
          {tier.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}

      {tier.note && <p className={styles.note}>{tier.note}</p>}
      {nameLed && price}

      <button className={styles.cta} data-cal>
        {tier.cta}
      </button>
    </div>
  )
}

export default function PricingV3() {
  const cal = useCalDrawer()
  const [active, setActive] = useState(tabs[0].id)
  const [period, setPeriod] = useState('monthly')
  const tab = tabs.find((t) => t.id === active)
  const p = tab.periods?.find((x) => x.id === period)

  useMeta({
    title: 'Pricing | Super Conscious',
    description: 'Have us build a project, or keep us on by the hour. What each one costs.',
  })

  return (
    <main
      className={styles.page}
      onClick={(e) => {
        /* One handler rather than a prop threaded through two components:
           every button marked data-cal opens the same drawer. */
        if (e.target.closest('button')?.dataset.cal !== undefined) cal.open()
      }}
    >
      <V3Nav />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>[ Pricing ]</p>
        <h1 className={styles.headline}>Simple pricing, agreed up front.</h1>

        <div className={styles.switcher} role="tablist" aria-label="How to buy">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={t.id === active}
              aria-controls={`panel-${t.id}`}
              className={t.id === active ? styles.tabOn : styles.tab}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <section
        className={styles.panel}
        role="tabpanel"
        id={`panel-${tab.id}`}
        aria-labelledby={`tab-${tab.id}`}
      >
        <p className={styles.panelEyebrow}>{tab.eyebrow}</p>
        <p className={styles.panelBlurb}>{tab.blurb}</p>

        {tab.periods && (
          <div className={styles.periods} role="group" aria-label="Billing period">
            {tab.periods.map((x) => (
              <button
                key={x.id}
                type="button"
                className={x.id === period ? styles.periodOn : styles.period}
                aria-pressed={x.id === period}
                onClick={() => setPeriod(x.id)}
              >
                {x.label}
                {/* Its own badge rather than "Annual · save 10%" in one
                    string: the saving is the reason to press the button, and
                    inside the sentence it read as a subtitle. */}
                {x.badge && <span className={styles.saveBadge}>{x.badge}</span>}
              </button>
            ))}
          </div>
        )}

        {/* ABOVE THE CARDS, NOT UNDER THEM. As a footnote it was the last
            thing on the tab and read as a condition; the platform is what
            this studio has that the others do not, and being given it with
            the work is the best sentence on the page. */}
        {tab.perk && (
          <p className={styles.perk}>
            <span className={styles.perkMark} aria-hidden="true">+</span>
            {tab.perk}
          </p>
        )}

        <div className={styles.tiers}>
          {tab.tiers.map((t) => (
            <Tier
              key={t.name ?? t.rate}
              tier={t}
              variant={tab.id}
              months={p?.months ?? 1}
              discount={p?.discount ?? 0}
              unitOverride={p?.unit}
            />
          ))}
        </div>

        {tab.periods && period === 'annual' && (
          <p className={styles.periodNote}>
            Paid annually the retainer is 10% lower, which is why the hourly
            rate shown drops with it. Billed against the same hours.
          </p>
        )}

        {/* One wide card under the four. It spans rather than joining the
            grid: as a fifth column it would read as a project you can buy,
            and it is not — it is what the other four leave behind. */}
        {tab.feature && (
          <div className={styles.feature}>
            <div className={styles.featureHead}>
              <p className={styles.featureEyebrow}>{tab.feature.eyebrow}</p>
              <h3 className={styles.featureName}>{tab.feature.name}</h3>
              <p className={styles.featureBody}>{tab.feature.body}</p>

              <p className={`${styles.priceRow} ${styles.priceRowFoot}`}>
                <span className={styles.unitAbove}>{tab.feature.unit}</span>
                <span className={`${styles.price} ${styles.priceQuiet}`}>
                  {money(tab.feature.price)}
                </span>
              </p>

              <button className={styles.featureCta} data-cal>
                {tab.feature.cta}
              </button>
            </div>

            <ul className={styles.featureGrid}>
              {tab.feature.items.map(({ name, note }) => (
                <li key={name} className={styles.featureItem}>
                  <span className={styles.featureItemName}>
                    <Check className={styles.featureTick} size={13} strokeWidth={2.4} aria-hidden="true" />
                    {name}
                  </span>
                  <span className={styles.featureItemNote}>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Native details/summary rather than a state hook: it is open/closed
          disclosure, and the keyboard and screen-reader behaviour come free. */}
      <section className={styles.faq} aria-labelledby="faq-heading">
        <h2 className={styles.faqHead} id="faq-heading">Questions</h2>

        <div className={styles.faqList}>
          {faqs.map(({ q, a }) => (
            <details key={q} className={styles.faqItem}>
              <summary className={styles.faqQ}>
                {q}
                <span className={styles.faqMark} aria-hidden="true" />
              </summary>
              <p className={styles.faqA}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}
