// One-off: create the "Agility Over Headcount" thought (order 004) in Sanity.
// Only touches this single doc; existing thoughts are left untouched.
// Token: reads process.env.VITE_SANITY_TOKEN, falling back to a .env file if present.
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve, basename } from 'path'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '..', '.env')
const fileEnv = existsSync(envPath)
  ? Object.fromEntries(
      readFileSync(envPath, 'utf8')
        .split('\n').filter(l => l.includes('='))
        .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
    )
  : {}

const projectId = process.env.VITE_SANITY_PROJECT_ID || fileEnv.VITE_SANITY_PROJECT_ID || 'ppq16wpu'
const dataset = process.env.VITE_SANITY_DATASET || fileEnv.VITE_SANITY_DATASET || 'production'
const token = process.env.VITE_SANITY_TOKEN || fileEnv.VITE_SANITY_TOKEN

if (!token) {
  console.error('Missing VITE_SANITY_TOKEN (env var or .env). Mint an Editor token at manage.sanity.io → project ppq16wpu → API → Tokens.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })
const key = () => randomBytes(6).toString('hex')

const SLUG = 'agility-over-headcount'
const { thoughts } = await import(`file://${resolve(__dirname, '..', 'src/data/thoughts.js')}`)
const t = thoughts.find(x => x.slug === SLUG)
if (!t) { console.error(`No static thought with slug ${SLUG}`); process.exit(1) }

async function uploadImage(localPath) {
  const abs = resolve(__dirname, '..', 'public', localPath.replace(/^\//, ''))
  const buf = readFileSync(abs)
  const ext = abs.split('.').pop().toLowerCase()
  const ctype = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg'
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=${basename(abs)}`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': ctype }, body: buf }
  )
  if (!res.ok) throw new Error(`upload failed for ${localPath}: ${await res.text()}`)
  const { document } = await res.json()
  console.log(`  uploaded ${basename(abs)} -> ${document._id}`)
  return document._id
}

const apply = process.argv.includes('--apply')
console.log(apply ? 'APPLYING\n' : 'DRY RUN (pass --apply to write)\n')

const heroAssetId = t.hero && apply ? await uploadImage(t.hero) : null

const body = t.body.map(item => {
  if (item.type === 'p') return { _key: key(), _type: 'paragraphBlock', text: item.text }
  if (item.type === 'h2') return { _key: key(), _type: 'headingBlock', text: item.text }
  return null
}).filter(Boolean)

const doc = {
  _id: `thought-${t.slug}`,
  _type: 'thought',
  title: t.title,
  slug: { _type: 'slug', current: t.slug },
  excerpt: t.excerpt || '',
  publishedAt: t.isoDate,
  order: parseInt(t.n, 10),
  body,
}
if (heroAssetId) doc.hero = { _type: 'image', asset: { _type: 'reference', _ref: heroAssetId } }

console.log(`  _id: ${doc._id}`)
console.log(`  title: ${doc.title}`)
console.log(`  order: ${doc.order}  publishedAt: ${doc.publishedAt}`)
console.log(`  body items: ${body.length} paragraphs`)

if (!apply) { console.log('\nDry run complete. Re-run with --apply.'); process.exit(0) }

await client.createOrReplace(doc)
console.log(`\nWrote ${doc._id} to Sanity (${dataset}).`)
