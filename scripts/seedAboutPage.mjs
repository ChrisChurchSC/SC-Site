import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { randomBytes } from 'crypto'

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

const key = () => randomBytes(6).toString('hex')

const doc = {
  _id: 'about-page',
  _type: 'aboutPage',
  headerLabel: '[ Capabilities ]',
  headline: 'Creative Strategy & Production Partner',
  intro: 'We help founders and marketing teams decide what to make, why it matters, and bring it to life.',
  embeddedPoints: [
    { _key: key(), heading: 'No long contracts.', body: 'Month to month, rate card that works for both sides. No surprises.' },
    { _key: key(), heading: 'Plugged into your team.', body: 'Your Slack, your meetings, your tools. Multiple team members, one shared goal.' },
    { _key: key(), heading: 'In-house output.', body: 'The output of an in-house creative team without the cost of building one.' },
  ],
  services: [
    {
      _key: key(),
      tag: 'What to make',
      name: 'Define',
      deliverables: ['Creative strategy', 'Brand positioning & messaging', 'Campaign and concept development'],
    },
    {
      _key: key(),
      tag: 'Why it matters',
      name: 'Amplify',
      deliverables: ['Marketing strategy & planning', 'Channel strategy (social, paid, etc.)', 'Measurement framework & data setup'],
    },
    {
      _key: key(),
      tag: 'Bringing to life',
      name: 'Develop',
      deliverables: ['Content production (video, social, design)', 'Asset creation & execution', 'Post-production & delivery'],
    },
  ],
  pricingLabel: 'Get Pricing',
  pricingSub: 'Drop your email and we\'ll send over rates and availability.',
  clientsLabel: 'Selected Clients',
  clients: [
    'World Within', 'Oxyle', 'Mindmatter', 'Big Buoy',
    'Deep Dive Films', 'Concis Labs', 'Joon', 'Transcend',
    'Halfday', 'Overland', 'Pollen', 'Vessel',
  ],
}

const res = await client.createOrReplace(doc)
console.log(`Wrote ${res._id}`)
