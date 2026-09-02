import styles from './Work.module.css'
import WorkGrid from '../components/WorkGrid'
import { useMeta } from '../hooks/useMeta'

/**
 * The case study index — cards only.
 *
 * This route used to be `<Navigate to="/" replace />`, then became a
 * typographic list of every case study (PR #122), because the only two paths
 * to the list were <button> elements that open a drawer. A button is not a
 * crawlable edge and carries no link equity, so fifty-eight case studies had
 * no hub at all.
 *
 * The list is gone again. Measured before and after, that costs exactly two
 * inbound links, and they are worth knowing about:
 *
 *   with the list     23 slugs linked, 6 indexable pages unlinked
 *   without it        21 slugs linked, 8 indexable pages unlinked
 *
 * Six of those eight were already unreachable from here either way — the
 * Google sub-pages, which are sub-projects reached through /work/google
 * rather than listed at top level.
 *
 * The two this actually orphaned are /work/big-buoy and /work/girlfight.
 * Both are written, published and indexable, and both have a card in the
 * grid — but the Sanity homepageGrid documents set `externalUrl` on blocks
 * 002 and 007, which overrides their slug, so those cards point at
 * big-buoy.com and girlfightapparel.com instead of at the case studies.
 * That is an editorial choice made in the Studio, not a bug here, which is
 * why it is not overridden in code. Clearing those two externalUrl fields
 * would restore the internal links.
 *
 * The other case studies that left the list — Arbitrum, Offchain, OpenText,
 * Ari's, Concis Labs, Yellow Dog — are all `noindex, follow` placeholders,
 * or in OpenText's case have no page built at all. Losing a link to a page
 * Google is told to skip costs nothing.
 *
 * If a placeholder is ever written up and made indexable, it needs a card in
 * the grid or a link from somewhere. The check is: does every non-noindex
 * /work/<slug> page have an inbound link.
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
      <header className={styles.header}>
        <p className={styles.label}>[ Selected Work ]</p>
        <h1 className={styles.headline}>Case studies</h1>
      </header>

      <WorkGrid />
    </main>
  )
}
