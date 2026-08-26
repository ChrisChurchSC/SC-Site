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

export function Banner({ tone = 'info', children, onDismiss }) {
  const cls = { good: s.bannerGood, warn: s.bannerWarn, bad: s.bannerBad }[tone] ?? s.bannerInfo
  const icon = { good: 'success', warn: 'warning', bad: 'error' }[tone] ?? 'info'
  return (
    <div className={`${s.banner} ${cls}`} role="status">
      <Icon name={icon} size={14} />
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
