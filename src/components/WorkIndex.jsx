import { NavLink } from 'react-router-dom'

import styles from './WorkIndex.module.css'
import { caseStudies } from '../data/caseStudies'

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

const isVideo = (src) => /\.mp4($|\?)/.test(src)

function Media({ src, className }) {
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

export default function WorkIndex() {
  const entries = ORDER.filter((slug) => caseStudies[slug]).map((slug) => ({
    slug,
    ...caseStudies[slug],
  }))

  const [lead, ...rest] = entries
  if (!lead) return null

  return (
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
          <Meta study={lead} />
        </span>
      </NavLink>

      <div className={styles.grid}>
        {rest.map((study) => (
          <NavLink key={study.slug} to={`/work/${study.slug}`} className={styles.card}>
            <span className={styles.cardMedia}>
              <Media src={study.cover} className={styles.cardImg} />
            </span>
            <span className={styles.cardClient}>{study.name}</span>
            <span className={styles.cardTagline}>{study.tagline}</span>
            <Meta study={study} />
          </NavLink>
        ))}
      </div>
    </div>
  )
}
