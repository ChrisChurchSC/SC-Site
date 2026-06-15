/**
 * Post-build: inject per-page meta tags into HTML files so crawlers
 * see the correct title, description, and canonical for every sitemap page.
 *
 * Covers:
 *  - /lp/[slug]  — AEO landing pages (canonical, H1, FAQ+HowTo JSON-LD, outgoing links)
 *  - /work/[slug] — case studies (canonical, title, description)
 *  - /thoughts/[slug] — thought posts (canonical, Article JSON-LD)
 *  - static pages: /about, /about-us, /work, /thoughts, /contact
 *  - / — homepage (LP links injected for crawler discoverability)
 *  - dist/llms.txt — regenerated with AEO question/answer section appended
 */

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

const BASE_URL = 'https://super-conscious.studio'
const DEFAULT_IMAGE = `${BASE_URL}/reel-preview.gif`
const indexHtml = fs.readFileSync(indexPath, 'utf8')

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function injectMeta(html, { title, description, url }) {
  return html
    .replace(/(<title>)[^<]*(<\/title>)/, `$1${esc(title)}$2`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<meta property="og:image" content=")[^"]*"/, `$1${DEFAULT_IMAGE}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${esc(description)}"`)
}

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
let ssrRender = null
try {
  ({ render: ssrRender } = await import(path.join(ROOT, '.ssr/entry-server.js')))
  console.log('SSR renderer loaded — injecting prerendered content into #root')
} catch (e) {
  console.warn('SSR renderer unavailable — shipping empty #root (meta only):', e.message)
}

function injectRoot(html, routePath) {
  if (!ssrRender) return html
  try {
    const body = ssrRender(routePath)
    return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  } catch (e) {
    console.warn(`  SSR render failed for ${routePath}: ${e.message}`)
    return html
  }
}

// ── Optional: fetch project names + taglines from Sanity ─────────────────────

let projectMeta = {}
try {
  const q = encodeURIComponent(`*[_type == "project" && published == true]{"slug": slug.current, name, tagline, _updatedAt}`)
  const res = await fetch(`https://ppq16wpu.apicdn.sanity.io/v2024-01-01/data/query/production?query=${q}`)
  if (res.ok) {
    const data = await res.json()
    for (const p of (data.result || [])) {
      if (p.slug) projectMeta[p.slug] = { name: p.name, tagline: p.tagline, updatedAt: p._updatedAt }
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
    segments: ['about-us'],
    title: 'Join the Team | Super Conscious',
    description: 'Join a small team of strategists, creatives, and builders. Everyone is close to the work. Philadelphia, PA.',
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
  let html = injectMeta(indexHtml, { title: page.title, description: page.description, url })
  html = injectRoot(html, `/${page.segments.join('/')}`)
  writeHtml(page.segments, html)
  count++
}

// ── Work / case study pages ───────────────────────────────────────────────────

const sitemapXml = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8')
const workSlugs = [...sitemapXml.matchAll(/<loc>https:\/\/super-conscious\.studio\/work\/([^<]+)<\/loc>/g)]
  .map(m => m[1])

for (const slug of workSlugs) {
  const meta = projectMeta[slug]
  const name = meta?.name || slugToName(slug)
  const tagline = meta?.tagline || ''
  const title = `${name} | Super Conscious`
  const description = (tagline || `Work by Super Conscious for ${name}.`).slice(0, 155)
  const url = `${BASE_URL}/work/${slug}`
  let html = injectMeta(indexHtml, { title, description, url })
  html = injectSchemas(html, [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  }])
  html = injectRoot(html, `/work/${slug}`)
  writeHtml(['work', slug], html)
  count++
}

console.log(`  work: ${workSlugs.length} pages`)

// ── Thoughts posts (with Article JSON-LD) ─────────────────────────────────────

for (const t of thoughts) {
  const title = `${t.title} | Super Conscious`
  const description = (t.excerpt || '').slice(0, 155)
  const url = `${BASE_URL}/thoughts/${t.slug}`

  let html = injectMeta(indexHtml, { title, description, url })

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

  html = injectRoot(html, `/thoughts/${t.slug}`)
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

  let html = injectMeta(indexHtml, { title, description, url })

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

  html = injectRoot(html, `/lp/${slug}`)
  writeHtml(['lp', slug], html)
  count++
}

// ── Homepage: inject LP links so crawlers can discover /lp/* pages ───────────

const homepageHtml = fs.readFileSync(indexPath, 'utf8')
let homepageWithLinks = injectSeoContent(
  homepageHtml,
  `<nav aria-label="Resources">\n${lpLinks}\n</nav>`,
)
homepageWithLinks = injectRoot(homepageWithLinks, '/')
fs.writeFileSync(indexPath, homepageWithLinks)

// ── Routing shells ───────────────────────────────────────────────────────────
// Prerendered routes serve their own (SSR'd) file. Client-only routes (gated
// decks, /lp index, /privacy, /terms, etc.) are rewritten to shell.html — the
// pre-SSR base HTML with an empty #root, so the client createRoot-renders the
// right route with NO hydration mismatch (vs. serving home content). 404.html is
// the same empty shell; Vercel serves it with a real 404 for unmatched paths,
// killing the soft-404s (every unknown URL used to return 200 + homepage).
const shellHtml = indexHtml.replace(
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

const SITE_CONTENT_VERSION = '2026-06-13' // bump when static/lp/home/about copy changes

const toDay = (iso) => (iso ? String(iso).slice(0, 10) : SITE_CONTENT_VERSION)

const thoughtDateBySlug = Object.fromEntries(thoughts.map(t => [t.slug, toDay(t.isoDate)]))
const newestThought = thoughts.map(t => toDay(t.isoDate)).sort().pop() || SITE_CONTENT_VERSION
const newestWork = Object.values(projectMeta).map(p => toDay(p.updatedAt)).sort().pop() || SITE_CONTENT_VERSION

function lastmodFor(loc) {
  const route = loc.replace(BASE_URL, '') || '/'
  if (route === '/thoughts') return newestThought
  if (route === '/work') return newestWork
  const t = route.match(/^\/thoughts\/(.+)$/)
  if (t) return thoughtDateBySlug[t[1]] || SITE_CONTENT_VERSION
  const w = route.match(/^\/work\/(.+)$/)
  if (w) return toDay(projectMeta[w[1]]?.updatedAt)
  return SITE_CONTENT_VERSION // /, /about, /about-us, /lp/*
}

const distSitemapPath = path.join(distDir, 'sitemap.xml')
if (fs.existsSync(distSitemapPath)) {
  let sm = fs.readFileSync(distSitemapPath, 'utf8')
  sm = sm.replace(/\s*<lastmod>[^<]*<\/lastmod>/g, '') // idempotent: strip any prior lastmod
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
