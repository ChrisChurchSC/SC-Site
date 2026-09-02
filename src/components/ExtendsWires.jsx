import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from '../pages/PricingV3.module.css'

/* THE WIRES, in one place. They lived inside PricingV3.jsx; the Build
   service page draws the same lead-card-and-three composition now
   (2026-09-02), so the diagram that ties it together is shared. Its
   stylesheet is still the pricing page's. */
/**
 * THE WIRES FROM THE PLATFORM DOWN TO WHAT IT EXTENDS TO.
 *
 * WHY MEASURED RATHER THAN DRAWN. The three cards are not a fixed width —
 * the grid is auto-fit, so they reflow to two-up and one-up as the page
 * narrows, and their tops move when a deliverable list wraps. Any hard-coded
 * path would be right at one width and wrong at every other. The positions
 * are read after layout and redrawn whenever the box or a card resizes.
 *
 * ONE JUNCTION, not three lines leaving the card. Three separate wires would
 * say the platform has three outputs; a single square everything passes
 * through says they are the same thing arriving in three places, which is
 * what "and everything it extends to" is claiming.
 *
 * IT FINDS ITS ENDS BY DATA ATTRIBUTE rather than by child index. The label
 * sits between the card and the grid, and an index would have counted it.
 */
export default function ExtendsWires({ count }) {
  const svgRef = useRef(null)
  const [wires, setWires] = useState(null)

  /* IT HOLDS ITS OWN REF AND WORKS UP TO THE BOX, rather than being handed a
     ref to the parent. React attaches a host element's ref in the same commit
     phase that runs its children's layout effects, children first — so a ref
     on the wrapping div is still null when this component measures, the first
     pass bails, and nothing in the deps ever changes to make it try again.
     That is exactly what happened here: no wires, no error. The SVG is always
     mounted so its own ref is attached before its own effect, and the box is
     its parent. */
  const measure = useCallback(() => {
    const box = svgRef.current?.parentElement
    if (!box) return
    const lead = box.querySelector('[data-lead-card]')
    const grid = box.querySelector('[data-extends-grid]')
    const hub = box.querySelector('[data-extends-label]')
    if (!lead || !grid || !hub) return

    const base = box.getBoundingClientRect()
    const l = lead.getBoundingClientRect()
    const h = hub.getBoundingClientRect()
    const cards = [...grid.children].map((c) => c.getBoundingClientRect())
    if (!cards.length || !base.width) return

    /* +6 / -6 so a wire starts and lands just clear of a border rather than
       under it — the same clearance the Build diagram uses. */
    const from = { x: base.width / 2, y: l.bottom - base.top + 6 }
    const landing = Math.min(...cards.map((c) => c.top)) - base.top - 6

    /* THE LABEL IS THE HUB. Everything used to converge on a drawn square in
       the middle of the gap; the card now sits exactly there, so the stem
       lands on its top edge and the fan leaves its bottom one. Measured off
       the element rather than centred arithmetically, because the card is
       sized by its own text. */
    const hubX = h.left - base.left + h.width / 2
    const hubTop = { x: hubX, y: h.top - base.top - 6 }
    const hubBottom = { x: hubX, y: h.bottom - base.top + 6 }

    const curve = (a, b) => {
      const c = Math.max(14, Math.abs(b.y - a.y) * 0.65)
      return `M ${a.x} ${a.y} C ${a.x} ${a.y + c}, ${b.x} ${b.y - c}, ${b.x} ${b.y}`
    }

    const landings = cards.map((c) => ({ x: c.left - base.left + c.width / 2, y: landing }))

    /* NOTHING TO DRAW IN ONE COLUMN. On a phone the grid collapses and every
       card shares the same centre, so the fan becomes three straight lines
       down the same axis — two of them behind the cards, and three nodes
       stacked on one point, which reads as a rendering fault rather than as
       a diagram. Detected from the measured positions rather than from a
       breakpoint, because the grid is auto-fit and collapses at whatever
       width the cards stop fitting. The stacked cards are already in reading
       order, which is what the wires were saying. */
    const oneColumn = landings.every((l) => Math.abs(l.x - landings[0].x) < 1)
    if (oneColumn) {
      setWires(null)
      return
    }

    setWires({
      width: base.width,
      height: base.height,
      stem: curve(from, hubTop),
      out: landings.map((to) => curve(hubBottom, to)),
      /* A node on every card the wire touches, plus the one it leaves.
         Nothing is drawn on the label: it is the meeting point rather than
         one of the things being connected, and it is a card now, so a mark
         on it would read as a fifth. */
      ends: [from, ...landings],
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const box = svgRef.current?.parentElement
    if (!box || typeof ResizeObserver === 'undefined') return

    /* Observes the box, the lead card and every extension card: the grid
       reflows when the page does, and a card changes height on its own when
       its chips wrap. */
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    const lead = box.querySelector('[data-lead-card]')
    if (lead) ro.observe(lead)
    const grid = box.querySelector('[data-extends-grid]')
    if (grid) for (const card of grid.children) ro.observe(card)

    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, count])

  return (
    <svg
      ref={svgRef}
      className={styles.wires}
      viewBox={wires ? `0 0 ${wires.width} ${wires.height}` : undefined}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {wires && <path className={styles.wire} d={wires.stem} />}
      {wires?.out.map((d) => (
        <path key={d} className={styles.wire} d={d} />
      ))}
      {/* Squares, not dots — offset by half their size so a wire meets the
          middle of the mark rather than its corner. */}
      {(wires?.ends ?? []).map((n) => (
        <rect
          key={`${n.x},${n.y}`}
          className={styles.junction}
          x={n.x - 3}
          y={n.y - 3}
          width="6"
          height="6"
        />
      ))}
    </svg>
  )
}
