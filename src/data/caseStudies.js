const WW = (n) => `/cs/world-within/Super_Conscious_WW_${n}.jpg`

export const caseStudies = {
  'world-within': {
    n: '018',
    name: 'World Within',
    type: 'Campaign',
    year: '2022',
    tagline: 'A full brand and campaign system for a mission-driven organization raising capital through culture.',
    summary: 'World Within is a mission-driven organization working at the intersection of capital, culture, and community. They came to us without a brand, without a web presence, and with a launch window of under 90 days. We built their full identity system from scratch — naming architecture, visual language, motion principles, and a content framework that could scale across paid media, live events, and organic social. The campaign launched in Q4 2022 and exceeded every benchmark they set.',
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
        body: 'We developed a unified brand system — identity, motion language, and a content framework — that could flex across every touchpoint from paid social to live events. Every decision was made to serve the mission first.',
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
    credits: [
      { role: 'Creative Direction', name: 'Super Conscious' },
      { role: 'Brand Identity', name: 'Super Conscious' },
      { role: 'Web Design', name: 'Super Conscious' },
      { role: 'Motion', name: 'Super Conscious' },
      { role: 'Client', name: 'World Within' },
    ],
  },
}
