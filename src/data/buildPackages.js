// Six Build-side packages from the Estimator (with prices) workbook.
// Stable across prospects — edit here, not in Sanity, so the productized
// positioning stays consistent. Prices live-tie to the rate card in the
// workbook; sync this file when those change.
export const buildPackages = [
  {
    slug: 'test-a-first-project',
    name: 'Test a First Project',
    goal: 'A focused, low-risk first project — proof that working together works.',
    price: 14350,
  },
  {
    slug: 'win-enterprise-deals',
    name: 'Win Enterprise Deals',
    goal: 'A sales toolkit your team can confidently take into high-stakes rooms.',
    price: 25895,
  },
  {
    slug: 'modernize-your-brand',
    name: 'Modernize Your Brand',
    goal: 'Bring an established brand back in line with what the company has become.',
    price: 27210,
  },
  {
    slug: 'close-your-funding-round',
    name: 'Close Your Funding Round',
    goal: 'An investor-ready story and materials that hold up under scrutiny.',
    price: 28970,
  },
  {
    slug: 'ship-your-product',
    name: 'Ship Your Product',
    goal: 'A designed, built product in front of real users — discovery through working build.',
    price: 36660,
  },
  {
    slug: 'establish-market-credibility',
    name: 'Establish Market Credibility',
    goal: 'A brand that makes you credible to bigger clients, partners, and investors.',
    price: 41680,
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
