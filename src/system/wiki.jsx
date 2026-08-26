import s from './system.module.css'
import { Icon, Button, Avatar } from './primitives'

/* Wiki — the part of a brand system that is prose rather than an asset.
 *
 * It exists because half of what a brand needs written down does not fit in a
 * file: why the palette stops at three chart colours, what to do when a
 * channel wants something the system has no answer for, who decides. Those
 * live in a document or they live in someone's head, and the second one leaves
 * when they do.
 *
 * A page list beside the page rather than above it: you arrive at a wiki
 * looking for one page you half-remember the name of, and a list you can scan
 * without leaving what you are reading is the whole trick.
 */
export function Wiki({ pages, current, onSelect, onEdit }) {
  const page = pages.find((p) => p.slug === current) ?? pages[0]

  return (
    <div className={s.wiki}>
      <aside className={s.wikiRail}>
        <h3 className={s.railTitle}>Pages {pages.length}</h3>
        <nav className={s.wikiNav} aria-label="Wiki pages">
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              aria-current={p.slug === page.slug ? 'page' : undefined}
              className={`${s.wikiLink} ${p.slug === page.slug ? s.wikiLinkOn : ''}`}
              onClick={() => onSelect(p.slug)}
            >
              <Icon name="file" size={12} />{p.title}
            </button>
          ))}
        </nav>
      </aside>

      <article className={s.wikiPage}>
        <header className={s.wikiHead}>
          <h2 className={s.wikiTitle}>{page.title}</h2>
          <div className={s.wikiMeta}>
            <span className={s.wikiBy}>
              <Avatar name={page.by} size={20} />
              {page.by} edited this {page.when} ago
            </span>
            <Button size="sm" icon="type" onClick={() => onEdit?.(page)}>Edit</Button>
          </div>
        </header>

        <div className={s.wikiBody}>
          {page.body.map((b, i) => {
            if (b.h) return <h3 key={i} className={s.wikiH}>{b.h}</h3>
            if (b.list) {
              return (
                <ul key={i} className={s.wikiList}>
                  {b.list.map((l) => <li key={l} className={s.wikiItem}>{l}</li>)}
                </ul>
              )
            }
            /* A rule you must not break is set apart from the prose explaining
               it — otherwise it gets skimmed along with everything else. */
            if (b.rule) {
              return (
                <p key={i} className={s.wikiRule}>
                  <Icon name="warning" size={13} />{b.rule}
                </p>
              )
            }
            if (b.code) return <pre key={i} className={s.wikiCode}><code>{b.code}</code></pre>
            return <p key={i} className={s.wikiP}>{b.p}</p>
          })}
        </div>

        {page.related?.length > 0 && (
          <footer className={s.wikiFoot}>
            <span className={s.eyebrow}>Related</span>
            <span className={s.wikiRelated}>
              {page.related.map((r) => (
                <button key={r} type="button" className={s.wikiLink} onClick={() => onSelect(r)}>
                  <Icon name="link" size={12} />{pages.find((p) => p.slug === r)?.title ?? r}
                </button>
              ))}
            </span>
          </footer>
        )}
      </article>
    </div>
  )
}
