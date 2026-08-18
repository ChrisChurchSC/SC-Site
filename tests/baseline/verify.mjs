#!/usr/bin/env node
/**
 * Re-captures the site and fails on any INVARIANT that moved.
 *
 * The hardening pass changes things on purpose, so this cannot just diff
 * everything — it would be red permanently and everyone would stop reading it.
 * It asserts only the properties that must survive every change, and routes
 * intentional changes through an explicit accepted-changes file so that
 * accepting a delta is a visible, reviewable act rather than a silent one.
 *
 *   node tests/baseline/verify.mjs                  # against prod
 *   node tests/baseline/verify.mjs --base <url>     # against a preview/local build
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { argv, exit } from 'node:process'

const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : d
}

const BASELINE = 'tests/baseline/prod-baseline.json'
const ACCEPTED = 'tests/baseline/accepted-changes.json'
const TMP = 'tests/baseline/.current.json'

if (!existsSync(BASELINE)) {
  console.error(`No baseline at ${BASELINE}. Run capture.mjs first.`)
  exit(2)
}

const base = JSON.parse(readFileSync(BASELINE, 'utf8'))
const accepted = existsSync(ACCEPTED) ? JSON.parse(readFileSync(ACCEPTED, 'utf8')) : { routes: {} }

execFileSync('node', ['tests/baseline/capture.mjs', '--out', TMP, '--base', arg('base', base.base)], {
  stdio: ['ignore', 'ignore', 'inherit'],
})
const now = JSON.parse(readFileSync(TMP, 'utf8'))
unlinkSync(TMP)

/** Properties that must never drift without an explicit acceptance. */
const INVARIANTS = [
  ['status', (a, b) => a === b],
  ['title', (a, b) => a === b],
  ['canonical', (a, b) => a === b],
  ['robotsMeta', (a, b) => a === b],
  ['xRobotsTag', (a, b) => a === b],
  // Prose changes freely; a page emptying out is a regression.
  ['rootContentBucket', (a, b) => a === b],
  ['jsonLdTypes', (a, b) => JSON.stringify(a) === JSON.stringify(b)],
]

const failures = []
const notes = []

for (const [path, was] of Object.entries(base.routes)) {
  const is = now.routes[path]
  if (!is) {
    failures.push(`${path}: ROUTE DISAPPEARED (was ${was.status})`)
    continue
  }
  const ok = accepted.routes?.[path] ?? []
  for (const [key, eq] of INVARIANTS) {
    if (ok.includes(key)) continue
    if (!eq(was[key], is[key])) {
      failures.push(`${path}: ${key}\n      was: ${JSON.stringify(was[key])}\n      now: ${JSON.stringify(is[key])}`)
    }
  }
  // Not fatal — a page losing most of its text is worth seeing, not blocking.
  const drop = was.rootContentLength - is.rootContentLength
  if (was.rootContentLength > 0 && drop / was.rootContentLength > 0.4) {
    notes.push(`${path}: content shrank ${Math.round((drop / was.rootContentLength) * 100)}% (${was.rootContentLength} -> ${is.rootContentLength})`)
  }
}

for (const path of Object.keys(now.routes)) {
  if (!base.routes[path]) notes.push(`${path}: new route (not in baseline)`)
}

if (notes.length) {
  console.log(`\nNotes (${notes.length}):`)
  for (const n of notes) console.log(`  - ${n}`)
}

if (failures.length) {
  console.error(`\nINVARIANT VIOLATIONS (${failures.length}):`)
  for (const f of failures) console.error(`  ✗ ${f}`)
  console.error(`\nIf a change is intentional, add the property to ${ACCEPTED} under that route.`)
  exit(1)
}

console.log(`\n✓ All invariants hold across ${Object.keys(base.routes).length} routes.`)
