/**
 * Post-build: inject per-page meta tags into HTML files so crawlers
 * see the correct title, description, and canonical for every sitemap page.
 *
 * Covers:
 *  - /lp/[slug]  — AEO landing pages (canonical, H1, FAQ+HowTo JSON-LD, outgoing links)
 *  - /work/[slug] — case studies (canonical, title, description)
 *  - /thoughts/[slug] — thought posts (canonical, Article JSON-LD)
 *  - static pages: /about, /careers, /work, /thoughts, /contact
 *  - / — homepage (LP links injected for crawler discoverability)
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
const { esc, injectMeta } = await import(path.join(ROOT, 'scripts/lib/inject-meta.mjs'))
const { HIDDEN_SLUGS } = await import(path.join(ROOT, 'src/lib/hiddenProjects.js'))

const BASE_URL = 'https://super-conscious.studio'
const DEFAULT_IMAGE = `${BASE_URL}/reel-preview.gif`
const indexHtml = fs.readFileSync(indexPath, 'utf8')

// Inject JSON-LD schema scripts before </head>
function injectSchemas(html, schemas) {
  if (!schemas.length) return html
  const scripts = schemas
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ')
  return html.replace('</head>', `    ${scripts}\n  </head>`)
}

// Inject crawler-only content as a hidden div after #root (React never touches it)
function injectSeoContent(html, content) {
  return html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n<div id="seo-static" style="display:none" aria-hidden="true">${content}</div>`,
  )
}

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

async function injectRoot(html, routePath) {
  if (!renderRoute) return html
  try {
    const { html: body, data } = await renderRoute(routePath)
    const dataScript = `<script>window.__SANITY_DATA__=${serializeData(data)}</script>`
    return html
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace('</body>', `${dataScript}\n</body>`)
  } catch (e) {
    console.warn(`  SSR render failed for ${routePath}: ${e.message}`)
    return html
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

const STATIC_PAGES = [
  {
    segments: ['about'],
    title: 'Capabilities | Super Conscious',
    description: 'Brand systems, content programs, and digital products. A creative studio embedded with founders and marketing teams, month to month.',
  },
  {
    segments: ['careers'],
    title: 'Join the Team | Super Conscious',
    description: 'Join a small team of strategists, creatives, and builders. Everyone is close to the work. Philadelphia, PA.',
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
  },
  {
    segments: ['thoughts'],
    title: 'Thoughts | Super Conscious',
    description: 'Perspectives on brand, content, and building creative companies from the Super Conscious team.',
  },
  {
    segments: ['contact'],
    title: 'Start a Project | Super Conscious',
    description: "Tell us where you are and what you're trying to accomplish. We'll respond within one business day.",
  },
]

for (const page of STATIC_PAGES) {
  const url = `${BASE_URL}/${page.segments.join('/')}`
  let html = injectMeta(indexHtml, { title: page.title, description: page.description, url, image: DEFAULT_IMAGE })
  html = await injectRoot(html, `/${page.segments.join('/')}`)
  writeHtml(page.segments, html)
  count++
}

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

for (const slug of workSlugs) {
  const meta = projectMeta[slug]
  const name = meta?.name || slugToName(slug)
  const tagline = meta?.tagline || ''
  const title = `${name} | Super Conscious`
  const description = (tagline || `Work by Super Conscious for ${name}.`).slice(0, 155)
  const url = `${BASE_URL}/work/${slug}`
  let html = injectMeta(indexHtml, { title, description, url, image: DEFAULT_IMAGE })
  html = injectSchemas(html, [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  }])
  if (isPlaceholder(slug)) {
    // follow, not none: the links out of the page still carry equity, and the
    // page becomes indexable again as soon as someone writes the case study.
    html = html.replace('<meta name="viewport"', '<meta name="robots" content="noindex, follow" />\n    <meta name="viewport"')
  }

  html = await injectRoot(html, `/work/${slug}`)
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
      author: {
        '@type': 'Organization',
        name: 'Super Conscious',
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Super Conscious',
        url: BASE_URL,
        logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.svg` },
      },
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

  html = await injectRoot(html, `/thoughts/${t.slug}`)
  writeHtml(['thoughts', t.slug], html)
  count++
}

// ── AEO landing pages (canonical, H1, FAQ + HowTo + Breadcrumb JSON-LD, outgoing links) ──

const LP_CATEGORY = {
  'what-does-a-brand-system-include': 'Brand Systems',
  'how-long-does-a-brand-system-take': 'Brand Systems',
  'brand-system-cost': 'Brand Systems',
  'brand-guidelines-vs-brand-system': 'Brand Systems',
  'when-to-invest-in-a-brand-system': 'Brand Systems',
  'what-is-a-verbal-identity': 'Brand Systems',
  'brand-consistency-across-a-team': 'Brand Systems',
  'what-is-a-content-program': 'Content Programs',
  'how-to-build-a-b2b-content-program': 'Content Programs',
  'content-program-cost': 'Content Programs',
  'how-long-until-content-marketing-works': 'Content Programs',
  'what-is-a-thought-leadership-program': 'Content Programs',
  'how-to-measure-a-content-program': 'Content Programs',
  'what-does-a-digital-product-design-engagement-include': 'Digital Products',
  'how-much-does-product-design-cost': 'Digital Products',
  'how-long-to-design-a-web-app': 'Digital Products',
  'design-system-vs-brand-system': 'Digital Products',
  'what-to-look-for-in-a-product-design-studio': 'Digital Products',
  'brand-or-content-first': 'Hiring a Studio',
  'do-i-need-a-brand-system-before-content': 'Hiring a Studio',
  'creative-studio-vs-freelancer': 'Hiring a Studio',
  'what-to-ask-a-creative-agency': 'Hiring a Studio',
}

const lpLinks = Object.entries(MOCK_PAGES)
  .map(([slug, p]) => `<a href="/lp/${slug}">${esc(p.heroHeadline)}</a>`)
  .join('\n')

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

  // H1 + description + nav links in hidden div for non-JS crawlers
  html = injectSeoContent(html, [
    `<h1>${esc(page.heroHeadline)}</h1>`,
    `<p>${esc(description)}</p>`,
    `<nav><a href="/">Super Conscious</a> · <a href="/contact">Start a project</a></nav>`,
  ].join(''))

  html = await injectRoot(html, `/lp/${slug}`)
  writeHtml(['lp', slug], html)
  count++
}

// ── Homepage: inject LP links so crawlers can discover /lp/* pages ───────────

const homepageHtml = fs.readFileSync(indexPath, 'utf8')
let homepageWithLinks = injectSeoContent(
  homepageHtml,
  `<nav aria-label="Resources">\n${lpLinks}\n</nav>`,
)
homepageWithLinks = await injectRoot(homepageWithLinks, '/')
fs.writeFileSync(indexPath, homepageWithLinks)

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

const lpByCategory = {
  'Brand Systems': [
    'what-does-a-brand-system-include',
    'how-long-does-a-brand-system-take',
    'brand-system-cost',
    'brand-guidelines-vs-brand-system',
    'when-to-invest-in-a-brand-system',
    'what-is-a-verbal-identity',
    'brand-consistency-across-a-team',
  ],
  'Content Programs': [
    'what-is-a-content-program',
    'how-to-build-a-b2b-content-program',
    'content-program-cost',
    'how-long-until-content-marketing-works',
    'what-is-a-thought-leadership-program',
    'how-to-measure-a-content-program',
  ],
  'Digital Products': [
    'what-does-a-digital-product-design-engagement-include',
    'how-much-does-product-design-cost',
    'how-long-to-design-a-web-app',
    'design-system-vs-brand-system',
    'what-to-look-for-in-a-product-design-studio',
  ],
  'Hiring a Studio': [
    'brand-or-content-first',
    'do-i-need-a-brand-system-before-content',
    'creative-studio-vs-freelancer',
    'what-to-ask-a-creative-agency',
  ],
}

let aeoSection = '\n\n## Common Questions\n\nDetailed answers to questions about brand systems, content programs, and digital products:\n'

for (const [category, slugs] of Object.entries(lpByCategory)) {
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
