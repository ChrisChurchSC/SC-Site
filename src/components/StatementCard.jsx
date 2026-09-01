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
 * `display` sets the statement at hero scale — bigger and tighter than the
 * card's default, which is sized for a paragraph-length claim rather than a
 * short line. Off by default, so /v2's hero keeps the size it was tuned at.
 *
 * `children` render under the support text, for the actions a hero needs and
 * a mid-page statement does not.
 *
 * `center` centres the eyebrow and the statement, both the text itself and
 * the block it sits in — a max-width set on the statement would otherwise
 * keep it hard left however the text inside it is aligned.
 *
 * `bare` drops the card entirely — no ground, no box — so the type sits on
 * the page and a hairline rule does the work the card's edge was doing. For a
 * page that does not want every passage in a container.
 *
 * `rule` turns that hairline off, for a bare card that opens a page. The rule
 * divides this passage from the one above it, and there is nothing above a
 * hero but the nav — drawn there it reads as an underline on the bar. On by
 * default, so every existing bare card keeps it.
 *
 * `serif` sets the support paragraphs in Signifier at reading size instead of
 * the 11px mono, and lifts the statement to match. For a card carrying real
 * prose rather than one line of qualifier. Off by default.
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
  serif = false,
  bare = false,
  rule = true,
  center = false,
  display = false,
  children = null,
}) {
  const paras = Array.isArray(support) ? support : [support]
  return (
    <section className={`${styles.card}${tall ? ' ' + styles.tall : ''}${serif ? ' ' + styles.serif : ''}${bare ? ' ' + styles.bare : ''}${bare && !rule ? ' ' + styles.noRule : ''}${center ? ' ' + styles.center : ''}${display ? ' ' + styles.display : ''}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <Heading className={styles.statement}>{statement}</Heading>
      {paras.filter(Boolean).map(p => <p key={p.slice(0, 24)} className={styles.support}>{p}</p>)}
      {children}
    </section>
  )
}
