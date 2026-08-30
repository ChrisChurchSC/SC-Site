// The pricing page's three tabs: Platform, Project, Tasks.
//
// ─────────────────────────────────────────────────────────────────────────
// EVERY NUMBER ON THIS PAGE IS ONE CHRIS GAVE DIRECTLY. The four Build
// pillars ($15,000 / $10,000 / $15,000 / $10,000 per channel), the four hour
// tiers (25/50/100/150 hrs at $180/$165/$150/$140), and the $20,000 platform
// threshold. The hour tiers are internally consistent — hours × rate is
// exactly the monthly figure, checked.
//
// THERE IS NOTHING LEFT TO CONFIRM. There was a Platform tab priced by seat,
// and every figure in it read '––' because no seat price exists. It is gone:
// the platform is now the wide card under the Project tab, which describes
// what the set-up gives you rather than selling it by the seat. If seat
// pricing is ever set, that tab is in the history — see 555e77b.
//
// TBC is kept for the next unpriced thing rather than deleted; it is the
// convention the case-study cards use and it should stay one import away.
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
    perk: 'Every engagement over $20,000 includes full platform set-up.',
    /* The wide card under the four. The banner above says you GET it; this
       says what it IS — they are the offer and the product, and one without
       the other is either an unexplained freebie or a feature list nobody
       was offered. */
    feature: {
      /* No items list here: the card renders PLATFORM_PAGES from V3Nav, so
         the pricing page and the nav panel cannot describe the platform
         differently. */
      eyebrow: 'What the set-up gives you',
      name: 'The platform',
      body: 'Every project leaves behind more than files. The brand goes into a repo your whole team works from, with agents trained on it, and a review step before anything lands.',
      price: 7500,
      unit: 'starting at',
      cta: 'Book a demo',
    },
    tiers: [
      {
        kicker: '01',
        name: 'Brand',
        price: 15000,
        unit: 'starting at',
        note: null,
        summary: 'Naming, identity and the system that holds it — new, rebuilt or refreshed.',
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
        name: 'Campaign',
        price: 15000,
        unit: 'starting at',
        note: 'Covers initial marketing set-up and the initial flighting of any campaigns. Campaign extensions and subsequent campaign work billed separately. All production costs are billed separately.',
        summary: 'Audiences, campaign strategy and concept, paid media, partnerships and the dashboards under them.',
        lines: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
        /* WHAT THE CAMPAIGN HANDS OVER, as opposed to what goes into it.
           Read by the "What it makes" section on a service page; /pricing
           still renders `lines`. Audience architecture and a campaign
           concept are inputs to a campaign, not things it produces, and
           under a "what it makes" heading they read as the wrong half of
           the job. Same split as `outputs` on the Campaign pillar in
           services.js, and the two lists should be kept in step.

           My wording, not signed off. */
        outputs: ['Key Visual', 'Campaign Film', 'Paid Ads', 'Social Assets', 'Landing Page', 'Media Plan', 'Dashboards'],
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
    /* Annual saves 10%. That is a real commercial term now rather than my
       arithmetic, so the discount belongs in the data and every figure on
       the card derives from it — including the hourly rate, which is 10%
       lower if you pay for the year. A card showing a discounted total
       beside an undiscounted rate would be quoting two different deals. */
    periods: [
      { id: 'monthly', label: 'Monthly', months: 1, discount: 0, unit: 'per month' },
      { id: 'annual', label: 'Annual', badge: 'Save 10%', months: 12, discount: 0.1, unit: 'per year' },
    ],
    label: 'Subscription',
    eyebrow: 'Keep us on',
    blurb: 'Ongoing support, billed hourly and invoiced quarterly with a one quarter minimum. Media spend is separate — our management fee is flat, never a percentage of the buy.',
    tiers: [
      {
        kicker: '25 hrs / month',
        rate: 180,
        price: 4500,
        unit: 'per month',
        note: null,
        summary: 'A light standing capacity for upkeep and the small pieces that keep coming up.',
        lines: ['Spend them on Build, Grow, Support or Represent', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
      {
        kicker: '50 hrs / month',
        rate: 165,
        price: 8250,
        unit: 'per month',
        note: null,
        summary: 'Enough to keep a couple of things moving properly every month.',
        lines: ['Spend them on Build, Grow, Support or Represent', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
      {
        kicker: '100 hrs / month',
        rate: 150,
        price: 15000,
        unit: 'per month',
        note: null,
        featured: true,
        summary: 'A substantial standing team, pointed at whatever needs it most.',
        lines: ['Spend them on Build, Grow, Support or Represent', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
      },
      {
        kicker: '150 hrs / month',
        rate: 140,
        price: 21000,
        unit: 'per month',
        note: null,
        summary: 'The most capacity, with room to take on new work as it arrives.',
        lines: ['Spend them on Build, Grow, Support or Represent', 'Billed quarterly', 'One quarter minimum'],
        cta: 'Book a demo',
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
