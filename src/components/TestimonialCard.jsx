import { User } from 'lucide-react'

import styles from './TestimonialCard.module.css'
import { useSanity } from '../hooks/useSanity'
import { TESTIMONIALS_QUERY } from '../lib/queries'

/**
 * ONE TESTIMONIAL, ON A WIDE PALE CARD — the format Chris referenced.
 *
 * It reads the same source TestimonialWall does: Sanity first, and the three
 * written quotes as the fallback. Nothing is written here, so the quote on
 * this card cannot say something the wall does not.
 *
 * THE FALLBACK QUOTE IS INVENTED, ON PURPOSE, AND SAYS SO. It is placeholder
 * copy for the design and carries a visible "Placeholder copy" tag plus a
 * bracketed attribution, which every testimonial component here already
 * treats as "not a real person". A live quote from Sanity replaces it and
 * the tag goes with it. There is no figure in it: a number in a client's
 * mouth is a performance claim, and being a placeholder does not make one
 * less false.
 *
 * NO CLIENT LOGO, AND NO STOCK FACE. The reference card is anchored by a
 * client logo, and the repo has no client logo files at all — see
 * src/data/clientLogos.js. The avatar is the real photo when Sanity carries
 * one (testimonialAvatar is already on clientLanding and the query returns
 * it) and a drawn glyph when it does not, which is what TestimonialWall
 * does. A stock portrait would be a picture of somebody who did not say
 * this.
 *
 * It wants a real quote from a named person before it goes in front of a
 * customer. Until then the tag is what stops it reading as one.
 */
const isPlaceholder = (s) => !s || /\[|\]/.test(s)

const FALLBACK = {
  quote:
    'We go from idea to live in days, not weeks — and for the first time we ' +
    'can see which of it is actually working. Far less guessing, far more ' +
    'shipping.',
  attribution: '[Name], [Role], [Company]',
  placeholder: true,
}

export default function TestimonialCard() {
  const { data } = useSanity(TESTIMONIALS_QUERY)
  const live = (data ?? []).filter((t) => t?.quote)
  const { quote, attribution, avatar, placeholder } = live[0] ?? FALLBACK
  const person = isPlaceholder(attribution) ? null : attribution

  return (
    <section className={styles.section}>
      <figure className={styles.card}>
        {placeholder && <p className={styles.tag}>Placeholder copy</p>}

        <blockquote className={styles.quote}>“{quote}”</blockquote>

        <figcaption className={styles.foot}>
          <span className={styles.avatar}>
            {avatar
              ? <img src={avatar} alt="" className={styles.avatarImg} loading="lazy" />
              : <User size={18} strokeWidth={1.5} />}
          </span>

          {person ? (
            <span className={styles.who}>{person}</span>
          ) : import.meta.env.DEV ? (
            <span className={`${styles.who} ${styles.whoPlaceholder}`}>{attribution}</span>
          ) : (
            <span className={styles.who}>Client</span>
          )}
        </figcaption>
      </figure>
    </section>
  )
}
