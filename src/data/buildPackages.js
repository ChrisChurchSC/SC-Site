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
