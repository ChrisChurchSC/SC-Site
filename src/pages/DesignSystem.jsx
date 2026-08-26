import { useState, useCallback, useRef, useEffect, Fragment } from 'react'
import { useMeta } from '../hooks/useMeta'
import {
  SURFACES, TEXT_RAMP, HAIRLINES, ACCENTS, GRADIENTS, FAMILIES, SPACING, ELEVATION, LAYERS,
  MONO_SCALE, DISPLAY_SCALE, RADII, MOTION, LAYOUT,
  BUTTONS, FIELDS, RATIOS, GRIDS, BACKLOG,
  CHART_PALETTE, CHART_SEQUENTIAL, CHART_DIVERGING, CHART_STATUS,
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
   yet — the badge is the difference between documentation and a wish.
   HAVE / PROTO / GAP are the backlog's version of the same distinction. */

const STATE_LABEL = { have: 'HAVE', proto: 'PROTO', gap: 'GAP' }

/* Two tones only, deliberately: something is either backed by real code
   (SHIPPED, HAVE — dim, settled) or it is not (NEW, PROTO — bright, unfinished).
   GAP is neither, so it gets an outline and no fill. */
const STATUS_TONE = {
  SHIPPED: '',
  HAVE: '',
  NEW: 'statusNew',
  PROTO: 'statusNew',
  GAP: 'statusGap',
}

function Status({ value }) {
  const tone = STATUS_TONE[value] ?? ''
  return (
    <span className={`${styles.status} ${tone ? styles[tone] : ''}`}>
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

/* ── Form patterns (NEW) ─────────────────────────────────────────────────────
   The native select, checkbox and radio cannot be styled to match a system
   this specific, so each is rebuilt from a button or a div with the real
   control's semantics kept via ARIA. Everything below is keyboard-reachable;
   none of it is wired to anything. */

function Select({ options, label }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(options[0])

  return (
    <div className={styles.select}>
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
      >
        <span>{value}</span>
        <span className={`${styles.selectCaret} ${open ? styles.selectCaretOpen : ''}`}>▾</span>
      </button>
      {open && (
        <div className={styles.selectMenu} role="listbox">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              className={`${styles.selectOption} ${o === value ? styles.selectOptionOn : ''}`}
              onClick={() => { setValue(o); setOpen(false) }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* A 14px box at a 2px radius — the checkbox is small enough that 4px would
   read as a circle. The tick is a rotated border rather than a glyph so it
   inherits colour and needs no icon font. */
function CheckGroup() {
  const [on, setOn] = useState(['Brand'])
  const toggle = (v) =>
    setOn((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))

  return (
    <div className={styles.choiceGroup}>
      {['Brand', 'Content', 'Product'].map((v) => (
        <button
          key={v}
          type="button"
          role="checkbox"
          aria-checked={on.includes(v)}
          className={styles.choiceRow}
          onClick={() => toggle(v)}
        >
          <span className={`${styles.check} ${on.includes(v) ? styles.checkOn : ''}`}>
            {on.includes(v) && <i />}
          </span>
          <span className={styles.choiceLabel}>{v}</span>
        </button>
      ))}
    </div>
  )
}

function RadioGroup() {
  const [on, setOn] = useState('Now')

  return (
    <div className={styles.choiceGroup}>
      {['Now', 'This quarter', 'Exploring'].map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={on === v}
          className={styles.choiceRow}
          onClick={() => setOn(v)}
        >
          <span className={`${styles.radio} ${on === v ? styles.radioOn : ''}`}>
            {on === v && <i />}
          </span>
          <span className={styles.choiceLabel}>{v}</span>
        </button>
      ))}
    </div>
  )
}

/* Validates on blur rather than on every keystroke — telling someone their
   email is invalid while they are still typing the domain is noise. */
function ValidatedField() {
  const [value, setValue] = useState('chris@')
  const [touched, setTouched] = useState(false)
  const invalid = touched && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(value)

  return (
    <div className={styles.labelledField}>
      <span className={styles.cardEyebrow}>Email</span>
      <input
        className={`${styles.fieldContact} ${invalid ? styles.fieldInvalid : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={invalid}
        aria-label="Email"
      />
      <span className={invalid ? styles.errorText : styles.hintText}>
        {invalid ? 'That address looks incomplete.' : 'Click out of the field to validate.'}
      </span>
    </div>
  )
}

function MultiStep() {
  const [step, setStep] = useState(0)
  const steps = ['Scope', 'Timing', 'Contact']

  return (
    <div className={styles.multiStep}>
      <div className={styles.stepRail}>
        {steps.map((s, n) => (
          <div key={s} className={styles.stepItem}>
            <span className={`${styles.stepDot} ${n <= step ? styles.stepDotOn : ''}`} />
            <span className={`${styles.stepLabel} ${n === step ? styles.stepLabelOn : ''}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className={styles.stepBody}>
        <span className={styles.stepBodyText}>Step {step + 1} — {steps[step]}</span>
      </div>
      <div className={styles.stepNav}>
        <button
          type="button"
          className={styles.btnOutline}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        <button
          type="button"
          className={styles.btnSolid}
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

/* Dashed border is the one place the system uses a non-solid stroke — it is
   the convention for "drop here" and fighting it costs more than it gains. */
function FileUpload() {
  const [over, setOver] = useState(false)
  const [file, setFile] = useState(null)

  return (
    <div
      className={`${styles.upload} ${over ? styles.uploadOver : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        setFile(e.dataTransfer.files?.[0]?.name ?? 'brief.pdf')
      }}
    >
      {file ? (
        <>
          <span className={styles.uploadName}>{file}</span>
          <button type="button" className={styles.uploadClear} onClick={() => setFile(null)}>
            Remove
          </button>
        </>
      ) : (
        <>
          <span className={styles.uploadLine}>Drop a file</span>
          <span className={styles.uploadHint}>PDF, up to 20MB</span>
        </>
      )}
    </div>
  )
}

function SearchField() {
  const [q, setQ] = useState('')
  return (
    <div className={styles.search}>
      <span className={styles.searchIcon} aria-hidden="true">⌕</span>
      <input
        className={styles.searchInput}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search work"
        aria-label="Search"
      />
      {q && (
        <button type="button" className={styles.searchClear} onClick={() => setQ('')} aria-label="Clear">
          ×
        </button>
      )}
    </div>
  )
}

/* ── Icons (NEW) ─────────────────────────────────────────────────────────────
 *
 * The site ships lucide-react and uses it for almost nothing. Lucide is a good
 * set and the wrong one here: it is drawn with round caps and 2px strokes on a
 * 24px grid, which reads friendly. This system is 8–11px mono and hairlines,
 * and a rounded icon beside 8px uppercase looks borrowed.
 *
 * So: a 16px grid, 1.25px strokes, butt caps and miter joins, every terminal
 * landing on a whole pixel. Geometry only — no tapers, no rounded corners, no
 * optical curves. Closer to a technical drawing than to an app icon.
 *
 * Everything is stroke-based and inherits currentColor, so an icon takes the
 * colour of the text beside it and needs no per-context variant.
 */
const ICONS = {
  'arrow-right': 'M2 8h12M9 3l5 5-5 5',
  'arrow-left': 'M14 8H2M7 3L2 8l5 5',
  'arrow-up': 'M8 14V2M3 7l5-5 5 5',
  'arrow-down': 'M8 2v12M3 9l5 5 5-5',
  'chevron-right': 'M6 3l5 5-5 5',
  'chevron-left': 'M10 3L5 8l5 5',
  'chevron-down': 'M3 6l5 5 5-5',
  'chevron-up': 'M3 10l5-5 5 5',
  close: 'M3 3l10 10M13 3L3 13',
  plus: 'M8 2v12M2 8h12',
  minus: 'M2 8h12',
  check: 'M2 8.5l4 4L14 4',
  menu: 'M2 4h12M2 8h12M2 12h12',
  search: 'M7 12a5 5 0 100-10 5 5 0 000 10M10.5 10.5L14 14',
  external: 'M9 2h5v5M14 2L7 9M12 9v5H2V4h5',
  copy: 'M5 5h9v9H5zM11 5V2H2v9h3',
  download: 'M8 2v9M4 7l4 4 4-4M2 14h12',
  upload: 'M8 11V2M4 6l4-4 4 4M2 14h12',
  link: 'M6.5 9.5l3-3M6 4l1.5-1.5a3 3 0 014 4L10 8M10 12l-1.5 1.5a3 3 0 01-4-4L6 8',
  refresh: 'M14 3v4h-4M13.2 9A5.5 5.5 0 112.5 8',
  filter: 'M2 3h12l-4.5 5.5V13L6.5 11V8.5z',
  sort: 'M4 12V3M2 5l2-2 2 2M8 4h6M8 8h4M8 12h2',
  info: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 7.5v4M8 5h.01',
  warning: 'M8 2l6 11H2zM8 6.5v3M8 11.5h.01',
  error: 'M8 14A6 6 0 108 2a6 6 0 000 12M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4',
  success: 'M8 14A6 6 0 108 2a6 6 0 000 12M5.2 8l2 2 3.6-3.6',
  clock: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 4.5V8l2.5 1.5',
  lock: 'M4 7h8v7H4zM6 7V5a2 2 0 014 0v2',
  play: 'M4 2l9 6-9 6z',
  pause: 'M5 3v10M11 3v10',
  image: 'M2 3h12v10H2zM2 10l3.5-3.5L9 10l2-2 3 3M5.5 5.5h.01',
  video: 'M2 4h9v8H2zM11 7l3-2v6l-3-2',
  file: 'M4 2h5l3 3v9H4zM9 2v3h3',
  calendar: 'M2 4h12v10H2zM2 7h12M5 2v3M11 2v3',
  mail: 'M2 4h12v8H2zM2 4l6 5 6-5',
  user: 'M8 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4',
  chart: 'M2 2v12h12M5 11V7M8 11V4M11 11V9',
  grid: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  list: 'M2 4h1M2 8h1M2 12h1M6 4h8M6 8h8M6 12h8',
  sliders: 'M3 3v10M8 3v10M13 3v10M1.5 6h3M6.5 10h3M11.5 5h3',
}

function Icon({ name, size = 16 }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={styles.icon}
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICONS[name]} />
    </svg>
  )
}

/* ── Overlays (NEW) ──────────────────────────────────────────────────────────
 *
 * The primitive the site is missing. Cal and contact drawers both ship, both
 * handle Escape, and neither declares role="dialog", aria-modal, or traps
 * focus — so a keyboard user tabs straight out of an open drawer and into the
 * page behind it, with no way to tell they've left.
 *
 * Everything below is contained in its demo rather than fixed to the viewport,
 * so the page stays usable; in production the same markup takes `position:
 * fixed` and the layers scale from Depth.
 */

/* Focus trap. Three obligations, all of them easy to miss:
 *   - move focus in when it opens,
 *   - cycle Tab and Shift+Tab at the two ends,
 *   - put focus back where it came from on close, or the reader is dumped at
 *     the top of the document with no idea what happened. */
function useFocusTrap(open, onClose) {
  const ref = useRef(null)
  const restoreTo = useRef(null)

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement
    const node = ref.current
    if (!node) return

    const focusables = () =>
      [...node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.hasAttribute('disabled'))

    focusables()[0]?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    node.addEventListener('keydown', onKey)
    return () => {
      node.removeEventListener('keydown', onKey)
      // Restore, or the reader lands back at the top of the document.
      if (restoreTo.current instanceof HTMLElement) restoreTo.current.focus()
    }
  }, [open, onClose])

  return ref
}

function Modal() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useFocusTrap(open, close)

  return (
    <div className={styles.overlayStageBox}>
      <button type="button" className={styles.btnOutline} onClick={() => setOpen(true)}>
        Open modal
      </button>
      {open && (
        <div className={styles.modalBackdrop} onMouseDown={close}>
          <div
            ref={ref}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ds-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHead}>
              <span id="ds-modal-title" className={styles.modalTitle}>Send this brief?</span>
              <button type="button" className={styles.iconOnly} onClick={close} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
            <p className={styles.modalBody}>
              Tab around — focus cycles inside and cannot escape. Escape closes, and
              focus returns to the button that opened it.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.btnOutline} onClick={close}>Cancel</button>
              <button type="button" className={styles.btnSolid} onClick={close}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Dropdown: an action menu, which is a different control from the select in
   Forms. A select returns a value; a menu performs a verb. They look similar
   and behave differently, so they carry different roles. */
function DropdownMenu() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState(null)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const items = [['copy', 'Duplicate'], ['download', 'Export'], ['link', 'Copy link'], ['close', 'Delete']]

  return (
    <div className={styles.menuWrap} ref={wrap}>
      <button
        type="button"
        className={styles.btnDemo}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Actions <Icon name="chevron-down" size={14} />
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {items.map(([icon, label], i) => (
            <Fragment key={label}>
              {i === items.length - 1 && <span className={styles.menuRule} />}
              <button
                type="button"
                role="menuitem"
                className={`${styles.menuItem} ${i === items.length - 1 ? styles.menuItemBad : ''}`}
                onClick={() => { setLast(label); setOpen(false) }}
              >
                <Icon name={icon} size={14} />{label}
              </button>
            </Fragment>
          ))}
        </div>
      )}
      {last && <span className={styles.menuEcho}>{last}</span>}
    </div>
  )
}

/* ── Date picker (NEW) ───────────────────────────────────────────────────────
   A month grid, because a text field asking for a date gets a different format
   from every visitor. Weeks start Monday, and today is marked whether or not
   it is selected. */
function DatePicker() {
  const [sel, setSel] = useState(14)
  const [open, setOpen] = useState(true)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  // Fixed month so the demo is deterministic — no Date() at render.
  const offset = 3
  const total = 31
  const today = 9

  return (
    <div className={styles.dateWrap}>
      <button
        type="button"
        className={styles.dateField}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Icon name="calendar" size={14} />
        <span>2026 · 03 · {String(sel).padStart(2, '0')}</span>
      </button>
      {open && (
        <div className={styles.calendar} role="dialog" aria-label="Choose a date">
          <div className={styles.calHead}>
            <button type="button" className={styles.iconOnly} aria-label="Previous month"><Icon name="chevron-left" size={14} /></button>
            <span className={styles.calMonth}>March 2026</span>
            <button type="button" className={styles.iconOnly} aria-label="Next month"><Icon name="chevron-right" size={14} /></button>
          </div>
          <div className={styles.calGrid}>
            {days.map((d, i) => (
              <span key={i} className={styles.calDay}>{d}</span>
            ))}
            {Array.from({ length: offset }, (_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: total }, (_, i) => {
              const n = i + 1
              const weekend = (i + offset) % 7 >= 5
              return (
                <button
                  key={n}
                  type="button"
                  aria-current={n === today ? 'date' : undefined}
                  aria-pressed={n === sel}
                  className={[
                    styles.calCell,
                    n === sel ? styles.calCellOn : '',
                    n === today ? styles.calToday : '',
                    weekend ? styles.calWeekend : '',
                  ].join(' ')}
                  onClick={() => setSel(n)}
                >
                  {n}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* Combobox: type to filter, arrow to move, enter to choose. Distinct from the
   select — a select shows every option, a combobox exists because there are
   too many to show. */
function Combobox() {
  const all = ['Arbitrum', 'Banzen', 'Entropy', 'Google', 'Heard', 'Hylands', 'Nimruz', 'Photon', 'Talos', 'Transcend']
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const hits = all.filter((a) => a.toLowerCase().includes(q.toLowerCase()))

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setCursor((c) => Math.min(hits.length - 1, c + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)) }
    if (e.key === 'Enter' && open && hits[cursor]) { e.preventDefault(); setQ(hits[cursor]); setOpen(false) }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className={styles.comboWrap}>
      <input
        className={styles.fieldContact}
        value={q}
        placeholder="Type a client"
        aria-expanded={open}
        aria-autocomplete="list"
        role="combobox"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
      />
      {open && (
        <div className={styles.comboList} role="listbox">
          {hits.length ? hits.slice(0, 5).map((h, i) => (
            <button
              key={h}
              type="button"
              role="option"
              aria-selected={i === cursor}
              className={`${styles.comboItem} ${i === cursor ? styles.comboItemOn : ''}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => { setQ(h); setOpen(false) }}
            >
              {/* The matched run is marked, so it is obvious why a row is here. */}
              {q && h.toLowerCase().includes(q.toLowerCase()) ? (
                <>
                  {h.slice(0, h.toLowerCase().indexOf(q.toLowerCase()))}
                  <mark className={styles.comboMark}>
                    {h.slice(h.toLowerCase().indexOf(q.toLowerCase()), h.toLowerCase().indexOf(q.toLowerCase()) + q.length)}
                  </mark>
                  {h.slice(h.toLowerCase().indexOf(q.toLowerCase()) + q.length)}
                </>
              ) : h}
            </button>
          )) : <span className={styles.comboEmpty}>No matches</span>}
        </div>
      )}
    </div>
  )
}

/* ── Small controls (NEW) ────────────────────────────────────────────────── */

function Switch() {
  const [on, setOn] = useState(true)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={styles.switchRow}
      onClick={() => setOn((o) => !o)}
    >
      <span className={`${styles.switchTrack} ${on ? styles.switchOn : ''}`}>
        <span className={styles.switchThumb} />
      </span>
      <span className={styles.choiceLabel}>Email me a copy</span>
    </button>
  )
}

/* Steppers exist so a number can be nudged without selecting and retyping.
   The field stays editable — a stepper that forces you through the buttons is
   worse than a plain input. */
function Stepper() {
  const [n, setN] = useState(6)
  return (
    <div className={styles.stepper}>
      <button type="button" className={styles.stepBtn} onClick={() => setN((v) => Math.max(1, v - 1))} aria-label="Decrease">
        <Icon name="minus" size={14} />
      </button>
      <input
        className={styles.stepInput}
        value={n}
        onChange={(e) => setN(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
        aria-label="Weeks"
      />
      <button type="button" className={styles.stepBtn} onClick={() => setN((v) => Math.min(52, v + 1))} aria-label="Increase">
        <Icon name="plus" size={14} />
      </button>
      <span className={styles.stepUnit}>weeks</span>
    </div>
  )
}

function TagInput() {
  const [tags, setTags] = useState(['Brand', 'Motion'])
  const [draft, setDraft] = useState('')
  const add = (e) => {
    e.preventDefault()
    const v = draft.trim()
    if (!v || tags.includes(v)) return
    setTags((t) => [...t, v])
    setDraft('')
  }
  return (
    <form className={styles.tagField} onSubmit={add}>
      {tags.map((t) => (
        <span key={t} className={styles.tag}>
          {t}
          <button type="button" onClick={() => setTags((x) => x.filter((y) => y !== t))} aria-label={`Remove ${t}`}>
            <Icon name="close" size={12} />
          </button>
        </span>
      ))}
      <input
        className={styles.tagInput}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Backspace' && !draft) setTags((t) => t.slice(0, -1)) }}
        placeholder={tags.length ? '' : 'Add a tag'}
        aria-label="Add tag"
      />
    </form>
  )
}

function SliderControl() {
  const [v, setV] = useState(40)
  return (
    <div className={styles.sliderWrap}>
      <div className={styles.sliderHead}>
        <span className={styles.cardEyebrow}>Budget</span>
        <span className={styles.sliderVal}>${v}k</span>
      </div>
      <input
        type="range" min="10" max="120" step="5" value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={styles.baRange}
        aria-label="Budget"
      />
      <div className={styles.sliderEnds}>
        <span className={styles.axisMutedText}>$10k</span>
        <span className={styles.axisMutedText}>$120k</span>
      </div>
    </div>
  )
}

/* ── Data grid (NEW) ─────────────────────────────────────────────────────────
 *
 * A spreadsheet is not a styled table — it is a different instrument, and the
 * differences are load-bearing:
 *
 *   - Cell rules on both axes. A reading table drops vertical rules because
 *     prose has a natural left edge; a grid needs them, because a cell is
 *     addressed by column as much as by row.
 *   - A row gutter with numbers, so a row can be referred to out loud.
 *   - Numerics right-aligned in mono with tabular figures, so digits stack in
 *     columns and magnitude is visible as length.
 *   - A totals row pinned at the bottom, ruled off from the data.
 *   - A selected cell with a visible ring, because the thing you are looking
 *     at and the thing you would edit must be the same thing.
 *
 * Sorting is real. Selection is real. Nothing is wired to a backend.
 */
const GRID_ROWS = [
  ['Talos', 'Brand', 2026, 84000, 0.34, 'Live'],
  ['Transcend', 'Content', 2026, 61000, 0.22, 'Live'],
  ['Photon', 'Product', 2025, 70500, 0.28, 'Done'],
  ['Heard', 'Brand', 2025, 42000, 0.16, 'Done'],
  ['Hylands', 'Content', 2026, 33500, 0.12, 'Draft'],
  ['Nimruz', 'Product', 2024, 28000, 0.09, 'Done'],
]

const GRID_COLS = [
  { key: 0, label: 'Client', type: 'text', w: '1.4fr' },
  { key: 1, label: 'Discipline', type: 'text', w: '1.1fr' },
  { key: 2, label: 'Year', type: 'num', w: '0.7fr' },
  { key: 3, label: 'Fee', type: 'money', w: '1fr' },
  { key: 4, label: 'Share', type: 'pct', w: '0.9fr' },
  { key: 5, label: 'Status', type: 'status', w: '0.9fr' },
]

const fmt = (v, type) => {
  if (type === 'money') return `$${v.toLocaleString()}`
  if (type === 'pct') return `${(v * 100).toFixed(1)}%`
  return String(v)
}

function DataGrid() {
  const [sort, setSort] = useState({ col: 3, dir: 'desc' })
  const [sel, setSel] = useState({ r: 0, c: 0 })
  const [picked, setPicked] = useState([0])
  const [dense, setDense] = useState(false)

  const rows = [...GRID_ROWS].sort((a, b) => {
    const x = a[sort.col], y = b[sort.col]
    const cmp = typeof x === 'number' ? x - y : String(x).localeCompare(String(y))
    return sort.dir === 'asc' ? cmp : -cmp
  })

  const total = rows.reduce((a, r) => a + r[3], 0)
  const template = `34px ${GRID_COLS.map((c) => c.w).join(' ')}`

  const toggleRow = (i) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))

  return (
    <div className={styles.gridWrap}>
      <div className={styles.gridBar}>
        <span className={styles.gridCount}>
          {rows.length} rows · {picked.length} selected
        </span>
        <div className={styles.gridBarRight}>
          <button type="button" className={styles.tableToggle} onClick={() => setDense((d) => !d)}>
            {dense ? 'Comfortable' : 'Compact'}
          </button>
        </div>
      </div>

      <div className={styles.gridScroll}>
        <div
          className={`${styles.grid} ${dense ? styles.gridDense : ''}`}
          style={{ gridTemplateColumns: template }}
          role="grid"
        >
          {/* Header. The gutter cell stays empty — it addresses rows, not data. */}
          <div className={`${styles.gCell} ${styles.gHead} ${styles.gGutter}`} />
          {GRID_COLS.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`${styles.gCell} ${styles.gHead} ${c.type !== 'text' && c.type !== 'status' ? styles.gNum : ''}`}
              onClick={() => setSort((s) => ({ col: c.key, dir: s.col === c.key && s.dir === 'desc' ? 'asc' : 'desc' }))}
              aria-sort={sort.col === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              {c.label}
              <span className={styles.gSort}>
                {sort.col === c.key ? (sort.dir === 'desc' ? '↓' : '↑') : ''}
              </span>
            </button>
          ))}

          {rows.map((row, r) => (
            <Fragment key={row[0]}>
              <button
                type="button"
                className={`${styles.gCell} ${styles.gGutter} ${picked.includes(r) ? styles.gGutterOn : ''}`}
                onClick={() => toggleRow(r)}
                aria-label={`Select row ${r + 1}`}
              >
                {r + 1}
              </button>
              {GRID_COLS.map((c) => {
                const isSel = sel.r === r && sel.c === c.key
                const numeric = c.type === 'money' || c.type === 'pct' || c.type === 'num'
                return (
                  <div
                    key={c.key}
                    role="gridcell"
                    tabIndex={0}
                    className={[
                      styles.gCell,
                      numeric ? styles.gNum : '',
                      isSel ? styles.gSel : '',
                      picked.includes(r) ? styles.gRowOn : '',
                    ].join(' ')}
                    onClick={() => setSel({ r, c: c.key })}
                    onFocus={() => setSel({ r, c: c.key })}
                  >
                    {c.type === 'status' ? (
                      <span className={`${styles.gPill} ${row[5] === 'Live' ? styles.gPillOn : row[5] === 'Draft' ? styles.gPillDraft : ''}`}>
                        {row[5]}
                      </span>
                    ) : (
                      fmt(row[c.key], c.type)
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}

          {/* Totals, ruled off. A total that scrolls away with the data is a
              total nobody reads. */}
          <div className={`${styles.gCell} ${styles.gFoot} ${styles.gGutter}`}>Σ</div>
          <div className={`${styles.gCell} ${styles.gFoot}`}>Total</div>
          <div className={`${styles.gCell} ${styles.gFoot}`} />
          <div className={`${styles.gCell} ${styles.gFoot} ${styles.gNum}`} />
          <div className={`${styles.gCell} ${styles.gFoot} ${styles.gNum}`}>${total.toLocaleString()}</div>
          <div className={`${styles.gCell} ${styles.gFoot} ${styles.gNum}`}>100.0%</div>
          <div className={`${styles.gCell} ${styles.gFoot}`} />
        </div>
      </div>

      <div className={styles.gridFoot}>
        <span className={styles.gridCell}>
          Cell {String.fromCharCode(65 + sel.c)}{sel.r + 1} ·{' '}
          {GRID_COLS[sel.c].type === 'status'
            ? rows[sel.r][5]
            : fmt(rows[sel.r][GRID_COLS[sel.c].key], GRID_COLS[sel.c].type)}
        </span>
      </div>
    </div>
  )
}

/* ── People (NEW) ────────────────────────────────────────────────────────────
   No avatar exists anywhere in the codebase, and both About and Careers want
   one. Initials rather than a photo as the default: a studio of five has no
   headshot pipeline, and a missing image is worse than no image. */
function Avatar({ name, size = 32 }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

function PersonCard() {
  return (
    <div className={styles.people}>
      {[['Chris Church', 'Founder, strategy'], ['Dana Cole', 'Design director'], ['Ravi Menon', 'Engineering']].map(
        ([name, role]) => (
          <div key={name} className={styles.person}>
            <Avatar name={name} size={36} />
            <span className={styles.personText}>
              <span className={styles.personName}>{name}</span>
              <span className={styles.personRole}>{role}</span>
            </span>
          </div>
        ),
      )}
    </div>
  )
}

/* ── Prev / next (NEW) ───────────────────────────────────────────────────────
   A case study is currently a dead end — nothing in the codebase links one to
   the next. Both ends are named rather than labelled "previous" and "next"
   alone, because the name is what decides whether anyone clicks. */
function PrevNext() {
  return (
    <nav className={styles.prevNext} aria-label="Case studies">
      <a href="#content" className={styles.pnItem}>
        <span className={styles.pnDir}><Icon name="arrow-left" size={14} />Previous</span>
        <span className={styles.pnName}>Transcend</span>
        <span className={styles.pnMeta}>Brand system</span>
      </a>
      <a href="#content" className={`${styles.pnItem} ${styles.pnNext}`}>
        <span className={styles.pnDir}>Next<Icon name="arrow-right" size={14} /></span>
        <span className={styles.pnName}>Photon</span>
        <span className={styles.pnMeta}>Brand + Product</span>
      </a>
    </nav>
  )
}

/* Scrollspy: the chip nav already exists, but nothing tells the reader where
   they are in it. Uses IntersectionObserver rather than a scroll handler, so
   it costs nothing per frame. */
function Scrollspy() {
  const ids = ['colour', 'type', 'radius', 'spacing']
  const [active, setActive] = useState('colour')

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className={styles.spyRow}>
      {ids.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? 'true' : undefined}
          className={`${styles.spyLink} ${active === id ? styles.spyLinkOn : ''}`}
        >
          {id}
        </a>
      ))}
    </div>
  )
}

/* ── Composed form (NEW) ─────────────────────────────────────────────────────
 *
 * The controls above are parts; this is the assembly, and the assembly is
 * where forms actually go wrong. Conventions fixed here so they stop being
 * re-decided per page:
 *
 *   - Optional is marked, not required. Most fields in a studio enquiry are
 *     required, so marking the exception is less ink and less noise.
 *   - Labels sit above their field, never beside. Beside breaks the moment a
 *     label wraps, and every label wraps on a phone.
 *   - Help text is present before the error is, in the same slot, so the row
 *     doesn't change height when validation fires.
 *   - The primary action is on the left, in reading order after the last
 *     field. There is no cancel on a form nobody is trapped in.
 */
function ComposedForm() {
  const [state, setState] = useState('idle')
  const [showErr, setShowErr] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (state === 'sending') return
    if (!showErr) { setShowErr(true); return }
    setState('sending')
    setTimeout(() => setState('done'), 1100)
  }

  return (
    <form className={styles.formDemo} onSubmit={submit}>
      {showErr && state === 'idle' && (
        /* Summary first, because a screen reader lands at the top of the form
           and a field-level error alone is unreachable from there. */
        <div className={styles.errSummary} role="alert">
          <span className={styles.errSummaryTitle}>Two fields need attention</span>
          <ul className={styles.errList}>
            <li><a href="#df-email" className={styles.errLink}>Email — that address looks incomplete</a></li>
            <li><a href="#df-scope" className={styles.errLink}>Scope — choose at least one</a></li>
          </ul>
        </div>
      )}

      <div className={styles.formRow}>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Name</span>
          <input className={styles.fieldContact} defaultValue="Chris Church" />
          <span className={styles.formHelp}>As you'd like to be addressed.</span>
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>
            Company <span className={styles.formOptional}>Optional</span>
          </span>
          <input className={styles.fieldContact} placeholder="Studio or brand" />
          <span className={styles.formHelp}>&nbsp;</span>
        </label>
      </div>

      <label className={styles.formField} htmlFor="df-email">
        <span className={styles.formLabel}>Email</span>
        <input
          id="df-email"
          className={`${styles.fieldContact} ${showErr ? styles.fieldInvalid : ''}`}
          defaultValue="chris@"
          aria-invalid={showErr}
        />
        <span className={showErr ? styles.errorText : styles.formHelp}>
          {showErr ? 'That address looks incomplete.' : "We'll only use this to reply."}
        </span>
      </label>

      <fieldset className={styles.formGroup} id="df-scope">
        <legend className={styles.formLabel}>Scope</legend>
        <CheckGroup />
        <span className={showErr ? styles.errorText : styles.formHelp}>
          {showErr ? 'Choose at least one.' : 'Pick as many as apply.'}
        </span>
      </fieldset>

      <label className={styles.formField}>
        <span className={styles.formLabel}>Brief</span>
        <textarea className={styles.fieldTextarea} rows={3} defaultValue="We need a system our team can run without us." />
        <span className={styles.formHelp}>48 / 500</span>
      </label>

      <div className={styles.formActions}>
        <button type="submit" className={styles.btnSolid} disabled={state !== 'idle'}>
          {state === 'sending'
            ? <span className={styles.btnDots}><i /><i /><i /></span>
            : state === 'done' ? 'Sent' : 'Send enquiry'}
        </button>
        <span className={styles.formNote}>
          {state === 'done' ? 'Thanks — we reply within two days.' : 'Usually a reply within two days.'}
        </span>
      </div>
    </form>
  )
}

/* ── Navigation patterns (NEW) ───────────────────────────────────────────── */

/* Sidebar: sections, an active row, and a count. The site's rail is flat and
   ungrouped, which is fine at eight links and breaks at twenty. */
function SidebarNav() {
  const [on, setOn] = useState('Talos')
  const groups = [
    ['Brand', ['Talos', 'Transcend', 'Photon']],
    ['Content', ['Heard', 'Hylands']],
  ]
  return (
    <nav className={styles.sidebar}>
      {groups.map(([group, items]) => (
        <div key={group} className={styles.sidebarGroup}>
          <div className={styles.sidebarHead}>
            <span className={styles.sidebarTitle}>{group}</span>
            <span className={styles.sidebarCount}>{items.length}</span>
          </div>
          {items.map((it) => (
            <button
              key={it}
              type="button"
              aria-current={on === it ? 'page' : undefined}
              className={`${styles.sidebarItem} ${on === it ? styles.sidebarItemOn : ''}`}
              onClick={() => setOn(it)}
            >
              {it}
            </button>
          ))}
        </div>
      ))}
    </nav>
  )
}

/* Command palette: the fastest navigation on a site with ninety-six routes,
   and the only pattern here that scales without a redesign. */
function CommandPalette() {
  const [q, setQ] = useState('')
  const all = ['Work — Talos', 'Work — Transcend', 'Thoughts — Rethinking the workweek', 'Contact', 'Design system', 'Careers']
  const hits = all.filter((r) => r.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
  return (
    <div className={styles.palette}>
      <div className={styles.paletteBar}>
        <span className={styles.paletteHint}>⌘K</span>
        <input
          className={styles.paletteInput}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to…"
          aria-label="Command palette"
        />
      </div>
      <div className={styles.paletteList}>
        {hits.length ? hits.map((r, i) => (
          <div key={r} className={`${styles.paletteRow} ${i === 0 ? styles.paletteRowOn : ''}`}>
            <span>{r}</span>
            {i === 0 && <span className={styles.paletteEnter}>↵</span>}
          </div>
        )) : (
          <div className={styles.paletteEmpty}>No matches</div>
        )}
      </div>
    </div>
  )
}

function Tabs() {
  const [on, setOn] = useState('Approach')
  const tabs = ['Approach', 'Craft', 'Outcome']

  return (
    <div className={styles.tabs}>
      <div className={styles.tabRow} role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on === t}
            className={`${styles.tab} ${on === t ? styles.tabOn : ''}`}
            onClick={() => setOn(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        <span className={styles.tabPanelText}>{on}</span>
      </div>
    </div>
  )
}

function FilterBar() {
  const [on, setOn] = useState(['Brand'])
  const toggle = (v) =>
    setOn((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))

  return (
    <div className={styles.filterBar}>
      {['Brand', 'Content', 'Product', 'Motion'].map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={on.includes(v)}
          className={`${styles.filterChip} ${on.includes(v) ? styles.filterChipOn : ''}`}
          onClick={() => toggle(v)}
        >
          {v}
        </button>
      ))}
      {on.length > 0 && (
        <button type="button" className={styles.filterClear} onClick={() => setOn([])}>
          Clear
        </button>
      )}
    </div>
  )
}

/* The arrow carries the direction so the label never has to say "ascending",
   which at 9px would wrap. */
function SortControl() {
  const [by, setBy] = useState('Year')
  const [desc, setDesc] = useState(true)

  return (
    <div className={styles.sortRow}>
      <span className={styles.cardEyebrow}>Sort</span>
      {['Year', 'Client'].map((v) => (
        <button
          key={v}
          type="button"
          className={`${styles.sortBtn} ${by === v ? styles.sortBtnOn : ''}`}
          onClick={() => (by === v ? setDesc((d) => !d) : setBy(v))}
        >
          {v}
          {by === v && <span className={styles.sortArrow}>{desc ? '↓' : '↑'}</span>}
        </button>
      ))}
    </div>
  )
}

/* ── Content patterns (NEW) ──────────────────────────────────────────────── */

function Accordion() {
  const [open, setOpen] = useState(0)
  const items = [
    ['What does a brand system include?', 'Identity, voice, and the rules that keep both intact once other people start using them.'],
    ['How long does it take?', 'Six to ten weeks for most systems, depending on how much needs to exist at the end.'],
    ['Do you work with in-house teams?', 'Usually. The handover matters more than the artefact.'],
  ]

  return (
    <div className={styles.accordion}>
      {items.map(([q, a], n) => (
        <div key={q} className={styles.accItem}>
          <button
            type="button"
            className={styles.accHead}
            onClick={() => setOpen((o) => (o === n ? -1 : n))}
            aria-expanded={open === n}
          >
            <span className={styles.accQ}>{q}</span>
            <span className={`${styles.accMark} ${open === n ? styles.accMarkOpen : ''}`}>+</span>
          </button>
          {open === n && <p className={styles.accA}>{a}</p>}
        </div>
      ))}
    </div>
  )
}

/* Tooltip on hover and focus both — hover alone makes it keyboard-invisible. */
function Tooltip() {
  const [show, setShow] = useState(false)
  return (
    <span className={styles.tipWrap}>
      <button
        type="button"
        className={styles.tipTrigger}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        brand system
      </button>
      {show && (
        <span className={styles.tip} role="tooltip">
          The rules that keep an identity intact once other people use it.
        </span>
      )}
    </span>
  )
}

/* ── Feedback patterns (NEW) ─────────────────────────────────────────────── */

function ProgressBar() {
  const [pct, setPct] = useState(38)
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.progressMeta}>
        <span className={styles.progressPct}>{pct}%</span>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={() => setPct((p) => Math.max(0, p - 12))}>−</button>
          <button type="button" className={styles.arrow} onClick={() => setPct((p) => Math.min(100, p + 12))}>+</button>
        </div>
      </div>
    </div>
  )
}

/* Contained inside the demo rather than fixed to the viewport, so it can be
   shown without covering the page. In use it would take a backdrop and a
   focus trap. */
function ConfirmDialog() {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.confirmStage}>
      {open ? (
        <div className={styles.confirm} role="dialog" aria-label="Confirm">
          <span className={styles.confirmTitle}>Delete this case study?</span>
          <p className={styles.confirmBody}>This cannot be undone.</p>
          <div className={styles.confirmActions}>
            <button type="button" className={styles.btnOutline} onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className={styles.btnDanger} onClick={() => setOpen(false)}>Delete</button>
          </div>
        </div>
      ) : (
        <button type="button" className={styles.btnDanger} onClick={() => setOpen(true)}>Delete</button>
      )}
    </div>
  )
}

/* ── Media patterns (NEW) ────────────────────────────────────────────────── */

function Lightbox() {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.lightStage}>
      <button type="button" className={styles.lightThumb} onClick={() => setOpen(true)} aria-label="Open">
        <span className={styles.lightThumbHint}>Open</span>
      </button>
      {open && (
        <div className={styles.lightOverlay} role="dialog" aria-label="Lightbox">
          <button type="button" className={styles.lightClose} onClick={() => setOpen(false)} aria-label="Close">×</button>
          <span className={styles.lightFrame} />
          <span className={styles.caption}>Identity system, 2026 — 1 of 6</span>
        </div>
      )}
    </div>
  )
}

function Gallery() {
  const [on, setOn] = useState(0)
  return (
    <div className={styles.gallery}>
      <span className={styles.galleryMain}>
        <span className={styles.galleryNum}>{on + 1}</span>
      </span>
      <div className={styles.galleryThumbs}>
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.galleryThumb} ${n === on ? styles.galleryThumbOn : ''}`}
            onClick={() => setOn(n)}
            aria-label={`Image ${n + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* Range input rather than a drag handler: it is keyboard-operable for free
   and cannot get stuck mid-drag when the pointer leaves the element. */
function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <div className={styles.baWrap}>
      <div className={styles.ba}>
        <span className={styles.baAfter}><span className={styles.baTag}>After</span></span>
        <span className={styles.baBefore} style={{ width: `${pos}%` }}>
          <span className={styles.baTag}>Before</span>
        </span>
        <span className={styles.baLine} style={{ left: `${pos}%` }} />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={styles.baRange}
        aria-label="Reveal"
      />
    </div>
  )
}

function VideoControls() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [pos, setPos] = useState(28)

  return (
    <div className={styles.videoWrap}>
      <div className={styles.videoBar}>
        <button
          type="button"
          className={styles.videoBtn}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❙❙' : '▶'}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className={styles.videoScrub}
          aria-label="Scrub"
        />
        <span className={styles.videoTime}>0:{String(Math.round(pos * 0.6)).padStart(2, '0')}</span>
        <button
          type="button"
          className={styles.videoBtn}
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  )
}

/* ── AI patterns (NEW) ───────────────────────────────────────────────────── */

/* Reserves the full height of the finished paragraph before it starts, so the
   layout doesn't reflow line by line as tokens land. */
function StreamingText() {
  const full = 'The card surface is #161616 on a #0a0a0a ground, at a 4px radius — the one surface the whole site uses.'
  const [n, setN] = useState(0)
  const [running, setRunning] = useState(false)

  const run = () => {
    if (running) return
    setRunning(true)
    setN(0)
    const id = setInterval(() => {
      setN((v) => {
        if (v >= full.length) {
          clearInterval(id)
          setRunning(false)
          return v
        }
        return v + 2
      })
    }, 24)
  }

  return (
    <div className={styles.stream}>
      <p className={styles.streamText}>
        <span className={styles.streamGhost}>{full}</span>
        <span className={styles.streamLive}>
          {full.slice(0, n)}
          {running && <span className={styles.caret} />}
        </span>
      </p>
      <button type="button" className={styles.btnDemo} onClick={run} disabled={running}>
        {running ? 'Streaming' : 'Replay'}
      </button>
    </div>
  )
}

function ResponseFeedback() {
  const [vote, setVote] = useState(null)
  return (
    <div className={styles.voteRow}>
      {[['up', 'Helpful'], ['down', 'Not helpful']].map(([k, label]) => (
        <button
          key={k}
          type="button"
          aria-pressed={vote === k}
          aria-label={label}
          className={`${styles.voteBtn} ${vote === k ? styles.voteBtnOn : ''}`}
          onClick={() => setVote((v) => (v === k ? null : k))}
        >
          {k === 'up' ? '▲' : '▼'}
        </button>
      ))}
      <span className={styles.voteNote}>
        {vote === 'up' ? 'Thanks.' : vote === 'down' ? 'Noted — what was wrong?' : 'Was this useful?'}
      </span>
    </div>
  )
}

/* ── Charts (NEW) ────────────────────────────────────────────────────────────
 *
 * All inline SVG — no chart library, nothing to load, and the marks inherit
 * the page's own tokens. Series colour comes from CHART_PALETTE via CSS custom
 * properties, so a slot changes in one place.
 *
 * Two rules the specs here are built around, both easy to get wrong:
 * text never wears the series colour (values and labels stay in the site's
 * white ramp; the coloured mark beside them carries identity), and every
 * chart with two or more series carries a legend as well as its colour, so
 * identity is never colour-alone.
 *
 * These are built as instruments, not illustrations. Twelve periods rather
 * than six, ticks and units on the axes, reference lines where a number is
 * being judged against something, and marks kept thin so the data occupies
 * the ink rather than the styling. Where a chart can mislead — a truncated
 * axis, a donut past four slices — the note says so.
 */

const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)']

const MO = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const REVENUE = [42, 51, 47, 63, 58, 71, 68, 79, 74, 88, 92, 96]
const PIPELINE = [28, 33, 39, 41, 52, 49, 61, 58, 67, 72, 70, 81]
const TARGET = 75

/* Shared axis furniture. Ticks as well as gridlines: a gridline helps you read
   across, a tick tells you exactly where the value sits. */
function YAxis({ ticks, y, x0, x1, unit, minor = [] }) {
  const base = ticks[0]
  const top = ticks[ticks.length - 1]
  return (
    <g>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} className={styles.grid} />
          <line x1={x0 - 4} x2={x0} y1={y(v)} y2={y(v)} className={styles.tick} />
          <text x={x0 - 7} y={y(v) + 2.5} className={styles.axisText} textAnchor="end">{v}</text>
        </g>
      ))}
      {minor.map((v) => (
        <line key={v} x1={x0 - 2} x2={x0} y1={y(v)} y2={y(v)} className={styles.tickMinor} />
      ))}
      {/* Drawn spines: a plot with a baseline is a measurement, not a picture. */}
      <line x1={x0} x2={x0} y1={y(top)} y2={y(base)} className={styles.spine} />
      <line x1={x0} x2={x1} y1={y(base)} y2={y(base)} className={styles.spine} />
      {unit && <text x={x0 - 7} y={y(top) - 9} className={styles.unitText} textAnchor="end">{unit}</text>}
    </g>
  )
}

function Legend({ items }) {
  return (
    <div className={styles.legend2}>
      {items.map(([label, colour, dashed]) => (
        <span key={label} className={styles.legendKey}>
          <span
            className={dashed ? styles.legendDash : styles.legendSwatch}
            style={dashed ? { borderColor: colour } : { background: colour }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}

/* KPI row: figure, delta, and the shape behind it. A number with no trend is a
   number you can't act on, so the sparkline is part of the tile rather than a
   separate chart. */
function KpiRow() {
  const tiles = [
    ['MRR', '$96k', '+4.3%', true, REVENUE, 0],
    ['Pipeline', '$81k', '+15.7%', true, PIPELINE, 1],
    ['Churn', '4.1%', '−0.6pt', true, [12, 11, 11, 10, 9, 9, 8, 7, 7, 5, 4, 4], 2],
  ]
  return (
    <div className={styles.tiles}>
      {tiles.map(([label, fig, delta, good, d, s]) => {
        const max = Math.max(...d) * 1.2
        const pts = d.map((v, i) => `${i ? 'L' : 'M'}${i * 10},${26 - (v / max) * 22}`).join(' ')
        return (
          <div key={label} className={styles.tile}>
            <span className={styles.tileLabel}>{label}</span>
            <div className={styles.tileMain}>
              <span className={styles.tileFig}>{fig}</span>
              <svg viewBox="0 0 116 28" className={styles.tileSpark} aria-hidden="true">
                <path d={pts} fill="none" stroke={SERIES[s]} strokeWidth="1.5" />
              </svg>
            </div>
            <span className={`${styles.tileDelta} ${good ? styles.tileDeltaGood : ''}`}>
              {delta} <span className={styles.tileVs}>vs prior period</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* The workhorse. Twelve periods, a dashed target, a crosshair that reads by
   x-position, and a table view — the numbers have to be available exactly,
   not just approximately. */
function TimeSeries() {
  const [hover, setHover] = useState(null)
  const [table, setTable] = useState(false)
  const x = (i) => 52 + i * 55
  const y = (v) => 176 - (v / 100) * 150
  const path = (d) => d.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')

  if (table) {
    return (
      <figure className={styles.fig}>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr><th>Period</th><th className={styles.tNum}>Revenue</th><th className={styles.tNum}>Pipeline</th><th className={styles.tNum}>vs target</th></tr>
            </thead>
            <tbody>
              {MO.map((m, i) => (
                <tr key={i}>
                  <td>P{i + 1}</td>
                  <td className={styles.tNum}>{REVENUE[i]}</td>
                  <td className={styles.tNum}>{PIPELINE[i]}</td>
                  <td className={styles.tNum}>{REVENUE[i] - TARGET > 0 ? `+${REVENUE[i] - TARGET}` : REVENUE[i] - TARGET}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className={styles.tableToggle} onClick={() => setTable(false)}>Show chart</button>
      </figure>
    )
  }

  return (
    <figure className={styles.fig}>
      <div className={styles.plotWrap}>
        <svg
          viewBox="0 0 720 200"
          className={styles.svgWide}
          role="img"
          aria-label="Revenue and pipeline over twelve periods against target"
          onMouseLeave={() => setHover(null)}
        >
          <YAxis ticks={[0, 25, 50, 75, 100]} minor={[12.5, 37.5, 62.5, 87.5]} y={y} x0={46} x1={712} unit="$k" />
          {/* Reference line — the number these series are being judged against. */}
          <line x1="46" x2="712" y1={y(TARGET)} y2={y(TARGET)} className={styles.refLine} />
          <text x="712" y={y(TARGET) - 5} className={styles.refText} textAnchor="end">Target {TARGET}</text>

          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1="12" y2="176" className={styles.crosshair} />}

          <path d={path(PIPELINE)} fill="none" stroke={SERIES[1]} strokeWidth="1.5" />
          <path d={path(REVENUE)} fill="none" stroke={SERIES[0]} strokeWidth="1.5" />
          {[REVENUE, PIPELINE].map((d, s) =>
            d.map((v, i) => (
              <circle
                key={`${s}-${i}`}
                cx={x(i)} cy={y(v)} r={hover === i ? 4 : 2.5}
                fill={SERIES[s]} className={styles.dot}
              />
            )),
          )}
          {MO.map((m, i) => (
            <rect key={i} x={x(i) - 27} y="8" width="55" height="168" fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
          {MO.map((m, i) => (
            <text key={i} x={x(i)} y="192" className={styles.axisText} textAnchor="middle">{m}</text>
          ))}
        </svg>
        {hover !== null && (
          <div className={styles.tipBox} style={{ left: `${(x(hover) / 720) * 100}%` }}>
            <span className={styles.tipMonth}>Period {hover + 1}</span>
            <span className={styles.tipRow}><i style={{ background: 'var(--s1)' }} />Revenue<b>${REVENUE[hover]}k</b></span>
            <span className={styles.tipRow}><i style={{ background: 'var(--s2)' }} />Pipeline<b>${PIPELINE[hover]}k</b></span>
            <span className={styles.tipDelta}>
              {REVENUE[hover] >= TARGET ? '+' : ''}{REVENUE[hover] - TARGET} vs target
            </span>
          </div>
        )}
      </div>
      <div className={styles.figFoot}>
        <Legend items={[['Revenue', 'var(--s1)'], ['Pipeline', 'var(--s2)'], ['Target', 'rgba(255,255,255,0.35)', true]]} />
        <button type="button" className={styles.tableToggle} onClick={() => setTable(true)}>Show table</button>
      </div>
    </figure>
  )
}

/* Bars against a reference: the comparison is the point, so the mean sits on
   the chart rather than in a caption. */
function BarChart() {
  const mean = Math.round(REVENUE.reduce((a, b) => a + b, 0) / REVENUE.length)
  const y = (v) => 150 - (v / 100) * 124
  const w = 22
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Revenue by period against mean">
        <YAxis ticks={[0, 50, 100]} minor={[25, 75]} y={y} x0={40} x1={396} unit="$k" />
        {REVENUE.map((v, i) => (
          <rect
            key={i} x={44 + i * 29} y={y(v)} width={w} height={150 - y(v)}
            rx="0" fill={SERIES[0]} className={styles.mark}
          >
            <title>P{i + 1}: ${v}k</title>
          </rect>
        ))}
        <line x1="40" x2="396" y1={y(mean)} y2={y(mean)} className={styles.refLine} />
        <text x="396" y={y(mean) - 4} className={styles.refText} textAnchor="end">Mean {mean}</text>
        {MO.map((m, i) => (
          <text key={i} x={55 + i * 29} y="165" className={styles.axisText} textAnchor="middle">{m}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Axis starts at zero — a truncated baseline exaggerates every difference.</figcaption>
    </figure>
  )
}

/* Ranked, with the share stated. A ranking chart whose bars aren't sorted is
   making the reader do the sorting. */
function BarH() {
  const data = [['Brand', 61], ['Content', 44], ['Product', 38], ['Motion', 22], ['Advisory', 14]]
  const total = data.reduce((a, [, v]) => a + v, 0)
  const max = 70
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Projects by discipline, ranked">
        {data.map(([label, v], i) => {
          const wpx = (v / max) * 232
          return (
            <g key={label}>
              <text x="0" y={24 + i * 32} className={styles.axisText}>{label}</text>
              <rect x="76" y={13 + i * 32} width={wpx} height="16" rx="0" fill={SERIES[1]} className={styles.mark}>
                <title>{label}: {v} ({Math.round((v / total) * 100)}%)</title>
              </rect>
              <text x={76 + wpx + 8} y={25 + i * 32} className={styles.valueText}>{v}</text>
              <text x="396" y={25 + i * 32} className={styles.axisMuted} textAnchor="end">
                {Math.round((v / total) * 100)}%
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className={styles.figCap}>Sorted descending, count and share both shown.</figcaption>
    </figure>
  )
}

/* 100% stacked: for composition over time, where the mix matters and the
   total doesn't. */
function StackedBar() {
  const mix = [[46, 30, 24], [44, 31, 25], [42, 33, 25], [40, 32, 28], [38, 34, 28], [35, 35, 30],
    [34, 34, 32], [32, 35, 33], [31, 34, 35], [29, 35, 36], [28, 34, 38], [26, 34, 40]]
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Revenue mix over time">
        <YAxis ticks={[0, 50, 100]} y={(v) => 150 - (v / 100) * 124} x0={40} x1={396} unit="%" />
        {mix.map((col, i) => {
          let acc = 0
          return (
            <g key={i}>
              {col.map((v, s) => {
                const h = (v / 100) * 124
                const yy = 150 - acc - h
                acc += h
                return (
                  <rect key={s} x={44 + i * 29} y={yy + 1} width="22" height={Math.max(0, h - 2)} rx="0" fill={SERIES[s]} className={styles.mark}>
                    <title>P{i + 1} {['Brand', 'Content', 'Product'][s]}: {v}%</title>
                  </rect>
                )
              })}
              <text x={55 + i * 29} y="165" className={styles.axisText} textAnchor="middle">{MO[i]}</text>
            </g>
          )
        })}
      </svg>
      <Legend items={[['Brand', 'var(--s1)'], ['Content', 'var(--s2)'], ['Product', 'var(--s3)']]} />
      <figcaption className={styles.figCap}>100% stacked — mix over time, where the total isn't the question.</figcaption>
    </figure>
  )
}

/* Waterfall: how a total got from one number to another. The single most
   useful analytical chart the site doesn't have. */
function Waterfall() {
  const steps = [['Open', 42, 'base'], ['New', 31, 'up'], ['Expand', 14, 'up'], ['Churn', -11, 'down'], ['Contract', -6, 'down'], ['Close', 70, 'base']]
  const y = (v) => 150 - (v / 90) * 124
  let run = 0
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Pipeline bridge">
        <YAxis ticks={[0, 45, 90]} y={y} x0={40} x1={396} unit="$k" />
        {steps.map(([label, v, kind], i) => {
          const isBase = kind === 'base'
          const start = isBase ? 0 : run
          const end = isBase ? v : run + v
          if (!isBase) run += v
          else run = v
          const top = Math.min(start, end)
          const h = Math.abs(end - start)
          const fill = isBase ? 'rgba(255,255,255,0.28)' : kind === "up" ? SERIES[1] : SERIES[0]
          return (
            <g key={label}>
              <rect x={48 + i * 58} y={y(top + h)} width="40" height={Math.max(1, (h / 90) * 124)} rx="0" fill={fill} className={styles.mark}>
                <title>{label}: {v > 0 && !isBase ? '+' : ''}{v}</title>
              </rect>
              {/* Connector to the next step, so the running total is legible. */}
              {i < steps.length - 1 && (
                <line x1={48 + i * 58 + 40} x2={48 + (i + 1) * 58} y1={y(end)} y2={y(end)} className={styles.connector} />
              )}
              <text x={68 + i * 58} y={y(top + h) - 5} className={styles.valueText} textAnchor="middle">
                {!isBase && v > 0 ? '+' : ''}{v}
              </text>
              <text x={68 + i * 58} y="165" className={styles.axisMuted} textAnchor="middle">{label}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className={styles.figCap}>Bridge — how the opening number became the closing one.</figcaption>
    </figure>
  )
}

/* Bullet: actual against target and a qualitative range, in the space a
   gauge would waste. */
function Bullet() {
  const rows = [['Revenue', 96, 90, 100], ['Pipeline', 81, 95, 120], ['Retention', 88, 85, 100], ['Utilisation', 67, 80, 100]]
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Metrics against target">
        {rows.map(([label, actual, target, max], i) => {
          const sc = (v) => (v / max) * 232
          return (
            <g key={label}>
              <text x="0" y={26 + i * 38} className={styles.axisText}>{label}</text>
              {/* Qualitative bands, deliberately low-contrast greys. */}
              <rect x="86" y={14 + i * 38} width={sc(max)} height="16" rx="0" fill="rgba(255,255,255,0.04)" />
              <rect x="86" y={14 + i * 38} width={sc(max * 0.75)} height="16" rx="0" fill="rgba(255,255,255,0.07)" />
              <rect x="86" y={18 + i * 38} width={sc(actual)} height="8" rx="0" fill={actual >= target ? SERIES[1] : SERIES[0]} className={styles.mark}>
                <title>{label}: {actual} of target {target}</title>
              </rect>
              {/* Target as a tick across the measure — the reference, not a bar. */}
              <line x1={86 + sc(target)} x2={86 + sc(target)} y1={12 + i * 38} y2={32 + i * 38} className={styles.targetTick} />
              <text x="396" y={26 + i * 38} className={styles.valueText} textAnchor="end">{actual}</text>
            </g>
          )
        })}
      </svg>
      <Legend items={[['At or above target', 'var(--s2)'], ['Below target', 'var(--s1)']]} />
      <figcaption className={styles.figCap}>Bullet — actual, target tick, and qualitative bands.</figcaption>
    </figure>
  )
}

/* Distribution, not average. A mean hides the shape; a histogram is how you
   find out the average is lying to you. */
function Histogram() {
  const bins = [2, 5, 9, 14, 19, 22, 17, 11, 6, 3]
  const labels = ['0', '', '20', '', '40', '', '60', '', '80', '']
  const max = 24
  const y = (v) => 150 - (v / max) * 124
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Project value distribution">
        <YAxis ticks={[0, 12, 24]} y={y} x0={40} x1={396} unit="n" />
        {bins.map((v, i) => (
          <rect key={i} x={45 + i * 35.4} y={y(v)} width="34" height={150 - y(v)} fill={SERIES[2]} className={styles.mark}>
            <title>Bin {i + 1}: {v} projects</title>
          </rect>
        ))}
        {/* Median marker — the number a skewed distribution should be read by. */}
        <line x1={45 + 5.2 * 35.4} x2={45 + 5.2 * 35.4} y1="20" y2="150" className={styles.refLine} />
        <text x={45 + 5.2 * 35.4 + 6} y="28" className={styles.refText}>Median</text>
        {labels.map((l, i) => l && (
          <text key={i} x={62 + i * 35.4} y="165" className={styles.axisText} textAnchor="middle">{l}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Histogram — bars touch, because the x-axis is continuous.</figcaption>
    </figure>
  )
}

/* Box plot: five numbers per category, for comparing spread rather than
   centre. */
function BoxPlot() {
  const groups = [['Brand', 18, 34, 47, 61, 88], ['Content', 8, 16, 24, 33, 52], ['Product', 26, 44, 62, 78, 96], ['Motion', 6, 12, 19, 28, 41]]
  const y = (v) => 148 - (v / 100) * 120
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Project value spread by discipline">
        <YAxis ticks={[0, 50, 100]} minor={[25, 75]} y={y} x0={40} x1={396} unit="$k" />
        {groups.map(([label, lo, q1, med, q3, hi], i) => {
          const cx = 84 + i * 82
          return (
            <g key={label}>
              <line x1={cx} x2={cx} y1={y(hi)} y2={y(lo)} className={styles.whisker} />
              <line x1={cx - 10} x2={cx + 10} y1={y(hi)} y2={y(hi)} className={styles.whisker} />
              <line x1={cx - 10} x2={cx + 10} y1={y(lo)} y2={y(lo)} className={styles.whisker} />
              <rect x={cx - 20} y={y(q3)} width="40" height={y(q1) - y(q3)} rx="0" fill={SERIES[2]} fillOpacity="0.45" stroke={SERIES[2]} strokeWidth="1" className={styles.mark}>
                <title>{label}: median {med}, IQR {q1}–{q3}</title>
              </rect>
              <line x1={cx - 20} x2={cx + 20} y1={y(med)} y2={y(med)} className={styles.medianLine} />
              <text x={cx} y="165" className={styles.axisMuted} textAnchor="middle">{label}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className={styles.figCap}>Box — min, quartiles, median, max. Spread, not just centre.</figcaption>
    </figure>
  )
}

/* Funnel with the step conversion stated. A funnel that only shows volumes
   makes you do the division. */
function Funnel() {
  const steps = [['Visits', 4820], ['Enquiries', 412], ['Calls', 168], ['Proposals', 74], ['Won', 31]]
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Conversion funnel">
        {steps.map(([label, v], i) => {
          const wpx = (v / steps[0][1]) ** 0.42 * 300
          const prev = i ? steps[i - 1][1] : null
          return (
            <g key={label}>
              <rect x={50} y={8 + i * 32} width={wpx} height="22" rx="0" fill={SERIES[0]} fillOpacity={1 - i * 0.14} className={styles.mark}>
                <title>{label}: {v.toLocaleString()}</title>
              </rect>
              <text x={56} y={23 + i * 32} className={styles.funnelLabel}>{label}</text>
              <text x={50 + wpx + 8} y={23 + i * 32} className={styles.valueText}>{v.toLocaleString()}</text>
              {prev && (
                <text x="396" y={23 + i * 32} className={styles.axisMuted} textAnchor="end">
                  {((v / prev) * 100).toFixed(1)}%
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <figcaption className={styles.figCap}>Step conversion on the right — the number people actually want.</figcaption>
    </figure>
  )
}

/* Cohort retention: the grid that answers "is the product getting stickier".
   Sequential ramp, because every cell is the same measure. */
function Cohort() {
  const rows = [
    ['P1', [100, 82, 71, 64, 58, 55]],
    ['P2', [100, 85, 74, 68, 63, null]],
    ['P3', [100, 88, 79, 72, null, null]],
    ['P4', [100, 86, 80, null, null, null]],
    ['P5', [100, 91, null, null, null, null]],
  ]
  const q = (v) => (v === null ? 0 : v >= 90 ? 5 : v >= 80 ? 4 : v >= 70 ? 3 : v >= 60 ? 2 : 1)
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Cohort retention">
        {['M0', 'M1', 'M2', 'M3', 'M4', 'M5'].map((m, ci) => (
          <text key={m} x={62 + ci * 56} y="14" className={styles.axisText} textAnchor="middle">{m}</text>
        ))}
        {rows.map(([label, vals], ri) => (
          <g key={label}>
            <text x="0" y={38 + ri * 29} className={styles.axisText}>{label}</text>
            {vals.map((v, ci) => (
              <g key={ci}>
                <rect x={36 + ci * 56} y={22 + ri * 29} width="52" height="24" rx="0" fill={`var(--q${q(v)})`} className={styles.mark}>
                  {v !== null && <title>{label} · M{ci}: {v}%</title>}
                </rect>
                {v !== null && (
                  <text x={62 + ci * 56} y={38 + ri * 29} className={styles.cellText} textAnchor="middle">{v}</text>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Retention by cohort — the diagonal is incomplete, not zero.</figcaption>
    </figure>
  )
}

/* Scatter with a fitted line and the correlation stated, so the relationship
   is quantified rather than implied by the eye. */
function Scatter() {
  const pts = [[22, 31], [38, 44], [45, 39], [52, 58], [61, 55], [68, 71], [74, 66], [81, 84], [33, 28], [57, 52], [88, 79], [29, 36], [64, 61], [47, 50]]
  const sx = (v) => 46 + (v / 100) * 340
  const sy = (v) => 148 - (v / 100) * 122
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Spend against return">
        <YAxis ticks={[0, 50, 100]} y={sy} x0={40} x1={396} unit="$k" />
        {/* Fit line, dashed so it never reads as data. */}
        <line x1={sx(18)} y1={sy(22)} x2={sx(90)} y2={sy(84)} className={styles.fitLine} />
        <text x={sx(90)} y={sy(84) - 6} className={styles.refText} textAnchor="end">r = 0.91</text>
        {pts.map(([a, b], i) => (
          <circle key={i} cx={sx(a)} cy={sy(b)} r="4" fill={SERIES[1]} className={styles.dot}>
            <title>Spend ${a}k · Return ${b}k</title>
          </circle>
        ))}
        {[0, 50, 100].map((v) => (
          <text key={v} x={sx(v)} y="165" className={styles.axisText} textAnchor="middle">{v}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Scatter with fit — spend, $k, against return.</figcaption>
    </figure>
  )
}

/* Slope: two points and the line between them. The only chart that makes rank
   change legible at a glance — and it refuses to be read as a trend, because
   there is nothing between the ends to misread. */
function SlopeChart() {
  const rows = [['Brand', 61, 84], ['Content', 44, 61], ['Product', 38, 70], ['Motion', 22, 19]]
  const y = (v) => 150 - (v / 100) * 124
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Change by discipline">
        <line x1="120" x2="120" y1="20" y2="150" className={styles.spine} />
        <line x1="280" x2="280" y1="20" y2="150" className={styles.spine} />
        <text x="120" y="165" className={styles.axisMuted} textAnchor="middle">2025</text>
        <text x="280" y="165" className={styles.axisMuted} textAnchor="middle">2026</text>
        {rows.map(([label, a, b], i) => (
          <g key={label} className={styles.mark}>
            <line x1="120" y1={y(a)} x2="280" y2={y(b)} stroke={SERIES[i]} strokeWidth="1.5" />
            <circle cx="120" cy={y(a)} r="3" fill={SERIES[i]} className={styles.dot} />
            <circle cx="280" cy={y(b)} r="3" fill={SERIES[i]} className={styles.dot} />
            <text x="112" y={y(a) + 3} className={styles.axisText} textAnchor="end">{a}</text>
            <text x="288" y={y(b) + 3} className={styles.valueText}>{b}</text>
            <text x="396" y={y(b) + 3} className={styles.axisMuted} textAnchor="end">{label}</text>
          </g>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Slope — start, end, and nothing invented in between.</figcaption>
    </figure>
  )
}

/* Lollipop: a bar's information with a fraction of its ink. Better than a bar
   whenever the categories are sparse and the baseline is not in question. */
function DotPlot() {
  const rows = [['Brand', 61], ['Content', 44], ['Product', 38], ['Motion', 22], ['Advisory', 14]]
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Projects by discipline">
        {rows.map(([label, v], i) => {
          const x = 86 + (v / 70) * 250
          return (
            <g key={label}>
              <text x="0" y={26 + i * 30} className={styles.axisText}>{label}</text>
              <line x1="86" y1={22 + i * 30} x2={x} y2={22 + i * 30} className={styles.stem} />
              <circle cx={x} cy={22 + i * 30} r="4" fill={SERIES[0]} className={styles.dot}>
                <title>{label}: {v}</title>
              </circle>
              <text x={x + 10} y={26 + i * 30} className={styles.valueText}>{v}</text>
            </g>
          )
        })}
        <line x1="86" x2="86" y1="12" y2="158" className={styles.spine} />
      </svg>
      <figcaption className={styles.figCap}>Lollipop — a bar's information at a fraction of the ink.</figcaption>
    </figure>
  )
}

/* Dumbbell: two states per category and the distance between them. The gap is
   the measure, so the connector is the mark, not decoration. */
function Dumbbell() {
  const rows = [['Brand', 42, 84], ['Content', 31, 61], ['Product', 26, 70], ['Motion', 18, 34]]
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Before and after by discipline">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={86 + (v / 100) * 260} x2={86 + (v / 100) * 260} y1="10" y2="140" className={styles.grid} />
            <text x={86 + (v / 100) * 260} y="155" className={styles.axisText} textAnchor="middle">{v}</text>
          </g>
        ))}
        {rows.map(([label, a, b], i) => {
          const xa = 86 + (a / 100) * 260
          const xb = 86 + (b / 100) * 260
          return (
            <g key={label}>
              <text x="0" y={26 + i * 30} className={styles.axisText}>{label}</text>
              <line x1={xa} y1={22 + i * 30} x2={xb} y2={22 + i * 30} className={styles.dumbbellBar} />
              <circle cx={xa} cy={22 + i * 30} r="4" fill={SERIES[2]} className={styles.dot}><title>{label} before: {a}</title></circle>
              <circle cx={xb} cy={22 + i * 30} r="4" fill={SERIES[0]} className={styles.dot}><title>{label} after: {b}</title></circle>
              <text x="396" y={26 + i * 30} className={styles.axisMuted} textAnchor="end">+{b - a}</text>
            </g>
          )
        })}
      </svg>
      <Legend items={[['Before', 'var(--s3)'], ['After', 'var(--s1)']]} />
      <figcaption className={styles.figCap}>Dumbbell — the gap is the measure.</figcaption>
    </figure>
  )
}

/* Gantt: the most obviously missing chart for a studio. Bars on a time axis,
   with today marked — a schedule nobody can locate themselves on is a
   decoration. */
function Gantt() {
  const rows = [
    ['Discovery', 0, 2, 0], ['Identity', 1.5, 4, 1], ['System', 3.5, 3.5, 2],
    ['Build', 6, 4, 3], ['Handover', 9.5, 1.5, 4],
  ]
  const W = 11
  const x = (w) => 86 + (w / W) * 270
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Project schedule">
        {[0, 2, 4, 6, 8, 10].map((w) => (
          <g key={w}>
            <line x1={x(w)} x2={x(w)} y1="8" y2="140" className={styles.grid} />
            <text x={x(w)} y="155" className={styles.axisText} textAnchor="middle">W{w}</text>
          </g>
        ))}
        {rows.map(([label, start, len, s], i) => (
          <g key={label}>
            <text x="0" y={26 + i * 26} className={styles.axisText}>{label}</text>
            <rect x={x(start)} y={16 + i * 26} width={(len / W) * 270} height="13" fill={SERIES[s]} className={styles.mark}>
              <title>{label}: week {start} to {start + len}</title>
            </rect>
          </g>
        ))}
        {/* Today. Without it a schedule can't be read against the present. */}
        <line x1={x(5.2)} x2={x(5.2)} y1="8" y2="140" className={styles.todayLine} />
        <text x={x(5.2) + 5} y="16" className={styles.refText}>Today</text>
      </svg>
      <figcaption className={styles.figCap}>Gantt — phases against weeks, with today marked.</figcaption>
    </figure>
  )
}

/* Pareto: bars descending with a cumulative line. The one place a second axis
   is defensible, because the line is a percentage of the bars themselves and
   not an unrelated measure. */
function Pareto() {
  const data = [['Brand', 61], ['Content', 44], ['Product', 38], ['Motion', 22], ['Advisory', 14], ['Other', 8]]
  const total = data.reduce((a, [, v]) => a + v, 0)
  const y = (v) => 148 - (v / 70) * 122
  const yc = (p) => 148 - (p / 100) * 122
  let acc = 0
  const pts = data.map(([, v], i) => {
    acc += v
    return `${i ? 'L' : 'M'}${58 + i * 55},${yc((acc / total) * 100)}`
  }).join(' ')
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Pareto of projects by discipline">
        <YAxis ticks={[0, 35, 70]} y={y} x0={40} x1={392} unit="n" />
        {data.map(([label, v], i) => (
          <rect key={label} x={40 + i * 55} y={y(v)} width="36" height={148 - y(v)} fill={SERIES[0]} className={styles.mark}>
            <title>{label}: {v}</title>
          </rect>
        ))}
        <line x1="392" x2="392" y1={yc(100)} y2={yc(0)} className={styles.spine} />
        <text x="392" y={yc(100) - 6} className={styles.unitText} textAnchor="end">cum %</text>
        <path d={pts} fill="none" stroke={SERIES[1]} strokeWidth="1.5" />
        {data.map(([label], i) => {
          let a = 0
          data.slice(0, i + 1).forEach(([, v]) => { a += v })
          return <circle key={label} cx={58 + i * 55} cy={yc((a / total) * 100)} r="2.5" fill={SERIES[1]} className={styles.dot} />
        })}
        <line x1="40" x2="392" y1={yc(80)} y2={yc(80)} className={styles.refLine} />
        <text x="392" y={yc(80) - 4} className={styles.refText} textAnchor="end">80%</text>
        {data.map(([label], i) => (
          <text key={label} x={58 + i * 55} y="163" className={styles.axisMuted} textAnchor="middle">{label.slice(0, 4)}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Pareto — the only defensible second axis: it's a share of the bars.</figcaption>
    </figure>
  )
}

/* Stacked area: composition over time. Only legitimate when the total means
   something; otherwise it's a 100% stack or three lines. */
function StackedArea() {
  const series = [
    [30, 34, 36, 41, 44, 48, 52, 56, 58, 62, 66, 70],
    [22, 24, 26, 27, 30, 32, 33, 36, 38, 39, 42, 44],
    [12, 14, 17, 19, 20, 23, 26, 28, 30, 33, 35, 38],
  ]
  const x = (i) => 44 + i * 31
  const yv = (v) => 148 - (v / 160) * 122
  const bands = []
  const running = new Array(12).fill(0)
  series.forEach((s) => {
    const lower = [...running]
    s.forEach((v, i) => { running[i] += v })
    const top = running.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${yv(v)}`).join(' ')
    const bottom = lower.map((v, i) => `L${x(11 - i)},${yv(lower[11 - i])}`).join(' ')
    bands.push(`${top} ${bottom} Z`)
  })
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Composition over time">
        <YAxis ticks={[0, 80, 160]} y={yv} x0={40} x1={392} unit="$k" />
        {bands.map((d, s) => (
          <path key={s} d={d} fill={SERIES[s]} fillOpacity="0.75" className={styles.mark} />
        ))}
        {MO.map((m, i) => (
          <text key={i} x={x(i)} y="163" className={styles.axisText} textAnchor="middle">{m}</text>
        ))}
      </svg>
      <Legend items={[['Brand', 'var(--s1)'], ['Content', 'var(--s2)'], ['Product', 'var(--s3)']]} />
      <figcaption className={styles.figCap}>Stacked area — only when the total itself means something.</figcaption>
    </figure>
  )
}

/* Step: a value that holds until it changes. Interpolating between price
   changes or headcount would be a lie, and a straight line tells it. */
function StepLine() {
  const d = [12, 12, 14, 14, 14, 18, 18, 18, 22, 22, 26, 26]
  const x = (i) => 46 + i * 30
  const y = (v) => 148 - (v / 30) * 122
  let path = `M${x(0)},${y(d[0])}`
  d.forEach((v, i) => {
    if (i === 0) return
    path += ` L${x(i)},${y(d[i - 1])} L${x(i)},${y(v)}`
  })
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Headcount over time">
        <YAxis ticks={[0, 15, 30]} y={y} x0={40} x1={392} unit="ppl" />
        <path d={path} fill="none" stroke={SERIES[2]} strokeWidth="1.5" />
        {MO.map((m, i) => (
          <text key={i} x={x(i)} y="163" className={styles.axisText} textAnchor="middle">{m}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Step — the value holds until it changes. No invented slope.</figcaption>
    </figure>
  )
}

/* Treemap: part-to-whole with more parts than a donut can carry. Area is the
   measure, so labels only go where they fit — a truncated label in a tiny
   rectangle is worse than none.
 *
 * Coloured from the sequential ramp by rank, not from the categorical slots.
 * Five parts against a three-slot palette would force a repeat, and more to
 * the point a treemap encodes one measure: the cells are degrees of the same
 * thing, which is what a sequential ramp is for. */
function Treemap() {
  const cells = [
    ['Brand', 61, 5, 0, 0, 58, 90], ['Content', 44, 4, 58, 0, 42, 62],
    ['Product', 38, 3, 58, 62, 42, 28], ['Motion', 22, 2, 0, 90, 34, 55],
    ['Advisory', 14, 1, 34, 90, 24, 55],
  ]
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Revenue share by discipline">
        <g transform="translate(100, 8)">
          {cells.map(([label, v, s, x, y, w, h]) => (
            <g key={label}>
              <rect x={x * 2} y={y * 1.6} width={w * 2 - 2} height={h * 1.6 - 2} fill={`var(--q${s})`} className={styles.mark}>
                <title>{label}: {v}</title>
              </rect>
              {w * 2 > 60 && (
                <>
                  <text
                    x={x * 2 + 8} y={y * 1.6 + 16}
                    /* Label ink flips on the two lightest steps — a dark label
                       on a dark cell is the classic treemap failure. */
                    className={s >= 4 ? styles.treeLabel : styles.treeLabelLight}
                  >
                    {label}
                  </text>
                  <text
                    x={x * 2 + 8} y={y * 1.6 + 30}
                    className={s >= 4 ? styles.treeVal : styles.treeValLight}
                  >
                    {v}
                  </text>
                </>
              )}
            </g>
          ))}
        </g>
      </svg>
      <figcaption className={styles.figCap}>Treemap — area is the measure; labels only where they fit.</figcaption>
    </figure>
  )
}

/* Calendar heatmap: one cell per day. Density over a year, where a line chart
   would smooth away exactly the pattern you're looking for. */
function CalendarHeat() {
  const vals = Array.from({ length: 7 * 26 }, (_, i) =>
    (i % 7 === 5 || i % 7 === 6) ? (i % 11 === 0 ? 1 : 0) : (i * 7 % 5) + (i % 3))
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 130" className={styles.svg} role="img" aria-label="Activity by day">
        {['M', 'W', 'F'].map((d, i) => (
          <text key={d} x="0" y={24 + i * 22} className={styles.axisText}>{d}</text>
        ))}
        {vals.map((v, i) => {
          const col = Math.floor(i / 7)
          const row = i % 7
          return (
            <rect
              key={i}
              x={20 + col * 14.5} y={12 + row * 11} width="12" height="9"
              fill={`var(--q${Math.min(5, v)})`} className={styles.mark}
            >
              <title>Day {i + 1}: {v}</title>
            </rect>
          )
        })}
        {['Jan', 'Apr', 'Jul', 'Oct'].map((m, i) => (
          <text key={m} x={22 + i * 94} y="106" className={styles.axisMuted}>{m}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Calendar — one cell a day. The weekend gaps are the finding.</figcaption>
    </figure>
  )
}

/* Bubble: a third measure as area, never as radius — area is what the eye
   compares, and sizing by radius overstates big values fourfold. */
function Bubble() {
  const pts = [[22, 31, 8], [38, 44, 22], [52, 58, 14], [61, 55, 34], [74, 66, 18], [81, 84, 42], [33, 28, 11], [64, 41, 26]]
  const sx = (v) => 50 + (v / 100) * 330
  const sy = (v) => 146 - (v / 100) * 120
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Spend, return and team size">
        <YAxis ticks={[0, 50, 100]} y={sy} x0={44} x1={392} unit="$k" />
        {pts.map(([a, b, r], i) => (
          <circle key={i} cx={sx(a)} cy={sy(b)} r={Math.sqrt(r) * 2.1} fill={SERIES[1]} fillOpacity="0.45" stroke={SERIES[1]} strokeWidth="1" className={styles.mark}>
            <title>Spend {a} · Return {b} · Team {r}</title>
          </circle>
        ))}
        {[0, 50, 100].map((v) => (
          <text key={v} x={sx(v)} y="163" className={styles.axisText} textAnchor="middle">{v}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Bubble — team size as area, never as radius.</figcaption>
    </figure>
  )
}

/* Control chart: a mean and its bands, so a reader can tell an ordinary
   fluctuation from a real signal. The point outside the band is the whole
   reason the chart exists. */
function ControlChart() {
  const d = [52, 48, 55, 51, 49, 58, 53, 47, 68, 50, 54, 51]
  const mean = 53
  const sd = 6
  const x = (i) => 48 + i * 30
  const y = (v) => 148 - (v / 90) * 122
  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 400 175" className={styles.svg} role="img" aria-label="Process control">
        <YAxis ticks={[0, 45, 90]} y={y} x0={42} x1={392} unit="hrs" />
        <rect x="42" y={y(mean + 2 * sd)} width="350" height={y(mean - 2 * sd) - y(mean + 2 * sd)} fill="rgba(255,255,255,0.03)" />
        <line x1="42" x2="392" y1={y(mean)} y2={y(mean)} className={styles.refLine} />
        <text x="392" y={y(mean) - 4} className={styles.refText} textAnchor="end">Mean {mean}</text>
        <line x1="42" x2="392" y1={y(mean + 2 * sd)} y2={y(mean + 2 * sd)} className={styles.sigmaLine} />
        <line x1="42" x2="392" y1={y(mean - 2 * sd)} y2={y(mean - 2 * sd)} className={styles.sigmaLine} />
        <text x="392" y={y(mean + 2 * sd) - 4} className={styles.refText} textAnchor="end">+2σ</text>
        <path d={d.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} fill="none" stroke={SERIES[2]} strokeWidth="1.5" />
        {d.map((v, i) => {
          const out = v > mean + 2 * sd || v < mean - 2 * sd
          return (
            <circle key={i} cx={x(i)} cy={y(v)} r={out ? 4 : 2.5} fill={out ? 'rgba(255, 80, 80, 0.9)' : SERIES[2]} className={styles.dot}>
              <title>P{i + 1}: {v}{out ? ' — outside control limits' : ''}</title>
            </circle>
          )
        })}
        {MO.map((m, i) => (
          <text key={i} x={x(i)} y="163" className={styles.axisText} textAnchor="middle">{m}</text>
        ))}
      </svg>
      <figcaption className={styles.figCap}>Control — the point outside ±2σ is why the chart exists.</figcaption>
    </figure>
  )
}

/* ── Texture ─────────────────────────────────────────────────────────────────
 *
 * Texture is the encoding that survives what colour doesn't: a colour-vision
 * deficiency the palette's ΔE margins don't cover, a black-and-white print, a
 * forced-colors mode that replaces every fill. It is also the honest answer
 * when a chart needs a seventh series — a seventh hue would fail separation,
 * but slot 1 hatched is unambiguous.
 *
 * Defined once as SVG patterns and referenced by id, so a texture is one
 * fill:url() wherever it's needed. The ids are global to the document, hence
 * the prefix.
 *
 * Rules: 45° and 135° are the primary pair and must never be adjacent to each
 * other without a gap; density carries magnitude, direction carries identity;
 * never more than three textures in one chart, because past that they moiré.
 */

/* ── 90s tiles ───────────────────────────────────────────────────────────────
 *
 * Windows 95 and classic Mac desktop patterns were 8×8 one-bit bitmaps — 64
 * bits, on or off, tiled forever. Writing them as literal bitmaps here rather
 * than as paths is not nostalgia for its own sake: it is the format that
 * produced the look. A path-drawn "weave" gets curves and half-pixels and
 * stops reading as a tile.
 *
 * Same alpha as the rest of the set, so these stay material. At full strength
 * they would be a period pastiche; at 0.07 they are grain that happens to have
 * a memory.
 */
const TILES = {
  'sc-tile-weave': [
    '11100000',
    '10100000',
    '10111110',
    '00100010',
    '00101110',
    '00001010',
    '11111010',
    '00000010',
  ],
  'sc-tile-brick': [
    '11111111',
    '00001000',
    '00001000',
    '00001000',
    '11111111',
    '10000000',
    '10000000',
    '10000000',
  ],
  'sc-tile-waffle': [
    '11111111',
    '10000001',
    '10000001',
    '10000001',
    '10000001',
    '10000001',
    '10000001',
    '11111111',
  ],
  'sc-tile-thatch': [
    '10011001',
    '01100110',
    '01100110',
    '10011001',
    '10011001',
    '01100110',
    '01100110',
    '10011001',
  ],
  'sc-tile-circuit': [
    '11111000',
    '00001000',
    '00001000',
    '11111111',
    '00100000',
    '00100000',
    '11111100',
    '00000100',
  ],
  'sc-tile-diamond': [
    '00011000',
    '00100100',
    '01000010',
    '10000001',
    '01000010',
    '00100100',
    '00011000',
    '00000000',
  ],
}

const TILE_META = [
  ['sc-tile-weave', 'Weave', 'Interlocking basket. The busiest of the six.'],
  ['sc-tile-brick', 'Brick', 'Offset courses. Reads as a wall at any size.'],
  ['sc-tile-waffle', 'Waffle', 'Open box grid — the most neutral here.'],
  ['sc-tile-thatch', 'Thatch', 'Herringbone. Directional without being a diagonal.'],
  ['sc-tile-circuit', 'Circuit', 'Traces and corners. Good under anything technical.'],
  ['sc-tile-diamond', 'Diamond', 'Argyle lattice. The closest to a motif — use least.'],
]

const TEXTURES = [
  ['sc-tex-d25', 'Dither 25', 'The lightest. Default for a large area.'],
  ['sc-tex-d50', 'Dither 50', 'The checkerboard. Half the grid, still barely there.'],
  ['sc-tex-d75', 'Dither 75', 'The heaviest that stays background.'],
  ['sc-tex-halftone', 'Halftone', 'Print-like dot screen. Good under an image.'],
  ['sc-tex-45', 'Stair 45°', 'Stepped diagonal, not a smooth rule.'],
  ['sc-tex-135', 'Stair 135°', 'Its mirror. Never butt the two together.'],
  ['sc-tex-scan', 'Scanline', 'Horizontal only. Reads as a screen.'],
  ['sc-tex-stipple', 'Stipple', 'Irregular grain. Placeholders and empty states.'],
]

/* One defs block for the whole page. Rendered once, referenced everywhere.
 *
 * Built from square pixels on an integer grid rather than strokes, and every
 * pattern renders with shape-rendering: crispEdges — antialiasing is what
 * makes a texture look like a gradient instead of a screen. The unit sizes are
 * deliberately coarse: at 2px the eye reads tone, at 4px it reads texture, and
 * texture is the whole point of the encoding.
 */
function TextureDefs() {
  /* Faint and fine. At 1px cells on a 4px grid the pattern is below the
     threshold where the eye resolves individual marks — it reads as a
     property of the surface rather than something drawn on it, which is the
     entire brief. Push the alpha past about 0.09 and it becomes a graphic
     again. */
  const ink = 'rgba(255, 255, 255, 0.07)'
  const px = (x, y, w = 1, h = 1) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={ink} />
  return (
    <svg width="0" height="0" className={styles.defsOnly} aria-hidden="true" focusable="false">
      <defs>
        {/* Ordered dither on one 2px cell grid — one, two and three cells of
            four, so the three read as a genuine 25 / 50 / 75 progression.
            Keeping the grid identical across the three is what lets them be
            compared; different grids would read as different textures rather
            than different densities. */}
        <pattern id="sc-tex-d25" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 2, 2)}
        </pattern>
        <pattern id="sc-tex-d50" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 2, 2)}{px(2, 2, 2, 2)}
        </pattern>
        <pattern id="sc-tex-d75" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 2, 2)}{px(2, 2, 2, 2)}{px(2, 0, 2, 2)}
        </pattern>
        {/* Halftone: a square dot on an offset grid, no circles — circles
            antialias and the screen stops reading as a screen. */}
        <pattern id="sc-tex-halftone" width="6" height="6" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(1, 1, 2, 2)}{px(4, 4, 2, 2)}
        </pattern>
        {/* Stepped diagonals — a staircase of single pixels rather than a
            rotated line, so the diagonal keeps hard edges at every zoom. */}
        <pattern id="sc-tex-45" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 3)}{px(1, 2)}{px(2, 1)}{px(3, 0)}
        </pattern>
        <pattern id="sc-tex-135" width="4" height="4" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0)}{px(1, 1)}{px(2, 2)}{px(3, 3)}
        </pattern>
        <pattern id="sc-tex-scan" width="3" height="3" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(0, 0, 3, 1)}
        </pattern>
        {/* Fixed offsets, not random — a texture that changes between renders
            can't be matched on a second surface. */}
        <pattern id="sc-tex-stipple" width="8" height="8" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
          {px(1, 2)}{px(5, 0)}{px(3, 5)}{px(7, 6)}{px(0, 6)}{px(6, 3)}
        </pattern>

        {/* 90s desktop tiles, emitted straight from their bitmaps. */}
        {Object.entries(TILES).map(([id, rows]) => (
          <pattern key={id} id={id} width="8" height="8" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
            {rows.flatMap((row, y) =>
              row.split('').map((bit, x) => (bit === '1' ? px(x, y) : null)).filter(Boolean),
            )}
          </pattern>
        ))}
      </defs>
    </svg>
  )
}

function TextureSwatches({ onCopy, copied, items = TEXTURES }) {
  return (
    <div className={styles.texRow}>
      {items.map(([id, name, note]) => (
        <button
          key={id}
          type="button"
          className={styles.texChip}
          onClick={() => onCopy(`url(#${id})`)}
          title={`Copy url(#${id})`}
        >
          <svg viewBox="0 0 100 52" className={styles.texSwatch} aria-hidden="true">
            <rect width="100" height="52" fill="rgba(255,255,255,0.05)" />
            <rect width="100" height="52" fill={`url(#${id})`} />
          </svg>
          <span className={styles.texName}>{name}</span>
          <span className={styles.texId}>
            {copied === `url(#${id})` ? 'copied' : `#${id.replace(/^sc-(tex|tile)-/, '')}`}
          </span>
          <span className={styles.texNote}>{note}</span>
        </button>
      ))}
    </div>
  )
}

function SmallMultiples() {
  const sets = [['Brand', [30, 38, 41, 52, 58, 61, 64, 69, 71, 76, 80, 84], 0],
    ['Content', [22, 26, 24, 31, 36, 44, 41, 48, 52, 55, 58, 61], 1],
    ['Product', [12, 18, 26, 29, 33, 38, 44, 47, 52, 58, 63, 70], 2]]
  return (
    <div className={styles.multiples}>
      {sets.map(([label, d, s]) => {
        const pts = d.map((v, i) => `${i ? 'L' : 'M'}${i * 20},${52 - (v / 90) * 46}`).join(' ')
        return (
          <div key={label} className={styles.multiple}>
            <div className={styles.multipleHead}>
              <span className={styles.sparkLabel}>{label}</span>
              <span className={styles.sparkVal}>{d[d.length - 1]}</span>
            </div>
            <svg viewBox="0 0 232 60" className={styles.multipleSvg} role="img" aria-label={`${label} trend`}>
              <line x1="0" x2="232" y1="53" y2="53" className={styles.grid} />
              <path d={pts} fill="none" stroke={SERIES[s]} strokeWidth="1.5" />
            </svg>
          </div>
        )
      })}
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
      {/* Pattern defs for every textured fill on the page — rendered once. */}
      <TextureDefs />
      <div className={styles.inner}>

        {/* ── Masthead ── */}
        <header className={styles.masthead}>
          <p className={styles.eyebrow}>Internal · Not indexed</p>
          <h1 className={styles.headline}>Design System</h1>
          <p className={styles.lede}>
            Read back out of the shipped CSS, not written ahead of it. Every swatch, specimen
            and demo is live, and the counts are real.
          </p>
          <nav className={styles.toc}>
            {[
              ['Colour', 'colour'], ['Type', 'type'], ['Radius', 'radius'],
              ['Spacing', 'spacing'], ['Depth', 'depth'], ['Texture', 'texture'],
              ['Icons', 'icons'], ['Buttons', 'buttons'], ['Forms', 'fields'],
              ['Nav', 'nav'], ['Grids', 'grids'], ['Content', 'content'],
              ['Charts', 'charts'], ['Media', 'media'], ['Carousels', 'carousels'],
              ['Chat', 'chat'], ['Conversion', 'conversion'], ['Feedback', 'feedback'],
              ['Overlays', 'overlays'], ['Motion', 'motion'], ['Layout', 'layout'],
              ['Light', 'light'],
              ['Access', 'a11y'], ['Inventory', 'backlog'],
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
          blurb="A near-black ground, one card surface, and white at ten opacities."
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
            All three declared accents are used nowhere. Rather than find work for them:
            keep pink, add purple, retire teal and blue — the same two hues as the
            {' '}<a href="#charts" className={styles.inlineLink}>chart palette</a>.
          </p>
          <div className={styles.accentRow} data-accents>
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
                <span
                  className={`${styles.accentUnused} ${a.state === 'retire' ? styles.accentRetire : ''}`}
                >
                  {a.state === 'keep' ? 'keep' : a.state === 'new' ? 'add' : 'retire'}
                </span>
              </button>
            ))}
          </div>

          <h3 className={styles.subhead}>Gradients</h3>
          <p className={styles.subnote}>
            Two decorative, four functional — and the functional ones do more work. A
            sweep through a third hue <em className={styles.em}>is</em> a third hue, so
            both accent gradients stop at pink and purple.
          </p>
          <div className={styles.gradRow}>
            {GRADIENTS.map((g) => (
              <button
                key={g.name}
                type="button"
                className={styles.gradChip}
                onClick={() => copy(g.css)}
                title={`Copy ${g.name}`}
              >
                {/* Scrim and edge fade are transparency, so they sit on a
                    checker plate — on a flat ground they'd look like nothing. */}
                <span className={styles.gradPlate}>
                  <span className={styles.gradSwatch} style={{ background: g.css }} />
                </span>
                <span className={styles.paletteName}>{g.name}</span>
                <span className={styles.paletteVal}>
                  {copied === g.css ? 'copied' : g.css.split('(')[0]}
                </span>
                <span className={styles.texNote}>{g.role}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── 02 Type ── */}
        <Section
          id="type"
          index={2}
          title="Type"
          blurb="Two families held far apart: a serif for reading, a mono for everything that labels or counts."
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

        {/* ── 04 Spacing ── */}
        <Section
          id="spacing"
          index={4}
          title="Spacing"
          blurb="No scale exists. Eight values carry the layout, and each was a separate decision."
        >
          <p className={styles.prose}>
            The 5px gutter stays as a named exception — rounding it would change the
            homepage.
          </p>
          <div className={styles.spaceList}>
            {SPACING.map((s) => (
              <button
                key={s.px}
                type="button"
                className={`${styles.spaceRow} ${s.keep ? '' : styles.spaceDrift}`}
                onClick={() => copy(`${s.px}px`)}
                title={`Copy ${s.px}px`}
              >
                <span className={styles.spaceBar} style={{ width: `${s.px * 2}px` }} />
                <span className={styles.spaceVal}>
                  {copied === `${s.px}px` ? 'copied' : `${s.px}px`}
                </span>
                <Status value={s.keep ? 'KEEP' : 'DRIFT'} />
                <span className={styles.spaceRole}>{s.role}</span>
                <span className={styles.count}>{s.uses}×</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── 05 Depth ── */}
        <Section
          id="depth"
          index={5}
          title="Depth"
          blurb="What sits on top of what — as shadow, and as stacking order."
        >
          <h3 className={styles.subhead}>Elevation</h3>
          <p className={styles.subnote}>
            Already coherent, unusually: four shadows, each with a clear job. Named
            here rather than invented. The drawer casts upward because it rises from
            the edge of the screen.
          </p>
          <div className={styles.elevRow}>
            {ELEVATION.map((e) => (
              <button
                key={e.name}
                type="button"
                className={styles.elevChip}
                onClick={() => copy(e.value)}
                title={`Copy ${e.name}`}
              >
                <span className={styles.elevBox} style={{ boxShadow: e.value === 'none' ? undefined : e.value }} />
                <span className={styles.paletteName}>{e.name}</span>
                <span className={styles.texNote}>{e.role}</span>
                <span className={styles.count}>{e.uses}×</span>
              </button>
            ))}
          </div>

          <h3 className={styles.subhead}>Layers</h3>
          <p className={styles.subnote}>
            Eleven z-index values ship today; 9500 and 9999 are the tell. Eight named steps,
            100 apart, leave room to insert.
          </p>
          <div className={styles.list}>
            {LAYERS.map((l) => (
              <Row
                key={l.name}
                label={l.name}
                note={l.role}
                value={String(l.value)}
                onCopy={copy}
                copied={copied}
              />
            ))}
          </div>
        </Section>

        {/* ── 06 Texture ── */}
        <Section
          id="texture"
          index={6}
          title="Texture"
          blurb="Grain for a site that is otherwise entirely flat. Faint enough to read as material, not decoration."
        >
          <p className={styles.prose}>
            Square pixels on an integer grid, rendered with
            {' '}<code className={styles.code}>shape-rendering: crispEdges</code> so nothing
            antialiases into a gradient. Kept faint: at full strength a pattern becomes a
            graphic and competes with whatever sits on it.
          </p>
          <p className={styles.prose}>
            Lo-fi on purpose: square pixels on an integer grid, rendered with
            {' '}<code className={styles.code}>shape-rendering: crispEdges</code> so
            nothing antialiases into a smooth gradient. The stipple uses fixed offsets
            rather than random ones — a texture that changes between renders can't be
            matched on a second surface.
          </p>
          <p className={styles.subnote}>
            For empty states, placeholders, section grounds. Not for charts — a pattern
            behind data fights the data. Click to copy.
          </p>
          <TextureSwatches onCopy={copy} copied={copied} />

          <h3 className={styles.subhead}>90s tiles</h3>
          <p className={styles.subnote}>
            Win95 and classic Mac patterns were 8×8 one-bit bitmaps, and these are written
            the same way — a path-drawn weave picks up curves and stops reading as a tile.
          </p>
          <TextureSwatches onCopy={copy} copied={copied} items={TILE_META} />

          <div className={styles.demoGrid}>
            <Demo label="Placeholder" status="NEW"
              note="Media that hasn't loaded or doesn't exist yet — grain instead of a flat grey box.">
              <span className={styles.texDemoMedia} />
            </Demo>

            <Demo label="Empty state" status="NEW"
              note="Texture behind the message gives the panel a floor, so 'nothing here' still looks built.">
              <span className={styles.texDemoEmpty}>
                <span className={styles.cardEyebrow}>No results</span>
                <span className={styles.emptyLine}>Nothing matches that yet.</span>
              </span>
            </Demo>

            <Demo label="Section ground" status="NEW"
              note="A whole band given grain, to separate it from the block above without a rule or a second colour.">
              <span className={styles.texDemoBand}>
                <span className={styles.cardTitle}>A textured band</span>
              </span>
            </Demo>
          </div>
        </Section>

        {/* ── 05 Icons ── */}
        <Section
          id="icons"
          index={7}
          title="Icons"
          blurb="Forty marks on a 16px grid. Butt caps, miter joins, no optical curves."
        >
          <p className={styles.prose}>
            The site ships <code className={styles.code}>lucide-react</code> and barely uses
            it — round caps on a 24px grid read friendly, which is wrong beside 8px
            uppercase mono. These inherit
            {' '}<code className={styles.code}>currentColor</code>, so an icon takes the
            colour of the text next to it.
          </p>
          <p className={styles.prose}>
            Everything below is stroke-based and inherits
            {' '}<code className={styles.code}>currentColor</code>, so an icon takes the
            colour of the text beside it and needs no per-context variant. At 1.25px
            the stroke matches the hairline the rest of the system already uses, which
            is why they sit in a row of 9px labels without shouting.
          </p>
          <p className={styles.subnote}>
            Click any icon to copy its name.
          </p>

          <div className={styles.iconGrid}>
            {Object.keys(ICONS).map((name) => (
              <button
                key={name}
                type="button"
                className={styles.iconCell}
                onClick={() => copy(name)}
                title={`Copy "${name}"`}
              >
                <Icon name={name} size={20} />
                <span className={styles.iconName}>
                  {copied === name ? 'copied' : name}
                </span>
              </button>
            ))}
          </div>

          <h3 className={styles.subhead}>In use</h3>
          <div className={styles.demoGrid}>
            <Demo label="With a label" status="NEW"
              note="6px gap, icon first. The icon is decorative here — the word carries the meaning, so it takes aria-hidden.">
              <div className={styles.iconUses}>
                <button type="button" className={styles.iconBtn}><Icon name="download" />Download deck</button>
                <button type="button" className={styles.iconBtn}><Icon name="external" />View site</button>
              </div>
            </Demo>

            <Demo label="Icon only" status="NEW"
              note="Needs an aria-label, because nothing else names it. 32px hit target minimum, even at a 16px mark.">
              <div className={styles.iconUses}>
                {['search', 'filter', 'sort', 'close'].map((n) => (
                  <button key={n} type="button" className={styles.iconOnly} aria-label={n}>
                    <Icon name={n} />
                  </button>
                ))}
              </div>
            </Demo>

            <Demo label="Status" status="NEW"
              note="Paired with the semantic colours and a word. Never colour alone, and never the icon alone.">
              <div className={styles.iconStatuses}>
                <span className={`${styles.iconStatus} ${styles.isGood}`}><Icon name="success" />Live</span>
                <span className={`${styles.iconStatus} ${styles.isWarn}`}><Icon name="warning" />Draft</span>
                <span className={`${styles.iconStatus} ${styles.isBad}`}><Icon name="error" />Failed</span>
              </div>
            </Demo>

            <Demo label="Optical sizes" status="NEW"
              note="14 / 16 / 20 / 24. Below 14 the geometry collapses — use a label instead of shrinking the mark.">
              <div className={styles.iconSizes}>
                {[14, 16, 20, 24].map((s) => (
                  <span key={s} className={styles.iconSizeCell}>
                    <Icon name="chart" size={s} />
                    <span className={styles.iconSizeLabel}>{s}</span>
                  </span>
                ))}
              </div>
            </Demo>
          </div>
        </Section>

        {/* ── 06 Buttons ── */}
        <Section
          id="buttons"
          index={8}
          title="Buttons"
          blurb="Six ship today. They agree on the type and on almost nothing else — three radii between them."
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
          index={9}
          title="Forms"
          blurb="Three input designs on three surfaces, disagreeing even about focus. Then the composition rules."
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

            <Demo
              label="Select"
              status="NEW"
              note="Rebuilt from a button — the native control can't be styled to match. Keeps listbox semantics."
            >
              <Select label="Discipline" options={['Brand', 'Content', 'Product', 'Motion']} />
            </Demo>

            <Demo
              label="Checkbox"
              status="NEW"
              note="14px box at a 2px radius — 4px would read as a circle at this size. The tick is a rotated border, not a glyph."
            >
              <CheckGroup />
            </Demo>

            <Demo
              label="Radio"
              status="NEW"
              note="Same row rhythm as the checkbox so mixed forms stay aligned."
            >
              <RadioGroup />
            </Demo>

            <Demo
              label="Inline validation"
              status="NEW"
              note="Validates on blur, not per keystroke — flagging an email while someone is still typing the domain is noise."
            >
              <ValidatedField />
            </Demo>

            <Demo
              label="Search"
              status="NEW"
              note="Clear button appears only once there is something to clear."
            >
              <SearchField />
            </Demo>

            <Demo
              label="File upload"
              status="NEW"
              wide
              note="Drag a file onto it. The dashed stroke is the one non-solid border in the system — it's the convention for a drop target and fighting it costs more than it gains."
            >
              <FileUpload />
            </Demo>

            <Demo
              label="Multi-step"
              status="NEW"
              wide
              note="Progress as a dot rail rather than a bar, so the step names stay readable and the whole path is visible at once."
            >
              <MultiStep />
            </Demo>

            <Demo label="Date picker" status="NEW" wide stage={false}
              note="A month grid, because a text field asking for a date gets a different format from every visitor. Weeks start Monday; today is marked whether or not it's selected.">
              <div className={styles.formStage}><DatePicker /></div>
            </Demo>

            <Demo label="Combobox" status="NEW"
              note="Type to filter, arrow to move, enter to choose. A select shows every option; a combobox exists because there are too many to show. The matched run is marked, so it's obvious why a row is there.">
              <Combobox />
            </Demo>

            <Demo label="Switch" status="NEW"
              note="role=switch, not a checkbox. A switch takes effect immediately; a checkbox waits for submit. Using the wrong one is a promise you don't keep.">
              <Switch />
            </Demo>

            <Demo label="Stepper" status="NEW"
              note="So a number can be nudged without selecting and retyping. The field stays editable — a stepper that forces you through the buttons is worse than a plain input.">
              <Stepper />
            </Demo>

            <Demo label="Tag input" status="NEW"
              note="Backspace on an empty field removes the last tag, which is the one interaction people expect and most implementations miss.">
              <TagInput />
            </Demo>

            <Demo label="Slider" status="NEW"
              note="Already used inside before/after and the video scrub; documented here as a control. The value is always shown — a slider without a readout is a guess.">
              <SliderControl />
            </Demo>
          </div>

          <h3 className={styles.subhead}>Composition</h3>
          <p className={styles.subnote}>
            The controls are parts; the assembly is where forms go wrong. Four conventions,
            fixed once.
          </p>
          <div className={styles.list}>
            {[
              ['Mark optional, not required', 'Most fields in an enquiry are required, so marking the exception is less ink and less noise.'],
              ['Labels above, never beside', 'Beside breaks the moment a label wraps, and every label wraps on a phone.'],
              ['Help occupies the error slot', 'Help text is present before the error is, in the same place, so the row cannot change height when validation fires.'],
              ['Summary before field errors', 'A screen reader lands at the top of the form; a field-level error alone is unreachable from there.'],
            ].map(([label, note]) => (
              <div key={label} className={styles.row}>
                <div className={styles.rowMain}>
                  <div className={styles.rowText}>
                    <span className={styles.rowLabel}>{label}</span>
                    <span className={styles.rowNote}>{note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.demoStack}>
            <Demo label="Full form" status="NEW" wide stage={false}
              note="Press Send twice: once to fail validation and once to submit. Watch the row heights — nothing moves when the errors appear, because help and error share a slot.">
              <ComposedForm />
            </Demo>
          </div>
        </Section>

        {/* ── 06 Navigation ── */}
        <Section
          id="nav"
          index={10}
          title="Navigation"
          blurb="Four kinds, all of them lists. The site never uses a horizontal menu bar."
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

            <Demo
              label="Tabs"
              status="NEW"
              note="For a case study with distinct phases. Underline rather than a filled pill — the site has no filled nav state anywhere."
            >
              <Tabs />
            </Demo>

            <Demo
              label="Filter bar"
              status="NEW"
              note="Multi-select chips. Clear only appears when something is on."
            >
              <FilterBar />
            </Demo>

            <Demo
              label="Sort"
              status="NEW"
              note="Clicking the active field flips direction. The arrow carries it so the label never has to say 'ascending'."
            >
              <SortControl />
            </Demo>

            <Demo
              label="Back to top"
              status="NEW"
              note="For any page past three screens — this one included. Fixed bottom-right, out of the theme toggle's corner."
            >
              <a href="#colour" className={styles.toTop}>↑ Top</a>
            </Demo>

            <Demo label="Skip link" status="NEW"
              note="Visually hidden until focused. Tab to it — the site has none today, so a keyboard user traverses the whole nav rail on every page.">
              <a href="#colour" className={styles.skipLink}>Skip to content</a>
            </Demo>

            <Demo label="Prev / next" status="NEW" wide stage={false}
              note="A case study is currently a dead end — nothing in the codebase links one to the next. Both ends are named, because the name is what decides whether anyone clicks, not the word 'next'.">
              <PrevNext />
            </Demo>

            <Demo label="Scrollspy" status="NEW" wide stage={false}
              note="The chip nav exists but never says where you are. IntersectionObserver rather than a scroll handler, so it costs nothing per frame. Scroll the page — this tracks the first four sections live.">
              <div className={styles.formStage}><Scrollspy /></div>
            </Demo>
          </div>

          <h3 className={styles.subhead}>Composition</h3>
          <p className={styles.subnote}>
            The rail works at eight links and breaks at twenty. These are the two
            patterns that scale past it.
          </p>
          <div className={styles.demoGrid}>
            <Demo label="Sectioned sidebar" status="NEW" stage={false}
              note="Groups, counts and one active row. Uses aria-current rather than colour alone, so the active item is announced and not merely brighter.">
              <div className={styles.navStage}><SidebarNav /></div>
            </Demo>

            <Demo label="Command palette" status="NEW" stage={false}
              note="The fastest navigation on a site with ninety-six routes, and the only pattern here that scales without a redesign. Type to filter.">
              <div className={styles.navStage}><CommandPalette /></div>
            </Demo>

            <Demo label="Footer sitemap" status="NEW" wide stage={false}
              note="Where a rail can't hold everything, the footer does. Four columns, mono headers, and every route reachable without the nav.">
              <div className={styles.footerNav}>
                {[
                  ['Work', ['Case studies', 'Clients', 'Capabilities']],
                  ['Studio', ['About', 'Careers', 'Thoughts']],
                  ['Contact', ['Book a call', 'Email', 'Newsletter']],
                  ['Legal', ['Privacy', 'Terms', 'Design system']],
                ].map(([head, links]) => (
                  <div key={head} className={styles.footerCol}>
                    <span className={styles.footerHead}>{head}</span>
                    {links.map((l) => (
                      <span key={l} className={styles.footerLink}>{l}</span>
                    ))}
                  </div>
                ))}
              </div>
            </Demo>
          </div>
        </Section>

        {/* ── 07 Grids ── */}
        <Section
          id="grids"
          index={11}
          title="Grids"
          blurb="12 columns on a 5px gutter carry the site — except Thoughts, which runs its own."
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

        {/* ── 08 Content ── */}
        <Section
          id="content"
          index={12}
          title="Content"
          blurb="The site sets prose beautifully and structures it barely at all. None of this exists yet."
        >
          <div className={styles.demoGrid}>
            <Demo label="Accordion" status="NEW" wide
              note="FAQs on landing pages, currently written out in full. One open at a time; the mark rotates rather than swapping glyph.">
              <Accordion />
            </Demo>

            <Demo label="Table" status="NEW" wide stage={false}
              note="Hairline rows at 0.06, mono headers at 8px, figures in mono so columns align on the digit. No vertical rules — the type does the work.">
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Package</th><th>Duration</th><th>Deliverables</th><th className={styles.tNum}>From</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Brand system', '8–10 weeks', 'Identity, voice, guidelines', '$40,000'],
                      ['Content program', 'Ongoing', 'Strategy, production, cadence', '$12,000/mo'],
                      ['Digital product', '12 weeks', 'Design system, build, handover', '$65,000'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className={styles.tName}>{r[0]}</td>
                        <td>{r[1]}</td>
                        <td>{r[2]}</td>
                        <td className={styles.tNum}>{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Demo>

            <Demo label="Pull quote" status="NEW" wide stage={false}
              note="Client words inside a case study, at display scale. No quote marks — the scale and the rule already say it's a quote.">
              <figure className={styles.pullQuote}>
                <p className={styles.pullQuoteText}>
                  They gave us a system we could actually run without them.
                </p>
                <figcaption className={styles.pullQuoteBy}>Head of Brand, Talos</figcaption>
              </figure>
            </Demo>

            <Demo label="Blockquote" status="NEW" stage={false}
              note="For quoting a source inside a thought post. A hairline rule on the left, indented to the measure.">
              <blockquote className={styles.blockquote}>
                A design system is a product serving products.
                <cite className={styles.cite}>Nathan Curtis</cite>
              </blockquote>
            </Demo>

            <Demo label="Code block" status="NEW" stage={false}
              note="Any post about how something was built. #0a0a0a well so it reads as recessed rather than raised.">
              <pre className={styles.codeBlock}>{`.card {
  background: #161616;
  border-radius: 4px;
}`}</pre>
            </Demo>

            <Demo label="Tooltip" status="NEW"
              note="Opens on hover and focus both — hover alone makes it invisible to a keyboard.">
              <span className={styles.tipDemoLine}>
                Every project starts with a <Tooltip />.
              </span>
            </Demo>

            <Demo label="Stat block" status="NEW" wide stage={false}
              note="Outcome numbers. Case studies have outcome cards but no number treatment — the figure should be display scale, the label mono.">
              <div className={styles.stats}>
                {[['3.4×', 'Pipeline growth'], ['12 wks', 'To launch'], ['61', 'Assets shipped']].map(([n, l]) => (
                  <div key={l} className={styles.stat}>
                    <span className={styles.statNum}>{n}</span>
                    <span className={styles.statLabel}>{l}</span>
                  </div>
                ))}
              </div>
            </Demo>

            <Demo label="Callout" status="NEW" wide stage={false}
              note="A note inside prose that isn't a quote. Rule on the left rather than a filled box — a fill would break the column and read as a different page.">
              <aside className={styles.callout}>
                <span className={styles.calloutLabel}>Note</span>
                <p className={styles.calloutText}>
                  Package prices are indicative. Anything with a discovery phase is
                  quoted after it, not before.
                </p>
              </aside>
            </Demo>

            <Demo label="Definition list" status="NEW" stage={false}
              note="Term and definition, for a glossary or a spec. Mono term, serif definition — the same split the whole site uses between label and prose.">
              <dl className={styles.defList}>
                {[['Brand system', 'Identity, voice, and the rules that keep both intact.'],
                  ['Design system', 'Components and tokens for engineering teams.'],
                  ['Content program', 'Strategy and production on a recurring cadence.']].map(([t, d]) => (
                  <Fragment key={t}>
                    <dt className={styles.defTerm}>{t}</dt>
                    <dd className={styles.defDesc}>{d}</dd>
                  </Fragment>
                ))}
              </dl>
            </Demo>

            <Demo label="Timeline" status="NEW" stage={false}
              note="Editorial, not a Gantt: undated steps in order, for a process or a studio history. The rule runs behind the markers so it reads as one thread.">
              <ol className={styles.timeline}>
                {[['Discovery', 'Interviews, audit, and the brief we actually agree on.'],
                  ['Direction', 'Two routes, one chosen, in front of the whole team.'],
                  ['System', 'The parts, the rules, and the handover.']].map(([t, d], i) => (
                  <li key={t} className={styles.tlItem}>
                    <span className={styles.tlMark}>{i + 1}</span>
                    <span className={styles.tlBody}>
                      <span className={styles.tlTitle}>{t}</span>
                      <span className={styles.tlText}>{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Demo>

            <Demo label="People" status="NEW" stage={false}
              note="No avatar exists in the codebase, and About and Careers both want one. Initials rather than a photo by default — a studio of five has no headshot pipeline, and a broken image is worse than none.">
              <PersonCard />
            </Demo>
          </div>

          <h3 className={styles.subhead}>Data grid</h3>
          <p className={styles.prose}>
            A spreadsheet is not a styled table. The reading table above drops vertical
            rules because prose has a left edge; a grid needs them, because a cell is
            addressed by column as much as by row.
          </p>
          <p className={styles.subnote}>
            Sort a column, click the gutter to select, click a cell to address it. Figures
            are mono and right-aligned so magnitude reads as length.
          </p>
          <div className={styles.demoStack}>
            <Demo label="Spreadsheet grid" status="NEW" wide stage={false}
              note="Rules on both axes, a numbered gutter, tabular figures, a selected cell with a ring, and a compact mode for when the row count outgrows the reading. Sorting and selection are real; nothing is wired to a backend.">
              <DataGrid />
            </Demo>
          </div>
        </Section>

        {/* ── 09 Charts ── */}
        <Section
          id="charts"
          index={13}
          title="Charts"
          blurb="Pink and purple only. Three categorical slots — a measured ceiling, not a preference."
        >
          <p className={styles.prose}>
            Pink and purple are adjacent hues. Once the first pair is placed the only
            separation left is lightness, and the band a dark surface allows — OKLCH 0.48
            to 0.67 — is about two steps wide.
          </p>
          <p className={styles.prose}>
            A fourth slot was tested, not assumed away: every value that separates cleanly
            lands near lightness 0.75, outside the band; every value inside the band fails
            the adjacent-pair check. Past three series the answer is small multiples or an
            "Other" bucket — <strong className={styles.strong}>never a fourth hue</strong>.
          </p>
          <p className={styles.prose}>
            Both columns pass all six checks. Slots 4–6 in the CSS are aliases of 1–3, so a
            chart reaching for a fourth series gets a visible repeat rather than a colour
            that quietly fails.
          </p>

          <h3 className={styles.subhead}>Categorical</h3>
          <p className={styles.subnote}>
            Assigned in fixed order and never cycled. A seventh series folds into
            "Other" or becomes small multiples — it is never a generated hue.
          </p>
          <div className={styles.paletteRow}>
            {CHART_PALETTE.map((c) => (
              <button
                key={c.slot}
                type="button"
                className={styles.paletteChip}
                onClick={() => copy(c.dark)}
                title={`Copy ${c.dark}`}
              >
                <span className={styles.paletteSwatch} style={{ background: c.dark }} />
                <span className={styles.paletteName}>{c.slot} · {c.hue}</span>
                <span className={styles.paletteVal}>
                  {copied === c.dark ? 'copied' : c.dark}
                </span>
                <span className={styles.paletteBrand}>{c.note}</span>
              </button>
            ))}
          </div>

          <h3 className={styles.subhead}>Sequential, diverging &amp; status</h3>
          <p className={styles.subnote}>
            Sequential is one hue, light to dark — magnitude, not identity. Diverging
            is two poles around a neutral grey; there is never a hue at the midpoint.
            Status is reserved and never reused as "series 7".
          </p>
          <div className={styles.rampRow}>
            <div className={styles.ramp}>
              <span className={styles.cardEyebrow}>Sequential</span>
              <div className={styles.rampBar}>
                {CHART_SEQUENTIAL.map((c) => (
                  <span key={c} style={{ background: c }} title={c} />
                ))}
              </div>
            </div>
            <div className={styles.ramp}>
              <span className={styles.cardEyebrow}>Diverging</span>
              <div className={styles.rampBar}>
                {CHART_DIVERGING.map((c) => (
                  <span key={c} style={{ background: c }} title={c} />
                ))}
              </div>
            </div>
            <div className={styles.ramp}>
              <span className={styles.cardEyebrow}>Status</span>
              <div className={styles.statusRow}>
                {CHART_STATUS.map((s) => (
                  <span key={s.name} className={styles.statusKey}>
                    <span className={styles.legendSwatch} style={{ background: s.value }} />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className={styles.subhead}>Types</h3>
          <p className={styles.subnote}>
            All inline SVG, no library. Square corners, drawn spines, minor ticks — a plot
            with a baseline is a measurement.
          </p>
          <p className={styles.subnote}>
            Text never wears the series colour — the mark beside it carries identity. No
            chart uses texture; pattern fills fight data at this density.
          </p>

          <div className={styles.chartGrid}>
            <Demo label="KPI row" status="NEW" wide stage={false}
              note="A figure with no trend behind it can't be acted on, so the shape is part of the tile rather than a separate chart. Delta names its comparison — 'vs prior period', never a bare percentage.">
              <div className={styles.viz}><KpiRow /></div>
            </Demo>

            <Demo label="Time series" status="NEW" wide stage={false}
              note="The workhorse. Twelve periods, a dashed target line, a crosshair that reads by x-position, and a table view — approximate is fine for the shape, but the numbers have to be available exactly.">
              <div className={styles.viz}><TimeSeries /></div>
            </Demo>

            <Demo label="Bar + reference" status="NEW" stage={false}
              note="The mean sits on the chart, not in a caption. Axis starts at zero: a truncated baseline exaggerates every difference and is the easiest way to mislead with a bar.">
              <div className={styles.viz}><BarChart /></div>
            </Demo>

            <Demo label="Ranked bar" status="NEW" stage={false}
              note="Sorted descending with count and share both shown. A ranking chart whose bars aren't sorted makes the reader do the sorting.">
              <div className={styles.viz}><BarH /></div>
            </Demo>

            <Demo label="100% stacked" status="NEW" stage={false}
              note="Composition over time, where the mix matters and the total doesn't. 2px gaps so it reads as parts rather than one bar changing colour.">
              <div className={styles.viz}><StackedBar /></div>
            </Demo>

            <Demo label="Waterfall" status="NEW" stage={false}
              note="How a total got from one number to another. Probably the single most useful analytical chart the site doesn't have — connectors carry the running total so the bridge is legible.">
              <div className={styles.viz}><Waterfall /></div>
            </Demo>

            <Demo label="Bullet" status="NEW" stage={false}
              note="Actual, target tick and qualitative bands, in the space a gauge would waste. Bar colour changes on whether target is met, and the tick — not a second bar — carries the target.">
              <div className={styles.viz}><Bullet /></div>
            </Demo>

            <Demo label="Histogram" status="NEW" stage={false}
              note="Distribution, not average — this is how you find out the mean is lying to you. Bars touch because the x-axis is continuous, and the median is marked rather than the mean.">
              <div className={styles.viz}><Histogram /></div>
            </Demo>

            <Demo label="Box plot" status="NEW" stage={false}
              note="Five numbers per category, for comparing spread rather than centre. Dense, unglamorous, and the right chart whenever variance is the question.">
              <div className={styles.viz}><BoxPlot /></div>
            </Demo>

            <Demo label="Funnel" status="NEW" stage={false}
              note="Step conversion stated on the right. A funnel that shows only volumes makes the reader do the division, which is the one number they came for.">
              <div className={styles.viz}><Funnel /></div>
            </Demo>

            <Demo label="Cohort retention" status="NEW" stage={false}
              note="Sequential ramp, because every cell is the same measure. The empty diagonal is missing data, not zero — it is left blank rather than filled with a colour that would read as a value.">
              <div className={styles.viz}><Cohort /></div>
            </Demo>

            <Demo label="Scatter + fit" status="NEW" stage={false}
              note="The fit line is dashed so it never reads as data, and the correlation is stated — a relationship quantified rather than implied by the eye.">
              <div className={styles.viz}><Scatter /></div>
            </Demo>

            <Demo label="Slope" status="NEW" stage={false}
              note="Two points and the line between them. It refuses to be read as a trend, because there is nothing in the middle to misread.">
              <div className={styles.viz}><SlopeChart /></div>
            </Demo>

            <Demo label="Lollipop" status="NEW" stage={false}
              note="A bar's information at a fraction of the ink. Use it whenever the categories are sparse and the baseline isn't in question.">
              <div className={styles.viz}><DotPlot /></div>
            </Demo>

            <Demo label="Dumbbell" status="NEW" stage={false}
              note="Two states per row, where the gap between them is the measure — so the connector is the mark, not decoration.">
              <div className={styles.viz}><Dumbbell /></div>
            </Demo>

            <Demo label="Gantt" status="NEW" stage={false}
              note="The most obviously missing chart for a studio. Today is marked — a schedule nobody can locate themselves on is a decoration.">
              <div className={styles.viz}><Gantt /></div>
            </Demo>

            <Demo label="Pareto" status="NEW" stage={false}
              note="Bars descending with a cumulative line, and the only defensible second axis on this page: the line is a share of the bars themselves, not an unrelated measure.">
              <div className={styles.viz}><Pareto /></div>
            </Demo>

            <Demo label="Stacked area" status="NEW" stage={false}
              note="Legitimate only when the total itself means something. If it doesn't, this should be a 100% stack or three separate lines.">
              <div className={styles.viz}><StackedArea /></div>
            </Demo>

            <Demo label="Step" status="NEW" stage={false}
              note="A value that holds until it changes — headcount, pricing, rates. Interpolating between the steps would invent numbers that never existed.">
              <div className={styles.viz}><StepLine /></div>
            </Demo>

            <Demo label="Treemap" status="NEW" stage={false}
              note="Part-to-whole with more parts than a donut can carry. Labels only go where they fit; a truncated label in a small rectangle is worse than none.">
              <div className={styles.viz}><Treemap /></div>
            </Demo>

            <Demo label="Calendar" status="NEW" stage={false}
              note="One cell per day. A line chart would smooth away the weekend gaps, which are the actual finding.">
              <div className={styles.viz}><CalendarHeat /></div>
            </Demo>

            <Demo label="Bubble" status="NEW" stage={false}
              note="A third measure as area, never as radius — area is what the eye compares, and radius overstates the big values fourfold.">
              <div className={styles.viz}><Bubble /></div>
            </Demo>

            <Demo label="Control" status="NEW" stage={false}
              note="A mean and its ±2σ bands, so an ordinary fluctuation can be told from a signal. The point outside the band is the whole reason to draw it.">
              <div className={styles.viz}><ControlChart /></div>
            </Demo>

            <Demo label="Small multiples" status="NEW" wide stage={false}
              note="The right answer whenever a legend would need more than about five entries. Same scale across all three panels, so they stay comparable.">
              <div className={styles.viz}><SmallMultiples /></div>
            </Demo>
          </div>

          <h3 className={styles.subhead}>Charts in light mode</h3>
          <p className={styles.prose}>
            Charts are the first thing the invert trick cannot swallow — inverting a
            validated palette produces its complement. So they take the second invert that
            images and video already get, and keep their true hues in both themes.
          </p>
        </Section>

        {/* ── 10 Media ── */}
        <Section
          id="media"
          index={14}
          title="Media &amp; image sizes"
          blurb="Four ratios, most overridden to 4:5 below 768px so the grid stays portrait."
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

            <Demo label="Lightbox" status="NEW"
              note="Full-size media without leaving the page. Contained in the demo here; in use it takes the viewport and traps focus.">
              <Lightbox />
            </Demo>

            <Demo label="Gallery" status="NEW"
              note="More images than a media grid holds. Thumb rail under a single frame.">
              <Gallery />
            </Demo>

            <Demo label="Before / after" status="NEW" wide
              note="The most obviously missing component for a studio that does rebrands. Built on a range input rather than a drag handler — keyboard-operable for free, and it can't get stuck mid-drag.">
              <BeforeAfter />
            </Demo>

            <Demo label="Video controls" status="NEW" wide
              note="Case-study video is autoplay-muted with no scrub or sound. This is the bar: play, scrub, time, mute — mono, on a dark plate over the frame.">
              <VideoControls />
            </Demo>
          </div>
        </Section>

        {/* ── 09 Carousels ── */}
        <Section
          id="carousels"
          index={15}
          title="Carousels"
          blurb="One ships, one doesn't. The marquee decorates; the paged one is for content to get through."
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
          index={16}
          title="AI chat"
          blurb="Doesn't exist yet. The question it has to answer: which half is UI and which half is prose."
        >
          <p className={styles.prose}>
            The reader's turn is a chip because it is UI; the reply is Signifier at reading
            size because it is prose. That split is the only reason this looks like the
            rest of the site rather than a widget dropped onto it.
          </p>
          <div className={styles.demoStack}>
            <Demo label="Conversation" status="NEW" wide stage={false}
              note="Type and send — the replies are canned strings, not a model. The demo exists to pin the three states: resting, thinking, answered.">
              <Chat />
            </Demo>

            <Demo label="Streaming text" status="NEW" wide stage={false}
              note="Reserves the finished paragraph's height before it starts, so the layout doesn't reflow line by line as tokens land. Press replay.">
              <StreamingText />
            </Demo>

            <Demo label="Prompt suggestions" status="NEW" wide stage={false}
              note="A chat's empty state — what to ask before anyone has typed. Without these a blank composer is a blank page.">
              <div className={styles.promptRow}>
                {['What surface do cards use?', 'Show me the type scale', 'Which colours are unused?'].map((p) => (
                  <button key={p} type="button" className={styles.prompt}>{p}</button>
                ))}
              </div>
            </Demo>

            <Demo label="Citation" status="NEW" wide stage={false}
              note="Points an answer back at the case study or post it came from. A chip in the prose, not a footnote — it has to be clickable where it is read.">
              <p className={styles.botText}>
                The card surface is #161616 across every block on the site
                <a href="#colour" className={styles.citation}>Colour</a>
                and the hover state lifts it to #1c1c1c
                <a href="#motion" className={styles.citation}>Motion</a>.
              </p>
            </Demo>

            <Demo label="Response feedback" status="NEW" wide stage={false}
              note="So answers can be judged rather than assumed. Two states and a line that changes with the vote.">
              <ResponseFeedback />
            </Demo>
          </div>
        </Section>

        {/* ── 12 Conversion ── */}
        <Section
          id="conversion"
          index={17}
          title="Conversion"
          blurb="The pages that have to ask for something. All rebuilt by hand today."
        >
          <div className={styles.demoGrid}>
            <Demo label="Pricing table" status="NEW" wide stage={false}
              note="Package data already exists in src/data — nothing renders it as a comparison. The recommended column takes a hairline ring rather than a fill, so it lifts without shouting.">
              <div className={styles.pricing}>
                {[
                  ['Brand system', '$40,000', ['Identity', 'Voice & messaging', 'Guidelines', '8–10 weeks'], false],
                  ['Full engagement', '$65,000', ['Everything in Brand', 'Digital product', 'Design system', '12 weeks'], true],
                  ['Content program', '$12,000/mo', ['Strategy', 'Production', 'Monthly cadence', 'Ongoing'], false],
                ].map(([name, price, feats, rec]) => (
                  <div key={name} className={`${styles.priceCard} ${rec ? styles.priceCardRec : ''}`}>
                    {rec && <span className={styles.priceFlag}>Most chosen</span>}
                    <span className={styles.priceName}>{name}</span>
                    <span className={styles.priceFig}>{price}</span>
                    <ul className={styles.priceList}>
                      {feats.map((f) => <li key={f} className={styles.priceItem}>{f}</li>)}
                    </ul>
                    <button type="button" className={rec ? styles.btnSolid : styles.btnOutline}>Enquire</button>
                  </div>
                ))}
              </div>
            </Demo>

            <Demo label="Testimonial" status="NEW" wide stage={false}
              note="Distinct from the pull quote: shorter, attributed with a role, and sits in a card rather than breaking the column.">
              <div className={styles.testimonials}>
                {[
                  ['The system outlived the engagement, which is the only test that matters.', 'Dana Cole', 'VP Marketing, Transcend'],
                  ['They shipped more in ten weeks than our last agency did in a year.', 'Ravi Menon', 'Founder, Photon'],
                ].map(([q, who, role]) => (
                  <figure key={who} className={styles.testimonial}>
                    <p className={styles.testimonialText}>{q}</p>
                    <figcaption className={styles.testimonialBy}>
                      <span className={styles.testimonialName}>{who}</span>
                      <span className={styles.testimonialRole}>{role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Demo>

            <Demo label="CTA band" status="NEW" wide stage={false}
              note="The end-of-page ask. One serif line, one solid button, one outline — the only place two buttons sit together.">
              <div className={styles.ctaBand}>
                <div className={styles.ctaText}>
                  <span className={styles.cardEyebrow}>Next</span>
                  <span className={styles.ctaLine}>Let's talk about what you're building.</span>
                </div>
                <div className={styles.ctaActions}>
                  <button type="button" className={styles.btnSolid}>Book a call</button>
                  <button type="button" className={styles.btnOutline}>Email us</button>
                </div>
              </div>
            </Demo>
          </div>
        </Section>

        {/* ── 11 Feedback ── */}
        <Section
          id="feedback"
          index={18}
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

            <Demo label="Progress bar" status="NEW"
              note="Upload, multi-step form, or a long deck. Distinct from the route loader: it reports a known amount, so it carries a figure.">
              <ProgressBar />
            </Demo>

            <Demo label="Status badge" status="NEW"
              note="'Coming soon' is handled ad hoc in the nav today. Three tones: neutral, positive, and the error red already in use.">
              <span className={styles.badgeRow}>
                <span className={styles.badge}>Coming soon</span>
                <span className={`${styles.badge} ${styles.badgeGood}`}>Live</span>
                <span className={`${styles.badge} ${styles.badgeBad}`}>Archived</span>
              </span>
            </Demo>

            <Demo label="Confirm dialog" status="NEW"
              note="Any irreversible action. Destructive action on the right, never pre-focused. See Overlays for the modal primitive underneath it.">
              <ConfirmDialog />
            </Demo>

            <Demo label="Inline banner" status="NEW" wide stage={false}
              note="No .alert, .banner or .notice class exists anywhere in the codebase — there's a toast and a form error summary and nothing for a page-level notice. Three tones, each with an icon and a word, never colour alone.">
              <div className={styles.banners}>
                {[
                  ['info', 'info', 'This deck is a draft. Numbers are indicative.'],
                  ['good', 'success', 'Brief received. We reply within two days.'],
                  ['warn', 'warning', 'Your session expires in five minutes.'],
                  ['bad', 'error', "That file didn't upload. Try again, or email it."],
                ].map(([tone, icon, text]) => (
                  <div key={tone} className={`${styles.banner} ${styles[`banner${tone[0].toUpperCase()}${tone.slice(1)}`]}`} role="status">
                    <Icon name={icon} size={14} />
                    <span className={styles.bannerText}>{text}</span>
                    <button type="button" className={styles.bannerClose} aria-label="Dismiss">
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </Demo>

            <Demo label="Spinner" status="NEW"
              note="For a wait with no known duration — where the progress bar would have to lie. A ring rather than dots, so it isn't confused with the chat's thinking state.">
              <span className={styles.spinner} role="status" aria-label="Loading" />
            </Demo>
          </div>
        </Section>

        {/* ── Overlays ── */}
        <Section
          id="overlays"
          index={19}
          title="Overlays"
          blurb="The primitive the site is missing. Both drawers ship without role=dialog, aria-modal, or a focus trap."
        >
          <p className={styles.prose}>
            Cal and contact both handle Escape and label their close button, and
            neither declares itself a dialog or traps focus — so a keyboard user tabs
            straight out of an open drawer into the page behind it, with no way to
            tell they have left. Everything here is contained in its demo rather than
            fixed to the viewport; in production the same markup takes
            {' '}<code className={styles.code}>position: fixed</code> and a layer from
            {' '}<a href="#depth" className={styles.inlineLink}>Depth</a>.
          </p>
          <div className={styles.demoGrid}>
            <Demo label="Modal" status="NEW" stage={false}
              note="Open it and press Tab repeatedly — focus cycles inside and cannot escape. Escape closes it, and focus returns to the button that opened it, which is the half most implementations skip.">
              <div className={styles.formStage}><Modal /></div>
            </Demo>

            <Demo label="Dropdown menu" status="NEW" stage={false}
              note="An action menu, not a select: a select returns a value, a menu performs a verb. They look alike and behave differently, so they carry different roles. Click outside or press Escape to close.">
              <div className={styles.formStage}><DropdownMenu /></div>
            </Demo>
          </div>

          <h3 className={styles.subhead}>Rules</h3>
          <div className={styles.list}>
            {[
              ['role="dialog" + aria-modal', 'Without both, a screen reader keeps reading the page behind it.'],
              ['Trap focus, then restore it', 'Restore is the forgotten half — otherwise the reader lands back at the top of the document.'],
              ['Escape always closes', 'The one shortcut every overlay owes. Both drawers already do this.'],
              ['Backdrop click closes', 'But only on mousedown outside — a drag that ends outside must not close it.'],
              ['Never nest overlays', 'A modal opening a modal has no back button. Replace the content instead.'],
            ].map(([label, note]) => (
              <div key={label} className={styles.row}>
                <div className={styles.rowMain}>
                  <div className={styles.rowText}>
                    <span className={styles.rowLabel}>{label}</span>
                    <span className={styles.rowNote}>{note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 12 Motion ── */}
        <Section
          id="motion"
          index={20}
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
          index={21}
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
          index={22}
          title="Light mode"
          blurb="Not a second palette — a filter."
        >
          <p className={styles.prose}>
            One rule: <code className={styles.code}>[data-theme="light"] .theme-layer {'{'} filter: invert(1) {'}'}</code>.
            The page inverts, then images and video invert again so photography survives.
            It is why there is no light-mode token set to document.
          </p>
          <p className={styles.prose}>
            One consequence to know before adding a component: anything
            {' '}<code className={styles.code}>position: fixed</code> must sit outside
            {' '}<code className={styles.code}>.theme-layer</code>, because a filter on an
            ancestor pins it to the layer instead of the viewport. That is why the back
            button lives in <code className={styles.code}>index.css</code>.
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

        {/* ── Accessibility ── */}
        <Section
          id="a11y"
          index={23}
          title="Accessibility"
          blurb="Two live defects, not omissions. Both are cheap to fix and neither is fixed."
        >
          <div className={styles.driftList}>
            <div className={styles.drift}>
              <span className={styles.driftStat}>23</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>
                  <code className={styles.code}>outline: none</code> across the stylesheets
                </span>
                <p className={styles.driftNote}>
                  Against exactly one <code className={styles.code}>:focus-visible</code>.
                  Focus is removed almost everywhere and restored almost nowhere, so a
                  keyboard user has close to no idea where they are. One token fixes
                  every control at once.
                </p>
              </div>
            </div>

            <div className={styles.drift}>
              <span className={styles.driftStat}>0</span>
              <div className={styles.driftBody}>
                <span className={styles.driftTitle}>
                  Files honouring <code className={styles.code}>prefers-reduced-motion</code>
                </span>
                <p className={styles.driftNote}>
                  Every card animates in, the client strip scrolls without stopping, the
                  cursor tracks the pointer, and view transitions fire on navigation.
                  For a vestibular-sensitive visitor there is currently no way out.
                </p>
              </div>
            </div>
          </div>

          <h3 className={styles.subhead}>Focus</h3>
          <p className={styles.subnote}>
            One ring, everywhere. <code className={styles.code}>:focus-visible</code>, so a
            click leaves nothing behind but Tab does. This page applies it to itself —
            though only to itself: Tab into the nav rail and the browser's blue default
            comes back, because the rail is outside this page. That is the argument for
            the ring being a token in <code className={styles.code}>index.css</code>
            rather than a rule per page.
          </p>
          <div className={styles.demoGrid}>
            <Demo label="Focus ring" status="NEW"
              note="2px white at 0.9, offset 2px. Offset matters: a ring flush to the edge reads as a border and disappears on anything that already has one.">
              <div className={styles.focusRow}>
                <button type="button" className={`${styles.btnSolid} ${styles.focusable}`}>Solid</button>
                <button type="button" className={`${styles.btnOutline} ${styles.focusable}`}>Outline</button>
                <input className={`${styles.fieldContact} ${styles.focusable}`} placeholder="Field" aria-label="Focus demo" />
              </div>
            </Demo>

            <Demo label="On a light surface" status="NEW"
              note="The same ring inverts with the page. A single white ring would vanish the moment light mode inverts the ground beneath it.">
              <div className={`${styles.focusRow} ${styles.focusLight}`}>
                <button type="button" className={`${styles.btnGate} ${styles.focusable}`}>Gate</button>
                <span className={styles.focusHint}>Tab to see it</span>
              </div>
            </Demo>

            <Demo label="Skip link" status="NEW"
              note="Off-screen until focused — not display:none, which would drop it from the tab order and defeat the purpose entirely.">
              <a href="#colour" className={styles.skipLink}>Skip to content</a>
            </Demo>
          </div>

          <h3 className={styles.subhead}>Reduced motion</h3>
          <p className={styles.subnote}>
            Not "no motion" — motion that moves nothing through space. Fades stay; travel,
            scale and looping stop.
          </p>
          <div className={styles.list}>
            {[
              ['Card entrance', 'translate 10px + fade', 'Fade only — the 10px travel is dropped.'],
              ['Hover lift', 'translateY(-2px / -6px)', 'No lift. Background and ring still change.'],
              ['Client strip', '48s infinite marquee', 'Stops. Becomes a static, wrapped list.'],
              ['Media scale', 'scale(1.06) on hover', 'No scale.'],
              ['Route loader', '0.9s sweep', 'Kept — it reports progress, and it is 2px tall.'],
              ['Custom cursor', 'follows the pointer', 'Disabled; the native cursor returns.'],
            ].map(([label, from, to]) => (
              <div key={label} className={styles.row}>
                <div className={styles.rowMain}>
                  <div className={styles.rowText}>
                    <span className={styles.rowLabel}>{label}</span>
                    <span className={styles.rowNote}>{to}</span>
                  </div>
                </div>
                <span className={styles.value}>{from}</span>
              </div>
            ))}
          </div>
          <p className={styles.subnote}>
            This page honours it already — set reduce at the OS level and every
            animation above stops.
          </p>
        </Section>

        {/* ── 15 Backlog ── */}
        <Section
          id="backlog"
          index={24}
          title="Inventory"
          blurb="Every pattern the system holds, and how far each has travelled from a drawing to a component."
        >
          <p className={styles.prose}>
            The reason to keep it is the three input designs in
            {' '}<a href="#fields" className={styles.inlineLink}>forms</a>. None was a
            decision — each was the fastest thing to write that day. Everything below was
            decided once instead.
          </p>
          <p className={styles.prose}>
            <strong className={styles.strong}>PROTO is not a lesser state.</strong> A drawing
            costs nothing to keep; a premature component costs maintenance forever.
          </p>

          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <Status value="HAVE" /> a component exists in src/
            </span>
            <span className={styles.legendItem}>
              <Status value="PROTO" /> drawn here, not yet built
            </span>
          </div>

          <div className={styles.backlog}>
            {BACKLOG.map((g) => (
              <div key={g.group} className={styles.backlogGroup}>
                <div className={styles.backlogHead}>
                  <h3 className={styles.backlogTitle}>{g.group}</h3>
                  <span className={styles.backlogCount}>
                    {g.items.filter((i) => i.state === 'have').length} / {g.items.length} built
                  </span>
                </div>
                <p className={styles.backlogNote}>{g.note}</p>
                <div className={styles.backlogList}>
                  {g.items.map((it) => (
                    <div key={it.name} className={styles.backlogItem}>
                      <span className={styles.backlogName}>{it.name}</span>
                      <Status value={STATE_LABEL[it.state]} />
                      <span className={styles.backlogWhy}>{it.why}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
