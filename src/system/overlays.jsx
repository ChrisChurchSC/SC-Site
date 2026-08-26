import { useCallback, useEffect, useId, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, Button, IconButton } from './primitives'

/* Overlays — everything that appears on top of the page.
 *
 * These were drawn on the styleguide as demos and never extracted, which meant
 * the hard part of each one — the focus trap, the dismiss contract, the role —
 * existed once, on a page nobody imports. A modal that traps focus correctly is
 * worth having exactly once.
 *
 * The dismiss contract, applied consistently:
 *   modal, sheet, lightbox   Escape, backdrop, close button. Focus trapped.
 *   drawer                   Escape, backdrop, close button. Focus trapped.
 *   menu, popover            Escape, outside click. Focus not trapped — these
 *                            are attached to a trigger, not modal over it.
 *   tooltip                  Hover and focus only. Never traps, never blocks.
 */

/* Trap focus, and give it back. Restoring matters more than trapping: without
   it a screen reader lands back at the top of the document every time a dialog
   closes, which is worse than never having opened it. */
export function useFocusTrap(open, onClose) {
  const ref = useRef(null)
  const restoreTo = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    restoreTo.current = document.activeElement
    const node = ref.current
    if (!node) return undefined

    const focusables = () =>
      [...node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.hasAttribute('disabled'))

    focusables()[0]?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose?.(); return }
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
      if (restoreTo.current instanceof HTMLElement) restoreTo.current.focus()
    }
  }, [open, onClose])

  return ref
}

/* Escape and outside click, for things attached to a trigger rather than
   covering the page. mousedown rather than click, so a menu closes before the
   thing underneath it receives the press. */
export function useDismiss(open, onClose) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) onClose?.() }
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
  return ref
}

/* ── Modal ─────────────────────────────────────────────────────────────── */

export function Modal({ open, onClose, title, children, actions, width }) {
  const close = useCallback(() => onClose?.(), [onClose])
  const ref = useFocusTrap(open, close)
  const id = useId()
  if (!open) return null

  return (
    <div className={s.backdrop} onMouseDown={close}>
      <div
        ref={ref}
        className={s.modal}
        style={width ? { maxWidth: width } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.modalHead}>
          <span id={id} className={s.modalTitle}>{title}</span>
          <IconButton icon="close" label="Close" onClick={close} />
        </div>
        <div className={s.modalBody}>{children}</div>
        {actions && <div className={s.modalActions}>{actions}</div>}
      </div>
    </div>
  )
}

/* A confirm is a modal whose body is one question. It exists separately so the
   destructive case cannot be assembled wrong: the cancel is always first, and
   the confirm carries the verb rather than the word "OK". */
export function ConfirmDialog({ open, onClose, onConfirm, title, body, confirm = 'Confirm', tone }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={420}
      actions={
        <>
          <Button size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            variant="solid"
            icon={tone === 'bad' ? 'warning' : 'check'}
            onClick={() => { onConfirm?.(); onClose?.() }}
          >
            {confirm}
          </Button>
        </>
      }
    >
      {body}
    </Modal>
  )
}

/* ── Drawer and sheet ──────────────────────────────────────────────────────
   The same dialog contract at two edges. A drawer comes from the side and is
   for adjacent work; a sheet comes from the bottom and is for a decision on a
   small screen. */

export function Drawer({ open, onClose, title, side = 'right', children, actions }) {
  const close = useCallback(() => onClose?.(), [onClose])
  const ref = useFocusTrap(open, close)
  const id = useId()
  if (!open) return null

  return (
    <div className={s.backdrop} onMouseDown={close}>
      <div
        ref={ref}
        className={`${s.drawer} ${side === 'left' ? s.drawerLeft : s.drawerRight}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.modalHead}>
          <span id={id} className={s.modalTitle}>{title}</span>
          <IconButton icon="close" label="Close" onClick={close} />
        </div>
        <div className={s.drawerBody}>{children}</div>
        {actions && <div className={s.modalActions}>{actions}</div>}
      </div>
    </div>
  )
}

export function BottomSheet({ open, onClose, title, children, actions }) {
  const close = useCallback(() => onClose?.(), [onClose])
  const ref = useFocusTrap(open, close)
  const id = useId()
  if (!open) return null

  return (
    <div className={`${s.backdrop} ${s.backdropBottom}`} onMouseDown={close}>
      <div
        ref={ref}
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* The grabber says "this came from the bottom edge and goes back
            there". It is not a control, so it is hidden from the reader. */}
        <span className={s.sheetGrab} aria-hidden="true" />
        <div className={s.modalHead}>
          <span id={id} className={s.modalTitle}>{title}</span>
          <IconButton icon="close" label="Close" onClick={close} />
        </div>
        <div className={s.drawerBody}>{children}</div>
        {actions && <div className={s.modalActions}>{actions}</div>}
      </div>
    </div>
  )
}

/* ── Menu ──────────────────────────────────────────────────────────────────
   An action menu, which is a different control from a select. A select returns
   a value; a menu performs a verb. They look similar and behave differently,
   so they carry different roles. */
export function DropdownMenu({ label = 'Actions', icon, items, align = 'start' }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))

  return (
    <div className={s.menuWrap} ref={ref}>
      <Button size="sm" icon={icon} onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        {label}<Icon name="chevron-down" size={13} />
      </Button>
      {open && (
        <div className={`${s.menu} ${align === 'end' ? s.menuEnd : ''}`} role="menu">
          {items.map((it) => (
            it.divider
              ? <span key={it.key ?? 'rule'} className={s.menuRule} />
              : (
                <button
                  key={it.label}
                  type="button"
                  role="menuitem"
                  className={`${s.menuItem} ${it.tone === 'bad' ? s.menuItemBad : ''}`}
                  onClick={() => { it.onSelect?.(); setOpen(false) }}
                >
                  {it.icon && <Icon name={it.icon} size={14} />}{it.label}
                </button>
              )
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Popover ───────────────────────────────────────────────────────────────
   Content attached to a trigger, dismissed by Escape or an outside click. Not
   modal: the page behind it stays usable, which is the whole difference
   between this and a dialog. */
export function Popover({ trigger, children, align = 'start' }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))

  return (
    <div className={s.menuWrap} ref={ref}>
      <Button size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {trigger}
      </Button>
      {open && (
        <div className={`${s.popover} ${align === 'end' ? s.menuEnd : ''}`} role="dialog">
          {children}
        </div>
      )}
    </div>
  )
}

/* A tooltip names a control; it never holds anything you need. Hover and focus
   both open it, because a keyboard user gets to the control the same way and
   deserves the same label. */
export function Tooltip({ label, children, side = 'top' }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span
      className={s.tipWrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open && (
        <span role="tooltip" id={id} className={`${s.tip} ${side === 'bottom' ? s.tipBottom : ''}`}>
          {label}
        </span>
      )}
    </span>
  )
}

/* ── Lightbox ──────────────────────────────────────────────────────────────
   One image at a time, with the count, because a lightbox with no position
   makes people click through twice to find out whether they have seen it all. */
export function Lightbox({ open, onClose, items, index = 0, onIndex }) {
  const close = useCallback(() => onClose?.(), [onClose])
  const ref = useFocusTrap(open, close)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex?.(Math.min(items.length - 1, index + 1))
      if (e.key === 'ArrowLeft') onIndex?.(Math.max(0, index - 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, index, items.length, onIndex])

  if (!open) return null
  const item = items[index]

  return (
    <div className={`${s.backdrop} ${s.backdropSolid}`} onMouseDown={close}>
      <div
        ref={ref}
        className={s.lightbox}
        role="dialog"
        aria-modal="true"
        aria-label={item?.label ?? 'Image'}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.lightboxBar}>
          <span className={s.modalTitle}>{item?.label}</span>
          <span className={s.lightboxCount}>{index + 1} / {items.length}</span>
          <IconButton icon="close" label="Close" onClick={close} />
        </div>
        <div className={s.lightboxStage}>
          <IconButton icon="chevron-left" label="Previous" onClick={() => onIndex?.(Math.max(0, index - 1))} />
          <span className={s.lightboxArt} style={{ aspectRatio: item?.ratio ?? '16 / 9' }} />
          <IconButton icon="chevron-right" label="Next" onClick={() => onIndex?.(Math.min(items.length - 1, index + 1))} />
        </div>
      </div>
    </div>
  )
}

/* ── Toasts ────────────────────────────────────────────────────────────────
   A toast reports something that already happened. It never asks a question —
   anything needing an answer is a dialog, because a toast that times out
   before you read it has asked nothing. */
export function useToasts(timeout = 4000) {
  const [toasts, setToasts] = useState([])
  const next = useRef(0)

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const push = useCallback((toast) => {
    const id = ++next.current
    setToasts((t) => [...t, { ...toast, id }])
    if (timeout) setTimeout(() => dismiss(id), timeout)
    return id
  }, [dismiss, timeout])

  return { toasts, push, dismiss }
}

export function ToastStack({ toasts, onDismiss }) {
  if (!toasts?.length) return null
  return (
    <div className={s.toasts} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${s.toast} ${t.tone === 'bad' ? s.toastBad : ''}`}>
          <Icon name={t.tone === 'bad' ? 'error' : t.tone === 'good' ? 'success' : 'info'} size={14} />
          <span className={s.toastText}>{t.message}</span>
          {t.action && (
            <button type="button" className={s.toastAction} onClick={t.action.onSelect}>
              {t.action.label}
            </button>
          )}
          <IconButton icon="close" label="Dismiss" size={13} onClick={() => onDismiss?.(t.id)} />
        </div>
      ))}
    </div>
  )
}

/* ── Command palette ───────────────────────────────────────────────────────
   Filters on every keystroke and shows the count, so an empty result is a
   fact rather than a blank box. */
export function CommandPalette({ open, onClose, commands, placeholder = 'Type a command' }) {
  const [q, setQ] = useState('')
  const close = useCallback(() => onClose?.(), [onClose])
  const ref = useFocusTrap(open, close)

  useEffect(() => { if (open) setQ('') }, [open])
  if (!open) return null

  const hits = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className={`${s.backdrop} ${s.backdropTop}`} onMouseDown={close}>
      <div
        ref={ref}
        className={s.palette}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.paletteField}>
          <Icon name="search" size={14} />
          <input
            className={s.paletteInput}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            aria-label="Command"
          />
          <span className={s.paletteCount}>{hits.length}</span>
        </div>
        <div className={s.paletteList} role="listbox">
          {hits.length === 0 && <span className={s.paletteEmpty}>Nothing matches “{q}”.</span>}
          {hits.map((c) => (
            <button
              key={c.label}
              type="button"
              role="option"
              aria-selected="false"
              className={s.paletteItem}
              onClick={() => { c.onSelect?.(); close() }}
            >
              {c.icon && <Icon name={c.icon} size={14} />}
              <span className={s.paletteLabel}>{c.label}</span>
              {c.hint && <span className={s.paletteHint}>{c.hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
