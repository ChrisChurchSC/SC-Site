#!/usr/bin/env node
/**
 * Proves the sales-deck gate is real, against the BUILT output.
 *
 * The gate this replaced compared a password inside a React component while the
 * deck chunks sat on the CDN as ordinary public files — the rate card was
 * anonymously downloadable and the password shipped in the bundle. These
 * assertions exist so that cannot silently come back: a future refactor that
 * pulls a deck component into the shared graph, or reverts the chunk routing,
 * fails here rather than in the wild.
 *
 *   node tests/security/deck-gate.test.mjs              # checks dist/
 *   node tests/security/deck-gate.test.mjs --live URL   # also probes a deployment
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { argv, exit } from 'node:process'

const DIST = 'dist/assets'
const GATED_DIR = join(DIST, 'deck')
const fail = []
const pass = []
const check = (ok, msg) => (ok ? pass : fail).push(msg)

if (!existsSync(DIST)) {
  console.error('No dist/ — run `npm run build` first.')
  exit(2)
}

// 1. Gated chunks land where the middleware expects them.
const gated = existsSync(GATED_DIR) ? readdirSync(GATED_DIR).filter((f) => f.endsWith('.js')) : []
check(gated.length >= 6, `gated chunks emitted under assets/deck/ (found ${gated.length}, expect >= 6)`)

// 2. Ungated assets carry no hourly rate card. Marketing RANGES on /lp are
//    published deliberately, so this targets the confidential signal — a rate
//    stated per hour — not any dollar figure.
const HOURLY = /\$\s?\d{2,3}\s*(?:\/\s?hr\b|per hour|an hour|\/hour)/i
for (const f of readdirSync(DIST).filter((f) => f.endsWith('.js') || f.endsWith('.css'))) {
  const hit = readFileSync(join(DIST, f), 'utf8').match(HOURLY)
  check(!hit, `no hourly rate card in ${f}${hit ? ` — found "${hit[0]}"` : ''}`)
}

// 3. No password constant survives anywhere in the build.
let leaked = ''
try {
  leaked = execFileSync('grep', ['-rl', '-e', 'sc-preview', '-e', 'HUB_PASSWORD', 'dist'], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()
} catch { leaked = '' } // grep exits 1 when nothing matches, which is the pass case
check(leaked === '', `no password constant in dist/${leaked ? ` — in ${leaked.split('\n').length} file(s)` : ''}`)

// 4. The enforcement points exist and fail closed.
const mw = existsSync('middleware.js') ? readFileSync('middleware.js', 'utf8') : ''
check(mw.includes('/assets/deck/'), 'middleware matches the gated asset path')
check(/if \(!secret\)/.test(mw) && /status: 5\d\d/.test(mw), 'middleware fails closed when DECK_SECRET is unset')
check(!/HUB_PASSWORD|sc-preview/.test(readFileSync('src/components/DeckGate.jsx', 'utf8')),
  'DeckGate holds no password')
check(!/HUB_PASSWORD|sc-preview/.test(readFileSync('src/pages/LandingHub.jsx', 'utf8')),
  'LandingHub holds no password')

// 5. Optional live probe against a real deployment.
const i = argv.indexOf('--live')
if (i !== -1 && argv[i + 1] && gated[0]) {
  const base = argv[i + 1].replace(/\/$/, '')
  const res = await fetch(`${base}/assets/deck/${gated[0]}`, { redirect: 'manual' })
  check([401, 403, 503].includes(res.status),
    `anonymous GET /assets/deck/${gated[0]} refused (got ${res.status})`)
}

for (const p of pass) console.log(`  ✓ ${p}`)
if (fail.length) {
  console.error(`\nDECK GATE FAILURES (${fail.length}):`)
  for (const f of fail) console.error(`  ✗ ${f}`)
  exit(1)
}
console.log(`\n✓ Deck gate holds (${pass.length} assertions).`)
