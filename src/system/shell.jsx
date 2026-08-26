import { useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton } from './primitives'

/* The dashboard frame.
 *
 * The sidebar is a grid column rather than position:fixed, so content never
 * needs a magic margin to clear it and nothing can slide underneath. Below
 * 768px it becomes a horizontal strip rather than collapsing to icons — a
 * 56px rail on a phone costs more room than it returns.
 */

export function Shell({ collapsed, children }) {
  return (
    <div className={`sc-root ${s.shell} ${collapsed ? s.shellCollapsed : ''}`}>
      {children}
    </div>
  )
}

export function Sidebar({ brand, mark, collapsed, onToggle, children }) {
  return (
    <nav className={s.sidebar} aria-label="Main">
      <div className={s.sidebarHead}>
        {/* The mark stays when the rail collapses — it is the one thing that
            says which product you are in, and an icon rail with no identity is
            a rail nobody recognises. */}
        <span className={s.brandRow}>
          {mark && <img src={mark} alt="" className={s.brandMark} />}
          {!collapsed && <span className={s.brand}>{brand}</span>}
        </span>
        <IconButton
          icon={collapsed ? 'chevron-right' : 'chevron-left'}
          label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          size={14}
          onClick={onToggle}
        />
      </div>
      {children}
    </nav>
  )
}

export function NavGroup({ label, collapsed, children }) {
  return (
    <div className={s.navGroup}>
      {label && !collapsed && <span className={s.navLabel}>{label}</span>}
      {children}
    </div>
  )
}

/* aria-current rather than colour alone, so the active item is announced as
   well as brighter — and it carries a rule, so it is not colour-only either.
   The count is the reason a lot of these rows exist: a nav that says how much
   is behind a link is a nav people can plan with. */
export function NavItem({ icon, label, count, active, collapsed, onClick }) {
  return (
    <button
      type="button"
      className={`${s.navItem} ${active ? s.navItemOn : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      title={collapsed ? label : undefined}
    >
      {icon && <Icon name={icon} size={14} />}
      {!collapsed && (
        <>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          {count !== undefined && <span className={s.navCount}>{count}</span>}
        </>
      )}
    </button>
  )
}

export function Topbar({ title, children }) {
  return (
    <header className={s.topbar}>
      <h1 className={s.topbarTitle}>{title}</h1>
      <div className={s.topbarActions}>{children}</div>
    </header>
  )
}

export function Content({ children }) {
  return <main className={s.content}>{children}</main>
}

/* 12 columns on the site's 5px gutter — the same grid the homepage uses, so a
   dashboard and a marketing page read as one system rather than two products. */
export function Grid({ children }) {
  return <div className={s.grid12}>{children}</div>
}

export function Col({ span = 12, children }) {
  const cls = { 3: s.span3, 4: s.span4, 6: s.span6, 8: s.span8, 12: s.span12 }[span] ?? s.span12
  return <div className={cls}>{children}</div>
}

/* Convenience: the whole frame with its own collapse state, for a product that
   does not want to own it. */
export function useSidebar(initial = false) {
  const [collapsed, setCollapsed] = useState(initial)
  return { collapsed, toggle: () => setCollapsed((c) => !c) }
}
