import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import styles from './PlatformFlow.module.css'

/**
 * A PLATFORM ALREADY IN PLACE, AND WHAT IT MAKES — the visual inside the
 * platform section.
 *
 * Not how the platform gets set up, and not how it gets updated: both of
 * those were tried here and both answered a question this page is not
 * asking. The page is selling the work, so the picture has to be the thing
 * standing up and producing.
 *
 * Left is the platform and the agents trained on it. Right is the everyday
 * output — copy, design, plans — with the actual artifacts as chips. The four
 * service pillars are deliberately NOT on the right: the hero diagram above
 * already shows those, and repeating them would answer a question the page
 * answered one screen ago.
 *
 * NO THIRD-PARTY MARKS. The reference format leans on vendor logos to say
 * "this plugs into your stack". We have neither those integrations nor
 * licensed marks for them, so every card is our own and every icon is a
 * drawn path.
 *
 * THE COPY HERE IS MINE and is not signed off.
 */

const LEFT = [
  {
    id: 'repo',
    name: 'Your platform, set up',
    note: 'Everything the brand is made of, in one structure.',
    tone: 'teal',
    chips: ['Positioning', 'Tone of voice', 'Logo & type', 'Audiences', 'Data'],
  },
  {
    id: 'agents',
    name: 'Agents trained on it',
    note: 'They draft out of the repo, and refuse to invent a claim.',
    tone: 'blue',
    chips: ['Strategist', 'Writer', 'Designer', 'Media'],
  },
]

/* WHAT IT MAKES — the everyday output, not the four service pillars. The
   hero diagram above already shows those, and a section that repeated them
   would be answering a question the page has just answered. */
const RIGHT = [
  {
    id: 'words',
    name: 'Copy',
    note: 'In your voice, off your own positioning.',
    tone: 'pink',
    chips: ['Posts', 'Emails', 'Landing page', 'Deck'],
  },
  {
    id: 'visuals',
    name: 'Design',
    note: 'On the system, rather than off-brand by accident.',
    tone: 'pink',
    chips: ['Key visual', 'Social set', 'Banners', 'Templates'],
  },
  {
    id: 'plans',
    name: 'Plans',
    note: 'Built on the data already in the repo.',
    tone: 'teal',
    chips: ['Campaign concept', 'Media plan', 'Audiences'],
  },
]

/* Drawn rather than imported: one path is cheaper than a dependency for a
   shape this simple, and these inherit currentColor so the tone tints them. */
const GLYPHS = {
  repo: 'M1.8 3.6h4l1.4 1.6h7v7.2a1 1 0 0 1-1 1h-10.4a1 1 0 0 1-1-1z',
  agents: 'M8 8.4a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2M3.2 13.4c0-2.4 2.1-3.9 4.8-3.9s4.8 1.5 4.8 3.9',
  words: 'M4.5 2.5h5L12.5 5.5v8h-8zM6.4 8.4h4M6.4 10.8h2.6',
  visuals: 'M2.6 2.6h4.6v4.6H2.6zM11.4 13.4a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8',
  plans: 'M3 13V8.4M8 13V3.4M13 13V6.4',
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
  const LABELS = ['in your voice', 'on the system', 'from your data']

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
