import { useParams } from 'react-router-dom'
import { thoughts } from '../data/thoughts'
import styles from './ThoughtPost.module.css'
import { useMeta } from '../hooks/useMeta'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

const firstParagraph = (post) => post.body.find(b => b.type === 'p')?.text ?? ''

export default function ThoughtPost() {
  const { slug } = useParams()
  const post = thoughts.find(t => t.slug === slug)

  useMeta(post ? {
    title: `${post.title} | Super Conscious`,
    description: (post.excerpt ?? firstParagraph(post)).slice(0, 155),
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      datePublished: post.isoDate ?? post.date,
      author: {
        '@type': 'Organization',
        name: 'Super Conscious',
        url: 'https://super-conscious.studio',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Super Conscious',
        logo: { '@type': 'ImageObject', url: 'https://super-conscious.studio/logo.svg' },
      },
      url: `https://super-conscious.studio/thoughts/${slug}`,
      mainEntityOfPage: `https://super-conscious.studio/thoughts/${slug}`,
    },
  } : {})

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
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      </header>

      {post.hero && (
        <figure className={styles.hero}>
          <img src={assetUrl(post.hero)} alt="" />
        </figure>
      )}

      <article className={styles.body}>
        {post.body.map((item, i) => {
          if (item.type === 'p') return <p key={i} className={styles.para}>{item.text}</p>
          if (item.type === 'h2') return <h2 key={i} className={styles.h2}>{item.text}</h2>
          if (item.type === 'img') return (
            <figure key={i} className={styles.figure}>
              <img src={assetUrl(item.src)} alt={item.alt ?? ''} />
            </figure>
          )
          return null
        })}
      </article>
    </main>
  )
}
