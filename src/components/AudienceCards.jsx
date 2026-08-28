import { NavLink } from 'react-router-dom'
import styles from './AudienceCards.module.css'

/**
 * "Who we work with" — the three kinds of brand, three-up under the offer.
 *
 * The one section on the homepage variant that has no equivalent on the live
 * page, so it is the only thing here that had to be built rather than
 * reordered. It deliberately borrows BuildGrowCards' card: same border, same
 * radius, same hover, same mono CTA — three of them instead of two, and no
 * artwork, because there is none for these and an empty media layer would
 * read as a card that failed to load.
 *
 * Copy is the design canvas's, verbatim.
 *
 * Every card links to /work rather than a filtered view. The canvas implies
 * three filtered routes — new brands, pivots, underdogs — and none of them
 * exists; a link to a page that is not there is worse than a broader one.
 * When they exist, change `href` here and nothing else changes.
 */
const AUDIENCES = [
  {
    id: 'new',
    name: 'New',
    body: 'A brand that needs to be defined from scratch: identity, visual system, voice.',
    cta: 'See work for new brands',
    href: '/work',
  },
  {
    id: 'pivoting',
    name: 'Pivoting',
    body: 'An existing brand reworking what it has — a facelift, or a full-scale overhaul to retain and amplify relevancy.',
    cta: 'See work for pivots',
    href: '/work',
  },
  {
    id: 'underdog',
    name: 'Underdog',
    body: 'A brand in a crowded category that needs to stand out.',
    cta: 'See work for underdogs',
    href: '/work',
  },
]

export default function AudienceCards({ eyebrow = '[ Who We Work With ]', cards = AUDIENCES }) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <div className={styles.row}>
        {cards.map(({ id, name, body, cta, href }) => (
          <NavLink key={id} to={href} className={styles.card}>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.body}>{body}</p>
            <span className={styles.cta}>{cta} →</span>
          </NavLink>
        ))}
      </div>
    </section>
  )
}
