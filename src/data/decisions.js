/**
 * THE DECISION RECORD — the real one, out of the SC-Brand working copy.
 *
 * EVERY ENTRY BELOW IS A DECISION THAT ACTUALLY GOT MADE, on the date it says,
 * in the file it names. Nothing here is sample. That is the whole reason
 * /platform/memory can do without the "Sample data" tag that the dashboard and
 * the review queue both carry: the other platform pages draw a plausible
 * screen, and this one draws the studio's own record.
 *
 * VERIFIED AGAINST THE WORKING COPY. Each `path` was checked line by line
 * before it went on a public page — `Verbal/tone-of-voice.md:144` is the
 * spelling rule, `Agents/media-strategist.md:28` is the £28 CPM example. If
 * those files move, these references go stale, and a stale reference on this
 * page is worse than no page: the argument is that the reason is still
 * attached to the rule. Re-check them when SC-Brand is next restructured.
 *
 * WHAT IS DELIBERATELY NOT HERE. `Strategy/proof-points.md` carries the
 * highest-value open decision in the repo — getting permission to name two
 * clients. It is the best example on the list and it cannot go on a public
 * page, because naming them in the course of saying we may not name them is
 * the thing itself. Left out on purpose; do not add it.
 *
 * THE `instead` FIELD IS THE POINT. A repo tells you what the file says now.
 * This tells you what was rejected on the way, which is the one thing neither
 * the repo page nor the reviews page can show.
 */
export const decisions = [
  {
    id: 'true-sounds',
    rule: 'Strategy holds what is true. Verbal holds how it sounds.',
    date: '2026-08-27',
    path: 'Strategy/README.md',
    by: 'Chris',
    state: 'settled',
    why:
      'It mirrors the agents: brand-strategist decides what may be claimed, comms-writer ' +
      'decides how it is said.',
    instead:
      'v1 proposed the opposite cut — Verbal as the substrate, Strategy as the dated plan. ' +
      'Not wrong; it just describes a different folder, and that folder is now homeless.',
  },
  {
    id: 'us-spelling',
    rule: 'Spelling is US.',
    date: '2026-08-27',
    path: 'Verbal/tone-of-voice.md:144',
    by: 'comms-writer',
    state: 'settled',
    why:
      'Twelve replacements across five files in Agents/. Any UK spelling still in an agent ' +
      'file is a pre-sweep copy, not the current state.',
  },
  {
    id: 'us-market',
    rule: 'The market is US.',
    date: '2026-08-27',
    path: 'Agents/media-strategist.md:28',
    by: 'Chris',
    state: 'open',
    why: 'Confirmed while scoping Strategy/verticals/, which is written for US categories.',
    /* The entry that earns the page. A decision that records its own
       unfinished business is the opposite of a highlight reel, and the reason
       it is unfinished is the product's whole argument. */
    open:
      'Three £ figures deliberately not converted. £28 → $28 would invent a US rate — the ' +
      'exact thing media-strategist.md exists to prevent. Needs a sourced rate or a ' +
      '[RATE UNVERIFIED] marker.',
  },
]

/* The markers the repo leaves when something is missing, each addressed to
   whoever can answer it. Real convention, set out in Strategy/README.md. */
export const markers = [
  { tag: 'DECISION NEEDED', owner: 'Chris', note: 'A choice only the founder can make.' },
  { tag: 'EVIDENCE NEEDED', owner: 'sales-analyst', note: 'A fact that exists somewhere we have not looked yet.' },
  { tag: 'CLAIM NEEDED', owner: 'brand-strategist', note: 'A claim comms-writer will not invent to fill a gap.' },
  { tag: 'RATE UNVERIFIED', owner: 'media-strategist', note: 'A media rate with no account history and no cited source.' },
]

export const openCount = decisions.filter((d) => d.state === 'open').length
