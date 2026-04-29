import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const PROJECT_ID = 'ppq16wpu'
const DATASET = 'production'
const TOKEN = 'skisMmH7Jxc6ppkaGZtZ4kV1bdvtbLHz7rbEWEZyhH3fgJXF31MqZ5NOulDPkY43vkKvuwJP9ZlA7pv2SEx2wwOZmJUHvDMi4twcsV6qAq2XYBatMjYqaN3Zj6vxvu3qlY0nTgUKiuvfPHWfbJBP9p8aZdRpvVFVjYEQTrB4RbkFqBrrPyai'
const UPLOAD_URL = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}`

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const BASE = join(dirname(fileURLToPath(import.meta.url)), '../public/cs')

function getFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...getFiles(full))
    } else if (IMAGE_EXTS.includes(extname(full).toLowerCase())) {
      results.push(full)
    }
  }
  return results
}

const files = getFiles(BASE)
console.log(`Uploading ${files.length} images...\n`)

for (const filePath of files) {
  const filename = basename(filePath)
  try {
    const buffer = readFileSync(filePath)
    const res = await fetch(`${UPLOAD_URL}?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'image/jpeg',
      },
      body: buffer,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))
    console.log(`✓ ${filename}`)
    console.log(`  _ref: ${data.document._id}\n`)
  } catch (err) {
    console.error(`✗ ${filename}: ${err.message}`)
  }
}

console.log('Done.')
