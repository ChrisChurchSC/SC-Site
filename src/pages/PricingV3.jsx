import { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { Card as OutputCard } from '../components/PlatformOutputs'
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
 * THE WIRES FROM THE PLATFORM DOWN TO WHAT IT EXTENDS TO.
 *
 * WHY MEASURED RATHER THAN DRAWN. The three cards are not a fixed width —
 * the grid is auto-fit, so they reflow to two-up and one-up as the page
 * narrows, and their tops move when a deliverable list wraps. Any hard-coded
 * path would be right at one width and wrong at every other. The positions
 * are read after layout and redrawn whenever the box or a card resizes.
 *
 * ONE JUNCTION, not three lines leaving the card. Three separate wires would
 * say the platform has three outputs; a single square everything passes
 * through says they are the same thing arriving in three places, which is
 * what "and everything it extends to" is claiming.
 *
 * IT FINDS ITS ENDS BY DATA ATTRIBUTE rather than by child index. The label
 * sits between the card and the grid, and an index would have counted it.
 */
function ExtendsWires({ count }) {
  const svgRef = useRef(null)
  const [wires, setWires] = useState(null)

  /* IT HOLDS ITS OWN REF AND WORKS UP TO THE BOX, rather than being handed a
     ref to the parent. React attaches a host element's ref in the same commit
     phase that runs its children's layout effects, children first — so a ref
     on the wrapping div is still null when this component measures, the first
     pass bails, and nothing in the deps ever changes to make it try again.
     That is exactly what happened here: no wires, no error. The SVG is always
     mounted so its own ref is attached before its own effect, and the box is
     its parent. */
  const measure = useCallback(() => {
    const box = svgRef.current?.parentElement
    if (!box) return
    const lead = box.querySelector('[data-lead-card]')
    const grid = box.querySelector('[data-extends-grid]')
    const hub = box.querySelector('[data-extends-label]')
    if (!lead || !grid || !hub) return

    const base = box.getBoundingClientRect()
    const l = lead.getBoundingClientRect()
    const h = hub.getBoundingClientRect()
    const cards = [...grid.children].map((c) => c.getBoundingClientRect())
    if (!cards.length || !base.width) return

    /* +6 / -6 so a wire starts and lands just clear of a border rather than
       under it — the same clearance the Build diagram uses. */
    const from = { x: base.width / 2, y: l.bottom - base.top + 6 }
    const landing = Math.min(...cards.map((c) => c.top)) - base.top - 6

    /* THE LABEL IS THE HUB. Everything used to converge on a drawn square in
       the middle of the gap; the card now sits exactly there, so the stem
       lands on its top edge and the fan leaves its bottom one. Measured off
       the element rather than centred arithmetically, because the card is
       sized by its own text. */
    const hubX = h.left - base.left + h.width / 2
    const hubTop = { x: hubX, y: h.top - base.top - 6 }
    const hubBottom = { x: hubX, y: h.bottom - base.top + 6 }

    const curve = (a, b) => {
      const c = Math.max(14, Math.abs(b.y - a.y) * 0.65)
      return `M ${a.x} ${a.y} C ${a.x} ${a.y + c}, ${b.x} ${b.y - c}, ${b.x} ${b.y}`
    }

    const landings = cards.map((c) => ({ x: c.left - base.left + c.width / 2, y: landing }))

    /* NOTHING TO DRAW IN ONE COLUMN. On a phone the grid collapses and every
       card shares the same centre, so the fan becomes three straight lines
       down the same axis — two of them behind the cards, and three nodes
       stacked on one point, which reads as a rendering fault rather than as
       a diagram. Detected from the measured positions rather than from a
       breakpoint, because the grid is auto-fit and collapses at whatever
       width the cards stop fitting. The stacked cards are already in reading
       order, which is what the wires were saying. */
    const oneColumn = landings.every((l) => Math.abs(l.x - landings[0].x) < 1)
    if (oneColumn) {
      setWires(null)
      return
    }

    setWires({
      width: base.width,
      height: base.height,
      stem: curve(from, hubTop),
      out: landings.map((to) => curve(hubBottom, to)),
      /* A node on every card the wire touches, plus the one it leaves.
         Nothing is drawn on the label: it is the meeting point rather than
         one of the things being connected, and it is a card now, so a mark
         on it would read as a fifth. */
      ends: [from, ...landings],
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const box = svgRef.current?.parentElement
    if (!box || typeof ResizeObserver === 'undefined') return

    /* Observes the box, the lead card and every extension card: the grid
       reflows when the page does, and a card changes height on its own when
       its chips wrap. */
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    const lead = box.querySelector('[data-lead-card]')
    if (lead) ro.observe(lead)
    const grid = box.querySelector('[data-extends-grid]')
    if (grid) for (const card of grid.children) ro.observe(card)

    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, count])

  return (
    <svg
      ref={svgRef}
      className={styles.wires}
      viewBox={wires ? `0 0 ${wires.width} ${wires.height}` : undefined}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {wires && <path className={styles.wire} d={wires.stem} />}
      {wires?.out.map((d) => (
        <path key={d} className={styles.wire} d={d} />
      ))}
      {/* Squares, not dots — offset by half their size so a wire meets the
          middle of the mark rather than its corner. */}
      {(wires?.ends ?? []).map((n) => (
        <rect
          key={`${n.x},${n.y}`}
          className={styles.junction}
          x={n.x - 3}
          y={n.y - 3}
          width="6"
          height="6"
        />
      ))}
    </svg>
  )
}

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
    typeof tier.price === 'number' ? Math.round(tier.price * months * (1 - discount)) : tier.price

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

      {tier.groups && (
        <div className={styles.groups}>
          <p className={styles.inventoryLabel}>What the platform holds</p>
          {tier.groups.map((g) => (
            <div key={g.name} className={styles.group}>
              <p className={styles.groupName}>{g.name}</p>
              <ul className={styles.pills}>
                {g.items.map((i) => (
                  <li key={i} className={styles.pill}>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tier.note && <p className={styles.note}>{tier.note}</p>}
      {nameLed && price}

      <button className={styles.cta} data-cal>
        {tier.cta}
      </button>
    </div>
  )
}

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
