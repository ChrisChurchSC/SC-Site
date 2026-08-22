// Sorting case studies into Build and Grow.
//
// Nothing in the data says which a project is. Projects carry a `type` string
// — "Brand", "Content", "Brand + Content", "Brand + Content + Product",
// "Brand + Campaign", "Product", "Brand + Product" — so the group has to be
// derived from it.
//
// The rule maps type tokens onto the two halves of the offer as v5 defines
// them: Build makes the brand and its assets (brand strategy, identity, voice,
// messaging, website, app); Grow takes it to market (campaigns, paid media,
// organic content). So Brand and Product are Build; Content and Campaign are
// Grow.
//
// Where a project is both — and eleven of them are "Brand + Content" — it goes
// by its FIRST token. The type strings are already written lead-deliverable
// first, so "Brand + Content" is brand-led work that also produced content,
// and lands in Build.
//
// That rule is a reading of the data, not a fact in it. It produces a lopsided
// split (roughly 30 Build to 7 Grow), because most of this back catalogue is
// brand-led. To move any single project, add it to OVERRIDES — one line, no
// logic change. To rebalance wholesale, the honest fix is an explicit
// per-project assignment rather than a cleverer regex.

/** Slug -> group. Wins over whatever the type string implies. */
export const OVERRIDES = {
  // 'some-slug': 'grow',
}

const BUILD_TOKENS = ['brand', 'product']
const GROW_TOKENS = ['content', 'campaign']

/**
 * @param {string|undefined} type  e.g. "Brand + Content"
 * @param {string|undefined} slug
 * @returns {'build'|'grow'}
 */
export function groupFor(type, slug) {
  if (slug && OVERRIDES[slug]) return OVERRIDES[slug]

  const first = String(type || '')
    .split('+')[0]
    .trim()
    .toLowerCase()

  if (GROW_TOKENS.some(t => first.includes(t))) return 'grow'
  if (BUILD_TOKENS.some(t => first.includes(t))) return 'build'

  // No type at all, or a token we have never seen. Build is the larger and
  // more general half, so an unclassifiable project is less wrong there than
  // it would be under a claim about taking something to market.
  return 'build'
}
