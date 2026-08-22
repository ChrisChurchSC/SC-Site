import { NavLink } from 'react-router-dom'
import styles from './BuildGrowCards.module.css'

/**
 * The two-up under the client strip: the whole offer in two cards.
 *
 * Type only — no media. The reel sits directly above and the wall directly
 * below, both of them moving pictures; these two are the still point between
 * them, and the one place on the homepage that says in words what the studio
 * actually sells.
 *
 * Copy is the client's own, from the Build/Grow module spec.
 *
 * Both cards currently point at /about, the Capabilities page. Dedicated
 * /build and /grow pages do not exist yet; when they do, change `href` here
 * and nothing else changes.
 */
const CARDS = [
  {
    id: 'build',
    name: 'Build',
    sub: 'The Foundation',
    body: 'Great businesses have great brands. Period. More than a memorable tagline or nice colors or cute doodles, your brand identity communicates your value—and values—to your audience.',
    cta: 'How we build',
    href: '/about',
  },
  {
    id: 'grow',
    name: 'Grow',
    sub: 'The Journey',
    body: "Brands are living things—they need to be malleable, responsive to culture, engaged with the world just like the audience you're trying to attract. Content may be king, but it's meaningless if you aren't reaching the right people at the right time.",
    cta: 'How we grow',
    href: '/about',
  },
]

export default function BuildGrowCards() {
  return (
    <section className={styles.row}>
      {CARDS.map(({ id, name, sub, body, cta, href }) => (
        <NavLink key={id} to={href} className={styles.card}>
          <p className={styles.sub}>{sub}</p>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.body}>{body}</p>
          <span className={styles.cta}>{cta} →</span>
        </NavLink>
      ))}
    </section>
  )
}
