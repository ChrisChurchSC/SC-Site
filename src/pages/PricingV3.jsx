import { useState } from 'react'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { tabs, TBC, faqs } from '../data/pricingTabs'
import { deliverableNotes } from '../data/deliverables'

/**
 * The pricing page: three ways to buy, one tab each.
 *
 * Platform is by seat, Project is scoped engagements / ongoing development /
 * hourly support, and Tasks is per task. The shape follows the Ace Workflow
 * reference: a centred hero, a pill switcher, and three cards under whichever
 * tab is open.
 *
 * THE PROJECT TAB IS THE ONLY ONE WITH REAL NUMBERS IN IT. Those are figures
 * Chris supplied directly. Every unsourced price reads '––' — the same
 * placeholder the case-study cards use, at the size a real number would be,
 * so an empty one looks like a number that is missing rather than a design
 * that never had one.
 *
 * A SEAT PRICE IS A COMMERCIAL TERM, not a design detail, and the platform
 * is Coming Soon. Guessing one would put a quote on the site nobody has
 * agreed to, and a visitor cannot tell an invented $49/seat from a real one.
 * Three numbers finish this page — see the note at the top of the data file.
 *
 * THE TABS ARE BUTTONS IN A TABLIST, not links. There is one page and three
 * views of it; giving each a URL would mean three pages to keep in step and
 * two of them findable before their prices exist.
 */
const money = (n) => (typeof n === 'number' ? '$' + n.toLocaleString('en-US') : n)

/**
 * THE PROJECT CARDS READ IN A DIFFERENT ORDER, and it is a real difference
 * rather than a style.
 *
 * On Platform and Subscription the number IS the product — you are choosing
 * between $4,500 and $15,000 of the same thing, so the figure leads and the
 * heading above it is the rate that produced it.
 *
 * On Project you are choosing between a brand and a website. The name is
 * what you are buying and the price is a consequence of it, so the name
 * leads, the price moves to the foot above the button, and the inventory
 * sits between them as the quietest thing on the card. The old card had the
 * price set larger than the name it belonged to, which made four cards that
 * all opened with a number and buried the only word that told them apart.
 */
function Tier({ tier, variant }) {
  const empty = tier.price === TBC
  const nameLed = variant === 'project'

  const price = (
    <p className={`${styles.priceRow}${nameLed ? ' ' + styles.priceRowFoot : ''}`}>
      {nameLed && tier.unit && <span className={styles.unitAbove}>{tier.unit}</span>}
      <span className={`${styles.price}${nameLed ? ' ' + styles.priceQuiet : ''}${empty ? ' ' + styles.priceEmpty : ''}`}>
        {money(tier.price)}
      </span>
      {!nameLed && tier.unit && <span className={styles.unit}>{tier.unit}</span>}
    </p>
  )

  return (
    <div className={`${styles.tier}${tier.featured ? ' ' + styles.tierFeatured : ''}`}>
      <p className={styles.kicker}>{tier.kicker}</p>
      <h3 className={`${styles.tierName}${nameLed ? ' ' + styles.tierNameLead : ''}`}>{tier.name}</h3>

      {!nameLed && price}
      {!nameLed && tier.note && (
        <p className={`${styles.note}${empty ? ' ' + styles.noteFlag : ''}`}>{tier.note}</p>
      )}

      <p className={`${styles.summary}${nameLed ? ' ' + styles.summaryLead : ''}`}>{tier.summary}</p>

      {/* PILLS ON PROJECT, and a label above them, because a middot-joined
          line read as one long thing you buy in full. These are eleven
          separate deliverables you pick from — the price is a starting
          point, not the sum of the list — and a chip per item is what says
          so without a sentence explaining it.

          Bullets everywhere else, where the lists are three long and each
          item is a claim about the tier rather than something to choose. */}
      {nameLed
        ? (
          <div className={styles.inventory}>
            <p className={styles.inventoryLabel}>Individual deliverables — pick what you need</p>
            <ul className={styles.pills}>
              {tier.lines.map((l) => (
                /* No entry means no tooltip rather than an empty bubble —
                   the CSS only draws one when the attribute is present. */
                <li key={l} className={styles.pill} data-tip={deliverableNotes[l] || undefined}>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )
        : (
          <ul className={styles.lines}>
            {tier.lines.map((l) => <li key={l}>{l}</li>)}
          </ul>
        )}

      {nameLed && tier.note && <p className={styles.note}>{tier.note}</p>}
      {nameLed && price}

      <button className={styles.cta} data-cal>{tier.cta}</button>
    </div>
  )
}

export default function PricingV3() {
  const cal = useCalDrawer()
  const [active, setActive] = useState(tabs[0].id)
  const tab = tabs.find((t) => t.id === active)

  useMeta({
    title: 'Pricing | Super Conscious',
    description: 'Subscribe to the platform by seat, have us build a project, or keep us on by the hour.',
  })

  return (
    <main className={styles.page} onClick={(e) => {
      /* One handler rather than a prop threaded through two components: every
         button on this page opens the same drawer. */
      if (e.target.closest('button')?.dataset.cal !== undefined) cal.open()
    }}>
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

        {/* ABOVE THE CARDS, NOT UNDER THEM. As a footnote it was the last
            thing on the tab and read as a condition; the platform is the
            thing this studio has that the others do not, and being given it
            with the work is the best sentence on the page. It should be read
            before the prices, not after them. */}
        {tab.perk && (
          <p className={styles.perk}>
            <span className={styles.perkMark} aria-hidden="true">+</span>
            {tab.perk}
          </p>
        )}

        <div className={styles.tiers}>
          {tab.tiers.map((t) => <Tier key={t.name} tier={t} variant={tab.id} />)}
        </div>

      </section>

      {/* Native details/summary rather than a state hook and a div: it is
          open/closed disclosure, the browser already does it, and it works
          with a keyboard and a screen reader without anything from me. */}
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
    </main>
  )
}
