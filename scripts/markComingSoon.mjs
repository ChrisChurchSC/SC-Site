import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: env.VITE_SANITY_TOKEN,
  useCdn: false,
})

const COMING_SOON = [
  'arbitrum-rebrand',
  'arbitrum-interview-series',
  'arbitrum-product-videos',
  'offchain',
  'wonderwerk-rebrand',
  'wonderwerk-content',
  'world-within-brand-ii',
  'world-within-social',
  'world-within-content',
  'world-within-how-to-change-the-world',
  'oxyle',
  'aris-brand',
  'aris-content',
  'nimruz-brand',
  'nimruz-content',
  'smashburger-brand',
  'smashburger-content',
  'concis-labs-brand',
  'concis-labs-content',
  'big-buoy-brand',
  'big-buoy-content',
  'deep-dive-films-brand',
  'deep-dive-films-content',
  'starchase-brand',
  'starchase-content',
  'yellow-dog',
  'kindling',
  'soft-science',
  'girlfight-brand',
  'girlfight-content',
  'helen-maroulis',
  'coldwater-club',
  'fieldston',
  'novi',
  'hylands',
  'perm-agriculture',
  'smallhold-content',
  'entropy',
  'infura',
]

const existing = await client.fetch(`*[_type == "project"]{_id, "slug": slug.current}`)
const idBySlug = new Map(existing.map(d => [d.slug, d._id]))

const setComing = []
const setReady = []
const missing = []

for (const slug of COMING_SOON) {
  if (!idBySlug.has(slug)) { missing.push(slug); continue }
  setComing.push({ slug, _id: idBySlug.get(slug) })
}

for (const d of existing) {
  if (!COMING_SOON.includes(d.slug)) setReady.push(d)
}

console.log(`\nComing Soon: ${setComing.length}`)
console.log(`Ready:       ${setReady.length}`)
console.log(`Missing:     ${missing.length}`)
if (missing.length) { console.log('Missing slugs:'); missing.forEach(s => console.log(`  - ${s}`)) }

if (!process.argv.includes('--apply')) {
  console.log(`\nDry run. Re-run with --apply.`)
  process.exit(0)
}

let tx = client.transaction()
for (const d of setComing) tx = tx.patch(d._id, { set: { comingSoon: true } })
for (const d of setReady) tx = tx.patch(d._id, { set: { comingSoon: false } })
await tx.commit()

console.log(`\nPatched ${setComing.length + setReady.length} docs.`)
