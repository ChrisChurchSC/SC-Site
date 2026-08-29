// The pricing page's three tabs: Platform, Project, Tasks.
//
// ─────────────────────────────────────────────────────────────────────────
// WHICH NUMBERS ARE REAL.
//
// PROJECT is real. Every figure in it is one Chris gave directly — the four
// Build pillars ($15,000 / $10,000 / $15,000 / $10,000 per channel) and the
// Grow hour tiers (25/50/100/150 hrs at $180/$165/$150/$140). The hour tiers
// are internally consistent: hours × rate is exactly the monthly figure,
// checked.
//
// PLATFORM AND TASKS ARE NOT. There is no seat price and no per-task price
// anywhere in this repo or in anything supplied, and the platform itself is
// Coming Soon. Every unsourced figure reads '––', the same placeholder the
// case-study cards use, at the size a real number would be — so the gap is
// visible rather than filled with something plausible.
//
// A seat price is a commercial term. Guessing one puts a quote on the site
// that nobody has agreed to, and a visitor cannot tell an invented $49/seat
// from a real one. THREE NUMBERS WOULD FINISH THIS PAGE: what a seat costs,
// what ongoing development costs per month, and what a task costs.
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
    blurb: 'Scoped up front, or retained by the hour. These are the numbers we quote from.',
    tiers: [
      {
        kicker: 'Fixed scope',
        name: 'Scoped engagement',
        price: 10000,
        unit: 'from, per project',
        note: null,
        summary: 'A brand, a website, a marketing mix or a channel — scoped and priced before it starts.',
        lines: [
          'Your Brand — from $15,000',
          'Your Website & App — from $10,000',
          'Your Marketing Mix — from $15,000',
          'Your Channels — from $10,000 per channel',
        ],
        cta: 'Book a demo',
      },
      {
        kicker: 'Month to month',
        name: 'Ongoing development',
        price: TBC,
        unit: 'per month',
        note: 'Price to confirm',
        summary: 'Continuous build on the platform and the product, rather than a project with an end date.',
        lines: [
          'A standing team, not a queue',
          'Ships every week',
          'Roadmap reviewed monthly',
        ],
        cta: 'Book a demo',
      },
      {
        kicker: 'Billed quarterly',
        name: 'Hourly support',
        price: 4500,
        unit: 'from, per month',
        note: 'One quarter minimum. Media spend is separate.',
        featured: true,
        summary: 'Optimizations, extensions and additions once the apparatus is in good shape.',
        lines: [
          '25 hrs / month — $4,500 · $180 per hour',
          '50 hrs / month — $8,250 · $165 per hour',
          '100 hrs / month — $15,000 · $150 per hour',
          '150 hrs / month — $21,000 · $140 per hour',
        ],
        cta: 'Book a demo',
      },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    eyebrow: 'Pay per task',
    blurb: 'One thing at a time, priced on its own. No retainer, no minimum.',
    tiers: [
      {
        kicker: 'Single',
        name: 'One task',
        price: TBC,
        unit: 'per task',
        note: 'Price to confirm',
        summary: 'A post, a page, an edit, a deck. Sent in, priced back, delivered.',
        lines: ['No minimum', 'Priced before it starts', 'The same people who build'],
        cta: 'Book a demo',
      },
      {
        kicker: 'Bundle',
        name: 'Task pack',
        price: TBC,
        unit: 'per pack',
        note: 'Price to confirm',
        featured: true,
        summary: 'A block of tasks drawn down as you need them, at a lower rate than one at a time.',
        lines: ['Drawn down over the quarter', 'Any task type', 'Unused tasks roll once'],
        cta: 'Book a demo',
      },
      {
        kicker: 'Standing',
        name: 'Always-on',
        price: 'Talk to us',
        unit: null,
        note: null,
        summary: 'A continuous flow of tasks with a queue we manage for you.',
        lines: ['A named producer', 'Agreed turnaround', 'Monthly report on what shipped'],
        cta: 'Talk to us',
      },
    ],
  },
]
