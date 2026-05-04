import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { projects as staticProjects } from '../data/projects'
import { useMeta } from '../hooks/useMeta'
import styles from './ClientOverview.module.css'

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ClientOverview() {
  const { slug } = useParams()
  const project = staticProjects.find(p => p.slug === slug)

  useMeta({
    title: project ? `${project.name} — Super Conscious` : 'Work — Super Conscious',
    description: `${project?.name} — ${project?.type}`,
  })

  if (!project) return (
    <main className={styles.main}><p className={styles.notFound}>Client not found.</p></main>
  )

  const workItems = (project.work ?? []).map((name, i) => ({
    name,
    slug: slugify(name),
    n: String(i + 1).padStart(2, '0'),
  }))

  return (
    <main className={styles.main}>

      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.metaNum}>{project.n}</span>
          <span className={styles.metaType}>{project.type}</span>
        </div>
        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.count}>{workItems.length} projects</p>
      </header>

      <div className={styles.grid}>
        {workItems.map((item) => (
          <NavLink
            key={item.slug}
            to={`/work/${slug}/${item.slug}`}
            className={styles.card}
          >
            <span className={styles.cardNum}>{item.n}</span>
            <span className={styles.cardName}>{item.name}</span>
            <span className={styles.cardArrow}>→</span>
          </NavLink>
        ))}
      </div>

    </main>
  )
}
