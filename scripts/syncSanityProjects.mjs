import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '..', '.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const client = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: env.VITE_SANITY_TOKEN,
  useCdn: false,
})

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const projectsSrc = readFileSync(resolve(__dirname, '..', 'src/data/projects.js'), 'utf8')
const projects = (await import(`file://${resolve(__dirname, '..', 'src/data/projects.js')}`)).projects

const desired = new Map()

for (const p of projects) {
  const isMulti = (p.work?.length ?? 0) >= 2
  desired.set(p.slug, {
    name: p.name,
    slug: p.slug,
    type: p.type ?? '',
    order: parseInt(p.n, 10),
    role: isMulti ? 'overview' : 'single',
  })
  if (isMulti) {
    for (const workName of p.work) {
      const subSlug = `${p.slug}-${slugify(workName)}`
      desired.set(subSlug, {
        name: `${p.name} — ${workName}`,
        slug: subSlug,
        type: workName,
        order: parseInt(p.n, 10) * 100,
        role: 'sub',
        parentSlug: p.slug,
      })
    }
  }
}

const existing = await client.fetch(`*[_type == "project"]{_id, "slug": slug.current, name, "hasContent": defined(sections)}`)
const existingMap = new Map(existing.map(d => [d.slug, d]))

const toCreate = []
const toDelete = []
const toKeep = []

for (const [slug, d] of desired) {
  if (!existingMap.has(slug)) toCreate.push(d)
  else toKeep.push(slug)
}

for (const d of existing) {
  if (!desired.has(d.slug)) toDelete.push(d)
}

console.log(`\n=== PLAN ===`)
console.log(`Desired: ${desired.size} docs`)
console.log(`Existing: ${existing.length} docs`)
console.log(`To create: ${toCreate.length}`)
console.log(`To delete: ${toDelete.length}`)
console.log(`To keep: ${toKeep.length}`)

console.log(`\n--- CREATE (${toCreate.length}) ---`)
for (const d of toCreate) {
  console.log(`  + ${d.slug.padEnd(50)} [${d.role}] ${d.name}`)
}

console.log(`\n--- DELETE (${toDelete.length}) ---`)
for (const d of toDelete) {
  const flag = d.hasContent ? ' ⚠ HAS CONTENT' : ''
  console.log(`  - ${d.slug?.padEnd(50)} ${d.name ?? '(no name)'}${flag}`)
}

const apply = process.argv.includes('--apply')

if (!apply) {
  console.log(`\nDry run. Re-run with --apply to execute.`)
  process.exit(0)
}

const contentLossDocs = toDelete.filter(d => d.hasContent)
if (contentLossDocs.length > 0 && !process.argv.includes('--force')) {
  console.error(`\n⛔ Refusing to delete ${contentLossDocs.length} docs with content. Re-run with --force to override.`)
  for (const d of contentLossDocs) console.error(`     ${d.slug}`)
  process.exit(1)
}

console.log(`\n=== APPLYING ===`)

for (const d of toCreate) {
  const doc = {
    _type: 'project',
    name: d.name,
    slug: { _type: 'slug', current: d.slug },
    type: d.type,
    order: d.order,
    published: true,
  }
  const res = await client.create(doc)
  console.log(`  + created ${d.slug} (${res._id})`)
}

for (const d of toDelete) {
  await client.delete(d._id)
  console.log(`  - deleted ${d.slug} (${d._id})`)
}

console.log(`\nDone.`)
