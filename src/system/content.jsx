import { useState } from 'react'
import s from './system.module.css'
import { Icon, Button, Avatar } from './primitives'
import { SERIES } from './charts'

/* Content — the blocks a page is assembled from once the controls are decided.
 *
 * Cards, people, headline numbers, the consent banner, and the texture fills.
 * Small pieces, but they are the ones every page reaches for, and having them
 * anywhere other than the package is how two pages end up with two cards.
 */


/* Status tones. Kept as a map rather than a prop so a caller cannot invent a
   sixth state that nothing else in the system knows how to draw. */
const STATUS_TONE = {
  Live: '',
  SHIPPED: '',
  HAVE: '',
  Review: 'statusNew',
  NEW: 'statusNew',
  PROTO: 'statusNew',
  Draft: 'statusGap',
  GAP: 'statusGap',
  Archived: 'statusGap',
}

/* The texture catalogue. Eight fills, all built from square pixels on an
   integer grid — a texture that antialiases is a texture that cannot be
   matched on a second surface. */
const TEXTURES = [
  ['sc-tex-d25', 'Dither 25', 'The lightest. Default for a large area.'],
  ['sc-tex-d50', 'Dither 50', 'The checkerboard. Half the grid, still barely there.'],
  ['sc-tex-d75', 'Dither 75', 'The heaviest that stays background.'],
  ['sc-tex-halftone', 'Halftone', 'Print-like dot screen. Good under an image.'],
  ['sc-tex-45', 'Stair 45°', 'Stepped diagonal, not a smooth rule.'],
  ['sc-tex-135', 'Stair 135°', 'Its mirror. Never butt the two together.'],
  ['sc-tex-scan', 'Scanline', 'Horizontal only. Reads as a screen.'],
  ['sc-tex-stipple', 'Stipple', 'Irregular grain. Placeholders and empty states.'],
]

export function StatusPill({ value }) {
  const tone = STATUS_TONE[value] ?? ''
  return (
    <span className={`${s.xStatus} ${tone ? s[tone] : ''}`}>
      {value}
    </span>
  )
}

/* One base. Every variant below is this plus content — which is exactly what
   the 58 blocks each re-declare from scratch. */
export function CardSurface({ children, link, className = '' }) {
  return (
    <div className={`${s.cardBase} ${link ? s.xCardLink : ''} ${className}`}>
      {children}
    </div>
  )
}

/* KPI row: figure, delta, and the shape behind it. A number with no trend is a
   number you can't act on, so the sparkline is part of the tile rather than a
   separate chart. */
export function KpiRow({ tiles }) {
  return (
    <div className={s.tiles}>
      {tiles.map(([label, fig, delta, good, d, series]) => {
        const max = Math.max(...d) * 1.2
        const pts = d.map((v, i) => `${i ? 'L' : 'M'}${i * 10},${26 - (v / max) * 22}`).join(' ')
        return (
          <div key={label} className={s.tile}>
            <span className={s.tileLabel}>{label}</span>
            <div className={s.tileMain}>
              <span className={s.tileFig}>{fig}</span>
              <svg viewBox="0 0 116 28" className={s.tileSpark} aria-hidden="true">
                <path d={pts} fill="none" stroke={SERIES[series]} strokeWidth="1.5" />
              </svg>
            </div>
            <span className={`${s.tileDelta} ${good ? s.tileDeltaGood : ''}`}>
              {delta} <span className={s.tileVs}>vs prior period</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function PersonCard({ people }) {
  return (
    <div className={s.xPeople}>
      {[['Chris Church', 'Founder, strategy'], ['Dana Cole', 'Design director'], ['Ravi Menon', 'Engineering']].map(
        ([name, role]) => (
          <div key={name} className={s.xPerson}>
            <Avatar name={name} size={36} />
            <span className={s.personText}>
              <span className={s.xPersonName}>{name}</span>
              <span className={s.personRole}>{role}</span>
            </span>
          </div>
        ),
      )}
    </div>
  )
}

/* Consent. The site loads GTM and GA4 and has no consent UI anywhere — this is
   the only component here with a compliance edge rather than a design one.
   Reject is a real button of equal weight, not a link buried in the text: a
   banner where refusing is harder than accepting is not consent. */
export function ConsentBanner({ onChoice }) {
  const [choice, setChoice] = useState(null)
  return (
    <div className={s.consentStage}>
      {choice ? (
        <span className={s.consentEcho}>
          Analytics {choice === 'accept' ? 'enabled' : 'stay off'} — stored, not asked again.
        </span>
      ) : (
        <div className={s.consent} role="region" aria-label="Cookie consent">
          <p className={s.consentText}>
            We use analytics to see which work gets read. Nothing is loaded until
            you choose.
          </p>
          <div className={s.consentActions}>
            <button type="button" className={s.xBtnOutline} onClick={() => setChoice('reject')}>Reject</button>
            <button type="button" className={s.xBtnSolid} onClick={() => setChoice('accept')}>Accept</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* One defs block for the whole page. Rendered once, referenced everywhere.
 *
 * Built from square pixels on an integer grid rather than strokes, and every
 * pattern renders with shape-rendering: crispEdges — antialiasing is what
 * makes a texture look like a gradient instead of a screen. The unit sizes are
 * deliberately coarse: at 2px the eye reads tone, at 4px it reads texture, and
 * texture is the whole point of the encoding.
 */
export function TextureDefs({ tiles = {} }) {
  /* Faint and fine. At 1px cells on a 4px grid the pattern is below the
     threshold where the eye resolves individual marks — it reads as a
     property of the surface rather than something drawn on it, which is the
     entire brief. Push the alpha past about 0.09 and it becomes a graphic
     again. */
  const ink = 'rgba(255, 255, 255, 0.07)'
  const px = (x, y, w = 1, h = 1) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={ink} />
  return (
    <svg width="0" height="0" className={s.defsOnly} aria-hidden="true" focusable="false">
      <defs>
        {/* Ordered dither on one 2px cell grid — one, two and three cells of
            four, so the three read as a genuine 25 / 50 / 75 progression.
            Keeping the grid identical across the three is what lets them be
            compared; different grids would read as different textures rather
            than different densities. */}
        <pattern id="sc-tex-d25" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 2, 2)}
        </pattern>
        <pattern id="sc-tex-d50" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 2, 2)}{px(2, 2, 2, 2)}
        </pattern>
        <pattern id="sc-tex-d75" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 2, 2)}{px(2, 2, 2, 2)}{px(2, 0, 2, 2)}
        </pattern>
        {/* Halftone: a square dot on an offset grid, no circles — circles
            antialias and the screen stops reading as a screen. */}
        <pattern id="sc-tex-halftone" width="6" height="6" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(1, 1, 2, 2)}{px(4, 4, 2, 2)}
        </pattern>
        {/* Stepped diagonals — a staircase of single pixels rather than a
            rotated line, so the diagonal keeps hard edges at every zoom. */}
        <pattern id="sc-tex-45" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 3)}{px(1, 2)}{px(2, 1)}{px(3, 0)}
        </pattern>
        <pattern id="sc-tex-135" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0)}{px(1, 1)}{px(2, 2)}{px(3, 3)}
        </pattern>
        <pattern id="sc-tex-scan" width="3" height="3" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 3, 1)}
        </pattern>
        {/* Fixed offsets, not random — a texture that changes between renders
            can't be matched on a second surface. */}
        <pattern id="sc-tex-stipple" width="8" height="8" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(1, 2)}{px(5, 0)}{px(3, 5)}{px(7, 6)}{px(0, 6)}{px(6, 3)}
        </pattern>

        {/* 90s desktop tiles, emitted straight from their bitmaps. */}
        {Object.entries(tiles).map(([id, rows]) => (
          <pattern key={id} id={id} width="8" height="8" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
            {rows.flatMap((row, y) =>
              row.split('').map((bit, x) => (bit === '1' ? px(x, y) : null)).filter(Boolean),
            )}
          </pattern>
        ))}
      </defs>
    </svg>
  )
}

export function TextureSwatches({ onCopy, copied, items = TEXTURES }) {
  return (
    <div className={s.texRow}>
      {items.map(([id, name, note]) => (
        <button
          key={id}
          type="button"
          className={s.texChip}
          onClick={() => onCopy(`url(#${id})`)}
          title={`Copy url(#${id})`}
        >
          <svg viewBox="0 0 100 52" className={s.texSwatch} aria-hidden="true">
            <rect width="100" height="52" fill="rgba(255,255,255,0.05)" />
            <rect width="100" height="52" fill={`url(#${id})`} />
          </svg>
          <span className={s.texName}>{name}</span>
          <span className={s.texId}>
            {copied === `url(#${id})` ? 'copied' : `#${id.replace(/^sc-(tex|tile)-/, '')}`}
          </span>
          <span className={s.texNote}>{note}</span>
        </button>
      ))}
    </div>
  )
}
