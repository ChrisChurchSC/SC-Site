import { NavLink } from 'react-router-dom'

import styles from './PricingV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { clientLogos } from '../data/clientLogos'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { build, buildPillars, grow, growTiers } from '../data/pricingPillars'

/**
 * The pricing page.
 *
 * EVERY PRICE AND EVERY LINE IS CHRIS'S, given directly, and lives in
 * src/data/pricingPillars.js rather than here. Nothing is rounded, reordered
 * or reworded on the way to the screen — a wrong price is not a design bug,
 * it is a quote.
 *
 * THE SECOND PASS MADE IT SIMPLER, and the page follows rather than
 * defending the first version:
 *
 *   THE PILLAR ITEMS ARE ONE LINE, middot-separated, instead of a column of
 *   bullets. Eleven bulleted lines under Your Website & App made a card that
 *   looked like a form; the same eleven set as a sentence read in a glance.
 *
 *   THE PERIOD TOGGLE IS GONE. Grow is billed quarterly with a one-quarter
 *   minimum, which the intro now says — so a month/quarter/year switch was
 *   offering a choice that is not on the table, and the quarterly and yearly
 *   figures behind it were my arithmetic rather than anybody's rate.
 *
 *   GROW LOST ITS FOUR PILLAR CARDS. It is prose and the hour tiers, and the
 *   tiers carry the explanation now — each one says how many pillars it
 *   covers, which is what a reader is actually choosing between.
 */
const money = (n) => '$' + n.toLocaleString('en-US')

function Pillar({ n, name, small, large, note, price, priceSuffix }) {
  return (
    <article className={styles.pillar}>
      <span className={styles.pillarNum}>{n}</span>
      <h3 className={styles.pillarName}>{name}</h3>

      {/* Two lines, not an inventory. The item lists are still in the data —
          they are what these were derived from — but printing eleven of them
          made a card that reads like a form when the question is only ever
          "what does it cost, and what do I get". */}
      <dl className={styles.scopes}>
        <dt className={styles.scopeKey}>Small</dt>
        <dd className={styles.scopeVal}>{small}</dd>
        <dt className={styles.scopeKey}>Large</dt>
        <dd className={styles.scopeVal}>{large}</dd>
      </dl>

      {note && <p className={styles.note}>{note}</p>}

      <p className={styles.pillarPrice}>
        <span className={styles.startingAt}>Starting at</span>
        <span className={styles.amount}>
          {money(price)}
          {priceSuffix && <span className={styles.priceSuffix}>{priceSuffix}</span>}
        </span>
      </p>
    </article>
  )
}

export default function PricingV3() {
  const cal = useCalDrawer()

  useMeta({
    title: 'Pricing | Super Conscious',
    description:
      'Build is project-based and scoped specifically. Grow is ongoing support, billed hourly. What each one costs.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>[ Pricing ]</p>
          <h1 className={styles.headline}>What it costs to build it, and to run it.</h1>
        </div>

        {/* The reference puts client logos across from its headline. We have
            no logo files for these — the homepage's client wall is names too
            — so it is names, in two columns. */}
        <ul className={styles.clients} aria-label="Selected clients">
          {clientLogos.slice(0, 12).map(({ name }) => <li key={name}>{name}</li>)}
        </ul>
      </header>

      <section className={styles.block} aria-labelledby="build-heading">
        <div className={styles.blockHead}>
          <div>
            <h2 className={styles.blockName} id="build-heading">{build.name}</h2>
            <p className={styles.kicker}>{build.kicker}</p>
          </div>
          <p className={styles.blockIntro}>{build.intro}</p>
        </div>

        <p className={styles.pillarsIntro}>{build.pillarsIntro}</p>

        <div className={styles.pillars}>
          {buildPillars.map((p) => <Pillar key={p.n} {...p} />)}
        </div>
      </section>

      <section className={`${styles.block} ${styles.blockTail}`} aria-labelledby="grow-heading">
        <div className={styles.blockHead}>
          <div>
            <h2 className={styles.blockName} id="grow-heading">{grow.name}</h2>
            <p className={styles.kicker}>{grow.kicker}</p>
          </div>
          <p className={styles.blockIntro}>{grow.intro}</p>
        </div>

        <div className={styles.tiers}>
          {growTiers.map(({ hours, monthly, rate, common, blurb }) => (
            <div key={hours} className={`${styles.tier}${common ? ' ' + styles.tierCommon : ''}`}>
              {/* A reserved row on every card, filled on one, so the marked
                  card's contents do not sit lower than its neighbours'. */}
              <span className={styles.badgeRow}>
                {common && <span className={styles.badge}>Most common</span>}
              </span>

              <p className={styles.hours}>
                <span className={styles.hoursNum}>{hours}</span>
                <span className={styles.hoursUnit}>hours / month</span>
              </p>

              <p className={styles.tierPrice}>{money(monthly)}</p>
              <p className={styles.tierRate}>{money(rate)} per hour</p>
              <p className={styles.tierBlurb}>{blurb}</p>

              <button className={styles.tierCta} onClick={cal.open}>Book a demo</button>
            </div>
          ))}
        </div>
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
