import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Check, LoaderCircle, RefreshCw } from 'lucide-react'

import styles from './FlowDiagram.module.css'
import RepoWindow from './RepoWindow'

/**
 * The hero diagram: what goes into the platform, and what comes out.
 *
 * THREE COLUMNS AND TWO ARROWS. Inputs on the left, the REPO in the middle,
 * outputs on the right — the shape of the reference, and the shape of the
 * actual claim: everything the brand is goes into one place, and everything
 * the brand makes comes out of it.
 *
 * The middle is the platform on every one of these pages, not the service.
 * A service page that put its own name there drew the inputs turning into
 * "Build" and Build turning into a brand, which is not what happens.
 *
 * WHICH FACE OF THE PLATFORM is a prop. /platform/measurement puts the
 * dashboard in the middle rather than the file browser, because on that page
 * what the numbers become on the way through IS the view. It is still the
 * platform in the middle — just the part of it that page is about.
 *
 * BOTH OUTER COLUMNS ARE PROPS NOW. The left defaults to the five that feed
 * the repo, which is right on every service page; /platform/measurement is
 * the one page where what arrives is results rather than the brand, so it
 * passes its own.
 *
 * ONLY THE RIGHT COLUMN WAS A PROP. It is that service's own pillars, from
 * services.js — Chris's names, unchanged. The left is the same five on every
 * page, so it lives in this file.
 *
 * THE LEFT COLUMN IS WHAT FEEDS THE REPO — memory, the library, the agents,
 * feedback and data. The middle is the repo. The right
 * is what that service produces from it.
 *
 * Decorative as a whole: the columns are labelled for a screen reader, and
 * the arrows are aria-hidden because "arrow" is not information.
 */
/* WHAT FEEDS THE REPO. The same five on every service page, so they live
   here rather than being passed in five times — the service changes what
   comes OUT, never what goes in.

   Two of these names differ from PLATFORM_PAGES in V3Nav, which has Reviews
   and Measurement where this has Feedback and Marketing Data. They are the
   same things called two ways, and worth reconciling once somebody decides
   which name is right. */
/* The items are what each input is made of, and they render through the same
   Column component as the right-hand pillars — one chip markup, so the two
   sides of the diagram cannot drift apart in style.

   These are wording, not sourced fact, and have not been signed off. */
const REPO_INPUTS = [
  { name: 'Memory', items: ['Marketing mix', 'Audience', 'Comms strategy'] },
  { name: 'Library', items: ['Logo', 'Type', 'Color', 'Photography'] },
  { name: 'Agents', items: ['Strategist', 'Writer', 'Designer', 'Analyst'] },
  { name: 'Feedback', items: ['Reviews', 'Approvals'] },
  { name: 'Data', items: ['Social', 'Search', 'Email', 'Paid', 'Web', 'CRM'] },
]


function Column({ label, groups, sync = false }) {
  return (
    <div className={styles.column} aria-label={label}>
      {groups.map(({ name, items, media, status }) => (
        <div key={name} className={`${styles.node}${media ? ' ' + styles.nodeMedia : ''}`}>
          {/* A thumbnail above the name. Grey while it is a placeholder, the
              image once there is one — the card's shape does not change when
              the real picture arrives. Decorative either way: the name beside
              it is the label. */}
          {media === 'placeholder' && (
            <span className={styles.bento} aria-hidden="true">
              <span className={styles.tile} />
              <span className={styles.tile} />
              <span className={styles.tile} />
              <span className={styles.tile} />
            </span>
          )}
          {media && media !== 'placeholder' && (
            <img className={styles.media} src={media} alt="" loading="lazy" />
          )}
          <span className={styles.nodeRow}>
            <span className={styles.nodeName}>{name}</span>
            {sync && <RefreshCw className={styles.sync} aria-hidden="true" />}
            {/* The state of the thing being made. Two only: it is done, or it
                is being worked on — a third would be a status board rather
                than a picture of work happening. */}
            {status === 'done' && (
              <span className={`${styles.status} ${styles.statusDone}`}>
                <Check className={styles.statusIcon} aria-hidden="true" />
                Completed
              </span>
            )}
            {status === 'running' && (
              <span className={`${styles.status} ${styles.statusRunning}`}>
                <LoaderCircle className={styles.statusSpin} aria-hidden="true" />
                Running
              </span>
            )}
          </span>
          {items && (
            <span className={styles.chips}>
              {items.map((i) => <span key={i} className={styles.chip}>{i}</span>)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* THE WIRES ARE MEASURED, NOT ASSUMED.
 *
 * Five cards on the left are the same height and evenly spaced, so their
 * centres could be worked out arithmetically. The four on the right are not
 * — a card with three chips is taller than one with two — so any formula
 * would put the curves near the cards rather than on them. The positions are
 * read from the DOM after layout and redrawn whenever anything resizes.
 *
 * They converge on ONE node per side. Five separate lines each ending in
 * their own dot said "five things, five connections"; a single junction says
 * everything meets in one place, which is the repository's whole argument.
 */
export default function FlowDiagram({
  centre,
  outputs,
  inputs = REPO_INPUTS,
  inputsLabel = 'What goes in',
  centreVisual = null,
}) {
  const flowRef = useRef(null)
  const [wires, setWires] = useState(null)

  const measure = useCallback(() => {
    const flow = flowRef.current
    if (!flow) return
    /* Skip the overlay. It is the first child of .flow, so reading
       flow.children directly made the SVG the left column, shifted the other
       two along, and drew twenty-four wires to a junction sixteen pixels off
       the left edge of the page. */
    const [left, middle, right] = [...flow.children].filter((el) => el.tagName !== "svg")
    if (!left || !middle || !right) return

    const base = flow.getBoundingClientRect()
    const mid = middle.getBoundingClientRect()
    const centreOf = (el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top - base.top + r.height / 2, left: r.left - base.left, right: r.right - base.left }
    }

    const repo = centreOf(middle)
    /* The junctions sit in the gap rather than on the panel's edge, so the
       curves have somewhere to straighten out before they land. */
    const inJunction = { x: repo.left - 16, y: repo.top }
    const outJunction = { x: repo.right + 16, y: repo.top }

    const path = (from, to) => {
      const dx = Math.abs(to.x - from.x)
      const c = Math.max(18, dx * 0.55)
      const dir = to.x > from.x ? 1 : -1
      return `M ${from.x} ${from.y} C ${from.x + c * dir} ${from.y}, ${to.x - c * dir} ${to.y}, ${to.x} ${to.y}`
    }

    const cards = (col) => [...col.children].map(centreOf)

    setWires({
      width: base.width,
      height: base.height,
      inJunction,
      outJunction,
      /* +6 / -6 so a wire starts just clear of the card's edge rather than
         under its border. */
      in: cards(left).map((c) => path({ x: c.right + 6, y: c.top }, inJunction)),
      out: cards(right).map((c) => path(outJunction, { x: c.left - 6, y: c.top })),
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const flow = flowRef.current
    if (!flow || typeof ResizeObserver === 'undefined') return

    /* Observes the flow and every card in it: the columns reflow when the
       page does, and a card can change height on its own when its chips
       wrap. */
    const ro = new ResizeObserver(measure)
    ro.observe(flow)
    for (const col of [...flow.children].filter((el) => el.tagName !== "svg")) {
      for (const card of col.children) ro.observe(card)
    }

    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, outputs])

  return (
    <div className={`${styles.wrap}${centreVisual ? ' ' + styles.wrapWide : ''}`}>
      {/* The wash behind it, which the reference uses to tie the three
          columns into one object. Pink rather than orange, and low enough
          that the cards still read as sitting on the page. */}

      <div className={`${styles.flow}${centreVisual ? ' ' + styles.flowWide : ''}`} ref={flowRef}>
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
            {/* Squares, not dots — offset by half their size so the wire meets
                the middle of the mark rather than its corner. */}
            <rect className={styles.junction} x={wires.inJunction.x - 3} y={wires.inJunction.y - 3} width="6" height="6" />
            <rect className={styles.junction} x={wires.outJunction.x - 3} y={wires.outJunction.y - 3} width="6" height="6" />
          </svg>
        )}

        <Column label={inputsLabel} groups={inputs} sync />

        {centreVisual ? (
          <div className={styles.centreSlot}>{centreVisual}</div>
        ) : (
          <RepoWindow label={centre} />
        )}

        <Column label="What comes out" groups={outputs} />
      </div>
    </div>
  )
}
