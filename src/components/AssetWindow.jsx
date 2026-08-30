import styles from './AssetWindow.module.css'
import { assetSample } from '../data/metricsSample'

/**
 * ONE ASSET AND ITS PERFORMANCE — the platform-section window on Grow.
 *
 * Build's platform section shows the repo, because Build fills it. Grow's
 * shows a single live asset with its numbers beside it, because that is what
 * Grow does with what is in there: puts it out and watches it.
 *
 * AHEAD OF THE PRODUCT. There is no per-asset performance in the app today —
 * its Usage tab says nothing records where an asset goes once it leaves. The
 * "Sample data" tag is doing real work here, not decorating.
 *
 * The preview is a flat fill, like every other asset tile on the site: there
 * is no artwork in this repo, and a case study still labelled as a live ad
 * would be the same lie in a nicer frame.
 */
export default function AssetWindow() {
  const { name, path, live, stats, days, channels, format, version, updated, benchmark } = assetSample
  const peak = Math.max(...days)

  /* Derived, so the readings cannot contradict the chart beside them. */
  const bestIndex = days.indexOf(peak)
  const details = [
    ['Format', format],
    ['Version', version],
    ['Updated', updated],
    ['Days live', String(days.length)],
    ['Best day', `day ${bestIndex + 1} · ${peak} events`],
    ['Channels', String(channels.length)],
  ]

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>{name}</span>
        <span className={styles.badge}>Asset</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Performance</span>
        <span className={styles.tab}>Versions</span>
        <span className={styles.tab}>Where it ran</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.body}>
        <div className={styles.preview}>
          <div className={styles.fill} aria-hidden="true" />
          <span className={styles.previewPath}>{path}</span>
        </div>

        <div className={styles.side}>
          <p className={styles.live}>{live}</p>

          <div className={styles.stats}>
            {stats.map(({ label, value }) => (
              <div key={label} className={styles.stat}>
                <b className={styles.statValue}>{value}</b>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>

          <div className={styles.chart}>
            <span className={styles.chartLabel}>Events per day</span>
            <div className={styles.bars}>
              {/* Keyed by position: eight days, two of which can match. */}
              {days.map((v, i) => (
                <span
                  key={i}
                  className={i === days.length - 1 ? styles.barLast : styles.bar}
                  style={{ height: `${(v / peak) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <dl className={styles.details}>
            {details.map(([k, v]) => (
              <div key={k} className={styles.detail}>
                <dt className={styles.detailKey}>{k}</dt>
                <dd className={styles.detailValue}>{v}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.bench}>
            <span className={styles.chartLabel}>Against {benchmark.basis}</span>
            {benchmark.rows.map(({ label, delta }) => (
              <span key={label} className={styles.benchRow}>
                <span className={styles.benchName}>{label}</span>
                {/* The bar runs from a centre line: above average goes right,
                    below goes left, so the sign is legible without reading
                    the number. */}
                <span className={styles.benchTrack}>
                  <span
                    className={delta >= 0 ? styles.benchUp : styles.benchDown}
                    style={{ width: `${Math.min(Math.abs(delta) * 2, 50)}%` }}
                  />
                </span>
                <span className={delta >= 0 ? styles.benchPctUp : styles.benchPctDown}>
                  {delta >= 0 ? '+' : ''}{delta}%
                </span>
              </span>
            ))}
          </div>

          <div className={styles.where}>
            <span className={styles.chartLabel}>Running on</span>
            <div className={styles.chips}>
              {channels.map((c) => <span key={c} className={styles.chip}>{c}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
