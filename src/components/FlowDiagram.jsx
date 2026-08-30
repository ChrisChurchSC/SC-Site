import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import styles from './FlowDiagram.module.css'
import { repoFiles } from '../data/repo'

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
 * ONLY THE RIGHT COLUMN IS A PROP. It is that service's own pillars, from
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

/* A folder glyph, drawn rather than imported — the platform card on /v3
   draws its own for the same reason: one path is cheaper than a dependency
   for a shape this simple. */
function Folder() {
  return (
    <svg className={styles.folder} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 3.5h4l1.4 1.6h7.6v7.4a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Column({ label, groups, sync = false }) {
  return (
    <div className={styles.column} aria-label={label}>
      {groups.map(({ name, items }) => (
        <div key={name} className={styles.node}>
          <span className={styles.nodeRow}>
            <span className={styles.nodeName}>{name}</span>
            {sync && <RefreshCw className={styles.sync} aria-hidden="true" />}
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
export default function FlowDiagram({ centre, outputs }) {
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
    <div className={styles.wrap}>
      {/* The wash behind it, which the reference uses to tie the three
          columns into one object. Pink rather than orange, and low enough
          that the cards still read as sitting on the page. */}

      <div className={styles.flow} ref={flowRef}>
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

        <Column label="What goes in" groups={REPO_INPUTS} sync />

        <div className={styles.centre}>
          <div className={styles.centreHead}>
            <span className={styles.centreCrumbMuted}>Super Conscious</span>
            <span className={styles.centreSlash}>/</span>
            <span className={styles.centreName}>SC-Brand</span>
            <span className={styles.centrePrivate}>{centre}</span>
          </div>
          {/* The same chrome as the repository panel on /v3 — breadcrumb,
              tabs, then rows — so the thing in the middle of this diagram
              and the thing on the homepage are recognisably one product. */}
          <div className={styles.centreTabs}>
            <span className={styles.tabOn}>Files</span>
            <span className={styles.tab}>Pull requests</span>
            <span className={styles.tab}>Activity</span>
          </div>

          <ul className={styles.centreBody}>
            {repoFiles.map(({ folder, name, age }) => (
              <li key={folder + name} className={styles.row}>
                <Folder />
                <span className={styles.rowPath}>
                  <span className={styles.rowFolder}>{folder}/</span>{name}
                </span>
                <span className={styles.rowAge}>{age}</span>
              </li>
            ))}
          </ul>
        </div>

        <Column label="What comes out" groups={outputs} />
      </div>
    </div>
  )
}
