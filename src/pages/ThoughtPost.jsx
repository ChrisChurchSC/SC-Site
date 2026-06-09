import { useParams } from 'react-router-dom'
import { thoughts as staticThoughts } from '../data/thoughts'
import styles from './ThoughtPost.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { THOUGHT_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const firstParagraph = (post) => {
  for (const b of post.body || []) {
    if (b._type === 'paragraphBlock' || b.type === 'p') return b.text
  }
  return ''
}

// Map static thought to the shape returned by THOUGHT_QUERY so the renderer
// can be uniform regardless of source.
function fromStaticThought(t) {
  return {
    _id: `static-${t.slug}`,
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    publishedAt: t.isoDate,
    order: parseInt(t.n, 10),
    heroUrl: t.hero ? assetUrl(t.hero) : null,
    heroAlt: t.heroAlt || '',
    relatedLinks: t.relatedLinks || [],
    body: t.body.map(b => {
      if (b.type === 'p') return { _type: 'paragraphBlock', text: b.text }
      if (b.type === 'h2') return { _type: 'headingBlock', text: b.text }
      if (b.type === 'img') return { _type: 'imageBlock', imageUrl: assetUrl(b.src), alt: b.alt }
      return b
    }),
  }
}

export default function ThoughtPost() {
  const { slug } = useParams()
  const { data: sanityPost } = useSanity(THOUGHT_QUERY, { slug })
  const staticPost = staticThoughts.find(t => t.slug === slug)
  const post = sanityPost ?? (staticPost ? fromStaticThought(staticPost) : null)

  useMeta(post ? {
    title: `${post.title} | Super Conscious`,
    description: (post.excerpt || firstParagraph(post)).slice(0, 155),
    path: `/thoughts/${slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      datePublished: post.publishedAt,
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

  const n = String(post.order ?? 0).padStart(3, '0')

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.num}>{n}</span>
          <span className={styles.date}>{fmtDate(post.publishedAt)}</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      </header>

      {post.heroUrl && (
        <figure className={styles.hero}>
          <img src={sanityImg(post.heroUrl, { w: 1800 })} alt={post.heroAlt || ''} />
        </figure>
      )}

      <article className={styles.body}>
        {(post.body || []).map((item, i) => {
          if (item._type === 'paragraphBlock') return <p key={i} className={styles.para}>{item.text}</p>
          if (item._type === 'headingBlock') return <h2 key={i} className={styles.h2}>{item.text}</h2>
          if (item._type === 'imageBlock') return (
            <figure key={i} className={styles.figure}>
              <img src={sanityImg(item.imageUrl, { w: 1400 })} alt={item.alt ?? ''} loading="lazy" />
            </figure>
          )
          return null
        })}

        {post.relatedLinks?.length > 0 && (
          <nav className={styles.related}>
            <span className={styles.relatedLabel}>Related</span>
            <ul className={styles.relatedList}>
              {post.relatedLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className={styles.relatedLink}>{link.text} →</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className={styles.postCta}>
          <button
            type="button"
            className={styles.postCtaBtn}
            data-cal-namespace="discovery-call"
            data-cal-link="super-conscious/discovery-call"
            data-cal-origin="https://app.cal.com"
            data-cal-config='{"layout":"month_view"}'
            onClick={() => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'discovery_call_click' }); }}
          >
            Book a discovery call →
          </button>
        </div>
      </article>
    </main>
  )
}
