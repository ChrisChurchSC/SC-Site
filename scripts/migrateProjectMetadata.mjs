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

const { projects } = await import(`file://${resolve(__dirname, '..', 'src/data/projects.js')}`)

const existing = await client.fetch(`*[_type == "project"]{_id, "slug": slug.current, descriptor, relationship}`)
const docBySlug = new Map(existing.map(d => [d.slug, d]))

let updated = 0
let tx = client.transaction()

for (const p of projects) {
  const doc = docBySlug.get(p.slug)
  if (!doc) continue
  const set = {}
  if (p.descriptor && !doc.descriptor) set.descriptor = p.descriptor
  if (p.relationship && !doc.relationship) set.relationship = p.relationship
  if (Object.keys(set).length) {
    tx = tx.patch(doc._id, { set })
    updated++
    console.log(`+ ${p.slug.padEnd(30)} ${Object.keys(set).join(', ')}`)
  }
}

if (!process.argv.includes('--apply')) {
  console.log(`\nWould update ${updated} docs. Re-run with --apply.`)
  process.exit(0)
}

if (updated === 0) { console.log('Nothing to update.'); process.exit(0) }

await tx.commit()
console.log(`\nUpdated ${updated} docs.`)
