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

    /* NOT NEW / PIVOTING / UNDERDOG. Those are the site's three situations
       and they are right on a service or an industry page, where the reader
       could be any of them. On a founder-led page they barely segment
       anything: a founder-led company is almost by definition new, so two of
       the three describe somebody who is not reading this.

       These three are the moments that actually differ before there is a
       marketing function — whether the thing is public yet, whether a round
       just landed, and whether there is a round at all. Each describes the
       reader's position rather than our record, and the pills are countable
       measures from the same vocabulary as everywhere else: labels only,
       never values. */
    situations: [
      {
        id: 'pre-launch',
        name: 'Pre-launch',
        body:
          'The product works and nobody has seen it. Everything public gets ' +
          'made at once — the name, the site, and the first thing anyone ' +
          'reads about the company.',
        pills: ['Time to launch', 'Organic traffic'],
      },
      {
        id: 'just-raised',
        name: 'Just raised',
        body:
          'The round is announced and the company has to look like it. Often ' +
          'the first time the brand is a liability rather than a detail to ' +
          'get to later.',
        pills: ['Brand search volume', 'Share of voice'],
      },
      {
        id: 'bootstrapped',
        name: 'Bootstrapped',
        body:
          'No round to spend against, so every piece has to earn back. The ' +
          'work gets picked for what it returns rather than for what it ' +
          'covers.',
        pills: ['Cost per lead', 'MQL-to-SQL rate'],
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
