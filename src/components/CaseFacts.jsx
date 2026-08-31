import styles from './CaseFacts.module.css'

/**
 * WHAT A CASE STUDY CARD SAYS ABOUT THE CLIENT — industry and size, on one
 * line, which is the reference's own format.
 *
 * One component, so the index and /work/all cannot describe the same study
 * two ways.
 *
 * INDUSTRY is written in caseStudies.js, read off each study's own summary in
 * that file. It is a characterisation of the work rather than a looked-up
 * fact about the client.
 *
 * SIZE IS NOT IN THIS REPO. A client's headcount or revenue band is a fact
 * about somebody else's company and there is nowhere in here it could be read
 * from. It shows the placeholder this site uses everywhere a figure has no
 * source — the honest state, and the one somebody notices and fills in.
 */
export default function CaseFacts({ study, className = '' }) {
  return (
    <p className={`${styles.facts} ${className}`}>
      {study.industry ?? '––'}
      <span className={styles.sep}> / </span>
      <span className={study.size ? '' : styles.blank}>{study.size ?? '––'}</span>
    </p>
  )
}
