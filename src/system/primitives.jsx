import { useState } from 'react'
import s from './system.module.css'
import { ICONS } from './icons'

/* Primitives. Every one of these was a demo inside the styleguide page and is
 * now a component — which is the difference between a design system and a
 * drawing of one. The styleguide should import from here rather than
 * re-implement, and so should any product.
 */

export function Icon({ name, size = 16, className = '' }) {
  const d = ICONS[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={`${s.icon} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}

/* Five variants, one size scale. `quiet` is the only one with no fill at rest —
   for toolbars, where five bordered buttons in a row become a fence. */
export function Button({
  variant = 'outline', size = 'md', icon, children, className = '', ...rest
}) {
  const tone = {
    solid: s.btnSolid, outline: s.btnOutline, ghost: s.btnGhost,
    quiet: s.btnQuiet, danger: s.btnDanger,
  }[variant] ?? s.btnOutline
  return (
    <button
      type="button"
      className={`${s.btn} ${size === 'sm' ? s.btnSm : s.btnMd} ${tone} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  )
}

/* Icon-only always takes a label — nothing else names it. */
export function IconButton({ icon, label, size = 16, ...rest }) {
  return (
    <button type="button" className={s.iconBtn} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  )
}

export function Card({ as = 'div', link, muted, className = '', children, ...rest }) {
  const Tag = link ? 'button' : as
  return (
    <Tag
      className={`${s.card} ${link ? s.cardLink : ''} ${muted ? s.cardMuted : ''} ${className}`}
      {...(link ? { type: 'button' } : {})}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export const Eyebrow = ({ children }) => <span className={s.eyebrow}>{children}</span>
export const CardTitle = ({ children }) => <span className={s.cardTitle}>{children}</span>
export const CardBody = ({ children }) => <span className={s.cardBody}>{children}</span>

/* Panel: a titled well for a dashboard cell. Distinct from Card — a card is a
   thing you might click, a panel is a container for other things. */
export function Panel({ title, actions, className = '', children }) {
  return (
    <section className={`${s.panel} ${className}`}>
      {(title || actions) && (
        <header className={s.panelHead}>
          {title && <span className={s.panelTitle}>{title}</span>}
          {actions}
        </header>
      )}
      {children}
    </section>
  )
}

/* A figure with no trend behind it can't be acted on, so the shape is part of
   the tile. The delta always names its comparison — a bare percentage is a
   number pretending to be a fact. */
export function StatTile({ label, value, delta, direction, vs = 'vs last period', trend, series = 1 }) {
  const max = trend?.length ? Math.max(...trend) * 1.15 : 1
  const path = trend?.length
    ? trend.map((v, i) => `${i ? 'L' : 'M'}${(i / (trend.length - 1)) * 80},${22 - (v / max) * 18}`).join(' ')
    : null
  return (
    <div className={s.stat}>
      <span className={s.eyebrow}>{label}</span>
      <div className={s.statMain}>
        <span className={s.statFigure}>{value}</span>
        {path && (
          <svg viewBox="0 0 80 24" className={s.statSpark} aria-hidden="true">
            <path d={path} fill="none" stroke={`var(--sc-s${series})`} strokeWidth="1.5" />
          </svg>
        )}
      </div>
      {delta && (
        <span className={`${s.statDelta} ${direction === 'up' ? s.statUp : direction === 'down' ? s.statDown : ''}`}>
          {delta} <span className={s.statVs}>{vs}</span>
        </span>
      )}
    </div>
  )
}

/* Status wears an icon and a word as well as a colour — never colour alone. */
export function Badge({ tone = 'neutral', icon, children }) {
  const cls = { good: s.badgeGood, warn: s.badgeWarn, bad: s.badgeBad }[tone] ?? ''
  return (
    <span className={`${s.badge} ${cls}`}>
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  )
}

/* Tone and glyph are separate arguments on purpose. A notice can be worth
   noticing without being an alarm — colour is the loudest thing in a monochrome
   interface, and spending it on every advisory leaves nothing for a real
   failure. Passing an explicit `icon` keeps the meaning while staying neutral. */
export function Banner({ tone = 'info', icon, children, onDismiss }) {
  const cls = { good: s.bannerGood, warn: s.bannerWarn, bad: s.bannerBad }[tone] ?? s.bannerInfo
  const glyph = icon ?? ({ good: 'success', warn: 'warning', bad: 'error' }[tone] ?? 'info')
  return (
    <div className={`${s.banner} ${cls}`} role="status">
      <Icon name={glyph} size={14} />
      <span className={s.bannerText}>{children}</span>
      {onDismiss && <IconButton icon="close" label="Dismiss" size={12} onClick={onDismiss} />}
    </div>
  )
}

export const Spinner = () => <span className={s.spinner} role="status" aria-label="Loading" />

/* Switches the view of one thing. Tabs switch between different things —
   confusing the two is why toolbars end up carrying both. */
export function Segmented({ value, onChange, options, label = 'View' }) {
  return (
    <div className={s.segmented} role="group" aria-label={label}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        return (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            className={`${s.segItem} ${value === v ? s.segItemOn : ''}`}
            onClick={() => onChange(v)}
          >
            {o.icon && <Icon name={o.icon} size={13} />}
            {typeof o === 'string' ? o : o.label ?? v}
          </button>
        )
      })}
    </div>
  )
}

/* ── Title bar ─────────────────────────────────────────────────────────────
   Identity on the left, actions on the right, ruled off from the toolbar
   beneath it. The two rows do different jobs: this one says what you are
   looking at, the toolbar says what you can do to it. Merging them is why so
   many app headers become a shelf of unrelated buttons. */

/* The page's h1. Every screen needs exactly one, and a span styled to look
   like a heading gives a screen-reader user no way to jump to it. */
export function TitleBar({ mark, owner, title, badge, children }) {
  return (
    <div className={s.titleBar}>
      <div className={s.titleLeft}>
        {mark && <img src={mark} alt="" className={s.titleMark} />}
        {owner && (
          <>
            <span className={s.titleOwner}>{owner}</span>
            <span className={s.titleSlash}>/</span>
          </>
        )}
        {/* The heading is the name alone. Wrapping the badge inside it makes
            the accessible name "BrandPrivate", which is what a screen reader
            then announces and what a heading list shows. */}
        <h1 className={s.titleName}>{title}</h1>
        {badge && <span className={s.titleBadge}>{badge}</span>}
      </div>
      <div className={s.titleActions}>{children}</div>
    </div>
  )
}

/* A button whose count is part of the control rather than beside it. The count
   sits in its own cell with a rule between, so it stays readable when the
   number grows and never shifts the label. */
export function CountButton({ icon, label, count, onClick, pressed }) {
  return (
    <span className={s.countBtn}>
      <button
        type="button"
        className={`${s.countMain} ${pressed ? s.countMainOn : ''}`}
        onClick={onClick}
        aria-pressed={pressed}
      >
        <Icon name={icon} size={13} />
        {label}
      </button>
      {count !== undefined && <span className={s.countValue}>{count}</span>}
    </span>
  )
}

/* ── Toolbar ───────────────────────────────────────────────────────────────
   The row that changes what the listing shows: which version, how to find a
   thing in it, and what to add. */

export function Toolbar({ children }) {
  return <div className={s.toolbar}>{children}</div>
}

export function RefSelect({ value, options = [], onChange, icon = 'route' }) {
  const [open, setOpen] = useState(false)
  return (
    <span className={s.refWrap}>
      <button
        type="button"
        className={s.refBtn}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Icon name={icon} size={13} />
        <span className={s.refValue}>{value}</span>
        <Icon name="chevron-down" size={11} />
      </button>
      {open && (
        <div className={s.refMenu} role="listbox">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              className={`${s.refItem} ${o === value ? s.refItemOn : ''}`}
              onClick={() => { onChange?.(o); setOpen(false) }}
            >
              {o === value && <Icon name="check" size={11} />}
              <span>{o}</span>
            </button>
          ))}
        </div>
      )}
    </span>
  )
}

export function CountLink({ icon, count, label, onClick }) {
  return (
    <button type="button" className={s.countLink} onClick={onClick}>
      <Icon name={icon} size={13} />
      <b>{count}</b>
      {label}
    </button>
  )
}

/* The shortcut hint is inside the field rather than beside it — a key badge
   floating next to an input reads as a separate control. */
export function FindField({ value, onChange, placeholder = 'Go to asset', shortcut = 'T' }) {
  return (
    <span className={s.findField}>
      <Icon name="search" size={13} />
      <input
        className={s.findInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {shortcut && <kbd className={s.findKbd}>{shortcut}</kbd>}
    </span>
  )
}

/* ── People ────────────────────────────────────────────────────────────────
   Initials rather than photographs by default. A team of five has no headshot
   pipeline, and a broken image is worse than none — so the fallback is the
   primary and a photo is the enhancement. */

export function Avatar({ name, src, size = 24 }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <span
      className={s.avatar}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      title={name}
    >
      {src ? <img src={src} alt="" className={s.avatarImg} /> : <span aria-hidden="true">{initials}</span>}
    </span>
  )
}

/* Handle and real name both: in a workspace people are known by one or the
   other, and rarely by the same one. */
export function Contributors({ people, title = 'Contributors' }) {
  return (
    <AsideBlock title={title} count={people.length}>
      <div className={s.people}>
        {people.map((p) => (
          <button key={p.handle ?? p.name} type="button" className={s.person}>
            <Avatar name={p.name} src={p.src} size={26} />
            <span className={s.personHandle}>{p.handle ?? p.name}</span>
            {p.handle && p.name !== p.handle && <span className={s.personName}>{p.name}</span>}
          </button>
        ))}
      </div>
    </AsideBlock>
  )
}

/* Composition bar: shares of a whole as one rule, legend beneath.
 *
 * The bar is 8px and carries no labels by design — it is a shape, not a chart.
 * The numbers live in the legend where they can be read exactly, which is what
 * lets this work at a size no chart would survive.
 *
 * Coloured from the SEQUENTIAL ramp, not the categorical slots, and ordered by
 * share. A composition bar is degrees of one thing rather than a set of
 * identities — and the categorical palette only has three slots, so a fourth
 * segment would alias back to the first and put two identical dots in the
 * legend. The ramp gives five distinguishable steps and says "shares" rather
 * than "categories", which is what this actually is.
 *
 * A segment under 2% still renders at 2% so it stays visible; the legend keeps
 * the true figure, so nothing is misreported. */
export function CompositionBar({ segments, title }) {
  const total = segments.reduce((a, x) => a + x.value, 0) || 1
  const ordered = [...segments].sort((a, b) => b.value - a.value)
  const step = (i) => `var(--sc-q${Math.max(1, 5 - i)})`

  return (
    <AsideBlock title={title}>
      <div className={s.compBar}>
        {ordered.map((seg, i) => (
          <span
            key={seg.label}
            className={s.compSeg}
            style={{
              width: `${Math.max(2, (seg.value / total) * 100)}%`,
              background: seg.colour ?? step(i),
            }}
            title={`${seg.label}: ${seg.value}`}
          />
        ))}
      </div>
      <div className={s.compLegend}>
        {ordered.map((seg, i) => (
          <span key={seg.label} className={s.compKey}>
            <span className={s.compDot} style={{ background: seg.colour ?? step(i) }} />
            {seg.label}
            <span className={s.compPct}>{((seg.value / total) * 100).toFixed(1)}%</span>
          </span>
        ))}
      </div>
    </AsideBlock>
  )
}

/* A block in the right rail. Deliberately plain — the rail is read once and
   then ignored, so it must not compete with the listing beside it. */
export function AsideBlock({ title, count, action, children }) {
  return (
    <section className={s.aside}>
      {title && (
        <header className={s.asideHead}>
          <span className={s.asideTitle}>{title}</span>
          {count !== undefined && <span className={s.asideCount}>{count}</span>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

/* Icon, figure, label. The figure is emphasised and the label is not, because
   the number is what is scanned and the word only says what it counts. */
export function FactRow({ icon, value, label }) {
  return (
    <span className={s.fact}>
      <Icon name={icon} size={13} />
      {value !== undefined && <b className={s.factValue}>{value}</b>}
      <span className={s.factLabel}>{label}</span>
    </span>
  )
}

/* Status list: a dot, a name, a time. The dot is paired with a word rather
   than carrying the meaning alone. */
export function StatusList({ items }) {
  return (
    <div className={s.statusList}>
      {items.map((it) => (
        <span key={it.label} className={s.statusRow}>
          <span
            className={`${s.statusDot} ${it.tone === 'bad' ? s.statusDotBad : it.tone === 'warn' ? s.statusDotWarn : ''}`}
            aria-hidden="true"
          />
          <span className={s.statusLabel}>{it.label}</span>
          <span className={s.statusWhen}>{it.when}</span>
        </span>
      ))}
    </div>
  )
}

/* ── Fields ────────────────────────────────────────────────────────────────
   Label above, control, then a slot that holds help or an error. They share
   the slot so the row cannot change height when validation fires and shove
   everything below it down the page. */

export function Field({ label, optional, help, error, children }) {
  return (
    <label className={s.field}>
      <span className={s.label}>
        {label}
        {/* Optional is marked; required is the default. Fewer marks, less
            noise, and the exception is the thing worth pointing at. */}
        {optional && <span className={s.optional}>Optional</span>}
      </span>
      {children}
      <span className={`${s.help} ${error ? s.helpError : ''}`}>{error || help || ' '}</span>
    </label>
  )
}

export function Input({ value, onChange, invalid, ...rest }) {
  return (
    <input
      className={`${s.input} ${invalid ? s.invalid : ''}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}

/* role="switch", not a checkbox. A switch takes effect immediately; a checkbox
   waits for a submit. Using the wrong one is a promise you do not keep. */
export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={s.switchRow}
      onClick={() => onChange?.(!checked)}
    >
      <span className={`${s.switchTrack} ${checked ? s.switchOn : ''}`}>
        <span className={s.switchThumb} />
      </span>
      <span className={s.switchLabel}>{label}</span>
    </button>
  )
}

/* ── Section nav ───────────────────────────────────────────────────────────
 *
 * The horizontal bar under the title: the top-level areas of one workspace.
 * Distinct from Tabs, which switch views of a single thing — these are
 * different places, each with its own content and its own URL.
 *
 * The active item carries three signals: brighter ink, an accent underline,
 * and aria-current. Colour is never doing the work alone, which matters more
 * here than anywhere else because this is how someone knows where they are.
 *
 * This is the one place an accent earns its keep in the UI. A single 2px rule,
 * once per screen — everything else on the page stays monochrome, and that is
 * exactly why this reads instantly.
 */
export function SectionNav({ value, onChange, sections }) {
  return (
    <nav className={s.sectionNav} aria-label="Sections">
      <div className={s.sectionScroll}>
        {sections.map((sec) => {
          const active = value === sec.key
          return (
            <button
              key={sec.key}
              type="button"
              aria-current={active ? 'page' : undefined}
              className={`${s.section} ${active ? s.sectionOn : ''}`}
              onClick={() => onChange(sec.key)}
            >
              <Icon name={sec.icon} size={15} />
              <span className={s.sectionLabel}>{sec.label}</span>
              {sec.count !== undefined && (
                <span className={s.sectionCount}>{sec.count}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function Tabs({ value, onChange, options }) {
  return (
    <div className={s.tabRow} role="tablist">
      {options.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={value === t}
          className={`${s.tab} ${value === t ? s.tabOn : ''}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
