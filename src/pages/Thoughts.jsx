import styles from './Thoughts.module.css'
import { thoughts } from '../data/thoughts'

export default function Thoughts() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.headerLabel}>Thoughts</p>
        <h1 className={styles.headline}>Ideas, notes, and process.</h1>
      </header>

      <section className={styles.index}>
        {thoughts.map(({ n, title, date }) => (
          <div key={n} className={styles.row}>
            <span className={styles.num}>{n}</span>
            <span className={styles.title}>{title}</span>
            <span className={styles.date}>{date}</span>
          </div>
        ))}
      </section>
    </main>
  )
}
