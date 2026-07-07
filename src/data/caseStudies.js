const WW = (n) => `/cs/world-within/Super_Conscious_WW_${n}.jpg`
const NZ = (file) => `/cs/nimruz/${file}`
const EA = (file) => `/cs/entropy/${file}`
const HY = (file) => `/cs/hylands/${file}`

export const caseStudies = {
  'hylands': {
    n: '028',
    name: 'Hylands',
    type: 'Brand + Content',
    year: '2025',
    tagline: 'A handmade clay world for a kids’ wellness brand.',
    summary: 'Hyland’s Kids makes gentle, organic remedies for little ones. We gave them a warm, tactile brand world — a cast of handmade clay characters and a claymation visual language that makes wellness feel like play, across identity, packaging, and 3D content.',
    services: ['Brand Identity', 'Character Design', '3D Illustration', 'Packaging', 'Content'],
    outcomes: [
      { category: 'World', outcome: 'A handmade, claymation visual language that makes a wellness brand feel joyful and kid-first.' },
      { category: 'Cast', outcome: 'A full cast of clay characters, designed from turnaround sheets to finished 3D renders.' },
      { category: 'System', outcome: 'Identity, packaging, and content built to scale across the product line.' },
    ],
    sections: [
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/417b83cc42855dd369963192be536dc9b32cbdfd.mp4' },
      {
        type: 'text',
        heading: 'The Idea',
        body: 'Kids’ medicine doesn’t have to feel clinical. We built a handmade clay world — warm, squishy, full of personality — so the brand feels like playtime.',
      },
      { type: 'image-full', ratio: '16/9', src: HY('SC_Hylands_02.webp') },
      {
        type: 'image-grid',
        images: [
          { src: HY('SC_Hylands_03.webp'), cols: 6, ratio: '1/1' },
          { src: HY('SC_Hylands_04.webp'), cols: 6, ratio: '1/1' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: HY('SC_Hylands_05.webp') },
      { type: 'image-full', ratio: '16/9', src: HY('SC_Hylands_06.webp') },
      { type: 'image-full', ratio: '16/9', src: HY('SC_Hylands_07.webp') },
      {
        type: 'text',
        heading: 'The Cast',
        body: 'A troupe of clay characters, each taken from line-art turnarounds to fully rendered 3D, carries the brand across packaging, animation, and social.',
      },
      {
        type: 'image-grid',
        images: [
          { src: HY('SC_Hylands_08.webp'), cols: 6, ratio: '1/1' },
          { src: HY('SC_Hylands_09.webp'), cols: 6, ratio: '1/1' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: HY('SC_Hylands_10.webp') },
      {
        type: 'image-grid',
        images: [
          { src: HY('SC_Hylands_11.webp'), cols: 6, ratio: '1/1' },
          { src: HY('SC_Hylands_12.webp'), cols: 6, ratio: '1/1' },
        ],
      },
      {
        type: 'text',
        heading: 'The World',
        body: 'Suns, moons, flowers, clouds, and hand-formed props complete the kit — everything needed to build a scene.',
      },
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/54246a662c06d6b5126757878b3b056309540243.mp4' },
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/f736b6d103d4bc2fa0fbfc6b719bb6abd4bc1ce4.mp4' },
    ],
  },

  'entropy': {
    n: '031',
    name: 'Entropy',
    type: 'Brand',
    year: '2025',
    tagline: 'A brand and design system for a firm empowering decentralized governance.',
    summary: 'Entropy Advisors works at the frontier of decentralized governance — helping DAOs manage treasuries, analyze on-chain activity, and make decisions with clarity. They needed a brand that could carry that credibility: technical enough to earn trust in crypto-native rooms, refined enough to stand alongside any modern software company. We developed the full identity and design system — a precise angular mark, a luminous cyan-to-jade gradient set against deep off-black, a typographic hierarchy built for dense information, and a data-visualization language that makes complex on-chain data legible at a glance. The system runs across web, social, dashboards, print, and merch.',
    services: ['Brand Identity', 'Design System', 'Data Visualization', 'Web', 'Social', 'Merchandise'],
    outcomes: [
      { category: 'Identity', outcome: 'Built a complete brand and design system — mark, gradient, type, and guidelines — engineered for a technical, high-trust audience.' },
      { category: 'Data', outcome: 'Developed a data-visualization language that turns treasuries, proposals, and on-chain flows into something legible at a glance.' },
      { category: 'System', outcome: 'Delivered a modular toolkit spanning web, dashboards, social, print, and merch that the team runs at the speed crypto moves.' },
    ],
    sections: [
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/e3249b7a60f724f81b185aacaca9630efaf9c2bd.mp4' },
      {
        type: 'text',
        heading: 'The Brief',
        body: 'Governance is abstract. Treasuries, proposals, on-chain flows — it’s a world of data most people never see clearly. Entropy Advisors needed a brand that could make that world feel legible and trustworthy without dumbing it down, holding up in a crypto-native audience and a boardroom alike.',
      },
      { type: 'image-full', ratio: '16/9', src: EA('SC_Entropy_02.webp') },
      { type: 'image-full', ratio: '16/9', src: EA('SC_Entropy_03.webp') },
      {
        type: 'image-grid',
        images: [
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/d338780a809ce9f455bb2e2bd7a34d1c9b0e10b2.mp4', cols: 6, ratio: '4/5' },
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/b9985905347a0c2d3a4bc0dd26dd6924dc8eef65.mp4', cols: 6, ratio: '4/5' },
        ],
      },
      {
        type: 'text',
        heading: 'The System',
        body: 'We built the identity around a single idea: order emerging from entropy. A precise, angular mark; a luminous gradient moving from cyan to jade; deep off-black grounds; and a typographic stack — Surt Expanded for headlines, Basis Grotesque for body, Chivo Mono for data — tuned for information density. Every element is documented in a full set of brand guidelines the team runs against.',
      },
      { type: 'image-full', ratio: '1920 / 978', src: 'https://cdn.sanity.io/files/ppq16wpu/production/9bdd81b8db9a09e17cb710ba72f0ef0133b57d16.mp4', website: 'https://entropyadvisors.com/' },
      { type: 'image-full', ratio: '16/9', src: EA('SC_Entropy_07.webp') },
      {
        type: 'image-grid',
        images: [
          { src: EA('SC_Entropy_08.webp'), cols: 6, ratio: '4/5' },
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/ace1f6468c36a451cbe6477c516d434fd00755e9.mp4', cols: 6, ratio: '4/5' },
        ],
      },
      {
        type: 'text',
        heading: 'Out in the World',
        body: 'The brand had to live everywhere Entropy shows up — a treasury dashboard, a promoted post, a conference keynote, a crewneck at a hackathon. We designed a data-visualization language and a modular content system so the team can produce on-brand work whether it’s a governance report or a launch announcement.',
      },
      { type: 'image-full', ratio: '16/9', src: EA('SC_Entropy_10.webp') },
      {
        type: 'image-grid',
        images: [
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/53246539e65e7ab99cd36fe8f8cda9974ad7b515.mp4', cols: 6, ratio: '4/5' },
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/4bd18a1692e469f947f1979a14b97abc1b5e2926.mp4', cols: 6, ratio: '4/5' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: EA('SC_Entropy_13.webp') },
      { type: 'image-full', ratio: '16/9', src: EA('SC_Entropy_14.webp') },
    ],
  },

  'nimruz': {
    n: '016',
    name: 'Nimruz',
    type: 'Brand + Content',
    year: '2025',
    tagline: 'A rebrand and content system for a platform cultivating Iranian culture.',
    summary: 'Nimruz set out to do something needed and relevant: cultivate Iranian culture for a new generation, in a way that feels warm, modern, and rooted all at once. They came to us with an established name and wordmark — Nimruz, the land of the midday sun — but a visual world that hadn’t yet caught up to the vision. So we rebranded: a near-total overhaul that kept the existing wordmarks untouched and rebuilt everything around them. We introduced a new sun brandmark as the anchor, then extended it into a sun-drenched visual language drawn from Persian art and architecture, a system of calligraphic flourishes, and a content framework designed to run across social every day without ever losing its soul. The result is a brand that feels like home and reads as new.',
    services: ['Rebrand', 'Brandmark', 'Visual Language', 'Content System', 'Social', 'Motion'],
    outcomes: [
      { category: 'Identity', outcome: 'Introduced a new sun brandmark and rebuilt the full visual system — palette, motifs, and motion — around the existing wordmark, grounded in Persian art.' },
      { category: 'Content', outcome: 'Built a modular content framework the team runs independently across social, day in and day out.' },
      { category: 'Resonance', outcome: 'A brand that reads as both deeply familiar and unmistakably contemporary — heritage on one side, right now on the other.' },
    ],
    sections: [
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/030ea9ecc0c8557a8087f0c9a81c5cba613b699c.mp4', sound: true },
      {
        type: 'text',
        heading: 'The Vision',
        body: 'Nimruz means the land of the midday sun — the place where light is at its fullest. That idea became the center of gravity for the entire brand. Everything radiates warmth: sunrise gradients, golden hour tones, and a sensibility that treats heritage not as a museum piece but as something living, generous, and worth passing on.',
      },
      {
        type: 'image-grid',
        images: [
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/06b57444cac8eaad637cf5084664ee58c7a8edab.mp4', cols: 6, ratio: '4/5' },
          { src: NZ('SC_Nimruz_03.webp'), cols: 6, ratio: '4/5' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: NZ('SC_Nimruz_04.webp') },
      { type: 'image-full', ratio: '16/9', src: NZ('SC_Nimruz_05.webp') },
      {
        type: 'text',
        heading: 'The Challenge',
        body: 'Cultural brands walk a narrow line. Lean too traditional and you speak only to the past; lean too modern and you lose the thread entirely. Nimruz needed a language that could hold both — reverent enough to honor Iranian art and identity, contemporary enough to live natively on a phone screen and earn a place in a young audience’s feed.',
      },
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/70d042ce90c9a611ba8dfae00c74c3b5ced71401.mp4', sound: true },
      {
        type: 'image-grid',
        images: [
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/90e8826c9a8db3635272a7f27383617432af34fe.mp4', cols: 6, ratio: '4/5' },
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/70dd9faeb543c43bce184daed08f411cca162e49.mp4', cols: 6, ratio: '4/5' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/38381453f7d2b8202babafb15973be1e64ee6916.mp4', website: 'https://www.nimruz.org/' },
      { type: 'image-full', ratio: '16/9', src: 'https://cdn.sanity.io/files/ppq16wpu/production/4e015f26e5d002371516adf0365b348d29a33cfc.mp4' },
      {
        type: 'text',
        heading: 'The System',
        body: 'The overhaul centered on one new element: a sun brandmark, designed to sit alongside the existing wordmark rather than replace it. From there we extended a full toolkit — a warm, saturated palette pulled from Persian miniatures and tilework, and a library of calligraphic line flourishes that give every layout a handmade signature. It all flows naturally into apparel, editorial, and a content system the team can run on their own.',
      },
      {
        type: 'image-grid',
        images: [
          { src: NZ('SC_Nimruz_11.webp'), cols: 6, ratio: '4/5' },
          { src: NZ('SC_Nimruz_12.webp'), cols: 6, ratio: '4/5' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: NZ('SC_Nimruz_13.webp') },
      {
        type: 'image-grid',
        images: [
          { src: NZ('SC_Nimruz_14.webp'), cols: 6, ratio: '4/5' },
          { src: NZ('SC_Nimruz_15.webp'), cols: 6, ratio: '4/5' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: NZ('SC_Nimruz_16.webp') },
      {
        type: 'text',
        heading: 'In Motion',
        body: 'Static was never going to be enough. We designed the brand to move — suns that rise, flourishes that draw themselves on, the wordmark catching the light — so that every post carries the same warmth in motion as it does on the page. The content system turns that language into a repeatable, ownable rhythm the team publishes against every week.',
      },
      {
        type: 'image-grid',
        images: [
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/1fcf05f21538975a51fb81738afbca588bfbbf08.mp4', cols: 6, ratio: '4/5' },
          { src: 'https://cdn.sanity.io/files/ppq16wpu/production/b9aede65bc98e85a925dff87542152cf0ac6ad3f.mp4', cols: 6, ratio: '4/5' },
        ],
      },
      { type: 'image-full', ratio: '16/9', src: NZ('SC_Nimruz_19.webp') },
    ],
  },

  'world-within': {
    n: '018',
    name: 'World Within',
    type: 'Campaign',
    year: '2022',
    tagline: 'A full brand and campaign system for a mission-driven organization raising capital through culture.',
    summary: 'World Within is a mission-driven organization working at the intersection of capital, culture, and community. They came to us without a brand, without a web presence, and with a launch window of under 90 days. We built their full identity system from scratch: naming architecture, visual language, motion principles, and a content framework that could scale across paid media, live events, and organic social. The campaign launched in Q4 2022 and exceeded every benchmark they set.',
    services: ['Brand Identity', 'Website', 'Social', 'Animation', 'Marketing'],
    outcomes: [
      { category: 'Fundraising', outcome: 'Raised $2.4M in their first public campaign launch.' },
      { category: 'Partnerships', outcome: 'Secured 3 institutional partnerships within 60 days of launch.' },
      { category: 'Awareness', outcome: 'Grew social following by 180% over the campaign period.' },
    ],
    sections: [
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(1),
      },
      {
        type: 'text',
        heading: 'The Challenge',
        body: 'World Within needed a visual language that could carry both the weight of their mission and the energy of their community. The brand had to feel credible to institutional partners while remaining human and accessible to everyday donors.',
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(2), cols: 7, ratio: '16/9' },
          { src: WW(3), cols: 5, ratio: '4/5' },
        ],
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(4), cols: 4, ratio: '4/5' },
          { src: WW(5), cols: 4, ratio: '4/5' },
          { src: WW(6), cols: 4, ratio: '4/5' },
        ],
      },
      {
        type: 'text',
        heading: 'The Approach',
        body: 'We developed a unified brand system (identity, motion language, and a content framework) that could flex across every touchpoint from paid social to live events. Every decision was made to serve the mission first.',
      },
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(7),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(10), cols: 5, ratio: '4/5' },
          { src: WW(11), cols: 7, ratio: '16/9' },
        ],
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(13), cols: 6, ratio: '16/9' },
          { src: WW(14), cols: 6, ratio: '16/9' },
        ],
      },
      {
        type: 'image-full',
        ratio: '9/16',
        src: WW(16),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(17), cols: 4, ratio: '4/5' },
          { src: WW(18), cols: 4, ratio: '4/5' },
          { src: WW(19), cols: 4, ratio: '4/5' },
        ],
      },
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(20),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(22), cols: 7, ratio: '16/9' },
          { src: WW(25), cols: 5, ratio: '9/16' },
        ],
      },
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(26),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(28), cols: 4, ratio: '4/5' },
          { src: WW(33), cols: 4, ratio: '4/5' },
          { src: WW(34), cols: 4, ratio: '4/5' },
        ],
      },
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(36),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(37), cols: 5, ratio: '16/9' },
          { src: WW(38), cols: 7, ratio: '4/5' },
        ],
      },
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(40),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(42), cols: 6, ratio: '4/5' },
          { src: WW(44), cols: 6, ratio: '4/5' },
        ],
      },
      {
        type: 'image-full',
        ratio: '16/9',
        src: WW(48),
      },
      {
        type: 'image-grid',
        images: [
          { src: WW(45), cols: 4, ratio: '9/16' },
          { src: WW(46), cols: 4, ratio: '9/16' },
          { src: WW(49), cols: 4, ratio: '9/16' },
        ],
      },
    ],
  },
}
