import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const projectId = env.VITE_SANITY_PROJECT_ID
const dataset = env.VITE_SANITY_DATASET
const token = env.VITE_SANITY_TOKEN

const filePath = resolve(__dirname, '..', 'public/reel-compressed.mp4')
const buf = readFileSync(filePath)

console.log(`Uploading ${(buf.length / 1024 / 1024).toFixed(1)} MB to Sanity...`)

const res = await fetch(
  `https://${projectId}.api.sanity.io/v2024-01-01/assets/files/${dataset}?filename=reel.mp4`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'video/mp4',
    },
    body: buf,
  }
)

if (!res.ok) {
  console.error(`HTTP ${res.status}: ${await res.text()}`)
  process.exit(1)
}

const { document } = await res.json()
console.log(`\nUploaded:`)
console.log(`  _id: ${document._id}`)
console.log(`  url: ${document.url}`)
console.log(`  size: ${(document.size / 1024 / 1024).toFixed(1)} MB`)
