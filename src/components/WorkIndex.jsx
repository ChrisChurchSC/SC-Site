import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './WorkIndex.module.css'
import { caseStudies, SHOW_COVERS } from '../data/caseStudies'
import CaseFacts from './CaseFacts'

/**
 * THE CASE STUDIES INDEX — one study given the room, the rest beside it.
 *
 * The shape of the reference: a tall featured card with the client's name over
 * the image and the line underneath it, and a grid of smaller ones to the
 * right, each captioned below its picture rather than over it.
 *
 * WHAT THE CARDS SAY IS WHAT THE REPO HOLDS. The headline is the study's own
 * `tagline` — a written line, not a summary generated from one — and the meta
 * is its `type` and `year`. The reference runs INDUSTRY / COMPANY SIZE under
 * each; this site records neither, and inventing a client's size to fill a
 * slot in a layout is the kind of detail nobody checks and everybody believes.
 *
 * NO CLIENT LOGOS. The reference locks one into the corner of every image.
 * There are no client logo files in this repo — see src/data/clientLogos.js,
 * which says so at length — so the client's name is set in type instead.
 *
 * COVERS ARE STATED IN THE DATA, not taken as "the first image in sections":
 * that would have picked three Sanity videos and, for World Within, one of the
 * thirty-eight zero-byte files in its folder.
 */
const ORDER = ['hylands', 'entropy', 'nimruz', 'world-within']

const uniq = (xs) => [...new Set(xs.filter(Boolean))].sort()

const isVideo = (src) => /\.mp4($|\?)/.test(src)

function Media({ src, className }) {
  if (!SHOW_COVERS) return <span className={`${className} ${styles.fill}`} aria-hidden="true" />
  if (isVideo(src)) {
    return (
      <video
        className={className}
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
  return <img className={className} src={src} alt="" loading="lazy" />
}

function Meta({ study }) {
  return (
    <p className={styles.meta}>
      {study.type}
      <span className={styles.metaSep}> / </span>
      {study.year}
    </p>
  )
}

const ENTRIES = ORDER.filter((slug) => caseStudies[slug]).map((slug) => ({
  slug,
  ...caseStudies[slug],
}))

/* Derived from the studies rather than listed, so a new one appears in the
   dropdown by existing. */
const TYPES = uniq(ENTRIES.map((s) => s.type))
const INDUSTRIES = uniq(ENTRIES.map((s) => s.industry))
const YEARS = uniq(ENTRIES.map((s) => s.year)).reverse()

export default function WorkIndex() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [industry, setIndustry] = useState('')
  const [year, setYear] = useState('')

  const entries = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return ENTRIES.filter((s) => {
      if (type && s.type !== type) return false
      if (industry && s.industry !== industry) return false
      if (year && s.year !== year) return false
      if (!needle) return true
      const hay = [s.name, s.tagline, s.summary, ...(s.services ?? [])].join(' ').toLowerCase()
      return hay.includes(needle)
    })
  }, [q, type, industry, year])

  const filtering = Boolean(q.trim() || type || industry || year)
  const clear = () => { setQ(''); setType(''); setIndustry(''); setYear('') }

  const [lead, ...rest] = entries

  /* Six cells sit beside the featured card; whatever the studies do not fill
     is shown as an empty slot rather than left as a hole in the grid. */
  const slots = Math.max(0, 6 - rest.length)

  return (
    <>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          aria-label="Search case studies"
        />

        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by discipline">
          <option value="">Discipline</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className={styles.select} value={industry} onChange={(e) => setIndustry(e.target.value)} aria-label="Filter by industry">
          <option value="">Industry</option>
          {INDUSTRIES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className={styles.select} value={year} onChange={(e) => setYear(e.target.value)} aria-label="Filter by year">
          <option value="">Year</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {filtering && (
        <p className={styles.count} role="status">
          <button type="button" className={styles.clear} onClick={clear}>Clear filters</button>
        </p>
      )}

      {!lead ? (
        <p className={styles.empty}>Nothing matches that. Try clearing a filter.</p>
      ) : (
    <div className={styles.layout}>
      {/* THE FEATURED ONE. Its name sits top-left and its line bottom-left,
          both over the image, which is the only card here that does that —
          the smaller ones caption underneath so the picture stays whole. */}
      <NavLink to={`/work/${lead.slug}`} className={styles.lead}>
        <Media src={lead.cover} className={styles.leadMedia} />
        <span className={styles.leadScrim} aria-hidden="true" />
        <span className={styles.leadClient}>{lead.name}</span>
        <span className={styles.leadFoot}>
          <span className={styles.leadTagline}>{lead.tagline}</span>
          <CaseFacts study={lead} className={styles.leadFacts} />
        </span>
      </NavLink>

      {rest.map((study) => (
        <NavLink key={study.slug} to={`/work/${study.slug}`} className={styles.card}>
          <span className={styles.cardMedia}>
            <Media src={study.cover} className={styles.cardImg} />
          </span>
          <span className={styles.cardClient}>{study.name}</span>
          <span className={styles.cardTagline}>{study.tagline}</span>
          <CaseFacts study={study} />
        </NavLink>
      ))}

      {Array.from({ length: slots }, (_, i) => (
        <div key={`slot-${i}`} className={styles.slot} aria-hidden="true">
          <span className={styles.slotMedia} />
          <span className={styles.slotLabel}>Case study</span>
        </div>
      ))}
    </div>
      )}
    </>
  )
}
