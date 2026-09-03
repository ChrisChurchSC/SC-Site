import { NavLink } from 'react-router-dom'
import styles from './Thoughts.module.css'
import { thoughts as staticThoughts } from '../data/thoughts'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { THOUGHTS_INDEX_QUERY } from '../lib/queries'
import { sanityImgProps } from '../lib/sanityImg'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const fromStatic = staticThoughts
  .map(t => ({
    _id: `static-${t.slug}`,
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    publishedAt: t.isoDate,
    order: parseInt(t.n, 10),
    heroUrl: t.hero ? assetUrl(t.hero) : null,
    _static: true,
  }))
  .sort((a, b) => b.order - a.order) // newest (highest order) first

export default function Thoughts() {
  useMeta({
    title: 'Studio Notes & Ideas | Super Conscious',
    description: 'Ideas, notes, and process from the Super Conscious studio. Brand strategy, creative practice, and content thinking.',
    path: '/thoughts',
  })
  const { data: sanityThoughts } = useSanity(THOUGHTS_INDEX_QUERY)
  const items = (sanityThoughts && sanityThoughts.length ? sanityThoughts : fromStatic)
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.headerLabel}>Thoughts</p>
        <h1 className={styles.headline}>Ideas, notes, and process.</h1>
      </header>

      <section className={styles.grid}>
        {items.map(({ _id, title, slug, excerpt, publishedAt, order, heroUrl }) => {
          const n = String(order ?? 0).padStart(3, '0')
          return (
            <NavLink key={_id} to={`/thoughts/${slug}`} className={styles.card}>
              <div className={styles.cardThumb}>
                {heroUrl && <img {...sanityImgProps(heroUrl, { w: 900 })} alt="" />}
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardNum}>{n}</span>
                <span className={styles.cardDate}>{fmtDate(publishedAt)}</span>
              </div>
              <h2 className={styles.cardTitle}>{title}</h2>
              {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
            </NavLink>
          )
        })}
      </section>
    </main>
  )
}
