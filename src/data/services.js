// One entry per service. /services/:slug renders from this.
//
// ─────────────────────────────────────────────────────────────────────────
// BUILD AND GROW ARE CHRIS'S, word for word — the intros, the four pillars
// each, and their item lists. Build's prices are his too and match the
// pricing page, because both read the same figures.
//
// SUPPORT AND REPRESENT ARE STILL DRAFTS. Everything in their entries below
// — the four areas, the glosses, the items — is mine and unsigned.
//
// CHRIS’S FOUR VERBS FOR SUPPORT — maintain, tune, enable, extend — ARE NOT
// HERE. They are the how-it-works section, and they live in HowItWorks.jsx
// beside Grow’s four, which are also his. The split is deliberate and it is
// the one Grow already makes: this file holds the AREAS work lands in, and
// that file holds the STEPS the service runs. Putting his verbs here as
// pillar names collapsed the two and printed the same four words twice on
// one page.
//
// REPRESENT IS ENTIRELY MINE. Nothing behind it has been set: the services
// row on /v3 gives it a single sentence and no packages and no price.
//
// NEITHER CARRIES A PRICE. Both are real services Chris sells, and neither has
// a rate anybody has set, so both say so rather than guessing one. Both keep
// `draft: true` and the page renders a visible flag for them.
//
// brand-strategist approves or strikes what is left; comms-writer owns its
// wording. Delete the flag in the same change that signs it off.
// ─────────────────────────────────────────────────────────────────────────

export const services = [
  {
    slug: 'build',
    name: 'Build',
    tagline: 'Everything you need to go to market, and the system that keeps it working.',
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
        media: 'placeholder',
        items: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Product Positioning'],
      },
      {
        n: '02',
        name: 'Website & App',
        media: 'placeholder',
        items: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
      },
      {
        n: '03',
        name: 'Campaign',
        media: 'placeholder',
        items: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
        /* The diagram's right column is what comes OUT of the repo, and the
           first three items above are the strategy that goes IN — audience
           architecture and a campaign concept are inputs to a campaign, not
           things it produces. outputs is read by FlowDiagram only; items is
           the deliverable list on /pricing and is untouched.

           Wording is mine and has not been signed off. */
        outputs: ['Key Visual', 'Campaign Film', 'Paid Ads'],
      },
      {
        n: '04',
        name: 'Channels',
        media: 'placeholder',
        items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
      },
    ],
  },
  {
    slug: 'grow',
    name: 'Grow',
    /* 'dashboard' swaps the hero's flow diagram for the Measurement window,
       and turns the hero ground purple. Omitted elsewhere, so the other
       three keep the diagram. */
    heroVisual: 'dashboard',
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
        /* Same problem as Build's: management and testing are the work, not
           what the work hands over. Wording is mine, not signed off. */
        outputs: ['Ad Variants', 'Audience Segments', 'Performance Report'],
        why: 'Budget moves toward what is working, on evidence rather than instinct.',
      },
      {
        n: '04',
        name: 'Channels',
        items: ['Always-On Content', 'Short-Form Video', 'Email & SMS', 'Channel Expansion'],
        why: 'The feed keeps moving at the volume the platforms want, without the work getting worse.',
      },
    ],
  },


]

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug)
