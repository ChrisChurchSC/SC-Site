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
    slug: 'technology',
    name: 'Technology',
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
      /* Categories rather than a count: the roster is enterprise software, a
         telecom platform, a consumer app and an on-chain analytics brand, and
         naming three shapes covers them without a number that goes wrong the
         moment a fifth is tagged. */
      lede:
        'Enterprise software, infrastructure and consumer products — and what ' +
        'each of them needed the brand to do.',
      visual: 'dashboard',
    },
    /* THE THREE SITUATIONS, WRITTEN FOR THIS CATEGORY. Same three the
       service pages use — New, Pivoting, Underdog — because they are how the
       studio already describes who it works with, and a fourth kind invented
       for one industry would be a fourth kind everywhere else.

       WHAT IS INDUSTRY-SPECIFIC IS THE SITUATION, NOT A CLAIM ABOUT US.
       Each body describes the state a technology company is in when it comes
       to us — shipping before there is a brand, developer adoption meeting an
       enterprise buyer, a category whose vendors all use the same sentence.

       IT IS TECHNOLOGY, NOT WEB3. The category was "Technology & Web3" and
       the copy leaned on protocols, L2s and crypto-native products. Two of
       the clients are on-chain and stay tagged here — they are technology
       companies — but the page speaks to the wider category rather than to
       the narrower one inside it.
       None of them says we are a technology specialist or that any of this
       worked: proof-points.md grades that kind of statement, and four
       engagements is a capability rather than a record.

       NO FIGURES. Strategy/verticals/ has real ones — vendor counts, how far
       organic reach fell — but its README says re-check anything
       compliance-adjacent the week you use it, and a number on a public page
       is a maintenance commitment. The sentences describe the situation
       without quantifying it, which needs no upkeep.

       NO href AND NO cta, per Chris: these describe who the work is for, and
       the nav and the closing ask carry the routes. AudienceCards renders a
       card without an href as a plain block. */
    situations: [
      {
        id: 'new',
        name: 'New',
        body:
          'A product that shipped before it had a brand. The docs and the app ' +
          'exist; the name, the mark and the tokens the front end can consume ' +
          'do not.',
      },
      {
        id: 'pivoting',
        name: 'Pivoting',
        body:
          'Developer-led adoption meeting an enterprise buyer, or a technical ' +
          'product going mainstream. The audience changes, so the vocabulary, ' +
          'the proof and the surfaces all have to.',
      },
      {
        id: 'underdog',
        name: 'Underdog',
        body:
          'A category where every competitor describes itself in the same ' +
          'words, to buyers who have read it before. Sounding specific without ' +
          'claiming an outcome the product cannot yet show.',
      },
    ],
    /* HOW WE WORK, SAID FOR THIS CATEGORY. The shared section is the studio's
       shape and reads the same on every page; these are the same three facts
       aimed at a technology reader. Points keep their icons from BUILD_EMBED
       by position — see the note in WorkIndustry.jsx.

       Every line is checkable. Design and engineering really are two of the
       twelve disciplines. The tokens, components, grid and radii really are
       what the brand platform holds, per /pricing. Neither line claims a
       result. */
    embed: {
      headline: 'One bench for the brand and the product.',
      points: [
        {
          key: 'Design and engineering together',
          line: 'The identity, the design system and the interface come from one team rather than from a studio and a shop.',
        },
        {
          key: 'Tokens, not a PDF',
          line: 'What you get is a system the front end can consume: tokens, components, grid and radii, iconography and voice.',
        },
        {
          key: 'People you know',
          line: 'Embedded in your team, and you have access to them.',
        },
      ],
    },

    /* Engineering is genuinely one of the twelve, which is the part a
       technology reader is checking for. */
    disciplinesHeadline: 'Twelve disciplines, engineering among them.',

    /* THE COMMERCIAL ANSWERS ARE NOT TOUCHED. ServiceFaq reads the pricing
       FAQ and its own header says a page answering those differently from
       /pricing is worse than not answering them at all — so these are three
       questions ABOUT THE WORK that /pricing does not cover, and the page
       appends the pricing list after them unchanged.

       Each answer is a fact already on the site: the twelve disciplines, what
       the brand platform holds, and the three situations above. */
    faq: [
      {
        q: 'Do you work with our product team?',
        a: 'Yes. Design and engineering are two of the twelve disciplines, so the identity, the design system and the interface are one engagement rather than a hand-off between a studio and a shop.',
      },
      {
        q: 'Do we get design tokens, or a set of guidelines?',
        a: 'Tokens. The brand platform holds tokens, components, grid and radii, iconography and voice — a system your design system can meet, rather than a document somebody has to interpret.',
      },
      {
        q: 'Do we need to have a brand already?',
        a: 'No. The work starts from wherever you are: a product that shipped before it had a brand, a platform moving to a new buyer, or an existing brand in a category where everyone sounds the same.',
      },
    ],

    /* THE SECOND VIEW. Same four stages the footer and the Case Studies menu
       already use — WORK_BY_STAGE — so a visitor meets one vocabulary for
       company size across the site rather than a fifth invented here.

       These describe what changes about the brand problem at each stage, not
       what we did about it. A stage is a fact about the reader's company; the
       claim would be the sentence after it, and that sentence is not here. */
    stages: [
      {
        id: 'founder-led',
        name: 'Founder-led',
        body:
          'The founder is the brand, and the deck is the brand, and neither ' +
          'survives being handed to somebody else. The job is getting what is ' +
          'in their head into something a second person can use.',
      },
      {
        id: 'seed-series-a',
        name: 'Seed to Series A',
        body:
          'A first marketing hire arrives to find no system to hire against. ' +
          'The brand has to be decided quickly and written down, because the ' +
          'next twelve months are spent spending against it.',
      },
      {
        id: 'scale-up',
        name: 'Scale-up',
        body:
          'Enough people are making things that they have started to disagree. ' +
          'What is needed is not a rebrand but a system with rules in it — ' +
          'tokens, components and copy patterns other teams can build from.',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        body:
          'A global marketing org, several agencies and a brand that has to ' +
          'hold across all of them, in every market and format, without a ' +
          'review cycle for each one.',
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
