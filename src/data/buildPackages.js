// Six Build-side packages from the Estimator (with prices) workbook.
// Stable across prospects — edit here, not in Sanity, so the productized
// positioning stays consistent. Prices live-tie to the rate card in the
// workbook; sync this file when those change.
export const buildPackages = [
  {
    slug: 'test-a-first-project',
    name: 'Test a First Project',
    goal: 'A focused, low-risk first project — proof that working together works.',
    outcome: 'Proof that the partnership works, scoped tight and shipped fast.',
    price: 14350,
  },
  {
    slug: 'win-enterprise-deals',
    name: 'Win Enterprise Deals',
    goal: 'A sales toolkit your team can confidently take into high-stakes rooms.',
    outcome: 'A higher enterprise win rate and larger average deal sizes.',
    price: 25895,
  },
  {
    slug: 'modernize-your-brand',
    name: 'Modernize Your Brand',
    goal: 'Bring an established brand back in line with what the company has become.',
    outcome: 'An identity that reflects the company you are now, not the one you started as.',
    price: 27210,
  },
  {
    slug: 'close-your-funding-round',
    name: 'Close Your Funding Round',
    goal: 'An investor-ready story and materials that hold up under scrutiny.',
    outcome: 'Better meeting-to-term-sheet conversion through the raise.',
    price: 28970,
  },
  {
    slug: 'ship-your-product',
    name: 'Ship Your Product',
    goal: 'A designed, built product in front of real users — discovery through working build.',
    outcome: 'A live product earning early user activation, faster than building it alone.',
    price: 36660,
  },
  {
    slug: 'establish-market-credibility',
    name: 'Establish Market Credibility',
    goal: 'A brand that makes you credible to bigger clients, partners, and investors.',
    outcome: 'A brand that earns the next tier of clients, partners, and investors.',
    price: 41680,
  },
]

// Build-side service line items from the Estimator. Grouped by category.
// Prices are starting points — actual scope is rate-card priced per project.
export const buildServices = [
  {
    category: 'Brand',
    items: [
      { name: 'Brand strategy', desc: 'positioning, voice, audience, brief', price: 3810 },
      { name: 'Brand sprint', desc: '2–3 wks · logo, color, type, basic guidelines', price: 10540 },
      { name: 'Brand refresh', desc: 'evolve existing identity · 4–6 wks', price: 17580 },
      { name: 'Brand system', desc: '6–8 wks · full identity + extended guidelines', price: 32050 },
      { name: 'Brand platform', desc: '10–14 wks · strategy, naming, identity, rollout', price: 54300 },
    ],
  },
  {
    category: 'Product Design',
    items: [
      { name: 'Prototyping', desc: 'interactive clickable prototype for testing', price: 4740 },
      { name: 'Product discovery', desc: 'research, user flows, feature definition', price: 5125 },
      { name: 'UX wireframes', desc: 'key flows, low-fidelity, annotated', price: 5675 },
      { name: 'UI design — feature', desc: 'high-fidelity screens for one feature set', price: 6570 },
      { name: 'Design-to-build (Claude Code)', desc: 'designed + shipped product · defined scope', price: 19290 },
      { name: 'Full product UI', desc: 'complete app or product interface · multi-flow', price: 22460 },
    ],
  },
  {
    category: 'Web & Interactive',
    items: [
      { name: 'Web strategy & sitemap', desc: 'goals, sitemap, content plan, wireframes', price: 2905 },
      { name: 'Business card site', desc: '1 page · minimal presence', price: 3375 },
      { name: 'Landing page', desc: '1 page · conversion-focused', price: 4930 },
      { name: 'Web design refresh', desc: 'redesign existing site · same architecture', price: 9705 },
      { name: 'Microsite', desc: '3–5 pages · campaign-driven · custom interactions', price: 11785 },
      { name: 'Design system / component library', desc: 'tokens, components, documentation', price: 13520 },
      { name: 'Marketing site', desc: '5–8 pages · static · responsive', price: 15020 },
      { name: 'Marketing site + CMS', desc: '5–8 pages · CMS-managed content', price: 18205 },
      { name: 'Shopify store', desc: 'e-commerce · theme, products, checkout', price: 25100 },
      { name: 'Big marketing site + CMS', desc: '10+ pages · multiple templates · custom CMS', price: 26850 },
      { name: 'Interactive experience / WebGL', desc: 'immersive 3D · custom build', price: 27140 },
    ],
  },
  {
    category: 'Decks',
    items: [
      { name: 'Deck refresh', desc: 'restyle existing deck · 15–25 slides', price: 1470 },
      { name: 'Deck strategy & narrative', desc: 'story arc, key slides, structure', price: 1730 },
      { name: 'Sales deck — short', desc: '~15 slides · brand-led · existing content', price: 2755 },
      { name: 'Webinar slide deck', desc: '20–40 slides · designed presentation', price: 3405 },
      { name: 'Board / leadership deck', desc: '20–30 slides · polished, data-heavy', price: 4880 },
      { name: 'Deck template system', desc: 'reusable template · 20+ master layouts', price: 5820 },
      { name: 'Sales deck — full', desc: '25–40 slides · custom layouts · charts + icons', price: 7110 },
      { name: 'Keynote / event deck', desc: '30–60 slides · stage presentation', price: 8725 },
      { name: 'Investor / pitch deck', desc: '20–30 slides · narrative + data viz', price: 9660 },
    ],
  },
  {
    category: 'Print & OOH',
    items: [
      { name: 'Campaign strategy & concepts', desc: 'concept development · format planning', price: 2360 },
      { name: 'Print ads — batch of 3', desc: '3 ads · same campaign · multi-format', price: 2405 },
      { name: 'OOH — batch of 3 placements', desc: '3 placements · multi-format', price: 2845 },
      { name: 'Editorial / magazine spread', desc: 'multi-page layout · custom typography', price: 6545 },
      { name: 'Print ad campaign', desc: '3–5 concepts · multi-format adaptations', price: 7330 },
      { name: 'Packaging — single SKU', desc: '1 product · structural + graphic', price: 7355 },
      { name: 'Brand book / printed report', desc: '20–40 pages · designed + production', price: 10200 },
      { name: 'OOH campaign', desc: '3–5 executions · multiple placements & sizes', price: 10970 },
      { name: 'Packaging — product line', desc: '3–6 SKUs · system + variations', price: 15460 },
    ],
  },
  {
    category: 'Copywriting',
    items: [
      { name: 'Campaign copy', desc: 'headlines, taglines, body for one campaign', price: 1450 },
      { name: 'Ad & social copy — batch', desc: '~15 short-form copy units · multi-channel', price: 1590 },
      { name: 'Scriptwriting', desc: 'script for video or motion piece', price: 1600 },
      { name: 'Long-form content piece', desc: 'article, blog, or thought-leadership piece', price: 1660 },
      { name: 'Copy audit & voice guide', desc: 'tone of voice · messaging framework', price: 2735 },
      { name: 'Website copy', desc: '5–8 pages · brand-led longform', price: 2935 },
    ],
  },
  {
    category: 'Concept Creation',
    items: [
      { name: 'Moodboard & creative territories', desc: 'visual direction options · early-stage', price: 3120 },
      { name: 'Naming & verbal identity', desc: 'name generation, rationale, screening', price: 4815 },
      { name: 'Concept sprint', desc: 'big-idea creative concepting · 1–2 wks', price: 7500 },
      { name: 'Pitch / new business concept', desc: 'speculative creative for a pitch', price: 9440 },
      { name: 'Campaign concept', desc: 'platform idea, territories, key visuals', price: 11170 },
    ],
  },
]

export const buildCapabilities = [
  {
    heading: 'Brand foundation',
    items: ['Identity systems', 'Naming + verbal identity', 'Voice + messaging', 'Visual language', 'Design systems'],
  },
  {
    heading: 'Digital product',
    items: ['Websites + microsites', 'Web apps', 'Mobile apps', 'Prototypes', 'Design-to-build (Claude Code)'],
  },
  {
    heading: 'Production',
    items: ['Illustration', 'Motion + 3D', 'Photography', 'Copywriting', 'Pitch + investor decks'],
  },
]
