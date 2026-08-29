import styles from './FlowDiagram.module.css'
import { repoFiles } from '../data/repo'

/**
 * The hero diagram: what goes into the platform, and what comes out.
 *
 * THREE COLUMNS AND TWO ARROWS. Inputs on the left, the REPO in the middle,
 * outputs on the right — the shape of the reference, and the shape of the
 * actual claim: everything the brand is goes into one place, and everything
 * the brand makes comes out of it.
 *
 * The middle is the platform on every one of these pages, not the service.
 * A service page that put its own name there drew the inputs turning into
 * "Build" and Build turning into a brand, which is not what happens.
 *
 * ONLY THE RIGHT COLUMN IS A PROP. It is that service's own pillars, from
 * services.js — Chris's names, unchanged. The left is the same five on every
 * page, so it lives in this file.
 *
 * THE LEFT COLUMN IS WHAT FEEDS THE REPO — memory, the library, the agents,
 * feedback and data. The middle is the repo. The right
 * is what that service produces from it.
 *
 * Decorative as a whole: the columns are labelled for a screen reader, and
 * the arrows are aria-hidden because "arrow" is not information.
 */
/* WHAT FEEDS THE REPO. The same five on every service page, so they live
   here rather than being passed in five times — the service changes what
   comes OUT, never what goes in.

   Two of these names differ from PLATFORM_PAGES in V3Nav, which has Reviews
   and Measurement where this has Feedback and Marketing Data. They are the
   same things called two ways, and worth reconciling once somebody decides
   which name is right. */
const REPO_INPUTS = [
  { name: 'Memory' },
  { name: 'Library' },
  { name: 'Agents' },
  { name: 'Feedback' },
  { name: 'Data' },
]

/* A folder glyph, drawn rather than imported — the platform card on /v3
   draws its own for the same reason: one path is cheaper than a dependency
   for a shape this simple. */
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

function Column({ label, groups, side }) {
  return (
    <div className={styles.column} aria-label={label}>
      {groups.map(({ name, items }) => (
        <div key={name} className={styles.node}>
          <span className={styles.nodeName}>{name}</span>
          {items && (
            <span className={styles.chips}>
              {items.map((i) => <span key={i} className={styles.chip}>{i}</span>)}
            </span>
          )}
          <span className={`${styles.arrow} ${side === 'in' ? styles.arrowIn : styles.arrowOut}`} aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}

export default function FlowDiagram({ centre, outputs }) {
  return (
    <div className={styles.wrap}>
      {/* The wash behind it, which the reference uses to tie the three
          columns into one object. Pink rather than orange, and low enough
          that the cards still read as sitting on the page. */}
      <div className={styles.ground} aria-hidden="true" />

      <div className={styles.flow}>
        <Column label="What goes in" groups={REPO_INPUTS} side="in" />

        <div className={styles.centre}>
          <div className={styles.centreHead}>
            <span className={styles.centreCrumbMuted}>Super Conscious</span>
            <span className={styles.centreSlash}>/</span>
            <span className={styles.centreName}>SC-Brand</span>
            <span className={styles.centrePrivate}>{centre}</span>
          </div>
          {/* The same chrome as the repository panel on /v3 — breadcrumb,
              tabs, then rows — so the thing in the middle of this diagram
              and the thing on the homepage are recognisably one product. */}
          <div className={styles.centreTabs}>
            <span className={styles.tabOn}>Files</span>
            <span className={styles.tab}>Pull requests</span>
            <span className={styles.tab}>Activity</span>
          </div>

          <ul className={styles.centreBody}>
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

        <Column label="What comes out" groups={outputs} side="out" />
      </div>
    </div>
  )
}
