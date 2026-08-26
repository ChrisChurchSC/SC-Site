import { useMemo, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, Button } from './primitives'
import { useDismiss } from './overlays'

/* Forms — the controls that collect something.
 *
 * Two rules run through all of them:
 *
 *   Validate on blur, not on every keystroke. Telling someone their email is
 *   invalid while they are still typing the domain is noise, and noise trains
 *   people to ignore the one message that mattered.
 *
 *   The role comes first, the appearance second. A checkbox that is a div is
 *   a div. Every control here carries the role its behaviour promises —
 *   checkbox, radio, listbox, combobox, slider — so assistive tech is told the
 *   same thing the eye is.
 */

/* ── Select ────────────────────────────────────────────────────────────────
   Returns a value. Its sibling, DropdownMenu, performs a verb — they look
   similar and behave differently, so they carry different roles. */
export function Select({ options, value, onChange, label, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))

  return (
    <div className={s.select} ref={ref}>
      <button
        type="button"
        className={s.selectTrigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <span className={value ? undefined : s.selectPlaceholder}>{value ?? placeholder}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13} />
      </button>
      {open && (
        <div className={s.selectMenu} role="listbox" aria-label={label}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              className={`${s.selectOption} ${o === value ? s.selectOptionOn : ''}`}
              onClick={() => { onChange?.(o); setOpen(false) }}
            >
              {o}
              {o === value && <Icon name="check" size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* Type to narrow, then pick. The difference from Select is that the list is
   too long to read, so the field is the primary way in rather than a label. */
export function Combobox({ options, value, onChange, label, placeholder = 'Search' }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const hits = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(q.toLowerCase())),
    [options, q],
  )

  return (
    <div className={s.select} ref={ref}>
      <div className={s.comboField} role="combobox" aria-expanded={open} aria-haspopup="listbox">
        <Icon name="search" size={13} />
        <input
          className={s.comboInput}
          value={open ? q : (value ?? '')}
          placeholder={placeholder}
          aria-label={label}
          onFocus={() => { setOpen(true); setQ('') }}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        />
        {value && !open && (
          <button type="button" className={s.comboClear} aria-label="Clear" onClick={() => onChange?.(null)}>
            <Icon name="close" size={12} />
          </button>
        )}
      </div>
      {open && (
        <div className={s.selectMenu} role="listbox" aria-label={label}>
          {hits.length === 0 && <span className={s.selectEmpty}>Nothing matches “{q}”.</span>}
          {hits.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              className={`${s.selectOption} ${o === value ? s.selectOptionOn : ''}`}
              onClick={() => { onChange?.(o); setOpen(false) }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Choice groups ─────────────────────────────────────────────────────────
   A 14px box at a 2px radius — small enough that 4px would read as a circle.
   The tick is a rotated border rather than a glyph, so it inherits colour and
   needs no icon font. */
export function CheckGroup({ options, value = [], onChange, label }) {
  const toggle = (v) =>
    onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  return (
    <div className={s.choiceGroup} role="group" aria-label={label}>
      {options.map((v) => (
        <button
          key={v}
          type="button"
          role="checkbox"
          aria-checked={value.includes(v)}
          className={s.choiceRow}
          onClick={() => toggle(v)}
        >
          <span className={`${s.check} ${value.includes(v) ? s.checkOn : ''}`}>
            {value.includes(v) && <i />}
          </span>
          <span className={s.choiceLabel}>{v}</span>
        </button>
      ))}
    </div>
  )
}

export function RadioGroup({ options, value, onChange, label }) {
  return (
    <div className={s.choiceGroup} role="radiogroup" aria-label={label}>
      {options.map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          className={s.choiceRow}
          onClick={() => onChange?.(v)}
        >
          <span className={`${s.radio} ${value === v ? s.radioOn : ''}`}>
            {value === v && <i />}
          </span>
          <span className={s.choiceLabel}>{v}</span>
        </button>
      ))}
    </div>
  )
}

/* ── Validated field ───────────────────────────────────────────────────────
   Validates on blur. The message replaces the hint rather than appearing
   beside it, so the field never grows and shove the form down as you type. */
export function ValidatedField({ label, value, onChange, validate, hint, error, type = 'text' }) {
  const [touched, setTouched] = useState(false)
  const invalid = touched && validate ? !validate(value) : false

  return (
    <div className={s.vField}>
      <span className={s.vLabel}>{label}</span>
      <input
        type={type}
        className={`${s.input} ${invalid ? s.invalid : ''}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={invalid || undefined}
        aria-label={label}
      />
      <span className={invalid ? s.vError : s.vHint}>{invalid ? error : hint}</span>
    </div>
  )
}

/* ── Search ────────────────────────────────────────────────────────────────
   type="search" so the browser offers its own clear affordance, plus one of
   ours that appears only when there is something to clear. */
export function SearchField({ value, onChange, placeholder = 'Search', label = 'Search', count }) {
  return (
    <label className={s.searchField}>
      <Icon name="search" size={14} />
      <input
        type="search"
        className={s.searchInput}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {count !== undefined && value && <span className={s.searchCount}>{count}</span>}
      {value && (
        <button type="button" className={s.comboClear} aria-label="Clear search" onClick={() => onChange?.('')}>
          <Icon name="close" size={12} />
        </button>
      )}
    </label>
  )
}

/* ── Tags ──────────────────────────────────────────────────────────────────
   Enter commits, Backspace on an empty field removes the last one. Both are
   what people already try; neither is discoverable, which is why the hint
   says so. */
export function TagInput({ tags = [], onChange, placeholder = 'Add a label', label = 'Labels' }) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const v = draft.trim()
    if (!v || tags.includes(v)) { setDraft(''); return }
    onChange?.([...tags, v])
    setDraft('')
  }

  return (
    <div className={s.tagField}>
      <div className={s.tagRow} role="group" aria-label={label}>
        {tags.map((t) => (
          <span key={t} className={s.tag}>
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange?.(tags.filter((x) => x !== t))}>
              <Icon name="close" size={10} />
            </button>
          </span>
        ))}
        <input
          className={s.tagInput}
          value={draft}
          placeholder={tags.length ? '' : placeholder}
          aria-label={label}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            if (e.key === 'Backspace' && !draft && tags.length) onChange?.(tags.slice(0, -1))
          }}
          onBlur={commit}
        />
      </div>
      <span className={s.vHint}>Enter to add · Backspace to remove the last</span>
    </div>
  )
}

/* ── Slider ────────────────────────────────────────────────────────────────
   A native range input, restyled. Rebuilding one from divs loses keyboard
   support, the value announcement and the step behaviour, and gains nothing
   a track and a thumb cannot do. */
export function SliderControl({ value, onChange, min = 0, max = 100, step = 1, label, format }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={s.slider}>
      <span className={s.sliderHead}>
        <span className={s.vLabel}>{label}</span>
        <span className={s.sliderValue}>{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        className={s.range}
        style={{ '--pct': `${pct}%` }}
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
    </div>
  )
}

/* ── Date picker ───────────────────────────────────────────────────────────
   A month grid, because a text field asking for a date gets a different format
   from every visitor. Weeks start Monday, and today is marked whether or not
   it is selected. */
export function DatePicker({ value, onChange, month = 'August 2026', days = 31, startOn = 5, today = 26, label = 'Date' }) {
  const cells = [...Array(startOn).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <div className={s.cal} role="group" aria-label={label}>
      <div className={s.calHead}>
        <span className={s.calMonth}>{month}</span>
      </div>
      <div className={s.calGrid}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className={s.calDay} aria-hidden="true">{d}</span>
        ))}
        {cells.map((d, i) => (
          d === null
            ? <span key={`x${i}`} />
            : (
              <button
                key={d}
                type="button"
                aria-pressed={value === d}
                aria-label={`${d} ${month}`}
                className={`${s.calCell} ${value === d ? s.calOn : ''} ${today === d ? s.calToday : ''}`}
                onClick={() => onChange?.(d)}
              >
                {d}
              </button>
            )
        ))}
      </div>
    </div>
  )
}

/* ── File upload ───────────────────────────────────────────────────────────
   Drop target and a button, because drag-and-drop alone is unusable by
   keyboard and invisible on touch. */
export function FileUpload({ files = [], onChange, accept, hint = 'PNG, SVG or FIG up to 20MB' }) {
  const [over, setOver] = useState(false)
  const input = useRef(null)

  const add = (list) => onChange?.([...files, ...[...list].map((f) => ({ name: f.name, size: f.size }))])

  return (
    <div className={s.upload}>
      <div
        className={`${s.dropZone} ${over ? s.dropOver : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files) }}
      >
        <Icon name="upload" size={18} />
        <span className={s.dropText}>Drop files here</span>
        <span className={s.vHint}>{hint}</span>
        <Button size="sm" icon="plus" onClick={() => input.current?.click()}>Choose files</Button>
        <input
          ref={input}
          type="file"
          multiple
          accept={accept}
          className={s.fileInput}
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className={s.fileList}>
          {files.map((f) => (
            <li key={f.name} className={s.fileRow}>
              <Icon name="file" size={13} />
              <span className={s.fileName}>{f.name}</span>
              <span className={s.vHint}>{f.size ? `${Math.round(f.size / 1024)} KB` : ''}</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => onChange?.(files.filter((x) => x !== f))}>
                <Icon name="close" size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── Filter and sort ───────────────────────────────────────────────────────
   Filters state what they are doing and offer one way out. A filter you cannot
   see is a filter that makes the product look broken. */
export function FilterBar({ filters, value = {}, onChange, onClear, count }) {
  const active = Object.entries(value).filter(([, v]) => v)
  return (
    <div className={s.filterBar}>
      <span className={s.filterSet}>
        {filters.map((f) => (
          <Select
            key={f.key}
            label={f.label}
            options={f.options}
            value={value[f.key]}
            placeholder={f.label}
            onChange={(v) => onChange?.({ ...value, [f.key]: v === value[f.key] ? null : v })}
          />
        ))}
      </span>
      <span className={s.filterState}>
        {count !== undefined && <span className={s.vHint}>{count} shown</span>}
        {active.length > 0 && (
          <button type="button" className={s.filterClear} onClick={onClear}>
            <Icon name="close" size={12} />Clear {active.length}
          </button>
        )}
      </span>
    </div>
  )
}

/* Direction is part of the choice, so it is one control rather than a menu
   and a separate arrow toggle nobody associates with it. */
export function SortControl({ options, value, direction = 'desc', onChange, label = 'Sort' }) {
  return (
    <span className={s.sortWrap}>
      <Select options={options} value={value} onChange={(v) => onChange?.(v, direction)} label={label} />
      <button
        type="button"
        className={s.sortDir}
        aria-label={direction === 'desc' ? 'Sort ascending' : 'Sort descending'}
        onClick={() => onChange?.(value, direction === 'desc' ? 'asc' : 'desc')}
      >
        <Icon name={direction === 'desc' ? 'arrow-down' : 'arrow-up'} size={13} />
      </button>
    </span>
  )
}
