import { useCallback, useEffect, useRef, useState } from 'react'
import rail from './DotNav.module.css'
import styles from './ScrollCards.module.css'

/**
 * TWO PANELS EITHER SIDE OF A RULE, PINNED WHILE THE COPY CHANGES BEHIND THEM.
 *
 * THE ARRANGEMENT. A track one screen tall per passage holds a single stage that
 * sticks to the top of the viewport for the whole of it. The left panel never
 * moves. The right panel never moves either — what changes is the copy inside
 * it, swapped as the scroll comes level with the next band of the track.
 * Scrolling therefore reads as turning pages rather than as travelling past four
 * sections, which is the point: the passages are a set of equals, not a sequence
 * you go through once.
 *
 * WHY AN IntersectionObserver AND NOT THE SCROLL POSITION. The first build read
 * the track's rect on a rAF-throttled scroll listener. It is a defensible way to
 * get the number, and it did not work: rAF is throttled to a standstill in a tab
 * that is not in front, so the callback never ran and the panel sat on its first
 * passage forever. An observer fires without it. Each band gets a sentinel, and
 * the root is squeezed to a line across the middle of the viewport —
 * `-50% 0px -50%` — so exactly one sentinel can intersect it and the one that
 * does is the passage you are level with. No tie to break, and no arithmetic
 * running on every scroll event.
 *
 * THE MIRROR IS scaleX(-1) on the panel's GROUND, not on the panel. Flipping the
 * panel flips everything in it, which for a panel holding a sentence means the
 * sentence comes out backwards. The ground is a ::before, so it mirrors and the
 * type does not — one asset still serves both sides, which is the point of the
 * arrangement when artwork lands.
 *
 * THE COPY COMES FROM About.jsx as PANELS, for the same reason WHAT_WE_ARE does:
 * this file owns the shape, the page owns the words. Pass an empty array and
 * there is nothing to pin, so the section renders nothing at all.
 */
/* A placeholder field may be a count or a list of captions. `slots` turns
   either into an array to map over, so the components below do not each have
   to ask which one they were given. */
const slots = (v) =>
  Array.isArray(v) ? v : Array.from({ length: v }, () => null)
/* ONE HUE PER MARK, in a fixed order — never generated, never shuffled.

   These are the dark-mode steps of a validated categorical palette, with one
   substitution: its green (#008300) measures 2.82:1 against the lightest of
   the three circle greys, under the 3:1 a mark needs to be seen at all, so it
   is stepped up to #2fa84f at 4.55:1. Every hue here clears 3:1 on all three
   circle backgrounds — measured, not judged.

   WHAT IS NOT CLAIMED: that nine hues are tellable apart from one another. On
   a ring every pair is on screen at once, and under all-pairs comparison a
   validated eight-hue palette only clears its separation floors for the first
   three. That gate governs colour that CARRIES MEANING — a series you must
   identify by its hue. Here the colour is decoration on a placeholder: no
   icon means anything by being violet rather than red, and nobody has to tell
   them apart to read the panel. Contrast is the requirement that does apply,
   and it is met. If these marks ever come to stand for something, this drops
   to three hues plus labels. */
const ICON_HUES = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
  '#2fa84f', // green — stepped up from #008300 for contrast
  '#9085e9', // violet
  '#e66767', // red
  '#df4ed6', // the page's own pink, for the ninth
]
/* THE DISCIPLINE MARKS for the ring of faces. Stroked rather than filled, all
   nine of them, so they read as one set — a filled glyph next to a stroked one
   looks like two icon libraries met on the same page. Each entry is a list of
   subpaths, because a camera is a body and a lens and cannot be one line.

   Drawn here for the same reason the call controls are: importing an icon
   library into a placeholder adds a dependency the real artwork will not need
   and that nobody will remember to take back out.

   THREE OF THESE WERE REDRAWN AFTER LOOKING AT THEM. A pen nib came out as a
   navigation arrow, a bar chart as the letter L, and a palette as a speech
   bubble — all three measured perfectly and all three drew the wrong thing.
   A path is not verifiable by inspecting the DOM; it has to be rendered and
   looked at. */
const WORK_ICONS = [
  ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'], // layout — design
  ['M3 8h3l1.5-2h9L18 8h3v11H3z', 'M12 16.5a3 3 0 100-6 3 3 0 000 6z'], // camera — film
  ['M9 8l-4 4 4 4', 'M15 8l4 4-4 4'],                       // code — build
  ['M3 20h18', 'M7 20v-6', 'M12 20v-11', 'M17 20v-4'],      // bars — analytics
  ['M4 10v4h3l7 4V6l-7 4H4z', 'M18 9a4 4 0 010 6'],         // megaphone — paid
  ['M4 20h4L20 8l-4-4L4 16z'],                              // pencil — writing
  ['M9 6l9 6-9 6z'],                                        // play — motion
  ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.3-4.3'], // search
  ['M3 5h18v11H3z', 'M9 20h6', 'M12 16v4'],                 // monitor — web
]
/* THE CALL CONTROLS. Drawn rather than pulled from lucide-react, which the site
   has: these are three fixed glyphs inside a placeholder, and importing an icon
   library into a stand-in graphic is a dependency the real artwork will not need
   and nobody will remember to take back out. */
const CALL_ICONS = {
  mic: 'M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm6-3a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.94V22h2v-3.06A8 8 0 0 0 20 11h-2z',
  cam: 'M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm14 2.5 4-2.5v12l-4-2.5z',
  end: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.58 3.6a1 1 0 0 1-.25 1l-2.23 2.2z',
}

/* THE DASHBOARD'S DATA. Written down, never generated: this page is
   prerendered, and a random number produced during the build is a different
   number in the browser, which React reports as a hydration mismatch.

   The figures are illustrative furniture for a placeholder graphic. They are
   deliberately generic — no client, no campaign, no outcome — because a
   dashboard on a studio's own page is one short step from reading as a claim
   about that studio's results. */
const TREND = [38, 44, 41, 52, 49, 58, 63, 60, 71, 68, 79, 86]
const BAR_HEIGHTS = [42, 66, 38, 78, 54, 88, 62]
const KPIS = [
  { label: 'Sessions', value: '128k' },
  { label: 'Engagement', value: '4.8%' },
  { label: 'Channels', value: '12' },
]

/* The trend as points on a 100x100 box. Inset on x so the end marker has room
   to sit on the last point instead of half off the edge, and on y so the peak
   is not welded to the top rule. */
const TREND_POINTS = TREND.map((v, i) => {
  const lo = Math.min(...TREND)
  const hi = Math.max(...TREND)
  return {
    x: 3 + (i / (TREND.length - 1)) * 94,
    y: 88 - ((v - lo) / (hi - lo)) * 76,
  }
})

const TREND_LINE = TREND_POINTS.map((p) => `${p.x},${p.y}`).join(' ')
const TREND_AREA = `${TREND_LINE} 97,100 3,100`

/* The rail tip names the passage by its statement, trimmed to the width the
   shared [data-tip] rule is built for. DotNav does the same with 42. */
const tipFor = (panel, i) =>
  (panel.line || `Panel ${i + 1}`).replace(/\s+/g, ' ').slice(0, 42)

/* `bleed`: the left-hand ground runs to the screen's edge and the top of the
   page — under the floating bar — and to the centre line, instead of sitting
   inset at 4:5 inside the page margin. The discipline pages ask for it;
   /studio keeps the inset card. The right-hand copy card, the centre rule
   and the dot rail stay exactly where they are. */
/* `bareFirst`: the first passage is a hero, not a card. Its copy sits
   bottom-left on the open ground of the right-hand half, with no panel
   behind it; the card ground comes in with the second passage and stays.
   The discipline pages ask for it with `bleed`, so the first screen is one
   full-bleed image and a headline, and the cards are what scrolling
   reveals. */
/* `titleFirst`: the first passage's headline is the page's <h1>. On /studio
   the StatementCard above the stage owns the h1; on the discipline pages
   the stage IS the hero and there is no other heading — and the prerender
   check refuses a page with none. Styled by class, so it sets like the
   paragraph it replaces. */
export default function ScrollCards({ panels = [], bleed = false, bareFirst = false, titleFirst = false }) {
  const trackRef = useRef(null)
  const bandsRef = useRef([])
  const litRef = useRef(new Set())
  const [active, setActive] = useState(0)
  const [inPin, setInPin] = useState(false)

  /* WHICH BAND IS THE VIEWPORT LEVEL WITH. The root is collapsed to a line
     across the middle of the screen, so two sentinels cannot both be in view and
     there is never a tie to break. */
  useEffect(() => {
    if (panels.length < 2) return

    const seen = bandsRef.current.filter(Boolean)
    if (!seen.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number(entry.target.dataset.index)
          if (entry.isIntersecting) {
            litRef.current.add(i)
            setActive((v) => (v === i ? v : i))
          } else {
            litRef.current.delete(i)
          }
        }
        /* No band on the centre line means the pin is behind or ahead of us,
           and a rail for a section you are not in points at nothing. */
        const lit = litRef.current.size > 0
        setInPin((v) => (v === lit ? v : lit))
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )

    seen.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [panels.length])

  /* Put the middle of the band on the middle of the screen — the same line the
     observer watches, so the dot the reader pressed is the dot that lights. */
  const jump = useCallback(
    (i) => {
      const track = trackRef.current
      if (!track) return
      const top = track.getBoundingClientRect().top + window.scrollY
      const band = track.offsetHeight / panels.length
      window.scrollTo({
        top: top + band * i + band / 2 - window.innerHeight / 2,
        behavior: 'smooth',
      })
    },
    [panels.length]
  )

  if (!panels.length) return null

  return (
    <section className={`${styles.section}${bleed ? ' ' + styles.sectionBleed : ''}`}>
      <div
        className={styles.track}
        ref={trackRef}
        /* The track's height is one screen per passage, so the count has to
           reach the stylesheet. A custom property rather than an inline height
           keeps the dvh unit and the media query that unpins this in the CSS. */
        style={{ '--panels': panels.length }}
      >
        <div className={styles.stage}>
          <div className={styles.split}>
            <div className={`${styles.column}${bleed ? ' ' + styles.columnBleed : ''}`}>
              {/* THE LEFT PANEL IS THE ONE THAT CARRIES THE PICTURE. Its shots are
                  stacked in the same place and crossfaded on the same stagger as
                  the copy opposite, so the pair changes as one thing.

                  A panel with neither a picture nor a shade renders no layer
                  at all and the card's own ground shows through, which is what
                  the whole section looked like before any of this. */}
              <div className={`${styles.card}${bleed ? ' ' + styles.cardBleed : ''}`}>
                {panels.map((panel, i) => {
                  const cls = `${styles.shot} ${i === active ? styles.shotOn : ''}`

                  /* A picture when there is one. */
                  if (panel.image) {
                    return (
                      <img
                        key={i}
                        className={cls}
                        src={panel.image}
                        alt=""
                        aria-hidden="true"
                        /* The first one is on screen the moment the pin starts,
                           so it is not deferred; the rest are. */
                        loading={i === 0 ? undefined : 'lazy'}
                        decoding="async"
                      />
                    )
                  }

                  /* A GRID OF PEOPLE ON A CALL, with the bar of controls
                     that makes it one. The squares alone were a wall of
                     windows; the mic, the camera and the red-phone button are
                     what say this is a call in progress rather than a contact
                     sheet. `call` is a count, or the names in each window. */
                  if (panel.call) {
                    return (
                      <div key={i} className={`${cls} ${styles.call}`} aria-hidden="true">
                        <div className={styles.callGrid}>
                          {slots(panel.call).map((name, t) => (
                            <span key={t} className={styles.tile}>
                              {name && <i className={styles.tileName}>{name}</i>}
                            </span>
                          ))}
                        </div>

                        <div className={styles.callBar}>
                          {['mic', 'cam', 'end'].map((k) => (
                            <span
                              key={k}
                              className={`${styles.ctrl} ${k === 'end' ? styles.ctrlEnd : ''}`}
                            >
                              <svg viewBox="0 0 24 24" focusable="false">
                                <path d={CALL_ICONS[k]} />
                              </svg>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  /* PROFILE PICTURES ARRANGED IN A RING. The third stand-in:
                     a group shown as a circle of people rather than as a line
                     of them or a wall of windows.

                     THE GEOMETRY IS SOLVED, NOT TYPED. Two things have to be
                     true at once — neighbours overlap by a fixed fraction, and
                     the outermost edge of the ring lands exactly on the edge of
                     the box. With n faces on a ring of radius R, neighbouring
                     centres are 2R·sin(π/n) apart, so the diameter that gives a
                     35% overlap is that over 0.65; requiring R + d/2 = 50%
                     then pins R, whatever the count and whatever the overlap.

                     Done here rather than in CSS because sin() in a stylesheet
                     is still newer than this site's floor, and the count is
                     already in JavaScript. `stack` is how many. */
                  if (panel.stack) {
                    const n = panel.stack
                    /* 0.22, AND THE NUMBER IS SET BY THE ICONS. Faces overlap
                       by this fraction, so a neighbour's near edge sits
                       d(0.5 - overlap) from the centre of the face behind it. A
                       centred icon at 44% of the face reaches 0.22d. At the 0.35
                       this started as, the edge landed at 0.15d — inside the
                       icon — and the circle in front sliced the glyph in half.
                       Anything at or under 0.28 clears it; 0.22 leaves margin. */
                    const overlap = 0.22
                    const R = 50 / (1 + Math.sin(Math.PI / n) / (1 - overlap))
                    const d = (2 * R * Math.sin(Math.PI / n)) / (1 - overlap)

                    return (
                      <div key={i} className={`${cls} ${styles.stack}`} aria-hidden="true">
                        <div className={styles.ring}>
                          {Array.from({ length: n }, (_, t) => {
                            /* Start at twelve o'clock and go clockwise, so an
                               odd count puts a face on top rather than a gap. */
                            const a = (t / n) * 2 * Math.PI - Math.PI / 2
                            return (
                              <span
                                key={t}
                                className={styles.face}
                                style={{
                                  width: `${d}%`,
                                  left: `${50 + R * Math.cos(a)}%`,
                                  top: `${50 + R * Math.sin(a)}%`,
                                }}
                              >
                                {/* Cycled, so the count stays free: a tenth face
                                    gets the first mark again rather than needing
                                    a tenth icon invented for it. */}
                                <svg
                                  viewBox="0 0 24 24"
                                  focusable="false"
                                  style={{ stroke: ICON_HUES[t % ICON_HUES.length] }}
                                >
                                  {WORK_ICONS[t % WORK_ICONS.length].map((path, q) => (
                                    <path key={q} d={path} />
                                  ))}
                                </svg>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }

                  /* WORK ON TOP, NUMBERS UNDERNEATH. The passage's own
                     sentence drawn — creatives who are also marketers — as a
                     grid of work over a working dashboard.

                     THE FORMS ARE CHOSEN, NOT DECORATED. Three headline
                     figures are stat tiles, because a single number is not a
                     chart. The trend over time is a line with its area under
                     it. The by-channel magnitudes are bars. One series, so no
                     legend: the only mark carrying colour is the trend, and
                     every label wears a text ink rather than the series hue.

                     NO HOVER LAYER, which is the one place this departs from
                     how a real chart ships. It is aria-hidden artwork behind a
                     pinned panel — a tooltip on a picture of a dashboard
                     invites a reader to interrogate numbers that do not mean
                     anything. `board` is a count, or the caption on each image. */
                  if (panel.board) {
                    const last = TREND_POINTS[TREND_POINTS.length - 1]

                    return (
                      <div key={i} className={`${cls} ${styles.board}`} aria-hidden="true">
                        <div className={styles.boardGrid}>
                          {slots(panel.board).map((name, t) => (
                            <span key={t} className={styles.thumb}>
                              {name && <i className={styles.thumbLabel}>{name}</i>}
                            </span>
                          ))}
                        </div>

                        <div className={styles.dash}>
                          <div className={styles.dashHead}>
                            <span className={styles.dashTitle}>Performance</span>
                            <span className={styles.dashRange}>Last 30 days</span>
                          </div>

                          <div className={styles.kpis}>
                            {KPIS.map((k) => (
                              <span key={k.label} className={styles.kpi}>
                                <b className={styles.kpiValue}>{k.value}</b>
                                <i className={styles.kpiLabel}>{k.label}</i>
                              </span>
                            ))}
                          </div>

                          <div className={styles.plots}>
                            <div className={styles.plot}>
                              {/* preserveAspectRatio none lets the plot fill a box
                                  of any shape; non-scaling-stroke then keeps the
                                  line 2px through that stretch rather than
                                  smearing it wider than it is tall. */}
                              <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
                                <polyline className={styles.area} points={TREND_AREA} />
                                <polyline className={styles.line} points={TREND_LINE} vectorEffect="non-scaling-stroke" />
                              </svg>
                              {/* The marker is HTML, not an SVG circle: under a
                                  non-uniform viewBox a circle comes out an oval. */}
                              <span
                                className={styles.marker}
                                style={{ left: `${last.x}%`, top: `${last.y}%` }}
                              />
                              <span className={styles.plotLabel}>Trend</span>
                            </div>

                            <div className={styles.plot}>
                              <div className={styles.chart}>
                                {BAR_HEIGHTS.map((h, b) => (
                                  <span key={b} className={styles.bar} style={{ height: `${h}%` }} />
                                ))}
                              </div>
                              <span className={styles.plotLabel}>By channel</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  /* A WALL OF LOGOS. The fifth stand-in, for the passage
                     that is a list of companies: cells with a wordmark sitting
                     in each, at the widths wordmarks actually vary between,
                     because a grid of identical blocks reads as a spreadsheet
                     and a grid of different ones reads as a logo wall.

                     The widths cycle in the stylesheet rather than being drawn
                     here, so nothing about this is random and the build and the
                     browser agree. `logos` is how many cells. */
                  if (panel.logos) {
                    return (
                      <div key={i} className={`${cls} ${styles.logos}`} aria-hidden="true">
                        {Array.from({ length: panel.logos }, (_, t) => (
                          <span key={t} className={styles.logo} />
                        ))}
                      </div>
                    )
                  }

                  /* A flat shade while there is not. It rides the same layer and
                     the same transition as a photograph would, so swapping the
                     placeholders out for artwork later is a change to the page's
                     data and to nothing else. */
                  if (panel.shade) {
                    return (
                      <div
                        key={i}
                        className={cls}
                        style={{ background: panel.shade }}
                        aria-hidden="true"
                      />
                    )
                  }

                  return null
                })}
              </div>
            </div>

            <div className={`${styles.column} ${styles.columnRight}${bleed ? ' ' + styles.columnRightBleed : ''}`}>
              <div className={`${styles.card} ${styles.cardMirrored}${bareFirst && active === 0 ? ' ' + styles.cardBare : ''}`}>
                {panels.map((panel, i) => (
                  <div
                    key={i}
                    className={`${styles.copy} ${i === active ? styles.copyOn : ''}`}
                    /* Hidden from the page as well as from the eye. Four
                       passages read aloud on top of each other is worse than
                       one, and opacity alone leaves all four in the tree. */
                    aria-hidden={i !== active}
                  >
                    {panel.label && <p className={styles.eyebrow}>{panel.label}</p>}
                    {panel.line && (titleFirst && i === 0
                      ? <h1 className={styles.line}>{panel.line}</h1>
                      : <p className={styles.line}>{panel.line}</p>)}
                    {panel.sub && <p className={styles.sub}>{panel.sub}</p>}
                    {/* Chip groups — a named row of short terms, for a
                        passage whose answer is a list (channels, industries,
                        stages) rather than a sentence. */}
                    {panel.groups?.length > 0 && (
                      <div className={styles.groups}>
                        {panel.groups.map(({ name, items }) => (
                          <div key={name} className={styles.group}>
                            <p className={styles.groupName}>{name}</p>
                            <ul className={styles.chips}>
                              {items.map((item) => <li key={item} className={styles.chip}>{item}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* THE SAME RAIL / AND THE SERVICE PAGES USE. Its stylesheet is
              imported rather than restated, so this rail cannot drift from
              those: same 20px target around a 6px mark, same pink at 1.5x for
              the one you are on, same tip out to the left.

              Rendered only inside the pin. DotNav is fixed and lives for the
              whole page because its sections do; these passages exist for four
              screens, and a rail hanging off the right edge of the footer would
              point at nothing.

              WHERE THIS PARTS COMPANY WITH DotNav: those dots are aria-hidden
              and unfocusable, because every section they reach is in the
              document already and reading the page reaches all of it. Three of
              these four passages are visibility:hidden until you come level
              with them, so these dots are a real route to content rather than a
              duplicate one, and they stay focusable and announced. */}
          {inPin && panels.length > 1 && (
            <nav className={rail.rail} aria-label="Passages">
              {panels.map((panel, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === active ? rail.dotOn : rail.dot}
                  data-tip={tipFor(panel, i)}
                  aria-current={i === active ? 'true' : undefined}
                  aria-label={panel.line || `Panel ${i + 1}`}
                  onClick={() => jump(i)}
                />
              ))}
            </nav>
          )}
        </div>

        {/* THE SENTINELS. One per passage, dividing the track into equal bands,
            with nothing in them and nothing drawn — they exist to be observed.
            aria-hidden and pointer-events:none, because a reader should never
            meet four empty boxes. */}
        <div className={styles.bands} aria-hidden="true">
          {panels.map((_, i) => (
            <div
              key={i}
              data-index={i}
              ref={(el) => {
                bandsRef.current[i] = el
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
