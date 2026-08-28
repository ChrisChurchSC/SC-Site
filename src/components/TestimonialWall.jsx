import styles from './TestimonialWall.module.css'
import { useSanity } from '../hooks/useSanity'
import { TESTIMONIALS_QUERY } from '../lib/queries'

/**
 * The testimonial wall: rows of quote cards drifting past, opposite ways.
 *
 * THERE ARE THREE QUOTES. The reference has dozens, which is what lets its
 * rows run without repeating. Three do not fill two rows, so each row repeats
 * the set — the same device ClientStrip uses to loop without a seam, and the
 * duplicate pass is hidden from assistive tech so nothing is read out twice.
 *
 * The count is the honest limit here: this section will look like the
 * reference when there are more quotes, and no sooner. It is not a layout
 * problem.
 *
 * ATTRIBUTION follows the rule TestimonialStrip set and the rest of this page
 * keeps: all three attributions in Sanity are bracketed placeholders, so they
 * render on the dev server and are dropped from every build. A quote with no
 * name is weak proof; a made-up name is not proof at all.
 *
 * The quotes fall back to a static mirror when Sanity does not answer — see
 * TrustMosaic, which found that failing silently.
 */
const isPlaceholder = (s) => !s || /\[|\]/.test(s)

const FALLBACK = [
  {
    quote: "They've been our invisible production team for three years. They ship to our standards, communicate like part of the team, and never once tried to go around us to the client.",
    attribution: '[Creative Director], [Agency]',
  },
  {
    quote: 'Super Conscious built the brand, then stayed and built the product. Years in, they still feel like our team.',
    attribution: '[Founder Name], Founder, [Company]',
  },
  {
    quote: "They've become an extension of our marketing team. The content keeps shipping, the campaigns keep working, and the numbers keep moving.",
    attribution: '[Marketing Lead], [Company]',
  },
]

function Card({ quote, attribution }) {
  const person = isPlaceholder(attribution) ? null : attribution
  return (
    <figure className={styles.card}>
      <figcaption className={styles.head}>
        {/* No avatars: the field exists in Sanity and not one of the three
            has an image in it. A row of identical blank circles is worse
            than none. */}
        <span className={styles.who}>
          {person ?? (import.meta.env.DEV
            ? <span className={styles.whoPlaceholder}>{attribution}</span>
            : 'Client')}
        </span>
      </figcaption>
      <blockquote className={styles.quote}>{quote}</blockquote>
    </figure>
  )
}

export default function TestimonialWall({ eyebrow = '[ Proof ]' }) {
  const { data } = useSanity(TESTIMONIALS_QUERY)
  const live = (data ?? []).filter(t => t?.quote)
  const quotes = live.length ? live : FALLBACK

  /* Enough repeats that a row is wider than any screen it will run on, so the
     -50% loop never shows its end. */
  const row = [...quotes, ...quotes, ...quotes, ...quotes]

  const Row = ({ reverse }) => (
    <div className={styles.window}>
      <div className={`${styles.track}${reverse ? ' ' + styles.trackReverse : ''}`}>
        {[false, true].map(dup => (
          <div className={styles.pass} key={String(dup)} aria-hidden={dup || undefined}>
            {row.map((q, i) => <Card key={`${dup}-${i}`} {...q} />)}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>The people who worked with us.</h2>

      <div className={styles.rows}>
        <Row />
        {/* The second row runs the other way. One direction reads as a
            conveyor; two reading against each other reads as a field. */}
        <Row reverse />
      </div>
    </section>
  )
}
