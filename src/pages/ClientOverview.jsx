import { NavLink, useParams } from 'react-router-dom'
import { useProjects } from '../context/ProjectsContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { CLIENT_OVERVIEW_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'
import { useToast, Toast } from '../components/Toast'
import styles from './ClientOverview.module.css'

export default function ClientOverview() {
  const { slug } = useParams()
  const projects = useProjects()
  const project = projects.bySlug(slug)
  const { data: sanity } = useSanity(CLIENT_OVERVIEW_QUERY, { slug })
  const { toast, showToast } = useToast()

  useMeta({
    title: project ? `${project.name} | Super Conscious` : 'Work | Super Conscious',
    description: sanity?.tagline ?? `${project?.name}, ${project?.type}`,
    path: `/work/${slug}`,
  })

  if (!project) return (
    <main className={styles.main}><p className={styles.notFound}>Client not found.</p></main>
  )

  // Sanity sub-projects (with thumbnail and comingSoon) keyed by full slug
  const sanitySubs = {}
  sanity?.subProjects?.forEach(sp => { sanitySubs[sp.slug] = sp })

  // Use ProjectsContext sub-projects as the source of truth for the list +
  // names (Sanity-backed when available, static fallback when not).
  const workItems = (project.subProjects ?? []).map((sp, i) => {
    const sanitySub = sanitySubs[sp.slug]
    return {
      name: sp.name,
      slug: sp.slug.replace(`${slug}-`, ''),
      n: String(i + 1).padStart(2, '0'),
      thumbnail: sanitySub?.thumbnail ?? null,
      thumbnailVideo: sanitySub?.thumbnailVideo ?? null,
      comingSoon: sanitySub?.comingSoon ?? false,
    }
  })

  const tagline = sanity?.tagline ?? null

  return (
    <main className={styles.main}>

      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.metaNum}>{project.n}</span>
          <span className={styles.metaType}>{project.type}</span>
          <span className={styles.metaYear}>{project.year}</span>
        </div>
        <h1 className={styles.title}>{project.name}</h1>
        {(sanity?.descriptor ?? project.descriptor) && <p className={styles.descriptor}>{sanity?.descriptor ?? project.descriptor}</p>}
        {tagline && <p className={styles.tagline}>{tagline}</p>}
      </header>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>{workItems.length} Projects</span>
        <div className={styles.grid}>
          {workItems.map((item) => {
            const cardClass = `${styles.card}${item.comingSoon ? ' ' + styles.cardComingSoon : ''}`
            const inner = <>
              {item.thumbnailVideo ? (
                <LazyVideo src={item.thumbnailVideo} className={styles.cardThumb} />
              ) : item.thumbnail ? (
                <img src={sanityImg(item.thumbnail, { w: 900 })} alt={`${item.name} thumbnail`} loading="lazy" className={styles.cardThumb} />
              ) : null}
              <span className={styles.cardNum}>{item.n}</span>
              <p className={styles.cardName}>{item.name}</p>
              {item.comingSoon
                ? <span className={styles.cardComingSoonBadge}>Coming Soon</span>
                : <span className={styles.cardArrow}>→</span>}
              <div className={styles.cardOverlay} />
            </>
            return item.comingSoon ? (
              <div
                key={item.slug}
                className={cardClass}
                onClick={() => showToast(`${item.name} — coming soon`)}
              >{inner}</div>
            ) : (
              <NavLink key={item.slug} to={`/work/${slug}/${item.slug}`} className={cardClass}>{inner}</NavLink>
            )
          })}
        </div>
      </div>

      <Toast toast={toast} />

    </main>
  )
}
