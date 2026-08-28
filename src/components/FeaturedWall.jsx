import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './FeaturedWall.module.css'
import { featuredCaseStudies } from '../data/featuredCaseStudies'

/**
 * Featured work: a rail of the six case studies, as text.
 *
 * THE SIX ARE THE LIST, NOT A FILTER. featuredCaseStudies already holds
 * exactly OpenText, iScribe, Arbitrum, Smashburger, World Within and
 * Wonderwerk, with a note per entry explaining why each is there. This reads
 * that file rather than picking its own set — an earlier version assembled
 * the rail from BLOCK_MAP, which meant the featured set and this rail could
 * disagree about what was featured.
 *
 * NO IMAGES. Asked for, and it suits the data: only one of the six has media
 * anywhere in the repo, so an image-led rail was always going to be one real
 * picture and five holes. What is deliberately NOT here is a large empty
 * frame where a picture will go — an empty box does not read as a promise,
 * it reads as a failure to load. The card is the name and the measures until
 * there is something to show.
 *
 * THE MEASURES ARE ABSENT ON PURPOSE. Every value in that file is '––' and
 * its header says in capitals not to ship invented ones: there is no source
 * for them in the repo or in Sanity. They are set at the size a real figure
 * would be, so the gap reads as a missing number rather than as a design that
 * never had one.
 *
 * IT ROTATES AND IT SCROLLS, and those are the same motion rather than two.
 * The auto-advance drives scrollLeft — the very property a finger or a
 * trackpad drives — so a reader who grabs it is not fighting a transform
 * that will snap back the moment they let go. That rules out the CSS
 * keyframe drift TestimonialWall uses: an animated transform and a native
 * scroll cannot share a position.
 *
 * THE POSITION IS TRACKED AS A FLOAT and written to scrollLeft each frame,
 * not incremented in place. At this speed a frame is under half a pixel, and
 * scrollLeft rounds in some engines — read-modify-write would throw the
 * fraction away every frame and the rail would sit still.
 *
 * THE LOOP POINT IS MEASURED, not computed from scrollWidth / 2. Two passes
 * separated by the rail's own gap do not make the period exactly half the
 * scroll width, and being a half-gap out puts a visible jump in the seam.
 * The distance between the two passes' offsetLeft is the period, exactly,
 * whatever the gaps do.
 *
 * THE SECOND PASS IS inert: it is the same six cards again, so its links
 * must not be tabbable and must not be read out. Hiding it from assistive
 * tech alone would leave six duplicate tab stops.
 *
 * LINKING is per-entry, from the same file: World Within and Wonderwerk have
 * pages, the other four do not, and those render unlinked rather than being
 * dropped — they are the featured set whether or not the write-up exists.
 */
/* How long a card sits still before the rail moves on. It rests far longer
   than it moves, because the reading happens at rest. */
const DWELL_MS = 3800

function useRotatingRail() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    /* IT STEPS, IT DOES NOT DRIFT — and the reason is the left edge.

       A continuous drift is never anywhere in particular: whenever you look
       at it, the leftmost card is sliced by the rail's edge, which sits on
       the page margin. On the right that reads as "there is more"; on the
       left it just reads as broken. Stepping by exactly one card and resting
       means scrollLeft is always a whole number of cards, so the card at the
       left edge is always a whole card.

       This also drops the per-frame loop. A carousel that moves every four
       seconds has no business running code sixty times a second. */
    let px = -1
    let py = -1
    let touching = false
    let timer = 0

    const onMove = e => { px = e.clientX; py = e.clientY }
    /* relatedTarget is null only when the pointer has left the document. */
    const onOut = e => { if (!e.relatedTarget) { px = -1; py = -1 } }
    const touchOn = () => { touching = true }
    const touchOff = () => { touching = false }

    const held = () => {
      if (touching) return true
      const r = el.getBoundingClientRect()
      return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom
    }

    const tick = () => {
      timer = setTimeout(tick, DWELL_MS)
      if (held()) return

      const pass = el.children[0]
      if (!pass || pass.children.length < 2) return

      /* One card plus one gap, measured rather than assumed — the card width
         is a clamp() and the gap is a token, so neither is a number this
         file can know. */
      const stride = pass.children[1].offsetLeft - pass.children[0].offsetLeft
      const period = el.children[1] ? el.children[1].offsetLeft - pass.offsetLeft : 0
      if (!stride || !period) return

      /* Round before adding, so a hand-scroll that stopped between two cards
         is corrected on the next step rather than carried forever. */
      let next = Math.round(el.scrollLeft / stride) * stride + stride

      if (next >= period) {
        /* Jump back exactly one period first, with no animation. The content
           a period back is identical, so nothing is seen to move — and the
           scroll that follows is a normal one-card step rather than a long
           rewind past every card. */
        el.scrollTo({ left: el.scrollLeft - period, behavior: 'auto' })
        next -= period
      }

      el.scrollTo({ left: next, behavior: 'smooth' })
    }

    timer = setTimeout(tick, DWELL_MS)
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    el.addEventListener('touchstart', touchOn, { passive: true })
    el.addEventListener('touchend', touchOff, { passive: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      el.removeEventListener('touchstart', touchOn)
      el.removeEventListener('touchend', touchOff)
    }
  }, [])

  return ref
}

export default function FeaturedWall({ eyebrow = '[ Featured Work ]' }) {
  const railRef = useRotatingRail()

  const cards = featuredCaseStudies.map(({ slug, name, type, href, stats }) => {
    const inner = (
      <>
        <span className={styles.type}>{type}</span>
        <span className={styles.name}>{name}</span>
        <span className={styles.measures}>
          {stats.map(({ value, label }) => (
            <span key={label} className={styles.measure}>
              <span className={styles.measureValue}>{value}</span>
              <span className={styles.measureLabel}>{label}</span>
            </span>
          ))}
        </span>
      </>
    )
    return href
      ? <NavLink key={slug} to={href} className={styles.card}>{inner}</NavLink>
      : <div key={slug} className={`${styles.card} ${styles.cardFlat}`}>{inner}</div>
  })

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>Work that had to earn its place.</h2>
      <NavLink to="/work" className={styles.explore}>Explore</NavLink>

      <div className={styles.rail} ref={railRef}>
        {[0, 1].map(pass => (
          <div key={pass} className={styles.pass} inert={pass ? '' : undefined}>
            {cards}
          </div>
        ))}
      </div>

    </section>
  )
}
