import { NavLink, useParams } from 'react-router-dom'
import { projects as staticProjects } from '../data/projects'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { CLIENT_OVERVIEW_QUERY } from '../lib/queries'
import styles from './ClientOverview.module.css'

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ClientOverview() {
  const { slug } = useParams()
  const project = staticProjects.find(p => p.slug === slug)
  const { data: sanity } = useSanity(CLIENT_OVERVIEW_QUERY, { slug })

  useMeta({
    title: project ? `${project.name} — Super Conscious` : 'Work — Super Conscious',
    description: sanity?.tagline ?? `${project?.name} — ${project?.type}`,
  })

  if (!project) return (
    <main className={styles.main}><p className={styles.notFound}>Client not found.</p></main>
  )

  const subProjects = {}
  sanity?.subProjects?.forEach(sp => { subProjects[sp.slug] = sp })

  const workItems = (project.work ?? []).map((name, i) => {
    const workSlug = slugify(name)
    const fullSlug = `${slug}-${workSlug}`
    return {
      name,
      slug: workSlug,
      n: String(i + 1).padStart(2, '0'),
      thumbnail: subProjects[fullSlug]?.thumbnail ?? null,
    }
  })

  const tagline = sanity?.tagline ?? null
  const relationshipCopy = sanity?.relationship ?? sanity?.summary ?? project?.relationship ?? null

  return (
    <main className={styles.main}>

      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.metaNum}>{project.n}</span>
          <span className={styles.metaType}>{project.type}</span>
          <span className={styles.metaYear}>{project.year}</span>
        </div>
        <h1 className={styles.title}>{project.name}</h1>
        {project.descriptor && <p className={styles.descriptor}>{project.descriptor}</p>}
        {tagline && <p className={styles.tagline}>{tagline}</p>}
      </header>

      {relationshipCopy && (
        <div className={styles.relationship}>
          <span className={styles.relationshipLabel}>Our Work Together</span>
          <p className={styles.relationshipBody}>{relationshipCopy}</p>
        </div>
      )}

      <div className={styles.section}>
        <span className={styles.sectionLabel}>{workItems.length} Projects</span>
        <div className={styles.grid}>
          {workItems.map((item) => (
            <NavLink
              key={item.slug}
              to={`/work/${slug}/${item.slug}`}
              className={styles.card}
            >
              {item.thumbnail && (
                <img src={item.thumbnail} alt="" className={styles.cardThumb} />
              )}
              <span className={styles.cardNum}>{item.n}</span>
              <p className={styles.cardName}>{item.name}</p>
              <span className={styles.cardArrow}>→</span>
              <div className={styles.cardOverlay} />
            </NavLink>
          ))}
        </div>
      </div>

    </main>
  )
}
