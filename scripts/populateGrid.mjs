import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'

const client = createClient({
  projectId: 'ppq16wpu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skisMmH7Jxc6ppkaGZtZ4kV1bdvtbLHz7rbEWEZyhH3fgJXF31MqZ5NOulDPkY43vkKvuwJP9ZlA7pv2SEx2wwOZmJUHvDMi4twcsV6qAq2XYBatMjYqaN3Zj6vxvu3qlY0nTgUKiuvfPHWfbJBP9p8aZdRpvVFVjYEQTrB4RbkFqBrrPyai',
  useCdn: false,
})

const key = () => randomBytes(6).toString('hex')

const ref = (slug) => ({ _type: 'reference', _ref: `project-${slug}` })

const blocks = [
  // Row 1
  { label: '001', mediaType: 'video', videoUrl: '/reel-preview.gif' },
  { label: '002', mediaType: 'none', project: ref('world-within') },

  // Row 2
  { label: '003', mediaType: 'video', videoUrl: '/grid/oxyle-hero.mp4', project: ref('oxyle') },
  { label: '004', mediaType: 'none', project: ref('deep-dive-films') },
  { label: '005', mediaType: 'none', project: ref('mindmatter') },

  // Row 3
  { label: '006', mediaType: 'none', project: ref('concis-labs') },
  { label: '007', mediaType: 'none', project: ref('big-buoy') },
  { label: '008', mediaType: 'none' },
  { label: '009', mediaType: 'none' },

  // Row 4
  { label: '010', mediaType: 'none' },
  { label: '011', mediaType: 'none' },

  // Row 5
  { label: '012', mediaType: 'video', videoUrl: '/grid/smashburger.mp4' },
  { label: '013', mediaType: 'video', videoUrl: '/grid/0421.mov' },
  { label: '014', mediaType: 'video', videoUrl: '/grid/nimruz-logo.mp4' },

  // Row 6
  { label: '015', mediaType: 'none' },
  { label: '016', mediaType: 'none' },
  { label: '017', mediaType: 'none' },

  // Row 7
  { label: '018', mediaType: 'none' },
  { label: '019', mediaType: 'video', videoUrl: '/grid/big-crispy.mp4' },
  { label: '020', mediaType: 'video', videoUrl: '/grid/empy-01.mov' },

  // Row 8
  { label: '021', mediaType: 'video', videoUrl: '/grid/ww-sizzle.mp4' },
  { label: '022', mediaType: 'none' },

  // Row 9
  { label: '023', mediaType: 'none' },
  { label: '024', mediaType: 'none' },
  { label: '025', mediaType: 'none' },
  { label: '026', mediaType: 'none' },

  // Row 10
  { label: '027', mediaType: 'none' },
  { label: '028', mediaType: 'none' },
  { label: '029', mediaType: 'none' },

  // Row 11
  { label: '030', mediaType: 'none' },
]

const doc = {
  _type: 'homepageGrid',
  _id: 'homepage-grid',
  blocks: blocks.map(b => ({ _key: key(), ...b })),
}

await client.createOrReplace(doc)
console.log('✓ Homepage grid created with', blocks.length, 'blocks')
