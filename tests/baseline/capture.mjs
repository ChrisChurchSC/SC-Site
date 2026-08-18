#!/usr/bin/env node
/**
 * Captures the invariants of every live route so later changes can be proved
 * non-destructive.
 *
 * This exists because the site's value is in things that fail SILENTLY: a route
 * that stops prerendering still returns 200, a canonical that flips still looks
 * fine in a browser, a dropped JSON-LD block breaks nothing visible. Three
 * phases of SEO work are encoded in this output and none of it is visible to
 * the naked eye.
 *
 *   node tests/baseline/capture.mjs            # capture -> prod-baseline.json
 *   node tests/baseline/capture.mjs --out x    # capture elsewhere (for diffing)
 *   node tests/baseline/capture.mjs --base URL # point at a preview/local build
 */

import { writeFileSync } from 'node:fs'
import { argv } from 'node:process'

const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const BASE = arg('base', 'https://super-conscious.studio').replace(/\/$/, '')
const OUT = arg('out', 'tests/baseline/prod-baseline.json')
const CONCURRENCY = Number(arg('concurrency', 6))

const text = (html, re) => {
  const m = html.match(re)
  return m ? m[1].trim() : null
}

/** Everything about a page that must not change by accident. */
function extract(html, headers, status) {
  // #root emptiness is THE regression that Phase 2 fixed, so measure it
  // directly — but by VISIBLE TEXT, not by trying to find the matching
  // </div>. The markup nests dozens of divs deep and no closing-tag regex
  // survives it; an earlier attempt reported every page empty.
  const rootStart = html.indexOf('<div id="root">')
  let rootText = ''
  if (rootStart !== -1) {
    rootText = html
      .slice(rootStart)
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  const rootLen = rootText.length

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((m) => {
      try {
        const parsed = JSON.parse(m[1])
        return (Array.isArray(parsed) ? parsed : [parsed]).map((o) => o['@type']).filter(Boolean)
      } catch {
        return ['UNPARSEABLE']
      }
    })
    .sort()

  return {
    status,
    title: text(html, /<title>([^<]*)<\/title>/),
    description: text(html, /<meta name="description" content="([^"]*)"/),
    canonical: text(html, /<link rel="canonical" href="([^"]*)"/),
    robotsMeta: text(html, /<meta name="robots" content="([^"]*)"/),
    xRobotsTag: headers.get('x-robots-tag'),
    ogTitle: text(html, /<meta property="og:title" content="([^"]*)"/),
    ogImage: text(html, /<meta property="og:image" content="([^"]*)"/),
    h1Count: (html.match(/<h1[\s>]/g) || []).length,
    h2Count: (html.match(/<h2[\s>]/g) || []).length,
    // Bucketed, not exact: prose edits are expected, a page emptying out is not.
    rootContentBucket: rootLen === 0 ? 'EMPTY' : rootLen < 1200 ? 'THIN' : 'CONTENT',
    rootContentLength: rootLen,
    jsonLdTypes: ld,
    internalLinks: [...new Set((html.match(/href="(\/[^"#?]*)"/g) || [])
      .map((h) => h.slice(6, -1))
      .filter((h) => !h.startsWith('//')))].sort(),
  }
}

async function fetchRoute(path) {
  const url = `${BASE}${path}`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'sc-baseline/1.0' } })
      const html = res.status < 400 ? await res.text() : ''
      return { path, ...extract(html, res.headers, res.status) }
    } catch (err) {
      if (attempt === 3) return { path, status: 0, error: String(err.message || err) }
      await new Promise((r) => setTimeout(r, 400 * attempt))
    }
  }
}

async function pooled(items, worker, limit) {
  const out = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await worker(items[i])
        if ((i + 1) % 10 === 0) process.stderr.write(`  ${i + 1}/${items.length}\n`)
      }
    }),
  )
  return out
}

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .sort()

// Routes worth pinning that the sitemap omits — /work is the portfolio index
// and /contact is a conversion page; both are currently missing from it.
for (const extra of ['/contact', '/work', '/privacy', '/terms', '/404-does-not-exist']) {
  if (!paths.includes(extra)) paths.push(extra)
}

process.stderr.write(`Capturing ${paths.length} routes from ${BASE}\n`)
const routes = await pooled(paths, fetchRoute, CONCURRENCY)

const baseline = {
  capturedAt: new Date().toISOString(),
  base: BASE,
  routeCount: routes.length,
  routes: Object.fromEntries(routes.map((r) => [r.path, r])),
}

writeFileSync(OUT, JSON.stringify(baseline, null, 2))

const empty = routes.filter((r) => r.rootContentBucket === 'EMPTY' && r.status === 200)
const noH1 = routes.filter((r) => r.h1Count === 0 && r.status === 200)
process.stderr.write(
  `\nWrote ${OUT}\n` +
    `  ${routes.filter((r) => r.status === 200).length} OK, ` +
    `${routes.filter((r) => r.status >= 400).length} >=400, ` +
    `${routes.filter((r) => r.status === 0).length} failed\n` +
    `  ${empty.length} routes ship an EMPTY #root\n` +
    `  ${noH1.length} routes have no <h1>\n`,
)
