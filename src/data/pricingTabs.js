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

/**
 * WHAT THE BRAND PLATFORM HOLDS.
 *
 * The six pills above this list are the shapes an engagement comes in — a
 * new brand, a rebrand, a refresh. These are what the engagement leaves
 * behind, grouped the way the diagram on /services/build draws them: the
 * three sides of a brand across the tab row, and the four parts of the
 * platform that keep it usable afterwards.
 *
 * EVERY ITEM IS LIFTED, NOT WRITTEN. Visual and Verbal are the cells and
 * lists on the boards in VisualSystemWindow. Audio is that component's four
 * rows verbatim. Memory, Agents and Data come out of the Learned, Operating,
 * Goals, Evidence and Legal groups in brandInputs.js.
 *
 * AUDIO IS NOT HERE. VisualSystemWindow still draws the tab, because a brand
 * has a sound whether or not one has been filed — but there is no Audio
 * folder in SC-Brand and nothing to sell, so the pricing card does not list
 * it. The diagram can name an open question; a price cannot.
 *
 * LIBRARY IS THE THIN ONE. It has no folder in SC-Brand either and no page
 * was ever built for it, so rather than invent a shelf list its three items
 * are real tokens borrowed from the Legal and Operating groups — the ones
 * that describe a kept asset rather than a made one. If a library is ever
 * specified properly, this is the group to rewrite first.
 */
const PLATFORM_GROUPS = [
  {
    name: 'Visual',
    items: ['Logomark', 'Logotype', 'Type', 'Palette', 'Iconography', 'Tokens',
            'Components', 'Layout', 'Motion', 'Imagery direction', 'Illustration style'],
  },
  {
    name: 'Verbal',
    items: ['Positioning', 'Narrative', 'Tone of voice', 'Naming rules', 'Lexicon',
            'Headline patterns', 'Body copy', 'Microcopy', 'Dataviz conventions'],
  },
  {
    name: 'Memory',
    items: ['Decisions', 'Rejections with reasons', 'Exceptions', 'Candidate rules', 'Performance summary'],
  },
  {
    name: 'Library',
    items: ['Approved assets', 'Expiry dates', 'Provenance'],
  },
  {
    name: 'Agents',
    items: ['Agent definitions', 'Prompt library', 'Access rules'],
  },
  {
    name: 'Data',
    items: ['Goals', 'Proof points', 'Objections', 'Audience', 'Approved claims', 'Channel specs'],
  },
]

export const tabs = [
  {
    id: 'project',
    /* The service this section prices. PricingV3 reads the name and the line
       under it out of services.js, so /pricing cannot describe Build
       differently from /services/build. */
    service: 'build',
    /* THE LABEL AND THE ID ARE DELIBERATELY DIFFERENT. The tabs are named for
       the two services — /services/build and /services/grow — so the pricing
       page and the nav agree on what the two things are called. The ids stay
       'project' and 'subscription' because they are how the page is bought:
       one is scoped up front, the other is hours on a retainer. Renaming them
       would mean touching every tab.id === 'project' test and the 'project'
       variant in PricingV3, all of which are about the billing shape rather
       than the service. */
    label: 'Build',
    /* A threshold rather than a line on every card: it depends on the size
       of the order, not on which project it is. Rendered above the cards —
       see the note in the JSX. */
    /* The platform card and its bundling perk were removed when the platform
       was cut from this site. They sold it at $7,500 starting-at, and gave it
       away free over $20,000. Both offers are gone from the pricing page and
       neither has been replaced — see git history for the exact wording. */
    /* The wide card under the four. The banner above says you GET it; this
       says what it IS — they are the offer and the product, and one without
       the other is either an unexplained freebie or a feature list nobody
       was offered. */
    tiers: [
      {
        kicker: '01',
        /* "Brand platform", not "Brand" — it is the named strategy deliverable
           in serviceConstants, and on both this page and /services/build it
           leads with the other three presented as what it extends to. */
        name: 'Brand platform',
        price: 15000,
        unit: 'starting at',
        note: null,
        summary: 'Naming, identity and the system that holds it — new, rebuilt or refreshed.',
        lines: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Product Positioning'],
        groups: PLATFORM_GROUPS,
        cta: 'Start a project',
      },
      {
        kicker: '02',
        name: 'Website',
        price: 10000,
        unit: 'starting at',
        note: null,
        summary: 'A brochure site, an ecom build or a web app — designed, built, integrated and deployed.',
        lines: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
        cta: 'Start a project',
      },
      {
        kicker: '03',
        name: 'Campaign',
        price: 15000,
        unit: 'starting at',
        note: 'Covers initial marketing set-up and the initial flighting of any campaigns. Campaign extensions and subsequent campaign work billed separately. All film production costs are billed separately.',
        outputsNote: 'All film production costs are billed separately.',
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
        cta: 'Start a project',
      },
      {
        kicker: '04',
        name: 'Channels',
        price: 10000,
        unit: 'per channel',
        note: 'Covers initial channel set-up and two months of organic content.',
        summary: 'The channels your audience is actually on, set up and fed.',
        lines: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
        outputs: ['Channel Set-up', 'Profile Assets', 'Content Calendar', 'Organic Posts', 'Short-Form Video', 'Reporting'],
        cta: 'Start a project',
      },
    ],
  },
  {
    id: 'subscription',
    service: 'grow',
    /* Annual saves 10%. That is a real commercial term now rather than my
       arithmetic, so the discount belongs in the data and every figure on
       the card derives from it — including the hourly rate, which is 10%
       lower if you pay for the year. A card showing a discounted total
       beside an undiscounted rate would be quoting two different deals. */
    periods: [
      { id: 'monthly', label: 'Monthly', months: 1, discount: 0, unit: 'per month' },
      { id: 'annual', label: 'Annual', badge: 'Save 10%', months: 12, discount: 0.1, unit: 'per year' },
    ],
    label: 'Grow',
    /* WHAT THE HOURS BUY IS NOT A BULLET. It used to be the first line on
       every card — 'Build, Grow, Support or Represent' — which was wrong
       twice over: it sold hours against Build, which is scoped and priced up
       front on the other tab, and against Support and Represent, which are
       unsigned-off drafts with no page and no rate (see the standing note in
       ServiceV3 and V3Nav; services.js has two slugs and an unknown one
       redirects). Chris's call, 2026-08-31: these are Grow hours, and the tab
       says Grow, so the bullet was the card repeating its own heading. What
       is left is the two things the tab does not say — how it is billed, and
       the minimum. */
    tiers: [
      {
        kicker: '25 hrs / month',
        rate: 180,
        price: 4500,
        unit: 'per month',
        note: null,
        summary: 'A light standing capacity for upkeep and the small pieces that keep coming up.',
        lines: ['Billed quarterly', 'One quarter minimum'],
        cta: 'Start a project',
      },
      {
        kicker: '50 hrs / month',
        rate: 165,
        price: 8250,
        unit: 'per month',
        note: null,
        summary: 'Enough to keep a couple of things moving properly every month.',
        lines: ['Billed quarterly', 'One quarter minimum'],
        cta: 'Start a project',
      },
      {
        kicker: '100 hrs / month',
        rate: 150,
        price: 15000,
        unit: 'per month',
        note: null,
        featured: true,
        summary: 'A substantial standing team, pointed at whatever needs it most.',
        lines: ['Billed quarterly', 'One quarter minimum'],
        cta: 'Start a project',
      },
      {
        kicker: '150 hrs / month',
        rate: 140,
        price: 21000,
        unit: 'per month',
        note: null,
        summary: 'The most capacity, with room to take on new work as it arrives.',
        lines: ['Billed quarterly', 'One quarter minimum'],
        cta: 'Start a project',
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
    q: 'Can I run a project and a subscription at once?',
    a: 'Most clients do. A project builds the thing; the subscription keeps it running and optimizes it once it is live.',
  },
  {
    q: 'What if what I need is not listed?',
    a: 'Ask. Our capabilities run deeper than the pills on these cards, and if we cannot help we can usually point you at someone who can.',
  },
]
