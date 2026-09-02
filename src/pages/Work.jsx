import styles from './Work.module.css'
import WorkIndex from '../components/WorkIndex'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import { useMeta } from '../hooks/useMeta'

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
 * A text list of every case study sat under the grid for exactly that reason:
 * the grid was a curated subset, so the list was the crawlable route to the
 * remainder. It has been removed, and the note it carried set the condition
 * for removing it — that the grid covers them all.
 *
 * Checked rather than assumed, against live Sanity: the list linked 36 case
 * studies and the grid links 44, but count is not coverage. Three were in the
 * list and not the grid — aris, yellow-dog, concis-labs — and all three are
 * noindexed coming-soon placeholders. They are already absent from the
 * sitemap and cannot rank, so the route the list gave them was not worth
 * anything to lose.
 *
 * If any of those three ships as a real case study, it needs a grid block or
 * another crawlable link before it goes indexable.
 */
export default function Work() {
  useMeta({
    title: 'Selected Work | Super Conscious',
    description:
      'Case studies from Super Conscious. Brand systems, content programs, and digital products for founders and marketing teams.',
    path: '/work',
  })

  return (
    <main className={styles.main}>
      <V3Nav />

      <header className={styles.header}>
        <p className={styles.label}>[ Selected Work ]</p>
        <h1 className={styles.headline}>Case studies</h1>
      </header>

      <section className={styles.gridSection} aria-label="Selected work">
        <WorkIndex />
      </section>

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
    </main>
  )
}
