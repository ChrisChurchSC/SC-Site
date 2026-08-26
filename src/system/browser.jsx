import { useState } from 'react'
import s from './system.module.css'
import { Icon } from './primitives'

/* File browser and tree.
 *
 * Modelled on the repo listing pattern — a header carrying the last change,
 * then folders before files, each row naming what changed and when. It works
 * because it answers three questions at once without a click: what is in here,
 * what moved most recently, and who moved it.
 *
 * Two rules it depends on and most imitations drop:
 *
 *   - Folders sort before files, always, and neither list is interleaved.
 *     Mixing them makes the eye scan the icon column instead of the names.
 *   - The message column truncates, the name column never does. A name you
 *     cannot read is a row you cannot use; a message you cannot finish is a
 *     row you can still act on.
 */

/* ── Breadcrumb ────────────────────────────────────────────────────────────
   Every segment is clickable except the last, which is where you are. A
   breadcrumb whose final segment is a link invites you to reload the page. */
export function Path({ segments, onNavigate }) {
  return (
    <nav className={s.path} aria-label="Breadcrumb">
      {segments.map((seg, i) => {
        const last = i === segments.length - 1
        return (
          <span key={seg + i} className={s.pathSeg}>
            {i > 0 && <span className={s.pathSep}>/</span>}
            {last ? (
              <span className={s.pathHere} aria-current="page">{seg}</span>
            ) : (
              <button type="button" className={s.pathLink} onClick={() => onNavigate(i)}>
                {seg}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export function FileBrowser({ entries, head, onOpen }) {
  /* Folders first. The sort is here rather than at the call site so every
     consumer gets it — this is the kind of rule that rots when it is a
     convention instead of code. */
  const rows = [...entries].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className={s.browser}>
      {head && (
        <div className={s.browserHead}>
          <span className={s.headWho}>
            <span className={s.headAvatar}>{head.initials}</span>
            {head.who}
          </span>
          <span className={s.headMsg}>{head.message}</span>
          <span className={s.headMeta}>
            <span className={s.headRef}>{head.ref}</span>
            <span className={s.headDot}>·</span>
            {head.when}
          </span>
          <span className={s.headCount}>
            <Icon name="clock" size={12} />
            {head.count}
          </span>
        </div>
      )}

      <div className={s.browserList} role="list">
        {rows.length === 0 && (
          <div className={s.browserEmpty}>
            <span className={s.eyebrow}>Empty</span>
            <span className={s.browserEmptyLine}>Nothing in this folder yet.</span>
          </div>
        )}
        {rows.map((e) => (
          <button
            key={e.name}
            type="button"
            role="listitem"
            className={s.row}
            onClick={() => onOpen?.(e)}
          >
            <span className={`${s.rowIcon} ${e.kind === 'folder' ? s.rowIconFolder : ''}`}>
              <Icon name={e.kind === 'folder' ? 'folder' : e.icon ?? 'file'} size={15} />
            </span>
            <span className={s.rowName}>{e.name}</span>
            <span className={s.rowMsg}>{e.message}</span>
            {e.status && <span className={s.rowStatus}>{e.status}</span>}
            <span className={s.rowWhen}>{e.when}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Tree ──────────────────────────────────────────────────────────────────
   Disclosure with a caret, not a click-anywhere row: opening a folder and
   selecting it are different intents, and a tree that conflates them makes it
   impossible to open one branch while staying where you are. */
export function Tree({ nodes, activeKey, onSelect, defaultOpen = [] }) {
  const [open, setOpen] = useState(new Set(defaultOpen))
  const toggle = (key) =>
    setOpen((o) => {
      const next = new Set(o)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const render = (list, depth = 0) =>
    list.map((n) => {
      const isOpen = open.has(n.key)
      const hasKids = n.children?.length > 0
      return (
        <div key={n.key}>
          <div
            className={`${s.treeRow} ${activeKey === n.key ? s.treeRowOn : ''}`}
            style={{ paddingLeft: 6 + depth * 14 }}
          >
            {hasKids ? (
              <button
                type="button"
                className={s.treeCaret}
                onClick={() => toggle(n.key)}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${n.label}`}
              >
                <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={11} />
              </button>
            ) : (
              <span className={s.treeCaretSpacer} />
            )}
            <button
              type="button"
              className={s.treeLabel}
              onClick={() => onSelect(n)}
              aria-current={activeKey === n.key ? 'page' : undefined}
            >
              <Icon name={hasKids ? (isOpen ? 'folder-open' : 'folder') : n.icon ?? 'file'} size={13} />
              <span className={s.treeName}>{n.label}</span>
              {n.count !== undefined && <span className={s.treeCount}>{n.count}</span>}
            </button>
          </div>
          {hasKids && isOpen && render(n.children, depth + 1)}
        </div>
      )
    })

  return <div className={s.tree} role="tree">{render(nodes)}</div>
}
