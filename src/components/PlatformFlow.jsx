import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from './PlatformFlow.module.css'

/**
 * THE REVIEW LOOP, drawn as a canvas — the visual inside the platform
 * section's panel.
 *
 * The format is the reference Chris gave: grouped cards on a dotted field,
 * sub-chips inside the groups, and dotted connectors carrying a label rather
 * than arrows on their own.
 *
 * NO THIRD-PARTY MARKS. The reference leans on vendor logos — a CRM, Slack —
 * to say "this plugs into your stack". We do not have those integrations and
 * we do not have licensed marks for them, so drawing them would claim two
 * things that are not true. Every card here is our own flow, and the icons
 * are drawn shapes.
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

/* Drawn rather than imported, same reasoning as the folder glyph in
   FlowDiagram: one path is cheaper than a dependency for a shape this
   simple, and these inherit currentColor so the tone classes tint them. */
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

    /* One spine down the gutter, with an elbow into each card on the right.
       The last left card is the one everything flows from, so the spine
       starts at its edge. */
    const from = edge(left.lastElementChild, 'right')
    const targets = [...right.children].map((el) => edge(el.firstElementChild, 'left'))
    const spineX = from.x + (targets[0].x - from.x) * 0.32

    return setWires({
      width: base.width,
      height: base.height,
      from,
      spineX,
      targets,
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
  const LABELS = ['proposed, not live', 'written down', 'measured once live']

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {wires && (
        <svg
          className={styles.wires}
          viewBox={`0 0 ${wires.width} ${wires.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Out of the last left card, into the spine. */}
          <path className={styles.wire} d={`M ${wires.from.x} ${wires.from.y} H ${wires.spineX}`} />
          {wires.targets.map((t, i) => (
            <g key={i}>
              <path
                className={styles.wire}
                d={`M ${wires.spineX} ${wires.from.y} V ${t.y} H ${t.x - 7}`}
              />
              <path className={styles.head} d={`M ${t.x - 7} ${t.y} l -5 -3.4 v 6.8 z`} />
              <text className={styles.label} textAnchor="end" x={t.x - 12} y={t.y - 9}>{LABELS[i]}</text>
            </g>
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
