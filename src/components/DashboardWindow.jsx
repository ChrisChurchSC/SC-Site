import styles from './DashboardWindow.module.css'
import { dashboard } from '../data/dashboard'

/**
 * THE MEASUREMENT VIEW, AS A WINDOW — the hero visual on Grow.
 *
 * Same chrome as RepoWindow: breadcrumb, tabs, then the view. Build's hero
 * shows the repo because Build fills it; Grow's shows what the work moved,
 * because that is what Grow is for.
 *
 * EVERY FIGURE IS INVENTED and the panel says so. The "Sample data" tag is
 * not decoration — it is the thing that keeps a demo from reading as a case
 * study, and it stays until real numbers replace it. The figures come from
 * src/data/dashboard.js, shared with the Measurement card on /v3, so the
 * same mock cannot show +18% on one page and something else on another.
 *
 * The rendering is this component's own rather than shared with that card:
 * the card is a small frameless preview and this is a full window, and the
 * one thing that must not drift between them is the numbers, which do not.
 */
export default function DashboardWindow({ label = 'Measurement' }) {
  const { stats, weeks, channels } = dashboard
  const peak = Math.max(...weeks)
  const best = Math.max(...channels.map((c) => c.rate))

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>Super Conscious</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>SC-Brand</span>
        <span className={styles.private}>{label}</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Performance</span>
        <span className={styles.tab}>Channels</span>
        <span className={styles.tab}>Assets</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.body}>
        <div className={styles.stats}>
          {stats.map(({ value, label: l }) => (
            <span key={l} className={styles.stat}>
              <b className={styles.value}>{value}</b>
              <span className={styles.label}>{l}</span>
            </span>
          ))}
        </div>

        <div className={styles.chartWrap}>
          <span className={styles.chartLabel}>Conversions · last 8 weeks</span>
          <div className={styles.chart}>
            {/* Keyed by position: eight weeks, two of which hold the same
                value. */}
            {weeks.map((v, i) => (
              <span key={i} className={styles.bar} style={{ height: `${(v / peak) * 100}%` }} />
            ))}
          </div>
        </div>

        <div className={styles.rows}>
          {channels.map(({ name, rate }) => (
            <span key={name} className={styles.row}>
              <span className={styles.rowName}>{name}</span>
              <span className={styles.track}>
                {/* Scaled to the best of the three rather than to 100 — at
                    100 three single-digit percentages are three slivers and
                    the comparison disappears. */}
                <span className={styles.fill} style={{ width: `${(rate / best) * 100}%` }} />
              </span>
              <span className={styles.pct}>{rate}%</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
