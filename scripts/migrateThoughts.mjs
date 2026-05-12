import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve, basename } from 'path'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const projectId = env.VITE_SANITY_PROJECT_ID
const dataset = env.VITE_SANITY_DATASET
const token = env.VITE_SANITY_TOKEN

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

const { thoughts } = await import(`file://${resolve(__dirname, '..', 'src/data/thoughts.js')}`)

const key = () => randomBytes(6).toString('hex')

const uploadCache = new Map()
async function uploadImage(localPath) {
  if (uploadCache.has(localPath)) return uploadCache.get(localPath)
  const abs = resolve(__dirname, '..', 'public', localPath.replace(/^\//, ''))
  const buf = readFileSync(abs)
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=${basename(abs)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/png' },
      body: buf,
    }
  )
  if (!res.ok) throw new Error(`upload failed for ${localPath}: ${await res.text()}`)
  const { document } = await res.json()
  uploadCache.set(localPath, document._id)
  console.log(`  uploaded ${basename(abs)} -> ${document._id}`)
  return document._id
}

const apply = process.argv.includes('--apply')
console.log(apply ? 'APPLYING\n' : 'DRY RUN\n')

const docs = []
for (const t of thoughts) {
  console.log(`\n${t.slug}`)
  const heroAssetId = t.hero && apply ? await uploadImage(t.hero) : null

  const body = []
  for (const item of t.body) {
    if (item.type === 'p') {
      body.push({ _key: key(), _type: 'paragraphBlock', text: item.text })
    } else if (item.type === 'h2') {
      body.push({ _key: key(), _type: 'headingBlock', text: item.text })
    } else if (item.type === 'img') {
      const assetId = apply ? await uploadImage(item.src) : `image-PLACEHOLDER-${item.src}`
      body.push({
        _key: key(),
        _type: 'imageBlock',
        image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
        alt: item.alt || '',
      })
    }
  }

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
  if (heroAssetId) {
    doc.hero = { _type: 'image', asset: { _type: 'reference', _ref: heroAssetId } }
  }

  console.log(`  title: ${doc.title}`)
  console.log(`  publishedAt: ${doc.publishedAt}`)
  console.log(`  body items: ${body.length} (${body.filter(b => b._type === 'paragraphBlock').length}p, ${body.filter(b => b._type === 'headingBlock').length}h2, ${body.filter(b => b._type === 'imageBlock').length}img)`)

  docs.push(doc)
}

if (!apply) {
  console.log(`\nDry run. Re-run with --apply.`)
  process.exit(0)
}

let tx = client.transaction()
for (const d of docs) tx = tx.createOrReplace(d)
await tx.commit()
console.log(`\nWrote ${docs.length} thought docs.`)
