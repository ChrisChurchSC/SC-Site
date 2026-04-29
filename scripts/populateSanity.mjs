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

// ── Projects list ────────────────────────────────────────────────────────────
const projects = [
  { order: 1,  name: 'Joon',             type: 'Brand',           year: '2025', slug: 'joon' },
  { order: 2,  name: 'Concis Labs',      type: 'Web',             year: '2025', slug: 'concis-labs' },
  { order: 3,  name: 'Big Buoy',         type: 'Product',         year: '2025', slug: 'big-buoy' },
  { order: 4,  name: 'Transcend',        type: 'Brand',           year: '2024', slug: 'transcend' },
  { order: 5,  name: 'Oxyle',            type: 'Brand + Web',     year: '2024', slug: 'oxyle' },
  { order: 6,  name: 'Mindmatter',       type: 'Brand',           year: '2024', slug: 'mindmatter' },
  { order: 7,  name: 'Deep Dive Films',  type: 'Brand + Web',     year: '2024', slug: 'deep-dive-films' },
  { order: 8,  name: 'Vessel',           type: 'Brand',           year: '2024', slug: 'vessel' },
  { order: 9,  name: 'Halfday',          type: 'Campaign',        year: '2024', slug: 'halfday' },
  { order: 10, name: 'Pollen',           type: 'Brand + Web',     year: '2023', slug: 'pollen' },
  { order: 11, name: 'Marketing Dept',   type: 'Content',         year: '2023', slug: 'marketing-dept' },
  { order: 12, name: 'Dune Studio',      type: 'Web',             year: '2023', slug: 'dune-studio' },
  { order: 13, name: 'Overland',         type: 'Campaign',        year: '2023', slug: 'overland' },
  { order: 14, name: 'Forma',            type: 'Brand + Web',     year: '2023', slug: 'forma' },
  { order: 15, name: 'Gather',           type: 'Brand',           year: '2023', slug: 'gather' },
  { order: 16, name: 'Meridian',         type: 'Brand',           year: '2022', slug: 'meridian' },
  { order: 17, name: 'Soft Science',     type: 'Campaign',        year: '2022', slug: 'soft-science' },
  { order: 18, name: 'World Within',     type: 'Campaign',        year: '2022', slug: 'world-within' },
  { order: 19, name: 'Arbitrum',         type: 'Brand + Content', year: '2022', slug: 'arbitrum' },
  { order: 20, name: 'North Quarter',    type: 'Brand',           year: '2022', slug: 'north-quarter' },
  { order: 21, name: 'Atlas',            type: 'Campaign',        year: '2022', slug: 'atlas' },
  { order: 22, name: 'Kindling',         type: 'Brand',           year: '2021', slug: 'kindling' },
  { order: 23, name: 'Open Field',       type: 'Web',             year: '2021', slug: 'open-field' },
  { order: 24, name: 'Liminal',          type: 'Brand + Web',     year: '2021', slug: 'liminal' },
  { order: 25, name: 'Hollow',           type: 'Brand',           year: '2021', slug: 'hollow' },
  { order: 26, name: 'Terrain',          type: 'Campaign',        year: '2021', slug: 'terrain' },
  { order: 27, name: 'Clearwater',       type: 'Brand',           year: '2020', slug: 'clearwater' },
  { order: 28, name: 'Still Life',       type: 'Campaign',        year: '2020', slug: 'still-life' },
  { order: 29, name: 'Prospect',         type: 'Brand + Web',     year: '2020', slug: 'prospect' },
  { order: 30, name: 'Founders Table',   type: 'Brand',           year: '2020', slug: 'founders-table' },
]

// ── Case study content ───────────────────────────────────────────────────────
const caseStudies = {
  'world-within': {
    tagline: 'A full brand and campaign system for a mission-driven organization raising capital through culture.',
    summary: 'World Within is a mission-driven organization working at the intersection of capital, culture, and community. They came to us without a brand, without a web presence, and with a launch window of under 90 days. We built their full identity system from scratch — naming architecture, visual language, motion principles, and a content framework that could scale across paid media, live events, and organic social. The campaign launched in Q4 2022 and exceeded every benchmark they set.',
    services: ['Brand Identity', 'Website', 'Social', 'Animation', 'Marketing'],
    outcomes: [
      { _key: key(), category: 'Fundraising', outcome: 'Raised $2.4M in their first public campaign launch.' },
      { _key: key(), category: 'Partnerships', outcome: 'Secured 3 institutional partnerships within 60 days of launch.' },
      { _key: key(), category: 'Awareness', outcome: 'Grew social following by 180% over the campaign period.' },
    ],
    sections: [
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'textSection', heading: 'The Challenge', body: 'World Within needed a visual language that could carry both the weight of their mission and the energy of their community. The brand had to feel credible to institutional partners while remaining human and accessible to everyday donors.' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 7, ratio: '16/9' }, { _key: key(), cols: 5, ratio: '4/5' }] },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 4, ratio: '4/5' }, { _key: key(), cols: 4, ratio: '4/5' }, { _key: key(), cols: 4, ratio: '4/5' }] },
      { _key: key(), _type: 'textSection', heading: 'The Approach', body: 'We developed a unified brand system — identity, motion language, and a content framework — that could flex across every touchpoint from paid social to live events. Every decision was made to serve the mission first.' },
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 5, ratio: '4/5' }, { _key: key(), cols: 7, ratio: '16/9' }] },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 6, ratio: '16/9' }, { _key: key(), cols: 6, ratio: '16/9' }] },
      { _key: key(), _type: 'imageFullSection', ratio: '9/16' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 4, ratio: '4/5' }, { _key: key(), cols: 4, ratio: '4/5' }, { _key: key(), cols: 4, ratio: '4/5' }] },
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 7, ratio: '16/9' }, { _key: key(), cols: 5, ratio: '9/16' }] },
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 4, ratio: '4/5' }, { _key: key(), cols: 4, ratio: '4/5' }, { _key: key(), cols: 4, ratio: '4/5' }] },
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 5, ratio: '16/9' }, { _key: key(), cols: 7, ratio: '4/5' }] },
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 6, ratio: '4/5' }, { _key: key(), cols: 6, ratio: '4/5' }] },
      { _key: key(), _type: 'imageFullSection', ratio: '16/9' },
      { _key: key(), _type: 'imageGridSection', images: [{ _key: key(), cols: 4, ratio: '9/16' }, { _key: key(), cols: 4, ratio: '9/16' }, { _key: key(), cols: 4, ratio: '9/16' }] },
    ],
  },
}

// ── Create documents ─────────────────────────────────────────────────────────
console.log(`Creating ${projects.length} project documents...\n`)

for (const p of projects) {
  const cs = caseStudies[p.slug] ?? {}
  const doc = {
    _type: 'project',
    _id: `project-${p.slug}`,
    name: p.name,
    slug: { _type: 'slug', current: p.slug },
    type: p.type,
    year: p.year,
    order: p.order,
    published: true,
    ...cs,
  }

  try {
    await client.createOrReplace(doc)
    const hasCs = !!caseStudies[p.slug]
    console.log(`✓ ${p.name}${hasCs ? ' (with case study)' : ''}`)
  } catch (err) {
    console.error(`✗ ${p.name}: ${err.message}`)
  }
}

console.log('\nDone. Open the Studio to add images to sections.')
