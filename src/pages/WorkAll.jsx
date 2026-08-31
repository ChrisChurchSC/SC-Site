import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './WorkAll.module.css'
import { caseStudies } from '../data/caseStudies'
import { useMeta } from '../hooks/useMeta'

/**
 * /work/all — every case study, filterable.
 *
 * The reference's shape: a title, a row of controls, and a grid of cards
 * captioned underneath. Its cards are 4:5, which is what Chris asked for and
 * what the index beside it already uses.
 *
 * THE FILTERS ARE THE FIELDS THAT EXIST. The reference offers company size,
 * industry and product used. This repo records a study's `type` and its
 * `year`, so those are the two dropdowns, and the search reads the name, the
 * line and the services. A "Company size" control with nothing behind it
 * would either do nothing or invite somebody to fill the data in by guessing.
 *
 * The options are derived from the studies rather than listed here, so a new
 * one appears in the dropdown by existing.
 *
 * NO CLIENT LOGOS: there are no logo files in this repo. The reference floats
 * one on each pale card; the client's name is set in type instead.
 */
const ORDER = ['hylands', 'entropy', 'nimruz', 'world-within']

const ALL = ORDER.filter((slug) => caseStudies[slug]).map((slug) => ({
  slug,
  ...caseStudies[slug],
}))

const uniq = (xs) => [...new Set(xs)].sort()
const TYPES = uniq(ALL.map((s) => s.type))
const YEARS = uniq(ALL.map((s) => s.year)).reverse()

const isVideo = (src) => /\.mp4($|\?)/.test(src)

function Media({ src }) {
  if (isVideo(src)) {
    return (
      <video
        className={styles.img}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden="true"
      />
    )
  }
  return <img className={styles.img} src={src} alt="" loading="lazy" />
}

export default function WorkAll() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')

  useMeta({
    title: 'All case studies | Super Conscious',
    description: 'Every Super Conscious case study, by discipline and year.',
    path: '/work/all',
  })

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return ALL.filter((s) => {
      if (type && s.type !== type) return false
      if (year && s.year !== year) return false
      if (!needle) return true
      const hay = [s.name, s.tagline, s.summary, ...(s.services ?? [])].join(' ').toLowerCase()
      return hay.includes(needle)
    })
  }, [q, type, year])

  const filtered = Boolean(q.trim() || type || year)

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>[ Selected Work ]</p>
        <h1 className={styles.headline}>All case studies</h1>
      </header>

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          aria-label="Search case studies"
        />

        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by discipline"
        >
          <option value="">Discipline</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          className={styles.select}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="Filter by year"
        >
          <option value="">Year</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Says what is on screen out of what there is, so a filter that hides
          most of the work does not read as most of the work not existing. */}
      <p className={styles.count} role="status">
        {shown.length} of {ALL.length}
        {filtered && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => { setQ(''); setType(''); setYear('') }}
          >
            Clear
          </button>
        )}
      </p>

      {shown.length === 0 ? (
        <p className={styles.empty}>Nothing matches that. Try clearing a filter.</p>
      ) : (
        <div className={styles.grid}>
          {shown.map((s) => (
            <NavLink key={s.slug} to={`/work/${s.slug}`} className={styles.card}>
              <span className={styles.media}>
                <Media src={s.cover} />
              </span>
              <span className={styles.client}>{s.name}</span>
              <span className={styles.tagline}>{s.tagline}</span>
              <span className={styles.meta}>
                {s.type}<span className={styles.sep}> / </span>{s.year}
              </span>
            </NavLink>
          ))}
        </div>
      )}
    </main>
  )
}
