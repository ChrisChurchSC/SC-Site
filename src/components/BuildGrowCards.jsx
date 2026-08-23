import { NavLink } from 'react-router-dom'
import styles from './BuildGrowCards.module.css'

/**
 * The two-up under the client strip: the whole offer in two cards.
 *
 * Grow carries artwork; Build does not, yet. The pair was type-only on
 * purpose — the reel sits directly above and the wall directly below, both
 * moving pictures, and these two were the still point between them — so the
 * asymmetry is a deliberate half-step rather than a finished state.
 *
 * The artwork is inverted and desaturated in CSS rather than re-exported, so
 * the source file stays the drawing as delivered and the card matches the
 * dark ground instead of the type flipping to suit a cream image. It sits on
 * its own layer for that reason — filtering the card would filter the words
 * with it. Give Build a media of its own and the same class does the same
 * thing for it.
 *
 * Copy is the client's own, from the Build/Grow module spec.
 *
 * Both cards currently point at /services. Dedicated /build and /grow pages
 * do not exist yet; when they do, change `href` here and nothing else changes.
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
    href: '/services',
  },
  {
    id: 'grow',
    name: 'Grow',
    // v5's Grow definition, matching the Build card. Same treatment: the
    // source line's 'Grow — ' label is dropped, since the headline says it.
    body: 'We take that brand to market and run it: campaigns, paid media, organic content, and an embedded marketing team, measured and optimized every month.',
    cta: 'How we grow',
    href: '/services',
    media: '/grow-card.gif',
  },
]

export default function BuildGrowCards() {
  return (
    <section className={styles.row}>
      {CARDS.map(({ id, name, body, cta, href, media }) => (
        <NavLink
          key={id}
          to={href}
          className={`${styles.card}${media ? ' ' + styles.cardMedia : ''}`}
        >
          {media && (
            <span
              className={styles.media}
              style={{ backgroundImage: `url(${media})` }}
              aria-hidden="true"
            />
          )}
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.body}>{body}</p>
          <span className={styles.cta}>{cta} →</span>
        </NavLink>
      ))}
    </section>
  )
}
