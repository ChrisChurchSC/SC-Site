/**
 * Post-build: inject per-page meta tags into HTML files so crawlers
 * see the correct title, description, and canonical for every sitemap page.
 *
 * Covers:
 *  - /lp/[slug]  — AEO landing pages (also injects H1 + outgoing links)
 *  - /work/[slug] — case studies (slugs parsed from sitemap.xml)
 *  - /thoughts/[slug] — thought posts (from src/data/thoughts.js)
 *  - static pages: /about, /about-us, /work, /thoughts, /contact
 *  - / — homepage (LP links injected for crawler discoverability)
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

function injectRoot(html, content) {
  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
}

function writeHtml(segments, html) {
  const dir = path.join(distDir, ...segments)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

// ── Optional: fetch project names + taglines from Sanity ─────────────────────

let projectMeta = {}
try {
  const q = encodeURIComponent(`*[_type == "project" && published == true]{"slug": slug.current, name, tagline}`)
  const res = await fetch(`https://ppq16wpu.apicdn.sanity.io/v2024-01-01/data/query/production?query=${q}`)
  if (res.ok) {
    const data = await res.json()
    for (const p of (data.result || [])) {
      if (p.slug) projectMeta[p.slug] = { name: p.name, tagline: p.tagline }
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
  const html = injectMeta(indexHtml, { title: page.title, description: page.description, url })
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
  const html = injectMeta(indexHtml, { title, description, url })
  writeHtml(['work', slug], html)
  count++
}

console.log(`  work: ${workSlugs.length} pages`)

// ── Thoughts posts ────────────────────────────────────────────────────────────

for (const t of thoughts) {
  const title = `${t.title} | Super Conscious`
  const description = (t.excerpt || '').slice(0, 155)
  const url = `${BASE_URL}/thoughts/${t.slug}`
  const html = injectMeta(indexHtml, { title, description, url })
  writeHtml(['thoughts', t.slug], html)
  count++
}

// ── AEO landing pages (with H1 + outgoing links injected) ────────────────────

const lpLinks = Object.entries(MOCK_PAGES)
  .map(([slug, p]) => `<a href="/lp/${slug}">${esc(p.heroHeadline)}</a>`)
  .join('\n')

for (const [slug, page] of Object.entries(MOCK_PAGES)) {
  const title = page.seoTitle || `${page.heroHeadline} | Super Conscious`
  const description = (page.seoDescription || page.heroAnswer || '').slice(0, 155)
  const url = `${BASE_URL}/lp/${slug}`

  let html = injectMeta(indexHtml, { title, description, url })

  // Inject H1 + description + nav links so crawlers see content and outgoing links
  html = injectRoot(html, [
    `<h1>${esc(page.heroHeadline)}</h1>`,
    `<p>${esc(description)}</p>`,
    `<nav><a href="/">Super Conscious</a> · <a href="/contact">Start a project</a></nav>`,
  ].join(''))

  writeHtml(['lp', slug], html)
  count++
}

// ── Homepage: inject LP links so crawlers can discover /lp/* pages ───────────

const homepageHtml = fs.readFileSync(indexPath, 'utf8')
const homepageWithLinks = injectRoot(
  homepageHtml,
  `<nav aria-label="Resources">\n${lpLinks}\n</nav>`,
)
fs.writeFileSync(indexPath, homepageWithLinks)

console.log(`Prerendered ${count} pages → dist/*/index.html`)
