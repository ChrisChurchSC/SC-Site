// Agency / staff augmentation capacity blocks. Sized by people-months and
// scoped per engagement against the public rate card. Numbers are starting
// points; actual mix tunes per partner.
export const agencyPackages = [
  {
    slug: 'spot-project',
    name: 'Spot Project',
    goal: 'A single defined deliverable for one of your accounts.',
    outcome: 'A finished piece of work shipped on a fixed scope and timeline.',
    deliverables: ['Defined scope, fixed price', 'Direct collaboration with your project lead', 'White-labeled by default'],
    price: 5000,
    priceLabel: 'from',
  },
  {
    slug: 'embedded-designer',
    name: 'Embedded Designer',
    goal: 'One senior designer folded into your team for an ongoing program.',
    outcome: 'A trusted production hand who runs at your speed and your standards.',
    deliverables: ['~115 hrs / month, 1 designer', '3-month minimum, monthly thereafter', 'Lead or mid-level designer'],
    price: 11000,
    priceLabel: 'per month',
  },
  {
    slug: 'embedded-design-team',
    name: 'Embedded Design Team',
    goal: 'A small team of designers, led, that can take a brief and ship.',
    outcome: 'A full design team you can deploy to a client without staffing one yourself.',
    deliverables: ['Lead designer + 2 designers', 'Daily standups, shared backlog', '3-month minimum'],
    price: 22000,
    priceLabel: 'per month',
  },
  {
    slug: 'motion-and-video-block',
    name: 'Motion + Video Block',
    goal: 'Dedicated motion and edit capacity for ongoing video deliverables.',
    outcome: 'A motion engine you can pull from without booking freelancers per project.',
    deliverables: ['Animator + editor capacity', '~120 hrs / month combined', '2-month minimum'],
    price: 18000,
    priceLabel: 'per month',
  },
  {
    slug: 'design-and-engineering-pod',
    name: 'Design + Engineering Pod',
    goal: 'A full Build-shaped team for client work that requires both design and dev.',
    outcome: 'A pod that takes a brief from kickoff to shipped product.',
    deliverables: ['Lead designer + designer + developer + PM', 'End-to-end ownership of the build', '3-month minimum'],
    price: 32000,
    priceLabel: 'per month',
  },
  {
    slug: 'overflow-on-rate-card',
    name: 'Overflow on Rate Card',
    goal: 'On-demand capacity for moments when you need a hand and not a contract.',
    outcome: 'Spillover work absorbed at the same rate card your direct clients see.',
    deliverables: ['Hourly, billed against the rate card', 'No minimum, no retainer', 'Triggered per project'],
    price: null,
    priceLabel: 'Rate card',
  },
]

// Three disciplines, framed as capacity an agency can pull on.
export const agencyDisciplines = [
  {
    tag: 'Words you can pull on',
    name: 'Writing',
    items: [
      'Copywriting & scripts',
      'Brand voice & messaging',
      'Editorial & long-form',
      'Naming support',
      'Positioning collateral',
    ],
  },
  {
    tag: 'Design you can fold in',
    name: 'Design',
    items: [
      'Identity & visual systems',
      'Web & product UI',
      'Design systems & libraries',
      'Motion & illustration',
      'Decks & presentation',
    ],
  },
  {
    tag: 'Builds you can ship',
    name: 'Engineering',
    items: [
      'Marketing sites & landing pages',
      'Web apps & product builds',
      'CMS integration',
      'Prototyping & internal tools',
      'Performance & accessibility',
    ],
  },
]

// "How we partner" — three columns of explicit boundary-setting that
// removes the awkward 'do you steal our clients' subtext.
export const agencyPartnerModel = [
  {
    heading: 'What you keep',
    items: [
      'Strategy and account',
      'Client relationship and pitches',
      'Creative direction and brand stewardship',
      'Project leadership',
    ],
  },
  {
    heading: 'What we do',
    items: [
      'Production and execution',
      'Hands-on design, writing, and engineering',
      'Full deliverable craft or individual pieces',
      'Daily heads-down work on your briefs',
    ],
  },
  {
    heading: 'How we work',
    items: [
      'In your Slack, your tools, your project board',
      'Working under your project leads and timelines',
      'White-labeled by default, named only if you ask',
      'No direct contact with your client unless you invite it',
    ],
  },
]

export const agencyOutcomes = [
  { headline: 'Capacity without headcount', body: 'A senior team you can scale into a quarter and out of the next, without recruiting overhead.' },
  { headline: 'Wins on your roster, invisible execution', body: 'We ship under your brand and your client never knows we were there.' },
  { headline: 'Senior craft on every deliverable', body: 'No juniors learning on your account. The people in the room are the people doing the work.' },
  { headline: 'One predictable partner instead of five contractors', body: 'Strategy, design, copy, and build under one roof, on one timeline, against one scope.' },
]
