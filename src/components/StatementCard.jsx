import styles from './StatementCard.module.css'

/**
 * The positioning statement, set as the page's one display-scale sentence.
 *
 * Sits between the client strip and the Build/Grow two-up: the strip says who
 * we work with, this says what we are, and the two cards below split it into
 * the two halves of the offer. It is the hinge between them.
 *
 * NOTE: the same sentence is the second line of the intro card's strapline at
 * the top of the page, where it is the <h1> at 9px uppercase mono. That is a
 * deliberate pair — small chrome up top, the statement at size here — but it
 * does mean the line appears twice on one page. If that reads as repetition,
 * the fix is to cut the strapline down to the challenger-brands clause and
 * let this card carry the rest.
 */
const STATEMENT = 'Super-Conscious is the embedded creative and marketing team that builds your brand and then grows it.'
const SUPPORT = "One team handles both, so you're not stitching together a branding studio, a media shop, and whoever built your last campaign."

export default function StatementCard() {
  return (
    <section className={styles.card}>
      <h2 className={styles.statement}>{STATEMENT}</h2>
      <p className={styles.support}>{SUPPORT}</p>
    </section>
  )
}
