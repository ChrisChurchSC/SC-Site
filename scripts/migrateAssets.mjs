import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const SRC_PROJECT = '5c0wc2sa'
const SRC_TOKEN = 'skRNmwHWQwZ8W8zgVuCIet6EVcTG09BPuT6LXUeGXidQceOcSbPdYl7fEzHeNvJ6ANxAn1JCBmtfkdsFcM2ipzyOuTtAWtTg1rxBglw9ddYfTiOoK3N5hgDdJsF48jLDzlSXmXJmgUZS5R7HXzxbTHxrGHH2o5y64xciRoNYbOOFBckKWorp'

const DST_PROJECT = 'ppq16wpu'
const DST_TOKEN = 'skisMmH7Jxc6ppkaGZtZ4kV1bdvtbLHz7rbEWEZyhH3fgJXF31MqZ5NOulDPkY43vkKvuwJP9ZlA7pv2SEx2wwOZmJUHvDMi4twcsV6qAq2XYBatMjYqaN3Zj6vxvu3qlY0nTgUKiuvfPHWfbJBP9p8aZdRpvVFVjYEQTrB4RbkFqBrrPyai'
const DST_UPLOAD = `https://${DST_PROJECT}.api.sanity.io/v2024-01-01/assets/images/production`

// Fetch all image assets from source project
const res = await fetch(
  `https://${SRC_PROJECT}.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="sanity.imageAsset"]{_id,url,originalFilename,mimeType}`,
  { headers: { Authorization: `Bearer ${SRC_TOKEN}` } }
)
const { result: assets } = await res.json()
console.log(`Found ${assets.length} images in source project\n`)

for (const asset of assets) {
  const filename = asset.originalFilename || asset._id
  try {
    // Download from source CDN
    const imgRes = await fetch(asset.url)
    if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`)
    const buffer = await imgRes.arrayBuffer()

    // Upload to destination project
    const uploadRes = await fetch(`${DST_UPLOAD}?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DST_TOKEN}`,
        'Content-Type': asset.mimeType || 'image/jpeg',
      },
      body: buffer,
    })
    const data = await uploadRes.json()
    if (!uploadRes.ok) throw new Error(JSON.stringify(data))
    console.log(`✓ ${filename}`)
    console.log(`  old: ${asset._id}`)
    console.log(`  new: ${data.document._id}\n`)
  } catch (err) {
    console.error(`✗ ${filename}: ${err.message}`)
  }
}

console.log('Done.')
