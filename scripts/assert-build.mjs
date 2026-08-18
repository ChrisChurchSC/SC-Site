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

const problems = []
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  const rel = path.relative(dir, file)

  for (const [label, re] of HEAD_TAGS) {
    const n = (html.match(re) || []).length
    if (n !== 1) problems.push(`${rel}: expected exactly 1 ${label}, found ${n}`)
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
}

// ── sitemap parity ───────────────────────────────────────────────────────────
// Built pages and submitted URLs must be the same set.

const BASE = 'https://super-conscious.studio'
const sitemapPath = path.join(dir, 'sitemap.xml')

if (!fs.existsSync(sitemapPath)) {
  problems.push('sitemap.xml missing from the build output')
} else {
  const xml = fs.readFileSync(sitemapPath, 'utf8')
  const submitted = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, '') || '/'),
  )

  // shell.html and 404.html are deliberately unroutable; they carry noindex.
  const built = new Set(
    htmlFiles
      .map((f) => '/' + path.relative(dir, f).replace(/\/?index\.html$/, ''))
      .filter((u) => !/^\/(shell|404)\.html$/.test(u)),
  )

  for (const url of built) {
    if (!submitted.has(url)) problems.push(`${url}: prerendered but not in sitemap.xml`)
  }
  for (const url of submitted) {
    if (!built.has(url)) problems.push(`${url}: in sitemap.xml but never prerendered (404)`)
  }
}

if (problems.length) {
  console.error(`\n\u2717 Prerender output failed ${problems.length} assertion(s):`)
  for (const p of problems) console.error(`    ${p}`)
  exit(1)
}
console.log(`\u2713 Head tags verified across ${htmlFiles.length} built pages`)
