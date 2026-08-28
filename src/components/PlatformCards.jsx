import styles from './PlatformCards.module.css'

/**
 * The platform section: a headline, two actions, then two large cards and
 * three smaller ones.
 *
 * THE LAYOUT IS THE DELIVERABLE HERE. The cards' contents were explicitly not
 * in scope, so each one has its headline, its arrow, and an empty well where
 * the preview goes. The well is deliberately empty rather than filled with a
 * drawn approximation of a UI: a fake screenshot of software that does not
 * exist is the most convincing lie a page like this can tell, and it would
 * have to be thrown away the moment a real one exists.
 *
 * AND THE PLATFORM ITSELF DOES NOT EXIST — same standing note as the nav
 * panel it shares its copy with. No route, nothing in Sanity, no surface a
 * client logs into. The headlines below are the ones already written for that
 * panel, so the two cannot drift apart; the arrows do not link anywhere yet.
 *
 * The reference splits each headline in two weights — the subject in full
 * white, the rest muted — which is what lets a two-line headline still read
 * as one phrase. `lead` and `rest` are that split.
 */
const CARDS = [
  {
    id: 'brand-os',
    lead: 'Brand OS',
    rest: 'that everyone works from',
    size: 'large',
  },
  {
    id: 'agents',
    lead: 'Agents',
    rest: 'trained on your brand, not on the internet',
    size: 'large',
  },
  {
    id: 'guardrails',
    lead: 'Guardrails',
    rest: 'that stop an unsourced claim shipping',
    size: 'small',
  },
  {
    id: 'reviews',
    lead: 'Reviews',
    rest: 'where a person still approves the work',
    size: 'small',
  },
  {
    id: 'measurement',
    lead: 'Measurement',
    rest: 'of what shipped and what it moved',
    size: 'small',
  },
]

/* Library is the sixth feature in the nav panel and is not a card here: the
   layout takes five and Library is the least differentiated of the six. If
   the section grows to six, it is the one to add back. */

function Card({ lead, rest, size }) {
  return (
    <div className={`${styles.card} ${size === 'large' ? styles.cardLarge : styles.cardSmall}`}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>
          <span className={styles.lead}>{lead}</span>{' '}
          <span className={styles.rest}>{rest}</span>
        </h3>
        {/* Not a link yet — there is nowhere for it to go. It is here because
            it is part of the card's shape; give it an href with the page. */}
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </div>
      {/* The preview well. Empty on purpose — see the note at the top. */}
      <div className={styles.well} aria-hidden="true" />
    </div>
  )
}

export default function PlatformCards({ eyebrow = '[ The Platform ]' }) {
  const large = CARDS.filter(c => c.size === 'large')
  const small = CARDS.filter(c => c.size === 'small')

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>One place to run the brand.</h2>

      <div className={styles.actions}>
        <span className={styles.cta}>Coming soon</span>
        <span className={styles.ghost}>Take a tour</span>
      </div>

      <div className={styles.rowTwo}>
        {large.map(c => <Card key={c.id} {...c} />)}
      </div>

      <div className={styles.rowThree}>
        {small.map(c => <Card key={c.id} {...c} />)}
      </div>
    </section>
  )
}
