import { useEffect, useId, useState } from 'react'

import { MARK_PATH } from './ScMark'
import styles from './SiteLoader.module.css'

/**
 * THE LOADING SCREEN: the mark draws itself on.
 *
 * A black sheet over the page with the mark in the middle. A white line
 * traces the mark's outline from one end to the other, the fill comes up
 * behind it, and the sheet fades — about a second and a half, once per full
 * page load.
 *
 * HOW THE DRAW WORKS. The mark is one path of filled bars, not a set of
 * strokes, so the visible mark is the path filled at its own weight, and
 * what is drawn is a MASK: the same path, stroked wide, revealed along its
 * length by a dash offset run from full to nothing. Wherever the mask's
 * stroke has arrived, the bars underneath show through; where it has not,
 * nothing does. So the line grows along the mark in the order its subpaths
 * are written, at the mark's own weight, one line — stroking the bars
 * directly drew each one as two edges, and widening the stroke to merge
 * them made the mark fat. pathLength="1" normalises the length, so the
 * dash figures are fractions of the whole. The reveal's motion is SMIL
 * rather than CSS, for the reason given beside it.
 *
 * ALL OF THE MOTION IS CSS: it starts the instant the prerendered HTML
 * paints, before React loads, and finishes on its own even if a script is
 * slow; React only removes the sheet afterwards.
 *
 * NOT A GIF. The mark is the site's own path, so it stays sharp on any
 * screen and changes with the brand file.
 *
 * ONCE PER LOAD, NOT PER ROUTE. Moving between pages is TransitionBar's
 * job. Under reduced motion nothing draws: the mark shows white for a beat
 * and the sheet fades.
 *
 * It was, in one afternoon (2026-09-02), a filling head, a spinning 3D
 * head, a marble one and a metal one. The draw is the one that reads at
 * the mark's size.
 */
const TOTAL_MS = 1900

export default function SiteLoader() {
  const [gone, setGone] = useState(false)
  const mask = `sc-loader-reveal-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const t = setTimeout(() => setGone(true), TOTAL_MS)
    return () => clearTimeout(t)
  }, [])

  if (gone) return null

  return (
    <div className={styles.sheet} aria-hidden="true">
      <svg className={styles.mark} viewBox="11 11 52 52" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="75" height="75">
            <path className={styles.reveal} d={MARK_PATH} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
              {/* SMIL, NOT CSS, FOR THE ONE THING THAT MOVES INSIDE THE MASK.
                  Browsers repaint a mask when its content changes through
                  the SVG engine, and do not reliably repaint it for a CSS
                  animation on that content — Safari in particular leaves
                  the mask as first painted, which here is nothing, and the
                  sheet fades over a blank screen. This runs in the SVG
                  engine, starts with the paint like the CSS does, and
                  freezes at the end. The spline is the same ease-in-out
                  the stylesheet used. */}
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                begin="0.12s"
                dur="1.1s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.45 0 0.25 1"
              />
            </path>
          </mask>
        </defs>
        <path className={styles.tube} d={MARK_PATH} mask={`url(#${mask})`} />
      </svg>
    </div>
  )
}
