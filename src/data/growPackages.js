// Six Grow-side packages from the Estimator (with prices) workbook.
// Stable across prospects — edit here, not in Sanity.
export const growPackages = [
  {
    slug: 'convert-interest-to-customers',
    name: 'Convert Interest to Customers',
    goal: 'Turn the interest you have already earned into signed customers.',
    outcome: 'Higher conversion rate and lower cost per acquisition.',
    deliverables: ['Landing page', 'Campaign copy', 'Static ad set — batch of 10', 'Campaign email series'],
    price: 11495,
  },
  {
    slug: 'nurture-and-stay-top-of-mind',
    name: 'Nurture & Stay Top of Mind',
    goal: 'Keep aware prospects engaged until they are ready to buy.',
    outcome: 'Sustained engagement that moves prospects through your sales cycle.',
    deliverables: ['Social strategy & kickoff', 'Static posts — batch of 12', 'Short-form video — batch of 6', 'Campaign email series'],
    price: 13670,
  },
  {
    slug: 'generate-qualified-leads',
    name: 'Generate Qualified Leads',
    goal: 'A demand-gen system that turns attention into sales-ready pipeline.',
    outcome: 'Predictable lead volume at a cost per qualified lead you can plan around.',
    deliverables: ['Content strategy & brief', 'Industry report', 'Landing page', 'Campaign email series', 'Static ad set — batch of 10'],
    price: 22140,
  },
  {
    slug: 'retain-and-expand-customers',
    name: 'Retain & Expand Customers',
    goal: 'Keep the customers you have won and grow what they are worth.',
    outcome: 'Lower churn and bigger lifetime value from the customers you already have.',
    deliverables: ['Lifecycle email program', 'Customer onboarding content', 'Loyalty / retention campaign', 'Editorial newsletter design'],
    price: 25180,
  },
  {
    slug: 'launch-to-market',
    name: 'Launch to Market',
    goal: 'Bring a product or moment to market with one coordinated push.',
    outcome: 'A launch window that captures attention and converts it into signups, traffic, and demo requests.',
    deliverables: ['Video strategy & creative direction', 'Product launch film', 'Landing page', 'Campaign email series', 'Campaign launch pack'],
    price: 54350,
  },
  {
    slug: 'grow-awareness',
    name: 'Grow Awareness',
    goal: 'Get in front of people who do not know you yet and become a name they recognize.',
    outcome: 'Reach, impressions, and new-audience growth at scale.',
    deliverables: ['Campaign concept', 'Brand film — :60–:90 hero', 'Industry report', 'Static ad set — batch of 10'],
    price: 54955,
  },
]

// Grow-side service line items from the Estimator.
export const growServices = [
  {
    category: 'Social',
    items: [
      { name: 'Static posts — batch of 4', desc: '4 posts · 1 platform · existing brand', price: 900 },
      { name: 'Carousels — batch of 3', desc: '3 carousels · 5–8 slides each', price: 1470 },
      { name: 'Static posts — batch of 8', desc: '8 posts · 1 platform · cohesive look', price: 1705 },
      { name: 'Social strategy & kickoff', desc: 'workshop · content pillars · platform plan', price: 2200 },
      { name: 'Static posts — batch of 12', desc: '12 posts · 1–2 platforms · cohesive system', price: 2555 },
      { name: 'Carousels — batch of 6', desc: '6 carousels · 5–8 slides each', price: 2560 },
      { name: 'Illustrated posts — batch of 3', desc: 'custom illustration · 3 assets', price: 3225 },
      { name: 'Animated loops — batch of 3', desc: '3 social loops · 2D motion · brand-led', price: 3125 },
      { name: 'Short-form video — batch of 3', desc: '3 vertical edits · from existing footage', price: 3575 },
      { name: 'Short-form video — batch of 6', desc: '6 vertical edits · from existing footage', price: 6690 },
      { name: '3D animated posts — batch of 2', desc: '2 premium 3D pieces · 10–20s each', price: 7610 },
      { name: 'Short-form video — shoot day', desc: '1 day · 4–6 deliverable edits', price: 8250 },
      { name: 'Campaign launch pack', desc: '~10 assets · static + motion · 1 platform', price: 8325 },
      { name: 'Multi-platform launch', desc: '~20 assets · 3 platforms · format-tailored', price: 15380 },
    ],
  },
  {
    category: 'Long-form Video',
    items: [
      { name: 'Video strategy & creative direction', desc: 'concept, script direction, creative brief', price: 2900 },
      { name: 'Sizzle reel / explainer', desc: '60–90s · motion graphics led · no shoot', price: 11730 },
      { name: 'Founder / customer story', desc: '~3 min · 1 day shoot · single subject', price: 13320 },
      { name: 'Case study film', desc: '~2 min · interview + b-roll · multi-location', price: 16250 },
      { name: 'Brand film — :30 ad', desc: '1 shoot day · 1 location · post-production', price: 16960 },
      { name: 'Ad campaign — TVC + cutdowns', desc: 'hero :30 + :15 + :06 versions', price: 27650 },
      { name: 'Brand film — :60–:90 hero', desc: '2 shoot days · multi-location · premium post', price: 30530 },
      { name: 'Product launch film', desc: ':60–:90 · 3D + live action hybrid', price: 35970 },
      { name: 'Documentary short', desc: '5–10 min · 2–3 shoot days · interviews + b-roll', price: 38930 },
    ],
  },
  {
    category: 'Lead Magnets',
    items: [
      { name: 'One-pager / checklist', desc: '1 page · designed PDF · brand-led', price: 805 },
      { name: 'Content strategy & brief', desc: 'topic, audience, narrative arc, structure', price: 1730 },
      { name: 'Short guide', desc: '5–10 pages · designed PDF · light illustration', price: 2855 },
      { name: 'Template kit', desc: 'Notion / Figma / Slides · 5–10 templates', price: 2880 },
      { name: 'Whitepaper', desc: '10–20 pages · editorial · data-light', price: 4650 },
      { name: 'Interactive calculator / quiz', desc: 'light dev · branded UI · embeddable', price: 5665 },
      { name: 'Ebook / playbook', desc: '15–30 pages · designed PDF · custom layout', price: 6925 },
      { name: 'Lead magnet bundle', desc: 'guide + landing page + 3 emails + 4 social posts', price: 9865 },
      { name: 'Industry report', desc: '20–40 pages · charts, data viz, custom layout', price: 10365 },
    ],
  },
  {
    category: 'Email & Newsletter',
    items: [
      { name: 'Email strategy & template plan', desc: 'audience, cadence, content types', price: 1280 },
      { name: 'Emails — batch of 3', desc: '3 designed emails · brand-led', price: 1470 },
      { name: 'Campaign email series', desc: '3–5 emails · drip · brand-led', price: 2225 },
      { name: 'Emails — batch of 6', desc: '6 designed emails · brand-led', price: 2750 },
      { name: 'Launch announcement email', desc: '1 hero + 2 follow-ups · custom illustration', price: 2840 },
      { name: 'Newsletter template system', desc: 'modular template · 4–6 component variants', price: 5080 },
      { name: 'Editorial newsletter design', desc: 'recurring layout system + first 3 issues', price: 6385 },
    ],
  },
  {
    category: 'Lifecycle & Retention',
    items: [
      { name: 'Customer onboarding content', desc: 'welcome journey · guides · in-product moments', price: 5730 },
      { name: 'Lifecycle email program', desc: 'onboarding, nurture & win-back flows', price: 6420 },
      { name: 'Loyalty / retention campaign', desc: 're-engage & reward existing customers', price: 6645 },
    ],
  },
  {
    category: 'Ad Creative',
    items: [
      { name: 'Static ad set — batch of 5', desc: '5 performance ads · 1 channel', price: 1515 },
      { name: 'Ad concept & strategy', desc: 'performance creative direction · hooks · angles', price: 2045 },
      { name: 'Static ad set — batch of 10', desc: '10 ads · multi-format · A/B variations', price: 2890 },
      { name: 'Display ad campaign', desc: 'full banner set · all IAB sizes · 1 concept', price: 3070 },
      { name: 'Video ad — short', desc: '6–15s performance video · from existing assets', price: 3265 },
      { name: 'Video ad set — batch of 3', desc: '3 performance videos · platform-tailored cutdowns', price: 5190 },
      { name: 'Always-on ad production', desc: '~20 ad variations/month · iterative testing', price: 8300 },
    ],
  },
  {
    category: 'AI Services',
    items: [
      { name: 'AI-generated content batch', desc: 'AI-assisted asset production · human-directed', price: 2780 },
      { name: 'AI consulting & training', desc: 'workshops · team upskilling · advisory', price: 3880 },
      { name: 'AI workflow audit', desc: 'review creative ops · identify AI opportunities', price: 4510 },
      { name: 'AI brand training & guidelines', desc: 'train AI on brand · prompt library · usage guide', price: 5680 },
      { name: 'AI creative pipeline setup', desc: 'build AI-assisted production workflow', price: 10190 },
      { name: 'Custom AI tool / agent', desc: 'bespoke AI tool for a client workflow', price: 13580 },
    ],
  },
]

// Three disciplines that contribute to Grow work.
export const growDisciplines = [
  {
    tag: 'Where attention should go',
    name: 'Strategy',
    items: [
      'Demand & channel strategy',
      'Audience definition & segmentation',
      'Editorial direction',
      'Campaign concepting',
      'Measurement framework',
    ],
  },
  {
    tag: 'What goes out',
    name: 'Content',
    items: [
      'Social posts & carousels',
      'Short- and long-form video',
      'Lead magnets & editorial',
      'Email & newsletter design',
      'Motion & illustration',
    ],
  },
  {
    tag: 'How we drive results',
    name: 'Performance',
    items: [
      'Paid ad creative',
      'Landing pages & conversion',
      'Lifecycle & retention systems',
      'A/B testing frameworks',
      'Always-on optimization',
    ],
  },
]

export const growOutcomes = [
  { headline: 'A predictable pipeline you can plan around', body: 'Channels that compound month over month, not one-off spikes.' },
  { headline: 'Higher conversion at every stage of the funnel', body: 'Site, content, and offers tuned so more of the traffic you already have turns into pipeline.' },
  { headline: 'Content that ranks, ships weekly, and earns inbound', body: 'A consistent editorial engine your team owns, not a dependency on the next campaign.' },
  { headline: 'Clear attribution, not vanity metrics', body: 'Reporting that tells you which channel, asset, and message is moving revenue.' },
]
