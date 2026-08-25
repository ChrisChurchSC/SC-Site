import { useState, useCallback } from 'react'
import { useMeta } from '../hooks/useMeta'
import {
  SURFACES, TEXT_RAMP, HAIRLINES, ACCENTS, FAMILIES,
  MONO_SCALE, DISPLAY_SCALE, RADII, MOTION, LAYOUT,
  BUTTONS, FIELDS, RATIOS, GRIDS,
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

/* SHIPPED means this demo reproduces the CSS of a component that exists in
   src/. NEW means the pattern is proposed here and has no component behind it
   yet — the badge is the difference between documentation and a wish. */
function Status({ value }) {
  const isNew = value === 'NEW'
  return (
    <span className={`${styles.status} ${isNew ? styles.statusNew : ''}`}>
      {value}
    </span>
  )
}

function Demo({ label, status = 'SHIPPED', note, wide, stage = true, children }) {
  return (
    <div className={`${styles.demo} ${wide ? styles.demoWide : ''}`}>
      <div className={styles.demoHead}>
        <span className={styles.demoLabel}>{label}</span>
        <Status value={status} />
      </div>
      {stage ? <div className={styles.demoStage}>{children}</div> : children}
      {note && <p className={styles.demoNote}>{note}</p>}
    </div>
  )
}

/* ── Paged carousel (NEW) ────────────────────────────────────────────────────
   The site ships a marquee but no paged carousel. This is the pattern if one
   is needed: transform on a track rather than scroll, so the step is exact and
   the dots can't disagree with the position. Arrows disable at the ends rather
   than wrapping — wrapping hides how much is left. */

const SLIDES = ['One', 'Two', 'Three', 'Four']

function Carousel() {
  const [i, setI] = useState(0)
  const last = SLIDES.length - 1

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselWindow}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {SLIDES.map((s) => (
            <div key={s} className={styles.slide}>
              <span className={styles.slideNum}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.carouselControls}>
        <div className={styles.dots}>
          {SLIDES.map((s, n) => (
            <button
              key={s}
              type="button"
              className={`${styles.dot} ${n === i ? styles.dotOn : ''}`}
              onClick={() => setI(n)}
              aria-label={`Go to slide ${n + 1}`}
            />
          ))}
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setI((n) => Math.min(last, n + 1))}
            disabled={i === last}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── AI chat (NEW) ───────────────────────────────────────────────────────────
   No chat exists on the site. This is the pattern in the studio's language:
   the reader's turn sits in a chip, because it is UI; the reply is set in
   Signifier, because it is prose and wants to be read rather than scanned.
   The replies below are canned strings — nothing is sent anywhere, and this
   demo is not wired to a model. It exists to pin down the states: resting,
   thinking, answered. */

const CANNED = [
  'The card surface is #161616 on a #0a0a0a ground, at a 4px radius.',
  'Body copy sits at rgba(255, 255, 255, 0.55) — the most common reading colour on the site.',
  'Labels are Roboto Mono, 8–11px, uppercase, tracked between 0.1em and 0.16em.',
]

function Chat() {
  const [turns, setTurns] = useState([
    { role: 'user', text: 'What surface do cards use?' },
    { role: 'bot', text: CANNED[0] },
  ])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || thinking) return
    setTurns((t) => [...t, { role: 'user', text }])
    setDraft('')
    setThinking(true)
    // Canned, deliberately: the demo is about the states, not an answer.
    setTimeout(() => {
      setTurns((t) => [
        ...t,
        { role: 'bot', text: CANNED[(t.length / 2 | 0) % CANNED.length] },
      ])
      setThinking(false)
    }, 900)
  }

  return (
    <div className={styles.chat}>
      <div className={styles.chatLog}>
        {turns.map((t, n) => (
          <div
            key={n}
            className={t.role === 'user' ? styles.turnUser : styles.turnBot}
          >
            {t.role === 'user' ? (
              <span className={styles.userBubble}>{t.text}</span>
            ) : (
              <p className={styles.botText}>{t.text}</p>
            )}
          </div>
        ))}
        {thinking && (
          <div className={styles.turnBot}>
            <span className={styles.thinking} aria-label="Thinking">
              <i /><i /><i />
            </span>
          </div>
        )}
      </div>
      <form className={styles.composer} onSubmit={send}>
        <input
          className={styles.composerInput}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about a token…"
          aria-label="Message"
        />
        <button
          type="submit"
          className={styles.composerSend}
          disabled={!draft.trim() || thinking}
        >
          Send
        </button>
      </form>
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
              ['Colour', 'colour'], ['Type', 'type'], ['Radius', 'radius'],
              ['Buttons', 'buttons'], ['Fields', 'fields'], ['Nav', 'nav'],
              ['Grids', 'grids'], ['Media', 'media'], ['Carousels', 'carousels'],
              ['Chat', 'chat'], ['Feedback', 'feedback'], ['Motion', 'motion'],
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

        {/* ── 03 Radius ── */}
        <Section
          id="radius"
          index={3}
          title="Radius"
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

        {/* ── 04 Buttons ── */}
        <Section
          id="buttons"
          index={4}
          title="Buttons"
          blurb="Six variants ship today. They agree on the type and disagree on almost everything else — hover them, then read the drift note at the bottom."
        >
          <div className={styles.demoGrid}>
            <Demo label="Solid" note={BUTTONS[0].note}>
              <button type="button" className={styles.btnSolid}>Send it</button>
            </Demo>

            <Demo label="Outline" note={BUTTONS[1].note}>
              <button type="button" className={styles.btnOutline}>Book a call</button>
            </Demo>

            <Demo label="Ghost" note={BUTTONS[2].note}>
              <button type="button" className={styles.btnDemo}>Subscribe</button>
            </Demo>

            <Demo label="Chip" note={BUTTONS[3].note}>
              <button type="button" className={styles.backDemo}>← Back</button>
            </Demo>

            <Demo label="Overlay" note={BUTTONS[4].note}>
              <span className={styles.overlayStage}>
                <button type="button" className={styles.btnOverlay}>View website</button>
              </span>
            </Demo>

            <Demo label="Gate" note={BUTTONS[5].note}>
              <button type="button" className={styles.btnGate}>Enter</button>
            </Demo>

            <Demo
              label="Disabled"
              status="NEW"
              note="No disabled style exists in the codebase — forms simply have none. This is the proposal: half opacity, default cursor, no hover."
            >
              <button type="button" className={styles.btnSolid} disabled>Send it</button>
            </Demo>

            <Demo
              label="Loading"
              status="NEW"
              note="Also absent. The three-dot pulse is borrowed from the chat pattern below so the two agree."
            >
              <button type="button" className={styles.btnSolid} disabled>
                <span className={styles.btnDots}><i /><i /><i /></span>
              </button>
            </Demo>

            <Demo
              label="Destructive"
              status="NEW"
              note="Uses the error red already in DeckGate (255, 80, 80) rather than inventing a fourth colour."
            >
              <button type="button" className={styles.btnDanger}>Delete</button>
            </Demo>
          </div>

          <h3 className={styles.subhead}>Specs</h3>
          <div className={styles.list}>
            {BUTTONS.map((b) => (
              <Row
                key={b.name}
                label={b.name}
                note={b.where}
                value={b.spec}
                onCopy={copy}
                copied={copied}
              />
            ))}
          </div>
        </Section>

        {/* ── 05 Fields ── */}
        <Section
          id="fields"
          index={5}
          title="Fields"
          blurb="Three different input designs ship on three different surfaces. Focus each one — they don't even agree on what focus looks like."
        >
          <div className={styles.demoGrid}>
            <Demo label="Contact" note={`Focus: ${FIELDS[0].focus}`}>
              <input className={styles.fieldContact} placeholder="Your name" aria-label="Contact field" />
            </Demo>

            <Demo label="Kit" note={`Focus: ${FIELDS[1].focus}`}>
              <input className={styles.inputDemo} placeholder="you@company.com" aria-label="Kit field" />
            </Demo>

            <Demo label="Gate" note={`Focus: ${FIELDS[2].focus}`}>
              <input className={styles.fieldGate} placeholder="Password" aria-label="Gate field" />
            </Demo>

            <Demo label="Textarea" note="Contact only. Resizes vertically, line-height 1.6.">
              <textarea
                className={styles.fieldTextarea}
                rows={3}
                placeholder="What are you building?"
                aria-label="Textarea"
              />
            </Demo>

            <Demo
              label="Error"
              note="The gate shakes for 0.4s and borders in rgba(255, 80, 80, 0.6). The only error treatment on the site."
            >
              <div className={styles.fieldErrorWrap}>
                <input className={styles.fieldError} defaultValue="wrong" aria-label="Error field" />
                <span className={styles.errorText}>Incorrect password</span>
              </div>
            </Demo>

            <Demo
              label="Label + field"
              status="NEW"
              note="No labelled-field pattern is shared between forms. Proposed: 8px mono eyebrow, 6px gap."
            >
              <div className={styles.labelledField}>
                <span className={styles.cardEyebrow}>Email</span>
                <input className={styles.fieldContact} placeholder="you@company.com" aria-label="Labelled field" />
              </div>
            </Demo>
          </div>
        </Section>

        {/* ── 06 Navigation ── */}
        <Section
          id="nav"
          index={6}
          title="Navigation"
          blurb="Four kinds, all of them lists of one sort or another. The site never uses a horizontal menu bar."
        >
          <div className={styles.demoGrid}>
            <Demo label="Rail card" note="The 312px right rail. #161616, 4px, hover to #1c1c1c.">
              <div className={styles.navCardDemo}>
                <span className={styles.navCardTitle}>Capabilities</span>
                <span className={styles.navCardSub}>Design, motion, engineering.</span>
              </div>
            </Demo>

            <Demo label="Indexed row" note="grid 28px / 1fr / auto, hairline at 0.07, hover drops to 0.6 opacity.">
              <div className={styles.navListDemo}>
                {[['001', 'Arbitrum', 'Brand'], ['002', 'Banzen', 'Content'], ['003', 'Talos', 'Product']].map(
                  ([n, name, type]) => (
                    <div key={n} className={styles.navRow}>
                      <span className={styles.navRowNum}>{n}</span>
                      <span className={styles.navRowName}>{name}</span>
                      <span className={styles.navRowType}>{type}</span>
                    </div>
                  ),
                )}
              </div>
            </Demo>

            <Demo label="Chip nav" note="Used for this page's own contents. 9px mono on #161616.">
              <div className={styles.chipNavDemo}>
                {['Colour', 'Type', 'Radius'].map((t) => (
                  <span key={t} className={styles.tocLink}>{t}</span>
                ))}
              </div>
            </Demo>

            <Demo label="Mobile link" note="Stacked list under 768px, where the rail is hidden entirely.">
              <div className={styles.mobileNavDemo}>
                {['Work', 'Thoughts', 'Contact'].map((t) => (
                  <span key={t} className={styles.mobileLink}>{t}</span>
                ))}
              </div>
            </Demo>

            <Demo
              label="Breadcrumb"
              status="NEW"
              note="Case studies nest two levels deep but only offer a back button. Proposed for /work/:client/:project."
            >
              <div className={styles.crumbs}>
                <span className={styles.crumb}>Work</span>
                <span className={styles.crumbSep}>/</span>
                <span className={styles.crumb}>Talos</span>
                <span className={styles.crumbSep}>/</span>
                <span className={styles.crumbOn}>Brand system</span>
              </div>
            </Demo>

            <Demo
              label="Pagination"
              status="NEW"
              note="The thoughts index renders every post. This is the pattern when it stops being reasonable."
            >
              <div className={styles.pager}>
                <button type="button" className={styles.pageBtn}>←</button>
                {['1', '2', '3'].map((n, k) => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.pageBtn} ${k === 0 ? styles.pageBtnOn : ''}`}
                  >
                    {n}
                  </button>
                ))}
                <button type="button" className={styles.pageBtn}>→</button>
              </div>
            </Demo>
          </div>
        </Section>

        {/* ── 07 Grids ── */}
        <Section
          id="grids"
          index={7}
          title="Grids"
          blurb="A 12-column grid on a 5px gutter carries the whole site — except the thoughts index, which quietly runs its own."
        >
          <div className={styles.gridDemos}>
            <div className={styles.gridDemo}>
              <div className={styles.demoHead}>
                <span className={styles.demoLabel}>12-column · gap 5px</span>
                <Status value="SHIPPED" />
              </div>
              <div className={styles.grid12}>
                {Array.from({ length: 12 }, (_, n) => (
                  <div key={n} className={styles.gridCell}>{n + 1}</div>
                ))}
              </div>
              <p className={styles.demoNote}>
                The site grid. Blocks span columns — the homepage is spans of 3, 4, 6 and 12.
              </p>
            </div>

            <div className={styles.gridDemo}>
              <div className={styles.demoHead}>
                <span className={styles.demoLabel}>Common spans</span>
                <Status value="SHIPPED" />
              </div>
              <div className={styles.grid12}>
                <div className={`${styles.gridCell} ${styles.span6}`}>6</div>
                <div className={`${styles.gridCell} ${styles.span6}`}>6</div>
                <div className={`${styles.gridCell} ${styles.span4}`}>4</div>
                <div className={`${styles.gridCell} ${styles.span4}`}>4</div>
                <div className={`${styles.gridCell} ${styles.span4}`}>4</div>
                <div className={`${styles.gridCell} ${styles.span3}`}>3</div>
                <div className={`${styles.gridCell} ${styles.span3}`}>3</div>
                <div className={`${styles.gridCell} ${styles.span3}`}>3</div>
                <div className={`${styles.gridCell} ${styles.span3}`}>3</div>
              </div>
              <p className={styles.demoNote}>
                Two-up, three-up and four-up. Everything on the homepage is one of these.
              </p>
            </div>

            <div className={styles.gridDemo}>
              <div className={styles.demoHead}>
                <span className={styles.demoLabel}>Editorial · 3-col, 28/56px</span>
                <Status value="SHIPPED" />
              </div>
              <div className={styles.gridEditorial}>
                {Array.from({ length: 3 }, (_, n) => (
                  <div key={n} className={styles.editorialCell}>
                    <span className={styles.editorialThumb} />
                    <span className={styles.cardEyebrow}>Thought {n + 1}</span>
                  </div>
                ))}
              </div>
              <p className={styles.demoNote}>
                The thoughts index. Wide gutters and a 40px pad — a different system
                on the same site.
              </p>
            </div>
          </div>

          <h3 className={styles.subhead}>Specs</h3>
          <div className={styles.list}>
            {GRIDS.map((g) => (
              <Row key={g.name} label={g.name} note={g.note} value={g.spec} onCopy={copy} copied={copied} />
            ))}
          </div>
        </Section>

        {/* ── 08 Media ── */}
        <Section
          id="media"
          index={8}
          title="Media &amp; image sizes"
          blurb="Four ratios, set with aspect-ratio rather than padding hacks. Below 768px most of them are overridden to 4:5 so the grid stays portrait on a phone."
        >
          <div className={styles.ratioRow}>
            {RATIOS.map((r) => (
              <button
                key={r.name}
                type="button"
                className={styles.ratioChip}
                onClick={() => copy(`aspect-ratio: ${r.css};`)}
                title={`Copy aspect-ratio: ${r.css}`}
              >
                <span className={styles.ratioBoxWrap}>
                  <span className={styles.ratioBox} style={{ aspectRatio: r.css }}>
                    <span className={styles.ratioName}>{r.name}</span>
                  </span>
                </span>
                <span className={styles.ratioMeta}>
                  <span className={styles.radiusValue}>
                    {copied === `aspect-ratio: ${r.css};` ? 'copied' : r.cls}
                  </span>
                  <span className={styles.radiusRole}>{r.where}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={styles.demoGrid}>
            <Demo label="Media tag" note="Absolute, top-right. 7px mono on a 0.12 fill — the smallest type on the site.">
              <span className={styles.mediaDemo}>
                <span className={styles.mediaTag}>Motion</span>
              </span>
            </Demo>

            <Demo label="Overlay control" note="Bottom-right, over unknown media. Solid black fill so it survives any image.">
              <span className={styles.mediaDemo}>
                <button type="button" className={styles.btnOverlayInner}>View website</button>
              </span>
            </Demo>

            <Demo
              label="Caption"
              status="NEW"
              note="Case-study media runs uncaptioned. Proposed: 9px mono at 0.3, 10px below the frame."
            >
              <span className={styles.captionDemo}>
                <span className={styles.mediaDemoSmall} />
                <span className={styles.caption}>Identity system, 2026</span>
              </span>
            </Demo>
          </div>
        </Section>

        {/* ── 09 Carousels ── */}
        <Section
          id="carousels"
          index={9}
          title="Carousels"
          blurb="One ships and one doesn't. The marquee is decorative and never stops; the paged carousel is for content someone has to actually get through."
        >
          <div className={styles.demoStack}>
            <Demo label="Marquee" wide stage={false}
              note="ClientStrip. 48s linear loop, duplicated track, edge mask so names fade rather than clip. Pauses on hover.">
              <div className={styles.marquee}>
                <div className={styles.marqueeWindow}>
                  <div className={styles.marqueeTrack}>
                    {[0, 1].map((pass) => (
                      <div key={pass} className={styles.marqueePass}>
                        {['Arbitrum', 'Banzen', 'Google', 'Heard', 'Photon', 'Talos', 'Transcend'].map((c) => (
                          <span key={c} className={styles.marqueeItem}>{c}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Demo>

            <Demo label="Paged" status="NEW" wide stage={false}
              note="Transform on the track rather than scroll, so the step is exact and the dots can't disagree with the position. Arrows disable at the ends instead of wrapping.">
              <Carousel />
            </Demo>
          </div>
        </Section>

        {/* ── 10 AI chat ── */}
        <Section
          id="chat"
          index={10}
          title="AI chat"
          blurb="Nothing like this exists on the site yet. The question a chat has to answer in this system is which half is UI and which half is prose."
        >
          <p className={styles.prose}>
            The answer here: the reader's turn is a chip, because it is UI — mono,
            small, on a faint fill. The reply is set in Signifier at reading size,
            because it is prose, and the whole site already says that anything meant
            to be read rather than scanned is a serif. That split is the only reason
            this looks like the rest of the site rather than a chat widget dropped
            onto it.
          </p>
          <div className={styles.demoStack}>
            <Demo label="Conversation" status="NEW" wide stage={false}
              note="Type and send — the replies are canned strings, not a model. The demo exists to pin the three states: resting, thinking, answered.">
              <Chat />
            </Demo>
          </div>
        </Section>

        {/* ── 11 Feedback ── */}
        <Section
          id="feedback"
          index={11}
          title="Feedback"
          blurb="What the site says back."
        >
          <div className={styles.demoGrid}>
            <Demo label="Toast" note="Fixed bottom-centre, 11px mono, overshoot easing on entry.">
              <span className={styles.toastDemo}>Copied to clipboard</span>
            </Demo>

            <Demo label="Route loader" note="2px bar, fixed top, white gradient sweeping over 0.9s on every navigation.">
              <span className={styles.loaderDemo}><i /></span>
            </Demo>

            <Demo label="Theme toggle" note="36×20 track, 12px thumb, 999px radius — one of only five pill radii on the site.">
              <span className={styles.toggleDemo}><i /></span>
            </Demo>

            <Demo label="Cursor" note="7px dot, swelling to a 30px ring over anything clickable. Native cursor is hidden site-wide.">
              <span className={styles.cursorDemo}>
                <span className={styles.cursorDot} />
                <span className={styles.cursorRing} />
              </span>
            </Demo>

            <Demo
              label="Empty state"
              status="NEW"
              note="No empty state exists anywhere. Proposed: an eyebrow and one serif line, centred in the container."
            >
              <span className={styles.emptyDemo}>
                <span className={styles.cardEyebrow}>No results</span>
                <span className={styles.emptyLine}>Nothing matches that yet.</span>
              </span>
            </Demo>

            <Demo
              label="Skeleton"
              status="NEW"
              note="Sanity-backed pages currently flash empty. Proposed: #161616 blocks pulsing between 0.06 and 0.12."
            >
              <span className={styles.skeleton}>
                <i style={{ width: '70%' }} />
                <i style={{ width: '92%' }} />
                <i style={{ width: '45%' }} />
              </span>
            </Demo>
          </div>
        </Section>

        {/* ── 12 Motion ── */}
        <Section
          id="motion"
          index={12}
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
          index={13}
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
          index={14}
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
          index={15}
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
              <span className={styles.driftStat}>4</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>
                  Undeclared semantic colours, in near-duplicate pairs
                </span>
                <p className={styles.driftNote}>
                  The site is not quite monochrome after all — it just uses colour
                  for status rather than brand, and never declared it. Errors are
                  {' '}<code className={styles.code}>rgba(255, 80, 80, …)</code> in DeckGate,
                  ClientLanding and LandingHub, but
                  {' '}<code className={styles.code}>rgba(220, 80, 80, …)</code> in CaseStudy.
                  Success is <code className={styles.code}>rgba(190, 220, 150, …)</code> in
                  one place and <code className={styles.code}>rgba(200, 225, 170, …)</code> in
                  another. Two reds and two greens, each pair doing one job. These are
                  the tokens the site actually needs — unlike the three that are declared.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>3</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>Radii on the six button variants</span>
                <p className={styles.driftNote}>
                  Solid, outline and overlay are 5px; ghost and chip are 4px; the gate
                  submit has none at all and is the only square control on the site.
                  Nothing else on the page uses 5px, so the buttons are the one place
                  the radius scale doesn't hold.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>3</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>Input designs, for one input</span>
                <p className={styles.driftNote}>
                  Contact fields are a 0.03 fill with a 0.14 border at 3px and 13px type.
                  Kit fields are <code className={styles.code}>#0a0a0a</code> with a 0.08
                  border at 4px and 10px. Gate fields are
                  {' '}<code className={styles.code}>#161616</code>, square, at 12px. They
                  disagree on fill, border, radius, size and what focus looks like — see
                  <a href="#fields" className={styles.inlineLink}>fields</a>.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>2</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>Grid systems</span>
                <p className={styles.driftNote}>
                  Everything runs on 12 columns with a 5px gutter, except the thoughts
                  index, which runs 3 columns with 28px and 56px gutters inside 40px of
                  padding. Both look fine alone; they just aren't the same site.
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
