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
    id: 'project',
    label: 'Project',
    eyebrow: 'Have us build it',
    blurb: 'Scoped and priced before it starts. Almost all branding and marketing falls into one of these four.',
    /* A threshold rather than a line on every card: it depends on the size
       of the order, not on which project it is. Rendered above the cards —
       see the note in the JSX. */
    perk: 'Every engagement over $20,000 includes full platform set-up — your Brand Repository, agents and approvals, stood up and running.',
    tiers: [
      {
        kicker: '01',
        name: 'Brand',
        price: 15000,
        unit: 'starting at',
        note: null,
        summary: 'New brand, rebrand, refresh or sub-brand — positioning, identity and the guidelines to run it.',
        lines: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Product Positioning'],
        cta: 'Book a demo',
      },
      {
        kicker: '02',
        name: 'Website & App',
        price: 10000,
        unit: 'starting at',
        note: null,
        summary: 'A brochure site, an ecom build or a web app — designed, built, integrated and deployed.',
        lines: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
        cta: 'Book a demo',
      },
      {
        kicker: '03',
        name: 'Marketing Mix',
        price: 15000,
        unit: 'starting at',
        note: 'Covers initial marketing set-up and the initial flighting of any campaigns. Campaign extensions and subsequent campaign work billed separately. All production costs are billed separately.',
        summary: 'Audiences, campaign strategy and concept, paid media, partnerships and the dashboards under them.',
        lines: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
        cta: 'Book a demo',
      },
      {
        kicker: '04',
        name: 'Channels',
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
]

// The FAQ.
//
// EVERY ANSWER RESTATES A TERM ALREADY ON THIS PAGE OR ONE CHRIS GAVE. The
// quarterly billing and the one-quarter minimum, the flat media fee, the
// $20,000 platform threshold, production costs being separate — all his. The
// last two are drafted from what the rest of the site already says, and are
// the only ones a strategist needs to look at.
//
// Nothing here introduces a number that is not elsewhere on the page.
export const faqs = [
  {
    q: 'How is a project priced?',
    a: 'Scoped and priced before it starts. The figure on each card is a starting point, not a cap — what it actually costs depends on which deliverables you pick. Production costs are billed separately.',
  },
  {
    q: 'How is the subscription billed?',
    a: 'By the hour, invoiced quarterly, with a one quarter minimum. The rate falls as the monthly hours rise, from $180 at 25 hours to $140 at 150.',
  },
  {
    q: 'Is media spend included?',
    a: 'No. Media spend is separate and paid directly by you to the platforms. Our management fee is flat, and never a percentage of the buy.',
  },
  {
    q: 'When do I get platform set-up?',
    a: 'Any engagement over $20,000 includes it. Below that it is available on its own — the Platform tab has the seat pricing.',
  },
  {
    q: 'Can I run a project and a subscription at once?',
    a: 'Most clients do. A project builds the thing; the subscription keeps it running and optimizes it once it is live.',
  },
  {
    q: 'What if what I need is not listed?',
    a: 'Ask. Our capabilities run deeper than the pills on these cards, and if we cannot help we can usually point you at someone who can.',
  },
]
