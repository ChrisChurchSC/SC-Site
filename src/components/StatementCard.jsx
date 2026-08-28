import styles from './StatementCard.module.css'

/**
 * The positioning statement, set as the page's one display-scale sentence.
 *
 * Sits between the client strip and the Build/Grow two-up: the strip says who
 * we work with, this says what we are, and the two cards below split it into
 * the two halves of the offer. It is the hinge between them.
 *
 * Copy is v5's Market Category section, verbatim. It is split at the sentence
 * boundary rather than rewritten: the first sentence is the claim and carries
 * the display size, the rest is the reasoning and sits in mono beneath it.
 *
 * THE STATEMENT IS THE PAGE'S <h1>. It was an h2 while the intro card above
 * carried the heading; that text has since been removed, which would have
 * left the homepage with no h1 at all — the fault that markup existed to fix,
 * and one assert-build.mjs fails the build on. This component is rendered
 * only by Home.jsx, so the tag cannot collide anywhere else. The change is
 * style-neutral: .statement is selected by class, never by element.
 */
const STATEMENT = 'Super-Conscious exists to level up challenger brands by combining world-class creative with analytics-driven marketing at an accessible price.'
const SUPPORT = "One embedded team handles both brand creation/evolution and growth media and content tactics, so you're not stitching together a branding studio, a media shop, and whoever built your last campaign."

/**
 * Copy is passed in rather than fixed, so a homepage variant can carry
 * different words through the same card. The defaults are the live
 * homepage's copy, so rendering <StatementCard /> is unchanged.
 *
 * `as` exists because the card is the page's h1 on the live homepage, and a
 * variant that puts a headline above it needs this one to be an h2 — two h1s
 * is the fault assert-build.mjs fails the build on, in the other direction.
 * `support` accepts a string or an array of paragraphs.
 *
 * `tall` gives the card a viewport-relative minimum height with its contents
 * centred in it — for a card used as a hero, where the copy is short and the
 * room is the point. Off by default, so the live homepage is unaffected.
 */
export default function StatementCard({
  eyebrow = '[ Who We Are ]',
  statement = STATEMENT,
  support = SUPPORT,
  as: Heading = 'h1',
  tall = false,
}) {
  const paras = Array.isArray(support) ? support : [support]
  return (
    <section className={`${styles.card}${tall ? ' ' + styles.tall : ''}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <Heading className={styles.statement}>{statement}</Heading>
      {paras.filter(Boolean).map(p => <p key={p.slice(0, 24)} className={styles.support}>{p}</p>)}
    </section>
  )
}
