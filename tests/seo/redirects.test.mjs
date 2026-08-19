#!/usr/bin/env node
/**
 * Asserts the legacy 301s are configured AND actually served.
 *
 * Two failure modes to catch, and they need different checks:
 *
 *   1. vercel.json drifts from tests/seo/legacy-redirects.mjs. Someone edits
 *      one and not the other, and the map stops describing the site. This is
 *      checked against the file, offline.
 *
 *   2. The rule deploys cleanly and still does not match. A `source` pattern
 *      can be valid JSON, valid path-to-regexp, and match nothing you meant —
 *      exactly how `/(…|lp|…)` came to noindex `/lp` while leaving all 21
 *      `/lp/*` pages indexable. Only a response from a real deployment
 *      disproves that, so the second half runs over the network.
 *
 * A redirect that lands on a 404 is worse than the 404 it replaced: it spends
 * the link equity and delivers nothing. Targets are checked too.
 *
 * Also covers the nested /work/:client/:sub URLs, which are handled by a
 * parameterised rule rather than a fixed map — so the test exercises the RULE
 * (including a path that should NOT resolve) rather than enumerating pages
 * that would drift the moment a new multi-project client is added.
 *
 *   node tests/seo/redirects.test.mjs                    # prod
 *   node tests/seo/redirects.test.mjs --base <preview>   # a preview URL
 *   node tests/seo/redirects.test.mjs --offline          # config check only
 */

import { readFileSync } from 'node:fs'
import { argv, exit } from 'node:process'

import { LEGACY_REDIRECTS } from './legacy-redirects.mjs'

const i = argv.indexOf('--base')
const BASE = (i !== -1 && argv[i + 1] ? argv[i + 1] : 'https://super-conscious.studio').replace(/\/$/, '')
const OFFLINE = argv.includes('--offline')

const pass = []
const fail = []
const check = (ok, msg) => (ok ? pass : fail).push(msg)

// --- 1. config matches the map ---------------------------------------------
const cfg = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))
const allRedirects = cfg.redirects ?? []

// Two kinds live in this array and they are checked differently.
// The legacy map is a fixed set of literal paths and must match exactly.
// Parameterised rules cover an open-ended set, so they are asserted by shape
// here and by behaviour against a real deployment further down.
const PARAMETERISED = {
  '/work/:client/:sub': '/work/:client-:sub',
}

const configured = new Map(
  allRedirects.filter((r) => !r.source.includes(':')).map((r) => [r.source, r]),
)
const expected = Object.entries(LEGACY_REDIRECTS)

check(configured.size === expected.length, `vercel.json has ${expected.length} literal redirects (got ${configured.size})`)

for (const [source, destination] of Object.entries(PARAMETERISED)) {
  const rule = allRedirects.find((r) => r.source === source)
  check(Boolean(rule), `vercel.json declares the parameterised redirect ${source}`)
  if (rule) {
    check(rule.destination === destination, `${source} -> ${destination} (got ${rule.destination})`)
    check(rule.statusCode === 301, `${source} is a 301 (got ${rule.statusCode})`)
  }
}

// The rewrite this replaced must be gone: while it existed, every two-segment
// path under /work returned 200 from shell.html.
check(
  !(cfg.rewrites ?? []).some((r) => /^\/work\/:[^/]+\/:/.test(r.source)),
  'the /work/:a/:b rewrite to shell.html has been removed',
)

for (const [source, destination] of expected) {
  const rule = configured.get(source)
  if (!rule) {
    check(false, `vercel.json declares a redirect for ${source}`)
    continue
  }
  check(rule.destination === destination, `${source} -> ${destination} in vercel.json (got ${rule.destination})`)
  // 308 preserves the method; 301 is what search engines have the longest
  // history with and what was asked for. Either is "permanent" to Google,
  // but pinning it means a silent change to 302 fails here rather than
  // quietly telling Google the move is temporary.
  check(rule.statusCode === 301, `${source} is a 301 (got ${rule.statusCode ?? (rule.permanent ? 308 : 'unset')})`)
}

for (const source of configured.keys()) {
  check(source in LEGACY_REDIRECTS, `vercel.json redirect ${source} is present in the map`)
}

// --- 2. the deployment actually serves them --------------------------------
if (!OFFLINE) {
  for (const [source, destination] of expected) {
    let res
    try {
      res = await fetch(`${BASE}${source}`, { redirect: 'manual' })
    } catch (err) {
      check(false, `GET ${source} reachable (${err.message})`)
      continue
    }
    check(res.status === 301, `GET ${source} returns 301 (got ${res.status})`)

    // Vercel returns an absolute Location; compare on pathname so the check
    // holds against a preview deployment too.
    const location = res.headers.get('location') ?? ''
    let landed = location
    try { landed = new URL(location, BASE).pathname } catch {}
    check(landed === destination, `${source} points at ${destination} (got ${landed || '<no location>'})`)
  }

  // Every distinct target must be a real page.
  for (const destination of new Set(Object.values(LEGACY_REDIRECTS))) {
    let status = 0
    try { status = (await fetch(`${BASE}${destination}`, { redirect: 'manual' })).status } catch {}
    check(status === 200, `target ${destination} returns 200 (got ${status})`)
  }
}

// --- 3. nested /work/:client/:sub ------------------------------------------
//
// ClientOverview used to build `/work/<client>/<sub>` links, and vercel.json
// rewrote EVERY two-segment path under /work to shell.html. So all six links
// on /work/google answered 200 with an empty #root, a noindex tag and a
// canonical pointing at the homepage — noindex and a cross-URL canonical are
// contradictory signals, and because the rewrite matched any two segments it
// was an unbounded space of soft-200s, exactly what the 404 work was meant to
// end.
//
// The links now point at the real flat page. These assertions cover the
// redirect left behind for anything already crawled.
if (!OFFLINE) {
  const NESTED = [
    ['/work/google/ads', '/work/google-ads'],
    ['/work/google/think-with-google', '/work/google-think-with-google'],
    ['/work/arbitrum/openhouse', '/work/arbitrum-openhouse'],
    ['/work/smallhold/content', '/work/smallhold-content'],
  ]

  for (const [from, to] of NESTED) {
    let res
    try {
      res = await fetch(`${BASE}${from}`, { redirect: 'manual' })
    } catch (err) {
      check(false, `GET ${from} reachable (${err.message})`)
      continue
    }
    check(res.status === 301, `GET ${from} returns 301 (got ${res.status})`)
    let landed = res.headers.get('location') ?? ''
    try { landed = new URL(landed, BASE).pathname } catch {}
    check(landed === to, `${from} points at ${to} (got ${landed || '<no location>'})`)
  }

  // The regression itself: a made-up two-segment path must never be a 200.
  // Before this change it was, complete with a canonical pointing home.
  for (const bogus of ['/work/foo/bar', '/work/zzz/qqq']) {
    const res = await fetch(`${BASE}${bogus}`, { redirect: 'manual' })
    check(res.status !== 200, `${bogus} is not a soft 200 (got ${res.status})`)

    const followed = await fetch(`${BASE}${bogus}`)
    check(
      followed.status === 404,
      `${bogus} ends at a real 404 (got ${followed.status})`,
    )
    const html = await followed.text()
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
    check(
      canonical !== `${BASE}/`,
      `${bogus} does not claim the homepage as its canonical (got ${canonical})`,
    )
  }
}

// --- report -----------------------------------------------------------------
for (const m of pass) console.log(`  ok    ${m}`)
for (const m of fail) console.log(`  FAIL  ${m}`)
console.log(`\n${pass.length} passed, ${fail.length} failed${OFFLINE ? ' (offline: config only)' : ` against ${BASE}`}`)
exit(fail.length ? 1 : 0)
