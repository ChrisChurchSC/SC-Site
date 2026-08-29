// The pricing content.
//
// ─────────────────────────────────────────────────────────────────────────
// ALL OF THIS IS CHRIS'S, GIVEN DIRECTLY, AND REPRODUCED AS WRITTEN. Do not
// round the numbers, reorder the lists, or tidy the phrasing here — wording
// is comms-writer's, in Verbal/.
//
// IT DOES NOT AGREE WITH THE ESTIMATOR DATA, and that is known rather than
// missed. buildPackages.js prices its cheapest Build package at $24,045
// where this starts at $10,000, and growPackages.js is project-priced where
// Grow here is hourly. Both sets are in the repo. Nothing in code can decide
// which is current; this is the set the pricing page shows.
//
// WHAT CHANGED IN THE SECOND PASS, so a diff is not the only record:
//   · Motion Identity came out of Your Brand.
//   · Film & Video Production and Motion Graphics came out of Your Marketing
//     Mix, and it gained the note about production costs being separate.
//   · Your Channels went from $6,000 to $10,000, and gained its own note.
//   · The per-pillar reasoning lines came out entirely.
//   · Grow lost its four pillars: it is prose and the hour tiers now.
//   · The month/quarter/year toggle came out — Grow is billed quarterly, so
//     a period switch was offering a choice that is not on the table.
// ─────────────────────────────────────────────────────────────────────────

export const build = {
  name: 'Build',
  kicker: 'Project-based, scoped specifically',
  intro:
    'These are typically one-time projects: you build a brand, you build a website, etc. ' +
    'However, ongoing refreshes and refinements are common. Brands aren’t static. When ' +
    'you introduce a new offering and suddenly your positioning seems off, we’re here to help.',
  pillarsIntro:
    'Our Pillars. Almost all things branding and marketing fall into one of these categories. ' +
    'Don’t see what you’re looking for? Just ask — our capabilities run deep, and if we ' +
    'can’t help, we probably know someone who can.',
}

// THE small AND large LINES ARE MINE, not Chris's — the only invented copy
// in this file. They are scoping, not pricing: each pair describes the two
// ends of the item list he supplied, and no number moves. The items array is
// kept because it is his and it is what the pairs were derived from, but the
// page no longer prints it — "we just need to say brand costs this, here is
// what you get for a small, and large".
//
// Replace them with the real scope definitions and delete this note.
export const buildPillars = [
  {
    n: '01',
    name: 'Your Brand',
    items: [
      'New Brand',
      'Rebrand',
      'Brand Refresh',
      'Sub-brand',
      'Brand Guidelines',
      'Product Positioning',
    ],
    small: 'A refresh: logo, colour, type and guidelines, evolved from what you have.',
    large: 'A new brand: positioning, naming, identity and the system to run it.',
    note: null,
    price: 15000,
    priceSuffix: null,
  },
  {
    n: '02',
    name: 'Your Website & App',
    items: [
      'Brochure Website',
      'Microsite',
      'Landing Pages',
      'Ecom Site',
      'Mobile App',
      'Web App',
      'SEO/AEO',
      'Development',
      'Integrations',
      'Analytics',
      'Deployment',
    ],
    small: 'A brochure site or a set of landing pages, designed and shipped.',
    large: 'An ecom site or a web app — built, integrated, instrumented, deployed.',
    note: null,
    price: 10000,
    priceSuffix: null,
  },
  {
    n: '03',
    name: 'Your Marketing Mix',
    items: [
      'Audience Architecture',
      'Launch Campaign Strategy & Concept',
      'Always-On Campaign Strategy & Concept',
      'Conference & Event Strategy & Execution',
      'Partnerships',
      'Paid Media Strategy & Execution',
      'Dashboards',
    ],
    small: 'One launch campaign: audience, concept, and the first flight.',
    large: 'Always-on campaigns, paid media run against them, and the dashboards.',
    note:
      'Covers initial marketing set-up and the initial flighting of any campaigns. ' +
      'Campaign extensions and subsequent campaign work billed separately. All ' +
      'production costs are billed separately.',
    price: 15000,
    priceSuffix: null,
  },
  {
    n: '04',
    name: 'Your Channels',
    items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
    small: 'One channel, set up and fed for two months.',
    large: 'Every channel your audience is on, running together.',
    note: 'Covers initial channel set-up and two months of organic content.',
    price: 10000,
    priceSuffix: 'per channel',
  },
]

export const grow = {
  name: 'Grow',
  kicker: 'Ongoing support, billed hourly',
  intro:
    'With the brand and marketing apparatus in good shape, we can pivot our focus towards ' +
    'optimizations, extensions, additions, and anything else you might need as you engage ' +
    'with your audience. This work is billed quarterly with a one quarter engagement ' +
    'minimum. Media spend is separate, paid directly by you to the platforms. Our media ' +
    'management fee is flat, never a percentage of the buy.',
}

// Every tier is internally consistent: hours × rate is exactly the monthly
// figure. Checked, so the page can print two of the three and be sure of the
// third rather than carrying numbers that could drift apart.
export const growTiers = [
  {
    hours: 25,
    monthly: 4500,
    rate: 180,
    blurb: 'Focus on one pillar to keep things current.',
  },
  {
    hours: 50,
    monthly: 8250,
    rate: 165,
    blurb: 'Focus on two pillars to ensure things are running properly across your most important channels.',
  },
  {
    hours: 100,
    monthly: 15000,
    rate: 150,
    common: true,
    blurb: 'Focus on three pillars, every month, for a comprehensive view of performance and quick optimizations.',
  },
  {
    hours: 150,
    monthly: 21000,
    rate: 140,
    blurb: 'Focus on all four pillars, the most robust support for optimal brand oversight, maintenance, and seamless evolution.',
  },
]
