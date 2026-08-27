/**
 * Post-build: inject per-page meta tags into HTML files so crawlers
 * see the correct title, description, and canonical for every sitemap page.
 *
 * Covers:
 *  - /lp/[slug]  — AEO landing pages (canonical, FAQ+HowTo+Breadcrumb JSON-LD)
 *  - /work/[slug] — case studies (canonical, title, description)
 *  - /thoughts/[slug] — thought posts (canonical, Article JSON-LD)
 *  - static pages: /about, /careers, /work, /thoughts, /contact
 *  - / — homepage
 *  - dist/llms.txt — regenerated with AEO question/answer section appended
 */

import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const distDir = path.join(ROOT, 'dist')
const indexPath = path.join(distDir, 'index.html')

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found — run vite build first')
  process.exit(1)
}

const { MOCK_PAGES } = await import(path.join(ROOT, 'src/lib/mockLandingPages.js'))
const { thoughts } = await import(path.join(ROOT, 'src/data/thoughts.js'))
const { injectMeta } = await import(path.join(ROOT, 'scripts/lib/inject-meta.mjs'))
const { injectSchemas } = await import(path.join(ROOT, 'scripts/lib/inject-schemas.mjs'))
const { HIDDEN_SLUGS } = await import(path.join(ROOT, 'src/lib/hiddenProjects.js'))
const { LP_CATEGORIES, LP_CATEGORY } = await import(path.join(ROOT, 'src/lib/lpCategories.js'))
const { ABOUT_PAGE_QUERY, CLIENT_OVERVIEW_QUERY } = await import(path.join(ROOT, 'src/lib/queries.js'))
const { sanityKey } = await import(path.join(ROOT, 'src/lib/sanityCache.js'))

const BASE_URL = 'https://super-conscious.studio'
const DEFAULT_IMAGE = `${BASE_URL}/reel-preview.gif`

// The Organization node lives in index.html so every page carries it. Everything
// else refers to it by @id rather than restating it.
//
// Note for anyone tempted to wrap these in an @graph: tests/baseline/capture.mjs
// reads only the TOP-LEVEL @type of each block, so an @graph wrapper reads as no
// types at all and would strip "Organization" from all 95 baseline routes at
// once. Separate top-level nodes, joined by @id, say the same thing and stay
// visible to the gate.
const ORG_ID = `${BASE_URL}/#organization`
const ORG_REF = { '@id': ORG_ID }

const crumbs = (...trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ...trail.map((t, i) => ({ '@type': 'ListItem', position: i + 2, name: t.name, item: t.item })),
  ],
})
const indexHtml = fs.readFileSync(indexPath, 'utf8')


function writeHtml(segments, html) {
  const dir = path.join(distDir, ...segments)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

// ── SSR: render real page content into #root so crawlers (incl. non-JS AI bots)
// get the full page, not an empty shell. Pages with a sync static fallback
// (LandingPage→MOCK_PAGES, ThoughtPost→staticThoughts) render fully; Sanity-only
// pages render their shell (Phase 2b adds build-time data). A render failure
// degrades gracefully to an empty #root (meta still injected) so one bad route
// can't fail the build.
let renderRoute = null
try {
  ({ renderRoute } = await import(path.join(ROOT, '.ssr/entry-server.js')))
  console.log('SSR renderer loaded — injecting prerendered content + build-time Sanity data into #root')
} catch (e) {
  console.warn('SSR renderer unavailable — shipping empty #root (meta only):', e.message)
}

// Escape < so the JSON can't break out of the <script> tag.
//
// Keys are sorted so the same content always serializes to the same bytes.
// They are GROQ query strings, inserted in whatever order the queries resolved
// during the two-pass render, which is a race — so /about and /careers came
// out byte-different on every build despite identical data. Two consecutive
// builds of the same commit differed by 31,698 characters at an identical
// length of 70,800.
//
// That cost more than tidiness. snapshot-dist.mjs compares built output to
// prove a change is inert, and those two pages reported a diff no matter what
// you did, so the one tool that can catch a rendering regression before deploy
// was blind on the site's two most important static pages. It also busted
// their cache on every deploy for no reason.
//
// Only the top level needs sorting; that is where the query keys live. Passing
// an array replacer to JSON.stringify would apply to nested objects too and
// silently drop their keys.
const sortTopLevel = (o) =>
  Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]))

const serializeData = (data) => JSON.stringify(sortTopLevel(data || {})).replace(/</g, '\\u003c')

// Returns the data alongside the html: the two-pass render has already fetched
// everything the route needs, so page schema can be built from it rather than
// re-querying Sanity. `data` is keyed by sanityKey(query, params).
//
// A render failure degrades to the untouched html and an EMPTY data map, so a
// caller building schema from it emits nothing rather than emitting a shape
// full of undefined. assert-build.mjs asserts the schema is present, which is
// what turns that silent degradation into a failed build.
async function injectRoot(html, routePath) {
  if (!renderRoute) return { html, data: {} }
  try {
    const { html: body, data } = await renderRoute(routePath)
    const dataScript = `<script>window.__SANITY_DATA__=${serializeData(data)}</script>`
    // Function replacers: the SSR body and the serialized Sanity data are
    // arbitrary content, and a `$&` or `$'` in either would be substituted.
    // See scripts/lib/inject-schemas.mjs.
    return {
      html: html
        .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
        .replace('</body>', () => `${dataScript}\n</body>`),
      data: data || {},
    }
  } catch (e) {
    console.warn(`  SSR render failed for ${routePath}: ${e.message}`)
    return { html, data: {} }
  }
}

// ── Optional: fetch project names + taglines from Sanity ─────────────────────

let projectMeta = {}
try {
  const q = encodeURIComponent(`*[_type == "project" && published == true]{"slug": slug.current, name, tagline, comingSoon, _updatedAt}`)
  const res = await fetch(`https://ppq16wpu.apicdn.sanity.io/v2024-01-01/data/query/production?query=${q}`)
  if (res.ok) {
    const data = await res.json()
    for (const p of (data.result || [])) {
      if (p.slug) projectMeta[p.slug] = {
        name: p.name,
        tagline: p.tagline,
        updatedAt: p._updatedAt,
        comingSoon: p.comingSoon === true,
      }
    }
    console.log(`Fetched metadata for ${Object.keys(projectMeta).length} projects from Sanity`)
  }
} catch {
  console.warn('Sanity fetch skipped — using slug-derived titles for work pages')
}

const NAME_OVERRIDES = {
  'tbt': 'TBT',
  'zbiotics': 'ZBiotics',
  'youtube': 'YouTube',
  'survivornet': 'SurvivorNet',
  'opentext': 'OpenText',
  'pubkey': 'PubKey',
}

function slugToName(slug) {
  return slug.split('-').map(w => NAME_OVERRIDES[w] ?? (w.charAt(0).toUpperCase() + w.slice(1))).join(' ')
}

let count = 0

// ── Static pages ──────────────────────────────────────────────────────────────

// `schemas(data, url)` receives the Sanity store the SSR render already fetched,
// keyed by sanityKey(query, params) — so a page's structured data is built from
// exactly what it rendered, with no second round trip.
const STATIC_PAGES = [
  {
    segments: ['about'],
    title: 'Capabilities | Super Conscious',
    description: 'Brand systems, content programs, and digital products. A creative studio embedded with founders and marketing teams, month to month.',
    schemas: (data, url) => {
      // Guarded on the FAQ array itself, never on `data ?? FALLBACK`. About.jsx's
      // FALLBACK has no faqs key and only substitutes when Sanity returns nothing
      // at all — the same field-level trap that once shipped /about with no <h1>.
      const faqs = data[sanityKey(ABOUT_PAGE_QUERY, {})]?.faqs
      return [
        crumbs({ name: 'Capabilities', item: url }),
        faqs?.length && {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        },
      ]
    },
  },
  {
    segments: ['careers'],
    title: 'Join the Team | Super Conscious',
    description: 'Join a small team of strategists, creatives, and builders. Everyone is close to the work. Philadelphia, PA.',
    schemas: (_data, url) => [crumbs({ name: 'Careers', item: url })],
  },
  {
    segments: ['who-we-are'],
    title: 'About | Super Conscious',
    description: 'A fractional creative and marketing department — brand, copy, design, development, media — that plugs into your company at a fraction of the cost of building it in-house.',
  },
  {
    segments: ['work'],
    title: 'Selected Work | Super Conscious',
    description: 'Case studies from Super Conscious. Brand systems, content programs, and digital products for founders and marketing teams.',
    schemas: (_data, url) => [
      crumbs({ name: 'Work', item: url }),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Selected Work',
        // The sitemap'd case studies, in the order the page lists them. Built
        // from indexableWorkSlugs so a coming-soon or hidden project can never
        // be advertised here as a case study that exists.
        itemListElement: indexableWorkSlugs.map((slug, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE_URL}/work/${slug}`,
          name: projectMeta[slug]?.name || slugToName(slug),
        })),
      },
    ],
  },
  {
    segments: ['thoughts'],
    title: 'Thoughts | Super Conscious',
    description: 'Perspectives on brand, content, and building creative companies from the Super Conscious team.',
    schemas: (_data, url) => [
      crumbs({ name: 'Thoughts', item: url }),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Thoughts',
        // From src/data/thoughts.js, which is also what prerenders the posts
        // themselves. The /thoughts index renders Sanity's list when it is
        // non-empty; the two hold the same four posts today, and building this
        // from the prerendered set means the ItemList can only ever point at a
        // URL that exists.
        itemListElement: thoughts.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE_URL}/thoughts/${t.slug}`,
          name: t.title,
        })),
      },
    ],
  },
  {
    segments: ['contact'],
    title: 'Start a Project | Super Conscious',
    description: "Tell us where you are and what you're trying to accomplish. We'll respond within one business day.",
    schemas: (_data, url) => [
      crumbs({ name: 'Contact', item: url }),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url,
        name: 'Start a Project',
        about: ORG_REF,
      },
    ],
  },
]


// ── Work / case study pages ───────────────────────────────────────────────────

const sitemapXml = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8')
const sitemapWorkSlugs = [...sitemapXml.matchAll(/<loc>https:\/\/super-conscious\.studio\/work\/([^<]+)<\/loc>/g)]
  .map(m => m[1])

// Which case studies exist is Sanity's answer, not the sitemap's.
//
// These were the same list until 2026-08-18, when three fully written case
// studies — talos (10 sections), webroot (10), carbonite (7) — turned out to be
// published in Sanity but absent from this hand-edited file, so they were never
// prerendered. They still rendered in the homepage grid, which made /work/talos
// the most-linked URL on the site at 180 anchors, every one of them a 404.
//
// The sitemap is maintained by hand and drifts. Sanity is the system that
// actually knows what is published, so ask it. If the fetch above failed,
// projectMeta is empty and we fall back rather than building zero case studies
// — a Sanity outage should degrade to the old behaviour, not empty the site.
// scripts/assert-build.mjs then fails the build if the two lists disagree.
const workSlugs = Object.keys(projectMeta).length
  ? Object.keys(projectMeta).sort()
  : sitemapWorkSlugs

/**
 * A case study that should not be in the index.
 *
 * CaseStudy.jsx:199 renders "This case study is coming soon." in place of the
 * page whenever comingSoon is set, and the prerender captures that — so these
 * URLs were being submitted to Google as placeholder pages. Thirty of them,
 * against sixty-one real ones.
 *
 * The section count is deliberately NOT part of this test. Thirteen of the
 * thirty do hold finished content in Sanity — arbitrum-openhouse has sixteen
 * sections — but the flag suppresses it at render time, so a crawler sees the
 * same placeholder either way. Noindexing them buries nothing that was
 * visible; the flag already did that. If the page is not live, it is not ready
 * to be indexed.
 *
 * HIDDEN_SLUGS covers a second case: case studies deliberately taken out of the
 * nav on 2026-06-01 (b8f83a3). They are not comingSoon and they hold finished
 * content, so nothing here caught them — and when this script began taking its
 * routes from Sanity they were submitted to Google as ordinary case studies,
 * despite having zero inbound links anywhere on the site. Client work someone
 * had chosen to stop showing.
 *
 * Nothing here decides whether a case study should be published. Clearing
 * comingSoon in the Studio, or removing a slug from HIDDEN_SLUGS, makes the
 * page real and puts it straight back into the sitemap on the next build.
 */
const isPlaceholder = (slug) =>
  projectMeta[slug]?.comingSoon === true || HIDDEN_SLUGS.has(slug)

const placeholderSlugs = workSlugs.filter(isPlaceholder)

// The case studies that are actually submitted to Google — what /work's ItemList
// is allowed to advertise. Sorted the way the work loop iterates.
const indexableWorkSlugs = workSlugs.filter(slug => !isPlaceholder(slug))

// Static pages render here rather than earlier so their schema builders can see
// the resolved work-slug lists above.
for (const page of STATIC_PAGES) {
  const routePath = `/${page.segments.join('/')}`
  const url = `${BASE_URL}${routePath}`
  let html = injectMeta(indexHtml, { title: page.title, description: page.description, url, image: DEFAULT_IMAGE })
  // injectRoot first: the schema builders read the data it returns.
  const rendered = await injectRoot(html, routePath)
  html = injectSchemas(rendered.html, page.schemas(rendered.data, url))
  writeHtml(page.segments, html)
  count++
}


for (const slug of workSlugs) {
  const meta = projectMeta[slug]
  const name = meta?.name || slugToName(slug)
  const tagline = meta?.tagline || ''
  const title = `${name} | Super Conscious`
  const description = (tagline || `Work by Super Conscious for ${name}.`).slice(0, 155)
  const url = `${BASE_URL}/work/${slug}`
  let html = injectMeta(indexHtml, { title, description, url, image: DEFAULT_IMAGE })
  if (isPlaceholder(slug)) {
    // follow, not none: the links out of the page still carry equity, and the
    // page becomes indexable again as soon as someone writes the case study.
    //
    // Applied before injectRoot, which is what rewrites <div id="root">; the
    // marker this matches is <meta name="viewport">, so order is not load
    // bearing here, but keeping every head edit ahead of the render keeps it
    // obvious that it cannot be lost.
    html = html.replace('<meta name="viewport"', () => '<meta name="robots" content="noindex, follow" />\n    <meta name="viewport"')
  }

  const rendered = await injectRoot(html, `/work/${slug}`)
  html = injectSchemas(rendered.html, [
    crumbs({ name: 'Work', item: `${BASE_URL}/work` }, { name, item: url }),
    // CreativeWork describes ONE piece of work, so it is wrong on the client
    // hubs — /work/google is an index of six projects, not a project.
    //
    // The test is which query this render actually resolved, not a rule
    // re-derived from Sanity. WorkRouter picks ClientOverview on
    // projects.isMulti(slug), and ProjectsContext falls back to
    // src/data/projects.js whenever the Sanity list is empty — which is the
    // state during SSR pass 1, when the route's queries are collected. So the
    // static file, not Sanity, decides what gets fetched and therefore what
    // pass 2 renders. Sanity's own subCount disagrees for five of the fourteen
    // (big-buoy, gigs, girlfight, nimruz and world-within all report 0), so
    // recomputing the rule here would mislabel them. Asking the render what it
    // fetched cannot drift from what it rendered.
    !Object.hasOwn(rendered.data, sanityKey(CLIENT_OVERVIEW_QUERY, { slug })) && {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name,
      url,
      // Spread rather than `?? null`: JSON.stringify drops an undefined value
      // but happily emits `"description": null`, which is invalid.
      ...(tagline ? { description: tagline } : {}),
      creator: ORG_REF,
      author: ORG_REF,
    },
  ])
  writeHtml(['work', slug], html)
  count++
}

console.log(`  work: ${workSlugs.length} pages (${placeholderSlugs.length} noindexed as placeholders)`)

// ── Thoughts posts (with Article JSON-LD) ─────────────────────────────────────

for (const t of thoughts) {
  const title = `${t.title} | Super Conscious`
  const description = (t.excerpt || '').slice(0, 155)
  const url = `${BASE_URL}/thoughts/${t.slug}`

  let html = injectMeta(indexHtml, { title, description, url, image: DEFAULT_IMAGE })

  html = injectSchemas(html, [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: t.title,
      description: t.excerpt || '',
      datePublished: t.isoDate || '',
      // Refs, not restatements: index.html ships the Organization node on every
      // page, so these resolve to it instead of describing a third copy.
      author: ORG_REF,
      publisher: ORG_REF,
      url,
      image: t.hero ? `${BASE_URL}${t.hero}` : DEFAULT_IMAGE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Thoughts', item: `${BASE_URL}/thoughts` },
        { '@type': 'ListItem', position: 3, name: t.title, item: url },
      ],
    },
  ])

  html = (await injectRoot(html, `/thoughts/${t.slug}`)).html
  writeHtml(['thoughts', t.slug], html)
  count++
}

// ── AEO landing pages (canonical, H1, FAQ + HowTo + Breadcrumb JSON-LD, outgoing links) ──



for (const [slug, page] of Object.entries(MOCK_PAGES)) {
  const title = page.seoTitle || `${page.heroHeadline} | Super Conscious`
  const description = (page.seoDescription || page.heroAnswer || '').slice(0, 155)
  const url = `${BASE_URL}/lp/${slug}`

  let html = injectMeta(indexHtml, { title, description, url, image: DEFAULT_IMAGE })

  // FAQ + HowTo JSON-LD in <head> so non-JS crawlers see structured data
  const schemas = []
  if (page.faqs?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  if (page.processSteps?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: page.heroHeadline,
      step: page.processSteps.map((step, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: step.label,
        text: step.description || step.label,
      })),
    })
  }
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: LP_CATEGORY[slug] || 'Resources', item: `${BASE_URL}/about` },
      { '@type': 'ListItem', position: 3, name: page.heroHeadline, item: url },
    ],
  })
  html = injectSchemas(html, schemas)


  html = (await injectRoot(html, `/lp/${slug}`)).html
  writeHtml(['lp', slug], html)
  count++
}

// ── Homepage ─────────────────────────────────────────────────────────────────
// The /lp links used to be injected here, into a display:none div. They live
// on /about now, visible. See src/pages/About.jsx.

const homeRendered = await injectRoot(fs.readFileSync(indexPath, 'utf8'), '/')
fs.writeFileSync(indexPath, injectSchemas(homeRendered.html, [{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Super Conscious',
  publisher: ORG_REF,
}]))

// ── Routing shells ───────────────────────────────────────────────────────────
// Prerendered routes serve their own (SSR'd) file. Client-only routes (gated
// decks, /lp index, /privacy, /terms, etc.) are rewritten to shell.html — the
// pre-SSR base HTML with an empty #root, so the client createRoot-renders the
// right route with NO hydration mismatch (vs. serving home content). 404.html is
// the same empty shell; Vercel serves it with a real 404 for unmatched paths,
// killing the soft-404s (every unknown URL used to return 200 + homepage).
// The canonical is stripped, not rewritten.
//
// This file is index.html with a noindex tag added, so it inherited the
// homepage's canonical — and it serves /privacy, /terms and every 404 on the
// site. All of them told Google "the canonical version of this URL is the
// homepage" while simultaneously saying "do not index this", which are
// contradictory instructions, on pages that in the 404 case are not URLs at
// all. It surfaced when a redirect test asserted that a made-up path must not
// claim the homepage as its canonical.
//
// It cannot be made correct instead: one file answers for many routes, so
// there is no single right value. Absent beats wrong.
//
// The title and description are still the homepage's. That is untouched here
// because fixing it means prerendering /privacy and /terms as real routes
// rather than patching the shell, and both are noindexed today.
const shellHtml = indexHtml
  .replace(/\s*<link rel="canonical"[^>]*>/, '')
  .replace(
    '<meta name="viewport"',
    '<meta name="robots" content="noindex" />\n    <meta name="viewport"',
  )
fs.writeFileSync(path.join(distDir, 'shell.html'), shellHtml)
fs.writeFileSync(path.join(distDir, '404.html'), shellHtml)
console.log('Wrote dist/shell.html + dist/404.html (empty-root client shells, noindex)')

console.log(`Prerendered ${count} pages → dist/*/index.html`)

// ── Sitemap: inject <lastmod> per URL so Google can prioritize re-crawls ──────
// Phase 1: real dates where cheaply available (thoughts isoDate, Sanity _updatedAt
// for work). Static + /lp pages use a stable content-version date so the value
// only moves on real content changes, not every build (Google distrusts lastmods
// that churn). Phase 3 automates this fully per-URL from git/Sanity.

// The floor for pages with no better date: /, /about, /careers and /lp/*.
//
// This was a hand-bumped constant, and the instruction to bump it was missed.
// On 2026-08-19 all 22 /lp descriptions were rewritten, and /'s and /about's
// headings changed, while every one of those URLs kept telling Google
// "unchanged since 2026-06-13" — a lastmod two months stale on exactly the
// pages whose snippets had just been rewritten. Google uses lastmod to
// prioritise recrawls, so the sitemap was arguing against the change that had
// just shipped.
//
// It is now derived from git, with this constant as a FLOOR rather than the
// answer. Vercel builds from a depth-limited clone, so `git log` can return
// nothing for a file whose last change falls outside the fetched history —
// taking the max means that degrades to a date that is merely old rather than
// wrong, and never regresses below what was true when this line was written.
const SITE_CONTENT_VERSION = '2026-08-19'

/** Last commit date for a path, or null when git cannot answer. */
function gitDay(relPath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null
  } catch {
    return null
  }
}

// The sources that actually produce those pages.
const STATIC_CONTENT_SOURCES = [
  'src/lib/mockLandingPages.js',
  'src/lib/lpCategories.js',
  'src/pages/Home.jsx',
  'src/pages/About.jsx',
  'src/pages/Careers.jsx',
  'src/pages/AboutStudio.jsx',
  'src/pages/LandingPage.jsx',
  'src/pages/Work.jsx',
]

const gitDays = STATIC_CONTENT_SOURCES.map(gitDay).filter(Boolean)
const staticContentDay = [SITE_CONTENT_VERSION, ...gitDays].sort().pop()

// Reported explicitly, because the failure this replaces was silent. A build
// where git answered for none of the sources is a build running on the floor,
// and that is worth seeing in the log rather than inferring later from a
// stale date in the sitemap.
console.log(
  gitDays.length
    ? `lastmod for static/lp pages: ${staticContentDay} (git answered for ${gitDays.length}/${STATIC_CONTENT_SOURCES.length} sources)`
    : `lastmod for static/lp pages: ${staticContentDay} (FLOOR — git answered for none; shallow clone?)`,
)

const toDay = (iso) => (iso ? String(iso).slice(0, 10) : staticContentDay)

const thoughtDateBySlug = Object.fromEntries(thoughts.map(t => [t.slug, toDay(t.isoDate)]))
const newestThought = thoughts.map(t => toDay(t.isoDate)).sort().pop() || staticContentDay
const newestWork = Object.values(projectMeta).map(p => toDay(p.updatedAt)).sort().pop() || staticContentDay

function lastmodFor(loc) {
  const route = loc.replace(BASE_URL, '') || '/'
  if (route === '/thoughts') return newestThought
  // The index changes when a case study changes OR when the page itself does.
  // It was built on 2026-08-19 and still claimed 2026-07-08, the newest
  // Sanity edit, because only the former was considered.
  if (route === '/work') return [newestWork, staticContentDay].sort().pop()
  const t = route.match(/^\/thoughts\/(.+)$/)
  if (t) return thoughtDateBySlug[t[1]] || staticContentDay
  const w = route.match(/^\/work\/(.+)$/)
  if (w) return toDay(projectMeta[w[1]]?.updatedAt)
  return staticContentDay // /, /about, /careers, /lp/*
}

const distSitemapPath = path.join(distDir, 'sitemap.xml')
if (fs.existsSync(distSitemapPath)) {
  let sm = fs.readFileSync(distSitemapPath, 'utf8')
  sm = sm.replace(/\s*<lastmod>[^<]*<\/lastmod>/g, '') // idempotent: strip any prior lastmod

  // Drop placeholder case studies. Filtered here rather than deleted from
  // public/sitemap.xml so the two can never disagree: the same Sanity answer
  // decides both the noindex tag and the sitemap entry, and a project that
  // gains content reappears in both on the next build.
  for (const slug of placeholderSlugs) {
    sm = sm.replace(new RegExp(`\\s*<url><loc>${BASE_URL}/work/${slug}</loc>[\\s\\S]*?</url>`), '')
  }
  sm = sm.replace(/<loc>([^<]+)<\/loc>/g, (m, loc) => `<loc>${loc}</loc><lastmod>${lastmodFor(loc)}</lastmod>`)
  fs.writeFileSync(distSitemapPath, sm)
  console.log('Injected <lastmod> into dist/sitemap.xml')
}

// ── llms.txt: regenerate with AEO question/answer section appended ────────────

const baseLlms = fs.readFileSync(path.join(ROOT, 'public/llms.txt'), 'utf8').trimEnd()


let aeoSection = '\n\n## Common Questions\n\nDetailed answers to questions about brand systems, content programs, and digital products:\n'

for (const { label: category, slugs } of LP_CATEGORIES) {
  aeoSection += `\n### ${category}\n\n`
  for (const slug of slugs) {
    const p = MOCK_PAGES[slug]
    if (!p) continue
    const answer = (p.heroAnswer || '').replace(/\n/g, ' ').slice(0, 200)
    aeoSection += `- [${p.heroHeadline}](${BASE_URL}/lp/${slug}): ${answer}\n`
  }
}

fs.writeFileSync(path.join(distDir, 'llms.txt'), baseLlms + aeoSection + '\n')
console.log('Regenerated dist/llms.txt with AEO section')

// ── Post-build assertions on the emitted HTML ────────────────────────────────
// Kept in its own script so it can be run against an existing dist/ without a
// rebuild — a check you cannot invoke on demand is a check you cannot trust.
await import(path.join(ROOT, 'scripts/assert-build.mjs'))
