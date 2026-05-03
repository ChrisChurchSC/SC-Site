import { useParams } from 'react-router-dom'
import { thoughts } from '../data/thoughts'
import styles from './ThoughtPost.module.css'

export default function ThoughtPost() {
  const { slug } = useParams()
  const post = thoughts.find(t => t.slug === slug)

  if (!post) return (
    <main className={styles.main}>
      <p className={styles.notFound}>Post not found.</p>
    </main>
  )

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.num}>{post.n}</span>
          <span className={styles.date}>{post.date}</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
      </header>

      <article className={styles.body}>
        {post.body.map((para, i) => (
          <p key={i} className={styles.para}>{para}</p>
        ))}
      </article>
    </main>
  )
}
