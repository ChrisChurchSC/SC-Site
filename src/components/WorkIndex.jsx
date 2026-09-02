import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './WorkIndex.module.css'
import { caseStudies, SHOW_COVERS } from '../data/caseStudies'
import { projects } from '../data/projects'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'
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

/* The grid's shape, so the padding is arithmetic rather than a number that
   has to be remembered when either changes. */
const COLUMNS = 5
/* Four rows: sixteen cells beside the featured card, all of them filled from
   the thirty-seven entries. It was two rows when there were only the four
   written studies to draw on, six once the roster came in, and four now —
   enough to read as a body of work without the page becoming the index. */
const ROWS_CLOSED = 4
const ROWS_OPEN = 7
const LEAD_SPAN = 2

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

/* THE TAG ON EVERY CARD IS BUILD OR GROW — the two services — and nothing
   else. The data carries an engagement type (Brand, Content, Campaign,
   Product, Brand + Content), which is what the cards used to show and what
   the Discipline filter still reads; this folds each type into the service
   it belongs to. Brand and Product are the building half; Content and
   Campaign are the growing half; Brand + Content began as a build and is
   filed as one. A type this table has never seen falls to Grow if it
   mentions content, campaign or marketing and to Build otherwise, so a new
   Sanity type cannot put a third word on the cards. */
const SERVICE_OF = {
  Brand: 'Build',
  Product: 'Build',
  'Brand + Content': 'Build',
  Content: 'Grow',
  Campaign: 'Grow',
}
export const serviceOf = (type) =>
  SERVICE_OF[type] ?? (/content|campaign|marketing|media|growth/i.test(type ?? '') ? 'Grow' : 'Build')

function Meta({ study }) {
  return (
    <p className={styles.meta}>
      {serviceOf(study.type)}
      {study.year && <><span className={styles.metaSep}> / </span>{study.year}</>}
    </p>
  )
}

const STUDIES = ORDER.filter((slug) => caseStudies[slug]).map((slug) => ({
  slug,
  ...caseStudies[slug],
}))

/* THE REST OF THE ROSTER, so the grid is rows of work rather than rows of
   empty slots.
 *
 * There are four written case studies and thirty-eight clients. The grid held
 * six cells beside the featured card, so two thirds of it was placeholder —
 * and the See all button opened it to sixteen, revealing ten more.
 *
 * These are the clients themselves out of projects.js: real names, the real
 * type of engagement, and a slug that already resolves at /work/:slug. What
 * they do NOT have is a cover image, a year, a tagline or an outcome, because
 * nobody has written them up — so their cards carry a name and a type and say
 * nothing else. That is the honest difference between a client and a case
 * study, and it is visible on the page rather than papered over.
 *
 * WHAT IS EXCLUDED, and why it matters: HIDDEN_SLUGS are studies somebody
 * deliberately took down, and a password on a project means it is not public.
 * Both are filtered here. Putting either in front of a visitor would be the
 * exact mistake hiddenProjects.js was written to stop. */
const WRITTEN = new Set(STUDIES.map((s) => s.slug))

const ROSTER = projects
  .filter((p) => p.slug && !p.password && !HIDDEN_SLUGS.has(p.slug) && !WRITTEN.has(p.slug))
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    type: p.type,
    tagline: p.descriptor ?? null,
    summary: p.relationship ?? null,
    services: p.work ?? [],
    roster: true,
  }))

const ENTRIES = [...STUDIES, ...ROSTER]

/* Derived from the studies rather than listed, so a new one appears in the
   dropdown by existing. */
const TYPES = uniq(ENTRIES.map((s) => s.type)).filter(Boolean)
const INDUSTRIES = uniq(ENTRIES.map((s) => s.industry)).filter(Boolean)
const YEARS = uniq(ENTRIES.map((s) => s.year)).filter(Boolean).reverse()

/* `controls`: the search field and the three filters above the grid. On by
   default, which is what /work wants; the homepage turns them off — the grid
   there is a shop window rather than a catalog, and a search box between
   the hero and the first card is a form on a page that has been stripped
   of forms. The state hooks still run with controls off; they just never
   change. */
export default function WorkIndex({ controls = true }) {
  const [open, setOpen] = useState(false)
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

  /* The cells beside the featured card: four rows of five, less the two
     columns and two rows the featured one occupies. Whatever the studies do
     not fill shows as an empty slot rather than a hole in the grid. */
  const rows = open ? ROWS_OPEN : ROWS_CLOSED
  const cells = COLUMNS * rows - LEAD_SPAN * LEAD_SPAN
  const shown = rest.slice(0, cells)
  const slots = Math.max(0, cells - shown.length)
  /* Nothing left to open once every row is on screen. */
  const more = !open && COLUMNS * ROWS_OPEN - LEAD_SPAN * LEAD_SPAN > cells

  return (
    <div className={styles.wrap}>
      {controls && (
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
      )}

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
      {/* The cell owns the two rows; the card sticks INSIDE it. That is what
          bounds the pin — sticky travels only as far as its containing block,
          so the card releases at the end of row two instead of riding the
          whole grid. */}
      <div className={styles.leadCell}>
      <NavLink to={`/work/${lead.slug}`} className={styles.lead}>
        <Media src={lead.cover} className={styles.leadMedia} />
        <span className={styles.leadScrim} aria-hidden="true" />
        <span className={styles.leadClient}>{lead.name}</span>
        <span className={styles.leadFoot}>
          <span className={styles.leadTagline}>{lead.tagline}</span>
          <CaseFacts study={lead} className={styles.leadFacts} />
        </span>
      </NavLink>
      </div>

      {shown.map((study) => (
        <NavLink key={study.slug} to={`/work/${study.slug}`} className={styles.card}>
          <span className={styles.cardMedia}>
            <Media src={study.cover} className={styles.cardImg} />
            {/* THE PLACEHOLDER SAYS WHAT THE WORK WAS. Covers are off
                (SHOW_COVERS), so every one of these boxes is empty stripes —
                a grid of them told a reader nothing about thirty-six clients.
                The descriptor and the disciplines are what the repo holds for
                each, so they fill the box until there is artwork.

                EVERY CARD, not just the roster. Gating this on a missing
                cover meant the four written studies kept empty boxes while
                the clients nobody has written up carried content — the
                inverse of the truth. With covers off, nothing has a picture,
                so nothing goes without the caption.

                When covers come on this layer goes: it is what a thumbnail
                looks like when there is no thumbnail. */}
            {(!SHOW_COVERS || !study.cover) && (
              <span className={styles.ph}>
                {/* No tagline on the small cards (cut 2026-09-02): the placeholder
                    carried the study's one-line description under the tag,
                    and twelve of them read as a wall of captions. The name
                    under the card and the Build/Grow tag are what a grid cell
                    needs; the description is on the study's own page. */}
                {/* ONE TAG: THE SERVICE. It was the first three of the study's
                    services ("Brand Identity", "Design System", ...), which
                    read as a list of deliverables under a card. The site
                    sells two things, so the card says which one this was —
                    see serviceOf above. */}
                <span className={styles.phTags}>
                  <span className={styles.phTag}>{serviceOf(study.type)}</span>
                </span>
              </span>
            )}
          </span>
          <span className={styles.cardClient}>{study.name}</span>
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

      {/* The See all case studies button is cut. It opened the grid from two
          rows to four — and there are four studies in caseStudies.js, so
          what it revealed was ten empty slots. The open state and ROWS_OPEN
          are still here; it can come back when there is more to reveal. */}
    </div>
  )
}
