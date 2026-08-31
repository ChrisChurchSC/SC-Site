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
 * THERE IS ONE FALLBACK PER SERVICE, because the page around it argues
 * something different: Build's is about getting to market with the thing
 * built, Grow's about what happens after.
 *
 * THE FALLBACK QUOTES ARE INVENTED, ON PURPOSE, AND SAY SO. It is placeholder
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

const FALLBACKS = {
  default: {
    quote:
      'We go from idea to live in days, not weeks — and for the first time we ' +
      'can see which of it is actually working. Far less guessing, far more ' +
      'shipping.',
    attribution: '[Name], [Role], [Company]',
    placeholder: true,
  },
  measurement: {
    quote:
      'We can finally see which work earned the result, and the next brief ' +
      'starts from that rather than from an argument about it. Nothing gets ' +
      're-litigated every quarter.',
    attribution: '[Name], [Role], [Company]',
    placeholder: true,
  },
  repo: {
    quote:
      'Everything about the brand is in one place now, and I can see who changed ' +
      'what and why. We stopped having the same argument every quarter because ' +
      'the answer is written down.',
    attribution: '[Name], [Role], [Company]',
    placeholder: true,
  },
  memory: {
    quote:
      'The useful part is not what we decided, it is why. New people stop ' +
      'reopening things we settled a year ago, and the questions we never ' +
      'answered are written down instead of quietly forgotten.',
    attribution: '[Name], [Role], [Company]',
    placeholder: true,
  },
  platform: {
    quote:
      'We are putting out far more than we used to and it all still sounds ' +
      'like us. The difference is that nobody is waiting on me to check ' +
      'every piece of it any more.',
    attribution: '[Name], [Role], [Company]',
    placeholder: true,
  },
  grow: {
    quote:
      'We used to go quiet between launches. Now there is always something in ' +
      'market, it always sounds like us, and we can see which of it is worth ' +
      'doing again.',
    attribution: '[Name], [Role], [Company]',
    placeholder: true,
  },
}

export default function TestimonialCard({ variant = 'default' }) {
  const { data } = useSanity(TESTIMONIALS_QUERY)
  const live = (data ?? []).filter((t) => t?.quote)
  const fallback = FALLBACKS[variant] ?? FALLBACKS.default
  const { quote, attribution, avatar, placeholder } = live[0] ?? fallback
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
