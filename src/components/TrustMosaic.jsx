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

/* THE COMPOSITION IS FIXED, NOT COMPUTED.
 *
 * The first version interleaved tiles on a modulo and gave every one the same
 * footprint, which produced a neat grid — and a neat grid is the one thing
 * the reference is not. What makes that wall read is irregularity: a wide
 * quote beside a tall number beside two small marks, packed dense so the eye
 * has no row to follow.
 *
 * You cannot get that from a rule that treats every tile the same, so the
 * layout is a written composition. Each entry says what it is and how much
 * room it takes; the clients fill in around them in order.
 *
 * Spans are in a 104px row unit — see the stylesheet. */
const COMPOSITION = [
  /* Quotes get three columns, not two. At two they were ~195px wide and the
     text overran the tile and was cut by its overflow — a clipped quote is
     worse than no quote, because it looks like the page broke rather than
     like an excerpt. Wide and short is also what the reference does with
     them: the eye reads a quote across, not down. */
  { at: 3, kind: 'quote', q: 0, w: 3, h: 2 },
  { at: 7, kind: 'stat', s: 0, w: 1, h: 2 },
  { at: 11, kind: 'feature', q: 1, s: 1, w: 2, h: 2 },
  { at: 15, kind: 'quote', q: 2, w: 3, h: 2 },
  { at: 19, kind: 'stat', s: 2, w: 1, h: 1 },
]

export default function TrustMosaic({ eyebrow = '[ Proof ]' }) {
  const { data } = useSanity(TESTIMONIALS_QUERY)

  const clients = clientLogos.filter(c => !c.slug || !HIDDEN_SLUGS.has(c.slug))
  const live = (data ?? []).filter(t => t?.quote)
  const quotes = (live.length ? live : QUOTES_FALLBACK).slice(0, 3)

  /* One measure per case study rather than three off one, so the numbers read
     as three things the work moved. */
  const stats = featuredCaseStudies
    .slice(0, 3)
    .map((cs, i) => ({ ...(cs.stats[i] ?? cs.stats[0]), client: cs.name }))

  const tiles = []
  clients.forEach((c, i) => {
    COMPOSITION.filter(t => t.at === i).forEach(t => tiles.push(t))
    tiles.push({ kind: 'name', ...c, w: 1, h: 1 })
  })

  const span = ({ w = 1, h = 1 }) => ({ gridColumn: `span ${w}`, gridRow: `span ${h}` })

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>
        Trusted by {clients.length} brands, and the people who run them.
      </h2>

      <div className={styles.panel}>
        <div className={styles.grid}>
          {tiles.map((tile, i) => {
            const key = `${tile.kind}-${tile.name ?? i}-${i}`

            if (tile.kind === 'quote') {
              const { quote, attribution } = quotes[tile.q] ?? {}
              if (!quote) return null
              return (
                <figure key={key} className={`${styles.tile} ${styles.tileQuote}`} style={span(tile)}>
                  <blockquote className={styles.quote}>“{quote}”</blockquote>
                  {isPlaceholder(attribution)
                    ? (import.meta.env.DEV && <figcaption className={styles.byPlaceholder}>— {attribution}</figcaption>)
                    : <figcaption className={styles.by}>— {attribution}</figcaption>}
                </figure>
              )
            }

            if (tile.kind === 'stat') {
              const st = stats[tile.s]
              if (!st) return null
              return (
                <div key={key} className={`${styles.tile} ${styles.tileStat}`} style={span(tile)}>
                  <p className={styles.statValue}>{st.value}</p>
                  <p className={styles.statLabel}>{st.label}</p>
                  <p className={styles.statClient}>{st.client}</p>
                </div>
              )
            }

            /* The reference's big block: a client, a number and a quote in one
               tile. It is the only tile that carries all three, which is what
               makes it the one the eye lands on. */
            if (tile.kind === 'feature') {
              const { quote, attribution } = quotes[tile.q] ?? {}
              const st = stats[tile.s]
              if (!quote || !st) return null
              return (
                <div key={key} className={`${styles.tile} ${styles.tileFeature}`} style={span(tile)}>
                  <p className={styles.featureClient}>{st.client}</p>
                  <p className={styles.featureValue}>{st.value}</p>
                  <p className={styles.featureLabel}>{st.label}</p>
                  <p className={styles.featureQuote}>“{quote}”</p>
                  {isPlaceholder(attribution) && import.meta.env.DEV && (
                    <p className={styles.byPlaceholder}>— {attribution}</p>
                  )}
                </div>
              )
            }

            return (
              <div key={key} className={styles.tile} style={span(tile)}>
                {tile.logo
                  ? <img src={tile.logo} alt={tile.name} className={styles.logo} loading="lazy" />
                  : <span className={styles.name}>{tile.name}</span>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
