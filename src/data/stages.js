/**
 * COMPANY STAGE, as pages.
 *
 * Same shape as industries.js and read by the same page component: a slug, a
 * name, an optional split hero, the three situations, and overrides for the
 * shared sections. Anything a record leaves out falls back to the studio-wide
 * copy, so a stage can be added with a name alone and filled in later.
 *
 * NO CLIENT LIST. industries.js assigns clients to a category on the evidence
 * of each one's own descriptor. Nothing in the repo records what stage a
 * client was at when we worked with them, and inferring it from a company
 * name would be a claim about somebody else's business — so `clients` is
 * empty and the case-studies rail does not render. Fill it the same way the
 * industries were filled: with the evidence quoted beside each slug.
 *
 * THE SECOND VIEW IS INDUSTRY, and it comes for free. AudienceCards defaults
 * to situation/industry when a caller passes no `views`, which is the right
 * pair here — an industry page offering to re-sort by industry would be
 * circular, a stage page offering it is not.
 */
export const stages = [
  {
    slug: 'founder-led',
    name: 'Founder-led',
    clients: [],

    hero: {
      /* Describes the reader's position, not our record. */
      lede:
        'Before the first marketing hire, when the founder is still the one ' +
        'explaining the company — and what it takes to make that explainable ' +
        'by somebody else.',
    },

    /* The same three situations the rest of the site uses, written for a
       company at this stage. The pills are countable measures, drawn from the
       same vocabulary as everywhere else — labels only, never values. */
    situations: [
      {
        id: 'new',
        name: 'New',
        body:
          'Nothing exists yet but the product and the pitch. The name, the ' +
          'mark and the words all get decided at once, usually while raising.',
        pills: ['Time to launch', 'Organic traffic'],
      },
      {
        id: 'pivoting',
        name: 'Pivoting',
        body:
          'The story that raised the round is not the story that sells. What ' +
          'the company says has to change before the next hire repeats the ' +
          'old version of it.',
        pills: ['Share of voice', 'MQL-to-SQL rate'],
      },
      {
        id: 'underdog',
        name: 'Underdog',
        body:
          'No category presence and no budget to buy one. Standing out has to ' +
          'come from being specific rather than from outspending anybody.',
        pills: ['Cost per lead', 'Brand search volume'],
      },
    ],

    embed: {
      headline: [
        'Your fractional creative',
        'and marketing department,',
        'before you hire one.',
      ],
    },

    /* True of this stage rather than of the studio: at founder-led there is
       no marketing function to hire into yet. */
    disciplinesHeadline: 'Twelve disciplines, and no headcount to carry any of them.',

    /* THREE QUESTIONS ABOUT THE WORK, not the commercials — the pricing FAQ
       is appended after these unchanged, because ServiceFaq's own header says
       answering those differently from /pricing is worse than not answering
       them at all.
       
       Every answer is a fact already published elsewhere on the site: the
       twelve disciplines, the deliverables on /pricing, and the embedded line
       from the How we work section. */
    faq: [
      {
        q: 'I have not hired a marketer yet. Is that a problem?',
        a: 'No — that is the case this is built for. Design, writing, film, motion, media and engineering come as one team at the fraction you need, which is the alternative to making that hire before you know what it should be.',
      },
      {
        q: 'Can we start with just a name?',
        a: 'Yes. Naming is its own deliverable, as are a new brand, a refresh, guidelines and product positioning. The pricing page lists what each one is and what it starts at.',
      },
      {
        q: 'Who will I actually be working with?',
        a: 'The people embedded in your team, and you have access to them.',
      },
    ],
  },
]

export const stageBySlug = (slug) => stages.find((s) => s.slug === slug)
