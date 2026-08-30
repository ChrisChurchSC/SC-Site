// One entry per service. /services/:slug renders from this.
//
// ─────────────────────────────────────────────────────────────────────────
// BUILD AND GROW ARE CHRIS'S, word for word — the intros, the four pillars
// each, and their item lists. Build's prices are his too and match the
// pricing page, because both read the same figures.
//
// SUPPORT AND REPRESENT ARE STILL DRAFTS, but no longer wholly invented.
// SUPPORT’S FOUR HEADINGS — Maintain, Tune, Enable, Extend — ARE CHRIS’S,
// given as the how-it-works section for that service. They replaced four of
// mine that named places rather than actions. The glosses under them, and the
// items under those, are mine: the items are the earlier draft’s list
// re-sorted beneath his headings, not new claims.
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
  {
    slug: 'support',
    name: 'Support',
    /* 'support' swaps the hero's flow diagram for the standing-work board and
       turns the hero ground teal. The board is the only place Support's four
       appear on the page, so it takes `pillars` rather than drawing its own. */
    heroVisual: 'support',
    tagline: 'We look after what is live.',
    draft: true,
    intro:
      'Everything already shipped still needs somebody. Support is the standing arrangement ' +
      'for the work that has no project around it — the fix, the update, the version of the ' +
      'asset for the format nobody anticipated.',
    pillarsIntro: 'What tends to come up, and who catches it.',
    priceLead: null,
    priceNote: 'No published rate. Scoped against the same hours as Grow.',
    /* MAINTAIN, TUNE, ENABLE, EXTEND ARE CHRIS'S — given as the how-it-works
       section for Support, and they replace the four headings that were here
       before (Upkeep, The live site, The library, The platform), which were
       mine and named places rather than actions.

       THE GLOSSES AND THE ITEMS ARE STILL MINE. The items are the previous
       draft's, re-sorted under his four rather than rewritten — nothing new
       is claimed, it is the same list under better headings. The gloss is one
       line per heading because "how it works" has to say how it works; strike
       them and the board still stands. */
    pillars: [
      {
        n: '01',
        name: 'Maintain',
        gloss: 'What shipped keeps working.',
        items: ['Bug fixes', 'Content updates', 'Dependency updates', 'Uptime and performance'],
      },
      {
        n: '02',
        name: 'Tune',
        gloss: 'The weak parts get better.',
        items: ['Page speed', 'Accessibility fixes', 'Copy refinements', 'Search hygiene'],
      },
      {
        n: '03',
        name: 'Enable',
        gloss: 'Your people can use it without us.',
        items: ['Access for new people', 'Guideline questions', 'Template updates', 'Walkthroughs'],
      },
      {
        n: '04',
        name: 'Extend',
        gloss: 'It stretches to things it was not drawn for.',
        items: ['Format variants', 'New collateral', 'New assets filed', 'Agents retrained'],
      },
    ],
  },
  {
    slug: 'represent',
    name: 'Represent',
    /* 'represent' swaps the diagram for the public schedule and turns the
       ground blue. Same arrangement as Support: the schedule is the only place
       this service's four appear, so it reads `pillars`. */
    heroVisual: 'represent',
    tagline: 'We speak for the brand in public.',
    draft: true,
    intro:
      'Some of the brand is not an asset at all — it is a person in a room, a byline, an ' +
      'answer to a journalist. Represent is the arrangement for the work that happens in ' +
      'public and cannot be handed to a queue.',
    pillarsIntro: 'Where a brand gets spoken for.',
    priceLead: null,
    priceNote: 'No published rate. Scoped per engagement.',
    /* ALL FOUR ARE STILL MINE. Support now carries Chris's headings; these do
       not, and nothing here has been signed off. The `when` values are the
       schedule's ordering, not commitments — the window flags itself sample. */
    pillars: [
      {
        n: '01',
        name: 'Press',
        gloss: 'Somebody answers the journalist.',
        items: ['Media relations', 'Statements and responses', 'Launch announcements'],
      },
      {
        n: '02',
        name: 'Stage',
        gloss: 'The talk is the brand, for forty minutes.',
        items: ['Conference talks', 'Panel prep', 'Event narrative'],
      },
      {
        n: '03',
        name: 'Founder',
        gloss: 'The person in front of it has a position.',
        items: ['Founder positioning', 'Bylines and essays', 'Interview and podcast prep'],
      },
      {
        n: '04',
        name: 'Recognition',
        gloss: 'The work gets entered, written up and credited.',
        items: ['Award submissions', 'Case study write-ups', 'Speaker applications'],
      },
    ],
  },
]

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug)
