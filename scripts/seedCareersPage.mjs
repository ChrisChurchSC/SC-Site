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
  _id: 'careers-page',
  _type: 'careersPage',
  headerLabel: '[ Working Here ]',
  headline: 'Small team. Real work.',
  intro: "We're a tight group of strategists, creatives, and builders. Everyone is close to the work. Thinking and making happen together, by the same people.",
  photos: [
    { _key: key(), caption: 'Philadelphia, PA, 2024' },
    { _key: key(), caption: 'The team, offsite 2024' },
  ],
  whatItsLikeLabel: "What It's Like",
  whatItsLikeBody: "You'll work directly with clients from day one. You'll have opinions on strategy, execute on creative, and be involved across the full lifecycle of a project. It moves fast and the feedback loop is short. That's the point.",
  realitiesLabel: 'The Realities',
  realities: [
    { _key: key(), label: 'Location',   value: 'Philadelphia, PA' },
    { _key: key(), label: 'Team size',  value: 'Small, on purpose' },
    { _key: key(), label: 'Structure',  value: 'No departments, no account managers' },
    { _key: key(), label: 'Clients',    value: 'Founders and marketing leads' },
    { _key: key(), label: 'Work',       value: 'Strategy, content, brand, product' },
    { _key: key(), label: 'Hours',      value: '10hr days, 4 days a week' },
  ],
  traitsLabel: 'Who Fits Here',
  traits: [
    { _key: key(), heading: 'You think, then make.',         body: "We don't separate strategy from execution. Everyone here has opinions on the work and the ability to act on them." },
    { _key: key(), heading: 'You communicate clearly.',      body: 'Good thinking shared badly is still bad thinking. We write well, talk straight, and keep each other informed without being performative about it.' },
    { _key: key(), heading: 'You take ownership.',           body: 'No one is waiting to be told what to do next. If something needs doing, you do it. If something is broken, you fix it.' },
    { _key: key(), heading: 'You care about the work.',      body: "Not in a precious way. In the way where you'd rather redo something than ship it knowing it's not right." },
  ],
  openRolesLabel: 'Open Roles',
  applyEmail: 'contact@super-conscious.studio',
}

const res = await client.createOrReplace(doc)
console.log(`Wrote ${res._id}`)
