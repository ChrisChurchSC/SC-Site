import { useState } from 'react'
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

const SERIES = ['var(--sc-s1)', 'var(--sc-s2)', 'var(--sc-s3)']

/* Ticks as well as gridlines: a gridline helps you read across, a tick says
   exactly where the value sits. Spines are drawn, because a plot with a
   baseline is a measurement and one without is a picture of data. */
function Axis({ ticks, y, x0, x1, unit }) {
  const base = ticks[0]
  const top = ticks[ticks.length - 1]
  return (
    <g>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} className={s.grid} />
          <line x1={x0 - 4} x2={x0} y1={y(v)} y2={y(v)} className={s.tick} />
          <text x={x0 - 7} y={y(v) + 2.5} className={s.axisText} textAnchor="end">{v}</text>
        </g>
      ))}
      <line x1={x0} x2={x0} y1={y(top)} y2={y(base)} className={s.spine} />
      <line x1={x0} x2={x1} y1={y(base)} y2={y(base)} className={s.spine} />
      {unit && <text x={x0 - 7} y={y(top) - 9} className={s.unitText} textAnchor="end">{unit}</text>}
    </g>
  )
}

/* Always present for two or more series, so identity is never colour alone. */
/* A reference line gets a dashed rule in the legend rather than a filled
   swatch, because that is what it is on the chart. A target drawn as a solid
   block reads as a fourth series. */
export function Legend({ items }) {
  return (
    <div className={s.legend}>
      {items.map(({ label, colour, dashed }) => (
        <span key={label} className={s.legendKey}>
          <span
            className={dashed ? s.legendDash : s.legendSwatch}
            style={dashed ? { borderColor: colour } : { background: colour }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}

export function Sparkline({ data, series = 1, width = 80, height = 24 }) {
  if (!data?.length) return null
  const max = Math.max(...data) * 1.15 || 1
  const d = data
    .map((v, i) => `${i ? 'L' : 'M'}${(i / (data.length - 1)) * width},${height - 2 - (v / max) * (height - 4)}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={s.svg} aria-hidden="true">
      <path d={d} fill="none" stroke={SERIES[series - 1]} strokeWidth="1.5" />
    </svg>
  )
}

/* The workhorse. A crosshair rather than a per-point hover, because a line is
   read by x-position and a point hover misses the space between points — and
   the hit targets span the full column for the same reason. */
export function LineChart({ series, labels, target, unit = '', max = 100, height = 200 }) {
  const [hover, setHover] = useState(null)
  const W = 720
  const x = (i) => 52 + (i / (labels.length - 1)) * (W - 70)
  const y = (v) => height - 32 - (v / max) * (height - 56)
  const ticks = [0, max / 2, max]

  return (
    <figure className={s.chart} style={{ margin: 0 }}>
      <div className={s.plotWrap}>
        <svg
          viewBox={`0 0 ${W} ${height}`}
          className={s.svg}
          role="img"
          aria-label={series.map((x) => x.label).join(' and ')}
          onMouseLeave={() => setHover(null)}
        >
          <Axis ticks={ticks} y={y} x0={46} x1={W - 8} unit={unit} />
          {target !== undefined && (
            <>
              <line x1="46" x2={W - 8} y1={y(target)} y2={y(target)} className={s.refLine} />
              <text x={W - 8} y={y(target) - 5} className={s.refText} textAnchor="end">Target {target}</text>
            </>
          )}
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1="12" y2={y(0)} className={s.crosshair} />
          )}
          {series.map((set, si) => (
            <path
              key={set.label}
              d={set.data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={SERIES[si % 3]}
              strokeWidth="1.5"
            />
          ))}
          {series.map((set, si) =>
            set.data.map((v, i) => (
              <circle
                key={`${si}-${i}`}
                cx={x(i)} cy={y(v)} r={hover === i ? 4 : 2.5}
                fill={SERIES[si % 3]} className={s.dot}
              />
            )),
          )}
          {labels.map((l, i) => (
            <rect
              key={l + i}
              x={x(i) - (W / labels.length) / 2} y="8"
              width={W / labels.length} height={height - 40}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
          {labels.map((l, i) => (
            <text key={l + i} x={x(i)} y={height - 12} className={s.axisText} textAnchor="middle">{l}</text>
          ))}
        </svg>
        {hover !== null && (
          <div className={s.tip} style={{ left: `${(x(hover) / W) * 100}%` }}>
            <span className={s.tipLabel}>{labels[hover]}</span>
            {series.map((set, si) => (
              <span key={set.label} className={s.tipRow}>
                <i style={{ background: SERIES[si % 3] }} />{set.label}<b>{set.data[hover]}</b>
              </span>
            ))}
          </div>
        )}
      </div>
      {series.length > 1 && (
        <Legend items={series.map((set, si) => ({ label: set.label, colour: SERIES[si % 3] }))} />
      )}
    </figure>
  )
}

/* Bars start at zero, and the reference sits on the chart rather than in a
   caption — the comparison is the point. */
export function BarChart({ data, labels, unit = '', reference, referenceLabel, series = 1, height = 190 }) {
  const max = Math.max(...data, reference ?? 0) * 1.15 || 1
  const W = 400
  const y = (v) => height - 34 - (v / max) * (height - 58)
  const step = (W - 56) / data.length
  const round = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : Math.round(n))

  return (
    <figure className={s.chart} style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${height}`} className={s.svg} role="img" aria-label="Bar chart">
        <Axis ticks={[0, round(max / 2) * (max >= 1000 ? 1000 : 1), round(max) * (max >= 1000 ? 1000 : 1)].map(Number)}
          y={y} x0={44} x1={W - 6} unit={unit} />
        {data.map((v, i) => (
          <rect
            key={i}
            x={48 + i * step} y={y(v)} width={step * 0.62} height={Math.max(0, y(0) - y(v))}
            rx="0" fill={SERIES[series - 1]} className={s.mark}
          >
            <title>{labels[i]}: {v}</title>
          </rect>
        ))}
        {reference !== undefined && (
          <>
            <line x1="44" x2={W - 6} y1={y(reference)} y2={y(reference)} className={s.refLine} />
            <text x={W - 6} y={y(reference) - 4} className={s.refText} textAnchor="end">
              {referenceLabel ?? `Mean ${reference}`}
            </text>
          </>
        )}
        {labels.map((l, i) => (
          <text key={l + i} x={48 + i * step + step * 0.31} y={height - 12} className={s.axisText} textAnchor="middle">
            {l}
          </text>
        ))}
      </svg>
    </figure>
  )
}

/* Ranked, sorted descending, with the share stated. A ranking chart whose bars
   are not sorted makes the reader do the sorting. */
export function RankedBar({ data, series = 2 }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1
  const max = Math.max(...data.map((d) => d.value)) || 1
  const rows = [...data].sort((a, b) => b.value - a.value)
  const H = rows.length * 30 + 10

  return (
    <figure className={s.chart} style={{ margin: 0 }}>
      <svg viewBox={`0 0 400 ${H}`} className={s.svg} role="img" aria-label="Ranked bar chart">
        {rows.map((d, i) => {
          const w = (d.value / max) * 226
          return (
            <g key={d.label}>
              <text x="0" y={22 + i * 30} className={s.axisText}>{d.label}</text>
              <rect x="84" y={11 + i * 30} width={w} height="15" fill={SERIES[series - 1]} className={s.mark}>
                <title>{d.label}: {d.value}</title>
              </rect>
              <text x={84 + w + 8} y={23 + i * 30} className={s.valueText}>{d.value}</text>
              <text x="400" y={23 + i * 30} className={s.axisText} textAnchor="end">
                {Math.round((d.value / total) * 100)}%
              </text>
            </g>
          )
        })}
        <line x1="84" x2="84" y1="6" y2={H - 8} className={s.spine} />
      </svg>
    </figure>
  )
}

/* Donut: four slices is the ceiling. Past that the arcs stop being comparable
   and it should be a ranked bar. The centre figure does most of the work. */
/* A donut is a composition — degrees of one whole, not four unrelated things —
   so it takes the sequential ramp rather than the categorical slots. The
   categorical set stops at three, and cycling it gave a fourth slice the same
   colour as the first: two legend dots, one colour, no way to tell them apart.
   Ordered largest first so the ramp runs with the magnitude. */
export function Donut({ data, centre }) {
  const ordered = [...data].sort((a, b) => b.value - a.value)
  const total = ordered.reduce((a, d) => a + d.value, 0) || 1
  const step = (i) => `var(--sc-q${Math.max(1, 5 - i)})`
  const R = 52
  const C = 2 * Math.PI * R
  let acc = 0

  return (
    <figure className={s.chart} style={{ margin: 0 }}>
      <svg viewBox="0 0 340 150" className={s.svg} role="img" aria-label="Composition">
        <g transform="translate(80, 75)">
          {ordered.slice(0, 5).map((d, i) => {
            const len = (d.value / total) * C
            const seg = (
              <circle
                key={d.label}
                r={R} fill="none" stroke={step(i)} strokeWidth="16"
                strokeDasharray={`${Math.max(0, len - 3)} ${C - len + 3}`}
                strokeDashoffset={-acc}
                transform="rotate(-90)"
                className={s.mark}
              >
                <title>{d.label}: {d.value}</title>
              </circle>
            )
            acc += len
            return seg
          })}
          {centre && (
            <text y="6" textAnchor="middle" className={s.axisText}
              style={{ fontFamily: 'var(--sc-font-display)', fontSize: 20, fill: 'var(--sc-text-display)' }}>
              {centre}
            </text>
          )}
        </g>
        {/* Keyed to the ring, and vertically centred against it whether there
            are three rows or five. */}
        {ordered.slice(0, 5).map((d, i) => {
          const top = (150 - Math.min(ordered.length, 5) * 24 + 6) / 2 + i * 24
          return (
            <g key={d.label}>
              <rect x="176" y={top} width="9" height="9" rx="2" fill={step(i)} />
              <text x="192" y={top + 9} className={s.axisText}>{d.label}</text>
              <text x="332" y={top + 9} className={s.valueText} textAnchor="end">{d.value}</text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
