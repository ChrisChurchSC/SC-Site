import { industries } from './industries'
import { WORK_BY_STAGE } from '../components/V3Nav'

/**
 * THE FIVE PASSAGES OF A DISCIPLINE PAGE, in the order Chris set on
 * 2026-09-02:
 *
 *   1. What we do
 *   2. Channels it's good for
 *   3. Who we'd recommend it for — industry, and stage
 *   4. What it helps with
 *   5. How it works
 *
 * WHAT IS REAL AND WHAT IS NOT. The first passage is the discipline's own
 * paragraph from /services. The industry and stage chips are the site's
 * existing vocabulary — the four industries in industries.js and the four
 * stages the nav renders — listed in full, to be trimmed per discipline.
 * Everything else is a bracketed placeholder, because the site holds no copy
 * for it and which channels a discipline suits, what it helps with and how
 * it runs are claims, not layout. They render as they are, brackets and all,
 * so an unwritten passage cannot pass for a written one. Fill COPY below,
 * per slug, and the placeholder gives way field by field.
 */
const PLACEHOLDER = (what) => `[${what}]`

const INDUSTRY_CHIPS = industries.map(({ name }) => name)
const STAGE_CHIPS = WORK_BY_STAGE.map(({ label }) => label)

/* Per-discipline copy, by slug. Any field left out falls back to the
   placeholder for that field. Chips are plain strings.

   WRITTEN 2026-09-02 BY comms-writer, one pass per discipline, from
   positioning.md, audience.md, proof-points.md and tone-of-voice.md, with the
   facts taken from the Services page. No [CLAIM NEEDED] markers were needed:
   every passage describes the work or the reader's situation, and none names
   a client, a figure or a result. The industry and stage chips are each
   writer's call from the site's fixed vocabulary; where two pages differ it
   is a judgment about the discipline, not a mistake. */
const COPY = {
  'creative-direction': {
    channels: {
      line: 'Anywhere the brand shows up twice',
      sub: 'Direction pays off across surfaces, not on any single one. You see it when the launch film, the site and the paid ads read like one company that decided something.',
      chips: ['Brand campaigns', 'Launch films', 'Website', 'Social', 'Paid media'],
    },
    who: {
      line: 'Founders with assets and no through-line',
      sub: 'You\'ve got a deck, a site and a campaign that don\'t look related. The time to fix that is before the next launch, not after it.',
      industries: ['Technology', 'Health & Wellness', 'Food & Beverage'],
      stages: ['Founder-led', 'Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'Something to say no with',
      sub: 'Without a direction, every review becomes a taste argument and the work drifts piece by piece. Direction gives you a reason to kill something that isn\'t personal preference, and a reason to back the next thing.',
    },
    how: {
      line: 'Whoever sets it runs it',
      sub: 'Direction gets set at the start, then held by the same bench making work against it. Add it for a launch and drop it after; you\'re buying hours across the team, not a hire.',
    },
  },
  'writing': {
    channels: {
      line: 'The part people actually read',
      sub: 'A tagline ends up in a sales call, a subject line, an ad, and somebody else\'s description of you. Design doesn\'t travel like that; words get repeated by people you\'ll never meet.',
      chips: ['Naming', 'Website', 'Email', 'Scripts', 'Social'],
    },
    who: {
      line: 'The good part isn\'t coming across',
      sub: 'You know what makes you better than the cheaper option. It\'s just never made it into words a stranger could repeat back to you.',
      industries: ['Technology', 'Health & Wellness', 'Culture & Nonprofit'],
      stages: ['Founder-led', 'Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'Sentences a competitor couldn\'t sign',
      sub: 'Swap a competitor\'s name into most category copy and it still reads true. We write the lines that fail that test, and a voice consistent enough that your team can write in it without us.',
    },
    how: {
      line: 'The voice gets set first',
      sub: 'We write the voice before the body copy, then the same bench writes against it: site, emails, scripts, ads. So you\'re never re-briefing a stranger on your own company.',
    },
  },
  'design': {
    channels: {
      line: 'Small enough for a favicon',
      sub: 'An identity has to survive at 16 pixels and at arm\'s length on a shelf. Type, layout, and color are what carry it that far.',
      chips: ['Identity', 'Website', 'Packaging', 'Decks', 'Ad creative'],
    },
    who: {
      line: 'You approve every asset yourself',
      sub: 'Marketing landed on you and never left, so nothing gets made unless you look at it first. A system is what lets other people make things you\'d have approved.',
      industries: ['Technology', 'Food & Beverage', 'Culture & Nonprofit'],
      stages: ['Founder-led', 'Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'Decisions you only make once',
      sub: 'Without a system, every asset starts from zero and gets argued from zero. A grid, a type scale, and a palette settled once mean the next thing is assembly, and a freelancer can make it fit.',
    },
    how: {
      line: 'We have to live with it',
      sub: 'Design runs off the same bench as everything else, so the identity gets built by people who\'ll still be here spending behind it. You\'re buying hours across the team, not headcount.',
    },
  },
  'illustration': {
    channels: {
      line: 'Where a photo can\'t go',
      sub: 'Some things won\'t sit still for a camera: software, a process, a product you haven\'t shipped yet. Drawing is how they get shown at all. And it works at favicon size and at wall size.',
      chips: ['Website', 'Editorial', 'Packaging', 'Social', 'Merch'],
    },
    who: {
      line: 'The category all shops one library',
      sub: 'Your competitors are buying their images from the same places you are, which is why it all blurs. Anything drawn for you can\'t be bought by anyone else.',
      industries: ['Technology', 'Food & Beverage', 'Culture & Nonprofit'],
      stages: ['Founder-led', 'Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'Assets that don\'t run out',
      sub: 'Most brands commission one illustration, use it everywhere, then start from nothing again on the next launch. A system sets the rules and the pieces, so the next thing you need already half exists.',
    },
    how: {
      line: 'Drawn by the team that spends',
      sub: 'The same people draw it, place it, and see how it performs, so a style that isn\'t landing gets changed instead of defended. That loop only closes if one team holds both ends.',
    },
  },
  'film-photo': {
    channels: {
      line: 'Shot once, cut for everywhere',
      sub: 'Plan the shoot around the surfaces and one day covers the campaign, the product grid, the ad variants and next month\'s posts. Plan it around one hero image and you get one hero image.',
      chips: ['Campaigns', 'Product', 'Social', 'Paid media', 'Website'],
    },
    who: {
      line: 'You\'re rationing the same six photos',
      sub: 'Every post pulls from the same folder and the good ones are worn out. Shoots have a hard floor, though: crew, cast and a location cost what they cost.',
      industries: ['Food & Beverage', 'Health & Wellness', 'Technology'],
      stages: ['Seed to Series A', 'Scale-up', 'Enterprise'],
    },
    helps: {
      line: 'Stock belongs to your competitors too',
      sub: 'Anyone can license the frame you\'re using; nobody else can license the day you shot. Owned stills and footage give the brand something specific to be made of, and give media a library to keep cutting from.',
    },
    how: {
      line: 'Built from what the ads need',
      sub: 'The shot list comes from the same bench running your channels, so we shoot for the cuts and crops the media actually needs. Book it for a launch and drop it after.',
    },
  },
  '3d-motion': {
    channels: {
      line: 'The model outlives the campaign',
      sub: 'Film is shot for one thing and then it\'s spent. A model gets rebuilt into the launch film, the 6-second ad and the loop on your homepage, and the fourth cut isn\'t a reshoot.',
      chips: ['Product explainers', 'Brand films', 'Social', 'Paid media', 'Website'],
    },
    who: {
      line: 'Nothing to point a camera at',
      sub: 'Your product is software, or a process, or still in tooling. There\'s no shot to get, so the explainer defaults to a screen recording and stock footage of someone smiling.',
      industries: ['Technology', 'Health & Wellness', 'Food & Beverage'],
      stages: ['Seed to Series A', 'Scale-up', 'Enterprise'],
    },
    helps: {
      line: 'Stop explaining it on calls',
      sub: 'Right now the mechanism only lands when you\'re in the room explaining it. Motion moves that explanation into something you can send, and it holds up the same on the tenth viewer as the first.',
    },
    how: {
      line: 'Whoever cuts it reads the numbers',
      sub: 'Motion usually arrives as a file from a studio that never sees it run. Here the same team builds the spot, runs it as media, and cuts the next version against what the first one did.',
    },
  },
  'animation': {
    channels: {
      line: 'A still can wait; motion can\'t',
      sub: 'Motion has to earn every second it takes. That changes where it works hardest: the loop that plays twice before anyone decides, the spot with 30 seconds and one idea.',
      chips: ['Social loops', 'Broadcast spots', 'Product explainers', 'Website', 'Interactive'],
    },
    who: {
      line: 'A logo can\'t carry a personality',
      sub: 'You\'re losing to cheaper competitors and the warm, human part of you never survives a screenshot. Something that moves and behaves gives people a character to recognize.',
      industries: ['Technology', 'Health & Wellness', 'Culture & Nonprofit'],
      stages: ['Seed to Series A', 'Scale-up', 'Enterprise'],
    },
    helps: {
      line: 'Stop buying video by the piece',
      sub: 'Bought one at a time, every placement starts from zero and looks it. A character and a rig built properly carry the next run of cuts without starting over.',
    },
    how: {
      line: 'No handoff to the media shop',
      sub: 'The bench that animates the spot also runs the paid behind it, so the next cut gets made against what\'s working, and nobody re-explains the rig to a new vendor next quarter.',
    },
  },
  'editing': {
    channels: {
      line: 'One shoot, cut a dozen ways',
      sub: 'One day of footage becomes the brand film, the pre-roll, and a month of vertical cuts for paid. The shoot is the expensive part; the edit is where it multiplies.',
      chips: ['Brand films', 'Product demos', 'Short-form video', 'Founder interviews', 'Paid media'],
    },
    who: {
      line: 'Footage sitting in a folder',
      sub: 'You shot something months ago and nobody finished it. Or you\'re about to shoot again without having decided what the cut has to do.',
      industries: ['Technology', 'Food & Beverage', 'Culture & Nonprofit'],
      stages: ['Seed to Series A', 'Scale-up', 'Enterprise'],
    },
    helps: {
      line: 'The cut decides what you shot',
      sub: 'Footage doesn\'t argue for itself. With nobody to set the order and the pace, you get a long, polite version of everything you filmed and no reason for anyone to stay past the first few seconds.',
    },
    how: {
      line: 'The editor sees the numbers',
      sub: 'Editing sits on the same bench that runs the paid media, so how a cut performed reaches the person making the next one. No handoff between whoever made the piece and whoever spends behind it.',
    },
  },
  'production': {
    channels: {
      line: 'The day it gets made',
      sub: 'A shoot is a hundred decisions with money and daylight attached. Production makes them in the right order, on the day, inside the number you agreed.',
      chips: ['Shoots', 'Films', 'Content programs', 'Campaign launches', 'Events'],
    },
    who: {
      line: 'The idea\'s approved. Nobody\'s making it',
      sub: 'You\'ve signed off on something you don\'t have the people or the calendar to build. The date is real, the budget is real, and nobody in the building owns it.',
      industries: ['Food & Beverage', 'Health & Wellness', 'Culture & Nonprofit'],
      stages: ['Seed to Series A', 'Scale-up', 'Enterprise'],
    },
    helps: {
      line: 'The budget stops being a guess',
      sub: 'Most overruns get decided long before the shoot day, in the things nobody priced: the second location, the usage rights, the reshoot. We cost those up front and tell you what we\'d cut first.',
    },
    how: {
      line: 'Booked for the launch, gone after',
      sub: 'The producer sits on the same bench that made the work, so nobody is explaining your brand to a crew that has never seen it. Book the discipline for one shoot and stop there.',
    },
  },
  'media': {
    channels: {
      line: 'Nobody scrolls looking for you',
      sub: 'Search catches the people already looking. Social and programmatic have to interrupt everyone else. Two different jobs, bought separately, because they fail for different reasons.',
      chips: ['Paid social', 'Paid search', 'Programmatic', 'Retargeting', 'Creative testing'],
    },
    who: {
      line: 'Good product, nobody\'s heard of it',
      sub: 'Somebody on the exec team runs the ad account between other jobs. It works well enough to keep going, and not well enough to tell you anything.',
      industries: ['Technology', 'Health & Wellness', 'Food & Beverage'],
      stages: ['Founder-led', 'Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'Which part is actually broken',
      sub: 'A flat month looks the same whether the wrong people saw it, the right people ignored it, or they saw it and weren\'t convinced. Those have three different fixes. We separate them before you spend again.',
    },
    how: {
      line: 'We agree the threshold first',
      sub: 'What counts as working gets set before anything runs, along with what would make us stop. Then the same bench that built the brand buys against it. Add media for a launch, drop it after.',
    },
  },
  'search': {
    channels: {
      line: 'Demand you don\'t have to create',
      sub: 'Search is the one channel where the wanting already happened. The job isn\'t making somebody want it. It\'s being there when they look, in the blue links and in whatever the assistant says back.',
      chips: ['Organic search', 'AI answers', 'Technical SEO', 'Content', 'Structured data'],
    },
    who: {
      line: 'Nobody knows you exist yet',
      sub: 'You\'ve got a product people would pick if they found it. Right now they\'re finding whoever wrote the page they searched for instead.',
      industries: ['Technology', 'Health & Wellness', 'Culture & Nonprofit'],
      stages: ['Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'Left out of the answer',
      sub: 'When a model answers instead of listing, nothing tells you it left you out. Plain pages that say what you do and who for, marked up so a machine can read them, are the part you control.',
    },
    how: {
      line: 'No audit for you to implement',
      sub: 'Most search work arrives as a list of fixes for your team to make. Here the people who find the problem write the page. Same team reads the work and the numbers, month to month.',
    },
  },
  'engineering': {
    channels: {
      line: 'Where the mockup has to work',
      sub: 'Same discipline whether it\'s the launch site or the internal tool nobody outside the company will ever see. The public ones are judged in the first second; the internal ones are judged for years.',
      chips: ['Marketing sites', 'Web apps', 'Landing pages', 'Internal tools', 'Tracking and analytics'],
    },
    who: {
      line: 'Nobody left who can change it',
      sub: 'The site got built by a contractor who\'s moved on, or by a founder at midnight. Now every change is a favor you have to go and ask for.',
      industries: ['Technology', 'Health & Wellness', 'Food & Beverage'],
      stages: ['Founder-led', 'Seed to Series A', 'Scale-up'],
    },
    helps: {
      line: 'What shipped is what got designed',
      sub: 'Designs get quietly compromised at build time by whoever is doing the building, and nobody is left to argue for the version that got approved. We build what we drew, and we say up front which parts are expensive.',
    },
    how: {
      line: 'The people who built it stay',
      sub: 'The same team runs the campaigns pointed at what they built. So when a landing page isn\'t converting, the person changing it is reading the numbers too, not waiting on a ticket in someone else\'s queue.',
    },
  },
}

export function disciplinePanels({ slug, name, body, index }) {
  const c = COPY[slug] ?? {}
  const n = String(index + 1).padStart(2, '0')
  /* Flat grounds, one shade step apart, until each passage has art. */
  const shades = ['#1a1a1a', '#1e1e1e', '#222222', '#262626', '#2a2a2a']

  return [
    {
      shade: shades[0],
      label: `[ Discipline ${n} ]`,
      line: name,
      sub: body,
    },
    {
      shade: shades[1],
      label: "[ Channels It's Good For ]",
      line: c.channels?.line ?? PLACEHOLDER(`Headline: where ${name.toLowerCase()} earns its keep`),
      sub: c.channels?.sub ?? PLACEHOLDER('One or two sentences on the channels this discipline is built for'),
      groups: [{ name: 'Channels', items: c.channels?.chips ?? [PLACEHOLDER('Channel'), PLACEHOLDER('Channel'), PLACEHOLDER('Channel')] }],
    },
    {
      shade: shades[2],
      label: "[ Who We'd Recommend It For ]",
      line: c.who?.line ?? PLACEHOLDER(`Headline: who ${name.toLowerCase()} is for`),
      sub: c.who?.sub ?? PLACEHOLDER('One or two sentences on the kind of company that gets the most from it'),
      groups: [
        { name: 'Industry', items: c.who?.industries ?? INDUSTRY_CHIPS },
        { name: 'Stage', items: c.who?.stages ?? STAGE_CHIPS },
      ],
    },
    {
      shade: shades[3],
      label: '[ What It Helps With ]',
      line: c.helps?.line ?? PLACEHOLDER(`Headline: the problems ${name.toLowerCase()} solves`),
      sub: c.helps?.sub ?? PLACEHOLDER('One or two sentences on the outcomes — no figures unless they are sourced'),
    },
    {
      shade: shades[4],
      label: '[ How It Works ]',
      line: c.how?.line ?? PLACEHOLDER(`Headline: how ${name.toLowerCase()} runs with us`),
      sub: c.how?.sub ?? PLACEHOLDER('One or two sentences on the engagement — how it starts, who is in it, what ships'),
    },
  ]
}
