import styles from './MemoryMap.module.css'
import { corpus, corpusTotal } from '../data/brandCorpus'

/**
 * WHAT THE BRAND KNOWS, BY WEIGHT — a full-width treemap of the memory itself,
 * on /platform/memory.
 *
 * EVERY BOX IS A REAL FILE AND EVERY AREA IS A REAL MEASUREMENT. The previous
 * version of this section mapped decisions, and there are only three of those,
 * so it was honest and nearly empty. This maps the thing the decisions are
 * made about: the 33 files of the SC-Brand working copy, each sized by how
 * much of the memory it actually occupies. Nothing here was invented to fill
 * the grid — the numbers came off the disk. See src/data/brandCorpus.js.
 *
 * AREA IS THE ARGUMENT. A treemap only tells the truth if size means
 * something, so a box's area is its share of the token count and nothing else.
 * That is what makes the shape readable at a glance: three vertical files are
 * a quarter of everything the brand knows, and you can see that without
 * reading a number.
 *
 * TOKENS RATHER THAN BYTES because tokens are what a model spends when it
 * reads this. The count is an approximation at four characters to a token and
 * the footnote says so; it is the right relative size, not a figure to quote.
 *
 * THE CORNER THUMBNAIL IS READ OFF THE FILE TOO. Four of these files are
 * pictures — the logo marks — and those show the actual artwork. The other
 * twenty-nine are text, so they get a page drawn from ten real line lengths
 * out of the top of the file. That is why the stylesheet and the prose look
 * different from each other: it is measuring them, not decorating them.
 * SC-Brand has no other imagery to use; Visual/public/imagery/ says in its own
 * README that it is empty apart from that README.
 *
 * TWO PLACES IT BENDS, both stated under the map. The smallest column is
 * floored so its name still fits, and binaries and the styleguide app's own
 * source are left out — a font file carries no tokens to read.
 */

const areaOf = (path) => path.split('/')[0]
const nameOf = (path) => path.split('/').slice(1).join('/')

const AREAS = [...new Set(corpus.map((f) => areaOf(f.path)))]

/* Five solid purples, darkest for the smallest file. No transparency: a tile
   is one flat color so the areas read as blocks rather than as a stack of
   washes over whatever is behind them. */
const band = (tokens) =>
  tokens >= 4000 ? 5 : tokens >= 2000 ? 4 : tokens >= 1200 ? 3 : tokens >= 600 ? 2 : 1

const fmt = (n) => n.toLocaleString('en-US')

/* A page of the file, at the size of a stamp. Bars are real line lengths, so
   the shape differs between a stylesheet and a paragraph because the text
   does. Files that are pictures show the picture instead. */
function Thumb({ file }) {
  if (file.art) {
    return (
      <span className={`${styles.thumb} ${styles.thumbArt}`} aria-hidden="true">
        <img src={file.art} alt="" loading="lazy" />
      </span>
    )
  }

  return (
    <span className={styles.thumb} aria-hidden="true">
      {file.shape.map((w, i) => (
        <i key={i} style={{ width: `${Math.round(w * 100)}%` }} />
      ))}
    </span>
  )
}

export default function MemoryMap() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.stat}>
          <b className={styles.statNum}>{corpus.length}</b> files
        </span>
        <span className={styles.sep} />
        <span className={styles.stat}>
          <b className={styles.statNum}>~{fmt(corpusTotal)}</b> tokens
        </span>
        <span className={styles.sep} />
        <span className={styles.stat}>
          <b className={styles.statNum}>{AREAS.length}</b> folders
        </span>
        <span className={styles.dots} aria-hidden="true">
          <i /><i /><i />
        </span>
      </div>

      <div className={styles.body}>
        {AREAS.map((area) => {
          const inArea = corpus.filter((f) => areaOf(f.path) === area)
          const areaTokens = inArea.reduce((n, f) => n + f.tokens, 0)

          return (
            <section
              key={area}
              className={styles.group}
              /* Column width is the folder's share of the memory. */
              style={{ flexGrow: areaTokens }}
            >
              <p className={styles.groupHead}>
                <span className={styles.groupName}>{area}/</span>
                <span className={styles.groupCount}>
                  {Math.round((100 * areaTokens) / corpusTotal)}%
                </span>
              </p>

              <div className={styles.tiles}>
                {inArea.map((f) => (
                  <article
                    key={f.path}
                    /* And a tile's height is the file's share of its folder,
                       so area across the whole map is share of everything. */
                    style={{ flexGrow: f.tokens }}
                    className={`${styles.tile} ${styles['b' + band(f.tokens)]}`}
                    title={`${f.path} — ~${fmt(f.tokens)} tokens`}
                  >
                    <Thumb file={f} />
                    <p className={styles.tileName}>{nameOf(f.path)}</p>
                    <p className={styles.tileNum}>{fmt(f.tokens)}</p>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
