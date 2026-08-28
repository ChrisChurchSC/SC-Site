import styles from './TrustMosaic.module.css'
import { useSanity } from '../hooks/useSanity'
import { TESTIMONIALS_QUERY } from '../lib/queries'
import { clientLogos } from '../data/clientLogos'
import { featuredCaseStudies } from '../data/featuredCaseStudies'
import { HIDDEN_SLUGS } from '../lib/hiddenProjects'

/**
 * The trust mosaic: clients, quotes and numbers in one grid of tiles.
 *
 * Built on the reference's structure — a headline, then a dense grid mixing
 * name tiles, quote tiles and stat tiles at different widths — with this
 * site's content and this site's rules about what may be shown.
 *
 * THREE THINGS THE REFERENCE HAS THAT THIS CANNOT.
 *
 * 1. LOGOS. There are no client logo files in this repo. clientLogos says so
 *    in its own header and explains the fallback: a name set in Signifier
 *    reads as a client list, where a row of empty boxes reads as a broken
 *    page. Same fallback here. Drop SVGs into public/logos/, add `logo` to an
 *    entry, and the tile renders the mark instead with no change here.
 *
 * 2. THE COUNT. The reference opens on "more than 500,000 leading GTM teams".
 *    There is no such number here and inventing one is not available, so the
 *    headline counts the list it is standing on — derived from the data, so
 *    it cannot drift from the tiles below it.
 *
 * 3. THE NUMBERS. Every stat in featuredCaseStudies is '––' and that file
 *    says plainly not to ship invented ones. The stat tiles are built at the
 *    size a real figure would be so the gap reads as a missing number rather
 *    than as a design that never had one.
 *
 * ATTRIBUTION follows the rule TestimonialStrip already set: a bracketed
 * name renders on the dev server so the byline can be reviewed, and is
 * dropped from every build. import.meta.env.DEV is false in builds, so a
 * placeholder cannot ship as though it were a real client.
 */
const isPlaceholder = (s) => !s || /\[|\]/.test(s)

/* The three quotes, mirrored from Sanity, used when the query returns
 * nothing.
 *
 * WHY THIS EXISTS. useSanity fetches on mount and swallows a failed fetch
 * silently — data stays null and the component renders nothing. That is what
 * has been happening: the quotes are in Sanity (three clientLanding docs with
 * testimonialQuote, confirmed against the API), but the request does not
 * complete in every environment, and the section that is meant to be the
 * page's proof was rendering as an empty band. /v2's TestimonialStrip has the
 * same silent gap.
 *
 * This is the pattern the repo already uses for exactly this: projects.js is
 * a static mirror of the Sanity projects, which is why the nav's client list
 * survives when Sanity does not answer.
 *
 * The text is verbatim from Sanity. The attributions are the bracketed
 * placeholders that are actually in those documents — not invented, and
 * still dropped from every build by the isPlaceholder rule below. */
const QUOTES_FALLBACK = [
  {
    quote: "They've been our invisible production team for three years. They ship to our standards, communicate like part of the team, and never once tried to go around us to the client.",
    attribution: '[Creative Director], [Agency]',
  },
  {
    quote: 'Super Conscious built the brand, then stayed and built the product. Years in, they still feel like our team.',
    attribution: '[Founder Name], Founder, [Company]',
  },
  {
    quote: "They've become an extension of our marketing team. The content keeps shipping, the campaigns keep working, and the numbers keep moving.",
    attribution: '[Marketing Lead], [Company]',
  },
]

export default function TrustMosaic({ eyebrow = '[ Proof ]' }) {
  const { data } = useSanity(TESTIMONIALS_QUERY)

  const clients = clientLogos.filter(c => !c.slug || !HIDDEN_SLUGS.has(c.slug))
  const live = (data ?? []).filter(t => t?.quote)
  const quotes = (live.length ? live : QUOTES_FALLBACK).slice(0, 3)

  /* One stat per case study rather than three from one, so the row reads as
     three things the work moved rather than one measure repeated. */
  const stats = featuredCaseStudies
    .slice(0, 2)
    .map((cs, i) => ({ ...cs.stats[i] ?? cs.stats[0], client: cs.name }))

  /* Interleaved rather than grouped: the reference's grid works because a
     quote sits next to a name sits next to a number, and reading across it
     you get evidence of three different kinds. Grouped, it would be three
     lists stacked. */
  const tiles = []
  let qi = 0
  let si = 0
  clients.forEach((c, i) => {
    tiles.push({ kind: 'name', key: `n-${c.name}`, ...c })
    if (i % 6 === 2 && qi < quotes.length) tiles.push({ kind: 'quote', key: `q-${qi}`, ...quotes[qi++] })
    if (i % 9 === 5 && si < stats.length) tiles.push({ kind: 'stat', key: `s-${si}`, ...stats[si++] })
  })
  // Anything that did not land in the interleave still gets shown.
  while (qi < quotes.length) tiles.push({ kind: 'quote', key: `q-${qi}`, ...quotes[qi++] })
  while (si < stats.length) tiles.push({ kind: 'stat', key: `s-${si}`, ...stats[si++] })

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>
        Trusted by {clients.length} brands, and the people who run them.
      </h2>

      <div className={styles.grid}>
        {tiles.map(tile => {
          if (tile.kind === 'quote') {
            const person = tile.attribution
            return (
              <figure key={tile.key} className={`${styles.tile} ${styles.tileQuote}`}>
                <blockquote className={styles.quote}>“{tile.quote}”</blockquote>
                {isPlaceholder(person)
                  ? (import.meta.env.DEV && <figcaption className={styles.byPlaceholder}>— {person || '[ attribution needed ]'}</figcaption>)
                  : <figcaption className={styles.by}>— {person}</figcaption>}
              </figure>
            )
          }
          if (tile.kind === 'stat') {
            return (
              <div key={tile.key} className={`${styles.tile} ${styles.tileStat}`}>
                <p className={styles.statValue}>{tile.value}</p>
                <p className={styles.statLabel}>{tile.label}</p>
                <p className={styles.statClient}>{tile.client}</p>
              </div>
            )
          }
          return (
            <div key={tile.key} className={styles.tile}>
              {tile.logo
                ? <img src={tile.logo} alt={tile.name} className={styles.logo} loading="lazy" />
                : <span className={styles.name}>{tile.name}</span>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
