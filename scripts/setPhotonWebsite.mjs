import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Token resolution order: process.env first (e.g. `VITE_SANITY_TOKEN=xxx node ...`),
// then a local .env if one exists. projectId/dataset default to the known SC values.
const __dirname = dirname(fileURLToPath(import.meta.url))
let env = {}
try {
  env = Object.fromEntries(
    readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
      .split('\n').filter(l => l.includes('='))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
  )
} catch { /* no .env — rely on process.env */ }

const token = process.env.VITE_SANITY_TOKEN || env.VITE_SANITY_TOKEN
if (!token) {
  console.error('Missing Sanity write token. Run: VITE_SANITY_TOKEN=<editor-token> node scripts/setPhotonWebsite.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'ppq16wpu',
  dataset: process.env.VITE_SANITY_DATASET || env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Photon case study — attach a "View Website" button to the homepage-screenshot
// section (the photonhealth.com hero, _key fa3937be04bd).
const DOC = 'project-photon'
const SECTION_KEY = 'fa3937be04bd'
const URL = 'https://photonhealth.com/'

const res = await client
  .patch(DOC)
  .set({ [`sections[_key=="${SECTION_KEY}"].website`]: URL })
  .commit()

console.log('Patched Photon website link:', res._id, '→', URL)
