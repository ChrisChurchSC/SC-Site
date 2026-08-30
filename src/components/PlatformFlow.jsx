import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from './PlatformFlow.module.css'

/**
 * HOW THE BRAND PLATFORM IS UPDATED — the visual inside the platform section.
 *
 * This draws the actual mechanism, not a generic before/after: you PULL the
 * brand into wherever you work, change it, and PUSH. A push opens a numbered
 * review and writes nothing live. A person merges it. Then the live brand
 * moves and everyone pulls to catch up — which is why this is a loop and not
 * a fan-out. The first version of this diagram had one arrow leaving and
 * three landing in parallel, which said the change ends somewhere; it does
 * not, it comes back round.
 *
 * NO THIRD-PARTY MARKS. The reference format leans on vendor logos to say
 * "this plugs into your stack". We have neither those integrations nor
 * licensed marks for them, so every card here is our own and every icon is a
 * drawn path.
 *
 * The steps and their copy follow the sync CLI's real behaviour — push opens
 * a review by default, --live is the escape hatch, merging is a person's job,
 * both directions refuse to run over a conflict. The WORDING is mine and is
 * not signed off; the BEHAVIOUR it describes is not invented.
 */

const LEFT = [
  {
    id: 'pull',
    name: 'Pull the brand',
    note: 'The whole platform, as files you can open.',
    tone: 'teal',
    chips: ['Strategy', 'Verbal', 'Visual', 'Agents', 'Data'],
  },
  {
    id: 'change',
    name: 'Change it',
    note: 'An agent drafts, or a person edits. Same files either way.',
    tone: 'blue',
    chips: ['An agent drafts', 'You edit', 'Claude proposes'],
  },
]

const RIGHT = [
  {
    id: 'review',
    name: 'Push opens a review',
    note: 'A numbered proposal holding what the files would become.',
    status: 'Nothing is live yet',
    tone: 'pink',
  },
  {
    id: 'merge',
    name: 'A person merges it',
    note: 'Approving is a person’s job. Nothing merges itself.',
    status: 'Approved',
    tone: 'pink',
  },
  {
    id: 'live',
    name: 'The live brand moves',
    note: 'Every agent, page and asset now reads the new version.',
    status: 'One version, everywhere',
    tone: 'teal',
  },
]

/* Drawn rather than imported: one path is cheaper than a dependency for a
   shape this simple, and these inherit currentColor so the tone tints them. */
const GLYPHS = {
  pull: 'M8 2.5v8M4.8 7.6L8 10.9l3.2-3.3M3 13.5h10',
  change: 'M3 13l2.5-.6 7-7a1.4 1.4 0 0 0-2-2l-7 7z',
  review: 'M3 4.5h10v8H3zM3 7.5h10M6 10.5h4',
  merge: 'M3.5 8.5l3 3 6-6.5',
  live: 'M8 2.6a5.4 5.4 0 1 1-5.4 5.4M8 5.4v2.9l2 1.2',
}

function Glyph({ id }) {
  return (
    <svg className={styles.glyph} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={GLYPHS[id]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Card({ id, name, note, chips, status, tone, step }) {
  return (
    <div className={styles.group}>
      <div className={`${styles.card} ${styles[tone]}`}>
        <span className={styles.icon}><Glyph id={id} /></span>
        <span className={styles.text}>
          <span className={styles.head}>
            <span className={styles.step}>{step}</span>
            <span className={styles.name}>{name}</span>
          </span>
          {note && <span className={styles.note}>{note}</span>}
        </span>
      </div>

      {chips && (
        <div className={styles.chips}>
          {chips.map((c) => <span key={c} className={styles.chip}>{c}</span>)}
        </div>
      )}

      {status && (
        <div className={styles.statusRow}>
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

/* The wires are measured from the DOM. The cards are different heights — one
   carries five chips, another a status pill — so any arithmetic would put the
   elbows near them rather than on them. */
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
    const box = (el) => {
      const r = el.getBoundingClientRect()
      return {
        left: r.left - base.left,
        right: r.right - base.left,
        top: r.top - base.top,
        bottom: r.bottom - base.top,
        mid: r.top - base.top + r.height / 2,
      }
    }

    const leftCards = [...left.children].map((g) => box(g.firstElementChild))
    const rightCards = [...right.children].map((g) => box(g.firstElementChild))
    if (leftCards.length < 2 || rightCards.length < 3) return

    /* Down the left column, across to the first review card, then down the
       right column. One route, in the order the steps happen. */
    const gutterX = leftCards[1].right + (rightCards[0].left - leftCards[1].right) * 0.34

    setWires({
      width: base.width,
      height: base.height,
      /* Pull -> Change, straight down the left column. */
      down: { x: leftCards[0].left + 22, from: leftCards[0].bottom, to: leftCards[1].top },
      /* Change -> the review, across the gutter. */
      cross: { fromX: leftCards[1].right, y: leftCards[1].mid, elbowX: gutterX, toX: rightCards[0].left, toY: rightCards[0].mid },
      /* Review -> merge -> live, down the right column. */
      steps: rightCards.slice(1).map((c, i) => ({
        x: rightCards[0].left + 22,
        from: rightCards[i].bottom,
        to: c.top,
      })),
      /* And back round: the live brand is what the next pull pulls. */
      loop: {
        fromX: rightCards[2].left + 22,
        fromY: rightCards[2].bottom,
        laneY: base.height - 10,
        laneX: 10,
        toY: leftCards[0].mid,
        toX: leftCards[0].left,
      },
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

  const arrow = (x, y, dir) =>
    dir === 'down'
      ? `M ${x} ${y} l -3.4 -5 h 6.8 z`
      : `M ${x} ${y} l -5 -3.4 v 6.8 z`

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {wires && (
        <svg
          className={styles.wires}
          viewBox={`0 0 ${wires.width} ${wires.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className={styles.wire} d={`M ${wires.down.x} ${wires.down.from} V ${wires.down.to - 7}`} />
          <path className={styles.headFill} d={arrow(wires.down.x, wires.down.to - 1, 'down')} />

          <path
            className={styles.wire}
            d={`M ${wires.cross.fromX} ${wires.cross.y} H ${wires.cross.elbowX} V ${wires.cross.toY} H ${wires.cross.toX - 7}`}
          />
          <path className={styles.headFill} d={arrow(wires.cross.toX - 1, wires.cross.toY, 'right')} />
          <text className={styles.label} textAnchor="end" x={wires.cross.toX - 12} y={wires.cross.toY - 9}>
            push
          </text>

          {wires.steps.map((s, i) => (
            <g key={i}>
              <path className={styles.wire} d={`M ${s.x} ${s.from} V ${s.to - 7}`} />
              <path className={styles.headFill} d={arrow(s.x, s.to - 1, 'down')} />
            </g>
          ))}

          {/* The return leg, dimmer than the rest: it is the same route run
              backwards, and drawn at full strength it competed with the step
              it points back at. */}
          <path
            className={`${styles.wire} ${styles.wireLoop}`}
            d={`M ${wires.loop.fromX} ${wires.loop.fromY} V ${wires.loop.laneY} H ${wires.loop.laneX} V ${wires.loop.toY} H ${wires.loop.toX - 7}`}
          />
          <path className={`${styles.headFill} ${styles.headLoop}`} d={arrow(wires.loop.toX - 1, wires.loop.toY, 'right')} />
          <text className={`${styles.label} ${styles.labelLoop}`} x={wires.loop.laneX + 14} y={wires.loop.laneY - 9}>
            pull — and everyone is on the new version
          </text>
        </svg>
      )}

      <div className={styles.col} ref={leftRef}>
        {LEFT.map((c, i) => <Card key={c.id} {...c} step={`0${i + 1}`} />)}
      </div>

      <div className={styles.col} ref={rightRef}>
        {RIGHT.map((c, i) => <Card key={c.id} {...c} step={`0${i + 3}`} />)}
      </div>
    </div>
  )
}
