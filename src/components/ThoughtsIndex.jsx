import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

/* THE WORK GRID'S OWN STYLESHEET. The thoughts index is the case-studies
   index with the featured card taken out, so it should be the same cards and
   the same grid rather than a second set that drifts. Importing another
   component's module is the move V3Nav makes with HomeV3.module.css. */
import styles from './WorkIndex.module.css'
import own from './ThoughtsIndex.module.css'
import { thoughts as staticThoughts } from '../data/thoughts'
import { useSanity } from '../hooks/useSanity'
import { THOUGHTS_INDEX_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const assetUrl = (url) => (url?.startsWith('/') ? `${base}${url}` : url)

const fmtDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const yearOf = (iso) => (iso ? String(new Date(iso).getUTCFullYear()) : '')

/* The static set, in the same shape the Sanity query returns, so one map
   below renders either. Unchanged from the page that used to hold it. */
const fromStatic = staticThoughts
  .map((t) => ({
    _id: `static-${t.slug}`,
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    publishedAt: t.isoDate,
    order: parseInt(t.n, 10),
    heroUrl: t.hero ? assetUrl(t.hero) : null,
    topics: t.topics ?? [],
  }))
  .sort((a, b) => b.order - a.order)

/**
 * THE THOUGHTS INDEX — the work grid, minus the featured card.
 *
 * NO FEATURED ONE, which is the whole difference. On /work the lead card
 * earns its two columns by being a written case study with a cover; there is
 * no equivalent here — a thought is not more of a thought for being recent —
 * so every post gets the same cell and the grid starts at the top left.
 *
 * FOUR CONTROLS, EACH OFF REAL DATA. Search reads the title and the excerpt.
 * Year comes off publishedAt, which every post has. Topic comes off the
 * topics in thoughts.js — see the note at the top of that file, because those
 * are unsigned-off and Sanity has no field for them, so this select hides
 * itself when nothing carries one rather than sitting there empty. Sort is
 * the one control that is not a filter; with four posts, being able to read
 * from the beginning is worth more than another way to narrow.
 *
 * WHAT IS NOT HERE is a discipline or industry select. The work grid has
 * both because a project has both; a thought has neither, and a filter that
 * can only offer one option is furniture.
 *
 * NO ROW CAP AND NO "SHOW MORE". The work grid caps at four rows because it
 * has thirty-eight entries; there are a handful of these, and hiding a row of
 * a short list is a control that does nothing.
 */
export default function ThoughtsIndex() {
  const [q, setQ] = useState('')
  const [year, setYear] = useState('')
  const [topic, setTopic] = useState('')
  const [sort, setSort] = useState('newest')

  const { data: sanityThoughts } = useSanity(THOUGHTS_INDEX_QUERY)
  const items = sanityThoughts && sanityThoughts.length ? sanityThoughts : fromStatic

  const years = useMemo(
    () => [...new Set(items.map((t) => yearOf(t.publishedAt)).filter(Boolean))].sort().reverse(),
    [items]
  )

  const topics = useMemo(
    () => [...new Set(items.flatMap((t) => t.topics ?? []))].sort(),
    [items]
  )

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const kept = items.filter((t) => {
      if (year && yearOf(t.publishedAt) !== year) return false
      if (topic && !(t.topics ?? []).includes(topic)) return false
      if (!needle) return true
      return [t.title, t.excerpt, ...(t.topics ?? [])].filter(Boolean).join(' ').toLowerCase().includes(needle)
    })

    /* Copied before sorting: items is either the Sanity result or the module
       constant, and sorting either in place would reorder it for every later
       render. */
    return [...kept].sort((a, b) => {
      const d = new Date(a.publishedAt) - new Date(b.publishedAt)
      return sort === 'oldest' ? d : -d
    })
  }, [items, q, year, topic, sort])

  const filtering = Boolean(q.trim() || year || topic)

  return (
    <div className={`${styles.wrap} ${own.wrap}`}>
      <div className={`${styles.controls} ${own.controls}`}>
        <input
          className={`${styles.search} ${own.search}`}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          aria-label="Search thoughts"
        />

        {topics.length > 0 && (
          <select
            className={styles.select}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Filter by topic"
          >
            <option value="">Topic</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}

        <select
          className={styles.select}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="Filter by year"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Not a filter, so it is not in the Clear. It has a default rather
            than an empty option: a list is always in some order. */}
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort order"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {filtering && (
        <p className={styles.count} role="status">
          <button
            type="button"
            className={styles.clear}
            onClick={() => { setQ(''); setYear(''); setTopic('') }}
          >
            Clear filters
          </button>
        </p>
      )}

      {shown.length === 0 ? (
        <p className={styles.empty}>Nothing matches that. Try clearing a filter.</p>
      ) : (
        <div className={styles.layout}>
          {shown.map(({ _id, title, slug, excerpt, publishedAt, heroUrl }) => (
            <NavLink key={_id ?? slug} to={`/thoughts/${slug}`} className={styles.card}>
              <span className={styles.cardMedia}>
                {heroUrl ? (
                  <img className={styles.cardImg} src={sanityImg(heroUrl, { w: 900 })} alt="" loading="lazy" />
                ) : (
                  /* THE SAME PLACEHOLDER THE WORK CARDS USE when there is no
                     artwork: the excerpt fills the box rather than leaving a
                     grid of empty stripes that says nothing about the post. */
                  <span className={styles.ph}>
                    {excerpt && <span className={styles.phLine}>{excerpt}</span>}
                  </span>
                )}
              </span>
              <span className={styles.cardClient}>{title}</span>
              <p className={styles.meta}>{fmtDate(publishedAt)}</p>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
