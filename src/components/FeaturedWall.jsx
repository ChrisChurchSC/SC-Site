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
/* Pixels per second. Slow enough that a card can be read as it goes by; the
   rail is proof, not a screensaver. */
const SPEED = 16

function useRotatingRail() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let last = 0
    let pos = 0

    /* PAUSING IS RE-DERIVED EVERY FRAME, never stored as a latch.

       Two earlier versions latched. The first counted holds and releases, and
       a single wheel gesture fires enough events to run the count up beyond
       what the release could bring back down. The second used the pointer's
       enter and leave events, which is worse and less obvious: this rail
       scrolls the page under a stationary cursor, so entering fires when the
       rail arrives beneath the pointer and leaving never fires when it moves
       away again. The rail stopped for good, four pixels in.

       So the pointer's position is the only thing tracked, and whether it is
       over the rail is a hit test against a rect read fresh each frame. It
       cannot go stale, because there is no state left to go stale. */
    let px = -1
    let py = -1
    let touching = false
    let quietUntil = 0

    const QUIET_MS = 900

    const onMove = e => { px = e.clientX; py = e.clientY }
    /* relatedTarget is null only when the pointer has left the document. */
    const onOut = e => { if (!e.relatedTarget) { px = -1; py = -1 } }
    const nudge = () => { quietUntil = performance.now() + QUIET_MS }
    const touchOn = () => { touching = true }
    const touchOff = () => { touching = false; quietUntil = performance.now() + QUIET_MS }

    const step = t => {
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0
      last = t

      const first = el.children[0]
      const second = el.children[1]
      const period = second ? second.offsetLeft - first.offsetLeft : 0

      const r = el.getBoundingClientRect()
      const over = px >= r.left && px <= r.right && py >= r.top && py <= r.bottom
      const paused = over || touching || t < quietUntil

      if (paused || !period) {
        /* Resync to wherever the reader left it, so resuming does not yank
           the rail back to where the loop had got to. */
        pos = el.scrollLeft
      } else {
        /* THE POSITION IS A FLOAT, WRITTEN OUT EACH FRAME, not incremented in
           place. At this speed a frame is a quarter of a pixel, and
           scrollLeft rounds in some engines — read-modify-write would throw
           the fraction away every frame and the rail would sit still.

           THE LOOP POINT IS MEASURED, not scrollWidth / 2. Two passes
           separated by the rail's own gap do not make the period exactly half
           the scroll width, and being half a gap out puts a visible jump in
           the seam. */
        pos += SPEED * dt
        if (pos >= period) pos -= period
        el.scrollLeft = pos
      }

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    el.addEventListener('wheel', nudge, { passive: true })
    el.addEventListener('touchstart', touchOn, { passive: true })
    el.addEventListener('touchend', touchOff, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      el.removeEventListener('wheel', nudge)
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
