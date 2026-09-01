/**
 * OUTCOMES, as pages.
 *
 * Third record type read by AudiencePage, after industries and stages: a
 * slug, a name, an optional split hero, three situations and overrides for
 * the shared sections. Anything left out falls back to the studio-wide copy.
 *
 * AN OUTCOME IS NOT A RESULT WE ARE CLAIMING. The nav and footer have carried
 * these six as reasons people come to us — more leads, a better win rate, a
 * shorter cycle. A page for one says what usually stands in the way and what
 * the work does about it. It does not say we have produced the outcome:
 * proof-points.md grades that kind of statement, and featuredCaseStudies.js
 * is explicit that no published figures exist to back one.
 *
 * SO THE SITUATIONS SPLIT ON THE CAUSE, not on the size of the company. That
 * is the axis that actually changes what gets made — a traffic problem, a
 * conversion problem and a qualification problem need different work, and a
 * reader knows which one they have.
 *
 * NO CLIENT LIST. Nothing in the repo records which engagement moved which
 * outcome, so the rail shows the four written case studies under a heading
 * that claims nothing — the same arrangement the stage pages use.
 */
export const outcomes = [
  {
    slug: 'get-more-leads',
    name: 'Get more leads',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'Three different problems wear the same sentence: not enough people ' +
        'arrive, the ones who arrive leave, or the wrong ones arrive. Each ' +
        'needs different work.',
    },

    situationsHeadline: 'Three reasons the number is short.',

    situations: [
      {
        id: 'nobody-arrives',
        name: 'Nobody arrives',
        body:
          'Volume is the constraint. The product is findable only by people ' +
          'who already know the name, so the work is being found at all — ' +
          'search, media and enough published to rank.',
        pills: ['Organic traffic growth', 'Brand search volume'],
      },
      {
        id: 'they-leave',
        name: 'They arrive and leave',
        body:
          'Traffic is fine and the page does not finish the argument. What is ' +
          'missing is usually the proof and the clarity, not the button.',
        pills: ['Bounce rate', 'Contact conversion rate'],
      },
      {
        id: 'wrong-ones',
        name: 'The wrong ones arrive',
        body:
          'The number looks healthy and the pipeline does not move. Being ' +
          'more specific costs volume on purpose, and the leads that remain ' +
          'are the ones sales can work.',
        pills: ['Cost per lead', 'MQL-to-SQL rate'],
      },
    ],

    embed: {
      headline: [
        'Your fractional creative',
        'and marketing department,',
        'pointed at the top of it.',
      ],
    },

    /* Search, media, writing and design are four of the twelve, and they are
       the four this outcome runs through. */
    disciplinesHeadline: 'Twelve disciplines. Leads run through search, media, writing and design.',

    faq: [
      {
        q: 'Is this a brand project or a marketing one?',
        a: 'It depends which of the three you have. Not being found is a search and media problem; arriving and leaving is usually a positioning and proof problem, which is brand work. The first thing is deciding which one it is.',
      },
      {
        q: 'Do you buy the media as well as make the work?',
        a: 'Media is one of the twelve disciplines, and paid strategy and buying sit inside Grow — hours on a retainer with the people who built the brand. Media spend itself is separate and paid directly by you.',
      },
      {
        q: 'How quickly does this show up?',
        a: 'That depends on the channel and is not something to promise in advance. What is fixed is what gets measured and when it is read — the measures on the cards above are the ones we would report against.',
      },
    ],
  },
]

export const outcomeBySlug = (slug) => outcomes.find((o) => o.slug === slug)
