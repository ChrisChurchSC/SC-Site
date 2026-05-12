import { NavLink } from 'react-router-dom'
import styles from './Thoughts.module.css'
import { thoughts } from '../data/thoughts'
import { useMeta } from '../hooks/useMeta'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

export default function Thoughts() {
  useMeta({
    title: 'Thoughts | Super Conscious',
    description: 'Ideas, notes, and process from the Super Conscious studio. Brand strategy, creative practice, and content thinking.',
  })
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.headerLabel}>Thoughts</p>
        <h1 className={styles.headline}>Ideas, notes, and process.</h1>
      </header>

      <section className={styles.grid}>
        {thoughts.map(({ n, title, date, slug, hero, excerpt }) => (
          <NavLink key={n} to={`/thoughts/${slug}`} className={styles.card}>
            <div className={styles.cardThumb}>
              {hero && <img src={assetUrl(hero)} alt="" />}
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.cardNum}>{n}</span>
              <span className={styles.cardDate}>{date}</span>
            </div>
            <h2 className={styles.cardTitle}>{title}</h2>
            {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
          </NavLink>
        ))}
      </section>
    </main>
  )
}
