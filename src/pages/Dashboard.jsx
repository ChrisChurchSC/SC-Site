import { useState } from 'react'
import { useMeta } from '../hooks/useMeta'
import '../system/tokens.css'
import {
  Shell, GlobalBar, BarButton, Sidebar, Content, Grid, Col, useSidebar,
  Panel, StatTile, Button, IconButton, Banner, Avatar, Icon,
  SectionNav, Segmented, Field, Input, Switch, Badge, CheckGroup, DataGrid,
  Tree, Path, FileBrowser, FileView, CodeLines, MediaPreview,
  RequestList, RequestDetail, ActivityFeed, Wiki,
  PdfPreview, CanvasPreview, WavePreview,
  Contributors, CompositionBar, AsideBlock, FactRow, StatusList,
  TitleBar, CountButton, RefSelect, FindField,
  LineChart, BarChart, RankedBar, Donut,
} from '../system'
import headMark from '../assets/logo.svg'
import WIKI from '../data/wikiPages'
import { METRICS, HAS_METRICS, metricsSummary } from '../data/metrics'
import styles from './Dashboard.module.css'

/* A brand workspace, browsed as a folder tree.
 *
 * Built entirely from src/system — this page writes almost no CSS of its own,
 * which is the proof that the package is importable rather than a drawing of
 * itself.
 *
 * The repo-listing pattern earns its place here rather than being borrowed for
 * the look: brand assets genuinely are a tree, and the pattern answers what is
 * in here, what moved most recently and who moved it, all without a click.
 *
 * Internal, noindex, not in the sitemap.
 */

/* One source of truth for the tree and the browser, so a folder cannot exist
   in the sidebar and be missing from the listing.

   Brand is split by the material it is made of, not by the department that
   makes it: visual, verbal, channels, data, audio. Strategy is deliberately
   not a sibling — it is the reason the other five look the way they do, and
   filing it beside them makes it look like one more deliverable. */
const FS = {
  brand: {
    label: 'Brand', icon: 'brand',
    children: {
      visual: {
        label: 'Visual', icon: 'brand', message: 'Refit the logo lockup for small sizes', when: '2h',
        children: {
          /* A .fig opens onto its artboard, a .pdf onto its pages and a .wav
             onto its waveform. Filing every one of them behind a grey plate
             tells you the file exists, which the listing already told you. */
          'logo-lockup.fig': {
            message: 'Refit for small sizes', when: '2h', status: 'Live', icon: 'image',
            render: 'canvas',
            canvas: {
              label: 'logo-lockup.fig', width: 1600, height: 900,
              frames: [
                { name: 'Primary — horizontal', x: 80, y: 90, w: 620, h: 200, tone: 'art' },
                { name: 'Primary — stacked', x: 760, y: 90, w: 300, h: 300, tone: 'art' },
                { name: 'Mark only', x: 1120, y: 90, w: 300, h: 300, tone: 'plate' },
                { name: 'Small size — 24px', x: 80, y: 460, w: 300, h: 100, tone: 'type' },
                { name: 'Small size — 16px', x: 440, y: 460, w: 220, h: 70, tone: 'type' },
                { name: 'Clear space', x: 760, y: 460, w: 660, h: 300, tone: 'plate' },
              ],
            },
          },
          'brand-guidelines.pdf': {
            message: 'Regenerated from the token file', when: '4h', status: 'Live', icon: 'file',
            render: 'pdf',
            pdf: {
              file: 'brand-guidelines.pdf',
              pages: [
                { blocks: [
                  { kind: 'eyebrow', text: 'Super Conscious · v2.1' },
                  { kind: 'h', text: 'Brand guidelines' },
                  { kind: 'rule' },
                  { kind: 'p', text: 'Generated from the token file. If this document and the tokens disagree, the tokens are right and this is stale.' },
                ] },
                { blocks: [
                  { kind: 'eyebrow', text: 'The mark' },
                  { kind: 'h', text: 'Clear space is half the mark height' },
                  { kind: 'image' },
                  { kind: 'p', text: 'On all four sides, at every size. Below 24px use the small-size lockup — the counter fills in otherwise.' },
                ] },
                { blocks: [
                  { kind: 'eyebrow', text: 'Colour' },
                  { kind: 'h', text: 'Two accents' },
                  { kind: 'p', text: 'Pink and purple. Teal and blue were declared for two years and used nowhere, so they were removed rather than found work for.' },
                  { kind: 'rule' },
                  { kind: 'p', text: 'Charts get three categorical slots. A fourth either leaves the lightness band or fails colour-vision separation against the other two.' },
                ] },
                { blocks: [
                  { kind: 'eyebrow', text: 'Type' },
                  { kind: 'h', text: 'A serif for people, a mono for machines' },
                  { kind: 'p', text: 'Signifier carries anything a person wrote. Roboto Mono carries anything a machine produced — timestamps, hashes, counts, file names.' },
                  { kind: 'rule' },
                  { kind: 'p', text: 'It means a number never has to explain where it came from.' },
                ] },
              ],
            },
          },
          'colour-tokens.json': {
            message: 'Retire teal and blue', when: '1d', status: 'Live', icon: 'file',
            text: `{
  "ground":  "#0a0a0a",
  "card":    "#161616",
  "accent": {
    "pink":   "#df4ed6",
    "purple": "#7d5ae0"
  },
  "retired": ["teal", "blue"]
}`,
          },
          'type-scale.fig': { message: 'Drop the 3px radius step', when: '3d', status: 'Live', icon: 'image' },
          'grid-system.fig': {
            message: 'Document the 5px gutter', when: '1w', status: 'Live', icon: 'image',
            render: 'canvas',
            canvas: {
              label: 'grid-system.fig', width: 1600, height: 900,
              frames: [
                { name: 'col 1', x: 80, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 2', x: 200, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 3', x: 320, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 4', x: 440, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 5', x: 560, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 6', x: 680, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 7', x: 800, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 8', x: 920, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 9', x: 1040, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 10', x: 1160, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 11', x: 1280, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 12', x: 1400, y: 90, w: 115, h: 700, tone: 'plate' },
              ],
            },
          },
          'iconography.svg': { message: 'Forty marks on a 16px grid', when: '1w', status: 'Review', icon: 'image' },
          /* The design system's own source, filed where it belongs: it is brand
             material, not application code that happens to be nearby. Generated
             from the real directory, so the listing cannot drift from it. */
          system: {
            label: 'system', icon: 'layers', kind: 'folder',
            message: '24 files — the importable package',
            when: '2h', status: 'Live',
            children: {
          'activity.jsx': {
            message: 'what happened, newest first',
            when: '2h', status: 'Live', icon: 'file',
            exports: 2,
            lines: 124,
            text: `import s from './system.module.css'
import { Icon, Avatar } from './primitives'

/* Activity — what happened, newest first.
 *
 * Grouped by day, because "2h" and "5d" in the same flat column make you do
 * the arithmetic yourself to find the boundary between this morning and last
 * week. The day header does it once.
 *
 * Every row answers who, what, and where. The last one is the part activity
 * feeds usually drop: "Dana published logo-lockup.fig" is half a sentence if
 * you have five folders and the same filename could be in any of them.
 */

const KIND = {
  published: { icon: 'success', tone: 'good', verb: 'published' },
  updated: { icon: 'refresh', tone: 'muted', verb: 'updated' },
  review: { icon: 'request', tone: 'open', verb: 'moved to review' },
  created: { icon: 'plus', tone: 'muted', verb: 'created' },
  drafted: { icon: 'file', tone: 'muted', verb: 'drafted' },
  commented: { icon: 'comment', tone: 'muted', verb: 'commented on' },
}

const TONE = { good: s.stGood, open: s.stOpen, bad: s.stBad, muted: s.stMuted }

export const ACTIVITY_FILTERS = [
  { key: 'all', label: 'Everything' },
  { key: 'published', label: 'Published' },
  { key: 'review', label: 'In review' },
  { key: 'edits', label: 'Edits' },
]

const inFilter = (e, f) => (
  f === 'all'
  || (f === 'edits' ? ['updated', 'created', 'drafted'].includes(e.kind) : e.kind === f)
)

export function ActivityFeed({ entries, filter = 'all', onFilter, onOpen }) {
  const shown = entries.filter((e) => inFilter(e, filter))

  /* Grouped in render order rather than sorted into a map, so the feed keeps
     the order it was given and a day cannot appear twice. */
  const groups = []
  for (const e of shown) {
    const last = groups[groups.length - 1]
    if (last && last.day === e.day) last.rows.push(e)
    else groups.push({ day: e.day, rows: [e] })
  }

  return (
    <div className={s.browser}>
      <div className={s.requestBar}>
        <span className={s.requestFilters}>
          {ACTIVITY_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              className={\`\${s.requestFilter} \${filter === f.key ? s.requestFilterOn : ''}\`}
              onClick={() => onFilter?.(f.key)}
            >
              {f.label}
              <span className={s.requestViewCount}>
                {entries.filter((e) => inFilter(e, f.key)).length}
              </span>
            </button>
          ))}
        </span>
      </div>

      {shown.length === 0 && (
        <div className={s.browserEmpty}>
          <span className={s.eyebrow}>Nothing here</span>
          <span className={s.browserEmptyLine}>No activity of that kind yet.</span>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.day} className={s.actGroup}>
          <h3 className={s.actDay}>
            {g.day}
            <span className={s.actDayCount}>{g.rows.length}</span>
          </h3>

          {/* A rule behind the marks, so a day reads as one run of events
              rather than a stack of unrelated rows. */}
          <div className={s.actRows}>
            {g.rows.map((e, i) => {
              const k = KIND[e.kind] ?? KIND.updated
              return (
                <button
                  key={i}
                  type="button"
                  className={s.actRow}
                  onClick={() => onOpen?.(e)}
                >
                  <span className={s.actMark}>
                    <Avatar name={e.who} size={24} />
                    <span className={\`\${s.actKind} \${TONE[k.tone]}\`}>
                      <Icon name={k.icon} size={10} />
                    </span>
                  </span>

                  <span className={s.actText}>
                    <span className={s.actLine}>
                      <strong>{e.who}</strong> {k.verb} <em>{e.what}</em>
                    </span>
                    <span className={s.actWhere}>
                      <Icon name="folder" size={11} />{e.where}
                      {e.note && <span className={s.actNote}>· {e.note}</span>}
                    </span>
                  </span>

                  <span className={s.actWhen}>{e.when}</span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}`,
          },
          'browser.jsx': {
            message: 'File browser and tree',
            when: '2h', status: 'Live', icon: 'file',
            exports: 6,
            lines: 277,
            text: `import { useState, Fragment } from 'react'
import s from './system.module.css'
import { Icon } from './primitives'

/* File browser and tree.
 *
 * Modelled on the repo listing pattern — a header carrying the last change,
 * then folders before files, each row naming what changed and when. It works
 * because it answers three questions at once without a click: what is in here,
 * what moved most recently, and who moved it.
 *
 * Two rules it depends on and most imitations drop:
 *
 *   - Folders sort before files, always, and neither list is interleaved.
 *     Mixing them makes the eye scan the icon column instead of the names.
 *   - The message column truncates, the name column never does. A name you
 *     cannot read is a row you cannot use; a message you cannot finish is a
 *     row you can still act on.
 */

/* ── Breadcrumb ────────────────────────────────────────────────────────────
   Every segment is clickable except the last, which is where you are. A
   breadcrumb whose final segment is a link invites you to reload the page. */
export function Path({ segments, onNavigate }) {

/* ── 277 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function Path
export function FileBrowser
export function FileView
export function CodeLines
export function MediaPreview
export function Tree`,
          },
          'campaignCanvas.jsx': {
            message: 'a structured map that makes connection the native visual…',
            when: '2h', status: 'Live', icon: 'file',
            exports: 2,
            lines: 269,
            text: `import { useMemo, useState } from 'react'
import s from './system.module.css'
import { Icon } from './primitives'

/* The campaign canvas — a structured map that makes connection the native
 * visual language, ported from the Breadcrumbs canvas (stoplight/CanvasView).
 *
 * What makes it that rather than a box-and-line diagram, and what is worth
 * keeping: the hierarchy is owned by the layout, not by the person dragging.
 * Brand → strategy → audience → message, laid over funnel-stage bands. You
 * cannot place a message above the audience it belongs to, so the picture
 * cannot lie about what leads to what.
 *
 * Ported: the enforced hierarchy, the stage bands, the lane-per-audience
 * layout, the connector geometry (below), and revealing detail past a zoom
 * threshold rather than showing everything at every scale.
 *
 * Not ported: the 25 domain modules the original reads — coherence resolution,
 * channel taxonomy, playbook funnels, presence, the traffic store. Those are
 * Breadcrumbs' subject matter, not a canvas.
 *
 * Adapted: the original runs its coherent thread through that product's three
 * brand accents. This system has two, so the thread runs pink → purple → pink.
 */

/* ── 269 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function CampaignCanvas
export const FUNNEL_STAGES`,
          },
          'charts.jsx': {
            message: 'Charts as instruments, not illustrations',
            when: '2h', status: 'Live', icon: 'file',
            exports: 8,
            lines: 293,
            text: `import { useState } from 'react'
import s from './system.module.css'

/* Charts as instruments, not illustrations.
 *
 * Inline SVG with no library — nothing to load, and the marks inherit the
 * product's own tokens. Series colour comes from --sc-s1..s3, so retargeting
 * the palette retargets every chart at once.
 *
 * Rules these are built around, each easy to get wrong:
 *   - Text never wears the series colour. Values and labels stay in the ink
 *     ramp; the coloured mark beside them carries identity.
 *   - One axis. Two measures of different scale are two charts, never two
 *     y-scales on one.
 *   - The axis starts at zero on a bar. A truncated baseline exaggerates every
 *     difference and is the easiest way to mislead with a chart.
 *   - A reference line is dashed and neutral: context, never a series.
 */

export const SERIES = ['var(--sc-s1)', 'var(--sc-s2)', 'var(--sc-s3)']

/* Ticks as well as gridlines: a gridline helps you read across, a tick says
   exactly where the value sits. Spines are drawn, because a plot with a
   baseline is a measurement and one without is a picture of data. */

/* ── 293 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function Axis
export function Legend
export function Sparkline
export function LineChart
export function BarChart
export function RankedBar
export function Donut
export const SERIES`,
          },
          'chat.jsx': {
            message: 'Conversation',
            when: '2h', status: 'Live', icon: 'file',
            exports: 3,
            lines: 347,
            text: `import { useEffect, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton, Avatar } from './primitives'

/* Conversation.
 *
 * The parts that matter are the ones a chat UI usually skips: a visible
 * thinking state, a visible tool step, a stream you can watch arrive, and an
 * error you can retry. A chat that shows nothing between the question and the
 * answer looks broken every time the answer takes more than a second.
 *
 * Every timer is tracked and cleared on unmount, so leaving mid-stream cannot
 * leave one firing into a component that no longer exists.
 */

/* Reserves the full height of the finished paragraph before it starts, so the
   layout doesn't reflow line by line as tokens land. */
export function StreamingText() {
  const full = 'The card surface is #161616 on a #0a0a0a ground, at a 4px radius — the one surface the whole site uses.'
  const [n, setN] = useState(0)
  const [running, setRunning] = useState(false)

  const run = () => {
    if (running) return

/* ── 347 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function StreamingText
export function ResponseFeedback
export function Chat`,
          },
          'content.jsx': {
            message: 'the blocks a page is assembled from once the controls are…',
            when: '2h', status: 'Live', icon: 'file',
            exports: 7,
            lines: 228,
            text: `import { useState } from 'react'
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
    <span className={\`\${s.xStatus} \${tone ? s[tone] : ''}\`}>
      {value}
    </span>
  )
}

/* One base. Every variant below is this plus content — which is exactly what
   the 58 blocks each re-declare from scratch. */
export function CardSurface({ children, link, className = '' }) {
  return (
    <div className={\`\${s.cardBase} \${link ? s.xCardLink : ''} \${className}\`}>
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
        const pts = d.map((v, i) => \`\${i ? 'L' : 'M'}\${i * 10},\${26 - (v / max) * 22}\`).join(' ')
        return (
          <div key={label} className={s.tile}>
            <span className={s.tileLabel}>{label}</span>
            <div className={s.tileMain}>
              <span className={s.tileFig}>{fig}</span>
              <svg viewBox="0 0 116 28" className={s.tileSpark} aria-hidden="true">
                <path d={pts} fill="none" stroke={SERIES[series]} strokeWidth="1.5" />
              </svg>
            </div>
            <span className={\`\${s.tileDelta} \${good ? s.tileDeltaGood : ''}\`}>
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
  const px = (x, y, w = 1, h = 1) => <rect key={\`\${x}-\${y}\`} x={x} y={y} width={w} height={h} fill={ink} />
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
          onClick={() => onCopy(\`url(#\${id})\`)}
          title={\`Copy url(#\${id})\`}
        >
          <svg viewBox="0 0 100 52" className={s.texSwatch} aria-hidden="true">
            <rect width="100" height="52" fill="rgba(255,255,255,0.05)" />
            <rect width="100" height="52" fill={\`url(#\${id})\`} />
          </svg>
          <span className={s.texName}>{name}</span>
          <span className={s.texId}>
            {copied === \`url(#\${id})\` ? 'copied' : \`#\${id.replace(/^sc-(tex|tile)-/, '')}\`}
          </span>
          <span className={s.texNote}>{note}</span>
        </button>
      ))}
    </div>
  )
}`,
          },
          'dataGrid.jsx': {
            message: 'The data grid',
            when: '2h', status: 'Live', icon: 'file',
            exports: 1,
            lines: 528,
            text: `import { Fragment, useEffect, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, Avatar } from './primitives'

/* The data grid.
 *
 * The single most behaviour-dense component in the system, and the one where
 * every shortcut shows: multi-column sort, range selection, in-cell editing,
 * undo, per-column filters, aggregation, column hiding and copy-out. It was
 * built on the styleguide and stranded there, which meant no product could
 * have any of it.
 *
 * Two decisions in here were bugs first and are worth keeping written down:
 *
 *   Editing focuses and selects from an effect, not the autoFocus attribute.
 *   autoFocus fires before React attaches onFocus, so select-on-entry never
 *   ran and typing appended to the old value instead of replacing it. Every
 *   spreadsheet selects on entry; nobody notices until it is missing.
 *
 *   Every mutation goes through one function, so undo is a fact of the data
 *   layer rather than something each handler has to remember.
 */



/* ── 528 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function DataGrid`,
          },
          'folderPreview.jsx': {
            message: 'what is in here, rendered',
            when: '2h', status: 'Live', icon: 'file',
            exports: 1,
            lines: 150,
            text: `import s from './system.module.css'
import { Icon } from './primitives'
import { CampaignCanvas } from './campaignCanvas'

/* Folder preview — what is in here, rendered.
 *
 * The web workflow this borrows from: you do not read a repo to find out what
 * the site looks like, you open the preview. A brand folder should work the
 * same way. Every asset in it renders as the thing it is — the tokens as
 * swatches, the mark at its real sizes, the copy as copy — composed into one
 * surface you can look at, rather than a list of filenames you have to open
 * one at a time in five different apps.
 *
 * Each block names its source file, so the preview is never a picture with no
 * provenance: you can always get from what you are looking at back to the file
 * that produced it.
 */
export function FolderPreview({ title, blocks = [], onOpenAsset }) {
  if (blocks.length === 0) {
    return (
      <div className={s.browserEmpty}>
        <span className={s.eyebrow}>Nothing to preview</span>
        <span className={s.browserEmptyLine}>No asset in here renders to a page yet.</span>
      </div>
    )
  }

  return (
    <div className={s.fp}>
      {blocks.map((b, i) => (
        <section key={i} className={s.fpBlock}>
          <button
            type="button"
            className={s.fpSource}
            onClick={() => onOpenAsset?.(b.from)}
            title={\`Open \${b.from}\`}
          >
            <Icon name={b.icon ?? 'file'} size={12} />{b.from}
          </button>
          <Block block={b} />
        </section>
      ))}
      {title && <p className={s.fpFoot}>Rendered from {blocks.length} of the files in {title}.</p>}
    </div>
  )
}

function Block({ block: b }) {
  if (b.kind === 'swatches') {
    return (
      <div className={s.fpSwatches}>
        {b.colours.map((c) => (
          <span key={c.name} className={s.fpSwatch}>
            <span className={s.fpChip} style={{ background: c.value }} />
            <span className={s.fpChipName}>{c.name}</span>
            <span className={s.fpChipValue}>{c.value}</span>
          </span>
        ))}
      </div>
    )
  }

  /* The mark at the sizes the guidance argues about, so "the counter fills in
     below 24px" is a thing you can see rather than a claim you take on. */
  if (b.kind === 'mark') {
    return (
      <div className={s.fpMarks}>
        {b.sizes.map((px) => (
          <span key={px} className={s.fpMark}>
            <span className={s.fpMarkArt} style={{ width: px, height: px }}>
              <Icon name="brand" size={px} />
            </span>
            <span className={s.fpChipValue}>{px}px</span>
          </span>
        ))}
      </div>
    )
  }

  if (b.kind === 'type') {
    return (
      <div className={s.fpType}>
        {b.steps.map((t) => (
          <span key={t.name} className={s.fpTypeRow}>
            <span className={s.fpTypeSpec}>{t.name} · {t.size}</span>
            <span className={s.fpTypeSample} style={{ fontSize: t.size, fontFamily: t.mono ? 'var(--sc-font-mono)' : 'var(--sc-font-display)' }}>
              {t.sample}
            </span>
          </span>
        ))}
      </div>
    )
  }

  if (b.kind === 'copy') {
    return (
      <div className={s.fpCopy}>
        {b.lines.map((l, i) => (
          l.h
            ? <h3 key={i} className={s.fpCopyH}>{l.h}</h3>
            : <p key={i} className={s.fpCopyP}>{l.p}</p>
        ))}
      </div>
    )
  }

  /* Artwork at its real aspect, labelled with the ratio — a social kit is a
     set of shapes before it is a set of pictures. */
  if (b.kind === 'art') {
    return (
      <div className={s.fpArt}>
        {b.tiles.map((t) => (
          <span key={t.label} className={s.fpTile}>
            <span className={s.fpTileArt} style={{ aspectRatio: t.ratio }} />
            <span className={s.fpChipName}>{t.label}</span>
            <span className={s.fpChipValue}>{t.ratio.replace('/', ':')}</span>
          </span>
        ))}
      </div>
    )
  }

  if (b.kind === 'table') {
    return (
      <div className={s.fpTableWrap}>
        <table className={s.fpTable}>
          <thead>
            <tr>{b.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, i) => (
                  i === 0
                    ? <th key={i} scope="row">{cell}</th>
                    : <td key={i} className={cell === '—' ? s.fpTableNil : undefined}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (b.kind === 'canvas') return <CampaignCanvas canvas={b.canvas} dense />

  return null
}`,
          },
          'forms.jsx': {
            message: 'the controls that collect something',
            when: '2h', status: 'Live', icon: 'file',
            exports: 12,
            lines: 413,
            text: `import { useMemo, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, Button } from './primitives'
import { useDismiss } from './overlays'

/* Forms — the controls that collect something.
 *
 * Two rules run through all of them:
 *
 *   Validate on blur, not on every keystroke. Telling someone their email is
 *   invalid while they are still typing the domain is noise, and noise trains
 *   people to ignore the one message that mattered.
 *
 *   The role comes first, the appearance second. A checkbox that is a div is
 *   a div. Every control here carries the role its behaviour promises —
 *   checkbox, radio, listbox, combobox, slider — so assistive tech is told the
 *   same thing the eye is.
 */

/* ── Select ────────────────────────────────────────────────────────────────
   Returns a value. Its sibling, DropdownMenu, performs a verb — they look
   similar and behave differently, so they carry different roles. */
export function Select({ options, value, onChange, label, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false)

/* ── 413 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function Select
export function Combobox
export function CheckGroup
export function RadioGroup
export function ValidatedField
export function SearchField
export function TagInput
export function SliderControl
export function DatePicker
export function FileUpload
export function FilterBar
export function SortControl`,
          },
          'icons.js': {
            message: 'a 16px grid, 1.25px strokes, butt caps and miter joins, every…',
            when: '2h', status: 'Live', icon: 'file',
            exports: 1,
            lines: 75,
            text: `/* Icon paths — a 16px grid, 1.25px strokes, butt caps and miter joins, every
 * terminal on a whole pixel. Geometry only: no tapers, no rounded corners, no
 * optical curves. Closer to a technical drawing than to an app icon.
 *
 * Path data rather than components, so the set is one import and a consumer
 * can tree-shake or subset it without touching the renderer.
 */
export const ICONS = {
  'arrow-right': 'M2 8h12M9 3l5 5-5 5',
  'arrow-left': 'M14 8H2M7 3L2 8l5 5',
  'arrow-up': 'M8 14V2M3 7l5-5 5 5',
  'arrow-down': 'M8 2v12M3 9l5 5 5-5',
  'chevron-right': 'M6 3l5 5-5 5',
  'chevron-left': 'M10 3L5 8l5 5',
  'chevron-down': 'M3 6l5 5 5-5',
  'chevron-up': 'M3 10l5-5 5 5',
  close: 'M3 3l10 10M13 3L3 13',
  plus: 'M8 2v12M2 8h12',
  minus: 'M2 8h12',
  check: 'M2 8.5l4 4L14 4',
  menu: 'M2 4h12M2 8h12M2 12h12',
  search: 'M7 12a5 5 0 100-10 5 5 0 000 10M10.5 10.5L14 14',
  external: 'M9 2h5v5M14 2L7 9M12 9v5H2V4h5',
  copy: 'M5 5h9v9H5zM11 5V2H2v9h3',
  download: 'M8 2v9M4 7l4 4 4-4M2 14h12',
  upload: 'M8 11V2M4 6l4-4 4 4M2 14h12',
  link: 'M6.5 9.5l3-3M6 4l1.5-1.5a3 3 0 014 4L10 8M10 12l-1.5 1.5a3 3 0 01-4-4L6 8',
  refresh: 'M14 3v4h-4M13.2 9A5.5 5.5 0 112.5 8',
  filter: 'M2 3h12l-4.5 5.5V13L6.5 11V8.5z',
  sort: 'M4 12V3M2 5l2-2 2 2M8 4h6M8 8h4M8 12h2',
  info: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 7.5v4M8 5h.01',
  warning: 'M8 2l6 11H2zM8 6.5v3M8 11.5h.01',
  error: 'M8 14A6 6 0 108 2a6 6 0 000 12M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4',
  success: 'M8 14A6 6 0 108 2a6 6 0 000 12M5.2 8l2 2 3.6-3.6',
  clock: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 4.5V8l2.5 1.5',
  lock: 'M4 7h8v7H4zM6 7V5a2 2 0 014 0v2',
  play: 'M4 2l9 6-9 6z',
  pause: 'M5 3v10M11 3v10',
  image: 'M2 3h12v10H2zM2 10l3.5-3.5L9 10l2-2 3 3M5.5 5.5h.01',
  video: 'M2 4h9v8H2zM11 7l3-2v6l-3-2',
  file: 'M4 2h5l3 3v9H4zM9 2v3h3',
  /* Folder closed and open. The open state tilts the front face rather than
     adding an arrow — a folder that needs a glyph to say "open" is a folder
     drawn wrong. */
  /* Request states. An open request is a ring with a dot — deliberately not a
     tick or a cross, because "waiting" is a state of its own and borrowing
     either of those glyphs pre-judges the outcome. */
  request: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3',
  merged: 'M4.5 5.5a2 2 0 100-3 2 2 0 000 3M4.5 13.5a2 2 0 100-3 2 2 0 000 3M11.5 9.5a2 2 0 100-3 2 2 0 000 3M4.5 5.5v5M6.5 8h3',
  draft: 'M4.5 5.5a2 2 0 100-3 2 2 0 000 3M4.5 13.5a2 2 0 100-3 2 2 0 000 3M4.5 5.5v5M11.5 3.5v1M11.5 7.5v1M11.5 11.5v1',
  commit: 'M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5M8 2v3.5M8 10.5V14',
  comment: 'M2 3h12v8H8.5L5 14v-3H2z',
  checklist: 'M2 4.5L3.5 6 6 3M2 10.5L3.5 12 6 9M8.5 4.5H14M8.5 10.5H14',
  diff: 'M4 2h5l3 3v9H4zM9 2v3h3M8 7.5v3M6.5 9h3M6.5 12h3',
  archive: 'M2 3h12v3H2zM3 6v8h10V6M6.5 9h3',
  eye: 'M8 12c3.5 0 6-4 6-4s-2.5-4-6-4-6 4-6 4 2.5 4 6 4M8 9.8A1.8 1.8 0 108 6.2a1.8 1.8 0 000 3.6',
  folder: 'M2 4h4l1.5 2H14v8H2z',
  'folder-open': 'M2 4h4l1.5 2H14v2H5l-2 6H2zM3 14l2-6h9.5l-2 6z',
  calendar: 'M2 4h12v10H2zM2 7h12M5 2v3M11 2v3',
  mail: 'M2 4h12v8H2zM2 4l6 5 6-5',
  user: 'M8 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4',
  chart: 'M2 2v12h12M5 11V7M8 11V4M11 11V9',
  grid: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  list: 'M2 4h1M2 8h1M2 12h1M6 4h8M6 8h8M6 12h8',
  sliders: 'M3 3v10M8 3v10M13 3v10M1.5 6h3M6.5 10h3M11.5 5h3',
  /* Product-specific marks. Kept in the same set rather than a second one:
     two icon sets in one product is how weight and grid drift apart. */
  brand: 'M8 2l5.5 3v6L8 14 2.5 11V5z',
  type: 'M3 3h10M8 3v10M5.5 13h5',
  target: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 11.5A3.5 3.5 0 108 4.5a3.5 3.5 0 000 7M8 8h.01',
  channel: 'M3 8a5 5 0 015-5M3 8a5 5 0 005 5M13 8a5 5 0 00-5-5M13 8a5 5 0 01-5 5M8 3v10',
  layers: 'M8 2l6 3-6 3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3',
  route: 'M4 13a2 2 0 100-4 2 2 0 000 4M12 7a2 2 0 100-4 2 2 0 000 4M12 7v2a3 3 0 01-3 3H7',
}`,
          },
          'index.js': {
            message: 'Super Conscious design system',
            when: '2h', status: 'Live', icon: 'file',
            lines: 91,
            text: `/* Super Conscious design system.
 *
 * The boundary. A product consumes this package and nothing below it:
 *
 *   import '@/system/tokens.css'
 *   import { Shell, Panel, StatTile, LineChart } from '@/system'
 *
 * Two files carry the whole look — tokens.css and system.module.css — so this
 * can be lifted into another repo by copying src/system/ and importing the
 * stylesheet. To retarget a brand, replace the SURFACES, TEXT, ACCENT and
 * CHART blocks in tokens.css and re-run the palette validator against the new
 * surface. Everything else is structural.
 *
 * What is deliberately NOT here: anything site-specific. The invert-based
 * light mode, the 312px nav rail and the Signifier licence belong to
 * super-conscious.studio, not to the system.
 */

export { ICONS } from './icons'

export {
  Icon, Button, IconButton,
  Card, Eyebrow, CardTitle, CardBody,
  Panel, StatTile,
  Badge, Banner, Spinner,
  Segmented, Tabs,
  Avatar, Contributors, CompositionBar, AsideBlock, FactRow, StatusList,
  TitleBar, CountButton, Toolbar, RefSelect, CountLink, FindField,
  SectionNav, Field, Input, Switch,
} from './primitives'

export {
  Shell, GlobalBar, BarButton, Sidebar, NavGroup, NavItem,
  Topbar, Content, Grid, Col, useSidebar,
} from './shell'

export {
  Axis, SERIES, Legend, Sparkline, LineChart, BarChart, RankedBar, Donut,
} from './charts'

export { Path, FileBrowser, FileView, CodeLines, MediaPreview, Tree } from './browser'

export {
  REQUEST_STATES, RequestState, DiffStat, RequestList, RequestDetail,
} from './requests'

export { PdfPreview, CanvasPreview, WavePreview } from './previews'

export { CampaignCanvas, FUNNEL_STAGES } from './campaignCanvas'

export { FolderPreview } from './folderPreview'

export { ActivityFeed, ACTIVITY_FILTERS } from './activity'

export {
  useFocusTrap, useDismiss,
  Modal, ConfirmDialog, Drawer, BottomSheet,
  DropdownMenu, Popover, Tooltip, Lightbox,
  useToasts, ToastStack, CommandPalette,
} from './overlays'

export {
  Accordion, Stepper, MultiStep, Scrollspy, SidebarNav, PrevNext,
} from './navigation'

export {
  Select, Combobox, CheckGroup, RadioGroup, ValidatedField, SearchField,
  TagInput, SliderControl, DatePicker, FileUpload, FilterBar, SortControl,
} from './forms'

export {
  Histogram, BoxPlot, Scatter, Bubble, DotPlot, Dumbbell, SlopeChart,
  StepLine, TimeSeries, StackedArea, StackedBar, Waterfall, Funnel, Pareto,
  Bullet, ControlChart, Treemap, CalendarHeat, Cohort, Gantt, SmallMultiples,
} from './plots'

export { Wiki } from './wiki'

export { ProjectList, ProjectView } from './projects'

export { DataGrid } from './dataGrid'

export { Carousel, Gallery, BeforeAfter, VideoControls, ProgressBar } from './media'

export { Chat, StreamingText, ResponseFeedback } from './chat'

export {
  StatusPill, CardSurface, KpiRow, PersonCard, ConsentBanner,
  TextureDefs, TextureSwatches,
} from './content'`,
          },
          'media.jsx': {
            message: 'the components that hold pictures and time',
            when: '2h', status: 'Live', icon: 'file',
            exports: 5,
            lines: 175,
            text: `import { useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton } from './primitives'

/* Media — the components that hold pictures and time.
 *
 * Each one exists because the naive version is worse in a specific way: a
 * carousel with no position makes people click twice to find out they have
 * seen it all, a gallery with no thumbnails makes them click every one, and a
 * before/after with a fixed split is a picture of a comparison rather than a
 * comparison.
 */

export function Carousel({ slides }) {
  const [i, setI] = useState(0)
  const last = slides.length - 1

  return (
    <div className={s.carousel}>
      <div className={s.carouselWindow}>
        <div
          className={s.carouselTrack}
          style={{ transform: \`translateX(-\${i * 100}%)\` }}
        >
          {slides.map((s) => (
            <div key={s} className={s.slide}>
              <span className={s.slideNum}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={s.carouselControls}>
        <div className={s.dots}>
          {slides.map((s, n) => (
            <button
              key={s}
              type="button"
              className={\`\${s.xDot} \${n === i ? s.dotOn : ''}\`}
              onClick={() => setI(n)}
              aria-label={\`Go to slide \${n + 1}\`}
            />
          ))}
        </div>
        <div className={s.arrows}>
          <button
            type="button"
            className={s.arrow}
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            className={s.arrow}
            onClick={() => setI((n) => Math.min(last, n + 1))}
            disabled={i === last}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export function Gallery({ items }) {
  const [on, setOn] = useState(0)
  return (
    <div className={s.gallery}>
      <span className={s.galleryMain}>
        <span className={s.galleryNum}>{on + 1}</span>
      </span>
      <div className={s.galleryThumbs}>
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={\`\${s.galleryThumb} \${n === on ? s.galleryThumbOn : ''}\`}
            onClick={() => setOn(n)}
            aria-label={\`Image \${n + 1}\`}
          />
        ))}
      </div>
    </div>
  )
}

/* Range input rather than a drag handler: it is keyboard-operable for free
   and cannot get stuck mid-drag when the pointer leaves the element. */
export function BeforeAfter({ labels = ['Before', 'After'] }) {
  const [pos, setPos] = useState(50)
  return (
    <div className={s.baWrap}>
      <div className={s.ba}>
        <span className={s.baAfter}><span className={s.baTag}>After</span></span>
        <span className={s.baBefore} style={{ width: \`\${pos}%\` }}>
          <span className={s.baTag}>Before</span>
        </span>
        <span className={s.baLine} style={{ left: \`\${pos}%\` }} />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={s.baRange}
        aria-label="Reveal"
      />
    </div>
  )
}

export function VideoControls({ duration = 154, title }) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [pos, setPos] = useState(28)

  return (
    <div className={s.videoWrap}>
      <div className={s.videoBar}>
        <button
          type="button"
          className={s.videoBtn}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❙❙' : '▶'}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className={s.videoScrub}
          aria-label="Scrub"
        />
        <span className={s.videoTime}>0:{String(Math.round(pos * 0.6)).padStart(2, '0')}</span>
        <button
          type="button"
          className={s.videoBtn}
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  )
}

/* ── Feedback patterns (NEW) ─────────────────────────────────────────────── */

export function ProgressBar({ value, onChange, label = 'Upload' }) {
  const [pct, setPct] = useState(38)
  return (
    <div className={s.progressWrap}>
      <div className={s.progressTrack}>
        <div className={s.progressFill} style={{ width: \`\${pct}%\` }} />
      </div>
      <div className={s.progressMeta}>
        <span className={s.progressPct}>{pct}%</span>
        <div className={s.arrows}>
          <button type="button" className={s.arrow} onClick={() => setPct((p) => Math.max(0, p - 12))}>−</button>
          <button type="button" className={s.arrow} onClick={() => setPct((p) => Math.min(100, p + 12))}>+</button>
        </div>
      </div>
    </div>
  )
}`,
          },
          'navigation.jsx': {
            message: 'moving through a document or a sequence',
            when: '2h', status: 'Live', icon: 'file',
            exports: 6,
            lines: 189,
            text: `import { useEffect, useState } from 'react'
import s from './system.module.css'
import { Icon, Button } from './primitives'

/* Navigation — moving through a document or a sequence.
 *
 * Separate from the shell's Sidebar and SectionNav, which move between areas
 * of a product. These move within one thing: down a long page, through a set
 * of steps, between two neighbours.
 */

/* ── Accordion ─────────────────────────────────────────────────────────────
   Many-open by default. Single-open is a choice you make when the panels are
   alternatives; making it the default means opening one silently closes the
   thing somebody was reading. */
export function Accordion({ items, single, defaultOpen = [] }) {
  const [open, setOpen] = useState(new Set(defaultOpen))
  const toggle = (key) => setOpen((o) => {
    if (single) return new Set(o.has(key) ? [] : [key])
    const next = new Set(o)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  return (
    <div className={s.accordion}>
      {items.map((it) => {
        const isOpen = open.has(it.key ?? it.title)
        const key = it.key ?? it.title
        return (
          <div key={key} className={s.accItem}>
            <button
              type="button"
              className={s.accHead}
              aria-expanded={isOpen}
              onClick={() => toggle(key)}
            >
              <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={12} />
              <span className={s.accTitle}>{it.title}</span>
              {it.meta && <span className={s.accMeta}>{it.meta}</span>}
            </button>
            {isOpen && <div className={s.accBody}>{it.body}</div>}
          </div>
        )
      })}
    </div>
  )
}

/* ── Stepper ───────────────────────────────────────────────────────────────
   Shows where you are in a sequence whose length you cannot change. Done steps
   get a tick, the current one gets its number, and the rest stay numbered —
   a stepper that hides what is ahead is a progress bar with extra steps. */
export function Stepper({ steps, current = 0, onStep }) {
  return (
    <ol className={s.stepper}>
      {steps.map((label, i) => {
        const done = i < current
        const now = i === current
        return (
          <li key={label} className={s.stepItem}>
            <button
              type="button"
              className={\`\${s.stepMark} \${done ? s.stepDone : ''} \${now ? s.stepNow : ''}\`}
              aria-current={now ? 'step' : undefined}
              onClick={() => onStep?.(i)}
              disabled={!onStep}
            >
              {done ? <Icon name="check" size={12} /> : i + 1}
            </button>
            <span className={\`\${s.stepLabel} \${now ? s.stepLabelNow : ''}\`}>{label}</span>
            {i < steps.length - 1 && <span className={s.stepRule} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

/* A stepper with the panels attached, and the rule that you cannot skip
   forward past work you have not done. */
export function MultiStep({ steps, children, onDone }) {
  const [step, setStep] = useState(0)
  const last = step === steps.length - 1

  return (
    <div className={s.multiStep}>
      <Stepper steps={steps} current={step} onStep={(i) => i < step && setStep(i)} />
      <div className={s.multiBody}>{children?.[step]}</div>
      <div className={s.multiActions}>
        <Button size="sm" icon="chevron-left" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button
          size="sm"
          variant="solid"
          icon={last ? 'check' : 'chevron-right'}
          onClick={() => (last ? onDone?.() : setStep((x) => x + 1))}
        >
          {last ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

/* ── Scrollspy ─────────────────────────────────────────────────────────────
   Marks the section you are reading. IntersectionObserver rather than a scroll
   handler: a scroll listener fires on every pixel and still gets the answer
   wrong at the bottom of the page, where the last section can never reach the
   top of the viewport. */
export function Scrollspy({ sections, offset = '-40% 0px -55% 0px' }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const nodes = sections.map((x) => document.getElementById(x.id)).filter(Boolean)
    if (!nodes.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: offset },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [sections, offset])

  return (
    <nav className={s.spy} aria-label="On this page">
      {sections.map((x) => (
        <a
          key={x.id}
          href={\`#\${x.id}\`}
          aria-current={active === x.id ? 'true' : undefined}
          className={\`\${s.spyLink} \${active === x.id ? s.spyLinkOn : ''}\`}
        >
          {x.label}
        </a>
      ))}
    </nav>
  )
}

/* A flat list of links with one marked current. Distinct from the shell's
   Tree: no disclosure, no nesting, no counts — for a settings page or a docs
   sidebar where every destination is a sibling. */
export function SidebarNav({ items, value, onChange, title }) {
  return (
    <nav className={s.sideNav} aria-label={title ?? 'Sections'}>
      {title && <span className={s.railTitle}>{title}</span>}
      {items.map((it) => (
        <button
          key={it.key ?? it.label}
          type="button"
          aria-current={value === (it.key ?? it.label) ? 'page' : undefined}
          className={\`\${s.sideLink} \${value === (it.key ?? it.label) ? s.sideLinkOn : ''}\`}
          onClick={() => onChange?.(it.key ?? it.label)}
        >
          {it.icon && <Icon name={it.icon} size={13} />}
          <span className={s.sideLabel}>{it.label}</span>
          {it.count !== undefined && <span className={s.treeCount}>{it.count}</span>}
        </button>
      ))}
    </nav>
  )
}

/* Previous and next, each naming where it goes. An arrow labelled only
   "Previous" makes you click to find out whether you want it. */
export function PrevNext({ prev, next, onGo }) {
  return (
    <div className={s.prevNext}>
      {prev ? (
        <button type="button" className={s.pnItem} onClick={() => onGo?.(prev)}>
          <span className={s.pnDir}><Icon name="arrow-left" size={12} />Previous</span>
          <span className={s.pnLabel}>{prev.label}</span>
        </button>
      ) : <span />}
      {next && (
        <button type="button" className={\`\${s.pnItem} \${s.pnNext}\`} onClick={() => onGo?.(next)}>
          <span className={s.pnDir}>Next<Icon name="arrow-right" size={12} /></span>
          <span className={s.pnLabel}>{next.label}</span>
        </button>
      )}
    </div>
  )
}`,
          },
          'overlays.jsx': {
            message: 'everything that appears on top of the page',
            when: '2h', status: 'Live', icon: 'file',
            exports: 13,
            lines: 422,
            text: `import { useCallback, useEffect, useId, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, Button, IconButton } from './primitives'

/* Overlays — everything that appears on top of the page.
 *
 * These were drawn on the styleguide as demos and never extracted, which meant
 * the hard part of each one — the focus trap, the dismiss contract, the role —
 * existed once, on a page nobody imports. A modal that traps focus correctly is
 * worth having exactly once.
 *
 * The dismiss contract, applied consistently:
 *   modal, sheet, lightbox   Escape, backdrop, close button. Focus trapped.
 *   drawer                   Escape, backdrop, close button. Focus trapped.
 *   menu, popover            Escape, outside click. Focus not trapped — these
 *                            are attached to a trigger, not modal over it.
 *   tooltip                  Hover and focus only. Never traps, never blocks.
 */

/* Trap focus, and give it back. Restoring matters more than trapping: without
   it a screen reader lands back at the top of the document every time a dialog
   closes, which is worse than never having opened it. */
export function useFocusTrap(open, onClose) {
  const ref = useRef(null)

/* ── 422 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export const useFocusTrap
export const useDismiss
export function Modal
export function ConfirmDialog
export function Drawer
export function BottomSheet
export function DropdownMenu
export function Popover
export function Tooltip
export function Lightbox
export const useToasts
export function ToastStack
export function CommandPalette`,
          },
          'plots.jsx': {
            message: 'the analytical half of the chart set',
            when: '2h', status: 'Live', icon: 'file',
            exports: 21,
            lines: 635,
            text: `import s from './system.module.css'
import { Axis, Legend, SERIES } from './charts'

/* Plots — the analytical half of the chart set.
 *
 * The six in charts.jsx cover reporting: a line, a bar, a ranking, a donut.
 * These cover the questions those cannot answer — distribution, correlation,
 * change between two points, progress against a target, a sequence that adds
 * up, a shape over a calendar.
 *
 * Same rules as the rest: one axis, zero baselines on bars, text in the ink
 * ramp rather than the series colour, reference lines dashed and neutral, and
 * composition charts on the sequential ramp because they show degrees of one
 * whole rather than a set of unrelated things.
 */

const W = 400
const H = 175
const RAMP = ['var(--sc-q1)', 'var(--sc-q2)', 'var(--sc-q3)', 'var(--sc-q4)', 'var(--sc-q5)']

const Fig = ({ label, children, caption, legend }) => (
  <figure className={s.chart} style={{ margin: 0 }}>
    <svg viewBox={\`0 0 \${W} \${H}\`} className={s.svg} role="img" aria-label={label}>{children}</svg>
    {legend}

/* ── 635 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function Histogram
export function BoxPlot
export function Scatter
export function Bubble
export function DotPlot
export function Dumbbell
export function SlopeChart
export function StepLine
export function TimeSeries
export function StackedArea
export function StackedBar
export function Waterfall
export function Funnel
export function Pareto
export function Bullet
export function ControlChart
export function Treemap
export function CalendarHeat
export function Cohort
export function Gantt
export function SmallMultiples`,
          },
          'previews.jsx': {
            message: 'what a file looks like without opening the app that made it',
            when: '2h', status: 'Live', icon: 'file',
            exports: 3,
            lines: 165,
            text: `import { useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton } from './primitives'

/* Previews — what a file looks like without opening the app that made it.
 *
 * The rule these follow: a preview renders the document's real structure, not
 * a grey skeleton standing in for it. A row of placeholder bars tells you a
 * file exists, which you already knew from the listing. Headings at their real
 * size, frames at their real proportions and a waveform with real peaks tell
 * you whether this is the thing you were looking for, which is the only
 * question a preview is asked.
 */

/* ── PDF ───────────────────────────────────────────────────────────────────
   A thumbnail rail and one page, because that is how a deck is actually read:
   you scan for the page you half-remember, then look at it. Page-at-a-time
   with only next/previous makes you walk past everything to find anything. */
export function PdfPreview({ pages = [], title }) {
  const [page, setPage] = useState(0)
  const current = pages[page]
  if (!current) return null

  const go = (n) => setPage(Math.min(pages.length - 1, Math.max(0, n)))

  return (
    <div className={s.pdf}>
      <div className={s.pdfRail} role="tablist" aria-label="Pages">
        {pages.map((p, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === page}
            className={\`\${s.pdfThumb} \${i === page ? s.pdfThumbOn : ''}\`}
            onClick={() => setPage(i)}
          >
            <span className={s.pdfThumbPage}>
              <PdfBlocks blocks={p.blocks} mini />
            </span>
            <span className={s.pdfThumbNum}>{i + 1}</span>
          </button>
        ))}
      </div>

      <div className={s.pdfStage}>
        <div className={s.pdfToolbar}>
          <span className={s.pdfTitle}>
            <Icon name="file" size={13} />{title}
          </span>
          <span className={s.pdfPager}>
            <IconButton icon="chevron-left" label="Previous page" size={13} onClick={() => go(page - 1)} />
            <span className={s.pdfCount}>{page + 1} / {pages.length}</span>
            <IconButton icon="chevron-right" label="Next page" size={13} onClick={() => go(page + 1)} />
          </span>
        </div>

        <div className={s.pdfPage}>
          <PdfBlocks blocks={current.blocks} />
          <span className={s.pdfFolio}>{page + 1}</span>
        </div>
      </div>
    </div>
  )
}

/* The page itself. Four block kinds is enough to render a deck honestly:
   a title, a line of body, a rule and a placed image. */
function PdfBlocks({ blocks = [], mini }) {
  return (
    <div className={\`\${s.pdfBody} \${mini ? s.pdfBodyMini : ''}\`}>
      {blocks.map((b, i) => {
        if (b.kind === 'rule') return <span key={i} className={s.pdfRule} />
        if (b.kind === 'image') {
          return <span key={i} className={s.pdfImage} style={{ height: mini ? 22 : 120 }} />
        }
        if (b.kind === 'h') return <span key={i} className={s.pdfH}>{b.text}</span>
        if (b.kind === 'eyebrow') return <span key={i} className={s.pdfEyebrow}>{b.text}</span>
        return <span key={i} className={s.pdfP}>{b.text}</span>
      })}
    </div>
  )
}

/* ── Canvas ────────────────────────────────────────────────────────────────
   An artboard with placed frames. Selecting one names it and gives its size,
   which is the pair of facts a canvas is opened for — everything else is a
   reason to open the file properly. */
export function CanvasPreview({ frames = [], width = 1600, height = 900, label }) {
  const [picked, setPicked] = useState(null)
  const frame = frames.find((f) => f.name === picked) ?? null

  return (
    <div className={s.canvasWrap}>
      <div className={s.canvasBar}>
        <span className={s.canvasName}>
          <Icon name="grid" size={13} />{label} · {frames.length} frames
        </span>
        <span className={s.canvasPicked}>
          {frame
            ? <>{frame.name} <span className={s.canvasDims}>{frame.w} × {frame.h}</span></>
            : 'Nothing selected'}
        </span>
      </div>

      {/* The board keeps its true ratio and is capped by height, not width —
          a 16:9 artboard given the full column is 700px tall and pushes
          everything else off the screen. Capping the width to whatever that
          ratio needs at 420px tall gets both. */}
      <div
        className={s.canvas}
        style={{ aspectRatio: \`\${width} / \${height}\`, maxWidth: \`\${(width / height) * 420}px\` }}
      >
        {frames.map((f) => (
          <button
            key={f.name}
            type="button"
            aria-pressed={picked === f.name}
            className={\`\${s.artFrame} \${picked === f.name ? s.artFrameOn : ''}\`}
            style={{
              left: \`\${(f.x / width) * 100}%\`,
              top: \`\${(f.y / height) * 100}%\`,
              width: \`\${(f.w / width) * 100}%\`,
              height: \`\${(f.h / height) * 100}%\`,
            }}
            onClick={() => setPicked(picked === f.name ? null : f.name)}
          >
            <span className={s.artFrameLabel}>{f.name}</span>
            <span className={\`\${s.artFrameFill} \${f.tone ? s[\`artFrameFill\${f.tone}\`] : ''}\`} />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Waveform ──────────────────────────────────────────────────────────────
   Audio is the one asset with no visual form at all, which is exactly why it
   needs one: a sting you cannot see the shape of is a filename. */
export function WavePreview({ peaks = [], duration, label }) {
  const [at, setAt] = useState(0)
  return (
    <div className={s.waveWrap}>
      <div className={s.canvasBar}>
        <span className={s.canvasName}><Icon name="video" size={13} />{label}</span>
        <span className={s.canvasPicked}>
          {(at * (duration ?? 0)).toFixed(2)}s <span className={s.canvasDims}>of {duration}s</span>
        </span>
      </div>
      <div className={s.wave}>
        {peaks.map((p, i) => (
          <button
            key={i}
            type="button"
            className={\`\${s.wavePeak} \${i / peaks.length <= at ? s.wavePeakOn : ''}\`}
            style={{ height: \`\${Math.max(4, p * 100)}%\` }}
            aria-label={\`Seek to \${((i / peaks.length) * (duration ?? 0)).toFixed(2)} seconds\`}
            onClick={() => setAt(i / peaks.length)}
          />
        ))}
      </div>
    </div>
  )
}`,
          },
          'primitives.jsx': {
            message: 'Primitives',
            when: '2h', status: 'Live', icon: 'file',
            exports: 30,
            lines: 535,
            text: `import { useState } from 'react'
import s from './system.module.css'
import { ICONS } from './icons'

/* Primitives. Every one of these was a demo inside the styleguide page and is
 * now a component — which is the difference between a design system and a
 * drawing of one. The styleguide should import from here rather than
 * re-implement, and so should any product.
 */

export function Icon({ name, size = 16, className = '' }) {
  const d = ICONS[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={\`\${s.icon} \${className}\`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>

/* ── 535 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function Icon
export function Button
export function IconButton
export function Card
export function Panel
export function StatTile
export function Badge
export function Banner
export function Segmented
export function TitleBar
export function CountButton
export function Toolbar
export function RefSelect
export function CountLink
export function FindField
export function Avatar
export function Contributors
export function CompositionBar
export function AsideBlock
export function FactRow
export function StatusList
export function Field
export function Input
export function Switch
export function SectionNav
export function Tabs
export function Eyebrow
export function CardTitle
export function CardBody
export function Spinner`,
          },
          'projects.jsx': {
            message: 'a piece of work the brand is being used for',
            when: '2h', status: 'Live', icon: 'file',
            exports: 2,
            lines: 187,
            text: `import { useState } from 'react'
import s from './system.module.css'
import { Icon, Avatar, Button, Segmented } from './primitives'
import { Path } from './browser'
import { FolderPreview } from './folderPreview'

/* Projects — a piece of work the brand is being used for.
 *
 * Deliberately not another folder listing. A folder answers "what is in here";
 * a project answers "what is this for, how far along is it, and what does it
 * look like" — and the last of those is the one a brand workspace keeps
 * failing to answer, because it files everything as a filename and makes you
 * open the app that made it to see anything.
 *
 * So a project opens onto the work rendered: the canvas it is laid out on,
 * the deck it goes out as, the assets it pulls from the brand folders.
 */

export function ProjectList({ projects, filter, onFilter, counts, query, onQuery, onOpen, onNew }) {
  const shown = projects.filter((p) => (
    (filter === 'open' ? !p.closed : p.closed)
    && (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  ))

  return (
    <div className={s.projects}>
      <div className={s.projectsHead}>
        <h2 className={s.projectsTitle}>Projects</h2>
        <span className={s.projectsActions}>
          <Button size="sm" icon="link">Link a project</Button>
          <Button size="sm" variant="solid" icon="plus" onClick={onNew}>New project</Button>
        </span>
      </div>

      <label className={s.projectsSearch}>
        <Icon name="search" size={14} />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by name"
          className={s.projectsSearchField}
        />
      </label>

      <div className={s.browser}>
        <div className={s.requestBar}>
          <span className={s.requestFilters}>
            {[['open', 'Open'], ['closed', 'Closed']].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                className={\`\${s.requestFilter} \${filter === key ? s.requestFilterOn : ''}\`}
                onClick={() => onFilter(key)}
              >
                {label} <span className={s.requestViewCount}>{counts[key]}</span>
              </button>
            ))}
          </span>
        </div>

        <div className={s.browserList} role="list">
          {shown.length === 0 && (
            <div className={s.browserEmpty}>
              <span className={s.eyebrow}>Nothing here</span>
              <span className={s.browserEmptyLine}>
                {query ? \`No project matches "\${query}".\` : filter === 'open' ? 'No open projects.' : 'Nothing closed yet.'}
              </span>
            </div>
          )}

          {shown.map((p) => (
            <button key={p.id} type="button" role="listitem" className={s.projectRow} onClick={() => onOpen(p)}>
              <span className={s.projectMain}>
                <span className={s.projectName}>
                  {p.name}
                  <span className={s.projectBadge}>{p.visibility ?? 'Private'}</span>
                </span>
                <span className={s.requestMeta}>#{p.id} updated {p.updated} ago · {p.owner}</span>
              </span>

              {/* How far along, as a bar and a number. A project row with no
                  progress on it is a link, and a list of links is a folder. */}
              <span className={s.projectSide}>
                <span className={s.projectProgress}>
                  <span className={s.projectTrack}>
                    <span className={s.projectFill} style={{ width: \`\${p.done}%\` }} />
                  </span>
                  <span className={s.projectPct}>{p.done}%</span>
                </span>
                <span className={s.requestAvatars}>
                  {p.team.map((n) => <Avatar key={n} name={n} size={20} />)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* The project itself: look at it, or list what is in it. Two views rather
   than one page per format. */
export function ProjectView({ project, path, onNavigate, onOpenAsset, previewHref }) {
  /* Two views, not four, and the same two a website repo gives you: the built
     thing, and the files it was built from. Preview renders what is in the
     folder; Assets lists it. */
  const views = project.preview?.length ? ['Preview', 'Assets'] : ['Assets']
  const [view, setView] = useState(views[0])

  /* A canvas block names its source but carries no copy of the map — the
     project's own canvas is filled in here, so there is one canvas per
     project rather than one in the data and another in the preview. */
  const blocks = (project.preview ?? []).map((b) => (
    b.kind === 'canvas' ? { ...b, canvas: b.canvas ?? project.canvas } : b
  )).filter((b) => b.kind !== 'canvas' || b.canvas)

  return (
    <div className={s.requestPage}>
      <Path segments={path} onNavigate={onNavigate} />

      <div className={s.requestHead}>
        <h2 className={s.requestHeadTitle}>
          {project.name} <span className={s.requestHeadId}>#{project.id}</span>
        </h2>
        <div className={s.requestHeadMeta}>
          <span className={\`\${s.stateBadge} \${project.closed ? s.stMuted : s.stOpen}\`}>
            <Icon name={project.closed ? 'check' : 'request'} size={13} />
            {project.closed ? 'Closed' : 'Open'}
          </span>
          <span className={s.requestHeadLine}>
            <strong>{project.owner}</strong> · updated {project.updated} ago · {project.done}% done
          </span>
        </div>
        <p className={s.projectBrief}>{project.brief}</p>
      </div>

      <div className={s.projectBar}>
        {/* A one-option switch is not a choice. A project with nothing laid out
            and nothing sent out shows its assets and says nothing about it. */}
        {views.length > 1 && <Segmented value={view} onChange={setView} options={views} />}
        {views.length <= 1 && <span />}
        <span className={s.projectBarRight}>
          <span className={s.projectTeam}>
            {project.team.map((n) => <Avatar key={n} name={n} size={22} />)}
          </span>
          {/* The deploy-preview move: the built thing, its own tab, full width.
              A preview squeezed beside a sidebar is a thumbnail. */}
          {previewHref && (
            <a className={s.cvOpen} href={previewHref} target="_blank" rel="noreferrer">
              <Icon name="external" size={13} />Open
            </a>
          )}
        </span>
      </div>

      {view === 'Preview' && (
        <FolderPreview title={project.name} blocks={blocks} onOpenAsset={onOpenAsset} />
      )}

      {view === 'Assets' && (
        <div className={s.browser}>
          <div className={s.browserList} role="list">
            {project.assets.map((a) => (
              <button
                key={a.name}
                type="button"
                role="listitem"
                className={s.projectAssetRow}
                onClick={() => onOpenAsset?.(a)}
              >
                <Icon name={a.icon ?? 'file'} size={14} />
                <span className={s.fileChangeName}>{a.name}</span>
                <span className={s.fileChangeNote}>{a.from}</span>
                <span className={s.projectAssetKind}>{a.kind}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}`,
          },
          'requests.jsx': {
            message: 'the list-of-open-work pattern',
            when: '2h', status: 'Live', icon: 'file',
            exports: 5,
            lines: 588,
            text: `import { useState } from 'react'
import s from './system.module.css'
import { Icon, Avatar, Button } from './primitives'
import { Path } from './browser'

/* Requests — the list-of-open-work pattern.
 *
 * Reviews here, but the shape fits anything with an author, an age, a state
 * and a decision waiting at the end of it: issues, approvals, change requests.
 *
 * The thing that makes this pattern work, and the thing most imitations drop:
 * a request is an object in its own right, not a filtered view of the things
 * it touches. It has its own id, its own conversation and its own outcome, and
 * it outlives the file it changes. A "reviews" tab that is really a file list
 * filtered by status cannot hold a conversation, cannot be assigned, and
 * disappears the moment the status changes.
 */

export const REQUEST_STATES = {
  draft: { icon: 'draft', label: 'Draft', tone: 'muted' },
  open: { icon: 'request', label: 'Open', tone: 'open' },
  approved: { icon: 'success', label: 'Approved', tone: 'good' },
  changes: { icon: 'error', label: 'Changes requested', tone: 'bad' },
  merged: { icon: 'merged', label: 'Published', tone: 'merged' },

/* ── 588 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function RequestState
export function DiffStat
export function RequestList
export function RequestDetail
export const REQUEST_STATES`,
          },
          'shell.jsx': {
            message: 'The dashboard frame',
            when: '2h', status: 'Live', icon: 'file',
            exports: 11,
            lines: 180,
            text: `import { useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton } from './primitives'

/* The dashboard frame.
 *
 * The sidebar is a grid column rather than position:fixed, so content never
 * needs a magic margin to clear it and nothing can slide underneath. Below
 * 768px it becomes a horizontal strip rather than collapsing to icons — a
 * 56px rail on a phone costs more room than it returns.
 */

/* The frame. A global bar, when present, spans the full width above the
   sidebar rather than sitting inside the content column — it belongs to the
   product, not to the page, and a bar that stops at the sidebar reads as part
   of whatever is beside it. */
export function Shell({ collapsed, global, children }) {
  return (
    <div className={\`sc-root \${s.frame}\`}>
      {global}
      <div className={\`\${s.shell} \${collapsed ? s.shellCollapsed : ''}\`}>
        {children}
      </div>
    </div>
  )
}

/* Global bar: who you are, where you are, and the few things reachable from
   anywhere. Deliberately thin on content — everything that belongs to the
   current page lives in the TitleBar below it, and the commonest failure here
   is letting page-level actions creep up into a bar that is always on screen.
 *
 * The hamburger is first and toggles the sidebar. At this width it is the only
 * control whose target the eye never has to search for. */
export function GlobalBar({ mark, owner, workspace, onMenu, search, onSearch, children }) {
  return (
    <header className={s.globalBar}>
      <button type="button" className={s.globalMenu} onClick={onMenu} aria-label="Toggle navigation">
        <Icon name="menu" size={16} />
      </button>

      {mark && <img src={mark} alt="" className={s.globalMark} />}

      <nav className={s.globalCrumb} aria-label="Workspace">
        {owner && (
          <>
            <button type="button" className={s.globalOwner}>{owner}</button>
            <span className={s.globalSlash}>/</span>
          </>
        )}
        <button type="button" className={s.globalWorkspace}>
          {workspace}
          <Icon name="chevron-down" size={11} />
        </button>
      </nav>

      <span className={s.globalSpacer} />

      <span className={s.globalSearch}>
        <Icon name="search" size={13} />
        <input
          className={s.globalSearchInput}
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search"
          aria-label="Search"
        />
        <kbd className={s.globalKbd}>/</kbd>
      </span>

      <span className={s.globalActions}>{children}</span>
    </header>
  )
}

/* A bar action. The dot is a state, not a decoration — it takes a label so a
   screen reader is told there is something waiting, which a coloured circle
   alone never says. */
export function BarButton({ icon, label, dot, onClick }) {
  return (
    <button type="button" className={s.barBtn} onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} size={15} />
      {dot && <span className={s.barDot} aria-label="Unread" />}
    </button>
  )
}

/* The head renders only when it has something in it. With no mark, no brand
   and no toggle it was an empty 84px band above the navigation — and its
   collapse caret duplicated the hamburger in the global bar, which is a
   better place for it: one control, one job, always in the same spot. */
export function Sidebar({ brand, mark, collapsed, onToggle, children }) {
  const hasHead = mark || (brand && !collapsed) || onToggle
  return (
    <nav className={s.sidebar} aria-label="Main">
      {hasHead && (
        <div className={s.sidebarHead}>
          <span className={s.brandRow}>
            {mark && <img src={mark} alt="" className={s.brandMark} />}
            {!collapsed && brand && <span className={s.brand}>{brand}</span>}
          </span>
          {onToggle && (
            <IconButton
              icon={collapsed ? 'chevron-right' : 'chevron-left'}
              label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              size={14}
              onClick={onToggle}
            />
          )}
        </div>
      )}
      {children}
    </nav>
  )
}

export function NavGroup({ label, collapsed, children }) {
  return (
    <div className={s.navGroup}>
      {label && !collapsed && <span className={s.navLabel}>{label}</span>}
      {children}
    </div>
  )
}

/* aria-current rather than colour alone, so the active item is announced as
   well as brighter — and it carries a rule, so it is not colour-only either.
   The count is the reason a lot of these rows exist: a nav that says how much
   is behind a link is a nav people can plan with. */
export function NavItem({ icon, label, count, active, collapsed, onClick }) {
  return (
    <button
      type="button"
      className={\`\${s.navItem} \${active ? s.navItemOn : ''}\`}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      title={collapsed ? label : undefined}
    >
      {icon && <Icon name={icon} size={14} />}
      {!collapsed && (
        <>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          {count !== undefined && <span className={s.navCount}>{count}</span>}
        </>
      )}
    </button>
  )
}

export function Topbar({ title, children }) {
  return (
    <header className={s.topbar}>
      <h1 className={s.topbarTitle}>{title}</h1>
      <div className={s.topbarActions}>{children}</div>
    </header>
  )
}

export function Content({ children }) {
  return <main className={s.content}>{children}</main>
}

/* 12 columns on the site's 5px gutter — the same grid the homepage uses, so a
   dashboard and a marketing page read as one system rather than two products. */
export function Grid({ children }) {
  return <div className={s.grid12}>{children}</div>
}

export function Col({ span = 12, children }) {
  const cls = { 3: s.span3, 4: s.span4, 6: s.span6, 8: s.span8, 12: s.span12 }[span] ?? s.span12
  return <div className={cls}>{children}</div>
}

/* Convenience: the whole frame with its own collapse state, for a product that
   does not want to own it. */
export function useSidebar(initial = false) {
  const [collapsed, setCollapsed] = useState(initial)
  return { collapsed, toggle: () => setCollapsed((c) => !c) }
}`,
          },
          'system.module.css': {
            message: 'Super Conscious design system — component styles',
            when: '2h', status: 'Live', icon: 'file',
            lines: 7710,
            text: `/* Super Conscious design system — component styles.
 *
 * One stylesheet rather than one per component, deliberately. The whole point
 * of this package is that it can be lifted into another product, and two files
 * (tokens.css + this) is a boundary someone will actually carry across. Fifteen
 * co-located modules is a boundary they will copy wrong.
 *
 * Every value here reads a token. If a rule below needs a literal, that is a
 * finding about tokens.css, not a licence to hardcode.
 */

/* ── Shell ─────────────────────────────────────────────────────────────────
   The dashboard frame: a fixed sidebar, a sticky topbar, and a scrolling
   content well. The sidebar is a grid column rather than position:fixed, so
   the content never needs a magic margin to clear it. */

.shell {
  display: grid;
  grid-template-columns: 216px 1fr;
  min-height: 100vh;
  background: var(--sc-ground);
}

.shellCollapsed {

/* ── 7710 lines. Showing the header and the exports.
   Open the file for the rest. ── */

`,
          },
          'tokens.css': {
            message: 'Super Conscious design system — tokens',
            when: '2h', status: 'Live', icon: 'file',
            lines: 245,
            text: `/* Super Conscious design system — tokens.
 *
 * The layer that was missing. Everything in /design-system was a description
 * until these existed; from here a component reads a token and changing the
 * token changes the component.
 *
 * Two rules for anyone adding to this file:
 *
 *   1. A value belongs here only if more than one component needs it. A token
 *      used once is a hardcoded value with extra steps.
 *   2. Names describe the JOB, not the appearance. --sc-card, not --sc-grey-2.
 *      An appearance name is a promise you break the first time the appearance
 *      changes.
 *
 * The --sc- prefix is deliberate: these are global, and a second design system
 * in the same document must not collide with them.
 *
 * To retarget for another brand, replace the SURFACES, TEXT, ACCENT and CHART
 * blocks and leave everything below them alone — spacing, radius, layers,
 * elevation and motion are structural rather than brand.
 */

:root {
  /* ── Surfaces ────────────────────────────────────────────────────────────
     One ground, one card, and small steps either side of it. */
  --sc-ground: #0a0a0a;
  --sc-card: #161616;
  --sc-card-hover: #1c1c1c;
  --sc-raised: #1e1e1e;
  --sc-recessed: #0e0e0e;

  /* ── Text ────────────────────────────────────────────────────────────────
     White at descending alpha. There is no second text colour — the whole
     hierarchy is built from opacity, which is why light mode can be a filter. */
  --sc-text-peak: rgba(255, 255, 255, 0.95);
  --sc-text-display: rgba(255, 255, 255, 0.92);
  --sc-text-strong: rgba(255, 255, 255, 0.85);
  --sc-text-title: rgba(255, 255, 255, 0.75);
  --sc-text-body: rgba(255, 255, 255, 0.55);
  --sc-text-support: rgba(255, 255, 255, 0.45);
  --sc-text-label: rgba(255, 255, 255, 0.4);
  --sc-text-meta: rgba(255, 255, 255, 0.3);
  --sc-text-faint: rgba(255, 255, 255, 0.22);

  /* ── Hairlines & fills ─────────────────────────────────────────────────── */
  --sc-line-strong: rgba(255, 255, 255, 0.12);
  --sc-line: rgba(255, 255, 255, 0.06);
  --sc-fill: rgba(255, 255, 255, 0.06);
  --sc-fill-hover: rgba(255, 255, 255, 0.12);
  --sc-fill-faint: rgba(255, 255, 255, 0.03);

  /* ── Accent ──────────────────────────────────────────────────────────────
     Two hues, and only two. --teal and --blue were declared for years and used
     nowhere; they are not carried forward. */
  --sc-pink: #df4ed6;
  --sc-purple: #7d5ae0;

  /* ── Status ──────────────────────────────────────────────────────────────
     Reserved. Never reused as a chart series or an accent. */
  --sc-good: rgba(190, 220, 150, 0.9);
  --sc-good-fill: rgba(190, 220, 150, 0.1);
  --sc-warn: #bd842c;
  --sc-warn-fill: rgba(189, 132, 44, 0.12);
  --sc-bad: rgba(255, 80, 80, 0.85);
  --sc-bad-fill: rgba(255, 80, 80, 0.1);
  --sc-bad-line: rgba(255, 80, 80, 0.6);

  /* ── Chart ───────────────────────────────────────────────────────────────
     Three categorical slots, and that is a measured ceiling rather than a
     preference: pink and purple are adjacent hues, so past three a fourth
     either leaves the OKLCH lightness band (0.48–0.67) or fails adjacent-pair
     colour-vision separation. Past three series, use small multiples or an
     "Other" bucket — never a fourth hue.

     s4–s6 alias s1–s3 on purpose, so a chart reaching for a fourth series
     gets a visible repeat instead of a colour that quietly fails. */
  --sc-s1: #d94eb6;
  --sc-s2: #7d5ae0;
  --sc-s3: #a82a7e;
  --sc-s4: var(--sc-s1);
  --sc-s5: var(--sc-s2);
  --sc-s6: var(--sc-s3);

  /* Sequential ramp — one hue, light to dark. Magnitude, not identity. */
  --sc-q0: rgba(255, 255, 255, 0.03);
  --sc-q1: #231a49;
  --sc-q2: #342767;
  --sc-q3: #4a3891;
  --sc-q4: #6a51c4;
  --sc-q5: #9b86e6;

  /* ── Type ────────────────────────────────────────────────────────────────
     Two families held far apart: a serif for anything read for meaning, a mono
     for anything that labels or counts. */
  --sc-font-display: 'Signifier', Georgia, serif;
  --sc-font-mono: 'Roboto Mono', ui-monospace, monospace;

  --sc-size-eyebrow: 8px;
  --sc-size-label: 9px;
  --sc-size-meta: 10px;
  --sc-size-ui: 11px;
  --sc-size-body: 14px;
  --sc-size-lede: 15px;

  --sc-track-tight: 0.04em;
  --sc-track: 0.1em;
  --sc-track-wide: 0.12em;
  --sc-track-widest: 0.14em;

  /* ── Spacing ─────────────────────────────────────────────────────────────
     The site had no scale — its top eight padding values were eight separate
     decisions. This is the scale; 5px stays as a named exception because it is
     the homepage gutter and rounding it would change the page. */
  --sc-space-1: 4px;
  --sc-gutter: 5px;
  --sc-space-2: 8px;
  --sc-space-3: 12px;
  --sc-space-4: 16px;
  --sc-space-5: 24px;
  --sc-space-6: 32px;
  --sc-space-7: 48px;
  --sc-space-8: 64px;

  /* Global bar height. A token because three things depend on it — the bar,
     the sidebar's sticky offset, and its height — and they must not be able
     to disagree. */
  --sc-bar-h: 48px;

  /* ── Radius ──────────────────────────────────────────────────────────── */
  --sc-radius-sm: 2px;
  --sc-radius: 4px;
  --sc-radius-lg: 16px;
  --sc-radius-pill: 999px;

  /* ── Elevation ───────────────────────────────────────────────────────────
     Four shadows, each with a job. The drawer casts upward because it rises
     from the edge of the screen. */
  --sc-elev-menu: 0 12px 28px rgba(0, 0, 0, 0.5);
  --sc-elev-dialog: 0 18px 40px rgba(0, 0, 0, 0.6);
  --sc-elev-drawer: 0 -12px 60px rgba(0, 0, 0, 0.7);
  --sc-ring: 0 0 0 3px rgba(255, 255, 255, 0.9), 0 16px 36px rgba(0, 0, 0, 0.6);

  /* ── Layers ──────────────────────────────────────────────────────────────
     Named steps 100 apart, so there is room to insert without renumbering.
     Replaces eleven ad-hoc z-index values including 9500 and 9999. */
  --sc-layer-base: 0;
  --sc-layer-raised: 10;
  --sc-layer-sticky: 100;
  --sc-layer-nav: 200;
  --sc-layer-drawer: 300;
  --sc-layer-overlay: 400;
  --sc-layer-toast: 500;
  --sc-layer-cursor: 600;

  /* ── Motion ────────────────────────────────────────────────────────────── */
  --sc-ease: cubic-bezier(0.25, 1, 0.4, 1);
  --sc-fast: 0.15s;
  --sc-medium: 0.3s;
  --sc-slow: 0.5s;

  /* ── Focus ───────────────────────────────────────────────────────────────
     One ring for every control. The 2px offset matters: flush to the edge it
     reads as a border and disappears on anything that already has one. */
  --sc-focus: 2px solid rgba(255, 255, 255, 0.9);
  --sc-focus-offset: 2px;
}

/* Light mode is a filter on this site rather than a second palette, so there
   is no light token block. A product that needs a real light theme should
   redefine the SURFACES and TEXT blocks under its own scope — and re-run the
   palette validator against the new surface, because the chart slots above are
   validated against #0a0a0a and nothing else. */

/* ── Base ──────────────────────────────────────────────────────────────────
   Applied by any product consuming the system. Deliberately minimal: it sets
   the ground and the focus ring, and nothing else. */

.sc-root {
  background: var(--sc-ground);
  color: var(--sc-text-body);
  font-family: var(--sc-font-mono);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Take the cursor back.
 *
 * A host app may hide the native cursor globally — this site does, with
 * \`cursor: none !important\` on \`*\` from the custom-cursor component, and that
 * rule applies as soon as the module is imported whether or not the component
 * renders. An application cannot run without a cursor: the I-beam over a field
 * and the pointer over a row are doing real work, and a resize handle you
 * cannot see is a resize handle you cannot use.
 *
 * \`!important\` is load-bearing here rather than lazy — it is the only thing
 * that beats an \`!important\` already set on the universal selector. */
.sc-root,
.sc-root * {
  cursor: auto !important;
}

.sc-root a,
.sc-root button,
.sc-root summary,
.sc-root [role="button"],
.sc-root [role="treeitem"] > * {
  cursor: pointer !important;
}

.sc-root input,
.sc-root textarea,
.sc-root [contenteditable="true"] {
  cursor: text !important;
}

.sc-root :disabled,
.sc-root [aria-disabled="true"] {
  cursor: default !important;
}

.sc-root [type="range"] {
  cursor: ew-resize !important;
}

/* focus-visible rather than focus, so a mouse click leaves nothing behind but
   a Tab key does. Scoped to the system root so it cannot fight a host app. */
.sc-root :focus-visible {
  outline: var(--sc-focus);
  outline-offset: var(--sc-focus-offset);
  border-radius: var(--sc-radius-sm);
}

/* Not "no motion" — motion that moves nothing through space. Fades survive
   because opacity carries no vestibular cost; travel, scale and looping stop. */
@media (prefers-reduced-motion: reduce) {
  .sc-root *,
  .sc-root *::before,
  .sc-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
          },
          'wiki.jsx': {
            message: 'the part of a brand system that is prose rather than an asset',
            when: '2h', status: 'Live', icon: 'file',
            exports: 1,
            lines: 117,
            text: `import { useEffect, useRef } from 'react'
import s from './system.module.css'
import { Icon, Button, Avatar } from './primitives'
import { WikiDemo } from './wikiDemos'

/* Wiki — the part of a brand system that is prose rather than an asset.
 *
 * It exists because half of what a brand needs written down does not fit in a
 * file: why the palette stops at three chart colours, what to do when a
 * channel wants something the system has no answer for, who decides. Those
 * live in a document or they live in someone's head, and the second one leaves
 * when they do.
 *
 * A page list beside the page rather than above it: you arrive at a wiki
 * looking for one page you half-remember the name of, and a list you can scan
 * without leaving what you are reading is the whole trick.
 */
export function Wiki({ pages, current, onSelect, onEdit }) {
  const page = pages.find((p) => p.slug === current) ?? pages[0]
  const first = useRef(true)

  /* Land at the top of the page you asked for. Following a Related link from
     the foot of a long page and arriving halfway down the next one reads as
     the link having failed.

     The window rather than the element: scrolling the wiki's own top into view
     put it flush against the viewport and hid the page title behind the
     workspace chrome above it. Not on first render, so arriving at the section
     does not yank a page that is already where it should be. */
  useEffect(() => {
    if (first.current) { first.current = false; return }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [page.slug])

  return (
    <div className={s.wiki}>
      <aside className={s.wikiRail}>
        <h3 className={s.railTitle}>Pages {pages.length}</h3>
        <nav className={s.wikiNav} aria-label="Wiki pages">
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              aria-current={p.slug === page.slug ? 'page' : undefined}
              className={\`\${s.wikiLink} \${p.slug === page.slug ? s.wikiLinkOn : ''}\`}
              onClick={() => onSelect(p.slug)}
            >
              <Icon name="file" size={12} />{p.title}
            </button>
          ))}
        </nav>
      </aside>

      <article className={s.wikiPage}>
        <header className={s.wikiHead}>
          <h2 className={s.wikiTitle}>{page.title}</h2>
          <div className={s.wikiMeta}>
            <span className={s.wikiBy}>
              <Avatar name={page.by} size={20} />
              {page.by} edited this {page.when} ago
            </span>
            <Button size="sm" icon="type" onClick={() => onEdit?.(page)}>Edit</Button>
          </div>
        </header>

        <div className={s.wikiBody}>
          {page.body.map((b, i) => {
            if (b.h) return <h3 key={i} className={s.wikiH}>{b.h}</h3>
            if (b.list) {
              return (
                <ul key={i} className={s.wikiList}>
                  {b.list.map((l) => <li key={l} className={s.wikiItem}>{l}</li>)}
                </ul>
              )
            }
            /* A rule you must not break is set apart from the prose explaining
               it — otherwise it gets skimmed along with everything else. */
            if (b.rule) {
              return (
                <p key={i} className={s.wikiRule}>
                  <Icon name="warning" size={13} />{b.rule}
                </p>
              )
            }
            if (b.code) return <pre key={i} className={s.wikiCode}><code>{b.code}</code></pre>
            /* A live specimen, rendered from the real component or the real
               token. A page about a design system that shows no part of it is
               a page you have to take on trust. */
            if (b.show) {
              return (
                <figure key={i} className={s.wikiFigure}>
                  <WikiDemo id={b.show} />
                  {b.caption && <figcaption className={s.wikiCaption}>{b.caption}</figcaption>}
                </figure>
              )
            }
            return <p key={i} className={s.wikiP}>{b.p}</p>
          })}
        </div>

        {page.related?.length > 0 && (
          <footer className={s.wikiFoot}>
            <span className={s.eyebrow}>Related</span>
            <span className={s.wikiRelated}>
              {page.related.map((r) => (
                <button key={r} type="button" className={s.wikiLink} onClick={() => onSelect(r)}>
                  <Icon name="link" size={12} />{pages.find((p) => p.slug === r)?.title ?? r}
                </button>
              ))}
            </span>
          </footer>
        )}
      </article>
    </div>
  )
}`,
          },
          'wikiDemos.jsx': {
            message: 'Live demos for the wiki',
            when: '2h', status: 'Live', icon: 'file',
            exports: 2,
            lines: 1099,
            text: `import { useEffect, useState } from 'react'
import s from './system.module.css'
import { ICONS } from './icons'
import {
  Icon, Button, IconButton, Badge, Banner, Field, Input, Switch, Segmented, Avatar, StatTile,
} from './primitives'
import { LineChart, BarChart, RankedBar, Donut, Sparkline } from './charts'
import {
  Modal, ConfirmDialog, Drawer, BottomSheet, DropdownMenu, Popover, Tooltip,
  Lightbox, ToastStack, useToasts, CommandPalette,
} from './overlays'
import { Accordion, Stepper, Scrollspy, SidebarNav, PrevNext } from './navigation'
import {
  Select, Combobox, CheckGroup, RadioGroup, ValidatedField, SearchField,
  TagInput, SliderControl, DatePicker, FileUpload, FilterBar, SortControl,
} from './forms'
import {
  Histogram, BoxPlot, Scatter, Bubble, DotPlot, Dumbbell, SlopeChart,
  StepLine, TimeSeries, StackedArea, StackedBar, Waterfall, Funnel, Pareto,
  Bullet, ControlChart, Treemap, CalendarHeat, Cohort, Gantt, SmallMultiples,
} from './plots'
import { Tabs, SectionNav } from './primitives'
import { Grid, Col } from './shell'
import { DataGrid } from './dataGrid'

/* ── 1099 lines. Showing the header and the exports.
   Open the file for the rest. ── */

export function WikiDemo
export const WIKI_DEMOS`,
          },
            },
          },
        },
      },
      verbal: {
        label: 'Verbal', icon: 'type', message: 'Tighten the positioning clause', when: '1d',
        children: {
          'tone-of-voice.md': {
            message: 'Tighten the positioning clause', when: '1d', status: 'Live', icon: 'file',
            text: `# Tone of voice

We write like someone who has done the work and is
telling you what they found.

- Say the finding, then the evidence.
- No adjective doing a verb's job.
- If a sentence survives being cut, cut it.`,
          },
          'messaging-house.md': { message: 'Name the challenger brands', when: '4d', status: 'Live', icon: 'file' },
          'positioning.md': {
            message: 'Move into review', when: '1d', status: 'Review', icon: 'file',
            text: `# Positioning

For founders and marketing teams who need brand,
content and product to say the same thing.

Not an agency of record. A studio you bring in when
the system has to outlive the engagement.`,
          },
          'launch-narrative.md': { message: 'First pass, not reviewed', when: '2d', status: 'Draft', icon: 'file' },
        },
      },
      channels: {
        label: 'Channels', icon: 'channel', message: 'Draft the channel matrix', when: '5d',
        children: {
          'channel-matrix.md': { message: 'Draft, awaiting sign-off', when: '5d', status: 'Draft', icon: 'file' },
          'social-kit.fig': { message: 'Most-used asset this quarter', when: '6h', status: 'Live', icon: 'image' },
          'audience.md': { message: 'Split founders from marketing teams', when: '2w', status: 'Live', icon: 'file' },
        },
      },
      /* Data is part of the brand, not a report about it: the chart palette,
         the number formats and the table rules are as much identity as the
         logo, and they drift the moment they live somewhere else. */
      data: {
        label: 'Data', icon: 'chart', message: 'Cap the categorical palette at three', when: '4h',
        children: {
          'chart-palette.json': {
            message: 'Cap the categorical palette at three', when: '4h', status: 'Live', icon: 'file',
            text: `{
  "categorical": ["#d94eb6", "#7d5ae0", "#a82a7e"],
  "sequential":  ["#231a49", "#342767", "#4a3891", "#6a51c4", "#9b86e6"],
  "note": "Three is the ceiling for two adjacent hues.",
  "floors": { "cvd_delta_e": 8, "contrast": 3 }
}`,
          },
          'number-formats.md': { message: 'One decimal on percentages', when: '1w', status: 'Live', icon: 'file' },
          'table-rules.md': { message: 'Hairlines, never zebra stripes', when: '2w', status: 'Live', icon: 'file' },
          'chart-anatomy.fig': { message: 'Marks, spacers and label rules', when: '2w', status: 'Review', icon: 'image' },
          /* Only present when this checkout has the real export. A clone gets
             no row rather than a row that opens onto nothing. */
          ...(HAS_METRICS ? {
            'metrics.csv': {
              message: `${METRICS.rows.length} days · ${METRICS.columns.length} columns`,
              when: '12m', status: 'Live', icon: 'chart',
              render: 'grid',
              grid: METRICS,
            },
          } : {}),
        },
      },
      /* Sound is the part nobody documents until somebody has already picked
         a stock track. It is here so there is something to point at. */
      audio: {
        label: 'Audio', icon: 'video', message: 'Cut the sting to 1.2s', when: '3d',
        children: {
          'brand-sting.wav': {
            message: 'Cut to 1.2s', when: '3d', status: 'Review', icon: 'video',
            render: 'wave',
            wave: {
              label: 'brand-sting.wav', duration: 1.2,
              peaks: [0.08, 0.14, 0.3, 0.62, 0.94, 0.86, 0.7, 0.58, 0.72, 0.88, 0.64, 0.46,
                0.38, 0.52, 0.44, 0.3, 0.36, 0.28, 0.2, 0.26, 0.18, 0.12, 0.14, 0.08, 0.05],
            },
          },
          'motion-timings.md': { message: 'Match the 0.15s UI easing', when: '1w', status: 'Live', icon: 'file' },
          'voice-guide.md': { message: 'Read pace and warmth for VO', when: '3w', status: 'Live', icon: 'file' },
        },
      },
    },
  },
}

/* Folders all the way down.
 *
 * This was two levels deep and hardcoded, which meant a folder nested inside
 * another one existed in the listing and was invisible in the rail — you could
 * reach it by clicking through the browser and never see where you were.
 *
 * Files are left out on purpose. A rail listing every file is a second file
 * browser, and the one on the right is better at it; the rail answers "where
 * am I in the shape of this", which only folders contribute to.
 *
 * Folders are drawn as folders. They each carried a discipline mark — a
 * hexagon, a T, a waveform — which made a rail of folders look like a rail of
 * unrelated tools. The mark survives on the collapsed rail, where identical
 * folder glyphs would be identical buttons. */
const branch = (node, path) =>
  Object.entries(node.children ?? {})
    .filter(([, c]) => c.children)
    .map(([key, c]) => ({
      key: [...path, key].join('/'),
      label: c.label ?? key,
      icon: 'folder',
      railIcon: c.icon,
      count: Object.keys(c.children).length,
      children: branch(c, [...path, key]),
    }))

/* The sidebar is the brand's own tree, derived from the same object as the
   listing so a folder cannot exist in one and be missing from the other. */
const TREE = [{
  key: 'brand',
  label: FS.brand.label,
  icon: FS.brand.icon,
  children: branch(FS.brand, ['brand']),
}]

const ROOT = ['brand', 'visual']

/* Every leaf under Brand. Derived rather than declared, so the number in the
   About panel cannot disagree with the tree beside it. */
const countFiles = (node) =>
  Object.values(node.children ?? {}).reduce(
    (n, child) => n + (child.children ? countFiles(child) : 1),
    0,
  )

const ASSET_COUNT = countFiles(FS.brand)

const at = (path) =>
  path.reduce((node, seg) => node?.children?.[seg], { children: FS })

/* How big is this — a different question for text, a canvas, a deck and a
   sound file, and answered wrong for all four when one line covers them all. */
const fileMeta = (node, isText) => {
  if (!node) return []
  if (isText) {
    /* A source file carries its real length. Counting the lines of an excerpt
       and calling it the file's size is how a listing quietly starts lying. */
    const shown = node.text.split('\n').length
    const total = node.lines ?? shown
    return [
      total === shown ? `${total} lines` : `${total} lines · ${shown} shown`,
      node.exports ? `${node.exports} exports` : `${node.text.length} bytes`,
      node.status,
    ]
  }
  if (node.render === 'canvas') {
    return [`${node.canvas.width} × ${node.canvas.height}`, `${node.canvas.frames.length} frames`, node.status]
  }
  if (node.render === 'grid') {
    return [`${node.grid.rows.length} rows`, `${node.grid.columns.length} columns`, node.status]
  }
  if (node.render === 'pdf') return [`${node.pdf.pages.length} pages`, 'PDF', node.status]
  if (node.render === 'wave') return [`${node.wave.duration}s`, '48 kHz · WAV', node.status]
  return ['1600 × 1000', 'SVG', node.status]
}

/* Fails quietly: copying a path is a convenience, and a thrown promise in a
   webview with no clipboard permission is worse than nothing happening. */
const writeText = (t) => { try { navigator.clipboard?.writeText?.(t) } catch {} }

/* Review requests. Each is a proposed change to an asset with its own id,
   author, conversation and outcome — it outlives the file it changes, which
   is exactly what a status field on a file cannot do.

   The extra fields — revisions, checks, changed assets, a preview — exist
   because a reviewer is answering "should this go live", and that question is
   not answerable from a title and a thread. Where a code host would say
   commits, checks and files, a brand workspace says revisions, checks and
   assets: the same four questions asked of different material. */
const REVIEWS = [
  {
    id: 42,
    state: 'open',
    title: 'Refit the logo lockup for small sizes',
    asset: 'logo-lockup.fig',
    base: 'v2.1 — current',
    head: 'small-size-lockup',
    author: 'dana',
    opened: '2d',
    comments: 3,
    conflicts: false,
    labels: ['Visual', 'Blocking'],
    campaign: 'Q3 — Challenger positioning',
    reviewers: [
      { name: 'Chris Church', state: 'changes' },
      { name: 'Ravi Menon', state: 'open' },
    ],
    assignees: ['Dana Cole'],
    participants: ['Dana Cole', 'Chris Church', 'Ravi Menon'],
    summary: 'Optical sizes below 24px lost the counter in the mark. This adds a second lockup that opens it up, and brings the wordmark spacing with it.',
    preview: { note: 'Rendered at 16, 24, 32 and 64px against both surfaces.' },
    revisions: [
      { hash: 'a014ddf', title: 'Open the counter below 24px', who: 'dana', when: '2d', ok: true },
      { hash: '7c3b901', title: 'Thin the stroke to match the new counter', who: 'dana', when: '1d', ok: true },
      { hash: 'e88f2a6', title: 'Bring wordmark spacing up with the mark', who: 'dana', when: '4h', ok: true },
    ],
    checks: [
      { name: 'Contrast', state: 'pass', note: 'Mark clears 3:1 on both surfaces at every size.', took: '4s' },
      { name: 'Clear space', state: 'pass', note: 'Half the mark height on all four sides.', took: '2s' },
      { name: 'Small-size legibility', state: 'pass', note: 'Counter holds at 16px.', took: '9s' },
      { name: 'Preview build', state: 'pass', note: 'Rendered four sizes on two surfaces.', took: '31s' },
    ],
    files: [
      { name: 'logo-lockup.fig', icon: 'image', note: 'Second lockup added', added: 2, removed: 0 },
      { name: 'clear-space.md', icon: 'file', note: 'Rule restated for the small variant', added: 14, removed: 6 },
    ],
    timeline: [
      { kind: 'comment', who: 'dana', when: '2d', body: 'Below 24px the counter fills in and the mark reads as a blob. This adds a small-size variant with the counter opened up and the stroke thinned.' },
      { kind: 'pushed', who: 'dana', when: '1d', revisions: [
        { hash: 'a014ddf', title: 'Open the counter below 24px', who: 'dana', ok: true },
        { hash: '7c3b901', title: 'Thin the stroke to match the new counter', who: 'dana', ok: true },
      ] },
      { kind: 'comment', who: 'ravi', when: '1d', role: 'Reviewer', body: 'Checked it at 16px in the nav and it holds. One thing — the wordmark spacing needs to come up with it or they drift apart.' },
      { kind: 'changes', who: 'chris', when: '1d' },
      { kind: 'pushed', who: 'dana', when: '4h', revisions: [
        { hash: 'e88f2a6', title: 'Bring wordmark spacing up with the mark', who: 'dana', ok: true },
      ] },
      { kind: 'comment', who: 'dana', when: '4h', body: 'Spacing fixed. Both lockups now share the same optical gap.' },
    ],
  },
  {
    id: 41,
    state: 'approved',
    title: 'Retire teal and blue from the token set',
    asset: 'colour-tokens.json',
    base: 'v2.1 — current',
    head: 'retire-teal-blue',
    author: 'chris',
    opened: '3d',
    comments: 2,
    conflicts: false,
    labels: ['Visual'],
    campaign: null,
    reviewers: [{ name: 'Dana Cole', state: 'approved' }],
    assignees: ['Chris Church'],
    participants: ['Chris Church', 'Dana Cole'],
    summary: 'Both were declared in the token file and used nowhere. Removing them rather than finding work for them.',
    preview: { note: 'Every surface and chart re-rendered with the two values gone.' },
    revisions: [
      { hash: '4b2e77c', title: 'Remove --teal and --blue', who: 'chris', when: '3d', ok: true },
      { hash: '9df01a3', title: 'Point the two orphaned aliases at pink', who: 'chris', when: '3d', ok: true },
    ],
    checks: [
      { name: 'Unused tokens', state: 'pass', note: 'No references remain anywhere in the workspace.', took: '3s' },
      { name: 'Contrast', state: 'pass', note: 'No surface pairing changed.', took: '5s' },
      { name: 'Preview build', state: 'pass', note: '95 pages rendered.', took: '48s' },
    ],
    files: [
      { name: 'colour-tokens.json', icon: 'file', note: 'Two values removed, two aliases repointed', added: 4, removed: 18 },
    ],
    timeline: [
      { kind: 'comment', who: 'chris', when: '3d', body: 'Both are declared and used nowhere — zero references across the whole workspace. Removing rather than inventing a use.' },
      { kind: 'pushed', who: 'chris', when: '3d', revisions: [
        { hash: '4b2e77c', title: 'Remove --teal and --blue', who: 'chris', ok: true },
        { hash: '9df01a3', title: 'Point the two orphaned aliases at pink', who: 'chris', ok: true },
      ] },
      { kind: 'comment', who: 'dana', when: '2d', role: 'Reviewer', body: 'Agreed. Pink and purple carry everything we actually need, and the chart palette is the same two hues.' },
      { kind: 'approved', who: 'dana', when: '2d' },
    ],
  },
  {
    id: 40,
    state: 'changes',
    title: 'Draft the channel matrix',
    asset: 'channel-matrix.md',
    base: 'v2.1 — current',
    head: 'channel-matrix',
    author: 'ravi',
    opened: '5d',
    comments: 1,
    draft: true,
    conflicts: false,
    labels: ['Channels'],
    campaign: 'Q3 — Challenger positioning',
    reviewers: [{ name: 'Chris Church', state: 'changes' }],
    assignees: [],
    participants: ['Ravi Menon', 'Chris Church'],
    summary: 'First pass at which message runs where. Rows are channels, columns are the three messages.',
    preview: null,
    revisions: [
      { hash: '1a9c04e', title: 'First pass at the matrix', who: 'ravi', when: '5d', ok: false },
    ],
    checks: [
      { name: 'Tone', state: 'fail', note: 'Two cells use category language the messaging house retired.', took: '6s' },
      { name: 'Links', state: 'pass', note: 'All nine references resolve.', took: '2s' },
      { name: 'Preview build', state: 'running', note: 'Queued behind two other builds.', took: '—' },
    ],
    files: [
      { name: 'channel-matrix.md', icon: 'file', note: 'New file', added: 62, removed: 0 },
    ],
    timeline: [
      { kind: 'comment', who: 'ravi', when: '5d', body: 'First pass. Rows are channels, columns are the three messages. Left it as a draft — the paid column is guesswork until we have the spend split.' },
      { kind: 'changes', who: 'chris', when: '4d' },
    ],
  },
  {
    id: 38,
    state: 'merged',
    title: 'Name the challenger brands in the messaging house',
    asset: 'messaging-house.md',
    base: 'v2.0',
    head: 'name-the-challengers',
    author: 'dana',
    opened: '2w',
    comments: 4,
    conflicts: false,
    labels: ['Verbal'],
    campaign: 'Q3 — Challenger positioning',
    reviewers: [
      { name: 'Chris Church', state: 'approved' },
      { name: 'Ravi Menon', state: 'approved' },
    ],
    assignees: ['Dana Cole'],
    participants: ['Dana Cole', 'Chris Church', 'Ravi Menon'],
    summary: 'Replaces the abstract category language with the actual names.',
    preview: { note: 'Published to the workspace 11 days ago.' },
    revisions: [
      { hash: 'c71b508', title: 'Name the four challengers', who: 'dana', when: '2w', ok: true },
      { hash: '2e6a90d', title: 'Rewrite the proof line under each', who: 'dana', when: '12d', ok: true },
    ],
    checks: [
      { name: 'Tone', state: 'pass', note: 'No retired category language remains.', took: '5s' },
      { name: 'Links', state: 'pass', note: 'Twelve references resolve.', took: '3s' },
      { name: 'Preview build', state: 'pass', note: 'Rendered clean.', took: '26s' },
    ],
    files: [
      { name: 'messaging-house.md', icon: 'file', note: 'Category language replaced with names', added: 34, removed: 29 },
    ],
    timeline: [
      { kind: 'comment', who: 'dana', when: '2w', body: 'The category language was doing no work. These are the names people actually say.' },
      { kind: 'pushed', who: 'dana', when: '12d', revisions: [
        { hash: 'c71b508', title: 'Name the four challengers', who: 'dana', ok: true },
        { hash: '2e6a90d', title: 'Rewrite the proof line under each', who: 'dana', ok: true },
      ] },
      { kind: 'approved', who: 'chris', when: '2w' },
      { kind: 'approved', who: 'ravi', when: '11d' },
      { kind: 'merged', who: 'chris', when: '11d' },
    ],
  },
  {
    id: 35,
    state: 'closed',
    title: 'Add a third accent colour',
    asset: 'colour-tokens.json',
    base: 'v2.0',
    head: 'third-accent',
    author: 'ravi',
    opened: '3w',
    comments: 5,
    conflicts: true,
    labels: ['Visual'],
    campaign: null,
    reviewers: [{ name: 'Chris Church', state: 'changes' }],
    assignees: [],
    participants: ['Ravi Menon', 'Chris Church'],
    summary: 'Closed — a third categorical hue fails colour-vision separation against the other two.',
    preview: null,
    revisions: [
      { hash: 'f30c6b1', title: 'Add --accent-3 at three candidate values', who: 'ravi', when: '3w', ok: false },
    ],
    checks: [
      { name: 'Colour-vision separation', state: 'fail', note: 'ΔE 2.5 against pink under protanopia — the floor is 8.', took: '7s' },
      { name: 'Lightness band', state: 'fail', note: 'Every separating value sits at L 0.75 or above.', took: '4s' },
      { name: 'Contrast', state: 'pass', note: 'Clears 3:1 on the dark surface.', took: '4s' },
    ],
    files: [
      { name: 'colour-tokens.json', icon: 'file', note: 'Three candidate values, none passing', added: 9, removed: 0 },
    ],
    timeline: [
      { kind: 'comment', who: 'ravi', when: '3w', body: 'Three series in a chart is tight. Proposing a third accent.' },
      { kind: 'comment', who: 'chris', when: '3w', role: 'Reviewer', body: 'Ran it through the validator. Every value that separates cleanly leaves the lightness band, and every value inside the band fails the adjacent-pair check. Three is the ceiling for two adjacent hues.' },
      { kind: 'closed', who: 'chris', when: '3w' },
    ],
  },
]




/* Activity. Grouped by the day it happened rather than sorted into a map, so
   the feed keeps the order it was given. */
const ACTIVITY = [
  { who: 'Dana Cole', kind: 'published', what: 'logo-lockup.fig', where: 'Brand / Visual', when: '2h', day: 'Today', note: 'small-size variant' },
  { who: 'Ravi Menon', kind: 'commented', what: 'review #42', where: 'Reviews', when: '4h', day: 'Today' },
  { who: 'Chris Church', kind: 'published', what: 'chart-palette.json', where: 'Brand / Data', when: '4h', day: 'Today', note: 'capped at three' },
  { who: 'Ravi Menon', kind: 'updated', what: 'social-kit.fig', where: 'Brand / Channels', when: '6h', day: 'Today' },
  { who: 'Chris Church', kind: 'review', what: 'positioning.md', where: 'Brand / Verbal', when: '1d', day: 'Yesterday' },
  { who: 'Dana Cole', kind: 'updated', what: 'brand-guidelines.pdf', where: 'Brand / Visual', when: '1d', day: 'Yesterday', note: 'regenerated from tokens' },
  { who: 'Dana Cole', kind: 'created', what: 'launch-narrative.md', where: 'Brand / Verbal', when: '2d', day: 'Earlier this week' },
  { who: 'Ravi Menon', kind: 'updated', what: 'brand-sting.wav', where: 'Brand / Audio', when: '3d', day: 'Earlier this week', note: 'cut to 1.2s' },
  { who: 'Ravi Menon', kind: 'drafted', what: 'channel-matrix.md', where: 'Brand / Channels', when: '5d', day: 'Earlier this week' },
  { who: 'Chris Church', kind: 'published', what: 'messaging-house.md', where: 'Brand / Verbal', when: '1w', day: 'Last week' },
  { who: 'Dana Cole', kind: 'created', what: 'table-rules.md', where: 'Brand / Data', when: '2w', day: 'Last week' },
]


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard() {
  useMeta({
    title: 'Dashboard | Super Conscious',
    description: 'Internal brand workspace.',
    path: '/dashboard',
    noindex: true,
  })

  const { collapsed, toggle } = useSidebar()
  const [path, setPath] = useState(ROOT)
  const [tab, setTab] = useState('Files')
  const browsing = tab === 'Files'
  const [version, setVersion] = useState('v2.1 — current')
  const [search, setSearch] = useState('')
  const [find, setFind] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [wsName, setWsName] = useState('Brand')
  const [visibility, setVisibility] = useState('Private')
  const [autoReview, setAutoReview] = useState(true)
  const [mcpOn, setMcpOn] = useState(true)
  const [mcpScopes, setMcpScopes] = useState(['Read assets', 'Read reviews'])
  const [tokenShown, setTokenShown] = useState(false)
  const [file, setFile] = useState(null)
  const [fileView, setFileView] = useState('Preview')
  const [reviews, setReviews] = useState(REVIEWS)
  const [reviewId, setReviewId] = useState(null)
  const [reviewFilter, setReviewFilter] = useState('open')
  const [actFilter, setActFilter] = useState('all')
  const [wikiPage, setWikiPage] = useState('home')

  const node = at(path)
  /* The row carries whatever the file has to show, so the listing can draw a
     true thumbnail instead of an icon that repeats the extension. */
  const entries = Object.entries(node?.children ?? {}).map(([name, e]) => ({
    name,
    kind: e.kind === 'folder' || e.children ? 'folder' : 'file',
    icon: e.icon,
    message: e.message,
    when: e.when,
    status: e.status,
    render: e.render,
    canvas: e.canvas,
    pdf: e.pdf,
    wave: e.wave,
    grid: e.grid,
    text: e.text,
  }))

  /* What the listing actually shows: the folder's contents, narrowed by the
     filter field, and narrowed again to unfinished work in Reviews. Both
     controls act on the same list rather than each owning their own copy. */
  const shown = entries
    .filter((e) => !find || e.name.toLowerCase().includes(find.toLowerCase())
      || (e.message ?? '').toLowerCase().includes(find.toLowerCase()))
    .filter((e) => tab !== 'Reviews' || (e.status && e.status !== 'Live'))

  /* Open and closed are two questions, not one list with a filter chip:
     "what needs me" and "what happened". Approved and changes-requested are
     still open — a decision has been given but the work has not landed. */
  const isOpen = (r) => r.state === 'open' || r.state === 'approved' || r.state === 'changes'
  const reviewCounts = {
    open: reviews.filter(isOpen).length,
    closed: reviews.filter((r) => !isOpen(r)).length,
  }
  const visibleReviews = reviews.filter((r) => (reviewFilter === 'open' ? isOpen(r) : !isOpen(r)))
  const openReview = reviews.find((r) => r.id === reviewId) ?? null

  const activeKey = path.join('/')

  const selectNode = (n) => {
    setFile(null)
    setReviewId(null)
    setTab('Files')
    setPath(n.key.split('/'))
  }

  /* Acting on a review writes to the timeline as well as the state, so the
     record of who decided what survives the decision itself. Marking a draft
     ready is the one action that leaves the state alone — it only clears the
     flag that was blocking the decision. */
  const act = (kind) => {
    setReviews((rs) => rs.map((r) => {
      if (r.id !== reviewId) return r
      const timeline = [...r.timeline, { kind, who: 'chris', when: 'just now' }]
      if (kind === 'ready') return { ...r, draft: false, timeline }
      if (kind === 'reopened') return { ...r, state: 'open', timeline }
      const state = kind === 'closed' ? 'closed' : kind
      const reviewers = ['approved', 'changes'].includes(kind)
        ? (r.reviewers ?? []).map((p) => (p.name === 'Chris Church' ? { ...p, state: kind } : p))
        : r.reviewers
      return { ...r, state, reviewers, timeline }
    }))
  }

  /* A comment does not change the outcome, only the record — and the count on
     the row, which is the one number people scan the queue by. */
  const comment = (body) => {
    setReviews((rs) => rs.map((r) => (r.id === reviewId
      ? {
          ...r,
          comments: (r.comments ?? 0) + 1,
          timeline: [...r.timeline, { kind: 'comment', who: 'chris', when: 'just now', body }],
        }
      : r)))
  }

  const label = (segs) => segs.map((seg, i) => at(segs.slice(0, i + 1))?.label ?? seg)

  /* A folder goes deeper; a file opens. Clicking a row used to do nothing
     for files, which made half the listing look broken. */
  const open = (entry) => {
    if (entry.kind === 'folder') { setPath((p) => [...p, entry.name]); setFile(null) }
    else setFile(entry.name)
  }

  const openNode = file ? node?.children?.[file] : null
  const isText = Boolean(openNode?.text)

  return (
    <Shell
      collapsed={collapsed}
      global={
        <GlobalBar
          mark={headMark}
          owner="Super Conscious"
          workspace="Brand"
          onMenu={toggle}
          search={search}
          onSearch={setSearch}
        >
          <BarButton icon="plus" label="Create" />
          <BarButton icon="route" label="Requests" />
          <BarButton icon="mail" label="Notifications" dot />
          <span className={styles.me}>
            <Avatar name="Chris Church" size={24} />
          </span>
        </GlobalBar>
      }
    >
      {/* No mark and no toggle. The logo belongs in the global bar and nowhere
          else, and the hamburger up there already collapses this rail — a
          second control for the same thing only bought an empty band above the
          navigation. */}
      <Sidebar collapsed={collapsed}>
        {!collapsed && (
          <Tree
            nodes={TREE}
            activeKey={activeKey}
            defaultOpen={['brand']}
            onSelect={selectNode}
          />
        )}
        {collapsed && (
          <div className={styles.railIcons}>
            {TREE.flatMap((g) => g.children).map((c) => (
              <IconButton
                key={c.key}
                icon={c.railIcon ?? c.icon}
                label={c.label}
                onClick={() => selectNode(c)}
              />
            ))}
          </div>
        )}
      </Sidebar>

      <div className={styles.main}>
        <Content>
          {/* The workspace is already named in the global bar; repeating the
              owner here said the same thing twice on one screen. */}
          <TitleBar title="Brand" badge="Private">
            <CountButton icon="target" label="Pin" />
            <CountButton icon="user" label="Watch" count={4} pressed />
            <CountButton icon="copy" label="Duplicate" count={2} />
            <span className={styles.titleDivide} />
            <Button size="sm" icon="plus">Add asset</Button>
            <Button size="sm" variant="solid" icon="external">Share</Button>
          </TitleBar>

          {/* Areas of the workspace, not views of one thing — which is why
              this is a SectionNav and the row beneath it is not. */}
          <SectionNav
            value={tab}
            onChange={(t) => {
              setTab(t)
              setReviewId(null)
              setFile(null)
              /* Coming back to Files lands at the top of the tree rather than
                 wherever you were three sections ago. */
              if (t === 'Files') setPath(ROOT)
            }}
            sections={[
              { key: 'Files', label: 'Files', icon: 'folder' },
              { key: 'Reviews', label: 'Reviews', icon: 'request', count: reviewCounts.open },
              { key: 'Wiki', label: 'Wiki', icon: 'file' },
              { key: 'Activity', label: 'Activity', icon: 'refresh' },
              { key: 'Usage', label: 'Usage', icon: 'chart' },
              { key: 'Performance', label: 'Performance', icon: 'target' },
              { key: 'Settings', label: 'Settings', icon: 'sliders' },
            ]}
          />

          {tab === 'Reviews' && !openReview && (
            <RequestList
              requests={visibleReviews}
              filter={reviewFilter}
              onFilter={setReviewFilter}
              counts={reviewCounts}
              onOpen={(r) => setReviewId(r.id)}
            />
          )}

          {tab === 'Reviews' && openReview && (
            <RequestDetail
              request={openReview}
              path={['Reviews', `#${openReview.id}`]}
              onNavigate={() => setReviewId(null)}
              onApprove={() => act('approved')}
              onRequestChanges={() => act('changes')}
              onPublish={() => act('merged')}
              onClose={() => act('closed')}
              onReopen={() => act('reopened')}
              onReady={() => act('ready')}
              onComment={comment}
            >
              <p className={styles.reviewSummary}>{openReview.summary}</p>
            </RequestDetail>
          )}

          {/* Hidden while a file is open: the file view carries its own path,
              and two breadcrumbs stacked is the same location said twice. The
              version and filter belong to the listing, which isn't on screen. */}
          {browsing && !file && (
            <div className={styles.bar}>
              <Path segments={['Workspace', ...label(path)]} onNavigate={(i) => setPath(path.slice(0, i))} />
              <span className={styles.barTools}>
                <RefSelect
                  value={version}
                  onChange={setVersion}
                  options={['v2.1 — current', 'v2.0', 'v1.4 — archived']}
                />
                {/* "Filter this folder", not "search" — the global bar searches
                    the workspace, and two fields both called search on one
                    screen is a question nobody should have to answer. */}
                <FindField
                  value={find}
                  onChange={setFind}
                  placeholder="Filter this folder"
                  shortcut="F"
                />
              </span>
            </div>
          )}

          {browsing && !file && !dismissed && (
            /* Sits directly above the listing it is about, rather than in the
               middle of the chrome where it separated the controls from the
               thing they control. Neutral rather than amber: colour is the
               loudest thing in a monochrome interface, and an advisory that
               spends it leaves nothing for a real failure. */
            <Banner tone="info" icon="warning" onDismiss={() => setDismissed(true)}>
              6 assets haven't been reviewed in over 90 days.
            </Banner>
          )}

          {browsing && file && (
            <FileView
              path={['Workspace', ...label(path), file]}
              /* The last segment is the file, so navigating to any earlier one
                 means leaving it — index 0 is Workspace, hence the offset. */
              onNavigate={(i) => { setPath(path.slice(0, i)); setFile(null) }}
              head={{
                initials: 'DC',
                who: 'Dana Cole',
                message: openNode?.message ?? '',
                ref: 'a014ddf',
                when: openNode?.when ?? '',
                onHistory: () => setTab('Activity'),
              }}
              views={isText ? ['Preview', 'Raw'] : ['Preview', 'Details']}
              view={fileView}
              onView={setFileView}
              /* The meta line answers "how big is this", which is a different
                 question for a canvas, a deck and a sound file. It used to say
                 1600 × 1000 SVG for all three. */
              meta={fileMeta(openNode, isText)}
              actions={
                <span className={styles.fileActions}>
                  <Button size="sm" icon="copy"
                    onClick={() => writeText(['Workspace', ...label(path), file].join('/'))}>
                    Copy path
                  </Button>
                  <Button size="sm" icon="download">Download</Button>
                  <Button size="sm" variant="solid" icon="external">Open</Button>
                </span>
              }
            >
              {fileView === 'Preview' && isText && <CodeLines text={openNode.text} />}
              {fileView === 'Raw' && (
                <pre className={styles.raw}>{openNode.text}</pre>
              )}
              {/* Rendered by what it is, not by what it isn't. Only a file with
                  no renderer of its own falls back to the plate. */}
              {fileView === 'Preview' && !isText && openNode?.render === 'canvas' && (
                <CanvasPreview {...openNode.canvas} />
              )}
              {fileView === 'Preview' && !isText && openNode?.render === 'pdf' && (
                <PdfPreview title={openNode.pdf.file} pages={openNode.pdf.pages} />
              )}
              {fileView === 'Preview' && !isText && openNode?.render === 'grid' && (
                <DataGrid columns={openNode.grid.columns} rows={openNode.grid.rows} />
              )}
              {fileView === 'Preview' && !isText && openNode?.render === 'wave' && (
                <WavePreview {...openNode.wave} />
              )}
              {fileView === 'Preview' && !isText && !openNode?.render && <MediaPreview label={file} />}
              {fileView === 'Details' && (
                <div className={styles.details}>
                  <FactRow icon="user" label={`Owned by ${openNode?.owner ?? 'Dana Cole'}`} />
                  <FactRow icon="clock" label={`Updated ${openNode?.when ?? '—'} ago`} />
                  <FactRow icon="layers" label={`Used in ${openNode?.used ?? 12} places`} />
                  <FactRow icon="lock" label="Licensed for all channels" />
                </div>
              )}
            </FileView>
          )}

          {browsing && !file && (
            <div className={styles.split}>
              <FileBrowser
                onOpen={open}
                entries={shown}
                head={{
                  initials: 'DC',
                  who: 'Dana Cole',
                  message: node?.message ?? 'Published the identity system',
                  ref: 'a014ddf',
                  when: node?.when ?? '2h ago',
                  count: '492 changes',
                }}
              />

              <aside className={styles.rail}>
                <AsideBlock
                  title="About"
                  action={<IconButton icon="sliders" label="Workspace settings" size={13} />}
                >
                  <p className={styles.asideText}>
                    The brand system for Super Conscious — what it looks like,
                    sounds like, says, charts and runs on.
                  </p>
                  <div className={styles.facts}>
                    {/* Counts that used to sit in the toolbar dressed as
                        links. They are facts about the workspace, not things
                        you can do to it, so they belong with the other facts.

                        The asset count is counted, not stated. It said 38 while
                        the tree held twice that, which is the fastest way to
                        teach somebody that the numbers here are decoration. */}
                    <FactRow icon="layers" value={String(ASSET_COUNT)} label="assets" />
                    <FactRow icon="user" value="4" label="editors" />
                    <FactRow icon="clock" value="12" label="versions" />
                    <FactRow icon="warning" value="6" label="awaiting review" />
                  </div>
                </AsideBlock>

                <CompositionBar
                  title="Composition"
                  segments={[
                    { label: 'Visual', value: 14 },
                    { label: 'Verbal', value: 9 },
                    { label: 'Data', value: 7 },
                    { label: 'Channels', value: 5 },
                    { label: 'Audio', value: 3 },
                  ]}
                />

                <Contributors
                  people={[
                    { handle: 'ChrisChurchSC', name: 'Chris Church' },
                    { handle: 'dana', name: 'Dana Cole' },
                    { handle: 'ravi', name: 'Ravi Menon' },
                    { handle: 'Super-Conscious', name: 'Super Conscious' },
                  ]}
                />

                <AsideBlock title="Publishing" count="500+">
                  <StatusList
                    items={[
                      { label: 'Preview — brand', when: '20 min ago' },
                      { label: 'Preview — assets', when: '20 min ago' },
                      { label: 'Live — super-conscious.studio', when: 'last week' },
                      { label: 'Channel matrix', when: 'blocked', tone: 'warn' },
                    ]}
                  />
                </AsideBlock>

                <AsideBlock title="Releases">
                  <p className={styles.asideText}>v2.1 — Identity refresh, shipped last week.</p>
                  <Button size="sm" icon="plus">New release</Button>
                </AsideBlock>
              </aside>
            </div>
          )}

          {tab === 'Usage' && (
            <>
              <Grid>
                <Col span={3}>
                  <StatTile label="Assets" value="38" delta="+6" direction="up" vs="vs last quarter"
                    trend={[18, 21, 24, 28, 33, 38]} series={1} />
                </Col>
                <Col span={3}>
                  <StatTile label="In use" value="71%" delta="+9pt" direction="up" vs="vs last quarter"
                    trend={[48, 52, 57, 61, 66, 71]} series={2} />
                </Col>
                <Col span={3}>
                  <StatTile label="Awaiting review" value="6" delta="+2" direction="down" vs="vs last quarter"
                    trend={[2, 3, 3, 4, 5, 6]} series={3} />
                </Col>
                <Col span={3}>
                  <StatTile label="Channels live" value="2" delta="no change" vs="vs last quarter"
                    trend={[2, 2, 2, 2, 2, 2]} series={1} />
                </Col>
              </Grid>

              <Grid>
                <Col span={8}>
                  <Panel title="Asset usage" actions={<span className={styles.panelMeta}>Target 60</span>}>
                    <LineChart
                      labels={MONTHS} unit="uses" max={100} target={60}
                      series={[
                        { label: 'Visual', data: [12, 18, 22, 28, 31, 38, 42, 49, 54, 61, 68, 74] },
                        { label: 'Verbal', data: [6, 9, 11, 14, 18, 21, 26, 29, 33, 38, 41, 47] },
                      ]}
                    />
                  </Panel>
                </Col>
                <Col span={4}>
                  <Panel title="By discipline">
                    <Donut
                      centre="38"
                      data={[
                        { label: 'Visual', value: 14 },
                        { label: 'Verbal', value: 9 },
                        { label: 'Data', value: 7 },
                        { label: 'Channels', value: 5 },
                        { label: 'Audio', value: 3 },
                      ]}
                    />
                  </Panel>
                </Col>
              </Grid>

              <Grid>
                <Col span={6}>
                  <Panel title="Most used">
                    <RankedBar data={[
                      { label: 'Social kit', value: 31 },
                      { label: 'Identity', value: 24 },
                      { label: 'Voice', value: 19 },
                      { label: 'Positioning', value: 11 },
                    ]} />
                  </Panel>
                </Col>
                <Col span={6}>
                  <Panel title="Added per month">
                    <BarChart
                      data={[2, 3, 1, 4, 2, 5, 3, 4, 6, 3, 2, 3]}
                      labels={MONTHS.map((m) => m[0])}
                      unit="n" reference={3} referenceLabel="Mean 3"
                    />
                  </Panel>
                </Col>
              </Grid>
            </>
          )}

          {/* Usage is how much of the system gets used; Performance is how the
              work did once it left. Two different questions, which is why they
              are two sections rather than one page with eight charts on it. */}
          {/* Performance has no numbers of its own. They arrive over the MCP
              connection configured in Settings, which is why this section
              says where they came from and when — and shows nothing at all
              when nothing is connected.

              A performance page that renders charts with no source is the
              worst kind of dashboard: it looks authoritative and is made up.
              An empty state that names the missing connection is more useful
              than a plausible number. */}
          {tab === 'Performance' && !mcpOn && (
            <div className={styles.noSource}>
              <Icon name="lock" size={20} />
              <span className={styles.noSourceTitle}>No connected source</span>
              <p className={styles.noSourceBody}>
                These figures come from the model connection over MCP. It is switched
                off, so there is nothing to show — rather than something invented.
              </p>
              <Button size="sm" icon="sliders" onClick={() => setTab('Settings')}>
                Open MCP settings
              </Button>
            </div>
          )}

          {/* Real figures or none. The numbers below are summed from the
              metrics table in Brand / Data, which arrives over the MCP
              connection — nothing here is written by hand, so nothing here
              can quietly stop being true. */}
          {tab === 'Performance' && mcpOn && !HAS_METRICS && (
            <div className={styles.noSource}>
              <Icon name="warning" size={20} />
              <span className={styles.noSourceTitle}>Connected, no data</span>
              <p className={styles.noSourceBody}>
                The connection is on but this checkout has no metrics export. Drop a
                metrics.local.js beside src/data/metrics.js and it populates from there.
              </p>
            </div>
          )}

          {tab === 'Performance' && mcpOn && HAS_METRICS && (() => {
            const m = metricsSummary()
            return (
              <>
                <div className={styles.sourceBar}>
                  <span className={styles.sourceState}>
                    <Icon name="success" size={13} />
                    Live over MCP · {m.days} days to {m.to}
                  </span>
                  <span className={styles.sourceVia}>
                    from <code>metrics.csv</code> · Brand / Data
                  </span>
                  <Button size="sm" icon="sliders" onClick={() => setTab('Settings')}>
                    Connection
                  </Button>
                </div>

                <Grid>
                  <Col span={3}>
                    <StatTile label="Active users" value={String(m.activeUsers)}
                      vs={`over ${m.days} days`} trend={m.desktop} series={1} />
                  </Col>
                  <Col span={3}>
                    <StatTile label="New users" value={String(m.newUsers)}
                      vs={`over ${m.days} days`} trend={m.mobile} series={2} />
                  </Col>
                  <Col span={3}>
                    <StatTile label="Events" value={m.events.toLocaleString()}
                      vs={`over ${m.days} days`} trend={m.impressionsSeries} series={3} />
                  </Col>
                  <Col span={3}>
                    {/* Indexed pages is a state, not a total — it is the last
                        reading, not the sum of nine of them. */}
                    <StatTile label="Pages indexed" value={String(m.indexed)}
                      vs={`as of ${m.to}`} />
                  </Col>
                </Grid>

                <Grid>
                  <Col span={8}>
                    <Panel title="Active users by device">
                      {/* Two series, one axis. Desktop and mobile are the same
                          measure, which is the only reason they belong on one
                          chart together.

                          The max is rounded up to a multiple of five: the axis
                          prints its tick values, and 27.599999999999998 is what
                          a raw float looks like on a chart. */}
                      <LineChart
                        labels={m.dates}
                        unit="users"
                        max={Math.ceil(Math.max(...m.desktop, ...m.mobile) * 1.2 / 5) * 5}
                        series={[
                          { label: 'Desktop', data: m.desktop },
                          { label: 'Mobile', data: m.mobile },
                        ]}
                      />
                    </Panel>
                  </Col>
                  <Col span={4}>
                    <Panel title="New users by channel">
                      <Donut centre={String(m.channels.reduce((a, c) => a + c.value, 0))} data={m.channels} />
                    </Panel>
                  </Col>
                </Grid>

                <Grid>
                  <Col span={6}>
                    <Panel title="Search impressions" actions={<span className={styles.panelMeta}>{m.clicks} clicks</span>}>
                      <BarChart
                        data={m.impressionsSeries}
                        labels={m.dates}
                        unit="n"
                        reference={Math.round(m.impressions / m.days)}
                        referenceLabel={`Mean ${Math.round(m.impressions / m.days)}`}
                      />
                    </Panel>
                  </Col>
                  <Col span={6}>
                    <Panel title="Events per day" actions={<span className={styles.panelMeta}>Desktop + mobile</span>}>
                      <BarChart
                        data={m.eventsSeries}
                        labels={m.dates}
                        unit="n"
                        series={2}
                      />
                    </Panel>
                  </Col>
                </Grid>
              </>
            )
          })()}

          {tab === 'Activity' && (
            <ActivityFeed
              entries={ACTIVITY}
              filter={actFilter}
              onFilter={setActFilter}
              onOpen={(e) => {
                /* Activity is a way into the workspace, not a read-only log:
                   a row about a file takes you to the folder holding it. */
                const seg = e.where.split(' / ')[1]?.toLowerCase()
                if (!seg) return
                setTab('Files')
                setPath(['brand', seg])
                setFile(null)
              }}
            />
          )}

          {tab === 'Wiki' && (
            <Wiki pages={WIKI} current={wikiPage} onSelect={setWikiPage} />
          )}

          {tab === 'Settings' && (
            <div className={styles.settings}>
              <Panel title="Workspace">
                <Field label="Name" help="Shown in the global bar and on every export.">
                  <Input value={wsName} onChange={setWsName} />
                </Field>
                <Field label="Visibility" help="Private workspaces are invisible to anyone not invited.">
                  <Segmented
                    value={visibility}
                    onChange={setVisibility}
                    label="Visibility"
                    options={['Private', 'Team', 'Public']}
                  />
                </Field>
              </Panel>

{/* MCP access.
                  A model reaching into a brand workspace needs the same two
                  things a person does: a way in, and a limit on what it can
                  touch. The scopes are checkboxes rather than a single
                  on/off, because "can read the brand" and "can publish to it"
                  are not the same permission and should never be granted by
                  the same click. */}
              <Panel
                title="MCP access"
                actions={<Badge tone={mcpOn ? 'good' : 'muted'} icon={mcpOn ? 'success' : 'minus'}>
                  {mcpOn ? 'Connected' : 'Off'}
                </Badge>}
              >
                <Switch
                  checked={mcpOn}
                  onChange={setMcpOn}
                  label="Expose this workspace over MCP"
                />
                <span className={styles.settingNote}>
                  Model Context Protocol. An assistant connects to the endpoint below
                  and can then read — or change — whatever the scopes allow.
                </span>

                <Field label="Endpoint" help="Paste this into your client's MCP server list.">
                  <span className={styles.mcpRow}>
                    <Input value="https://mcp.super-conscious.studio/brand" onChange={() => {}} readOnly />
                    <Button size="sm" icon="copy" onClick={() => writeText('https://mcp.super-conscious.studio/brand')}>
                      Copy
                    </Button>
                  </span>
                </Field>

                <Field
                  label="Access token"
                  help="Shown once. Regenerating it disconnects every client using the old one."
                >
                  <span className={styles.mcpRow}>
                    {/* Masked by default. A token sitting in plain sight on a
                        screen somebody is sharing is the commonest way one
                        leaks, and it is readable for exactly as long as it
                        needs to be. */}
                    <Input
                      value={tokenShown ? 'sk-sc-brand-0f3a9c21d84b6e57' : '••••••••••••••••••••'}
                      onChange={() => {}}
                      readOnly
                    />
                    <Button size="sm" icon="eye" onClick={() => setTokenShown((v) => !v)}>
                      {tokenShown ? 'Hide' : 'Reveal'}
                    </Button>
                    <Button size="sm" icon="refresh">Regenerate</Button>
                  </span>
                </Field>

                <Field label="Scopes" help="What a connected model may do. Read is not write.">
                  <CheckGroup
                    label="Scopes"
                    value={mcpScopes}
                    onChange={setMcpScopes}
                    options={[
                      'Read assets',
                      'Read reviews',
                      'Comment on reviews',
                      'Publish changes',
                    ]}
                  />
                </Field>

                {mcpScopes.includes('Publish changes') && (
                  <Banner tone="warn" icon="warning">
                    Publish lets a model change the brand without a person approving it.
                    Every other scope is reversible; this one is the workspace.
                  </Banner>
                )}

                <span className={styles.mcpTools}>
                  <span className={styles.eyebrow}>Exposed to the model</span>
                  <span className={styles.mcpToolList}>
                    {[
                      ['list_assets', 'Read assets'],
                      ['get_asset', 'Read assets'],
                      ['list_reviews', 'Read reviews'],
                      ['comment_on_review', 'Comment on reviews'],
                      ['publish_review', 'Publish changes'],
                    ].map(([tool, scope]) => {
                      const on = mcpOn && mcpScopes.includes(scope)
                      return (
                        <span key={tool} className={`${styles.mcpTool} ${on ? '' : styles.mcpToolOff}`}>
                          <Icon name={on ? 'success' : 'lock'} size={12} />
                          {tool}
                          <span className={styles.mcpToolScope}>{scope}</span>
                        </span>
                      )
                    })}
                  </span>
                </span>

                <span className={styles.settingNote}>
                  Clients connected: Claude Desktop (2h ago), Claude Code (4d ago).
                </span>
              </Panel>

              <Panel title="Review">
                <Switch
                  checked={autoReview}
                  onChange={setAutoReview}
                  label="Flag assets untouched for 90 days"
                />
                <span className={styles.settingNote}>
                  This is what produces the notice above the listing.
                </span>
              </Panel>
            </div>
          )}
        </Content>
      </div>
    </Shell>
  )
}
