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
    // v5's Build definition. The source line opens 'Build — we make…' as a
    // label; that prefix is dropped here because the card's headline already
    // says Build and printing it twice in one card reads as a mistake.
    body: 'We make your brand and its assets, from scratch or refreshed from what you have: brand strategy, identity, voice, messaging, website, app.',
    cta: 'How we build',
    href: '/about',
  },
  {
    id: 'grow',
    name: 'Grow',
    // v5's Grow definition, matching the Build card. Same treatment: the
    // source line's 'Grow — ' label is dropped, since the headline says it.
    body: 'We take that brand to market and run it: campaigns, paid media, organic content, and an embedded marketing team, measured and optimized every month.',
    cta: 'How we grow',
    href: '/about',
  },
]

export default function BuildGrowCards() {
  return (
    <section className={styles.row}>
      {CARDS.map(({ id, name, body, cta, href }) => (
        <NavLink key={id} to={href} className={styles.card}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.body}>{body}</p>
          <span className={styles.cta}>{cta} →</span>
        </NavLink>
      ))}
    </section>
  )
}
