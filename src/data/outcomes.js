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
  {
    slug: 'improve-your-win-rate',
    name: 'Improve your win rate',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'Losing a deal you should have won usually has one of three causes, ' +
        'and only one of them is the product.',
    },

    situationsHeadline: 'Three reasons the deal goes elsewhere.',

    situations: [
      {
        id: 'look-alike',
        name: 'They cannot tell you apart',
        body:
          'You are on the shortlist with two others and the three of you ' +
          'describe yourselves in the same words. Nothing in the room says ' +
          'which one to pick.',
        pills: ['Win rate lift', 'Brand recall'],
      },
      {
        id: 'materials-undersell',
        name: 'The materials undersell it',
        body:
          'The product is better than the deck and the site, so the buyer ' +
          'forms their impression from the worse of the two.',
        pills: ['Meeting-to-next-step rate', 'Deck completion rate'],
      },
      {
        id: 'wrong-rooms',
        name: 'The wrong rooms',
        body:
          'You are competing where you were never going to win. Being ' +
          'specific about who this is for loses those deals earlier and ' +
          'cheaper.',
        pills: ['MQL-to-SQL rate', 'Deal size influence'],
      },
    ],

    embed: {
      headline: ['Your fractional creative', 'and marketing department,', 'in the room with you.'],
    },

    disciplinesHeadline: 'Twelve disciplines. Winning runs through writing, design and creative direction.',

    faq: [
      {
        q: 'Is this a deck project?',
        a: 'Sometimes. A deck is its own deliverable and so is product positioning — which one you need depends on whether the story is wrong or only badly told. Deciding that is the first thing.',
      },
      {
        q: 'Can you work with our sales team?',
        a: 'The people doing the work embed in your team and you have access to them, so the materials get made with the people who use them rather than handed over finished.',
      },
      {
        q: 'Will this show up in our numbers?',
        a: 'We will not promise a figure. The measures on the cards above are the ones we would report against, and what counts as working is agreed before the work starts rather than after.',
      },
    ],
  },
  {
    slug: 'shorten-the-sales-cycle',
    name: 'Shorten the sales cycle',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'A long cycle is usually a comprehension problem wearing a process ' +
        'problem\u2019s clothes — somebody in the chain cannot repeat what you do.',
    },

    situationsHeadline: 'Three places the deal slows down.',

    situations: [
      {
        id: 'explaining',
        name: 'Every call starts over',
        body:
          'The first ten minutes go on explaining the category before anyone ' +
          'can talk about the product. Nothing arrives having already done ' +
          'that work.',
        pills: ['Meeting-to-next-step rate', 'Deck completion rate'],
      },
      {
        id: 'internal-sell',
        name: 'It stalls internally',
        body:
          'Your champion is convinced and cannot convince the room behind ' +
          'them, because what convinced them was you rather than anything ' +
          'they can forward.',
        pills: ['Pipeline velocity', 'Deal size influence'],
      },
      {
        id: 'nothing-travels',
        name: 'Nothing travels without you',
        body:
          'Every piece is bespoke to the call it was made for, so the next ' +
          'conversation starts from a blank page and waits on somebody senior.',
        pills: ['Self-serve deck rate', 'Asset reuse rate'],
      },
    ],

    embed: {
      headline: ['Your fractional creative', 'and marketing department,', 'ahead of the next call.'],
    },

    disciplinesHeadline: 'Twelve disciplines. A shorter cycle runs through writing, design and 3D and motion.',

    faq: [
      {
        q: 'What actually gets made here?',
        a: 'Usually the things that travel without you: positioning and messaging, a deck, a site that answers the first ten minutes, and the explainer work that lets a champion sell internally.',
      },
      {
        q: 'Do we need a rebrand for this?',
        a: 'Rarely. This is normally a messaging and materials problem rather than an identity one. A refresh is its own deliverable if the brand is genuinely what is slowing things down.',
      },
      {
        q: 'How do you know it worked?',
        a: 'By the measures on the cards above, agreed before the work starts. We will not put a figure on it in advance.',
      },
    ],
  },
  {
    slug: 'lower-cost-per-acquisition',
    name: 'Lower cost per acquisition',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'When the number will not come down, it is usually the creative, the ' +
        'audience, or the fact that everything is being paid for.',
    },

    situationsHeadline: 'Three reasons the number will not come down.',

    situations: [
      {
        id: 'creative-ceiling',
        name: 'Creative is the ceiling',
        body:
          'The buying is competent and the ads are not. More budget against ' +
          'the same work buys the same result at a larger scale.',
        pills: ['Ad CTR lift', 'Cost per lead'],
      },
      {
        id: 'wrong-audience',
        name: 'Paying for the wrong people',
        body:
          'The targeting reaches people who were never going to buy, so the ' +
          'cost per lead looks fine and the cost per customer does not.',
        pills: ['Cost per MQL', 'MQL-to-SQL rate'],
      },
      {
        id: 'all-paid',
        name: 'Everything is paid',
        body:
          'Nothing earned or owned is carrying any of the load, so the ' +
          'moment spend stops, so does everything else.',
        pills: ['Organic traffic growth', 'Email list growth'],
      },
    ],

    embed: {
      headline: ['Your fractional creative', 'and marketing department,', 'and the media behind it.'],
    },

    disciplinesHeadline: 'Twelve disciplines. Acquisition runs through media, search, design and writing.',

    faq: [
      {
        q: 'Do you buy the media?',
        a: 'Media is one of the twelve disciplines and paid strategy and buying sit inside Grow — hours on a retainer with the people who built the brand. Media spend itself is separate and paid directly by you, and our fee is flat rather than a percentage of it.',
      },
      {
        q: 'Can you work with our existing agency?',
        a: 'Yes. Where the buying is competent and the creative is the constraint, the work is the creative — made by the people who own the brand rather than by a second shop briefed on it.',
      },
      {
        q: 'What if the problem is the offer?',
        a: 'Then no amount of creative fixes it, and we will say so. Product positioning is its own deliverable for exactly that case.',
      },
    ],
  },
  {
    slug: 'launch-faster',
    name: 'Launch faster',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'Slow launches are rarely a people problem. They are usually a ' +
        'systems one: nothing is reusable, so everything is made again.',
    },

    situationsHeadline: 'Three reasons it takes so long.',

    situations: [
      {
        id: 'bespoke',
        name: 'Everything is bespoke',
        body:
          'Each asset is made from nothing, by whoever is free, so the ' +
          'fiftieth piece takes as long as the first.',
        pills: ['Campaign asset velocity', 'Content publishing velocity'],
      },
      {
        id: 'approvals',
        name: 'It waits on approval',
        body:
          'The making is fast and the reviewing is not, because nothing was ' +
          'agreed in advance and every piece is judged from scratch.',
        pills: ['Campaign launch speed', 'Brief-to-execution time'],
      },
      {
        id: 'no-system',
        name: 'No system to build from',
        body:
          'Every channel gets re-solved — the same decisions about type, ' +
          'colour and layout made again for each one.',
        pills: ['Asset reuse rate', 'Component reuse rate'],
      },
    ],

    embed: {
      headline: ['Your fractional creative', 'and marketing department,', 'and the system under it.'],
    },

    disciplinesHeadline: 'Twelve disciplines. Speed comes from design, production and engineering.',

    faq: [
      {
        q: 'Is the answer just more people?',
        a: 'Usually not. Where nothing is reusable, more hands make more one-offs. The brand platform holds tokens, components, grid and radii, iconography and voice, so the next piece starts from a system rather than a blank page.',
      },
      {
        q: 'How long does the system itself take?',
        a: 'That depends on scope, and the pricing page lists what each deliverable starts at. What it changes is everything made after it, which is where the time comes back.',
      },
      {
        q: 'Can our team make things from it?',
        a: 'That is the point of a platform rather than a folder of finished files: it holds the rules, so somebody who was not in the room can produce from it. Guidelines are a separate deliverable if you want them written out too.',
      },
    ],
  },
  {
    slug: 'enter-a-new-market',
    name: 'Enter a new market',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'A new market is a new audience who owe you nothing: no recognition, ' +
        'no proof they recognise, and a brand built for somewhere else.',
    },

    situationsHeadline: 'Three things that do not come with you.',

    situations: [
      {
        id: 'no-recognition',
        name: 'The name means nothing',
        body:
          'Everything you have built in recognition stays where it was built. ' +
          'Here you are unknown, and being unknown is the first problem.',
        pills: ['Brand awareness lift in target markets', 'Brand search volume'],
      },
      {
        id: 'proof-does-not-travel',
        name: 'The proof does not travel',
        body:
          'The logos, the references and the numbers that convinced people at ' +
          'home mean less to a buyer who has not heard of any of them.',
        pills: ['MQL-to-SQL rate', 'Cost per lead'],
      },
      {
        id: 'brand-does-not-fit',
        name: 'The brand does not fit',
        body:
          'Language, format and expectation all differ, and the identity was ' +
          'made without any of them in mind.',
        pills: ['Campaign reach', 'Brand compliance rate'],
      },
    ],

    embed: {
      headline: ['Your fractional creative', 'and marketing department,', 'in the market you are entering.'],
    },

    disciplinesHeadline: 'Twelve disciplines. A new market runs through writing, design, media and search.',

    faq: [
      {
        q: 'Do you localise, or rebuild?',
        a: 'Whichever the market needs, and it is worth deciding deliberately. A sub-brand is its own deliverable, so is a refresh, and so is leaving the identity alone and changing only what is said.',
      },
      {
        q: 'Will the brand still be recognisable?',
        a: 'That is what the system is for. The platform holds tokens, components, grid and radii, iconography and voice, so a market can flex what it says without redrawing what it is.',
      },
      {
        q: 'Do you have experience in our market?',
        a: 'Ask us and we will tell you plainly rather than claim it. The work on this page is the roster we have, and if a market is new to us as well we would rather say so than find out on your budget.',
      },
    ],
  },
]

export const outcomeBySlug = (slug) => outcomes.find((o) => o.slug === slug)
