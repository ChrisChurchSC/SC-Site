import styles from './Thoughts.module.css'

export default function Thoughts() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p className={styles.label}>Thoughts</p>
        <h1 className={styles.title}>Ideas, notes, and process.</h1>
      </div>
      <div className={styles.empty}>
        <p className={styles.emptyText}>Coming soon.</p>
      </div>
    </main>
  )
}
