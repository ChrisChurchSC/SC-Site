import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import {
  buildIntro,
  buildPillars,
  growIntro,
  growPillars,
  growTiers,
  growPeriods,
} from '../data/pricingPillars'

/**
 * The pricing page.
 *
 * EVERY PRICE AND EVERY LINE OF COPY HERE IS CHRIS'S, given directly, and
 * lives in src/data/pricingPillars.js rather than in this file. Nothing is
 * rounded, reordered or reworded on the way to the screen — a wrong price is
 * not a design bug, it is a quote.
 *
 * IT DOES NOT SHOW THE ESTIMATOR RATE CARD, and that is a decision rather
 * than an omission. buildPackages.js and growPackages.js hold a different
 * and older set of numbers — the cheapest Build package there is $24,045,
 * where this page starts at $10,000. Putting both on one page would publish
 * two prices for the same work. The reconciliation is somebody's to do; the
 * page shows the set Chris supplied and says nothing about the other.
 *
 * THE PERIOD TOGGLE IS ARITHMETIC. Only monthly retainer figures exist, so
 * quarter and year are ×3 and ×12 with no discount — see the note in the
 * data file. The reference this is modelled on advertises "Annual · Save
 * 10%"; that discount is theirs.
 */
const money = (n) => '$' + n.toLocaleString('en-US')

function Pillar({ pillar, showPrice }) {
  const { n, name, items, why, price, priceNote } = pillar

  return (
    <article className={styles.pillar}>
      <header className={styles.pillarHead}>
        <span className={styles.pillarNum}>{n}</span>
        <h3 className={styles.pillarName}>{name}</h3>
      </header>

      <ul className={styles.items}>
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>

      {/* The reasoning line, set apart from the list. It is the only
          argument on the card and the list is only inventory. */}
      <p className={styles.why}>{why}</p>

      {showPrice && (
        <p className={styles.pillarPrice}>
          <span className={styles.startingAt}>Starting at</span>
          <span className={styles.amount}>{money(price)}</span>
          {priceNote && <span className={styles.priceNote}>{priceNote}</span>}
        </p>
      )}
    </article>
  )
}

export default function PricingV3() {
  const cal = useCalDrawer()
  const [period, setPeriod] = useState(growPeriods[0])

  useMeta({
    title: 'Pricing | Super Conscious',
    description:
      'What it costs to build the brand and to run it: four pillars on each side, with starting prices and monthly retainers.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>[ Pricing ]</p>
        <h1 className={styles.headline}>What it costs to build it, and to run it.</h1>
      </header>

      <section className={styles.block} aria-labelledby="build-heading">
        <div className={styles.blockHead}>
          <h2 className={styles.blockName} id="build-heading">Build</h2>
          <p className={styles.blockIntro}>{buildIntro}</p>
        </div>

        <div className={styles.pillars}>
          {buildPillars.map((p) => <Pillar key={p.n} pillar={p} showPrice />)}
        </div>
      </section>

      <hr className={styles.rule} />

      <section className={styles.block} aria-labelledby="grow-heading">
        <div className={styles.blockHead}>
          <h2 className={styles.blockName} id="grow-heading">Grow</h2>
          <p className={styles.blockIntro}>{growIntro}</p>
        </div>

        {/* No starting prices on these four: Grow is retained by the hour,
            and the tiers below are the price. Repeating a "from" figure on
            each pillar would imply four separate purchases. */}
        <div className={styles.pillars}>
          {growPillars.map((p) => <Pillar key={p.n} pillar={p} />)}
        </div>

        <div className={styles.tiersHead}>
          <h3 className={styles.tiersTitle}>An embedded team, by the month.</h3>

          <div className={styles.toggle} role="group" aria-label="Billing period">
            {growPeriods.map((p) => (
              <button
                key={p.id}
                type="button"
                className={p.id === period.id ? styles.toggleOn : styles.toggleOff}
                aria-pressed={p.id === period.id}
                onClick={() => setPeriod(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tiers}>
          {growTiers.map(({ hours, monthly, rate, common }) => (
            <div key={hours} className={`${styles.tier}${common ? ' ' + styles.tierCommon : ''}`}>
              {common && <span className={styles.badge}>Most common</span>}

              <p className={styles.hours}>
                <span className={styles.hoursNum}>{hours * period.months}</span>
                <span className={styles.hoursUnit}>hours / {period.id}</span>
              </p>

              <p className={styles.tierPrice}>{money(monthly * period.months)}</p>
              <p className={styles.tierRate}>{period.suffix} · {money(rate)} / hour</p>

              <button className={styles.tierCta} onClick={cal.open}>Book a demo</button>
            </div>
          ))}
        </div>

        <p className={styles.smallprint}>
          Quarterly and yearly figures are the monthly retainer multiplied out.
          The hourly rate is the same in every period.
        </p>
      </section>

      <section className={styles.close}>
        <h2 className={styles.closeHead}>Not sure which side you need?</h2>
        <p className={styles.closeBody}>Most clients do both. Tell us what you are trying to move.</p>
        <div className={styles.closeActions}>
          <button className={styles.ctaFilled} onClick={cal.open}>Book a demo</button>
          <NavLink className={styles.ctaGhost} to="/work">See our work</NavLink>
        </div>
      </section>

      <FooterCard columns={FOOTER_COLS} />
    </main>
  )
}
