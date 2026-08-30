import styles from './RepoWindow.module.css'
import { repoFiles } from '../data/repo'

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
 * `label` fills the slot the repository panel uses for PRIVATE. `big` is the
 * standalone treatment: larger type and taller rows, for when the window is
 * the subject rather than one of three columns.
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

export default function RepoWindow({ label = 'Repo', big = false }) {
  return (
    <div className={`${styles.window}${big ? ' ' + styles.big : ''}`}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>Super Conscious</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>SC-Brand</span>
        <span className={styles.private}>{label}</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Files</span>
        <span className={styles.tab}>Pull requests</span>
        <span className={styles.tab}>Activity</span>
      </div>

      <ul className={styles.body}>
        {repoFiles.map(({ folder, name, age }) => (
          <li key={folder + name} className={styles.row}>
            <Folder />
            <span className={styles.rowPath}>
              <span className={styles.rowFolder}>{folder}/</span>{name}
            </span>
            <span className={styles.rowAge}>{age}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
