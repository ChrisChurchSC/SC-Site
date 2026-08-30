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
          <span className={styles.cellLabel}>Mark</span>
          <span className={styles.mark} aria-hidden="true">
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

      <p className={styles.foot}>Drawn once, and reusable by anyone who opens the repo.</p>
    </div>
  )
}
