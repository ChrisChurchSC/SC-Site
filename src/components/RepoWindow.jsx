import styles from './RepoWindow.module.css'
import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'

import { repoFiles } from '../data/repo'
import { agents as ROSTER } from '../data/agents'

/**
 * THE REPO, AS A WINDOW. Breadcrumb, tabs, then rows of real files in real
 * folders — the same chrome as the repository panel on /v3, so the thing in
 * the middle of the hero diagram and the thing on the homepage are
 * recognisably one product.
 *
 * EXTRACTED FROM FlowDiagram rather than copied. It is on two places on a
 * service page now — the middle of the hero diagram, and the platform
 * section below it — and two copies of this chrome would have drifted the
 * first time either was touched. The file list already came from one place
 * (src/data/repo.js); this puts the frame in one place too.
 *
 * `agents` lists the six agents beside the files. OFF by default: only the
 * Encode step wants them, because Encode is the step about the brand being
 * made machine-readable. The platform section shows the same window without
 * them.
 *
 * `assets` shows the Library pane, on by default. The platform section wants
 * it — that grid is why the panel says assets are in there. The Encode step
 * does not: Encode is about the brand being written down, not about what is
 * stored beside it.
 *
 * `label` fills the slot the repository panel uses for PRIVATE. `big` is the
 * standalone treatment: larger type, taller rows, and a second pane of real
 * assets beside the file list — for when the window is the subject rather
 * than one of three columns. The asset pane is big-only because at the
 * hero's 464px it would have left two unreadable halves.
 */

/* Drawn rather than imported — one path is cheaper than a dependency for a
   shape this simple. */
function Folder() {
  return (
    <svg className={styles.folder} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 3.5h4l1.4 1.6h7.6v7.4a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ASSET_TILES = 9

/* Same six, same order, same icons as the Agents card on /v3 — it is one
   roster, so it should look like one roster. */
const ICONS = [Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList]

/* What SC-Brand/Agents actually holds: one markdown file per agent. Ages are
   sample, like every other timestamp in this window. */
const AGENT_FILES = ROSTER.map(({ name }, i) => ({
  folder: 'Agents',
  name: `${name}.md`,
  age: ['1d', '1d', '3d', '4d', '6d', '6d'][i],
}))

/* brand-strategist, because its refusal is the one with a marker to show. */
const PICKED = 0

export default function RepoWindow({ label = 'Repo', big = false, assets = true, agents = false }) {
  return (
    <div className={`${styles.window}${big ? ' ' + styles.big : ''}`}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>Super Conscious</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>SC-Brand</span>
        <span className={styles.private}>{label}</span>
      </div>

      <div className={styles.tabs}>
        <span className={agents ? styles.tab : styles.tabOn}>Files</span>
        {agents
          ? <span className={styles.tabOn}>Agents</span>
          : <span className={styles.tab}>Pull requests</span>}
        <span className={styles.tab}>Activity</span>
      </div>

      <div className={styles.panes}>
        <ul className={styles.body}>
          {(agents ? AGENT_FILES : repoFiles).map(({ folder, name, age }) => (
            <li key={folder + name} className={styles.row}>
              <Folder />
              <span className={styles.rowPath}>
                <span className={styles.rowFolder}>{folder}/</span>{name}
              </span>
              <span className={styles.rowAge}>{age}</span>
            </li>
          ))}
        </ul>

        {big && agents && (
          <div className={styles.agents}>
            <span className={styles.agentsLabel}>Select agent</span>

            <div className={styles.roster}>
              {ROSTER.map(({ name, wont }, i) => {
                const Icon = ICONS[i]
                return (
                  <span
                    key={name}
                    className={`${styles.slot}${i === PICKED ? ' ' + styles.slotPicked : ''}`}
                    /* The five unpicked names appear nowhere else on the
                       panel — without this the roster is five anonymous
                       icons. */
                    title={`${name} · will not ${wont.toLowerCase()}`}
                  >
                    <Icon size={16} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                )
              })}
            </div>

            <div className={styles.plate}>
              <span className={styles.plateName}>{ROSTER[PICKED].name}</span>
              <span className={styles.plateDoes}>{ROSTER[PICKED].does}</span>
              <span className={styles.plateWont}>
                <span className={styles.plateWontKey}>Will not</span> {ROSTER[PICKED].wont}
              </span>
            </div>
          </div>
        )}

        {/* Assets, only in the standalone treatment — see .panes. */}
        {big && assets && (
          <div className={styles.assets}>
            <div className={styles.assetsHead}>
              <span className={styles.assetsPath}>Library/</span>
              <span className={styles.assetsCount}>{ASSET_TILES} of ––</span>
            </div>
            {/* PLACEHOLDER FILLS, deliberately. These stood in as real case
                study stills for one revision; two of those paths 404'd, and
                the colour pulled the eye off the file list beside them. They
                are flat tiles until somebody picks the artwork. */}
            <div className={styles.assetGrid} aria-hidden="true">
              {Array.from({ length: ASSET_TILES }, (_, i) => (
                <div key={i} className={styles.asset} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
