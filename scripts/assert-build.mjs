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
  // Checked against #root, not the whole file: the prerender also injects a
  // crawler-only <h1> into the hidden #seo-static div on /lp pages, and that
  // one is invisible to users. Counting it would let a page pass this check
  // while showing a reader no heading at all.
  //
  // The homepage, /services and /work all shipped with zero. The services
  // page's was worse than absent — the markup was there, guarded on a Sanity
  // field that is null, so it silently rendered nothing.
  const rootStart = html.indexOf('<div id="root">')
  if (rootStart !== -1) {
    const seoStart = html.indexOf('<div id="seo-static"', rootStart)
    const body = html.slice(rootStart, seoStart === -1 ? undefined : seoStart)
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

if (problems.length) {
  console.error(`\n\u2717 Prerender output failed ${problems.length} assertion(s):`)
  for (const p of problems) console.error(`    ${p}`)
  exit(1)
}
console.log(`\u2713 Head tags verified across ${htmlFiles.length} built pages`)
