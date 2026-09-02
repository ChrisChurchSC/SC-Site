import styles from './InMarketPanel.module.css'

/**
 * WHAT IS IN MARKET — the panel beside the Measurement window.
 *
 * Its job is to say what the table next to it is counting. A dashboard on
 * its own is a page of numbers about nothing; put the live work beside it
 * and the numbers are obviously about that work.
 *
 * THE CHANNELS ARE REAL — the eight in the Channels pillar, which is what we
 * actually set up and run. The TILES ARE FLAT FILLS, like the Library grid
 * in the repo window: there is no artwork in this repo for live work, and a
 * case study still standing in for "an ad currently running" would be a
 * quieter version of the same lie the invented metrics were.
 *
 * The count is derived from the list rather than typed, so it cannot say
 * eight while showing nine.
 */
const CHANNELS = ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS']

export default function InMarketPanel() {
  return (
    <aside className={styles.panel} aria-label="Work in market">
      <div className={styles.head}>
        <span className={styles.title}>In market</span>
        <span className={styles.count}>{CHANNELS.length} live</span>
      </div>

      <div className={styles.grid}>
        {CHANNELS.map((name) => (
          <div key={name} className={styles.tile}>
            <div className={styles.fill} aria-hidden="true" />
            <span className={styles.tag}>{name}</span>
          </div>
        ))}
      </div>

      {/* Says the connection out loud rather than leaving it to the layout. */}
      <p className={styles.foot}>What the numbers are measuring.</p>
    </aside>
  )
}
