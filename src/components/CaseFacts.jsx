import styles from './CaseFacts.module.css'

/**
 * WHAT A CASE STUDY CARD SAYS ABOUT THE WORK — one component, so the index
 * and /work/all cannot describe the same study two ways.
 *
 * Four things, and only two of them are written down anywhere:
 *
 * BUILT and GREW ARE DERIVED, not retyped. `built` is the study's services,
 * and `grew` is true when the work carried on past the build — Content or
 * Campaign in its `type`, which is the same split the services pages draw:
 * Build makes the thing, Grow takes it to market and keeps it going. Deriving
 * it means a study cannot say "grew" here and "Brand" everywhere else.
 *
 * INDUSTRY is written in caseStudies.js and is a characterisation of the work
 * rather than a looked-up fact about the client.
 *
 * SIZE IS NOT IN THIS REPO. A client's headcount or revenue band is a fact
 * about somebody else's company, and there is nowhere in here it could be
 * read from. It shows the placeholder this site uses everywhere a figure has
 * no source, which is the honest state and also the one that gets noticed and
 * filled in.
 */
const GROWN = /Content|Campaign/

export const grewIt = (study) => GROWN.test(study.type ?? '')

/* The build half of the work, in the study's own words. Three is what fits a
   card; the study page lists them all. */
const builtFrom = (study) => (study.services ?? []).slice(0, 3).join(', ')

export default function CaseFacts({ study, className = '' }) {
  const built = builtFrom(study)
  const grew = grewIt(study)

  return (
    <dl className={`${styles.facts} ${className}`}>
      <div className={styles.row}>
        <dt className={styles.key}>Built</dt>
        <dd className={styles.value}>{built || '––'}</dd>
      </div>

      <div className={styles.row}>
        <dt className={styles.key}>Grew</dt>
        <dd className={`${styles.value} ${grew ? styles.yes : styles.no}`}>
          {grew ? 'Yes' : 'No'}
        </dd>
      </div>

      <div className={styles.row}>
        <dt className={styles.key}>Industry</dt>
        <dd className={styles.value}>{study.industry ?? '––'}</dd>
      </div>

      <div className={styles.row}>
        <dt className={styles.key}>Size</dt>
        {/* No source for this anywhere in the repo — the placeholder is the
            honest answer, and the one somebody notices. */}
        <dd className={`${styles.value} ${study.size ? '' : styles.blank}`}>
          {study.size ?? '––'}
        </dd>
      </div>
    </dl>
  )
}
