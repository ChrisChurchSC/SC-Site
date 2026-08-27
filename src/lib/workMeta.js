/**
 * Title and meta description for a case study, built from fields Sanity
 * already holds.
 *
 * Every case study shipped as `{Name} | Super Conscious` — 21 to 24 characters
 * against a ~60 character budget, competing only for the client's brand name.
 * Six shipped the generated placeholder `Work by Super Conscious for {Name}.`
 * as their description, and 31 of them were under 70 characters, which is
 * roughly where Google stops using yours and writes its own.
 *
 * Shared by scripts/prerender-meta.mjs (what a crawler reads) and
 * src/pages/CaseStudy.jsx (what Google's rendered-DOM pass reads) so the two
 * cannot disagree — the split between prerendered and client titles is already
 * a live defect on /about.
 *
 * Plain ESM, no JSX and no import.meta.env, so the node prerender can import it
 * directly.
 */

const SITE = 'Super Conscious'
const STUDIO = 'Super Conscious, a creative studio in Philadelphia'
const DESC_MIN = 120
const DESC_MAX = 158

// `category` is Sanity's "Pillar(s)" — lowercase enum, only one project uses it.
const CATEGORY_LABEL = { brand: 'Brand', content: 'Content', product: 'Product' }

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()
const list = (v) => (Array.isArray(v) ? v.map(clean).filter(Boolean) : [])
const endStop = (s) => (!s ? '' : /[.!?]$/.test(s) ? s : `${s}.`)
const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s)

const oxford = (l) =>
  l.length < 2 ? (l[0] || '')
    : l.length === 2 ? `${l[0]} and ${l[1]}`
      : `${l.slice(0, -1).join(', ')}, and ${l[l.length - 1]}`

/** Whole sentences only — a description cut mid-word reads as broken. */
const sentences = (t) => clean(t).match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || []

/**
 * `type` is authored for a tag row, not for prose: "Brand + Content + Product"
 * is fine on a card and reads like machine output inside a sentence.
 */
const prose = (d) => oxford(clean(d).split(/\s*\+\s*/).filter(Boolean).map((x) => x.toLowerCase()))

/**
 * The client, without the sub-project suffix. Five names are `Client — Thing`
 * compounds, and naming the whole thing inside a sentence stutters against the
 * discipline: "Interview Series work for Arbitrum — Interview Series".
 */
const clientOf = (name) => clean(String(name ?? '').split('—')[0])

/**
 * What the work was: `type`, falling back to `category`, then to the first two
 * `services`. Coverage across the 29 sitemap'd case studies is type 28, plus
 * talos via category — so all 29 resolve to something.
 */
export function discipline(p = {}) {
  const type = clean(p.type)
  if (type) return type

  const cats = list(p.category).map((c) => CATEGORY_LABEL[c.toLowerCase()] || c)
  if (cats.length) return cats.join(' + ')

  const services = list(p.services).slice(0, 2)
  return services.length ? services.join(' + ') : ''
}

/**
 * `Name — Discipline`, except where that would stutter.
 *
 * Five project names are already `Client — Thing` compounds and their `type`
 * repeats the same words, which produced
 * `Arbitrum — Marketing Dept Videos — Marketing Dept Videos` at 74 characters.
 * Both guards are load-bearing: the em-dash test catches the compounds, and the
 * suffix test catches a name that simply ends in its own discipline.
 */
export function workHeadline(project, name) {
  const n = clean(name)
  const d = discipline(project)
  if (!d) return n
  if (n.includes('—')) return n
  if (n.toLowerCase().endsWith(d.toLowerCase())) return n
  return `${n} — ${d}`
}

export function workTitle(project, name) {
  return `${workHeadline(project, name)} | ${SITE}`
}

/**
 * A description between DESC_MIN and DESC_MAX where the content allows it.
 *
 * Built in order of how much it was written for a human: the tagline, then
 * whole sentences of the summary, then a clause naming the services, and only
 * then a sentence assembled from the discipline. The last step exists because
 * five published case studies (big-buoy, entropy, girlfight, hylands, nimruz)
 * carry nothing but a name and a type — it still says something true rather
 * than the old placeholder.
 */
export function workDescription(project = {}, name = '') {
  const p = project || {}
  const services = list(p.services)
  const n = clean(name)

  let out = endStop(clean(p.tagline) || clean(p.descriptor))

  for (const s of sentences(p.summary)) {
    const next = out ? `${out} ${s.trim()}` : s.trim()
    if (next.length > DESC_MAX) break
    out = next
  }

  const client = clientOf(n)

  if (out.length < DESC_MIN && services.length) {
    const budget = DESC_MAX - (out ? out.length + 1 : 0)
    const candidates = []
    for (const count of [...new Set([services.length, 4, 3, 2, 1])]) {
      if (count < 1 || count > services.length) continue
      const named = oxford(services.slice(0, count))
      candidates.push(`${named} for ${client} by ${STUDIO}.`)
      candidates.push(`${named} for ${client} by ${SITE}.`)
      candidates.push(`${named} by ${STUDIO}.`)
    }
    const best = candidates
      .filter((c) => c.length <= budget)
      .sort((a, b) => b.length - a.length)[0]
    if (best) out = out ? `${out} ${best}` : best
  }

  if (out.length < DESC_MIN) {
    const d = prose(discipline(p))
    const tail = d
      ? `${capitalize(d)} work for ${client} by ${STUDIO}.`
      : `A case study from ${STUDIO}.`
    if (!out) out = tail
    else if (`${out} ${tail}`.length <= DESC_MAX) out = `${out} ${tail}`
  }

  // A description longer than the budget is truncated by Google, not rejected;
  // cutting on a sentence boundary is why the loop above adds whole sentences.
  // This is the backstop for a single tagline that is already over.
  return out.length > DESC_MAX ? `${out.slice(0, DESC_MAX - 1).trimEnd()}…` : out
}
