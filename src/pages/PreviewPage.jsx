import { useParams, Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'
import '../system/tokens.css'
import { FolderPreview, Icon } from '../system'
import PROJECTS from '../data/workspaceProjects'
import s from '../system/system.module.css'

/* The preview, its own tab, the whole window — the deploy-preview move.
 *
 * The Open button points here rather than at Breadcrumbs itself: that app
 * holds its active campaign in state and has no addressable canvas URL, so
 * there is nothing to deep-link to. A route that genuinely opens is worth more
 * than a button that lands you on somebody's dashboard.
 *
 * Internal, noindex, not in the sitemap.
 */
export default function PreviewPage() {
  const { id } = useParams()
  const project = PROJECTS.find((p) => String(p.id) === id) ?? null

  useMeta({
    title: project ? `${project.name} — preview | Super Conscious` : 'Preview | Super Conscious',
    description: 'Internal project preview.',
    path: `/dashboard/preview/${id}`,
    noindex: true,
  })

  const blocks = (project?.preview ?? []).map((b) => (
    b.kind === 'canvas' ? { ...b, canvas: b.canvas ?? project.canvas } : b
  )).filter((b) => b.kind !== 'canvas' || b.canvas)

  return (
    <div className={`sc-root ${s.cvPage}`}>
      <div className={s.cvPageBar}>
        <span className={s.cvPageName}>
          <Icon name="eye" size={14} />
          {project?.name ?? 'Preview'}
          {project && <span className={s.cvPageMeta}>#{project.id} · {project.done}% done</span>}
        </span>
        <Link className={s.cvOpen} to="/dashboard">
          <Icon name="arrow-left" size={13} />Back to workspace
        </Link>
      </div>

      <div className={s.cvPageScroll}>
        {blocks.length > 0
          ? <FolderPreview title={project.name} blocks={blocks} />
          : (
            <div className={s.browserEmpty}>
              <span className={s.eyebrow}>Nothing to preview</span>
              <span className={s.browserEmptyLine}>
                {project ? 'No asset in this project renders to a page yet.' : `No project with id ${id}.`}
              </span>
            </div>
          )}
      </div>
    </div>
  )
}
