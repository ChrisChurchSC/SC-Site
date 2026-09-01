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
