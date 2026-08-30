import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from './PlatformFlow.module.css'

/**
 * THE FEEDBACK LOOP — the visual inside the platform section.
 *
 * Something changes, an agent drafts it out of the repo, and the change is
 * proposed rather than published: a person approves it, it gets written
 * down, and it gets measured once it is live.
 *
 * Two other shapes were tried here and both were wrong for this page. One
 * drew how the platform gets SET UP; the other drew how it gets UPDATED,
 * step by step with a return leg. Both answered a question the page is not
 * asking.
 *
 * THE WIRES MATCH THE HERO: curved, pink, one stroke weight, converging on a
 * single square junction. They were dotted white elbows with arrowheads, and
 * against the hero's curves two screens up that read as two different
 * systems rather than one page.
 *
 * NO THIRD-PARTY MARKS. The reference format leans on vendor logos to say
 * "this plugs into your stack". We have neither those integrations nor
 * licensed marks for them, so every card is our own and every icon is a
 * drawn path.
 *
 * The right-hand copy is the existing PLATFORM_PAGES wording. The left-hand
 * cards and the connector labels are mine and are not signed off.
 */

const LEFT = [
  {
    id: 'change',
    name: 'Something changes',
    tone: 'pink',
    chips: ['New data', 'New asset', 'Feedback', 'A brief'],
  },
  {
    id: 'draft',
    name: 'An agent drafts it',
    note: 'In your voice, out of the repo. It will not invent a claim.',
    tone: 'blue',
  },
]

/* WHAT IT MAKES — the everyday output, not the four service pillars. The
   hero diagram above already shows those, and a section that repeated them
   would be answering a question the page has just answered. */
const RIGHT = [
  {
    id: 'reviews',
    name: 'Reviews',
    note: 'Every change is proposed, and a person approves it.',
    status: 'Nothing is live yet',
    tone: 'pink',
  },
  {
    id: 'memory',
    name: 'Memory',
    note: 'What was decided, what shipped, and why.',
    status: 'Decision logged',
    tone: 'teal',
  },
  {
    id: 'measurement',
    name: 'Measurement',
    note: 'What shipped, and what it moved.',
    status: 'Tracked',
    tone: 'blue',
  },
]

/* Drawn rather than imported: one path is cheaper than a dependency for a
   shape this simple, and these inherit currentColor so the tone tints them. */
const LABELS = ['proposed, not live', 'written down', 'measured once live']

const GLYPHS = {
  change: 'M8 2.5v11M2.5 8h11',
  draft: 'M3 13l2.5-.6 7-7a1.4 1.4 0 0 0-2-2l-7 7z',
  reviews: 'M3.5 8.5l3 3 6-6.5',
  memory: 'M3 4.5h10v8H3zM3 7.5h10',
  measurement: 'M3 13V8M8 13V4M13 13v-7',
}


function Glyph({ id }) {
  return (
    <svg className={styles.glyph} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={GLYPHS[id]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Card({ id, name, note, chips, status, tone }) {
  return (
    <div className={styles.group}>
      <div className={`${styles.card} ${styles[tone]}`}>
        <span className={styles.icon}><Glyph id={id} /></span>
        <span className={styles.text}>
          <span className={styles.name}>{name}</span>
          {note && <span className={styles.note}>{note}</span>}
        </span>
      </div>

      {chips && (
        <div className={styles.chips}>
          {chips.map((c) => <span key={c} className={styles.chip}>{c}</span>)}
          <span className={`${styles.chip} ${styles.chipMore}`}>…</span>
        </div>
      )}

      {status && (
        <div className={styles.status}>
          <span className={styles.statusPill}>
            <svg className={styles.tick} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.4 8.2l1.9 1.9 3.4-3.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {status}
          </span>
        </div>
      )}
    </div>
  )
}

/* The connectors are measured, for the same reason FlowDiagram's are: the
   cards are different heights, so any arithmetic would put the elbows near
   them rather than on them. */
export default function PlatformFlow() {
  const canvasRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const [wires, setWires] = useState(null)

  const measure = useCallback(() => {
    const canvas = canvasRef.current
    const left = leftRef.current
    const right = rightRef.current
    if (!canvas || !left || !right) return

    const base = canvas.getBoundingClientRect()
    const edge = (el, side) => {
      const r = el.getBoundingClientRect()
      return { x: (side === 'right' ? r.right : r.left) - base.left, y: r.top - base.top + r.height / 2 }
    }

    /* EVERY CARD MEETS AT ONE POINT, as the hero diagram does. Each card on
       the left curves out to the junction and each card on the right curves
       away from it, so the picture says "all of this, through one thing"
       rather than "these three, separately".

       The junction sits halfway across the gutter and on the average of the
       endpoints it serves, so no curve has to double back on itself. */
    const froms = [...left.children].map((el) => edge(el.firstElementChild, 'right'))
    const targets = [...right.children].map((el) => edge(el.firstElementChild, 'left'))
    if (!froms.length || !targets.length) return

    const ends = [...froms, ...targets]
    const junction = {
      x: Math.max(...froms.map((f) => f.x)) + (Math.min(...targets.map((t) => t.x)) - Math.max(...froms.map((f) => f.x))) / 2,
      y: ends.reduce((sum, e) => sum + e.y, 0) / ends.length,
    }

    /* Same curve as the hero's: control points pushed out along x, so the
       line leaves and arrives horizontally whatever the vertical distance. */
    const path = (from, to) => {
      const dx = Math.abs(to.x - from.x)
      const c = Math.max(18, dx * 0.55)
      const dir = to.x > from.x ? 1 : -1
      return `M ${from.x} ${from.y} C ${from.x + c * dir} ${from.y}, ${to.x - c * dir} ${to.y}, ${to.x} ${to.y}`
    }

    setWires({
      width: base.width,
      height: base.height,
      junction,
      targets,
      in: froms.map((f) => path({ x: f.x + 6, y: f.y }, junction)),
      out: targets.map((t) => path(junction, { x: t.x - 6, y: t.y })),
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(measure)
    ro.observe(canvas)
    for (const col of [leftRef.current, rightRef.current]) {
      if (col) for (const child of col.children) ro.observe(child)
    }
    return () => ro.disconnect()
  }, [measure])

  /* Kept short: these sit in a gutter, and a label that has to be measured
     against the layout is a label that will not survive the next breakpoint. */

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {wires && (
        <svg
          className={styles.wires}
          viewBox={`0 0 ${wires.width} ${wires.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[...wires.in, ...wires.out].map((d) => (
            <path key={d} className={styles.wire} d={d} />
          ))}

          {/* Square, offset by half its size so the curves meet the middle of
              the mark rather than its corner — same as the hero. */}
          <rect className={styles.junction} x={wires.junction.x - 3} y={wires.junction.y - 3} width="6" height="6" />

          {wires.targets.map((t, i) => (
            <text key={i} className={styles.label} textAnchor="end" x={t.x - 12} y={t.y - 9}>{LABELS[i]}</text>
          ))}
        </svg>
      )}

      <div className={styles.col} ref={leftRef}>
        {LEFT.map((c) => <Card key={c.id} {...c} />)}
      </div>

      <div className={styles.col} ref={rightRef}>
        {RIGHT.map((c) => <Card key={c.id} {...c} />)}
      </div>
    </div>
  )
}
