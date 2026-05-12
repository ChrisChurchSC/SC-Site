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

const doc = {
  _id: 'site-config',
  _type: 'siteConfig',
  reelVideoUrl: 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4',
  homeHeroTitle: 'The makers of high quality brands and content',
  homeHeroTagline: 'Brand · Content · Web',
}

const res = await client.createOrReplace(doc)
console.log(`Wrote ${res._id}`)
