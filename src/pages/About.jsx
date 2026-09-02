import home from './Home.module.css'
import v3 from './HomeV3.module.css'
import FooterCard from '../components/FooterCard'
import ScrollCards from '../components/ScrollCards'
import StatementCard from '../components/StatementCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { useMeta } from '../hooks/useMeta'

/**
 * ABOUT — A HERO AND THE FOOTER, AND NOTHING ELSE.
 *
 * IT WAS SIX SECTIONS. Built on the homepage's pattern, it ran who we are,
 * how we work, disciplines, testimonials and a contact card under the hero.
 * All of it is cut, on 2026-09-01, and the page is deliberately one screen.
 *
 * WHAT THAT MEANS FOR THE CLAIM NOTES BELOW. They were written because the
 * cut sections made claims that SC-Brand/Strategy/proof-points.md grades, and
 * the page had to be checked against those grades. One line of copy is left —
 * the hero's support, which is positioning.md's own statement — so nothing on
 * this page currently needs a grade. The notes stay because the sections are
 * likely to come back, and they record what was checked and what may not be
 * said, which is the expensive part to work out twice.
 *
 * IT LIVES AT /studio. /about is 301d to /services by vercel.json — the
 * capabilities page lived there before the Services rename — so a page
 * mounted on /about would never reach React in production. That redirect is
 * left alone rather than removed, because it is the only thing catching old
 * inbound links.
 *
 * IT IS A NEW PAGE, NOT A REWRITE. /about-us is the careers page — what it is
 * like to work here, the realities, the open roles, the freelancer signup —
 * and the nav pointed both About and Careers at it. Rewriting it would have
 * deleted the careers content to make room for this. So Careers keeps
 * /about-us and About gets its own route.
 *
 * EVERY CLAIM IS GRADED. SC-Brand/Strategy/proof-points.md v2 grades twelve
 * studio claims A, B or C and says which may be said publicly: A as stated, B
 * "if we would actually show it", C "only as opinion, never as fact".
 *
 * WHAT MAY NOT BE SAID HERE, whatever comes back onto the page:
 *   - "No pooled or anonymous labor" — graded C and marked do not publish
 *     until three contradictions in that file are resolved.
 *   - "Our creative output is always 100% our own" — C: no written AI-use
 *     policy exists to stand behind it.
 *   - "Measured and optimized every month" — C: we instrument well, but there
 *     is no record of a client being shown a readout against goals.
 *   - The A-graded analytics figures. They are the strongest thing the studio
 *     owns — 1.3M impressions and $0.48 per subscriber on $8,599 of spend —
 *     and proof-points.md says they need client permission to name. Nothing
 *     in the repo records that permission, so the claim appears without the
 *     client and without the numbers.
 */
/* CHRIS'S THREE, VERBATIM. He wrote them for this page on 2026-09-01, for a
   three-up card section that was cut, and they then ran as the three passages
   of the scrolling section below.

   NOTHING READS THIS TODAY. The section below is two mirrored panels with no
   copy in it — "for now", per the instruction that produced it. The words are
   kept here rather than deleted because they are Chris's, they were written
   for this page, and the layout they belong to is one file's history away.

   Two comparative claims in here have nothing behind them in
   SC-Brand/Strategy/proof-points.md — "a fraction of your typical overhead
   costs" and "our fees are competitive". They are Chris's own and are set as
   given; noted so nobody later mistakes them for evidenced ones. */
const WHAT_WE_ARE = [
  {
    n: '01',
    name: 'We are creatives who are also marketers.',
    body: "While we all started out as writers, designers, illustrators, and developers, we've built our marketing and media chops through years of work in-house and in agencies. We make beautiful brands, and we also know how to take them to market.",
  },
  {
    n: '02',
    name: "We're not an extension of your team. We are your team.",
    body: "We embed ourselves into your workflow, giving you on-demand access to world-class design, copy, and marketing talent for a fraction of your typical overhead costs. Whether you need to supplement staff or you're looking to add capabilities, we're ready to get into your weeds.",
  },
  {
    n: '03',
    name: 'We scale to your needs.',
    body: 'Our infrastructure is flexible and our fees are competitive for one simple reason: every client has unique needs. We partner with you on the best mix of services and team support based on your goals, budgets, and timelines. Nothing at Super-Conscious is off the shelf.',
  },
]

/* FOUR PANELS, AND THREE OF THEM ARE STILL THE FIRST ONE'S WORDS.

   Spelled out rather than generated, because the point of duplicating them is
   that each one gets its own copy next — and a .map over one object, or four
   references to a single const, would make editing one edit all four.

   WHAT_WE_ARE 02 and 03 above are the obvious tenants for two of these. They
   are not dropped in here because nobody has said they belong on these panels
   in this order, and guessing would bury that decision in a diff. */
/* THE PANEL ART IS A FLAT GREY FOR NOW. Each passage gets its own step so the
   left panel visibly changes with the copy; `shade`, `call`, `stack`, `board` and `logos` are the stand-ins
   for the
   `image` the component also takes, and swapping one field for the other is the
   whole of the job when the real artwork exists. */
const PANELS = [
  {
    /* The captions name what comes OUT of the studio rather than the crafts
       that go into it — the disciplines were already said by the ring on the
       next passage, and a channel is the thing a client recognises. */
    board: ['Website', 'YouTube', 'Email', 'Instagram', 'Landing Page', 'Paid Social'],
    label: "[ What We Are ]",
    line: "We are creatives who are also marketers.",
    sub: "While we all started out as writers, designers, illustrators, and developers, we've built our marketing and media chops through years of work in-house and in agencies. We make beautiful brands, and we also know how to take them to market.",
  },
  {
    call: [
      'Creative Director',
      'Designer',
      'Copywriter',
      'Strategist',
      'Producer',
      'Developer',
    ],
    label: "[ Who We Are ]",
    line: "We're not an extension of your team. We are your team.",
    sub: "We embed ourselves into your workflow, giving you on-demand access to world-class design, copy, and marketing talent for a fraction of your typical overhead costs. Whether you need to supplement staff or you're looking to add capabilities, we're ready to get into your weeds.",
  },
  {
    stack: 9,
    label: "[ How We Work ]",
    line: "We scale to your needs.",
    sub: "Our infrastructure is flexible and our fees are competitive for one simple reason: every client has unique needs. We partner with you on the best mix of services and team support based on your goals, budgets, and timelines. Nothing at Super-Conscious is off the shelf.",
  },
  {
    logos: 20,
    label: "[ Who We've Worked With ]",
    line: "You've seen our work before.",
    sub: "We've worked with tons of brands through our different roles and careers — Digitas, Huge, Buck, Conde Nast, Amazon and Victoria's Secret among them.",
  },
]

export default function About() {
  useMeta({
    title: 'About | Super Conscious',
    description: 'The embedded creative and marketing team that builds your brand and then grows it.',
    path: '/studio',
  })

  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      {/* CHRIS'S LINE ON TOP, positioning.md's UNDERNEATH. The short one is
          the claim and the long one is the definition, which is what a hero
          support line is for — and it keeps the sentence the brand-strategist
          owns on the page rather than replacing it.

          `tall` is the size change: the hero holds more room, not more type.
          `bottom` then pushes the copy to the floor of that room, and dropping
          `center` returns it to the page's own left edge — so the extra height
          opens above the type rather than around it.

          `supportSerif` sets the line under it in Signifier rather than the
          11px mono the display variant defaults to — it is a sentence to read,
          not a caption.

          `inset` lines the type up with the page's other sections — bare
          cards start on the page edge, and every other page's hero does not.
          There is nothing under it here any more, but the inset is what keeps
          this hero on the same line as every other hero on the site.

          The break is written here rather than left to the measure: it falls
          after "embedded" so "creative department" — the thing being claimed —
          holds together on one line. */}
      <StatementCard
        eyebrow="[ About ]"
        statement={['Your embedded', 'creative department.']}
        statementLines
        support="The embedded creative and marketing team that builds your brand and then grows it."
        as="h1"
        display
        tall
        bottom
        bare
        inset
        supportSerif
        rule={false}
      />

      {/* THE RULE UNDER THE HERO IS DRAWN BY ScrollCards, not by an <hr> here.
          It has to meet the vertical rule down the middle of that section, and
          two elements with the page stack's gap between them cannot touch.
          See the note on .section in ScrollCards.module.css.

          `rule={false}` on the hero above is unrelated: that turns off
          StatementCard's own hairline, which sits at the top of the card and
          would read as an underline on the nav bar. */}
      {/* ONE SECTION NOW, NOT FOUR. The wrapper that used to sit here existed
          to stop the stack's gap opening a space at every join; there are no
          joins left. ScrollCards takes the whole set and pins one stage over a
          track four screens tall, swapping the copy in the right-hand panel as
          the scroll crosses from one band to the next.

          The copy lives in PANELS above for the same reason WHAT_WE_ARE does:
          the component owns the shape, this page owns the words. */}
      <ScrollCards panels={PANELS} />

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}


