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

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const { projects } = await import(`file://${resolve(__dirname, '..', 'src/data/projects.js')}`)

const existing = await client.fetch(`*[_type == "project"]{_id, "slug": slug.current, order, name, type}`)
const docBySlug = new Map(existing.map(d => [d.slug, d]))

const desired = []
for (const p of projects) {
  const n = parseInt(p.n, 10)
  desired.push({ slug: p.slug, order: n, name: p.name, type: p.type })
  if ((p.work?.length ?? 0) >= 1) {
    p.work.forEach((workName, i) => {
      desired.push({ slug: `${p.slug}-${slugify(workName)}`, order: n * 100 + i, type: workName })
    })
  }
}

let tx = client.transaction()
let count = 0
for (const d of desired) {
  const doc = docBySlug.get(d.slug)
  if (!doc) continue
  const set = {}
  if (doc.order !== d.order) set.order = d.order
  if (d.name && doc.name !== d.name) set.name = d.name
  if (d.type && doc.type !== d.type) set.type = d.type
  if (Object.keys(set).length === 0) continue
  tx = tx.patch(doc._id, { set })
  count++
  console.log(`+ ${d.slug.padEnd(50)} ${Object.keys(set).join(', ')}`)
}

if (!process.argv.includes('--apply')) {
  console.log(`\nWould update ${count} docs. Re-run with --apply.`)
  process.exit(0)
}

if (count === 0) { console.log('Nothing to update.'); process.exit(0) }

await tx.commit()
console.log(`\nUpdated ${count} docs.`)
