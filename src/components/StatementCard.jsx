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
const STATEMENT = 'Super-Conscious is the fractional marketing and creative department for challenger brands.'
const SUPPORT = "One embedded team handles both brand creation/evolution and growth media and content tactics, so you're not stitching together a branding studio, a media shop, and whoever built your last campaign."

export default function StatementCard() {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>[ Who We Are ]</p>
      <h1 className={styles.statement}>{STATEMENT}</h1>
      <p className={styles.support}>{SUPPORT}</p>
    </section>
  )
}
