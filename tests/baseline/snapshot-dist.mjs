#!/usr/bin/env node
/**
 * Fingerprints the BUILT output so a dependency bump can be proved inert.
 *
 * Comparing deployed URLs cannot do this — production still runs the old code.
 * The artifact is the only place a routing-library upgrade shows up before it
 * ships, and the prerendered HTML is exactly what a crawler will see.
 *
 * Content hashes in asset filenames change whenever a dependency changes, so
 * they are normalised out; what must not change is the RENDERED MARKUP.
 *
 *   node tests/baseline/snapshot-dist.mjs out.json
 */

import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { argv } from 'node:process'

const OUT = argv[2] || 'dist-snapshot.json'

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (full.endsWith('.html')) acc.push(full)
  }
  return acc
}

/** Remove build-varying noise so only meaningful markup differences remain. */
const normalise = (html) =>
  html
    .replace(/-[A-Za-z0-9_-]{8,}\.(js|css)/g, '-[hash].$1')
    .replace(/\s+/g, ' ')
    .trim()

const files = walk('dist').sort()
const snapshot = {}
for (const f of files) {
  const html = normalise(readFileSync(f, 'utf8'))
  snapshot[relative('dist', f)] = {
    sha: createHash('sha256').update(html).digest('hex').slice(0, 16),
    bytes: html.length,
  }
}

writeFileSync(OUT, JSON.stringify({ fileCount: files.length, files: snapshot }, null, 2))
console.log(`${files.length} prerendered pages fingerprinted -> ${OUT}`)
