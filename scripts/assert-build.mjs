#!/usr/bin/env node
/**
 * Assert the emitted HTML has exactly one of each head tag, and no tag nested
 * inside an attribute value.
 *
 * The unit tests cover injectMeta in isolation; this covers the artefact. A
 * head tag can also be duplicated or emptied by a template edit, a bad Sanity
 * value, or a future injector — none of which a test of one function sees.
 *
 * This exists because a corrupted <meta name="description"> shipped to
 * production and stayed there unnoticed: nothing looked at the built output,
 * and the page still returned 200. Fail the build instead.
 *
 * Also asserts that the set of prerendered pages and the set of sitemap URLs
 * are the same set. A page that is built but unsubmitted is invisible to
 * Google; a URL that is submitted but unbuilt is a 404 in the sitemap. Both
 * shipped simultaneously and neither surfaced anywhere.
 *
 *   node scripts/assert-build.mjs            # checks ./dist
 *   node scripts/assert-build.mjs <dir>
 */

import fs from 'node:fs'
import path from 'node:path'
import { argv, exit } from 'node:process'

const dir = argv[2] || 'dist'

const htmlFiles = []
;(function collect(d) {
  for (const entry of fs.readdirSync(d)) {
    const full = path.join(d, entry)
    if (fs.statSync(full).isDirectory()) collect(full)
    else if (full.endsWith('.html')) htmlFiles.push(full)
  }
})(dir)

const HEAD_TAGS = [
  ['<title>', /<title>/g],
  ['meta description', /<meta name="description"/g],
  ['canonical', /<link rel="canonical"/g],
  ['og:description', /<meta property="og:description"/g],
]

// Routes that legitimately render no <h1>.
//
// /work was exempt while it was `<Navigate to="/" />`. It is a real index now
// and carries a heading, so the exemption is gone — losing it is a failure.
const SKIP_H1 = new Set([
  // Deliberately empty client shells carrying noindex — not routes.
  'shell.html',
  '404.html',
])

// Files that must NOT carry a canonical.
//
// One file answers for many routes here — shell.html serves /privacy and
// /terms, 404.html serves every unmatched path — so no single canonical value
// can be correct. They used to inherit the homepage's, which told Google that
// the canonical version of a 404 was the homepage, alongside a noindex tag
// saying the opposite.
//
// Inverted deliberately: absence is asserted, not merely tolerated, so
// reintroducing the homepage canonical fails the build.
const NO_CANONICAL = new Set(['shell.html', '404.html'])

const problems = []

/** route path -> { noindex } for every emitted page. */
const routes = new Map()

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  const rel = path.relative(dir, file)

  routes.set('/' + rel.replace(/\/?index\.html$/, ''), {
    noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
  })

  for (const [label, re] of HEAD_TAGS) {
    const n = (html.match(re) || []).length
    const want = label === 'canonical' && NO_CANONICAL.has(rel) ? 0 : 1
    if (n !== want) problems.push(`${rel}: expected exactly ${want} ${label}, found ${n}`)
  }

  // A tag opening inside an attribute value means the value was not escaped or
  // was expanded by $-substitution — the exact shape of the shipped bug.
  if (/content="[^"]*<(meta|title|link)/.test(html)) {
    problems.push(`${rel}: a tag is nested inside an attribute value`)
  }

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim()
  if (!title) problems.push(`${rel}: empty <title>`)

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim()
  if (!desc) problems.push(`${rel}: empty meta description`)

  // Exactly one <h1> in the rendered body.
  //
  // Checked against #root, not the whole file. This used to stop at the hidden
  // #seo-static div, which carried a crawler-only duplicate <h1> on every /lp
  // page; that div is gone. What remains to exclude is the serialized Sanity
  // payload in the trailing <script>, where an <h1> can appear inside a string
  // — so scripts are stripped rather than the document being sliced at a
  // marker that may not exist.
  //
  // The homepage, /services and /work all shipped with zero. The services
  // page's was worse than absent — the markup was there, guarded on a Sanity
  // field that is null, so it silently rendered nothing.
  const rootStart = html.indexOf('<div id="root">')
  if (rootStart !== -1) {
    const body = html.slice(rootStart).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    const h1s = (body.match(/<h1[\s>]/g) || []).length
    if (h1s !== 1 && !SKIP_H1.has(rel)) {
      problems.push(`${rel}: expected exactly 1 <h1> in #root, found ${h1s}`)
    }
  }
}

// ── sitemap parity ───────────────────────────────────────────────────────────
// An indexable page must be submitted, and a noindexed page must not be.
//
// Deriving this from each page's own robots tag rather than a list of
// exceptions means the two can never drift: whatever decides the noindex
// decides the sitemap entry, and adding a page to one without the other is a
// build failure rather than something you find in Search Console months later.
//
// It catches both directions, and both had shipped: pages prerendered but
// never submitted (/contact, the newest thoughts post), and URLs submitted but
// never built (/work/talos, answering 404 to 180 inbound links).

const BASE = 'https://super-conscious.studio'
const sitemapPath = path.join(dir, 'sitemap.xml')

if (!fs.existsSync(sitemapPath)) {
  problems.push('sitemap.xml missing from the build output')
} else {
  const xml = fs.readFileSync(sitemapPath, 'utf8')
  const submitted = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, '') || '/'),
  )

  for (const [url, { noindex }] of routes) {
    // shell.html and 404.html are unroutable client shells; they carry
    // noindex, so the rule below already expects them to be absent.
    if (noindex && submitted.has(url)) {
      problems.push(`${url}: noindexed but still submitted in sitemap.xml`)
    }
    if (!noindex && !submitted.has(url)) {
      problems.push(`${url}: indexable but missing from sitemap.xml`)
    }
  }

  for (const url of submitted) {
    if (!routes.has(url)) problems.push(`${url}: in sitemap.xml but never prerendered (404)`)
  }
}

// ── structured data is actually present ──────────────────────────────────────
// The page schema is built from the Sanity data the SSR render fetched, and
// entry-server.jsx swallows a failed fetch with `.catch(() => null)`. Without
// this, a transient Sanity outage during a Vercel build ships /about with no
// FAQPage and every other gate stays green — the page still has its title, its
// canonical, its <h1> and a full #root, because those come from elsewhere.
//
// Asserted per route rather than in aggregate so the failure names the page.

const REQUIRED_SCHEMA = [
  ['index.html', ['Organization', 'WebSite']],
  /* main (PR #137) asserted /about with a FAQPage and /careers; this branch
     keeps the what-we-do page at /services, which carries no FAQ, and the
     careers page at /about-us, with the studio page at /studio — merge of
     2026-09-02. */
  ['services/index.html', ['Organization']],
  ['about-us/index.html', ['Organization', 'BreadcrumbList']],
  ['studio/index.html', ['Organization', 'BreadcrumbList']],
  ['work/index.html', ['Organization', 'BreadcrumbList', 'ItemList']],
  ['thoughts/index.html', ['Organization', 'BreadcrumbList', 'ItemList']],
  ['contact/index.html', ['Organization', 'BreadcrumbList', 'ContactPage']],
]

/** Top-level @type of every JSON-LD block, the way capture.mjs reads them. */
function schemaTypes(html) {
  const types = []
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let parsed
    try { parsed = JSON.parse(m[1]) } catch { problems.push('unparseable JSON-LD block'); continue }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (node && node['@type']) types.push(node['@type'])
    }
  }
  return types
}

for (const [rel, required] of REQUIRED_SCHEMA) {
  const file = path.join(dir, rel)
  if (!fs.existsSync(file)) { problems.push(`${rel}: expected page not built`); continue }
  const types = schemaTypes(fs.readFileSync(file, 'utf8'))
  for (const t of required) {
    if (!types.includes(t)) problems.push(`${rel}: missing ${t} JSON-LD (found: ${types.join(', ') || 'none'})`)
  }
}

// Every /work/<slug> page carries a breadcrumb. CreativeWork is NOT asserted
// here: the client hubs (subCount > 1) render ClientOverview and legitimately
// have only the breadcrumb, and which slugs those are is Sanity's answer, not
// something this script can see from the built file.
for (const file of htmlFiles) {
  const rel = path.relative(dir, file)
  if (!/^work[/\\][^/\\]+[/\\]index\.html$/.test(rel)) continue
  const types = schemaTypes(fs.readFileSync(file, 'utf8'))
  if (!types.includes('BreadcrumbList')) {
    problems.push(`${rel}: missing BreadcrumbList JSON-LD`)
  }
}

// ── every route the app declares is actually served ──────────────────────────
//
// The check above pairs the sitemap with the built output, which is worth
// having but cannot see a route missing from both. That is precisely what
// shipped: the v3 merge added /pricing and fourteen audience pages to App.jsx,
// nothing prerendered them, no rewrite named them, and they were not in the
// sitemap either — so there was nothing to compare, the build passed, and
// seventeen URLs answered 404 in production.
//
// A route is served if one of four things is true: it was prerendered, a
// rewrite hands it to the client shell, a redirect sends it elsewhere, or it is
// named below as deliberately unreachable. Anything else fails the build.
//
// Dynamic segments are skipped — one :slug stands for a set this script cannot
// enumerate, and the sitemap check already covers the ones that get built.

// Routes that exist in the app and are deliberately NOT served in production.
// Being here is a decision; being absent from the site without being here is
// the bug this check exists to catch.
const UNSERVED_ROUTES = new Set([
  // The homepage design variants, kept in the tree for comparison. Two
  // alternate homepages on a public marketing site would be duplicate content
  // competing with the real one, so they are reachable in dev and nowhere else.
  '/v2',
  '/v3',
])

{
  const appSrc = fs.readFileSync('src/App.jsx', 'utf8')
  const declared = [...appSrc.matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((r) => r !== '*' && !r.includes(':'))

  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
  // Vercel sources are path patterns with regex alternation; a literal source is
  // its own pattern. Anchored, so /about does not match /about-us — the exact
  // confusion that produced the careers-page redirect loop.
  const asRegExp = (source) => {
    try { return new RegExp('^' + source.replace(/:[A-Za-z0-9_]+\*?/g, '[^/]+') + '$') }
    catch { return null }
  }
  const handledBy = (list) => (route) =>
    (list || []).some((r) => r.source === route || asRegExp(r.source)?.test(route))

  const rewritten = handledBy(vercel.rewrites)
  const redirected = handledBy(vercel.redirects)

  for (const route of declared) {
    if (routes.has(route)) continue
    if (rewritten(route)) continue
    if (redirected(route)) continue
    if (UNSERVED_ROUTES.has(route)) continue
    problems.push(
      `${route}: declared in App.jsx but not prerendered, rewritten or redirected — it will 404`,
    )
  }
}

if (problems.length) {
  console.error(`\n\u2717 Prerender output failed ${problems.length} assertion(s):`)
  for (const p of problems) console.error(`    ${p}`)
  exit(1)
}
console.log(`\u2713 Head tags verified across ${htmlFiles.length} built pages`)
