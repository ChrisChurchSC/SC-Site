// One entry per service. /services/:slug renders from this.
//
// ─────────────────────────────────────────────────────────────────────────
// BUILD AND GROW ARE CHRIS'S, word for word — the intros, the four pillars
// each, and their item lists. Build's prices are his too and match the
// pricing page, because both read the same figures.
//
// SUPPORT AND REPRESENT ARE MINE, and they are the only invented content
// here. There is nothing behind either of them in this repo: the services
// row on /v3 gives each a single sentence and no route, no packages, no
// prices. So each is drafted from what the sentence implies, carries no
// price at all rather than a guessed one, and is marked `draft: true` — the
// page renders a visible flag for those two.
//
// brand-strategist approves or strikes the two drafts; comms-writer owns
// their wording. Delete the flag in the same change that signs them off.
// ─────────────────────────────────────────────────────────────────────────

export const services = [
  {
    slug: 'build',
    name: 'Build',
    tagline: 'We build your brand platform and assets.',
    intro:
      'These are typically one-time projects: you build a brand, you build a website, etc. ' +
      'However, ongoing refreshes and refinements are common. Brands aren’t static. When ' +
      'you introduce a new offering and suddenly your positioning seems off, we’re here to help.',
    pillarsIntro:
      'Almost all things branding and marketing fall into one of these categories. Don’t see ' +
      'what you’re looking for? Just ask — our capabilities run deep, and if we can’t help, ' +
      'we probably know someone who can.',
    priceLead: 'from $10,000',
    priceNote: 'Scoped and priced before it starts. Every engagement over $20,000 includes full platform set-up.',
    pillars: [
      {
        n: '01',
        name: 'Brand',
        items: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Product Positioning'],
      },
      {
        n: '02',
        name: 'Website & App',
        items: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
      },
      {
        n: '03',
        name: 'Campaign',
        items: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
      },
      {
        n: '04',
        name: 'Channels',
        items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
      },
    ],
  },
  {
    slug: 'grow',
    name: 'Grow',
    tagline: 'We take that brand to market and run it.',
    intro:
      'With the brand and marketing apparatus in good shape, we can pivot our focus towards ' +
      'optimizations, extensions, additions, and anything else you might need as you engage ' +
      'with your audience. This work is billed quarterly with a one quarter engagement ' +
      'minimum. Media spend is separate, paid directly by you to the platforms. Our media ' +
      'management fee is flat, never a percentage of the buy.',
    pillarsIntro: 'The same four pillars, kept moving rather than built.',
    priceLead: 'from $4,500 / month',
    priceNote: '25 to 150 hours a month, billed quarterly. Spend them on any of the four.',
    pillars: [
      {
        n: '01',
        name: 'Brand',
        items: ['Brand Governance', 'Asset Extension', 'Sub-brand Support', 'Guideline Upkeep', 'New Collateral'],
        why: 'The system stays coherent as it stretches into things it was never drawn for.',
      },
      {
        n: '02',
        name: 'Website & App',
        items: ['Conversion Optimization', 'Landing Pages', 'A/B Testing', 'New Features', 'Performance', 'Ongoing SEO/AEO'],
        why: 'The site stops being a launch and becomes something you tune every month.',
      },
      {
        n: '03',
        name: 'Campaign',
        items: ['Campaign Extensions', 'Paid Media Management', 'Creative Testing', 'Audience Expansion', 'Reporting & Dashboards'],
        why: 'Budget moves toward what is working, on evidence rather than instinct.',
      },
      {
        n: '04',
        name: 'Channels',
        items: ['Always-On Content', 'Short-Form Video', 'Community Management', 'Email & SMS', 'Channel Expansion'],
        why: 'The feed keeps moving at the volume the platforms want, without the work getting worse.',
      },
    ],
  },
  {
    slug: 'support',
    name: 'Support',
    tagline: 'We look after what is live.',
    draft: true,
    intro:
      'Everything already shipped still needs somebody. Support is the standing arrangement ' +
      'for the work that has no project around it — the fix, the update, the version of the ' +
      'asset for the format nobody anticipated.',
    pillarsIntro: 'What tends to come up, and who catches it.',
    priceLead: null,
    priceNote: 'No published rate. Scoped against the same hours as Grow.',
    pillars: [
      { n: '01', name: 'Upkeep', items: ['Guideline questions', 'Asset requests', 'Format variants', 'Template updates'] },
      { n: '02', name: 'The live site', items: ['Content updates', 'Bug fixes', 'Dependency updates', 'Uptime and performance'] },
      { n: '03', name: 'The library', items: ['New assets filed', 'Old assets retired', 'Access for new people'] },
      { n: '04', name: 'The platform', items: ['Repo kept current', 'Agents retrained on new material', 'Reviews cleared'] },
    ],
  },
  {
    slug: 'represent',
    name: 'Represent',
    tagline: 'We speak for the brand in public.',
    draft: true,
    intro:
      'Some of the brand is not an asset at all — it is a person in a room, a byline, an ' +
      'answer to a journalist. Represent is the arrangement for the work that happens in ' +
      'public and cannot be handed to a queue.',
    pillarsIntro: 'Where a brand gets spoken for.',
    priceLead: null,
    priceNote: 'No published rate. Scoped per engagement.',
    pillars: [
      { n: '01', name: 'Press', items: ['Media relations', 'Statements and responses', 'Launch announcements'] },
      { n: '02', name: 'Stage', items: ['Conference talks', 'Panel prep', 'Event narrative'] },
      { n: '03', name: 'Founder', items: ['Founder positioning', 'Bylines and essays', 'Interview and podcast prep'] },
      { n: '04', name: 'Recognition', items: ['Award submissions', 'Case study write-ups', 'Speaker applications'] },
    ],
  },
]

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug)
