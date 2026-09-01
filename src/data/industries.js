/**
 * WORK BY INDUSTRY.
 *
 * THE ASSIGNMENTS ARE MINE AND ARE NOT SIGNED OFF. Nothing in the repo
 * carried an industry for a client: projects.js has no such field on any of
 * its 38 entries, and only the four written case studies had one — as free
 * text ("Kids' wellness", "Decentralized governance", "Culture, nonprofit",
 * "Impact, culture") that matched none of the four labels the nav was already
 * promising. So this file is the mapping, in one place, so it can be read and
 * corrected in one pass rather than hunted through two data files.
 *
 * EVERY ENTRY HERE HAS EVIDENCE, and the evidence is quoted beside it: either
 * the client's own descriptor in projects.js or the industry already on its
 * case study. Nothing is assigned from a company name alone — 29 of the 38
 * clients have no descriptor, and guessing a sector for a named client from
 * its name is a claim about somebody else's business. Those stay untagged and
 * simply do not appear on an industry page. That is why the pages are short:
 * the gap is real and it is visible rather than filled in.
 *
 * ONLY FOUR CATEGORIES, and only ones with more than one entry behind them.
 * The nav's Consumer & Retail is gone because nothing in the roster evidences
 * it, and Media & Entertainment is not here because only Deep Dive would be.
 * Add either back the moment there are two clients to put in it.
 *
 * TO EXTEND THIS: add the client's slug to a list below with the evidence you
 * used. The page, the grid and the nav all read from here.
 */
export const industries = [
  {
    slug: 'technology-web3',
    name: 'Technology & Web3',
    /* THE SPLIT HERO, and only here. An industry with a `hero` renders the
       two-column treatment — copy left, a product window right — and one
       without keeps the centred statement, so this is one page's layout
       rather than a change to four.

       THE LEDE IS A LIST, NOT A CLAIM. It names the four clients' own
       categories, which is what the page can prove: a Layer 2, enterprise
       software, telecom infrastructure and a consumer app. It deliberately
       does not say we are a technology specialist — proof-points.md grades
       that kind of statement C, and the page below it is four engagements.

       The headline is still the category's name. A hero headline that made a
       claim would be the one thing on this page nothing under it supports. */
    hero: {
      lede:
        'A Layer 2 network, enterprise software, telecom infrastructure and a ' +
        'consumer app — four engagements, and what each of them needed the ' +
        'brand to do.',
      visual: 'dashboard',
    },
    /* THREE OFFERINGS, NOT THREE CASE STUDIES. An earlier version made each
       card a thing one client got — Gigs, OpenText, Entropy — which read as
       three anecdotes rather than as what a technology company can buy. Each
       one is now a service that exists, and links to the page that defines
       and prices it.

       WHAT THEY DO NOT SAY is that any of it produced a result, or that we
       are a technology specialist. proof-points.md grades outcome claims we
       cannot evidence. These describe what is in the engagement, which is
       checkable against /services/build, /services/grow and /pricing. */
    benefits: [
      {
        id: 'brand-and-product',
        name: 'Brand and product, one bench',
        body:
          'Design and engineering are two of the twelve disciplines, not two ' +
          'suppliers. The identity, the design system and the interface are ' +
          'one engagement rather than a hand-off between a studio and a shop.',
        cta: 'See how we build',
        href: '/services/build',
      },
      {
        id: 'platform-not-pdf',
        name: 'A platform, not a guidelines PDF',
        body:
          'The brand platform holds tokens, components, grid and radii, ' +
          'iconography and voice — a system your design system can meet, ' +
          'rather than a document somebody has to interpret.',
        cta: 'See what it holds',
        href: '/pricing',
      },
      {
        id: 'run-after-launch',
        name: 'The same team runs it after launch',
        body:
          'Grow is hours on a retainer with the people who built the brand: ' +
          'campaigns, channels and content produced against the same ' +
          'positioning, with no re-briefing a second agency on your own work.',
        cta: 'See how we grow',
        href: '/services/grow',
      },
    ],
    /* Descriptors from projects.js, and Entropy's own case-study industry. */
    clients: [
      'arbitrum',      // 'The leading Ethereum Layer 2 blockchain network.'
      'opentext',      // 'An enterprise information management and cloud software company.'
      'gigs',          // 'A telecom-as-a-service platform for building mobile products.'
      'big-buoy',      // 'A live marine forecast app for surfers and boaters.'
      'entropy',       // case study industry: 'Decentralized governance'
    ],
  },
  {
    slug: 'health-wellness',
    name: 'Health & Wellness',
    clients: [
      'hylands',       // case study industry: "Kids' wellness"
      'concis-labs',   // 'A Medicaid meeting intelligence platform.'
    ],
  },
  {
    slug: 'food-beverage',
    name: 'Food & Beverage',
    clients: [
      'wonderwerk',    // "A natural wine brand from California's House of Fermentation."
      'smallhold',     // 'A specialty mushroom grower and national distributor.'
    ],
  },
  {
    slug: 'culture-nonprofit',
    name: 'Culture & Nonprofit',
    clients: [
      'nimruz',        // case study industry: 'Culture, nonprofit'
      'world-within',  // case study industry: 'Impact, culture'
    ],
  },
]

export const industryBySlug = (slug) => industries.find((i) => i.slug === slug)

/* Reverse lookup, so a card can say which industry it belongs to without
   every consumer walking the list. */
export const industryOf = (clientSlug) =>
  industries.find((i) => i.clients.includes(clientSlug))?.name ?? null
