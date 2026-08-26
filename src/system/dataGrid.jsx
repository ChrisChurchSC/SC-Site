import { Fragment, useEffect, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, Avatar } from './primitives'

/* The data grid.
 *
 * The single most behaviour-dense component in the system, and the one where
 * every shortcut shows: multi-column sort, range selection, in-cell editing,
 * undo, per-column filters, aggregation, column hiding and copy-out. It was
 * built on the styleguide and stranded there, which meant no product could
 * have any of it.
 *
 * Two decisions in here were bugs first and are worth keeping written down:
 *
 *   Editing focuses and selects from an effect, not the autoFocus attribute.
 *   autoFocus fires before React attaches onFocus, so select-on-entry never
 *   ran and typing appended to the old value instead of replacing it. Every
 *   spreadsheet selects on entry; nobody notices until it is missing.
 *
 *   Every mutation goes through one function, so undo is a fact of the data
 *   layer rather than something each handler has to remember.
 */


const AGGS = ['sum', 'avg', 'max', 'count']

/* Formatting lives with the grid rather than with the data, so a column of
   money is a money column wherever the rows came from. */
function gridFmt(v, type) {
  if (v === undefined || v === null) return ''
  if (type === 'money') return `$${v.toLocaleString()}`
  if (type === 'pct') return `${(v * 100).toFixed(1)}%`
  return String(v)
}

const colLetter = (i) => String.fromCharCode(65 + i)

export function DataGrid({ columns, rows: initialRows }) {
  /* Multi-column sort as an ordered list rather than a single key: shift-click
     appends, so "by discipline, then by fee" is expressible. The priority
     number is shown, because a sort nobody can see the order of is a sort
     nobody trusts. */
  const [sorts, setSorts] = useState([{ key: 'fee', dir: 'desc' }])
  const [sel, setSel] = useState({ r: 0, c: 0 })
  const [anchor, setAnchor] = useState({ r: 0, c: 0 })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [data, setData] = useState(initialRows)
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])
  const [picked, setPicked] = useState([])
  const [dense, setDense] = useState(false)
  const [filters, setFilters] = useState({})
  const [find, setFind] = useState('')
  const [aggs, setAggs] = useState({ fee: 'sum', share: 'sum', year: 'max' })
  const [hidden, setHidden] = useState([])
  const [copied, setCopied] = useState(false)
  const gridRef = useRef(null)
  const editRef = useRef(null)

  /* Focus and select when an edit opens, from an effect rather than
     autoFocus: the autofocus attribute fires before React attaches onFocus,
     so the handler never runs and typing appends to the old value instead of
     replacing it. Every spreadsheet selects on entry; nobody notices until
     it's missing. */
  useEffect(() => {
    if (!editing) return
    const el = editRef.current
    if (!el) return
    el.focus()
    el.select()
  }, [editing])

  const cols = columns.filter((c) => !hidden.includes(c.key))

  /* Every mutation goes through here, so undo is a fact of the data layer
     rather than something each handler has to remember. */
  const mutate = (next) => {
    setHistory((h) => [...h.slice(-24), data])
    setFuture([])
    setData(next)
  }

  const undo = () => {
    if (!history.length) return
    setFuture((f) => [data, ...f])
    setData(history[history.length - 1])
    setHistory((h) => h.slice(0, -1))
  }

  const redo = () => {
    if (!future.length) return
    setHistory((h) => [...h, data])
    setData(future[0])
    setFuture((f) => f.slice(1))
  }

  // Filter first, then sort — the order the reader assumes, and the order the
  // aggregations below depend on.
  const filtered = data.filter((row) =>
    Object.entries(filters).every(([k, q]) =>
      !q || String(row[k]).toLowerCase().includes(q.toLowerCase())))

  const rows = [...filtered].sort((a, b) => {
    for (const s of sorts) {
      const x = a[s.key], y = b[s.key]
      const cmp = typeof x === 'number' ? x - y : String(x).localeCompare(String(y))
      if (cmp !== 0) return s.dir === 'asc' ? cmp : -cmp
    }
    return 0
  })

  const toggleSort = (key, additive) =>
    setSorts((s) => {
      const at = s.findIndex((x) => x.key === key)
      if (at === -1) return additive ? [...s, { key, dir: 'desc' }] : [{ key, dir: 'desc' }]
      const flipped = { key, dir: s[at].dir === 'desc' ? 'asc' : 'desc' }
      if (!additive) return [flipped]
      const next = [...s]
      next[at] = flipped
      return next
    })

  const matchesFind = (row) =>
    find && Object.values(row).some((v) =>
      String(Array.isArray(v) ? '' : v).toLowerCase().includes(find.toLowerCase()))

  const range = {
    r0: Math.min(sel.r, anchor.r), r1: Math.max(sel.r, anchor.r),
    c0: Math.min(sel.c, anchor.c), c1: Math.max(sel.c, anchor.c),
  }
  const inRange = (r, c) => r >= range.r0 && r <= range.r1 && c >= range.c0 && c <= range.c1
  const multi = range.r0 !== range.r1 || range.c0 !== range.c1

  const move = (dr, dc, extend) => {
    const r = Math.max(0, Math.min(rows.length - 1, sel.r + dr))
    const c = Math.max(0, Math.min(cols.length - 1, sel.c + dc))
    setSel({ r, c })
    if (!extend) setAnchor({ r, c })
  }

  const commit = () => {
    const col = cols[sel.c]
    const key = rows[sel.r].client
    if (['text', 'person'].includes(col.type)) {
      mutate(data.map((row) => (row.client === key ? { ...row, [col.key]: draft } : row)))
    } else if (['num', 'money'].includes(col.type)) {
      const n = Number(draft.replace(/[^0-9.-]/g, ''))
      // Invalid input is rejected rather than silently coerced to zero —
      // a blank cell is a fact, and 0 would be a different one.
      if (!Number.isNaN(n) && draft.trim() !== '') {
        mutate(data.map((row) => (row.client === key ? { ...row, [col.key]: n } : row)))
      }
    }
    setEditing(false)
  }

  const addRow = () => mutate([...data, {
    client: `New ${data.length + 1}`, lead: 'Chris Church', disc: 'Brand',
    year: 2026, fee: 0, share: 0, status: 'Draft', trend: [0, 0, 0, 0, 0, 0],
  }])

  const deleteRows = () => {
    if (!picked.length) return
    const kill = new Set(picked.map((i) => rows[i]?.client).filter(Boolean))
    mutate(data.filter((r) => !kill.has(r.client)))
    setPicked([])
  }

  const exportCsv = () => {
    const head = cols.map((c) => c.label).join(',')
    const body = rows.map((r) => cols.map((c) =>
      c.type === 'spark' ? `"${r[c.key].join(' ')}"` : `"${gridFmt(r[c.key], c.type)}"`).join(','))
    writeToClipboard([head, ...body].join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  /* Excel's most-used feature that nobody names: the sum of whatever is
     selected, in the status bar, without touching the sheet. */
  const rangeStats = () => {
    const nums = []
    for (let r = range.r0; r <= range.r1; r++) {
      for (let c = range.c0; c <= range.c1; c++) {
        const col = cols[c]
        const v = rows[r]?.[col.key]
        if (typeof v === 'number') nums.push(v)
      }
    }
    const cells = (range.r1 - range.r0 + 1) * (range.c1 - range.c0 + 1)
    if (!nums.length) return `${cells} cells`
    const sum = nums.reduce((a, b) => a + b, 0)
    return `${cells} cells · sum ${sum.toLocaleString()} · avg ${Math.round(sum / nums.length).toLocaleString()}`
  }

  const copyRange = () => {
    const tsv = []
    for (let r = range.r0; r <= range.r1; r++) {
      const line = []
      for (let c = range.c0; c <= range.c1; c++) {
        const col = cols[c]
        line.push(col.type === 'spark' ? rows[r][col.key].join(' ') : gridFmt(rows[r][col.key], col.type))
      }
      tsv.push(line.join('\t'))
    }
    writeToClipboard(tsv.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const onKey = (e) => {
    if (editing) {
      if (e.key === 'Enter') { e.preventDefault(); commit(); move(1, 0) }
      if (e.key === 'Escape') { e.preventDefault(); setEditing(false) }
      return
    }
    const k = e.key
    if (k === 'ArrowDown') { e.preventDefault(); move(1, 0, e.shiftKey) }
    else if (k === 'ArrowUp') { e.preventDefault(); move(-1, 0, e.shiftKey) }
    else if (k === 'ArrowRight' || k === 'Tab') { e.preventDefault(); move(0, 1, e.shiftKey && k !== 'Tab') }
    else if (k === 'ArrowLeft') { e.preventDefault(); move(0, -1, e.shiftKey) }
    else if (k === 'Enter') {
      e.preventDefault()
      const col = cols[sel.c]
      if (['text', 'person', 'num', 'money'].includes(col.type)) {
        setDraft(String(rows[sel.r][col.key]))
        setEditing(true)
      }
    } else if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'c') { e.preventDefault(); copyRange() }
    else if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'z') {
      e.preventDefault()
      e.shiftKey ? redo() : undo()
    }
  }

  const aggValue = (col) => {
    const mode = aggs[col.key]
    if (!mode) return ''
    const vals = rows.map((r) => r[col.key]).filter((v) => typeof v === 'number')
    if (mode === 'count') return String(rows.length)
    if (!vals.length) return ''
    const n = mode === 'sum' ? vals.reduce((a, b) => a + b, 0)
      : mode === 'avg' ? vals.reduce((a, b) => a + b, 0) / vals.length
      : Math.max(...vals)
    return gridFmt(col.type === 'pct' ? n : Math.round(n), col.type)
  }

  const cycleAgg = (key) =>
    setAggs((a) => {
      const i = AGGS.indexOf(a[key])
      return { ...a, [key]: i === AGGS.length - 1 ? undefined : AGGS[i + 1] ?? AGGS[0] }
    })

  const maxFee = Math.max(...rows.map((r) => r.fee), 1)
  const template = `30px ${cols.map((c) => `${c.w}px`).join(' ')}`
  const curCol = cols[sel.c]
  const curVal = rows[sel.r]
    ? (curCol.type === 'spark' ? rows[sel.r][curCol.key].join(', ') : gridFmt(rows[sel.r][curCol.key], curCol.type))
    : ''

  return (
    <div className={s.gridWrap}>
      {/* Toolbar */}
      <div className={s.gridBar}>
        <span className={s.gridCount}>
          {rows.length} of {data.length} rows
          {picked.length > 0 && ` · ${picked.length} selected`}
          {multi && ` · ${(range.r1 - range.r0 + 1)}×${(range.c1 - range.c0 + 1)} range`}
        </span>
        <div className={s.gridBarRight}>
          <input
            className={s.gFindInput}
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Find…"
            aria-label="Find in grid"
          />
          <button type="button" className={s.tableToggle} onClick={undo} disabled={!history.length}>
            Undo
          </button>
          <button type="button" className={s.tableToggle} onClick={redo} disabled={!future.length}>
            Redo
          </button>
          <button type="button" className={s.tableToggle} onClick={addRow}>Add row</button>
          <button type="button" className={s.tableToggle} onClick={deleteRows} disabled={!picked.length}>
            Delete
          </button>
          <button type="button" className={s.tableToggle} onClick={exportCsv}>
            {copied ? 'Copied' : 'CSV'}
          </button>
          <button type="button" className={s.tableToggle} onClick={() => setDense((d) => !d)}>
            {dense ? 'Comfortable' : 'Compact'}
          </button>
        </div>
      </div>

      {/* Formula bar — the address and value of the current cell, always. */}
      <div className={s.formulaBar}>
        <span className={s.formulaAddr}>{colLetter(sel.c)}{sel.r + 1}</span>
        <span className={s.formulaDivider} />
        <span className={s.formulaVal}>{curVal}</span>
        <span className={s.formulaType}>{curCol.type}</span>
      </div>

      {/* Column visibility */}
      <div className={s.colToggles}>
        {columns.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={!hidden.includes(c.key)}
            className={`${s.colToggle} ${hidden.includes(c.key) ? s.colToggleOff : ''}`}
            onClick={() => setHidden((h) => (h.includes(c.key) ? h.filter((x) => x !== c.key) : [...h, c.key]))}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={s.gridScroll}>
        <div
          ref={gridRef}
          className={`${s.dgGrid} ${dense ? s.gridDense : ''}`}
          style={{ gridTemplateColumns: template }}
          role="grid"
          tabIndex={0}
          onKeyDown={onKey}
        >
          {/* Header — sticky, with a select-all in the gutter. */}
          <button
            type="button"
            className={`${s.gCell} ${s.gHead} ${s.gGutter} ${s.gFrozen}`}
            onClick={() => setPicked(picked.length === rows.length ? [] : rows.map((_, i) => i))}
            aria-label="Select all rows"
          >
            {picked.length === rows.length && rows.length > 0 ? '−' : '+'}
          </button>
          {cols.map((c, ci) => (
            <button
              key={c.key}
              type="button"
              className={[
                s.gCell, s.gHead,
                c.frozen ? s.gFrozenCol : '',
                ['num', 'money', 'pct'].includes(c.type) ? s.gNum : '',
              ].join(' ')}
              style={c.frozen ? { left: 30 } : undefined}
              onClick={(e) => toggleSort(c.key, e.shiftKey)}
              aria-sort={(() => {
                const s = sorts.find((x) => x.key === c.key)
                return s ? (s.dir === 'asc' ? 'ascending' : 'descending') : 'none'
              })()}
              title="Click to sort · Shift-click to add"
            >
              {c.label}
              {(() => {
                const at = sorts.findIndex((x) => x.key === c.key)
                if (at === -1) return <span className={s.gSort} />
                return (
                  <span className={s.gSort}>
                    {/* Priority shown only when more than one column sorts —
                        a lone "1" is noise. */}
                    {sorts.length > 1 && <span className={s.gSortRank}>{at + 1}</span>}
                    {sorts[at].dir === 'desc' ? '↓' : '↑'}
                  </span>
                )
              })()}
            </button>
          ))}

          {/* Filter row */}
          <div className={`${s.gCell} ${s.gFilterCell} ${s.gGutter} ${s.gFrozen}`}>
            <Icon name="filter" size={11} />
          </div>
          {cols.map((c) => (
            <div
              key={c.key}
              className={`${s.gCell} ${s.gFilterCell} ${c.frozen ? s.gFrozenCol : ''}`}
              style={c.frozen ? { left: 30 } : undefined}
            >
              {c.type === 'spark' ? null : (
                <input
                  className={s.gFilterInput}
                  value={filters[c.key] ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))}
                  placeholder="—"
                  aria-label={`Filter ${c.label}`}
                />
              )}
            </div>
          ))}

          {/* Body */}
          {rows.map((row, r) => (
            <Fragment key={row.client}>
              <button
                type="button"
                className={`${s.gCell} ${s.gGutter} ${s.gFrozen} ${picked.includes(r) ? s.gGutterOn : ''}`}
                onClick={() => setPicked((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]))}
                aria-label={`Select row ${r + 1}`}
              >
                {r + 1}
              </button>
              {cols.map((c, ci) => {
                const isSel = sel.r === r && sel.c === ci
                const numeric = ['num', 'money', 'pct'].includes(c.type)
                return (
                  <div
                    key={c.key}
                    role="gridcell"
                    aria-selected={isSel}
                    className={[
                      s.gCell,
                      numeric ? s.gNum : '',
                      c.frozen ? s.gFrozenCol : '',
                      isSel ? s.gSel : '',
                      !isSel && inRange(r, ci) ? s.gInRange : '',
                      picked.includes(r) ? s.gRowOn : '',
                      matchesFind(row) ? s.gFound : '',
                    ].join(' ')}
                    style={c.frozen ? { left: 30 } : undefined}
                    onMouseDown={(e) => {
                      setSel({ r, c: ci })
                      if (!e.shiftKey) setAnchor({ r, c: ci })
                      gridRef.current?.focus()
                    }}
                    onDoubleClick={() => {
                      if (['text', 'person', 'num', 'money'].includes(c.type)) {
                        setDraft(String(row[c.key])); setEditing(true)
                      }
                    }}
                  >
                    {isSel && editing ? (
                      <input
                        ref={editRef}
                        className={s.gEdit}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commit}
                        aria-label="Edit cell"
                      />
                    ) : c.type === 'status' ? (
                      <span className={`${s.gPill} ${row.status === 'Live' ? s.gPillOn : row.status === 'Draft' ? s.gPillDraft : ''}`}>
                        {row.status}
                      </span>
                    ) : c.type === 'person' ? (
                      <span className={s.gPerson}>
                        <Avatar name={row.lead} size={16} />
                        {row.lead.split(' ')[0]}
                      </span>
                    ) : c.type === 'spark' ? (
                      <svg viewBox="0 0 60 16" className={s.gSpark} aria-hidden="true">
                        <path
                          d={row.trend.map((v, i) => {
                            const mx = Math.max(...row.trend)
                            return `${i ? 'L' : 'M'}${i * 12},${14 - (v / mx) * 12}`
                          }).join(' ')}
                          fill="none"
                          stroke={row.trend[5] >= row.trend[0] ? 'var(--s1)' : 'var(--s2)'}
                          strokeWidth="1.5"
                        />
                      </svg>
                    ) : c.bar ? (
                      /* Data bar behind the figure — magnitude without a
                         separate chart, and the number stays exact. */
                      <>
                        <span className={s.gBar} style={{ width: `${(row.fee / maxFee) * 100}%` }} />
                        <span className={s.gBarVal}>{gridFmt(row.fee, c.type)}</span>
                      </>
                    ) : c.scale ? (
                      <span
                        className={s.gScale}
                        style={{ background: `var(--q${Math.min(5, Math.max(1, Math.round(row.share * 20)))})` }}
                      >
                        {gridFmt(row.share, c.type)}
                      </span>
                    ) : (
                      gridFmt(row[c.key], c.type)
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}

          {/* Aggregations — click a footer cell to cycle sum / avg / max /
              count / none. They follow the filter, not the raw data. */}
          <div className={`${s.gCell} ${s.gFoot} ${s.gGutter} ${s.gFrozen}`}>Σ</div>
          {cols.map((c) => {
            const has = ['num', 'money', 'pct'].includes(c.type)
            return (
              <button
                key={c.key}
                type="button"
                className={[
                  s.gCell, s.gFoot,
                  c.frozen ? s.gFrozenCol : '',
                  has ? s.gNum : '',
                  has ? '' : s.gFootMuted,
                ].join(' ')}
                style={c.frozen ? { left: 30 } : undefined}
                onClick={() => has && cycleAgg(c.key)}
                title={has ? 'Cycle aggregation' : undefined}
              >
                {has ? (
                  <>
                    <span className={s.gAggMode}>{aggs[c.key] ?? '—'}</span>
                    <span>{aggValue(c)}</span>
                  </>
                ) : c.frozen ? 'Total' : ''}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status bar. The left half is what is selected right now — Excel's
          most-used feature that nobody names. */}
      <div className={s.gridFoot}>
        <span className={s.gridStat}>{rangeStats()}</span>
        <span className={s.gridCell}>
          Arrows · Shift+arrows range · Enter edit · ⌘C copy · ⌘Z undo
        </span>
      </div>
    </div>
  )
}
