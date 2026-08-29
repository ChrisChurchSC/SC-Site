// The Build pricing pillars.
//
// ─────────────────────────────────────────────────────────────────────────
// THESE PRICES AND THIS COPY ARE CHRIS'S, GIVEN DIRECTLY. They are not
// derived from buildPackages.js or the estimator workbook, and they do not
// match those figures — the workbook's cheapest Build package is $24,045,
// where this starts at $10,000. Both are in the repo. If they are meant to
// agree, that is a reconciliation somebody has to do on purpose; nothing in
// code can decide which is current.
//
// The offering lists, the reasoning lines and the numbers are reproduced as
// written. Do not round them, reorder them, or tidy the phrasing here —
// wording is comms-writer's, in Verbal/.
// ─────────────────────────────────────────────────────────────────────────

export const buildIntro =
  'We make your brand and its assets, from scratch or refreshed from what you have: ' +
  'brand strategy, identity, voice, messaging, website, app. Almost everything in ' +
  'branding and marketing falls into one of four pillars — the four below.'

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
      'Motion Identity',
      'Product Positioning',
    ],
    why: 'The thing that makes you impossible to confuse with the category leader.',
    price: 15000,
    priceNote: null,
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
    why: "An incumbent's site is a brochure — everyone already trusts them. Yours has to prove you are real and take the order.",
    price: 10000,
    priceNote: null,
  },
  {
    n: '03',
    name: 'Your Marketing Mix',
    items: [
      'Audience Architecture',
      'Launch Campaign Strategy & Concept',
      'Always-On Campaign Strategy & Concept',
      'Film & Video Production',
      'Motion Graphics',
      'Conference & Event Strategy & Execution',
      'Partnerships',
      'Paid Media Strategy & Execution',
      'Dashboards',
    ],
    why: 'The leader can waste half a budget and never feel it. You cannot, so every dollar is tracked and moved when it is not working.',
    price: 15000,
    priceNote: null,
  },
  {
    n: '04',
    name: 'Your Channels',
    items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
    why: 'Nobody is searching for you by name yet, so you go to them — at the volume the platforms demand.',
    price: 6000,
    priceNote: 'per channel, including two months of content',
  },
]

// ── GROW ──────────────────────────────────────────────────────────────────
// Chris's copy and numbers again, given directly, reproduced as written.

export const growIntro =
  'We take that brand to market and run it: campaigns, paid media, organic content, ' +
  'and an embedded marketing team, measured and optimized every month.'

export const growPillars = [
  {
    n: '01',
    name: 'Your Brand',
    items: ['Brand Governance', 'Asset Extension', 'Sub-brand Support', 'Guideline Upkeep', 'New Collateral'],
    why: 'The system stays coherent as it stretches into things it was never drawn for.',
  },
  {
    n: '02',
    name: 'Your Website & App',
    items: ['Conversion Optimization', 'Landing Pages', 'A/B Testing', 'New Features', 'Performance', 'Ongoing SEO/AEO'],
    why: 'The site stops being a launch and becomes something you tune every month.',
  },
  {
    n: '03',
    name: 'Your Marketing Mix',
    items: ['Campaign Extensions', 'Paid Media Management', 'Creative Testing', 'Audience Expansion', 'Reporting & Dashboards'],
    why: 'Budget moves toward what is working, on evidence rather than instinct.',
  },
  {
    n: '04',
    name: 'Your Channels',
    items: ['Always-On Content', 'Short-Form Video', 'Community Management', 'Email & SMS', 'Channel Expansion'],
    why: 'The feed keeps moving at the volume the platforms want, without the work getting worse.',
  },
]

// The retainer tiers. Every one of these is internally consistent — hours ×
// rate is exactly the monthly figure, checked — so the page can show any two
// of the three and derive the third rather than printing numbers that could
// drift apart.
export const growTiers = [
  { hours: 25, monthly: 4500, rate: 180 },
  { hours: 50, monthly: 8250, rate: 165 },
  { hours: 100, monthly: 15000, rate: 150, common: true },
  { hours: 150, monthly: 21000, rate: 140 },
]

// THE PERIODS ARE A MULTIPLICATION, NOT A PRICE LIST.
//
// Only the monthly figures were given. Quarter and year are ×3 and ×12 of
// them, with NO discount applied, because no discounted rate was supplied and
// inventing one would be inventing a commercial term — the reference this
// page is modelled on offers "Annual · Save 10%", and that 10% is theirs, not
// ours. If an annual rate exists, put it here and the toggle stops being
// arithmetic.
export const growPeriods = [
  { id: 'month', label: 'Per month', months: 1, suffix: 'per month' },
  { id: 'quarter', label: 'Per quarter', months: 3, suffix: 'per quarter' },
  { id: 'year', label: 'Per year', months: 12, suffix: 'per year' },
]
