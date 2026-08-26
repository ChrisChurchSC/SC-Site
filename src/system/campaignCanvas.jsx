import { useMemo, useState } from 'react'
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

/* Real measurements from the original, kept rather than re-guessed: an
   audience card is the anchor of a whole journey and is sized to read that
   way, and a message card is wider than it is tall because it holds a line of
   copy, not a label. */
const AUD_W = 440
const AUD_H = 168
const MSG_W = 500
const MSG_H = 132
const SPINE_W = 260
const SPINE_H = 96
const MSG_GAP = 64
const COL_GAP = 80
const BAND_PAD = 96
const BAND_BOTTOM_PAD = 64
/* Past this, message cards show their full breakdown instead of one line —
   read everything without leaving the map. */
const DETAIL_ZOOM = 1.15

const LANE = Math.max(AUD_W, MSG_W)
const PITCH = LANE + COL_GAP
/* A left gutter the stage labels live in. Without it the label sits at the
   band's top-left corner, which is exactly where the first card in the first
   lane goes — so every stage but the emptiest one was unreadable. */
const GUTTER = 200

export const FUNNEL_STAGES = [
  { stage: 'awareness', label: 'Awareness', hint: 'Reach new audiences' },
  { stage: 'consideration', label: 'Consideration', hint: 'Educate & nurture interest' },
  { stage: 'conversion', label: 'Conversion', hint: 'Capture intent & convert' },
  { stage: 'retention', label: 'Retention', hint: 'Keep & grow customers' },
]

/* Auto-layout. The hierarchy owns the positions: a spine down the middle, one
   lane per audience, and every message in the band its funnel stage says. */
function layout(nodes) {
  const spine = nodes.filter((n) => n.kind === 'brand' || n.kind === 'strategy')
  const audiences = nodes.filter((n) => n.kind === 'audience')
  const messages = nodes.filter((n) => n.kind === 'message')

  const boxes = new Map()
  const width = GUTTER + Math.max(audiences.length * PITCH - COL_GAP, LANE)
  const laneX = (i) => GUTTER + i * PITCH + (LANE - AUD_W) / 2

  let y = 0
  spine.forEach((n) => {
    boxes.set(n.id, { ...n, x: GUTTER + (width - GUTTER - SPINE_W) / 2, y, w: SPINE_W, h: SPINE_H })
    y += SPINE_H + MSG_GAP
  })

  const audTop = y
  audiences.forEach((n, i) => {
    boxes.set(n.id, { ...n, x: laneX(i), y: audTop, w: AUD_W, h: AUD_H })
  })

  /* Bands are sized by their fullest cell, so a stage with four messages in
     one lane does not overlap the stage beneath it. */
  let bandTop = audTop + AUD_H + BAND_PAD
  const bands = []
  FUNNEL_STAGES.forEach((st) => {
    const inStage = messages.filter((m) => m.stage === st.stage)
    if (inStage.length === 0) return
    const deepest = Math.max(
      ...audiences.map((a) => inStage.filter((m) => m.parent === a.id).length),
      1,
    )
    const h = deepest * MSG_H + (deepest - 1) * MSG_GAP + BAND_BOTTOM_PAD
    bands.push({ ...st, y: bandTop, h })

    audiences.forEach((a, i) => {
      inStage
        .filter((m) => m.parent === a.id)
        .forEach((m, k) => {
          boxes.set(m.id, {
            ...m,
            x: GUTTER + i * PITCH + (LANE - MSG_W) / 2,
            y: bandTop + k * (MSG_H + MSG_GAP),
            w: MSG_W,
            h: MSG_H,
          })
        })
    })
    bandTop += h
  })

  return { boxes, bands, width, height: bandTop }
}

export function CampaignCanvas({ canvas, onOpen, dense }) {
  const [zoom, setZoom] = useState(dense ? 0.42 : 0.5)
  const [picked, setPicked] = useState(null)

  const { boxes, bands, width, height } = useMemo(() => layout(canvas.nodes), [canvas.nodes])

  /* An edge is derived from the hierarchy rather than authored, so it cannot
     point at something the layout does not agree with. */
  const edges = useMemo(() => {
    const out = []
    for (const n of boxes.values()) {
      if (!n.parent) continue
      const p = boxes.get(n.parent)
      if (!p) continue
      out.push({
        id: `${p.id}->${n.id}`,
        x1: p.x + p.w / 2,
        y1: p.y + p.h,
        x2: n.x + n.w / 2,
        y2: n.y,
        broken: Boolean(n.flagged),
      })
    }
    return out
  }, [boxes])

  const detail = zoom >= DETAIL_ZOOM
  const node = picked ? boxes.get(picked) : null
  const flagged = [...boxes.values()].filter((n) => n.flagged)

  return (
    <div className={s.cvWrap}>
      <div className={s.canvasBar}>
        <span className={s.canvasName}>
          <Icon name="route" size={13} />{canvas.label} · {canvas.nodes.length} nodes
          {flagged.length > 0 && (
            <span className={s.cvFlagCount}>
              <Icon name="warning" size={12} />{flagged.length} to resolve
            </span>
          )}
        </span>

        <span className={s.cvTools}>
          <span className={s.canvasPicked}>
            {node ? <>{node.label} <span className={s.canvasDims}>{node.kind}</span></> : 'Nothing selected'}
          </span>
          <span className={s.cvZoom}>
            <button type="button" className={s.cvZoomBtn} aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.15).toFixed(2)))}>
              <Icon name="minus" size={13} />
            </button>
            <span className={s.cvZoomLevel}>{Math.round(zoom * 100)}%</span>
            <button type="button" className={s.cvZoomBtn} aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}>
              <Icon name="plus" size={13} />
            </button>
          </span>
          {onOpen && (
            <a className={s.cvOpen} href={onOpen} target="_blank" rel="noreferrer">
              <Icon name="external" size={13} />Open
            </a>
          )}
        </span>
      </div>

      <div className={s.cvViewport}>
        <div
          className={s.cvSurface}
          style={{ width: width * zoom, height: height * zoom }}
        >
          <div
            className={s.cvScale}
            style={{ width, height, transform: `scale(${zoom})` }}
          >
            {/* Bands first: they are the ground the hierarchy is read against,
                and a stage with nothing in it is a finding, not a gap. */}
            {bands.map((b) => (
              <div key={b.stage} className={s.cvBand} style={{ top: b.y, height: b.h, width }}>
                <span className={s.cvBandLabel}>
                  {b.label}
                  <span className={s.cvBandHint}>{b.hint}</span>
                </span>
              </div>
            ))}

            <svg className={s.cvEdges} width={width} height={height} aria-hidden="true">
              <defs>
                {/* The coherent thread runs the accents, tiled and translated
                    downward so the colour flows down the connectors like a
                    current. The tile loops back so the scroll is seamless. */}
                <linearGradient id="sc-cv-thread" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="520" spreadMethod="repeat">
                  <stop offset="0" stopColor="var(--sc-pink)" />
                  <stop offset="0.5" stopColor="var(--sc-purple)" />
                  <stop offset="1" stopColor="var(--sc-pink)" />
                  <animateTransform attributeName="gradientTransform" attributeType="XML"
                    type="translate" from="0 0" to="0 520" dur="6s" repeatCount="indefinite" />
                </linearGradient>
              </defs>
              {edges.map((e) => {
                /* Control points: the curve always exits the parent straight
                   DOWN and enters the child from above, so a connector never
                   bows up over its card. Straight from the original. */
                const mid = (e.y1 + e.y2) / 2
                const c1 = Math.max(mid, e.y1 + 26)
                const c2 = Math.min(mid, e.y2 - 26)
                return (
                  <path
                    key={e.id}
                    className={`${s.cvEdge} ${e.broken ? s.cvEdgeBroken : ''}`}
                    d={`M ${e.x1} ${e.y1} C ${e.x1} ${c1}, ${e.x2} ${c2}, ${e.x2} ${e.y2}`}
                    fill="none"
                  />
                )
              })}
            </svg>

            {[...boxes.values()].map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={picked === n.id}
                className={`${s.cvNode} ${s[`cvNode${n.kind}`]} ${picked === n.id ? s.cvNodeOn : ''} ${n.flagged ? s.cvNodeFlagged : ''}`}
                style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
                onClick={() => setPicked(picked === n.id ? null : n.id)}
              >
                <span className={s.cvNodeHead}>
                  <Icon name={KIND_ICON[n.kind] ?? 'file'} size={13} />
                  <span className={s.cvNodeKind}>{n.channel ?? n.kind}</span>
                  {n.flagged && (
                    <span className={s.cvNodeFlag}><Icon name="warning" size={12} />{n.flagged}</span>
                  )}
                </span>
                <span className={s.cvNodeTitle}>{n.label}</span>
                {/* Past the detail threshold a message shows every component;
                    below it, one line. Same card, two densities. */}
                {n.meta && !detail && <span className={s.cvNodeLine}>{n.meta[0]}</span>}
                {n.meta && detail && (
                  <span className={s.cvNodeBreakdown}>
                    {n.meta.map((m) => <span key={m} className={s.cvNodeLine}>{m}</span>)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const KIND_ICON = {
  brand: 'brand',
  strategy: 'target',
  audience: 'user',
  message: 'comment',
}
