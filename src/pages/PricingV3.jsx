import { useState } from 'react'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { tabs, TBC } from '../data/pricingTabs'

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

function Tier({ tier }) {
  const empty = tier.price === TBC

  return (
    <div className={`${styles.tier}${tier.featured ? ' ' + styles.tierFeatured : ''}`}>
      <p className={styles.kicker}>{tier.kicker}</p>
      <h3 className={styles.tierName}>{tier.name}</h3>

      <p className={styles.priceRow}>
        <span className={`${styles.price}${empty ? ' ' + styles.priceEmpty : ''}`}>
          {money(tier.price)}
        </span>
        {tier.unit && <span className={styles.unit}>{tier.unit}</span>}
      </p>

      {tier.note && (
        <p className={`${styles.note}${empty ? ' ' + styles.noteFlag : ''}`}>{tier.note}</p>
      )}

      <p className={styles.summary}>{tier.summary}</p>

      <ul className={styles.lines}>
        {tier.lines.map((l) => <li key={l}>{l}</li>)}
      </ul>

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
    description: 'Subscribe to the platform, have us build it, or pay per task.',
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
        <p className={styles.sub}>Subscribe to the platform, have us build it, or pay per task.</p>

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

        <div className={styles.tiers}>
          {tab.tiers.map((t) => <Tier key={t.name} tier={t} />)}
        </div>
      </section>

      <FooterCard columns={FOOTER_COLS} />
    </main>
  )
}
