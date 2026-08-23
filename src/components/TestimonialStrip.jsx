import styles from './TestimonialStrip.module.css'
import { useSanity } from '../hooks/useSanity'
import { TESTIMONIALS_QUERY } from '../lib/queries'

/**
 * A slow marquee of client quotes, under the featured case studies.
 *
 * Built on ClientStrip's mechanism deliberately rather than a second one: the
 * list is duplicated so the -50% translate loops with no seam, the second
 * pass is aria-hidden so screen readers do not hear every quote twice, the
 * window fades both edges, hover pauses, and prefers-reduced-motion stops it
 * dead. Quotes are long, so this runs slower than the client strip — 90s
 * against 48s — and it is the only difference that matters between them.
 *
 * ATTRIBUTION IS THE POINT, AND IT IS NOT READY. The quotes come from the
 * clientLanding documents in Sanity, which is where they were already
 * written. All three currently carry bracketed placeholders for the name —
 * "[Founder Name], Founder, [Company]" — so `usable` below drops any
 * attribution still in that state rather than printing brackets on the
 * homepage. An unattributed quote is weaker social proof than an attributed
 * one and arguably not proof at all, so until real names are filled in this
 * strip is showing what it will look like, not what it should say.
 *
 * Renders nothing at all if there are no quotes, rather than an empty band.
 */
const isPlaceholder = (s) => !s || /\[|\]/.test(s)

export default function TestimonialStrip() {
  const { data } = useSanity(TESTIMONIALS_QUERY)

  const items = (data ?? [])
    .filter(t => t?.quote)
    .map(t => ({
      quote: t.quote,
      attribution: isPlaceholder(t.attribution) ? null : t.attribution,
    }))

  if (!items.length) return null

  const pass = (hidden) => (
    <div className={styles.pass} aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <figure key={`${hidden ? 'b' : 'a'}-${i}`} className={styles.item}>
          <blockquote className={styles.quote}>{t.quote}</blockquote>
          {t.attribution && <figcaption className={styles.attribution}>{t.attribution}</figcaption>}
        </figure>
      ))}
    </div>
  )

  return (
    <div className={styles.strip}>
      <div className={styles.window}>
        <div className={styles.track}>
          {pass(false)}
          {pass(true)}
        </div>
      </div>
    </div>
  )
}
