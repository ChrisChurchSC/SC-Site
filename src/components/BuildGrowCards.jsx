import { NavLink } from 'react-router-dom'
import styles from './BuildGrowCards.module.css'
import LazyVideo from './LazyVideo'

/** Artwork can be a still or a film, and they cannot share a mechanism: a
 *  background-image will not play, so a film needs a real element. */
const isVideo = src => /\.(mp4|webm|mov)$/i.test(src)

/**
 * The two-up under the client strip: the whole offer in two cards.
 *
 * Both cards carry artwork now, and not the same kind. Grow has a still
 * drawing; Build has film. They take different paths through here because a
 * background-image cannot play — see isVideo below.
 *
 * Grow's drawing is inverted and desaturated in CSS rather than re-exported,
 * so the source file stays the drawing as delivered and the card matches the
 * dark ground instead of the type flipping to suit a cream image. Build's
 * film gets neither treatment: it is finished brand work, shown as made, with
 * a scrim under the type instead.
 *
 * Either way the artwork sits on its own layer, because filtering or dimming
 * the card would take the words with it.
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
    // The OffChain Labs homepage hero animation, transcoded from the 23MB
    // ProRes master to a 2MB h264 cut — the master is a delivery file and has
    // no business in a page load or in git. It is a finished piece of brand
    // work, so unlike Grow's drawing it is shown as made: no invert, no
    // desaturation, just a scrim under the type.
    media: '/build-card-compressed.mp4',
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

/**
 * Copy is passed in rather than fixed, so a homepage variant can carry
 * different words through the same two cards. Defaults are the live
 * homepage's, so <BuildGrowCards /> is unchanged. A card may carry an
 * optional `price` line, and the section an optional `footnote`.
 */
function CardShell({ href, className, children }) {
  if (!href) return <div className={className}>{children}</div>
  return <NavLink to={href} className={className}>{children}</NavLink>
}

export default function BuildGrowCards({ cards = CARDS, footnote = null, compact = false }) {
  /* The section and its footnote are wrapped together ONLY when there is a
     footnote. They are both children of the page's flex column, so a page
     that opens its section gap up — /v2 does, at up to 64px — would push the
     footnote away from the cards it belongs to and leave it reading as an
     orphan line. The wrapper holds them at their own tight gap instead.

     Without a footnote the section is returned bare, exactly as before, so
     the live homepage's DOM is unchanged rather than merely equivalent. */
  const cardsRow = (
    <section className={`${styles.row}${compact ? ' ' + styles.rowCompact : ''}`}>
      {cards.map(({ id, name, body, price, cta, href, media }) => (
        /* A card without an href renders as a div: NavLink with to={null}
           throws, and two of the four services have no page yet. */
        <CardShell
          key={id}
          href={href}
          className={`${styles.card}${media ? ' ' + styles.cardMedia : ''}${compact ? ' ' + styles.cardCompact : ''}`}
        >
          {media && (isVideo(media) ? (
            // Wrapped rather than filtered: the span carries the scrim and
            // hides the whole layer from the accessibility tree, which is not
            // something LazyVideo takes a prop for. LazyVideo itself is what
            // keeps this honest — preload="none" until the card is near the
            // viewport, then muted autoplay, paused again once it leaves.
            <span className={styles.mediaLayer} aria-hidden="true">
              <LazyVideo src={media} className={styles.mediaVideo} />
            </span>
          ) : (
            <span
              className={styles.media}
              style={{ backgroundImage: `url(${media})` }}
              aria-hidden="true"
            />
          ))}
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.body}>{body}</p>
          {price && <p className={styles.price}>{price}</p>}
          {cta && href && <span className={styles.cta}>{cta} →</span>}
        </CardShell>
      ))}
    </section>
  )

  if (!footnote) return cardsRow

  return (
    <div className={styles.group}>
      {cardsRow}
      <p className={styles.footnote}>{footnote}</p>
    </div>
  )
}
