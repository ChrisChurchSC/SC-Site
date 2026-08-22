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
 * the display size, the rest is the reasoning and sits in mono beneath it, and
 * the last line is the whole thing in six words.
 */
const STATEMENT = 'Super-Conscious is your outsourced marketing and creative department.'
const SUPPORT = "One embedded team handles both brand creation/evolution and growth media and content tactics, so you're not stitching together a branding studio, a media shop, and whoever built your last campaign."
const KICKER = 'We are creatives who also do marketing.'

export default function StatementCard() {
  return (
    <section className={styles.card}>
      <h2 className={styles.statement}>{STATEMENT}</h2>
      <p className={styles.support}>{SUPPORT}</p>
      <p className={styles.kicker}>{KICKER}</p>
    </section>
  )
}
