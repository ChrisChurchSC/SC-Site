/* Projects. A project is what the brand is being used for, which is why it is
   not a folder: it has an owner, a percentage and a shape, and it opens onto
   the work rendered rather than onto a list of filenames. */
const PROJECTS = [
  {
    id: 4,
    name: 'Challenger positioning launch',
    owner: 'dana',
    updated: '2h',
    done: 68,
    closed: false,
    visibility: 'Private',
    team: ['Dana Cole', 'Chris Church', 'Ravi Menon'],
    brief: 'Six weeks, three phases. The messaging house names the challengers, the channels carry it, and the site lands the week after.',
    /* A campaign map, not an artboard: brand → strategy → audience →
       message, over funnel-stage bands. The layout owns the hierarchy, so a
       message cannot be placed above the audience it belongs to. */
    canvas: {
      label: 'challenger-launch',
      nodes: [
        { id: 'brand', kind: 'brand', label: 'Super Conscious', meta: ['v2.1 — current'] },
        { id: 'strat', kind: 'strategy', parent: 'brand', label: 'Name the four', meta: ['Challenger positioning'] },

        { id: 'founders', kind: 'audience', parent: 'strat', label: 'Founders',
          meta: ['Series A–B, 20–80 people', 'Buys the argument, not the deck'] },
        { id: 'marketing', kind: 'audience', parent: 'strat', label: 'Marketing teams',
          meta: ['In-house, no agency of record', 'Needs it to survive handover'] },
        { id: 'operators', kind: 'audience', parent: 'strat', label: 'Operators',
          meta: ['Heads of brand and content', 'Inherits whatever we leave'] },

        { id: 'm1', kind: 'message', parent: 'founders', stage: 'awareness', channel: 'LinkedIn',
          label: 'Everyone is a platform',
          meta: ['Four homepages, one paragraph', 'Proof: the side-by-side read', 'CTA — read the teardown'] },
        { id: 'm2', kind: 'message', parent: 'marketing', stage: 'awareness', channel: 'Paid social',
          label: 'Safe language is not believed',
          meta: ['Cut for 1:1 and 9:16', 'Proof: 61 shipped projects', 'CTA — see the work'] },
        { id: 'm3', kind: 'message', parent: 'operators', stage: 'awareness', channel: 'Newsletter',
          label: 'The system outlives the engagement',
          meta: ['Long form, no gate', 'Proof: four systems still running', 'CTA — subscribe'],
          flagged: 'Retired category language' },

        { id: 'm4', kind: 'message', parent: 'founders', stage: 'consideration', channel: 'Case study',
          label: 'One rebrand that survived a merger',
          meta: ['Named client, named numbers', 'Proof: the merger held the mark', 'CTA — book a call'] },
        { id: 'm5', kind: 'message', parent: 'marketing', stage: 'consideration', channel: 'Landing page',
          label: 'What you get, in one page',
          meta: ['Tokens, not a PDF', 'Proof: this workspace', 'CTA — see a system'] },

        { id: 'm6', kind: 'message', parent: 'founders', stage: 'conversion', channel: 'Sales outreach',
          label: 'Bring us in when it has to last',
          meta: ['Three-line email, no deck', 'Proof: the case study above', 'CTA — 20 minutes'] },
        { id: 'm7', kind: 'message', parent: 'operators', stage: 'retention', channel: 'Email',
          label: 'Quarterly system review',
          meta: ['What drifted, what held', 'Proof: usage up 9pt', 'CTA — book the review'] },
      ],
    },
    deck: {
      file: 'challenger-launch.pdf',
      pages: [
        { blocks: [
          { kind: 'eyebrow', text: 'Super Conscious · Q3' },
          { kind: 'h', text: 'The category stopped meaning anything' },
          { kind: 'rule' },
          { kind: 'p', text: 'Four brands took the same three words and said them louder. This is what we say instead.' },
        ] },
        { blocks: [
          { kind: 'eyebrow', text: 'The problem' },
          { kind: 'h', text: 'Everyone is a platform' },
          { kind: 'p', text: 'Read the four homepages back to back and the only difference is the logo. The words are interchangeable because they were chosen to be safe.' },
          { kind: 'rule' },
          { kind: 'p', text: 'Safe language cannot be argued with, which is the same as not being believed.' },
        ] },
        { blocks: [
          { kind: 'eyebrow', text: 'The move' },
          { kind: 'h', text: 'Name the four' },
          { kind: 'image' },
          { kind: 'p', text: 'Naming a competitor is a claim you have to stand behind. That is the point — it is the only sentence on the page that could be wrong.' },
        ] },
        { blocks: [
          { kind: 'eyebrow', text: 'Proof' },
          { kind: 'h', text: 'Three things we can show' },
          { kind: 'rule' },
          { kind: 'p', text: 'Sixty-one shipped projects. Four systems still running two years after the engagement ended. One rebrand that survived a merger.' },
          { kind: 'image' },
        ] },
        { blocks: [
          { kind: 'eyebrow', text: 'Rollout' },
          { kind: 'h', text: 'Six weeks, three phases' },
          { kind: 'p', text: 'Messaging house lands week one. Channels follow in week three, once the matrix is signed off. Site goes live week six.' },
          { kind: 'rule' },
          { kind: 'p', text: 'Blocked on channel sign-off — see #40.' },
        ] },
      ],
    },
    /* What is in the folder, rendered. Each block names the file that
       produced it, so the preview always leads back to a source. */
    preview: [
      { kind: 'canvas', from: 'journey.canvas', icon: 'route' },
      {
        kind: 'copy', from: 'messaging-house.md', icon: 'file',
        lines: [
          { h: 'The category stopped meaning anything' },
          { p: 'Four brands took the same three words and said them louder. Read the homepages back to back and the only difference is the logo.' },
          { p: 'So we name them. Naming a competitor is a claim you have to stand behind — which is the point. It is the only sentence on the page that could be wrong.' },
        ],
      },
      { kind: 'mark', from: 'logo-lockup.fig', icon: 'image', sizes: [64, 40, 24, 16] },
      {
        kind: 'art', from: 'social-kit.fig', icon: 'image',
        tiles: [
          { label: 'Feed', ratio: '1 / 1' },
          { label: 'Story', ratio: '9 / 16' },
          { label: 'Landscape', ratio: '16 / 9' },
          { label: 'Email header', ratio: '3 / 1' },
        ],
      },
      {
        kind: 'table', from: 'channel-matrix.md', icon: 'file',
        columns: ['Channel', 'Awareness', 'Consideration', 'Conversion'],
        rows: [
          ['LinkedIn', 'Everyone is a platform', 'Merger case study', '—'],
          ['Paid social', 'Safe language', '—', '—'],
          ['Newsletter', 'System outlives it', '—', '—'],
          ['Landing page', '—', 'What you get', 'Book a call'],
          ['Outreach', '—', '—', 'Bring us in'],
        ],
      },
      {
        kind: 'swatches', from: 'chart-palette.json', icon: 'file',
        colours: [
          { name: 'Series 1', value: '#d94eb6' },
          { name: 'Series 2', value: '#7d5ae0' },
          { name: 'Series 3', value: '#a82a7e' },
        ],
      },
    ],
    assets: [
      { name: 'messaging-house.md', from: 'Brand / Verbal', kind: 'Document', icon: 'file' },
      { name: 'logo-lockup.fig', from: 'Brand / Visual', kind: 'Artwork', icon: 'image' },
      { name: 'social-kit.fig', from: 'Brand / Channels', kind: 'Artwork', icon: 'image' },
      { name: 'channel-matrix.md', from: 'Brand / Channels', kind: 'Document', icon: 'file' },
      { name: 'chart-palette.json', from: 'Brand / Data', kind: 'Tokens', icon: 'file' },
    ],
  },
  {
    id: 3,
    name: 'Site refresh — v2.1',
    owner: 'chris',
    updated: '1d',
    done: 42,
    closed: false,
    visibility: 'Private',
    team: ['Chris Church', 'Dana Cole'],
    brief: 'The identity refresh applied to the site. Mostly a token migration — the modules already have the right shapes, they just declare their own colours.',
    canvas: {
      label: 'site-v2.1',
      nodes: [
        { id: 'brand', kind: 'brand', label: 'Super Conscious', meta: ['v2.1 — current'] },
        { id: 'strat', kind: 'strategy', parent: 'brand', label: 'Token migration', meta: ['Shapes stay, colours move'] },
        { id: 'visitors', kind: 'audience', parent: 'strat', label: 'First-time visitors',
          meta: ['Arrive from a post or a referral', 'Decide in one screen'] },
        { id: 'returning', kind: 'audience', parent: 'strat', label: 'Returning',
          meta: ['Came back for the work', 'Knows what we do'] },

        { id: 's1', kind: 'message', parent: 'visitors', stage: 'awareness', channel: 'Home',
          label: 'The statement, named', meta: ['Hero + challenger names', 'CTA — see the work'] },
        { id: 's2', kind: 'message', parent: 'returning', stage: 'consideration', channel: 'Work index',
          label: 'Cards only, no list', meta: ['61 projects, 32 placeholder', 'CTA — open a case study'] },
        { id: 's3', kind: 'message', parent: 'visitors', stage: 'consideration', channel: 'Capabilities',
          label: 'What we actually do', meta: ['Four capabilities, no fifth', 'CTA — read one'],
          flagged: 'Blocked on channel sign-off' },
        { id: 's4', kind: 'message', parent: 'returning', stage: 'conversion', channel: 'Contact',
          label: 'Start a conversation', meta: ['One field, then a call', 'CTA — send it'] },
      ],
    },
    deck: null,
    preview: [
      { kind: 'canvas', from: 'journey.canvas', icon: 'route' },
      {
        kind: 'swatches', from: 'colour-tokens.json', icon: 'file',
        colours: [
          { name: 'Ground', value: '#0a0a0a' },
          { name: 'Card', value: '#161616' },
          { name: 'Pink', value: '#df4ed6' },
          { name: 'Purple', value: '#7d5ae0' },
        ],
      },
      {
        kind: 'type', from: 'type-scale.fig', icon: 'image',
        steps: [
          { name: 'Display', size: 34, sample: 'The system outlives the engagement' },
          { name: 'Lede', size: 20, sample: 'Brand, content and product saying the same thing' },
          { name: 'Body', size: 15, sample: 'Say the finding, then the evidence.' },
          { name: 'Meta', size: 11, mono: true, sample: 'a014ddf · 2h ago · 492 changes' },
        ],
      },
      {
        kind: 'art', from: 'grid-system.fig', icon: 'image',
        tiles: [
          { label: 'Home', ratio: '3 / 4' },
          { label: 'Work index', ratio: '4 / 3' },
          { label: 'Case study', ratio: '16 / 9' },
        ],
      },
      {
        kind: 'table', from: 'table-rules.md', icon: 'file',
        columns: ['Rule', 'Value', 'Why'],
        rows: [
          ['Separator', 'Hairline', 'Zebra stripes fight the data'],
          ['Numerals', 'Tabular', 'Columns have to line up'],
          ['Percentages', 'One decimal', 'Two implies precision we lack'],
          ['Empty cell', 'Em dash', 'Blank reads as an error'],
        ],
      },
    ],
    assets: [
      { name: 'colour-tokens.json', from: 'Brand / Visual', kind: 'Tokens', icon: 'file' },
      { name: 'grid-system.fig', from: 'Brand / Visual', kind: 'Artwork', icon: 'image' },
      { name: 'type-scale.fig', from: 'Brand / Visual', kind: 'Artwork', icon: 'image' },
      { name: 'table-rules.md', from: 'Brand / Data', kind: 'Document', icon: 'file' },
    ],
  },
  {
    id: 2,
    name: 'Sonic identity',
    owner: 'ravi',
    updated: '3d',
    done: 25,
    closed: false,
    visibility: 'Private',
    team: ['Ravi Menon'],
    brief: 'A sting, a set of UI timings that match it, and a read guide for voiceover. Earliest stage of the five — there is one file and it is still in review.',
    canvas: null,
    deck: null,
    audio: {
      label: 'brand-sting.wav',
      duration: 1.2,
      peaks: [0.08, 0.14, 0.3, 0.62, 0.94, 0.86, 0.7, 0.58, 0.72, 0.88, 0.64, 0.46,
        0.38, 0.52, 0.44, 0.3, 0.36, 0.28, 0.2, 0.26, 0.18, 0.12, 0.14, 0.08, 0.05],
    },
    /* One block, because one file in here renders to a page. That is the
       honest state of a project at 25%, and padding it would say otherwise. */
    preview: [
      {
        kind: 'copy', from: 'voice-guide.md', icon: 'file',
        lines: [
          { h: 'Read pace and warmth' },
          { p: 'Slower than conversational, warmer than corporate. Land the noun, not the adjective.' },
          { p: 'The sting is 1.2 seconds. Anything longer and it stops being a signature and starts being music.' },
        ],
      },
    ],
    assets: [
      { name: 'brand-sting.wav', from: 'Brand / Audio', kind: 'Audio', icon: 'video' },
      { name: 'motion-timings.md', from: 'Brand / Audio', kind: 'Document', icon: 'file' },
      { name: 'voice-guide.md', from: 'Brand / Audio', kind: 'Document', icon: 'file' },
    ],
  },
  {
    id: 1,
    name: 'Identity refresh — v2.0',
    owner: 'dana',
    updated: '5w',
    done: 100,
    closed: true,
    visibility: 'Private',
    team: ['Dana Cole', 'Chris Church', 'Ravi Menon', 'Super Conscious'],
    brief: 'Shipped. The mark, the type scale, the grid and the two accents that replaced five.',
    canvas: null,
    deck: {
      file: 'identity-v2.pdf',
      pages: [
        { blocks: [
          { kind: 'eyebrow', text: 'Super Conscious · v2.0' },
          { kind: 'h', text: 'Two accents, not five' },
          { kind: 'rule' },
          { kind: 'p', text: 'Pink and purple carry everything. Teal and blue were declared and never used.' },
        ] },
        { blocks: [
          { kind: 'eyebrow', text: 'The mark' },
          { kind: 'h', text: 'One shape, four sizes' },
          { kind: 'image' },
          { kind: 'p', text: 'Clear space is half the mark height on all four sides, at every size.' },
        ] },
        { blocks: [
          { kind: 'eyebrow', text: 'Type' },
          { kind: 'h', text: 'A serif and a mono, nothing else' },
          { kind: 'p', text: 'Signifier carries anything a person reads. Roboto Mono carries anything a machine produced — timestamps, hashes, counts, labels.' },
          { kind: 'rule' },
          { kind: 'p', text: 'The distinction is doing real work: it means a number never has to explain where it came from.' },
        ] },
      ],
    },
    preview: [
      { kind: 'mark', from: 'logo-lockup.fig', icon: 'image', sizes: [72, 48, 32, 20] },
      {
        kind: 'swatches', from: 'colour-tokens.json', icon: 'file',
        colours: [
          { name: 'Pink', value: '#df4ed6' },
          { name: 'Purple', value: '#7d5ae0' },
          { name: 'Retired — teal', value: '#1f4f4a' },
          { name: 'Retired — blue', value: '#22355e' },
        ],
      },
      {
        kind: 'type', from: 'type-scale.fig', icon: 'image',
        steps: [
          { name: 'Display', size: 34, sample: 'Two accents, not five' },
          { name: 'Body', size: 15, sample: 'A serif for people, a mono for machines.' },
        ],
      },
    ],
    assets: [
      { name: 'logo-lockup.fig', from: 'Brand / Visual', kind: 'Artwork', icon: 'image' },
      { name: 'type-scale.fig', from: 'Brand / Visual', kind: 'Artwork', icon: 'image' },
      { name: 'colour-tokens.json', from: 'Brand / Visual', kind: 'Tokens', icon: 'file' },
    ],
  },
]

export default PROJECTS
