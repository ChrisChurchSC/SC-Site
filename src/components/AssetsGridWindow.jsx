import styles from './AssetsGridWindow.module.css'

/**
 * THE CREATIVE MADE — the screen for "Ship".
 *
 * A month of work as a contact sheet: what got drafted out of the repo and
 * went out. The step after this one takes the same assets and shows them
 * across channels, which is why the two screens are deliberately the same
 * grid seen twice — once by what the thing IS, once by where it went.
 *
 * THE TILES ARE FLAT FILLS, like every other asset grid on the site. There is
 * no artwork in this repo, and case study stills captioned as this month's
 * social would be a claim about work that does not exist.
 *
 * THE FORMAT NAMES ARE MINE and are not signed off. They are ordinary asset
 * types rather than anything sourced.
 */
const ASSETS = [
  'Post', 'Story', 'Reel', 'Banner',
  'Carousel', 'Email', 'Short-form', 'Static',
  'Cutdown',
]

export default function AssetsGridWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Library / Social</span>
        <span className={styles.badge}>Shipped</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>This month</span>
        <span className={styles.tab}>All</span>
        <span className={styles.count}>{ASSETS.length} assets</span>
      </div>

      <div className={styles.grid}>
        {ASSETS.map((kind) => (
          <div key={kind} className={styles.tile}>
            <div className={styles.fill} aria-hidden="true" />
            <span className={styles.tag}>{kind}</span>
          </div>
        ))}
      </div>

      <p className={styles.foot}>Drafted out of the repo, in your voice.</p>
    </div>
  )
}
