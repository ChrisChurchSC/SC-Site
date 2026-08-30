import styles from './DesignWindow.module.css'
import LogoWordmark from './LogoWordmark'

/**
 * THE INPUTS, DESIGNED — the screen for Build's "Design" step.
 *
 * Define settles what the inputs are; this is them made. A bento of the
 * brand's parts rather than a sheet of finished posts — the mark, the
 * palette, the two faces, the photography direction, the components and the
 * grid, weighted by how much of the brand each one carries.
 *
 * THE TOKENS ARE THE REAL ONES — the same four colours and two typefaces
 * this site is built in. Nothing here is a plausible-looking swatch; if the
 * brand palette changes, this screen is wrong and should be updated with it.
 *
 * Signifier is a commercial licence and Roboto Mono is unrestricted, which
 * is why only the names appear here and no font file is shipped for this.
 */
const PALETTE = [
  { name: 'Ground', hex: '#0A0A0A' },
  { name: 'Pink', hex: '#DF4ED6' },
  { name: 'Teal', hex: '#4ECFB3' },
  { name: 'Blue', hex: '#5A76E5' },
]


const ICONS = [
  'M1.8 3.6h4l1.4 1.6h7v7.2a1 1 0 0 1-1 1h-10.4a1 1 0 0 1-1-1z',
  'M3.5 8.5l3 3 6-6.5',
  'M8 2.5v8M4.8 7.6L8 10.9l3.2-3.3M3 13.5h10',
  'M3 13V8.4M8 13V3.4M13 13V6.4',
  'M8 8.4a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2M3.2 13.4c0-2.4 2.1-3.9 4.8-3.9s4.8 1.5 4.8 3.9',
  'M8 2.6a5.4 5.4 0 1 1-5.4 5.4M8 5.4v2.9l2 1.2',
]

/* Two cells of the bento are flat fills — see the note above the component. */
const ILLUSTRATIONS = ['Spot', 'Scene', 'Pattern']


/* The mark itself, beside the wordmark — the library holds both, and a brand
   cell showing only the logotype is missing half of what people recognise.

   viewBox is cropped to the mark's own bounds: the asset's is 0 0 75 75 with
   the shape inset, which would render it a third smaller than it should be. */
function ScMark({ className }) {
  return (
    <svg className={className} viewBox="11 11 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g clipPath="url(#sc-mark-clip-design)">
        <path d="M58.07 43.71L56.14 30.12C56.09 29.78 56.03 29.45 55.96 29.12C55.96 29.06 55.94 29 55.92 28.94C55 24.68 52.72 20.81 49.4 17.93C45.74 14.75 41.04 13 36.19 13C26.5 13 18.39 19.86 16.45 28.97C16.45 28.97 16.45 28.99 16.45 29C16.16 30.35 16.01 31.75 16.01 33.19C16.01 39.84 17.82 44.38 19.41 48.39C20.72 51.69 21.86 54.54 21.86 58.02C21.86 58.73 21.86 59.36 21.86 59.36V61.57C21.85 61.75 21.92 61.92 22.04 62.05C22.17 62.18 22.34 62.25 22.51 62.25H34.2C34.2 62.25 34.21 62.25 34.22 62.25H38.17C38.17 62.25 38.17 62.25 38.18 62.25H48.15C48.33 62.25 48.5 62.18 48.62 62.06C48.74 61.94 48.82 61.76 48.82 61.59V56.58H52.74C53.55 56.58 54.2 55.92 54.2 55.12V45.11H56.88C57.23 45.11 57.57 44.96 57.8 44.69C58.03 44.42 58.13 44.07 58.08 43.73L58.07 43.71ZM36.19 14.34C40.72 14.34 45.1 15.97 48.53 18.94C51.45 21.47 53.5 24.81 54.45 28.5H17.93C20.02 20.36 27.41 14.34 36.19 14.34ZM34.62 60.9L29.62 51.44H42.77L37.77 60.9H34.62ZM43.48 50.1H28.91L23.91 40.63H48.48L43.48 50.1ZM49.19 39.3H23.2L18.2 29.83H54.19L49.19 39.3ZM20.65 47.89C19.1 44 17.34 39.58 17.34 33.19C17.34 32.54 17.37 31.89 17.44 31.26L22.21 40.28L27.92 51.08L33.11 60.9H23.18V59.36C23.18 59.36 23.18 58.73 23.18 58.01C23.18 54.27 21.94 51.17 20.64 47.89H20.65ZM53.53 43.76C53.16 43.76 52.86 44.06 52.86 44.43V55.11C52.86 55.18 52.8 55.24 52.73 55.24H48.14C47.77 55.24 47.47 55.54 47.47 55.91V60.92H39.27L44.46 51.1L50.17 40.3L54.94 31.27L56.71 43.78H53.52L53.53 43.76Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="sc-mark-clip-design">
          <rect width="42.09" height="49.24" fill="white" transform="translate(16 13)" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default function DesignWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Visual</span>
        <span className={styles.badge}>System</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Foundations</span>
        <span className={styles.tab}>Components</span>
        <span className={styles.count}>v3</span>
      </div>

      <div className={styles.bento}>
        <div className={`${styles.cell} ${styles.cellMark}`}>
          <span className={styles.cellLabel}>Logomark</span>
          <span className={styles.markBox} aria-hidden="true">
            <ScMark className={styles.glyph} />
          </span>
        </div>

        <div className={`${styles.cell} ${styles.cellType}`}>
          <span className={styles.cellLabel}>Logotype</span>
          <span className={styles.typeBox} aria-hidden="true">
            <LogoWordmark fill="rgba(255,255,255,0.92)" />
          </span>
        </div>

        <div className={`${styles.cell} ${styles.cellWide}`}>
          <span className={styles.cellLabel}>Palette</span>
          <div className={styles.swatches}>
            {PALETTE.map(({ name, hex }) => (
              <span key={name} className={styles.swatch}>
                <span className={styles.chip} style={{ background: hex }} aria-hidden="true" />
                <span className={styles.hex}>{hex}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.cell} ${styles.cellWide}`}>
          <span className={styles.cellLabel}>Type</span>
          {/* Each line set in the face it names — a specimen that describes
              two fonts in a third one is a list, not a specimen. */}
          <p className={styles.serif}>Signifier</p>
          <p className={styles.mono}>Roboto Mono</p>
        </div>

        <div className={`${styles.cell} ${styles.cellPhoto}`}>
          <span className={styles.cellLabel}>Photography</span>
          {/* Flat, like every other asset placeholder here: there is no
              artwork in this repo to stand in for a direction. */}
          <span className={styles.photo} aria-hidden="true" />
        </div>

        <div className={`${styles.cell} ${styles.cellUi}`}>
          <span className={styles.cellLabel}>UI</span>
          <div className={styles.ui}>
            <span className={styles.btnFilled}>Book a demo</span>
            <span className={styles.btnGhost}>See pricing</span>
            <span className={styles.input}>you@company.com</span>
            <span className={styles.uiRow}>
              <span className={styles.toggle} aria-hidden="true"><span className={styles.knob} /></span>
              <span className={styles.pill}>Live</span>
            </span>
          </div>
        </div>

        <div className={`${styles.cell} ${styles.cellWide}`}>
          <span className={styles.cellLabel}>Icons</span>
          <div className={styles.icons}>
            {ICONS.map((d) => (
              <svg key={d} className={styles.icon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ))}
          </div>
        </div>

        <div className={`${styles.cell} ${styles.cellWide}`}>
          <span className={styles.cellLabel}>Illustration</span>
          <div className={styles.illos}>
            {ILLUSTRATIONS.map((name) => (
              <span key={name} className={styles.illo}>
                <span className={styles.illoFill} aria-hidden="true" />
                <span className={styles.illoName}>{name}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.cell} ${styles.cellWide}`}>
          <span className={styles.cellLabel}>Grid & spacing</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.meta}>4px base · 12-column</span>
        </div>
      </div>

    </div>
  )
}
