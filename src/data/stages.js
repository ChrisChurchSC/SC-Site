/**
 * COMPANY STAGE, as pages.
 *
 * Same shape as industries.js and read by the same page component: a slug, a
 * name, an optional split hero, the three situations, and overrides for the
 * shared sections. Anything a record leaves out falls back to the studio-wide
 * copy, so a stage can be added with a name alone and filled in later.
 *
 * THE CLIENT LIST IS NOT STAGE-SPECIFIC, AND THE HEADING SAYS SO. industries.js
 * assigns clients to a category on the evidence of each one's own descriptor.
 * There is no equivalent for stage: searching every client record for founder,
 * seed, series, raised, bootstrap or scale turns up two real matches in
 * thirty-eight — OpenText is "a $4B enterprise software company" and Nimruz is
 * "grounded in the founder vision" — and one false positive on "interview
 * series". Two clients is not a mapping.
 *
 * So each stage shows the four written case studies under "Selected work"
 * rather than "Founder-led work", which would assert something nothing here
 * records. When somebody supplies the real mapping, put the slugs in `clients`
 * and drop `storiesHeadline` — the page will name the stage on its own.
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
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

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
  {
    slug: 'seed-series-a',
    name: 'Seed to Series A',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'The round is in and somebody now owns marketing. What they inherit ' +
        'has to be decided and written down, because the next twelve months ' +
        'are spent against it.',
    },

    /* THE THREE MOMENTS THAT DIFFER HERE. Founder-led splits on whether the
       thing is public and whether a round landed; by seed those are settled,
       and what varies is who owns the work, whether spend repeats yet, and
       whether the next raise is in view. Each describes the reader's
       position rather than our record.

       Measures follow the situation, labels only and every one countable —
       see the note in industries.js about why there are no values. */
    situations: [
      {
        id: 'first-hire',
        name: 'The first hire',
        body:
          'Someone owns marketing now and there is nothing to own: no system ' +
          'to brief from, no library to pull from, and every asset made from ' +
          'scratch by whoever is free.',
        pills: ['Asset reuse rate', 'Content publishing velocity'],
      },
      {
        id: 'proving-the-channel',
        name: 'Proving the channel',
        body:
          'Spend has started and nothing repeats yet. Each piece has to be ' +
          'measurable enough to keep or kill, rather than added to a pile ' +
          'nobody reads back.',
        pills: ['Cost per lead', 'MQL-to-SQL rate', 'Pipeline velocity'],
      },
      {
        id: 'next-round',
        name: 'The next round',
        body:
          'The site, the deck and the product get read by people who compare ' +
          'them. They have to tell one story, and it has to be the one the ' +
          'company is actually running.',
        pills: ['Brand search volume', 'Share of voice'],
      },
    ],

    embed: {
      headline: [
        'Your fractional creative',
        'and marketing department,',
        'around your first hire.',
      ],
    },

    /* True of this stage: there is a marketing function now, and it is one
       person. */
    disciplinesHeadline: 'Twelve disciplines, and one person to point them at.',

    faq: [
      {
        q: 'We just made our first marketing hire. Where do you fit?',
        a: 'Alongside them. Design, writing, film, motion, media and engineering come as one team at the fraction you need, so the person who owns marketing has a bench to brief rather than six roles to hire.',
      },
      {
        q: 'Do we have to redo the brand before we can market?',
        a: 'No. Campaigns, channels and content are their own deliverables, and so are a refresh, guidelines and product positioning if the brand is what is in the way. The pricing page lists each one separately.',
      },
      {
        q: 'What do we get that we can hand to the next person?',
        a: 'The brand platform: tokens, components, grid and radii, iconography and voice — a system a new hire can work from rather than a folder of finished files.',
      },
    ],
  },
  {
    slug: 'scale-up',
    name: 'Scale-up',
    clients: ['hylands', 'entropy', 'nimruz', 'world-within'],
    storiesHeadline: 'Selected work.',

    hero: {
      lede:
        'Enough people are making things that they have started to disagree. ' +
        'What is needed is not a rebrand but a system with rules other teams ' +
        'can build from.',
    },

    /* WHAT VARIES AT THIS STAGE is not whether there is a brand — there is —
       but where it is coming apart: across the people making things, across a
       second product, or on the surface the company outgrew. */
    situations: [
      {
        id: 'everyone-making',
        name: 'Everyone is making things',
        body:
          'Several teams and a couple of agencies producing in parallel, each ' +
          'reasonable on its own. The brand drifts in the gaps between them ' +
          'rather than in any one piece.',
        pills: ['Brand compliance rate', 'Asset reuse rate', 'Design request volume reduction'],
      },
      {
        id: 'second-product',
        name: 'A second product',
        body:
          'A new line or sub-brand that has to belong to the parent without ' +
          'being a copy of it, and without quietly redefining what the parent ' +
          'means.',
        pills: ['Brand search volume', 'Share of voice'],
      },
      {
        id: 'site-behind',
        name: 'The site is behind',
        body:
          'The company outgrew its own site and it now argues against the ' +
          'pitch — describing a smaller company than the one in the room.',
        pills: ['Bounce rate', 'Organic traffic growth'],
      },
    ],

    embed: {
      headline: [
        'Your fractional creative',
        'and marketing department,',
        'beside the teams you have.',
      ],
    },

    disciplinesHeadline: 'Twelve disciplines, and more than one team already making things.',

    faq: [
      {
        q: 'We have an internal team. Where do you fit?',
        a: 'Beside them. The department flexes with the work rather than with your headcount, so it covers what the team does not have rather than replacing what it does.',
      },
      {
        q: 'Do we need a rebrand to fix the inconsistency?',
        a: 'Usually not. What is missing is a system with rules in it — tokens, components, grid and radii, iconography and voice — which is what the brand platform holds. A refresh is its own deliverable if the identity is genuinely the problem.',
      },
      {
        q: 'Can other teams work from it without us?',
        a: 'That is the point of a platform rather than a set of files: it holds the rules, so a team that was not in the room can produce from it. Guidelines are a separate deliverable if you want the rules written out as well.',
      },
    ],
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',

    /* THE ONE STAGE WITH REAL EVIDENCE. OpenText's own descriptor calls it
       "an enterprise information management and cloud software company" and
       its record calls it a $4B one — so this page can name the category in
       its heading, where founder-led and the rest cannot. */
    clients: ['opentext'],

    hero: {
      lede:
        'A global marketing org, several agencies, and a brand that has to ' +
        'hold across all of them — in every market and format, without a ' +
        'review cycle for each one.',
    },

    situations: [
      {
        id: 'many-markets',
        name: 'Many markets',
        body:
          'The same brand running in several regions and languages, made by ' +
          'people who never meet. What holds it together has to survive being ' +
          'read rather than explained.',
        pills: ['Brand compliance rate', 'Campaign reach'],
      },
      {
        id: 'many-agencies',
        name: 'Many partners',
        body:
          'Several agencies producing against one brand. The drift is between ' +
          'them rather than inside any one, and nobody owns the seam.',
        pills: ['Asset reuse rate', 'Design request volume reduction'],
      },
      {
        id: 'sub-brand',
        name: 'A sub-brand or acquisition',
        body:
          'Something new has to belong to the parent without being swallowed ' +
          'by it, and the parent has to stay itself while it does.',
        pills: ['Brand search volume', 'Pipeline influence'],
      },
    ],

    embed: {
      headline: [
        'Your fractional creative',
        'and marketing department,',
        'inside the one you have.',
      ],
    },

    disciplinesHeadline: 'Twelve disciplines, for the ones your org does not keep in-house.',

    faq: [
      {
        q: 'We already have agencies. Why add another?',
        a: 'The work here has been the production layer rather than a competing partner: a refreshed direction taken into animated and live action campaigns across multiple markets, alongside an existing global marketing org.',
      },
      {
        q: 'Can the brand hold across regions without a review for each piece?',
        a: 'That is what the system is for. The brand platform holds tokens, components, grid and radii, iconography and voice, so a team in another market produces from the rules rather than from an approval.',
      },
      {
        q: 'Can you work at our scale?',
        a: 'OpenText is a multi-billion-dollar enterprise software company with a global marketing org, and the engagement ran from a refreshed direction through to production across multiple markets.',
      },
    ],
  },
]

export const stageBySlug = (slug) => stages.find((s) => s.slug === slug)
