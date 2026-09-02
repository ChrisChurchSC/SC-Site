import { Link, useParams } from 'react-router-dom'
import { useCalDrawer } from '../context/CalDrawerContext'
import { thoughts as staticThoughts } from '../data/thoughts'
import styles from './ThoughtPost.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { THOUGHT_QUERY } from '../lib/queries'
import { sanityImgProps } from '../lib/sanityImg'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const assetUrl = (url) => url?.startsWith('/') ? `${base}${url}` : url

// Sanity image URLs encode dimensions as `-<w>x<h>.<ext>`; use them to tell a
// landscape (16:9 desktop) asset from a portrait (4:5 mobile) one. Returns null
// for URLs without dimensions (e.g. static assets), meaning "show everywhere".
const imgOrient = (url) => {
  const m = /-(\d+)x(\d+)\.[a-z]+/i.exec(url || '')
  if (!m) return null
  return Number(m[2]) > Number(m[1]) ? 'portrait' : 'landscape'
}

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

/**
 * Restore image alt text from src/data/thoughts.js onto the Sanity body.
 *
 * Every imageBlock in Sanity has alt: "" — an empty string, not null, so no
 * `??` fallback anywhere reaches it — while the static file carries a written
 * description for each. The two cannot be matched by src (local path vs CDN
 * URL), so this pairs them by position.
 *
 * Guarded on the counts being equal, because they are not always: three posts
 * line up, and rethinking-the-workweek has two static images against four in
 * Sanity. Pairing those by index would attach the wrong description to the
 * wrong picture, which is worse than none, so that post keeps its empty alts.
 */
function mergeBodyAlts(sanityBody, staticBody) {
  if (!Array.isArray(sanityBody) || !Array.isArray(staticBody)) return sanityBody
  const fromStatic = staticBody.filter((b) => b._type === 'imageBlock')
  const inSanity = sanityBody.filter((b) => b._type === 'imageBlock')
  if (!fromStatic.length || fromStatic.length !== inSanity.length) return sanityBody

  let i = -1
  return sanityBody.map((b) => {
    if (b._type !== 'imageBlock') return b
    i += 1
    return b.alt ? b : { ...b, alt: fromStatic[i]?.alt || '' }
  })
}

export default function ThoughtPost() {
  const { slug } = useParams()
  const { open: openCalDrawer } = useCalDrawer()
  const { data: sanityPost } = useSanity(THOUGHT_QUERY, { slug })
  const staticPost = staticThoughts.find(t => t.slug === slug)
  // Field-level fallback, not object-level. `sanityPost ?? static` let the
  // Sanity document win wholesale, and THOUGHT_QUERY does not project
  // relatedLinks — the field is not in the thought schema at all. So the
  // eight /lp links authored in src/data/thoughts.js were dead on every post:
  // the guard below them was always false. Same shape as the headline defect
  // on /about, and the same fix.
  const fallback = staticPost ? fromStaticThought(staticPost) : null
  const post = sanityPost
    ? {
        ...sanityPost,
        relatedLinks: sanityPost.relatedLinks?.length ? sanityPost.relatedLinks : (fallback?.relatedLinks ?? []),
        // heroAlt is null on all four Sanity documents while src/data/thoughts.js
        // carries a properly written description for each, so the hero shipped
        // alt="" on every post. Same defect as relatedLinks above.
        heroAlt: sanityPost.heroAlt || fallback?.heroAlt || '',
        body: mergeBodyAlts(sanityPost.body, fallback?.body),
      }
    : fallback

  useMeta(post ? {
    title: `${post.title} | Super Conscious`,
    description: (post.excerpt || firstParagraph(post)).slice(0, 155),
    path: `/thoughts/${slug}`,
  } : {})

  if (!post) return (
    <main className={styles.main}>
      <p className={styles.notFound}>Post not found.</p>
    </main>
  )

  const n = String(post.order ?? 0).padStart(3, '0')

  // Body illustrations ship as a 16:9 (desktop) and 4:5 (mobile) pair; show only
  // the orientation that matches the breakpoint so neither duplicates. A portrait
  // image appearing before the first inline landscape is a stray duplicate of the
  // hero — drop it entirely.
  const bodyBlocks = []
  let seenLandscape = false
  for (const item of post.body || []) {
    if (item._type !== 'imageBlock') { bodyBlocks.push({ item }); continue }
    const orient = imgOrient(item.imageUrl)
    if (orient === 'landscape') { seenLandscape = true; bodyBlocks.push({ item, imgClass: styles.desktopImg }); continue }
    if (orient === 'portrait') {
      if (!seenLandscape) continue // stray hero duplicate
      bodyBlocks.push({ item, imgClass: styles.mobileImg }); continue
    }
    bodyBlocks.push({ item }) // unknown ratio → show on all breakpoints
  }

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
          <img {...sanityImgProps(post.heroUrl, { w: 1800, priority: true })} alt={post.heroAlt || ''} />
        </figure>
      )}

      <article className={styles.body}>
        {bodyBlocks.map(({ item, imgClass }, i) => {
          if (item._type === 'paragraphBlock') return <p key={i} className={styles.para}>{item.text}</p>
          if (item._type === 'headingBlock') return <h2 key={i} className={styles.h2}>{item.text}</h2>
          if (item._type === 'imageBlock') return (
            <figure key={i} className={imgClass ? `${styles.figure} ${imgClass}` : styles.figure}>
              <img {...sanityImgProps(item.imageUrl, { w: 1400 })} alt={item.alt ?? ''} />
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
                  <Link to={link.href} className={styles.relatedLink}>{link.text} →</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className={styles.postCta}>
          <button
            type="button"
            className={styles.postCtaBtn}
            onClick={() => {
              window.gtag?.('event', 'cta_click', { cta_location: 'thought_post' })
              openCalDrawer()
            }}
          >
            Book a discovery call →
          </button>
        </div>
      </article>
    </main>
  )
}
