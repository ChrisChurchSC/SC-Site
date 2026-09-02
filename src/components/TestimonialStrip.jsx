import styles from './TestimonialStrip.module.css'
import { useSanity } from '../hooks/useSanity'
import { TESTIMONIALS_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'

/**
 * A slow marquee of client quotes, above the featured case studies.
 *
 * Built on ClientStrip's mechanism deliberately rather than a second one: the
 * list is duplicated so the -50% translate loops with no seam, the second
 * pass is aria-hidden so screen readers do not hear every quote twice, the
 * window fades both edges, hover pauses, and prefers-reduced-motion stops it
 * dead. Quotes are long, so this runs slower than the client strip — 90s
 * against 48s — and it is the only difference that matters between them.
 *
 * ATTRIBUTION IS THE POINT, AND IT IS NOT READY. Quotes come from the
 * clientLanding documents in Sanity, where they were already written. All
 * three currently carry bracketed placeholders for the name — "[Founder
 * Name], Founder, [Company]" — and none has an avatar, because the field
 * did not exist until this change added it.
 *
 * So a bracketed attribution is dropped from any BUILD rather than printed
 * on the homepage, and the avatar slot renders a neutral mark when there is
 * no image. Nothing here invents a name or a face: an unattributed quote is
 * weak social proof, but a fabricated attribution is not proof at all.
 *
 * On the dev server those placeholders DO render, dimmed and italic, so the
 * byline can be reviewed with something in it. import.meta.env.DEV is false
 * in every build, so this cannot reach production by being forgotten.
 *
 * Fill in testimonialAttribution and testimonialAvatar in the Studio and
 * both appear for real, with no code change.
 *
 * Renders nothing if there are no quotes, rather than an empty band.
 */
const isPlaceholder = (s) => !s || /\[|\]/.test(s)

/** "Stuart Friedman, Founder, Big Buoy" -> { name, role } */
function splitAttribution(attribution) {
  if (!attribution) return null
  const i = attribution.indexOf(',')
  if (i === -1) return { name: attribution.trim(), role: null }
  return {
    name: attribution.slice(0, i).trim(),
    role: attribution.slice(i + 1).trim() || null,
  }
}

export default function TestimonialStrip() {
  const { data } = useSanity(TESTIMONIALS_QUERY)

  const items = (data ?? [])
    .filter(t => t?.quote)
    .map(t => ({
      quote: t.quote,
      person: isPlaceholder(t.attribution)
        // Placeholders render on the dev server only, so the byline can be
        // reviewed with something in it. import.meta.env.DEV is false in
        // every build, so a deploy shows the quote alone rather than
        // "[Founder Name]" presented as a real client.
        ? (import.meta.env.DEV ? splitAttribution(t.attribution) : null)
        : splitAttribution(t.attribution),
      placeholder: isPlaceholder(t.attribution),
      avatar: t.avatar || null,
    }))

  if (!items.length) return null

  const pass = (hidden) => (
    <div className={styles.pass} aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <figure key={`${hidden ? 'b' : 'a'}-${i}`} className={styles.item}>
          <blockquote className={styles.quote}>{t.quote}</blockquote>
          <figcaption className={styles.byline}>
            {t.avatar
              ? <img className={styles.avatar} src={sanityImg(t.avatar, { w: 96 })} alt="" loading="lazy" />
              /* Not initials: without a real name there is nothing to take
                 them from, and a made-up monogram would read as a person. */
              : <span className={styles.avatarEmpty} aria-hidden="true" />}
            {t.person && (
              <span className={`${styles.person}${t.placeholder ? ' ' + styles.personPlaceholder : ''}`}>
                <span className={styles.personName}>{t.person.name}</span>
                {t.person.role && <span className={styles.personRole}>{t.person.role}</span>}
              </span>
            )}
          </figcaption>
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
