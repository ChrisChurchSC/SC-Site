import { useState } from 'react'
import s from './system.module.css'
import { Icon, Avatar, Button, Segmented } from './primitives'
import { Path } from './browser'
import { FolderPreview } from './folderPreview'

/* Projects — a piece of work the brand is being used for.
 *
 * Deliberately not another folder listing. A folder answers "what is in here";
 * a project answers "what is this for, how far along is it, and what does it
 * look like" — and the last of those is the one a brand workspace keeps
 * failing to answer, because it files everything as a filename and makes you
 * open the app that made it to see anything.
 *
 * So a project opens onto the work rendered: the canvas it is laid out on,
 * the deck it goes out as, the assets it pulls from the brand folders.
 */

export function ProjectList({ projects, filter, onFilter, counts, query, onQuery, onOpen, onNew }) {
  const shown = projects.filter((p) => (
    (filter === 'open' ? !p.closed : p.closed)
    && (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  ))

  return (
    <div className={s.projects}>
      <div className={s.projectsHead}>
        <h2 className={s.projectsTitle}>Projects</h2>
        <span className={s.projectsActions}>
          <Button size="sm" icon="link">Link a project</Button>
          <Button size="sm" variant="solid" icon="plus" onClick={onNew}>New project</Button>
        </span>
      </div>

      <label className={s.projectsSearch}>
        <Icon name="search" size={14} />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by name"
          className={s.projectsSearchField}
        />
      </label>

      <div className={s.browser}>
        <div className={s.requestBar}>
          <span className={s.requestFilters}>
            {[['open', 'Open'], ['closed', 'Closed']].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                className={`${s.requestFilter} ${filter === key ? s.requestFilterOn : ''}`}
                onClick={() => onFilter(key)}
              >
                {label} <span className={s.requestViewCount}>{counts[key]}</span>
              </button>
            ))}
          </span>
        </div>

        <div className={s.browserList} role="list">
          {shown.length === 0 && (
            <div className={s.browserEmpty}>
              <span className={s.eyebrow}>Nothing here</span>
              <span className={s.browserEmptyLine}>
                {query ? `No project matches "${query}".` : filter === 'open' ? 'No open projects.' : 'Nothing closed yet.'}
              </span>
            </div>
          )}

          {shown.map((p) => (
            <button key={p.id} type="button" role="listitem" className={s.projectRow} onClick={() => onOpen(p)}>
              <span className={s.projectMain}>
                <span className={s.projectName}>
                  {p.name}
                  <span className={s.projectBadge}>{p.visibility ?? 'Private'}</span>
                </span>
                <span className={s.requestMeta}>#{p.id} updated {p.updated} ago · {p.owner}</span>
              </span>

              {/* How far along, as a bar and a number. A project row with no
                  progress on it is a link, and a list of links is a folder. */}
              <span className={s.projectSide}>
                <span className={s.projectProgress}>
                  <span className={s.projectTrack}>
                    <span className={s.projectFill} style={{ width: `${p.done}%` }} />
                  </span>
                  <span className={s.projectPct}>{p.done}%</span>
                </span>
                <span className={s.requestAvatars}>
                  {p.team.map((n) => <Avatar key={n} name={n} size={20} />)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* The project itself: look at it, or list what is in it. Two views rather
   than one page per format. */
export function ProjectView({ project, path, onNavigate, onOpenAsset, previewHref }) {
  /* Two views, not four, and the same two a website repo gives you: the built
     thing, and the files it was built from. Preview renders what is in the
     folder; Assets lists it. */
  const views = project.preview?.length ? ['Preview', 'Assets'] : ['Assets']
  const [view, setView] = useState(views[0])

  /* A canvas block names its source but carries no copy of the map — the
     project's own canvas is filled in here, so there is one canvas per
     project rather than one in the data and another in the preview. */
  const blocks = (project.preview ?? []).map((b) => (
    b.kind === 'canvas' ? { ...b, canvas: b.canvas ?? project.canvas } : b
  )).filter((b) => b.kind !== 'canvas' || b.canvas)

  return (
    <div className={s.requestPage}>
      <Path segments={path} onNavigate={onNavigate} />

      <div className={s.requestHead}>
        <h2 className={s.requestHeadTitle}>
          {project.name} <span className={s.requestHeadId}>#{project.id}</span>
        </h2>
        <div className={s.requestHeadMeta}>
          <span className={`${s.stateBadge} ${project.closed ? s.stMuted : s.stOpen}`}>
            <Icon name={project.closed ? 'check' : 'request'} size={13} />
            {project.closed ? 'Closed' : 'Open'}
          </span>
          <span className={s.requestHeadLine}>
            <strong>{project.owner}</strong> · updated {project.updated} ago · {project.done}% done
          </span>
        </div>
        <p className={s.projectBrief}>{project.brief}</p>
      </div>

      <div className={s.projectBar}>
        {/* A one-option switch is not a choice. A project with nothing laid out
            and nothing sent out shows its assets and says nothing about it. */}
        {views.length > 1 && <Segmented value={view} onChange={setView} options={views} />}
        {views.length <= 1 && <span />}
        <span className={s.projectBarRight}>
          <span className={s.projectTeam}>
            {project.team.map((n) => <Avatar key={n} name={n} size={22} />)}
          </span>
          {/* The deploy-preview move: the built thing, its own tab, full width.
              A preview squeezed beside a sidebar is a thumbnail. */}
          {previewHref && (
            <a className={s.cvOpen} href={previewHref} target="_blank" rel="noreferrer">
              <Icon name="external" size={13} />Open
            </a>
          )}
        </span>
      </div>

      {view === 'Preview' && (
        <FolderPreview title={project.name} blocks={blocks} onOpenAsset={onOpenAsset} />
      )}

      {view === 'Assets' && (
        <div className={s.browser}>
          <div className={s.browserList} role="list">
            {project.assets.map((a) => (
              <button
                key={a.name}
                type="button"
                role="listitem"
                className={s.projectAssetRow}
                onClick={() => onOpenAsset?.(a)}
              >
                <Icon name={a.icon ?? 'file'} size={14} />
                <span className={s.fileChangeName}>{a.name}</span>
                <span className={s.fileChangeNote}>{a.from}</span>
                <span className={s.projectAssetKind}>{a.kind}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
