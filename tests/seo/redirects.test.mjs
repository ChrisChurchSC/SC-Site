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
const configured = new Map((cfg.redirects ?? []).map((r) => [r.source, r]))
const expected = Object.entries(LEGACY_REDIRECTS)

check(configured.size === expected.length, `vercel.json has ${expected.length} redirects (got ${configured.size})`)

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

// --- report -----------------------------------------------------------------
for (const m of pass) console.log(`  ok    ${m}`)
for (const m of fail) console.log(`  FAIL  ${m}`)
console.log(`\n${pass.length} passed, ${fail.length} failed${OFFLINE ? ' (offline: config only)' : ` against ${BASE}`}`)
exit(fail.length ? 1 : 0)
