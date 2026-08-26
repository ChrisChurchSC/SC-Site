import s from './system.module.css'
import { Icon, Avatar } from './primitives'

/* Activity — what happened, newest first.
 *
 * Grouped by day, because "2h" and "5d" in the same flat column make you do
 * the arithmetic yourself to find the boundary between this morning and last
 * week. The day header does it once.
 *
 * Every row answers who, what, and where. The last one is the part activity
 * feeds usually drop: "Dana published logo-lockup.fig" is half a sentence if
 * you have five folders and the same filename could be in any of them.
 */

const KIND = {
  published: { icon: 'success', tone: 'good', verb: 'published' },
  updated: { icon: 'refresh', tone: 'muted', verb: 'updated' },
  review: { icon: 'request', tone: 'open', verb: 'moved to review' },
  created: { icon: 'plus', tone: 'muted', verb: 'created' },
  drafted: { icon: 'file', tone: 'muted', verb: 'drafted' },
  commented: { icon: 'comment', tone: 'muted', verb: 'commented on' },
}

const TONE = { good: s.stGood, open: s.stOpen, bad: s.stBad, muted: s.stMuted }

export const ACTIVITY_FILTERS = [
  { key: 'all', label: 'Everything' },
  { key: 'published', label: 'Published' },
  { key: 'review', label: 'In review' },
  { key: 'edits', label: 'Edits' },
]

const inFilter = (e, f) => (
  f === 'all'
  || (f === 'edits' ? ['updated', 'created', 'drafted'].includes(e.kind) : e.kind === f)
)

export function ActivityFeed({ entries, filter = 'all', onFilter, onOpen }) {
  const shown = entries.filter((e) => inFilter(e, filter))

  /* Grouped in render order rather than sorted into a map, so the feed keeps
     the order it was given and a day cannot appear twice. */
  const groups = []
  for (const e of shown) {
    const last = groups[groups.length - 1]
    if (last && last.day === e.day) last.rows.push(e)
    else groups.push({ day: e.day, rows: [e] })
  }

  return (
    <div className={s.browser}>
      <div className={s.requestBar}>
        <span className={s.requestFilters}>
          {ACTIVITY_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              className={`${s.requestFilter} ${filter === f.key ? s.requestFilterOn : ''}`}
              onClick={() => onFilter?.(f.key)}
            >
              {f.label}
              <span className={s.requestViewCount}>
                {entries.filter((e) => inFilter(e, f.key)).length}
              </span>
            </button>
          ))}
        </span>
      </div>

      {shown.length === 0 && (
        <div className={s.browserEmpty}>
          <span className={s.eyebrow}>Nothing here</span>
          <span className={s.browserEmptyLine}>No activity of that kind yet.</span>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.day} className={s.actGroup}>
          <h3 className={s.actDay}>
            {g.day}
            <span className={s.actDayCount}>{g.rows.length}</span>
          </h3>

          {/* A rule behind the marks, so a day reads as one run of events
              rather than a stack of unrelated rows. */}
          <div className={s.actRows}>
            {g.rows.map((e, i) => {
              const k = KIND[e.kind] ?? KIND.updated
              return (
                <button
                  key={i}
                  type="button"
                  className={s.actRow}
                  onClick={() => onOpen?.(e)}
                >
                  <span className={s.actMark}>
                    <Avatar name={e.who} size={24} />
                    <span className={`${s.actKind} ${TONE[k.tone]}`}>
                      <Icon name={k.icon} size={10} />
                    </span>
                  </span>

                  <span className={s.actText}>
                    <span className={s.actLine}>
                      <strong>{e.who}</strong> {k.verb} <em>{e.what}</em>
                    </span>
                    <span className={s.actWhere}>
                      <Icon name="folder" size={11} />{e.where}
                      {e.note && <span className={s.actNote}>· {e.note}</span>}
                    </span>
                  </span>

                  <span className={s.actWhen}>{e.when}</span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
