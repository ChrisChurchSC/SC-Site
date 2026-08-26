import { useState, Fragment } from 'react'
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

/* ── File view ─────────────────────────────────────────────────────────────
 *
 * What opening a row leads to. The same three bands as the listing — path,
 * last change, then content — so moving from folder to file feels like going
 * deeper rather than arriving somewhere unrelated.
 *
 * The toolbar carries facts on the left and actions on the right, with the
 * view switch first: what you are looking at, then what it is, then what you
 * can do to it.
 */
export function FileView({
  path, onNavigate, head, meta, views, view, onView, actions, children,
}) {
  return (
    <div className={s.fileView}>
      <div className={s.fileTop}>
        <Path segments={path} onNavigate={onNavigate} />
        {actions}
      </div>

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
          {head.onHistory && (
            <button type="button" className={s.headHistory} onClick={head.onHistory}>
              <Icon name="clock" size={12} />History
            </button>
          )}
        </div>
      )}

      <div className={s.fileBody}>
        <div className={s.fileBar}>
          {views?.length > 1 && (
            <span className={s.fileViews} role="group" aria-label="View">
              {views.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  className={`${s.fileViewBtn} ${view === v ? s.fileViewBtnOn : ''}`}
                  onClick={() => onView?.(v)}
                >
                  {v}
                </button>
              ))}
            </span>
          )}
          {/* Facts, not controls — the separators keep them from reading as a
              row of links. */}
          {meta?.length > 0 && (
            <span className={s.fileMeta}>
              {meta.map((m, i) => (
                <Fragment key={m}>
                  {i > 0 && <span className={s.headDot}>·</span>}
                  <span>{m}</span>
                </Fragment>
              ))}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

/* Numbered lines. The gutter is not selectable, so copying the content does
   not drag the numbers along with it — the commonest complaint about every
   code viewer that renders them as text. */
export function CodeLines({ text }) {
  const lines = text.replace(/\n$/, '').split('\n')
  return (
    <pre className={s.code}>
      <code>
        {lines.map((line, i) => (
          <span key={i} className={s.codeLine}>
            <span className={s.codeNum} aria-hidden="true">{i + 1}</span>
            <span className={s.codeText}>{line || ' '}</span>
          </span>
        ))}
      </code>
    </pre>
  )
}

/* Media preview. A checkerboard behind it, because half of what a brand
   workspace holds is transparent and a flat ground silently lies about it. */
export function MediaPreview({ label }) {
  return (
    <div className={s.preview}>
      <div className={s.previewPlate}>
        <span className={s.previewArt} />
      </div>
      {label && <span className={s.previewLabel}>{label}</span>}
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
        /* role=treeitem on the row, and the children in their own group.
           A role=tree with no treeitems inside announces as an empty tree,
           which is worse than no role at all. */
        <div
          key={n.key}
          role="treeitem"
          aria-expanded={hasKids ? isOpen : undefined}
          aria-selected={activeKey === n.key}
        >
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
          {hasKids && isOpen && (
            <div role="group">{render(n.children, depth + 1)}</div>
          )}
        </div>
      )
    })

  return <div className={s.tree} role="tree">{render(nodes)}</div>
}
