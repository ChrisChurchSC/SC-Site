import { useState, useCallback } from 'react'
import { useMeta } from '../hooks/useMeta'
import {
  SURFACES, TEXT_RAMP, HAIRLINES, ACCENTS, FAMILIES,
  MONO_SCALE, DISPLAY_SCALE, RADII, MOTION, LAYOUT,
} from '../data/designTokens'
import styles from './DesignSystem.module.css'

/* Internal styleguide. Noindex, not in the sitemap, no nav entry — reached by
   typing the URL.
 *
 * Everything on this page is live: the swatches are the real colours, the
 * specimens are set in the real fonts at the real sizes, and the component
 * demos carry the real hover and motion. Nothing here is a screenshot or a
 * hand-copied hex, because a styleguide that is maintained separately from
 * the site stops being true about a month after it ships. The values all come
 * from src/data/designTokens.js, which was read back out of the shipped CSS.
 */

/* ── Copy-on-click ───────────────────────────────────────────────────────── */

/* Copy without depending on the async Clipboard API alone.
 *
 * navigator.clipboard.writeText needs a secure context and transient user
 * activation, and it rejects — or never settles — when either is missing:
 * an http:// preview, an embedded webview, a tab that lost focus. Because it
 * is async, a rejection lands after the click has been forgotten, so the
 * button just sits there doing nothing and reads as broken.
 *
 * execCommand is deprecated but synchronous, which is exactly the property
 * that matters here: it runs inside the click gesture and reports success
 * immediately. Try it first, fall back to the modern API, and only flash
 * "copied" on a path that actually reported success.
 */
function writeToClipboard(value) {
  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    // Kept out of the layout and off-screen so selecting it can't scroll the page.
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    if (ok) return true
  } catch {
    // Fall through to the async API.
  }
  return false
}

function useCopy() {
  const [copied, setCopied] = useState(null)

  const copy = useCallback((value) => {
    const flash = () => {
      setCopied(value)
      setTimeout(() => setCopied((c) => (c === value ? null : c)), 1200)
    }

    if (writeToClipboard(value)) {
      flash()
      return
    }

    navigator.clipboard?.writeText?.(value).then(flash, () => {})
  }, [])

  return [copied, copy]
}

/* ── Layout primitives ───────────────────────────────────────────────────── */

function Section({ id, index, title, blurb, children }) {
  return (
    <section className={styles.section} id={id}>
      <header className={styles.sectionHead}>
        <span className={styles.sectionNum}>{String(index).padStart(2, '0')}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {blurb && <p className={styles.sectionBlurb}>{blurb}</p>}
      </header>
      {children}
    </section>
  )
}

function Row({ label, value, onCopy, copied, children, note }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowMain}>
        {children}
        <div className={styles.rowText}>
          <span className={styles.rowLabel}>{label}</span>
          {note && <span className={styles.rowNote}>{note}</span>}
        </div>
      </div>
      <button
        type="button"
        className={styles.value}
        onClick={() => onCopy(value)}
        title={`Copy ${value}`}
      >
        {copied === value ? 'copied' : value}
      </button>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function DesignSystem() {
  useMeta({
    title: 'Design System | Super Conscious',
    description: 'Internal styleguide — the tokens and components behind super-conscious.studio.',
    path: '/design-system',
    noindex: true,
  })

  const [copied, copy] = useCopy()

  return (
    <main className={styles.main}>
      <div className={styles.inner}>

        {/* ── Masthead ── */}
        <header className={styles.masthead}>
          <p className={styles.eyebrow}>Internal · Not indexed</p>
          <h1 className={styles.headline}>Design System</h1>
          <p className={styles.lede}>
            Read back out of the shipped CSS, not written ahead of it. Every swatch below
            is the real colour, every specimen is set in the real font at the real size,
            and every component demo carries the real hover. The counts are how many times
            each value actually appears across the stylesheets.
          </p>
          <nav className={styles.toc}>
            {[
              ['Colour', 'colour'], ['Type', 'type'], ['Form', 'form'],
              ['Components', 'components'], ['Motion', 'motion'],
              ['Layout', 'layout'], ['Light', 'light'], ['Drift', 'drift'],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className={styles.tocLink}>{label}</a>
            ))}
          </nav>
        </header>

        {/* ── 01 Colour ── */}
        <Section
          id="colour"
          index={1}
          title="Colour"
          blurb="A near-black ground, one card surface, and white at ten opacities. That is the whole palette in practice."
        >
          <h3 className={styles.subhead}>Surfaces</h3>
          <div className={styles.list}>
            {SURFACES.map((s) => (
              <Row
                key={s.value}
                label={s.name}
                note={s.note}
                value={s.value}
                onCopy={copy}
                copied={copied}
              >
                <span
                  className={styles.swatch}
                  style={{ background: s.value }}
                  aria-hidden="true"
                />
              </Row>
            ))}
          </div>

          <h3 className={styles.subhead}>Text ramp</h3>
          <p className={styles.subnote}>
            White at descending alpha. There is no second text colour — hierarchy is
            built entirely out of opacity.
          </p>
          <div className={styles.list}>
            {TEXT_RAMP.map((t) => (
              <Row
                key={t.alpha}
                label={t.role}
                note={t.cssVar ? `near ${t.cssVar}` : null}
                value={`rgba(255, 255, 255, ${t.alpha})`}
                onCopy={copy}
                copied={copied}
              >
                <span
                  className={styles.swatchText}
                  style={{ color: `rgba(255, 255, 255, ${t.alpha})` }}
                  aria-hidden="true"
                >
                  Aa
                </span>
                <span className={styles.alpha}>{t.alpha.toFixed(2)}</span>
                <span className={styles.count}>{t.uses}×</span>
              </Row>
            ))}
          </div>

          <h3 className={styles.subhead}>Hairlines &amp; fills</h3>
          <div className={styles.list}>
            {HAIRLINES.map((h) => (
              <Row
                key={h.alpha}
                label={h.role}
                value={`rgba(255, 255, 255, ${h.alpha})`}
                onCopy={copy}
                copied={copied}
              >
                <span
                  className={styles.swatchLine}
                  style={{ borderColor: `rgba(255, 255, 255, ${h.alpha})` }}
                  aria-hidden="true"
                />
                <span className={styles.alpha}>{h.alpha.toFixed(2)}</span>
                <span className={styles.count}>{h.uses}×</span>
              </Row>
            ))}
          </div>

          <h3 className={styles.subhead}>Accents</h3>
          <p className={styles.subnote}>
            Declared in <code className={styles.code}>:root</code> — and used nowhere.
            Each appears exactly once in the codebase: its own definition. See
            <a href="#drift" className={styles.inlineLink}>drift</a>.
          </p>
          <div className={styles.accentRow}>
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                type="button"
                className={styles.accentChip}
                onClick={() => copy(a.value)}
                title={`Copy ${a.value}`}
              >
                <span className={styles.accentSwatch} style={{ background: a.value }} />
                <span className={styles.accentName}>{a.name}</span>
                <span className={styles.accentValue}>
                  {copied === a.value ? 'copied' : a.value}
                </span>
                <span className={styles.accentVar}>{a.cssVar}</span>
                <span className={styles.accentUnused}>unused</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── 02 Type ── */}
        <Section
          id="type"
          index={2}
          title="Type"
          blurb="Two families, held far apart. A light serif carries everything anyone reads for meaning; a mono carries everything that labels, counts or points."
        >
          <div className={styles.families}>
            {FAMILIES.map((f) => (
              <div key={f.name} className={styles.family}>
                <div
                  className={styles.familySpecimen}
                  style={{ fontFamily: f.stack, fontWeight: f.weight }}
                >
                  Aa
                </div>
                <div className={styles.familyMeta}>
                  <span className={styles.familyName}>{f.name}</span>
                  <span className={styles.familyRole}>{f.role}</span>
                  <button
                    type="button"
                    className={styles.value}
                    onClick={() => copy(f.stack)}
                    title="Copy stack"
                  >
                    {copied === f.stack ? 'copied' : f.stack}
                  </button>
                  <span className={styles.familySource}>{f.source}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Mono scale</h3>
          <p className={styles.subnote}>
            Four sizes, none above 11px, all uppercase. They are separated as much by
            tracking as by size — the smaller the type, the wider it is set.
          </p>
          <div className={styles.list}>
            {MONO_SCALE.map((m) => (
              <div key={m.size} className={styles.specRow}>
                <span
                  className={styles.specMono}
                  style={{ fontSize: `${m.size}px`, letterSpacing: m.tracking }}
                >
                  The quick brown fox
                </span>
                <span className={styles.specMeta}>
                  <span className={styles.specSize}>{m.size}px</span>
                  <button
                    type="button"
                    className={styles.value}
                    onClick={() => copy(m.tracking)}
                    title="Copy tracking"
                  >
                    {copied === m.tracking ? 'copied' : m.tracking}
                  </button>
                  <span className={styles.count}>{m.uses}×</span>
                </span>
                <span className={styles.specRole}>{m.role}</span>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Display scale</h3>
          <p className={styles.subnote}>
            Fluid rather than stepped — each is a real <code className={styles.code}>clamp()</code> from
            the shipped CSS, so these specimens resize with the window.
          </p>
          <div className={styles.list}>
            {DISPLAY_SCALE.map((d) => (
              <div key={d.name} className={styles.specRow}>
                <span
                  className={styles.specDisplay}
                  style={{ fontSize: d.clamp, lineHeight: d.lineHeight }}
                >
                  {d.name}
                </span>
                <span className={styles.specMeta}>
                  <button
                    type="button"
                    className={styles.value}
                    onClick={() => copy(d.clamp)}
                    title="Copy clamp"
                  >
                    {copied === d.clamp ? 'copied' : d.clamp}
                  </button>
                  <span className={styles.count}>lh {d.lineHeight}</span>
                </span>
                <span className={styles.specRole}>{d.where}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 03 Form ── */}
        <Section
          id="form"
          index={3}
          title="Form"
          blurb="One radius does almost all the work."
        >
          <div className={styles.radii}>
            {RADII.map((r) => (
              <button
                key={r.value}
                type="button"
                className={styles.radiusChip}
                onClick={() => copy(`${r.value}px`)}
                title={`Copy ${r.value}px`}
              >
                <span
                  className={styles.radiusBox}
                  style={{ borderRadius: `${r.value}px` }}
                  aria-hidden="true"
                />
                <span className={styles.radiusValue}>
                  {copied === `${r.value}px` ? 'copied' : `${r.value}px`}
                </span>
                <span className={styles.count}>{r.uses}×</span>
                <span className={styles.radiusRole}>{r.role}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── 04 Components ── */}
        <Section
          id="components"
          index={4}
          title="Components"
          blurb="Live, not pictured. Hover them — the transitions are the ones the site ships."
        >
          <div className={styles.demoGrid}>
            <div className={styles.demo}>
              <span className={styles.demoLabel}>Card</span>
              <div className={styles.demoStage}>
                <div className={styles.cardDemo}>
                  <span className={styles.cardEyebrow}>Eyebrow</span>
                  <span className={styles.cardTitle}>Card title</span>
                </div>
              </div>
              <p className={styles.demoNote}>
                #161616, 4px, lifts 2px to #1c1c1c on hover.
              </p>
            </div>

            <div className={styles.demo}>
              <span className={styles.demoLabel}>Linked card</span>
              <div className={styles.demoStage}>
                <div className={`${styles.cardDemo} ${styles.cardDemoLink}`}>
                  <span className={styles.cardEyebrow}>Eyebrow</span>
                  <span className={styles.cardTitle}>Clickable</span>
                </div>
              </div>
              <p className={styles.demoNote}>
                Lifts 6px, takes a 3px white ring and a deep shadow.
              </p>
            </div>

            <div className={styles.demo}>
              <span className={styles.demoLabel}>Button</span>
              <div className={styles.demoStage}>
                <button type="button" className={styles.btnDemo}>Book a call</button>
              </div>
              <p className={styles.demoNote}>
                9px / 0.12em uppercase, rgba fill at 0.07, border at 0.12.
              </p>
            </div>

            <div className={styles.demo}>
              <span className={styles.demoLabel}>Back control</span>
              <div className={styles.demoStage}>
                <button type="button" className={styles.backDemo}>← Back</button>
              </div>
              <p className={styles.demoNote}>
                Global, fixed top-left. Lives outside .theme-layer so it survives
                the light-mode invert.
              </p>
            </div>

            <div className={styles.demo}>
              <span className={styles.demoLabel}>Input</span>
              <div className={styles.demoStage}>
                <input
                  className={styles.inputDemo}
                  placeholder="you@company.com"
                  aria-label="Demo input"
                />
              </div>
              <p className={styles.demoNote}>
                10px mono, border 0.08 → 0.20 on focus, background lifts to #111.
              </p>
            </div>

            <div className={styles.demo}>
              <span className={styles.demoLabel}>Eyebrow + headline</span>
              <div className={styles.demoStage}>
                <div className={styles.pairDemo}>
                  <span className={styles.cardEyebrow}>Section</span>
                  <span className={styles.pairHeadline}>A serif headline</span>
                </div>
              </div>
              <p className={styles.demoNote}>
                The site's most repeated pairing: 8px mono over Signifier Light.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 05 Motion ── */}
        <Section
          id="motion"
          index={5}
          title="Motion"
          blurb="Everything arrives the same way: up ten pixels, fading in, over half a second."
        >
          <div className={styles.list}>
            {MOTION.map((m) => (
              <Row
                key={m.name}
                label={m.name}
                note={m.detail}
                value={m.value}
                onCopy={copy}
                copied={copied}
              />
            ))}
          </div>

          <div className={styles.staggerDemo}>
            <span className={styles.demoLabel}>Stagger, as it ships</span>
            <div className={styles.staggerRow}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={styles.staggerBlock} />
              ))}
            </div>
            <p className={styles.demoNote}>
              Reload to replay. Delays of 0.05s, 0.12s, 0.19s and 0.26s — a ~70ms cascade.
            </p>
          </div>
        </Section>

        {/* ── 06 Layout ── */}
        <Section
          id="layout"
          index={6}
          title="Layout"
          blurb="A tight grid with a reserved rail, and measures set in characters rather than pixels."
        >
          <div className={styles.list}>
            {LAYOUT.map((l) => (
              <Row
                key={l.name}
                label={l.name}
                note={l.detail}
                value={l.value}
                onCopy={copy}
                copied={copied}
              />
            ))}
          </div>
        </Section>

        {/* ── 07 Light mode ── */}
        <Section
          id="light"
          index={7}
          title="Light mode"
          blurb="Not a second palette — a filter."
        >
          <p className={styles.prose}>
            Light mode is one CSS rule: <code className={styles.code}>[data-theme="light"] .theme-layer {'{'} filter: invert(1) {'}'}</code>.
            The whole page is inverted, then images and video are inverted a second
            time so photography survives. It is why there is no light-mode token set
            to document here, and why the ten-step white ramp above is the only ramp
            the site needs — inverted, it becomes the black ramp.
          </p>
          <p className={styles.prose}>
            Two consequences worth knowing before you add a component. Anything
            <code className={styles.code}>position: fixed</code> must sit outside
            <code className={styles.code}>.theme-layer</code>, because a filter on an
            ancestor creates a containing block and pins the element to the layer
            instead of the viewport — that is the entire reason the back button is
            declared in <code className={styles.code}>index.css</code> rather than in a
            module. And any colour you intend to survive inversion literally — a brand
            logo, a chart — needs the second invert applied by hand.
          </p>
          <div className={styles.lightPair}>
            <div className={styles.lightSwatch}>
              <span className={styles.lightLabel}>Dark</span>
              <span className={styles.lightValues}>#0a0a0a · #161616 · #1c1c1c</span>
            </div>
            <div className={`${styles.lightSwatch} ${styles.lightSwatchInv}`}>
              <span className={styles.lightLabel}>Inverted</span>
              <span className={styles.lightValues}>#f5f5f5 · #e9e9e9 · #e3e3e3</span>
            </div>
          </div>
        </Section>

        {/* ── 08 Drift ── */}
        <Section
          id="drift"
          index={8}
          title="Drift"
          blurb="What the audit turned up. This section is the reason the page is worth keeping."
        >
          <div className={styles.driftList}>
            <div className={styles.drift}>
              <span className={styles.driftStat}>2</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>
                  var() calls across every stylesheet
                </span>
                <p className={styles.driftNote}>
                  <code className={styles.code}>--bg</code>, <code className={styles.code}>--text</code>,
                  {' '}<code className={styles.code}>--text-muted</code>, <code className={styles.code}>--text-faint</code>,
                  {' '}<code className={styles.code}>--pink</code>, <code className={styles.code}>--teal</code> and
                  {' '}<code className={styles.code}>--blue</code> are declared in
                  {' '}<code className={styles.code}>:root</code>. Between them they are read
                  twice — both in <code className={styles.code}>index.css</code> itself. Every
                  module hardcodes the literal instead, which is why changing
                  {' '}<code className={styles.code}>--bg</code> today changes nothing.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>0</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>Uses of the three accent colours</span>
                <p className={styles.driftNote}>
                  Pink, teal and blue exist only as their own definitions. The shipped
                  site is entirely monochrome. Either they are a palette waiting to be
                  used, or they are three lines to delete — but right now they describe
                  a site that does not exist.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>0.28</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>
                  <code className={styles.code}>--text-faint</code> matches no value in use
                </span>
                <p className={styles.driftNote}>
                  The faint labels on the site are set at 0.20 and 0.22.
                  {' '}<code className={styles.code}>--text-muted</code> has the same problem:
                  declared 0.5, but 0.4 is what the labels actually use, 42 times.
                  The tokens were written from intent and the CSS from eye.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>12</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>Uses of a 3px radius</span>
                <p className={styles.driftNote}>
                  Alongside 85 uses of 4px and 27 of 2px. At these box sizes 3px is
                  indistinguishable from either — it is noise in the system rather
                  than a third step, and the cheapest cleanup on this page.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>20</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>Distinct white alphas</span>
                <p className={styles.driftNote}>
                  The ten above carry almost all of it, but there is a long tail —
                  0.25, 0.45, 0.6, 0.7, 0.75 — where two neighbouring values do the
                  same job in different files. Worth collapsing onto the ramp before
                  the next big page.
                </p>
              </div>
            </div>
          </div>

          <p className={styles.driftClose}>
            None of this is broken, and none of it is urgent — the site is visually
            consistent because it was built by one pair of eyes, not because the code
            enforces anything. The risk is the second pair. If these values move into
            <code className={styles.code}> :root</code> and the modules start reading
            them, this page stops being a description of the system and starts being
            the system.
          </p>
        </Section>

        <footer className={styles.footer}>
          <span>
            Rendered from <code className={styles.code}>src/data/designTokens.js</code>
          </span>
          <span className={styles.footerDim}>
            Counts measured across <code className={styles.code}>src/**/*.css</code>
          </span>
        </footer>

      </div>
    </main>
  )
}
