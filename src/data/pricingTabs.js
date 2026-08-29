// The pricing page's three tabs: Platform, Project, Tasks.
//
// ─────────────────────────────────────────────────────────────────────────
// WHICH NUMBERS ARE REAL.
//
// PROJECT AND SUBSCRIPTION are real. Every figure in them is one Chris gave
// directly — the four Build pillars ($15,000 / $10,000 / $15,000 / $10,000
// per channel) and the hour tiers (25/50/100/150 hrs at $180/$165/$150/$140,
// internally consistent: hours × rate is exactly the monthly figure).
//
// PLATFORM IS NOT. There is no seat price and no per-task price
// anywhere in this repo or in anything supplied, and the platform itself is
// Coming Soon. Every unsourced figure reads '––', the same placeholder the
// case-study cards use, at the size a real number would be — so the gap is
// visible rather than filled with something plausible.
//
// A seat price is a commercial term. Guessing one puts a quote on the site
// nobody has agreed to, and a visitor cannot tell an invented $49/seat from
// a real one. ONE NUMBER FINISHES THIS PAGE: what a seat costs per month.
//
// Everything else is real. Project is the four Build pillars at the prices
// Chris gave; Subscription is the four hour tiers, and those were checked —
// hours × rate is exactly the monthly figure on all four.
// ─────────────────────────────────────────────────────────────────────────

export const TBC = '––'

export const tabs = [
  {
    id: 'platform',
    label: 'Platform',
    eyebrow: 'Subscribe to the platform',
    blurb: 'Your brand, your agents and your approvals — run by your own team.',
    tiers: [
      {
        kicker: 'One team',
        name: 'Team',
        price: TBC,
        unit: 'per seat / month',
        note: 'Price to confirm',
        summary: 'The repository, the agents and the approval queue, for the people who work in it every day.',
        lines: [
          'Brand Repository — one source everything is written from',
          'Agents trained on your brand, not on the internet',
          'Approvals before anything ships',
          'Unlimited assets in the library',
        ],
        cta: 'Book a demo',
      },
      {
        kicker: 'Whole company',
        name: 'Org',
        price: TBC,
        unit: 'per seat / month',
        note: 'Price to confirm',
        featured: true,
        summary: 'The same platform across every team, with the guardrails set centrally.',
        lines: [
          'Everything in Team, plus:',
          'Sub-brands, each with its own repository',
          'Central guardrails and claim rules',
          'Single sign-on and role-based access',
          'Measurement across every team',
        ],
        cta: 'Book a demo',
      },
      {
        kicker: 'Bring your own',
        name: 'Enterprise',
        price: 'Talk to us',
        unit: null,
        note: null,
        summary: 'Your infrastructure, your review process, your compliance rules.',
        lines: [
          'Everything in Org, plus:',
          'Self-hosted or private cloud',
          'Custom agents on your own material',
          'A named person on your account',
        ],
        cta: 'Talk to us',
      },
    ],
  },
  {
    id: 'project',
    label: 'Project',
    eyebrow: 'Have us build it',
    blurb: 'Scoped and priced before it starts. Almost all branding and marketing falls into one of these four.',
    tiers: [
      {
        kicker: '01',
        name: 'Your Brand',
        price: 15000,
        unit: 'starting at',
        note: null,
        summary: 'New brand, rebrand, refresh or sub-brand — positioning, identity and the guidelines to run it.',
        lines: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Product Positioning'],
        cta: 'Book a demo',
      },
      {
        kicker: '02',
        name: 'Your Website & App',
        price: 10000,
        unit: 'starting at',
        note: null,
        summary: 'A brochure site, an ecom build or a web app — designed, built, integrated and deployed.',
        lines: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
        cta: 'Book a demo',
      },
      {
        kicker: '03',
        name: 'Your Marketing Mix',
        price: 15000,
        unit: 'starting at',
        note: 'Covers initial marketing set-up and the initial flighting of any campaigns. Campaign extensions and subsequent campaign work billed separately. All production costs are billed separately.',
        summary: 'Audiences, campaign strategy and concept, paid media, partnerships and the dashboards under them.',
        lines: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
        cta: 'Book a demo',
      },
      {
        kicker: '04',
        name: 'Your Channels',
        price: 10000,
        unit: 'per channel',
        note: 'Covers initial channel set-up and two months of organic content.',
        summary: 'The channels your audience is actually on, set up and fed.',
        lines: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
        cta: 'Book a demo',
      },
    ],
  },
  {
    id: 'subscription',
    label: 'Subscription',
    eyebrow: 'Keep us on',
    blurb: 'Ongoing support, billed hourly and invoiced quarterly with a one quarter minimum. Media spend is separate — our management fee is flat, never a percentage of the buy.',
    tiers: [
      {
        kicker: '25 hrs / month',
        name: '$180 per hour',
        price: 4500,
        unit: 'per month',
        note: null,
        summary: 'Focus on one pillar to keep things current.',
        lines: ['One pillar', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
      {
        kicker: '50 hrs / month',
        name: '$165 per hour',
        price: 8250,
        unit: 'per month',
        note: null,
        summary: 'Focus on two pillars to ensure things are running properly across your most important channels.',
        lines: ['Two pillars', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
      {
        kicker: '100 hrs / month',
        name: '$150 per hour',
        price: 15000,
        unit: 'per month',
        note: null,
        featured: true,
        summary: 'Focus on three pillars, every month, for a comprehensive view of performance and quick optimizations.',
        lines: ['Three pillars', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
      {
        kicker: '150 hrs / month',
        name: '$140 per hour',
        price: 21000,
        unit: 'per month',
        note: null,
        summary: 'Focus on all four pillars, the most robust support for optimal brand oversight, maintenance, and seamless evolution.',
        lines: ['All four pillars', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
    ],
  },
]
