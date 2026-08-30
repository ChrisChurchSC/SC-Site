import styles from './DashboardWindow.module.css'
import { metricsSample } from '../data/metricsSample'

/**
 * THE MEASUREMENT VIEW, AS A WINDOW — the hero visual on Grow.
 *
 * MIRRORS THE REAL SURFACE. This is the Performance tab from the Conscious
 * app: metrics.csv under Brand / Data, one row per day, four stat tiles over
 * a grid. The columns, the tiles and the source line are the app's, not a
 * marketing dashboard's.
 *
 * The version before this showed lift, click rate, conversions and
 * per-channel conversion rates. None of those exist in the product — there
 * is no CTR, CPC, spend, conversion-rate or reach column anywhere in it, and
 * the app's own empty state says its figures come from the connection
 * "rather than something invented". A site drawing metrics the product does
 * not have was doing the thing the app refuses to do.
 *
 * THE FIGURES ARE SAMPLE, and the panel says so. Real ones were available in
 * this checkout and are deliberately not used — see metricsSample.js.
 *
 * The tiles are derived from the rows rather than typed beside them, so the
 * panel cannot contradict its own table. Pages indexed is the last reading
 * rather than a sum, which is how the app treats it: a count of what exists,
 * not a total of what happened.
 */
/* Pink first, then down through the greys — the ring reads in order of
   size because the channels are already ordered that way. */
const CHANNEL_COLORS = [
  'rgba(223, 78, 214, 0.9)',
  'rgba(223, 78, 214, 0.55)',
  'rgba(255, 255, 255, 0.42)',
  'rgba(255, 255, 255, 0.26)',
  'rgba(255, 255, 255, 0.15)',
]

const sum = (rows, key) => rows.reduce((total, r) => total + (r[key] ?? 0), 0)
const n = (v) => v.toLocaleString('en-US')

/* A sparkline, drawn rather than charted — one polyline is cheaper than a
   dependency, and these are 8 points each. */
function Spark({ series }) {
  const peak = Math.max(...series)
  const floor = Math.min(...series)
  const span = peak - floor || 1
  const points = series
    .map((v, i) => `${(i / (series.length - 1)) * 100},${28 - ((v - floor) / span) * 26}`)
    .join(' ')
  return (
    <svg className={styles.spark} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}


/* A line per series, on one set of axes. Scaled to the peak across BOTH
   series so desktop and mobile are comparable — scaled separately they would
   look the same size, which is the one thing this chart exists to disprove. */
function Lines({ series, height = 56 }) {
  const all = series.flatMap((s) => s.values)
  const peak = Math.max(...all)
  const path = (values) =>
    values
      .map((v, i) => `${(i / (values.length - 1)) * 100},${height - (v / peak) * (height - 4)}`)
      .join(' ')

  return (
    <svg className={styles.chartSvg} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {series.map((s) => (
        <polyline
          key={s.name}
          points={path(s.values)}
          fill="none"
          stroke={s.color}
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

/* Bars, with the mean drawn across them — the app puts a reference line on
   this chart, and without it a row of bars says nothing about whether a day
   was good. */
function Bars({ values, height = 56 }) {
  const peak = Math.max(...values)
  const mean = values.reduce((t, v) => t + v, 0) / values.length
  const w = 100 / values.length

  return (
    <svg className={styles.chartSvg} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {values.map((v, i) => (
        <rect
          key={i}
          x={i * w + w * 0.18}
          width={w * 0.64}
          y={height - (v / peak) * (height - 4)}
          height={(v / peak) * (height - 4)}
          className={i === values.length - 1 ? styles.barLast : styles.bar}
        />
      ))}
      <line x1="0" x2="100" y1={height - (mean / peak) * (height - 4)} y2={height - (mean / peak) * (height - 4)} className={styles.mean} />
    </svg>
  )
}

/* One ring, segment per channel, total in the middle. stroke-dasharray on a
   circle rather than arc paths: the maths is the circumference and nothing
   has to be converted into sweep flags. */
function Donut({ slices, total }) {
  const R = 26
  const C = 2 * Math.PI * R
  let offset = 0

  return (
    <div className={styles.donutWrap}>
      <svg className={styles.donut} viewBox="0 0 70 70" aria-hidden="true">
        {slices.map(({ name, value, color }) => {
          const len = (value / total) * C
          const dash = <circle key={name} cx="35" cy="35" r={R} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 35 35)" />
          offset += len
          return dash
        })}
      </svg>
      <span className={styles.donutTotal}>{total}</span>
    </div>
  )
}

export default function DashboardWindow({ label = 'Measurement', ratio, bare = false }) {
  const { source, columns, rows, channels } = metricsSample

  const tiles = [
    { label: 'Active users', value: n(sum(rows, 'active')), note: `over ${source.days} days`, series: rows.map((r) => r.active) },
    { label: 'New users', value: n(sum(rows, 'fresh')), note: `over ${source.days} days`, series: rows.map((r) => r.fresh) },
    { label: 'Events', value: n(sum(rows, 'events')), note: `over ${source.days} days`, series: rows.map((r) => r.events) },
    /* Not a sum: it is how many pages are indexed right now. */
    { label: 'Pages indexed', value: n(rows[rows.length - 1].indexed), note: `as of ${source.to}` },
  ]

  return (
    <div className={styles.window} style={ratio ? { aspectRatio: ratio } : undefined}>
      {!bare && (
        <div className={styles.head}>
          <span className={styles.crumbMuted}>Super Conscious</span>
          <span className={styles.slash}>/</span>
          <span className={styles.name}>SC-Brand</span>
          <span className={styles.private}>{label}</span>
        </div>
      )}

      {!bare && (
        <div className={styles.tabs}>
          <span className={styles.tabOn}>Performance</span>
          <span className={styles.tab}>Usage</span>
          <span className={styles.sample}>Sample data</span>
        </div>
      )}

      {/* The app puts the provenance directly above the figures, which is
          most of why they can be trusted there. */}
      <div className={bare ? styles.sourceRow : undefined}>
        <p className={styles.source}>
          {source.days} days to {source.to}
          <span className={styles.sourceDim}> · from {source.file} · {source.path}</span>
        </p>
        {bare && <span className={styles.sample}>Sample data</span>}
      </div>

      <div className={styles.tiles}>
        {tiles.map(({ label: l, value, note, series }) => (
          <div key={l} className={styles.tile}>
            <span className={styles.tileLabel}>{l}</span>
            <b className={styles.tileValue}>{value}</b>
            <span className={styles.tileNote}>{note}</span>
            {series && <Spark series={series} />}
          </div>
        ))}
      </div>

      <div className={styles.charts}>
        <div className={styles.chart}>
          <span className={styles.chartLabel}>Active users by device</span>
          <Lines
            series={[
              { name: 'Desktop', values: rows.map((r) => r.desktop), color: 'rgba(223, 78, 214, 0.85)' },
              { name: 'Mobile', values: rows.map((r) => r.mobile), color: 'rgba(255, 255, 255, 0.32)' },
            ]}
          />
          <span className={styles.legend}>
            <span className={styles.keyPink} />Desktop
            <span className={styles.keyGrey} />Mobile
          </span>
        </div>

        <div className={styles.chart}>
          <span className={styles.chartLabel}>Events per day</span>
          <Bars values={rows.map((r) => r.events)} />
          <span className={styles.legend}>Mean {Math.round(rows.reduce((t, r) => t + r.events, 0) / rows.length)}</span>
        </div>

        <div className={styles.chart}>
          <span className={styles.chartLabel}>New users by channel</span>
          <Donut
            total={channels.reduce((t, c) => t + c.value, 0)}
            slices={channels.map((c, i) => ({ ...c, color: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }))}
          />
        </div>
      </div>

      <div className={`${styles.gridWrap}${bare ? ' ' + styles.gridFade : ''}`}>
        <table className={styles.grid}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} className={c === 'Date' || c === 'Notes' ? styles.thText : styles.thNum}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.date}>
                <td className={styles.tdDate}>{r.date}</td>
                <td className={styles.tdNum}>{r.active}</td>
                <td className={styles.tdNum}>{r.fresh}</td>
                <td className={styles.tdNum}>{r.events}</td>
                {/* A stale search day is blank with a note, exactly as the
                    real table leaves it — not back-filled. */}
                <td className={styles.tdNum}>{r.impressions ?? ''}</td>
                <td className={styles.tdNum}>{r.clicks ?? ''}</td>
                <td className={styles.tdNum}>{r.indexed}</td>
                <td className={styles.tdNote}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
