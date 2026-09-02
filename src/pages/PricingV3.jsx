import { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { Card as OutputCard } from '../components/PlatformOutputs'
import Tier, { money } from '../components/PricingTier'
import ExtendsWires from '../components/ExtendsWires'
import { serviceBySlug } from '../data/services'
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


/**
 * ONE SECTION PER WAY OF BUYING.
 *
 * These were two tabs. A tab hid one of the two behind a click on a page
 * whose whole job is to say what things cost, and the two are not
 * alternatives — a client can have a Build project and a Grow retainer at
 * once, which the FAQ says in as many words. Stacked, the page reads as the
 * two services in the order they happen.
 *
 * THE PERIOD TOGGLE IS STILL PAGE STATE, not section state: only Grow has
 * one, but it is lifted so that if Build ever gets billing periods the two
 * cannot disagree about which one is showing.
 */
function BuySection({ tab, period, setPeriod }) {
  const p = tab.periods?.find((x) => x.id === period)
  const service = serviceBySlug(tab.service)

  /* Brand platform out in front on the project tab, the rest below it. By
     name rather than index so reordering the tiers cannot silently promote a
     different one — but that means a RENAME drops it back into the row, which
     is exactly what happened when the tier went from "Brand" to "Brand
     platform". Two places match on this string: here, and the CUT set in
     PlatformOutputs.jsx. */
  const lead = tab.id === 'project' ? tab.tiers.find((t) => t.name === 'Brand platform') : null
  const rest = lead ? tab.tiers.filter((t) => t !== lead) : tab.tiers

  return (
      <section className={styles.panel} id={tab.service} aria-labelledby={`buy-${tab.id}`}>
        {/* THE HEAD THE TAB USED TO BE. Both ways of buying are on the page
            now, so each needs to say which service it is for — and the name
            and the line under it are read from services.js rather than
            retyped, so /pricing cannot describe Build differently from
            /services/build.

            A LABEL RATHER THAN A HEADING. At the FAQ's size it competed with
            the h1 above it and with the card names below, and the sentence
            under it is the thing to read. Bracketed, because that is what a
            label is on this site — the same form as [ Pricing ] in the hero.
            Still an h2: it is the section's name whatever it is set in. */}
        <h2 className={styles.sectionLabel} id={`buy-${tab.id}`}>
          [ {service?.name ?? tab.label} ]
        </h2>
        {service?.tagline && <p className={styles.panelBlurb}>{service.tagline}</p>}

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

        {/* BRAND LEADS, ALONE. It is not one of four things you pick between —
            it is the thing, and the other three are what it extends to. The
            service pages already make that argument in two sections ("What a
            brand is made of", then "Everything a brand platform extends to");
            this is the same order on the page where somebody is choosing.

            Only on the project tab. The subscription tiers are alternatives
            to each other, so they stay a row of equals. */}
        <div className={styles.extends}>
          {lead && <ExtendsWires count={rest.length} />}

          {lead && (
            <div className={styles.lead} data-lead-card>
              <Tier
                key={lead.name ?? lead.rate}
                tier={lead}
                variant={tab.id}
                months={p?.months ?? 1}
                discount={p?.discount ?? 0}
                unitOverride={p?.unit}
              />
            </div>
          )}

          {lead && (
            <p className={styles.extendsLabel} data-extends-label>
              And everything it extends to
            </p>
          )}

          <div
            className={`${styles.tiers}${lead ? ' ' + styles.tiersMirror : ''}`}
            data-extends-grid
          >
            {rest.map((t) =>
              /* Mirrors the Build page card exactly — same component, same
               well, same selectable deliverables — with the price and the
               CTA hung underneath. Only on the project tab: subscription
               tiers are alternatives to each other and have no well. */
              lead ? (
                <OutputCard
                  key={t.name}
                  kicker={t.kicker}
                  name={t.name}
                  summary={t.summary}
                  items={t.outputs ?? t.lines}
                  note={t.outputsNote ?? t.note}
                  footer={
                    <div className={styles.mirrorFoot}>
                      <p className={styles.priceRow}>
                        {t.unit && <span className={styles.unitAbove}>{t.unit}</span>}
                        <span className={`${styles.price} ${styles.priceQuiet}`}>
                          {money(t.price)}
                        </span>
                      </p>
                      <button className={styles.cta} data-cal>
                        {t.cta}
                      </button>
                    </div>
                  }
                />
              ) : (
                <Tier
                  key={t.name ?? t.rate}
                  tier={t}
                  variant={tab.id}
                  months={p?.months ?? 1}
                  discount={p?.discount ?? 0}
                  unitOverride={p?.unit}
                />
              ),
            )}
          </div>
        </div>

        {tab.periods && period === 'annual' && (
          <p className={styles.periodNote}>
            Paid annually the retainer is 10% lower, which is why the hourly rate shown drops with
            it. Billed against the same hours.
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
          </div>
        )}
      </section>
  )
}

export default function PricingV3() {
  const cal = useCalDrawer()
  const [period, setPeriod] = useState('monthly')

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
      </header>

      {/* A rule above each section rather than only space. Stacked, Build's
          three extension cards and Grow's four retainer cards are both a row
          of cards, and without a line the second row read as more of the
          first; the one above Build closes the hero off the same way. Same
          divider as the homepage. */}
      {tabs.map((t) => (
        <Fragment key={t.id}>
          <hr className={styles.divider} />
          <BuySection tab={t} period={period} setPeriod={setPeriod} />
        </Fragment>
      ))}

      <hr className={styles.divider} />

      {/* Native details/summary rather than a state hook: it is open/closed
          disclosure, and the keyboard and screen-reader behaviour come free. */}
      <section className={styles.faq} aria-labelledby="faq-heading">
        <h2 className={styles.faqHead} id="faq-heading">
          Questions
        </h2>

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

      {/* THE PERK BAR IS GONE, not moved. It rendered {tab.perk}, and no tab
          has carried a perk since the platform was cut — the $20,000
          bundling offer went with it and was never replaced. It survived as
          markup because a falsy guard renders nothing and nothing complains;
          it only surfaced when the tabs were flattened and 'tab' stopped
          existing at this level. See the note in pricingTabs.js. */}
    </main>
  )
}
