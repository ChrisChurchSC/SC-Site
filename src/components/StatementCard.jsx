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
 * THE STATEMENT IS AN <h2> ON THE LIVE HOMEPAGE. It was this component's h1
 * for a while, because the intro card above it had lost its heading and the
 * page had no h1 left. Home.jsx has since been rebuilt with its own h1 on the
 * corner text, so the h1 is accounted for above and this card is a section
 * heading again. Two h1s is a fault assert-build.mjs fails the build on, in
 * the other direction — see `as`. Style-neutral either way: .statement is
 * selected by class, never by element.
 */
const STATEMENT = 'For challenger brands, Super-Conscious is your fractional marketing and creative department.'
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
 * `supportSerif` sets the support line in Signifier at reading size, leaving
 * the statement at whatever size it was given. Distinct from `serif`, which
 * sets the statement AND the support at one shared size — right for a card
 * that is all prose, wrong for a hero, where it would pull the display line
 * down to the size of the line under it.
 *
 * `inset` puts the standard section side padding back on a bare card. `bare`
 * zeroes it so the type starts on the page's own left edge, which is right for
 * a card between sections that do the same; a hero whose siblings are ordinary
 * sections needs to line up with those instead. Off by default.
 *
 * `statementLines` says the statement arrives pre-broken, as an array of
 * lines. It turns off the measure and the balancing, both of which would
 * otherwise re-break lines that were broken deliberately. Off by default.
 *
 * `bottom` sits the contents on the floor of that room instead of centred in
 * it. Only meaningful with `tall`, which is what creates the room to sit at
 * the bottom of. Off by default.
 *
 * `tall` gives the card a viewport-relative minimum height with its contents
 * centred in it — for a card used as a hero, where the copy is short and the
 * room is the point. Off by default, so the live homepage is unaffected.
 */
export default function StatementCard({
  eyebrow = null,
  statement = STATEMENT,
  support = SUPPORT,
  as: Heading = 'h2',
  tall = false,
  bottom = false,
  statementLines = false,
  inset = false,
  supportSerif = false,
  serif = false,
  bare = false,
  rule = true,
  center = false,
  display = false,
  /* An extra class from the page, for the one thing a page needs that no
     flag covers — the homepage's shorter hero. Appended last, so it wins on
     any property it sets at higher specificity. */
  className = '',
  children = null,
}) {
  const paras = Array.isArray(support) ? support : [support]
  return (
    <section className={`${styles.card}${tall ? ' ' + styles.tall : ''}${bottom ? ' ' + styles.bottom : ''}${serif ? ' ' + styles.serif : ''}${bare ? ' ' + styles.bare : ''}${bare && !rule ? ' ' + styles.noRule : ''}${bare && inset ? ' ' + styles.inset : ''}${center ? ' ' + styles.center : ''}${display ? ' ' + styles.display : ''}${supportSerif ? ' ' + styles.supportSerif : ''}${className ? ' ' + className : ''}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading className={`${styles.statement}${statementLines ? ' ' + styles.statementLines : ''}`}>
        {Array.isArray(statement)
          ? statement.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))
          : statement}
      </Heading>
      {paras.filter(Boolean).map(p => <p key={p.slice(0, 24)} className={styles.support}>{p}</p>)}
      {children}
    </section>
  )
}
