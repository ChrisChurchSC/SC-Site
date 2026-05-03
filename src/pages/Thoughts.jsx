import { NavLink } from 'react-router-dom'
import styles from './Thoughts.module.css'
import { thoughts } from '../data/thoughts'
import { useMeta } from '../hooks/useMeta'

export default function Thoughts() {
  useMeta({
    title: 'Thoughts — Super Conscious',
    description: 'Ideas, notes, and process from the Super Conscious studio. Brand strategy, creative practice, and content thinking.',
  })
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.headerLabel}>Thoughts</p>
        <h1 className={styles.headline}>Ideas, notes, and process.</h1>
      </header>

      <section className={styles.index}>
        {thoughts.map(({ n, title, date, slug }) => (
          <NavLink key={n} to={`/thoughts/${slug}`} className={styles.row}>
            <span className={styles.num}>{n}</span>
            <span className={styles.title}>{title}</span>
            <span className={styles.date}>{date}</span>
          </NavLink>
        ))}
      </section>
    </main>
  )
}
