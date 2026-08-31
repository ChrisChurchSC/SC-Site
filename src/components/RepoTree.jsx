import { ChevronDown, Folder, FolderOpen } from 'lucide-react'

import styles from './RepoTree.module.css'

/**
 * WHAT IS ACTUALLY IN IT — the five directories of a brand repo, on
 * /platform/repo.
 *
 * THESE ARE THE REAL FOLDERS. SC-Brand has exactly these five, the files
 * named under them exist, and the split between Strategy and Verbal is a rule
 * this studio already works to: Strategy holds what is true, Verbal holds how
 * it sounds. Nothing here is a plausible-looking structure invented for a
 * diagram.
 *
 * The paths are already drawn elsewhere on this site — the repo window, the
 * diff window and the dashboard all show them — so the page is not exposing
 * anything that was not already on screen.
 *
 * WHAT EACH ONE IS FOR is my wording and is UNAPPROVED.
 */
const DIRS = [
  {
    name: 'Strategy',
    what: 'What is true',
    note: 'What the brand stands for, who it is for, and which claims have something behind them.',
    files: [
      'positioning.md',
      'audience.md',
      'proof-points.md',
      'messaging-house.md',
      'competitive-landscape.md',
      'verticals/',
      'README.md',
    ],
  },
  {
    name: 'Verbal',
    what: 'How it sounds',
    note: 'The voice, and the copy standards that come out of it. Kept apart from Strategy on purpose.',
    files: ['tone-of-voice.md', 'copy-standards.md', 'lexicon.md', 'naming.md'],
  },
  {
    name: 'Visual',
    what: 'How it looks',
    note: 'The design system — marks, type, color, components — as files rather than a PDF of them.',
    files: ['logo.svg', 'logotype.svg', 'type.md', 'color.md', 'components.md', 'motion.md', 'photography.md'],
  },
  {
    name: 'Agents',
    what: 'Who drafts',
    note: 'One markdown file per role: what it owns, what it reads, and the thing it will not do.',
    files: [
      'brand-strategist.md',
      'comms-writer.md',
      'media-strategist.md',
      'design-critic.md',
      'sales-analyst.md',
      'studio-ops.md',
      'README.md',
    ],
  },
  {
    name: 'Data',
    what: 'What it moved',
    note: 'What shipped and how it performed, written back so the next round starts from it.',
    files: ['metrics.csv', 'channels.csv', 'reviews.log'],
  },
]

export default function RepoTree() {
  return (
    <section className={styles.section} aria-labelledby="repo-tree">
      <div className={styles.head}>
        <p className={styles.eyebrow}>[ What is in it ]</p>
        <h2 className={styles.headline} id="repo-tree">
          Five folders, and everything the brand runs on.
        </h2>
        <p className={styles.intro}>
          Not a metaphor for a repository — an actual one. These are the directories, and the
          files under them are the ones the agents read.
        </p>
      </div>

      <div className={styles.window}>
        <div className={styles.windowHead}>
          <span className={styles.crumbMuted}>Super Conscious</span>
          <span className={styles.slash}>/</span>
          <span className={styles.windowName}>SC-Brand</span>
          <span className={styles.badge}>Repo</span>
        </div>

        <div className={styles.tree}>
          {/* The root, open. */}
          <span className={styles.root}>
            <ChevronDown className={styles.chev} aria-hidden="true" />
            <FolderOpen className={styles.folderIcon} aria-hidden="true" />
            SC-Brand
          </span>

          {DIRS.map(({ name, what, note, files }) => (
            <div key={name} className={styles.branch}>
              <span className={styles.dirRow}>
                <ChevronDown className={styles.chev} aria-hidden="true" />
                <Folder className={styles.folderIcon} aria-hidden="true" />
                <span className={styles.dir}>{name}</span>
                <span className={styles.what}>{what}</span>
                <span className={styles.count}>{files.length}</span>
              </span>

              <p className={styles.note}>{note}</p>

              <span className={styles.files}>
                {files.map((file) => (
                  <span key={file} className={styles.file}>{file}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
