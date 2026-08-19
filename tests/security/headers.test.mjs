#!/usr/bin/env node
/**
 * Asserts the security and caching headers are actually SERVED.
 *
 * vercel.json is not self-verifying: a rule can be syntactically valid, deploy
 * without error, and still not match the paths you meant. The only proof is a
 * response from a real deployment, so this runs against a URL rather than the
 * repo.
 *
 *   node tests/security/headers.test.mjs                    # prod
 *   node tests/security/headers.test.mjs --base <preview>   # a preview URL
 */

import { argv, exit } from 'node:process'

const i = argv.indexOf('--base')
const BASE = (i !== -1 && argv[i + 1] ? argv[i + 1] : 'https://super-conscious.studio').replace(/\/$/, '')

const pass = []
const fail = []
const check = (ok, msg) => (ok ? pass : fail).push(msg)

const headersFor = async (path) => {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  return { status: res.status, h: res.headers }
}

// --- headers that must be on every document response ------------------------
const { h, status } = await headersFor('/')
check(status === 200, `GET / returns 200 (got ${status})`)

const REQUIRED = {
  'x-content-type-options': (v) => v === 'nosniff',
  'x-frame-options': (v) => /^(SAMEORIGIN|DENY)$/i.test(v || ''),
  'referrer-policy': (v) => /strict-origin-when-cross-origin/i.test(v || ''),
  'permissions-policy': (v) => /camera=\(\)/.test(v || ''),
  'strict-transport-security': (v) => /max-age=\d+/.test(v || ''),
}
for (const [name, valid] of Object.entries(REQUIRED)) {
  const value = h.get(name)
  check(value && valid(value), `${name}: ${value ?? 'ABSENT'}`)
}

// --- CSP --------------------------------------------------------------------
// Report-Only while we learn what it would break. When this flips to enforcing,
// change the header name here and the assertion below fails loudly if the
// deployment still only reports.
const csp = h.get('content-security-policy-report-only') || h.get('content-security-policy')
check(!!csp, 'a CSP is present (report-only or enforcing)')
if (csp) {
  // Origins measured from the real site — if one is dropped, the feature it
  // serves breaks. These assertions are the record of why each is there.
  const MUST_ALLOW = [
    ['https://www.googletagmanager.com', 'GTM + GA4 tag'],
    ['https://app.cal.com', 'discovery-call booking embed'],
    ['https://ppq16wpu.api.sanity.io', 'CMS content at runtime'],
    ['https://cdn.sanity.io', 'case-study images and video'],
    ['https://fonts.gstatic.com', 'self-hosted font files'],
    ['https://formspree.io', 'lead capture — both forms'],
    ['https://va.vercel-scripts.com', 'Vercel Analytics'],
  ]
  for (const [origin, why] of MUST_ALLOW) {
    check(csp.includes(origin), `CSP allows ${origin} (${why})`)
  }
  check(/frame-ancestors\s+'self'/.test(csp), "CSP sets frame-ancestors 'self' (clickjacking)")
  check(/object-src\s+'none'/.test(csp), "CSP sets object-src 'none'")
  check(/form-action[^;]*formspree\.io/.test(csp), 'CSP form-action allows Formspree')
}

// --- caching ----------------------------------------------------------------
const homepage = await (await fetch(BASE)).text()
const asset = homepage.match(/\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/)?.[0]
if (asset) {
  const a = await headersFor(asset)
  const cc = a.h.get('cache-control') || ''
  check(/immutable/.test(cc) && /max-age=\d{6,}/.test(cc),
    `content-hashed asset is cached long-term: ${cc || 'ABSENT'}`)
} else {
  check(false, 'could not find a hashed asset on the homepage to check caching')
}

// --- the noindex rules the SEO work depends on ------------------------------
for (const p of ['/privacy', '/terms', '/lp']) {
  const r = await headersFor(p)
  check(/noindex/i.test(r.h.get('x-robots-tag') || ''), `${p} still carries X-Robots-Tag: noindex`)
}

for (const p of pass) console.log(`  ✓ ${p}`)
if (fail.length) {
  console.error(`\nHEADER FAILURES (${fail.length}):`)
  for (const f of fail) console.error(`  ✗ ${f}`)
  exit(1)
}
console.log(`\n✓ Headers correct (${pass.length} assertions) against ${BASE}`)
