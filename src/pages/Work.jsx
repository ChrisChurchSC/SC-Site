import { Link } from 'react-router-dom'

import styles from './Work.module.css'
import WorkGrid from '../components/WorkGrid'
import { useMeta } from '../hooks/useMeta'
import { useProjects } from '../context/ProjectsContext'
import { useComingSoon } from '../context/ComingSoonContext'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * The case study index.
 *
 * This route used to be `<Navigate to="/" replace />` — five lines that sent
 * every visitor to the homepage. It was still submitted to Google at priority
 * 0.9, still returned 200 with a self-canonical, and had zero inbound links,
 * because the only two paths to the case study list were <button> elements
 * that open a drawer. A button is not a crawlable edge and carries no link
 * equity, so fifty-eight case studies had no hub at all.
 *
 * The list here is the same one the nav drawer renders, from the same context,
 * with the same filters — top-level projects only, minus the deliberately
 * hidden ones. What differs is that these are real anchors at a real URL, so
 * a crawler can follow them and a visitor can link to the page.
 *
 * The curated grid above it is the wall that used to be the homepage, moved
 * here when the homepage grew a positioning top half. The two are not
 * redundant and the list is not decoration: the grid is a curated subset —
 * roughly forty blocks, chosen for how they look together — while the list
 * is every non-hidden case study. Replacing the list with the grid would put
 * the uncurated remainder back where they were before PR #122, with no
 * crawlable route in. If the grid ever covers all of them, revisit; until
 * then both stay.
 */
export default function Work() {
  const projects = useProjects()
  const comingSoon = useComingSoon()

  useMeta({
    title: 'Selected Work | Super Conscious',
    description:
      'Case studies from Super Conscious. Brand systems, content programs, and digital products for founders and marketing teams.',
    path: '/work',
  })

  // Sub-projects carry n >= 100 and belong to their client's overview page.
  const caseStudies = projects.all
    .filter((p) => parseInt(p.n, 10) < 100 && !HIDDEN_SLUGS.has(p.slug))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.label}>[ Selected Work ]</p>
        <h1 className={styles.headline}>Case studies</h1>
        <p className={styles.intro}>
          Brand systems, content programs, and digital products, built with founders and
          marketing teams.
        </p>
      </header>

      <section className={styles.gridSection} aria-label="Selected work, visual index">
        <WorkGrid />
      </section>

      <div className={styles.listHead}>
        <p className={styles.listLabel}>All work</p>
        <span className={styles.listRule} aria-hidden="true" />
        <p className={styles.listCount}>{String(caseStudies.length).padStart(3, '0')} case studies</p>
      </div>

      <ol className={styles.list}>
        {caseStudies.map((p) => {
          const isSoon = comingSoon.has(p.slug)
          const inner = (
            <>
              <span className={styles.num}>{p.n}</span>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.type}>
                {p.type}
                {isSoon && <span className={styles.soon}>Soon</span>}
              </span>
            </>
          )

          return (
            <li key={p.slug} className={styles.row}>
              {isSoon ? (
                // Matches the nav and the homepage grid: shown, not linked.
                // These pages are noindex, so linking them would spend equity
                // on a page that cannot rank and promise a visitor a case
                // study that is not written yet.
                <span className={`${styles.item} ${styles.itemSoon}`}>{inner}</span>
              ) : (
                <Link className={styles.item} to={`/work/${p.slug}`}>
                  {inner}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
