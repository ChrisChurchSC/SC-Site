import styles from '../pages/PricingV3.module.css'
import { TBC } from '../data/pricingTabs'

/**
 * THE PRICING CARD, in one place. It was a function inside PricingV3.jsx;
 * the Build service page now shows the same four Build cards in its
 * "everything a brand platform extends to" section (2026-09-02), and a card
 * that exists twice is a card that drifts. Its stylesheet is still the
 * pricing page's, the way V3Nav borrows HomeV3's.
 *
 * `onCta` is the button's click. The pricing page wires the button through
 * a data-cal delegate of its own and passes nothing; the service page has
 * no delegate and passes the booking drawer's open.
 */
const money = (n) =>
  typeof n === 'number'
    ? '$' +
      n.toLocaleString('en-US', {
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : n

export { money }

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
export default function Tier({ tier, variant, months = 1, discount = 0, unitOverride, onCta }) {
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

      {/* NO DELIVERABLE PILLS ON THE PROJECT CARD (cut 2026-09-02). The Brand
          platform card listed "New Brand, Rebrand, Brand Refresh, Sub-brand,
          Brand Guidelines, Product Positioning" under "Individual
          deliverables — pick what you need", on /pricing and on the Build
          page's copy of it. Chris cut the list: the card's job is the
          platform and what it holds, below, and the price. The data still
          carries the lines (pricingTabs.js) for anything else that reads
          them. Bullets stay on the subscription cards, where the three lines
          are claims about the tier. */}
      {!nameLed && (
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

      <button className={styles.cta} data-cal onClick={onCta}>
        {tier.cta}
      </button>
    </div>
  )
}
