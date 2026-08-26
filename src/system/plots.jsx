import s from './system.module.css'
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
    <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={label}>{children}</svg>
    {legend}
    {caption && <figcaption className={s.figCap}>{caption}</figcaption>}
  </figure>
)

/* ── Distribution ──────────────────────────────────────────────────────── */

/* Bars touch, because the x-axis is continuous. A histogram drawn with gaps
   reads as a bar chart of unrelated categories, which is the one thing it is
   not. */
export function Histogram({ bins, unit = '', caption }) {
  const max = Math.max(...bins.map((b) => b.value)) * 1.15 || 1
  const y = (v) => H - 34 - (v / max) * (H - 58)
  const step = (W - 56) / bins.length

  return (
    <Fig label="Distribution" caption={caption}>
      <Axis ticks={[0, Math.round(max / 2), Math.round(max)]} y={y} x0={44} x1={W - 6} unit={unit} />
      {bins.map((b, i) => (
        <rect key={b.label} x={48 + i * step} y={y(b.value)} width={step - 1} height={Math.max(0, y(0) - y(b.value))}
          fill={SERIES[0]} className={s.mark}>
          <title>{b.label}: {b.value}</title>
        </rect>
      ))}
      {bins.map((b, i) => (
        i % 2 === 0 && (
          <text key={b.label} x={48 + i * step} y={H - 12} className={s.axisText} textAnchor="middle">{b.label}</text>
        )
      ))}
    </Fig>
  )
}

/* Five numbers per group: the box is the middle half, the line inside is the
   median, and the whiskers are the range. A bar chart of averages hides all
   four of the other numbers. */
export function BoxPlot({ groups, max = 100, caption }) {
  const y = (v) => H - 34 - (v / max) * (H - 58)
  const step = (W - 70) / groups.length

  return (
    <Fig label="Distribution by group" caption={caption}>
      <Axis ticks={[0, max / 2, max]} y={y} x0={56} x1={W - 6} />
      {groups.map((g, i) => {
        const cx = 60 + i * step + step / 2
        const w = Math.min(30, step * 0.5)
        return (
          <g key={g.label}>
            <line x1={cx} x2={cx} y1={y(g.max)} y2={y(g.min)} className={s.whisker} />
            <line x1={cx - 6} x2={cx + 6} y1={y(g.max)} y2={y(g.max)} className={s.whisker} />
            <line x1={cx - 6} x2={cx + 6} y1={y(g.min)} y2={y(g.min)} className={s.whisker} />
            <rect x={cx - w / 2} y={y(g.q3)} width={w} height={Math.max(1, y(g.q1) - y(g.q3))}
              fill={SERIES[1]} className={s.mark}>
              <title>{g.label}: median {g.median}</title>
            </rect>
            <line x1={cx - w / 2} x2={cx + w / 2} y1={y(g.median)} y2={y(g.median)} className={s.median} />
            <text x={cx} y={H - 12} className={s.axisText} textAnchor="middle">{g.label}</text>
          </g>
        )
      })}
    </Fig>
  )
}

/* ── Correlation ───────────────────────────────────────────────────────── */

export function Scatter({ points, xMax = 100, yMax = 100, xLabel, yLabel, caption }) {
  const x = (v) => 56 + (v / xMax) * (W - 70)
  const y = (v) => H - 34 - (v / yMax) * (H - 58)

  return (
    <Fig label={`${yLabel ?? 'y'} against ${xLabel ?? 'x'}`} caption={caption}>
      <Axis ticks={[0, yMax / 2, yMax]} y={y} x0={50} x1={W - 6} unit={yLabel} />
      {points.map((p) => (
        <circle key={p.label} cx={x(p.x)} cy={y(p.y)} r="4" fill={SERIES[0]} className={s.dot}>
          <title>{p.label}: {p.x}, {p.y}</title>
        </circle>
      ))}
      {xLabel && <text x={W - 6} y={H - 12} className={s.axisText} textAnchor="end">{xLabel}</text>}
    </Fig>
  )
}

/* Area encodes the third measure, not radius — doubling a radius quadruples
   the ink and the reader reads the ink. */
export function Bubble({ points, xMax = 100, yMax = 100, rMax = 100, xLabel, yLabel, caption }) {
  const x = (v) => 56 + (v / xMax) * (W - 70)
  const y = (v) => H - 34 - (v / yMax) * (H - 58)
  const r = (v) => 4 + Math.sqrt(v / rMax) * 16

  return (
    <Fig label="Three measures" caption={caption}>
      <Axis ticks={[0, yMax / 2, yMax]} y={y} x0={50} x1={W - 6} unit={yLabel} />
      {points.map((p) => (
        <circle key={p.label} cx={x(p.x)} cy={y(p.y)} r={r(p.r)} fill={SERIES[1]} className={s.bubble}>
          <title>{p.label}: {p.x}, {p.y}, {p.r}</title>
        </circle>
      ))}
      {xLabel && <text x={W - 6} y={H - 12} className={s.axisText} textAnchor="end">{xLabel}</text>}
    </Fig>
  )
}

/* ── Comparison between two points ─────────────────────────────────────── */

/* A dot on a line beats a bar when you are reading position rather than
   magnitude: the ink is where the value is, and nowhere else. */
export function DotPlot({ rows, max = 100, caption }) {
  const x = (v) => 96 + (v / max) * (W - 116)
  return (
    <Fig label="Ranked values" caption={caption}>
      {rows.map((r, i) => {
        const cy = 20 + i * 30
        return (
          <g key={r.label}>
            <text x="0" y={cy + 4} className={s.axisText}>{r.label}</text>
            <line x1="96" x2={W - 20} y1={cy} y2={cy} className={s.grid} />
            <circle cx={x(r.value)} cy={cy} r="5" fill={SERIES[0]} className={s.dot} />
            <text x={W - 14} y={cy + 4} className={s.valueText} textAnchor="end">{r.value}</text>
          </g>
        )
      })}
    </Fig>
  )
}

/* Two dots and the gap between them. The gap is the finding, so it is drawn as
   a bar rather than left for the reader to measure. */
export function Dumbbell({ rows, max = 100, labels = ['Before', 'After'], caption }) {
  const x = (v) => 96 + (v / max) * (W - 116)
  return (
    <Fig
      label="Change between two points"
      caption={caption}
      legend={<Legend items={[{ label: labels[0], colour: SERIES[2] }, { label: labels[1], colour: SERIES[0] }]} />}
    >
      {rows.map((r, i) => {
        const cy = 20 + i * 30
        return (
          <g key={r.label}>
            <text x="0" y={cy + 4} className={s.axisText}>{r.label}</text>
            <line x1={x(r.from)} x2={x(r.to)} y1={cy} y2={cy} className={s.connector} />
            <circle cx={x(r.from)} cy={cy} r="4.5" fill={SERIES[2]} className={s.dot} />
            <circle cx={x(r.to)} cy={cy} r="4.5" fill={SERIES[0]} className={s.dot} />
            <text x={W - 14} y={cy + 4} className={s.valueText} textAnchor="end">
              {r.to - r.from > 0 ? '+' : ''}{r.to - r.from}
            </text>
          </g>
        )
      })}
    </Fig>
  )
}

/* Rank change between two moments. The lines crossing is the whole point, so
   nothing else on the chart is allowed to be busy. */
export function SlopeChart({ rows, left = 'Then', right = 'Now', max = 100, caption }) {
  const y = (v) => H - 34 - (v / max) * (H - 62)
  return (
    <Fig label={`${left} against ${right}`} caption={caption}>
      <line x1="90" x2="90" y1="14" y2={H - 30} className={s.spine} />
      <line x1={W - 90} x2={W - 90} y1="14" y2={H - 30} className={s.spine} />
      <text x="90" y={H - 12} className={s.axisText} textAnchor="middle">{left}</text>
      <text x={W - 90} y={H - 12} className={s.axisText} textAnchor="middle">{right}</text>
      {rows.map((r, i) => (
        <g key={r.label}>
          <line x1="90" x2={W - 90} y1={y(r.from)} y2={y(r.to)} stroke={SERIES[i % 3]} strokeWidth="1.5" />
          <circle cx="90" cy={y(r.from)} r="3" fill={SERIES[i % 3]} />
          <circle cx={W - 90} cy={y(r.to)} r="3" fill={SERIES[i % 3]} />
          <text x="84" y={y(r.from) + 3} className={s.axisText} textAnchor="end">{r.label}</text>
          <text x={W - 84} y={y(r.to) + 3} className={s.valueText}>{r.to}</text>
        </g>
      ))}
    </Fig>
  )
}

/* ── Over time ─────────────────────────────────────────────────────────── */

/* Steps, not a slope. A value that holds until it changes did not drift
   between the two readings, and a diagonal line says it did. */
export function StepLine({ data, labels, max = 100, unit = '', caption }) {
  const x = (i) => 52 + (i / data.length) * (W - 66)
  const y = (v) => H - 34 - (v / max) * (H - 58)
  let d = ''
  data.forEach((v, i) => {
    d += `${i ? 'L' : 'M'}${x(i)},${y(v)} L${x(i + 1)},${y(v)}`
  })

  return (
    <Fig label="Stepped series" caption={caption}>
      <Axis ticks={[0, max / 2, max]} y={y} x0={46} x1={W - 6} unit={unit} />
      <path d={d} fill="none" stroke={SERIES[0]} strokeWidth="1.5" />
      {labels.map((l, i) => (
        i % 2 === 0 && <text key={l + i} x={x(i)} y={H - 12} className={s.axisText} textAnchor="middle">{l}</text>
      ))}
    </Fig>
  )
}

/* One series with its own band of uncertainty. The band is the same hue at low
   opacity rather than a second colour, because it is the same measure. */
export function TimeSeries({ data, band, labels, max = 100, unit = '', caption }) {
  const x = (i) => 52 + (i / (data.length - 1)) * (W - 66)
  const y = (v) => H - 34 - (v / max) * (H - 58)
  const area = band
    ? `${band.map((b, i) => `${i ? 'L' : 'M'}${x(i)},${y(b[1])}`).join(' ')} ${[...band].reverse().map((b, i) => `L${x(band.length - 1 - i)},${y(b[0])}`).join(' ')} Z`
    : null

  return (
    <Fig label="Series over time" caption={caption}>
      <Axis ticks={[0, max / 2, max]} y={y} x0={46} x1={W - 6} unit={unit} />
      {area && <path d={area} fill={SERIES[1]} className={s.bandFill} />}
      <path d={data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} fill="none" stroke={SERIES[0]} strokeWidth="1.5" />
      {labels.map((l, i) => (
        i % 2 === 0 && <text key={l + i} x={x(i)} y={H - 12} className={s.axisText} textAnchor="middle">{l}</text>
      ))}
    </Fig>
  )
}

/* Composition over time, so the sequential ramp rather than the categorical
   slots — the bands are parts of one total, not rival series. */
export function StackedArea({ series, labels, max = 100, unit = '', caption }) {
  const x = (i) => 52 + (i / (labels.length - 1)) * (W - 66)
  const y = (v) => H - 34 - (v / max) * (H - 58)
  const running = labels.map(() => 0)

  const bands = series.map((set, si) => {
    const lower = [...running]
    set.data.forEach((v, i) => { running[i] += v })
    const upper = [...running]
    const d = `${upper.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} ${[...lower].reverse().map((v, i) => `L${x(lower.length - 1 - i)},${y(v)}`).join(' ')} Z`
    return { d, colour: RAMP[Math.max(0, 4 - si)], label: set.label }
  })

  return (
    <Fig
      label="Composition over time"
      caption={caption}
      legend={<Legend items={bands.map((b) => ({ label: b.label, colour: b.colour }))} />}
    >
      <Axis ticks={[0, max / 2, max]} y={y} x0={46} x1={W - 6} unit={unit} />
      {bands.map((b) => <path key={b.label} d={b.d} fill={b.colour} className={s.mark} />)}
      {labels.map((l, i) => (
        i % 2 === 0 && <text key={l + i} x={x(i)} y={H - 12} className={s.axisText} textAnchor="middle">{l}</text>
      ))}
    </Fig>
  )
}

/* A 2px surface gap between segments, so two adjacent parts never read as one
   longer one. */
export function StackedBar({ rows, parts, caption }) {
  const max = Math.max(...rows.map((r) => r.values.reduce((a, b) => a + b, 0))) || 1
  const scale = (v) => (v / max) * (W - 130)

  return (
    <Fig
      label="Composition by row"
      caption={caption}
      legend={<Legend items={parts.map((p, i) => ({ label: p, colour: RAMP[Math.max(0, 4 - i)] }))} />}
    >
      {rows.map((r, i) => {
        const cy = 18 + i * 32
        let acc = 96
        return (
          <g key={r.label}>
            <text x="0" y={cy + 12} className={s.axisText}>{r.label}</text>
            {r.values.map((v, k) => {
              const wpx = scale(v)
              const seg = (
                <rect key={parts[k]} x={acc} y={cy} width={Math.max(0, wpx - 2)} height="16"
                  fill={RAMP[Math.max(0, 4 - k)]} className={s.mark}>
                  <title>{r.label} · {parts[k]}: {v}</title>
                </rect>
              )
              acc += wpx
              return seg
            })}
            <text x={W - 8} y={cy + 12} className={s.valueText} textAnchor="end">
              {r.values.reduce((a, b) => a + b, 0)}
            </text>
          </g>
        )
      })}
    </Fig>
  )
}

/* ── Sequences that add up ─────────────────────────────────────────────── */

/* Every bar starts where the last one ended, and the totals sit on the
   baseline. Colour carries direction, and the sign is on the label too — the
   two are never left to colour alone. */
export function Waterfall({ steps, max = 100, unit = '', caption }) {
  const y = (v) => H - 34 - (v / max) * (H - 58)
  const step = (W - 56) / steps.length
  let acc = 0

  return (
    <Fig label="Bridge between two totals" caption={caption}>
      <Axis ticks={[0, max / 2, max]} y={y} x0={44} x1={W - 6} unit={unit} />
      {steps.map((st, i) => {
        const isBase = st.kind === 'base'
        const from = isBase ? 0 : acc
        const to = isBase ? st.value : acc + st.value
        if (!isBase) acc = to
        else acc = st.value
        const top = Math.max(from, to)
        const bottom = Math.min(from, to)
        return (
          <g key={st.label}>
            <rect
              x={48 + i * step} y={y(top)} width={step * 0.62} height={Math.max(1, y(bottom) - y(top))}
              fill={isBase ? 'var(--sc-fill-hover)' : st.value >= 0 ? SERIES[1] : SERIES[2]}
              className={s.mark}
            >
              <title>{st.label}: {st.value > 0 && !isBase ? '+' : ''}{st.value}</title>
            </rect>
            <text x={48 + i * step + step * 0.31} y={H - 12} className={s.axisText} textAnchor="middle">
              {st.label}
            </text>
          </g>
        )
      })}
    </Fig>
  )
}

/* Each stage as a share of the one above it, not of the top — "34% of the
   people who enquired called" is the number somebody can act on. */
export function Funnel({ steps, caption }) {
  const top = steps[0]?.value || 1
  return (
    <Fig label="Conversion between stages" caption={caption}>
      {steps.map((st, i) => {
        const cy = 12 + i * 30
        const wpx = (st.value / top) * (W - 140)
        const prev = i ? steps[i - 1].value : null
        return (
          <g key={st.label}>
            <text x="0" y={cy + 13} className={s.axisText}>{st.label}</text>
            <rect x="96" y={cy} width={Math.max(2, wpx)} height="18" fill={RAMP[Math.max(0, 4 - i)]} className={s.mark}>
              <title>{st.label}: {st.value}</title>
            </rect>
            <text x={100 + Math.max(2, wpx)} y={cy + 13} className={s.valueText}>
              {st.value.toLocaleString()}
            </text>
            {prev && (
              <text x={W - 6} y={cy + 13} className={s.axisText} textAnchor="end">
                {((st.value / prev) * 100).toFixed(1)}%
              </text>
            )}
          </g>
        )
      })}
    </Fig>
  )
}

/* Bars ranked, with the running share as a line. The 80% rule is only visible
   with the cumulative curve on it, which is the entire reason this is not just
   a ranked bar chart. */
export function Pareto({ data, caption }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1
  const max = Math.max(...data.map((d) => d.value)) * 1.15
  const y = (v) => H - 34 - (v / max) * (H - 58)
  const yPct = (p) => H - 34 - (p / 100) * (H - 58)
  const step = (W - 66) / data.length
  let acc = 0
  const curve = data.map((d, i) => {
    acc += d.value
    return `${i ? 'L' : 'M'}${52 + i * step + step * 0.31},${yPct((acc / total) * 100)}`
  }).join(' ')

  return (
    <Fig label="Ranked with cumulative share" caption={caption}>
      <Axis ticks={[0, Math.round(max / 2), Math.round(max)]} y={y} x0={46} x1={W - 6} />
      {data.map((d, i) => (
        <rect key={d.label} x={52 + i * step} y={y(d.value)} width={step * 0.62} height={Math.max(0, y(0) - y(d.value))}
          fill={SERIES[0]} className={s.mark}>
          <title>{d.label}: {d.value}</title>
        </rect>
      ))}
      <path d={curve} fill="none" className={s.refCurve} />
      <line x1="46" x2={W - 6} y1={yPct(80)} y2={yPct(80)} className={s.refLine} />
      <text x={W - 6} y={yPct(80) - 5} className={s.refText} textAnchor="end">80%</text>
      {data.map((d, i) => (
        <text key={d.label} x={52 + i * step + step * 0.31} y={H - 12} className={s.axisText} textAnchor="middle">
          {d.label.slice(0, 4)}
        </text>
      ))}
    </Fig>
  )
}

/* ── Against a target ──────────────────────────────────────────────────── */

/* One row per measure: the bar is actual, the tick is target, the band behind
   is the range. Four gauges take four times the room and say less. */
export function Bullet({ rows, caption }) {
  const x = (v, max) => 96 + (v / max) * (W - 116)
  return (
    <Fig label="Actual against target" caption={caption}>
      {rows.map((r, i) => {
        const cy = 16 + i * 34
        return (
          <g key={r.label}>
            <text x="0" y={cy + 11} className={s.axisText}>{r.label}</text>
            <rect x="96" y={cy} width={W - 116} height="14" fill="var(--sc-fill-faint)" />
            <rect x="96" y={cy + 3} width={x(r.value, r.max) - 96} height="8"
              fill={r.value >= r.target ? SERIES[1] : SERIES[0]} className={s.mark}>
              <title>{r.label}: {r.value} against {r.target}</title>
            </rect>
            <line x1={x(r.target, r.max)} x2={x(r.target, r.max)} y1={cy - 2} y2={cy + 16} className={s.targetTick} />
            <text x={W - 8} y={cy + 11} className={s.valueText} textAnchor="end">{r.value}</text>
          </g>
        )
      })}
    </Fig>
  )
}

/* Mean and the control limits drawn, because a point outside them is the only
   thing on this chart worth acting on. */
export function ControlChart({ data, labels, mean, sigma, max = 100, caption }) {
  const x = (i) => 52 + (i / (data.length - 1)) * (W - 66)
  const y = (v) => H - 34 - (v / max) * (H - 58)

  return (
    <Fig label="Process against control limits" caption={caption}>
      <Axis ticks={[0, max / 2, max]} y={y} x0={46} x1={W - 6} />
      <rect x="46" y={y(mean + sigma)} width={W - 52} height={Math.max(0, y(mean - sigma) - y(mean + sigma))}
        fill={SERIES[1]} className={s.bandFill} />
      <line x1="46" x2={W - 6} y1={y(mean)} y2={y(mean)} className={s.refLine} />
      <text x={W - 6} y={y(mean) - 5} className={s.refText} textAnchor="end">Mean {mean}</text>
      <path d={data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} fill="none" stroke={SERIES[0]} strokeWidth="1.5" />
      {data.map((v, i) => {
        const out = v > mean + sigma * 2 || v < mean - sigma * 2
        return (
          <circle key={i} cx={x(i)} cy={y(v)} r={out ? 5 : 2.5} fill={out ? 'var(--sc-bad)' : SERIES[0]} className={s.dot}>
            <title>{labels[i]}: {v}{out ? ' — outside limits' : ''}</title>
          </circle>
        )
      })}
    </Fig>
  )
}

/* ── Shape ─────────────────────────────────────────────────────────────── */

/* Squarified enough to read. A treemap is for "which of these is big", never
   for comparing two areas precisely — that is what a bar is for. */
export function Treemap({ data, caption }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1
  const rows = []
  let row = []
  let acc = 0
  data.forEach((d) => {
    row.push(d)
    acc += d.value
    if (acc / total > 0.5 || row.length === 3) { rows.push(row); row = []; acc = 0 }
  })
  if (row.length) rows.push(row)

  const rowTotals = rows.map((r) => r.reduce((a, d) => a + d.value, 0))
  const grand = rowTotals.reduce((a, b) => a + b, 0) || 1
  let yAcc = 0

  return (
    <Fig label="Relative size" caption={caption}>
      {rows.map((r, ri) => {
        const rh = (rowTotals[ri] / grand) * (H - 20)
        const yTop = yAcc
        yAcc += rh
        let xAcc = 0
        return (
          <g key={ri}>
            {r.map((d, di) => {
              const cw = (d.value / rowTotals[ri]) * W
              const cx = xAcc
              xAcc += cw
              return (
                <g key={d.label}>
                  <rect x={cx} y={yTop} width={Math.max(0, cw - 2)} height={Math.max(0, rh - 2)}
                    fill={RAMP[Math.max(0, 4 - (ri * 3 + di))]} className={s.mark}>
                    <title>{d.label}: {d.value}</title>
                  </rect>
                  {cw > 54 && rh > 26 && (
                    <>
                      <text x={cx + 8} y={yTop + 18} className={s.treeLabel}>{d.label}</text>
                      <text x={cx + 8} y={yTop + 32} className={s.valueText}>{d.value}</text>
                    </>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </Fig>
  )
}

/* Intensity over a calendar. One hue, five steps — a heatmap on a categorical
   palette is unreadable because the reader has to learn an order that the
   colours do not have. */
export function CalendarHeat({ weeks, max = 10, caption }) {
  const cell = 13
  const gap = 3
  return (
    <Fig label="Activity by day" caption={caption}>
      {weeks.map((week, wi) =>
        week.map((v, di) => (
          <rect
            key={`${wi}-${di}`}
            x={wi * (cell + gap)} y={20 + di * (cell + gap)}
            width={cell} height={cell} rx="1"
            fill={v === 0 ? 'var(--sc-q0)' : RAMP[Math.min(4, Math.floor((v / max) * 5))]}
            className={s.mark}
          >
            <title>{v} on day {di + 1}, week {wi + 1}</title>
          </rect>
        )),
      )}
      {['M', 'W', 'F'].map((d, i) => (
        <text key={d} x={weeks.length * (cell + gap) + 6} y={31 + i * 2 * (cell + gap)} className={s.axisText}>{d}</text>
      ))}
    </Fig>
  )
}

/* Retention by cohort. Reads down for "does this get better as we learn" and
   across for "how long do they stay" — which is why it is a grid rather than
   a set of lines. */
export function Cohort({ rows, caption }) {
  const cw = (W - 90) / (rows[0]?.cells.length || 1)
  return (
    <Fig label="Retention by cohort" caption={caption}>
      {rows[0]?.cells.map((_, i) => (
        <text key={i} x={90 + i * cw + cw / 2} y="12" className={s.axisText} textAnchor="middle">M{i}</text>
      ))}
      {rows.map((r, ri) => (
        <g key={r.label}>
          <text x="0" y={34 + ri * 26} className={s.axisText}>{r.label}</text>
          {r.cells.map((v, ci) => (
            <g key={ci}>
              <rect x={90 + ci * cw} y={22 + ri * 26} width={cw - 2} height="22"
                fill={v === null ? 'transparent' : RAMP[Math.min(4, Math.floor((v / 100) * 5))]} className={s.mark}>
                {v !== null && <title>{r.label}, month {ci}: {v}%</title>}
              </rect>
              {v !== null && (
                <text x={90 + ci * cw + cw / 2 - 1} y={37 + ri * 26} className={s.cellText} textAnchor="middle">{v}</text>
              )}
            </g>
          ))}
        </g>
      ))}
    </Fig>
  )
}

/* Bars on a shared timeline. Done is filled, in-flight is outlined, so
   progress is legible without a second colour. */
export function Gantt({ tasks, span = 12, labels, caption }) {
  const x = (v) => 96 + (v / span) * (W - 110)
  return (
    <Fig label="Schedule" caption={caption}>
      {labels?.map((l, i) => (
        <text key={l + i} x={x(i)} y="12" className={s.axisText} textAnchor="middle">{l}</text>
      ))}
      {tasks.map((t, i) => {
        const cy = 22 + i * 26
        return (
          <g key={t.label}>
            <text x="0" y={cy + 12} className={s.axisText}>{t.label}</text>
            <rect x={x(t.start)} y={cy} width={Math.max(2, x(t.start + t.span) - x(t.start))} height="15" rx="1"
              fill={t.done ? SERIES[1] : 'transparent'}
              className={t.done ? s.mark : s.ganttOpen}>
              <title>{t.label}: {t.span} weeks from week {t.start}</title>
            </rect>
          </g>
        )
      })}
    </Fig>
  )
}

/* One shape repeated, one scale shared. The comparison is between panels, so
   a panel with its own axis would make every comparison a lie. */
export function SmallMultiples({ panels, max = 100, caption }) {
  const pw = W / panels.length
  return (
    <Fig label="Small multiples" caption={caption}>
      {panels.map((p, pi) => {
        const x0 = pi * pw
        const x = (i) => x0 + 6 + (i / (p.data.length - 1)) * (pw - 18)
        const y = (v) => H - 30 - (v / max) * (H - 60)
        return (
          <g key={p.label}>
            <line x1={x0 + 6} x2={x0 + pw - 12} y1={y(0)} y2={y(0)} className={s.spine} />
            <path d={p.data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')}
              fill="none" stroke={SERIES[0]} strokeWidth="1.5" />
            <text x={x0 + 6} y={H - 12} className={s.axisText}>{p.label}</text>
          </g>
        )
      })}
    </Fig>
  )
}
