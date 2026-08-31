import { Folder } from 'lucide-react'

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
    name: 'Strategy/',
    what: 'What is true',
    files: ['positioning.md', 'audience.md', 'proof-points.md', 'messaging-house.md', 'competitive-landscape.md', 'verticals/', 'README.md'],
    note: 'What the brand stands for, who it is for, and which claims have something behind them.',
  },
  {
    name: 'Verbal/',
    what: 'How it sounds',
    files: ['tone-of-voice.md', 'copy-standards.md', 'lexicon.md', 'naming.md'],
    note: 'The voice, and the copy standards that come out of it. Kept apart from Strategy on purpose.',
  },
  {
    name: 'Visual/',
    what: 'How it looks',
    files: ['logo.svg', 'logotype.svg', 'type.md', 'color.md', 'components.md', 'motion.md', 'photography.md'],
    note: 'The design system — marks, type, color, components — as files rather than a PDF of them.',
  },
  {
    name: 'Agents/',
    what: 'Who drafts',
    files: ['brand-strategist.md', 'comms-writer.md', 'media-strategist.md', 'design-critic.md', 'sales-analyst.md', 'studio-ops.md', 'README.md'],
    note: 'One markdown file per role: what it owns, what it reads, and the thing it will not do.',
  },
  {
    name: 'Data/',
    what: 'What it moved',
    files: ['metrics.csv', 'channels.csv', 'reviews.log'],
    note: 'What shipped and how it performed, written back so the next round starts from it.',
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

      <ol className={styles.list}>
        {DIRS.map(({ name, what, files, note }) => (
          <li key={name} className={styles.row}>
            <span className={styles.icon}>
              <Folder size={16} strokeWidth={1.4} aria-hidden="true" />
            </span>

            <span className={styles.naming}>
              <span className={styles.dir}>{name}</span>
              <span className={styles.what}>{what}</span>
            </span>

            <p className={styles.note}>{note}</p>

            <span className={styles.files}>
              {files.map((f) => <span key={f} className={styles.file}>{f}</span>)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
