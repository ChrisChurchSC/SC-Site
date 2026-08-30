import styles from './DeployWindow.module.css'
import { serviceBySlug } from '../data/services'

/**
 * WHAT GETS MADE OUT OF THE REPO — the screen for Build's "Deploy" step.
 *
 * Deploy is not the merge button; it is the repo being used. So this is the
 * things that come out of it — the website, the campaign, the channels.
 *
 * NOT A WINDOW. The other three steps show product screens because they are
 * about the platform; this one is about what ends up in the world, so it is
 * images rather than chrome. The site tile is wide because a website is, and
 * the other two are square because a campaign and a channel are seen at that
 * shape.
 *
 * THE TILES ARE FLAT FILLS, like every other asset placeholder on the site.
 * There is no artwork in this repo, and a case study still captioned as a
 * deployed site would be a claim about work that does not exist.
 *
 * THE NAMES AND DELIVERABLES ARE READ from Build's own pillars, minus Brand:
 * by this point Brand is what the repo IS rather than something deployed out
 * of it. A pillar that names its own outputs uses them.
 */
const FROM_REPO = ['Website & App', 'Campaign', 'Channels']

export default function DeployWindow() {
  const build = serviceBySlug('build')
  const pillars = build?.pillars ?? []
  const rows = FROM_REPO.map((name) => pillars.find((p) => p.name === name)).filter(Boolean)

  return (
    <div className={styles.sheet}>
      {rows.map(({ n, name, items, outputs }, i) => (
        <figure key={n} className={i === 0 ? styles.tileWide : styles.tile}>
          <span className={styles.fill} aria-hidden="true" />
          <figcaption className={styles.cap}>
            <span className={styles.name}>{name}</span>
            <span className={styles.what}>{(outputs ?? items).slice(0, 3).join(' · ')}</span>
          </figcaption>
          <span className={styles.live}>Live</span>
        </figure>
      ))}
    </div>
  )
}
