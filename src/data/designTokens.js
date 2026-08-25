/* The site's design tokens, in one place.
 *
 * These are not aspirational — every value here was read back out of the
 * shipped CSS, and the `uses` counts are the number of times each literal
 * appears across src/**\/*.css. That is the point of the file: /design-system
 * renders straight from it, so the styleguide cannot drift from the site by
 * being edited separately.
 *
 * Where a token is declared in :root but the modules hardcode the literal
 * instead, `cssVar` records the custom property that exists, and the counts
 * tell you how little it is actually reached for.
 */

export const SURFACES = [
  { name: 'Ground',      value: '#0a0a0a', uses: 27, cssVar: '--bg',
    note: 'Page background. Every route sets it on its own .main as well as on html.' },
  { name: 'Card',        value: '#161616', uses: 60, cssVar: null,
    note: 'The one surface. Every block, card, drawer and strip on the site is this colour.' },
  { name: 'Card hover',  value: '#1c1c1c', uses: 7,  cssVar: null,
    note: 'Lift on hover, paired with translateY(-2px).' },
  { name: 'Raised',      value: '#1e1e1e', uses: 8,  cssVar: null,
    note: 'Back button hover, and a handful of nested surfaces.' },
  { name: 'Recessed',    value: '#0e0e0e', uses: 6,  cssVar: null,
    note: 'Wells and inset rows — a step below the ground rather than above it.' },
]

export const TEXT_RAMP = [
  { alpha: 0.95, uses: 46, role: 'Peak — reserved for hover states on display type.' },
  { alpha: 0.92, uses: 12, role: 'Display. The statement card headline.' },
  { alpha: 0.85, uses: 49, role: 'Headings, and the hover target for muted UI text.' },
  { alpha: 0.75, uses: 16, role: 'Card titles.' },
  { alpha: 0.55, uses: 54, role: 'Body copy. The most common reading colour on the site.' },
  { alpha: 0.45, uses: 20, role: 'Supporting copy under a headline.' },
  { alpha: 0.40, uses: 42, role: 'Labels at rest.', cssVar: '--text-muted (0.5)' },
  { alpha: 0.30, uses: 18, role: 'Metadata — years, numbers, types.' },
  { alpha: 0.22, uses: 12, role: 'Eyebrows. Present, barely.' },
  { alpha: 0.20, uses: 22, role: 'Faintest legible label.', cssVar: '--text-faint (0.28)' },
]

/* Hairlines and fills sit on the same white, an order of magnitude fainter. */
export const HAIRLINES = [
  { alpha: 0.12, uses: 20, role: 'Border on an interactive surface.' },
  { alpha: 0.08, uses: 41, role: 'Input borders.' },
  { alpha: 0.07, uses: 22, role: 'Button fills, and the nav rail divider.' },
  { alpha: 0.06, uses: 69, role: 'The default hairline. Most-used alpha on the site.' },
  { alpha: 0.04, uses: 17, role: 'Barely-there separators inside a card.' },
]

export const ACCENTS = [
  { name: 'Pink', value: '#df4ed6', cssVar: '--pink' },
  { name: 'Teal', value: '#4ecfb3', cssVar: '--teal' },
  { name: 'Blue', value: '#5a76e5', cssVar: '--blue' },
]

export const FAMILIES = [
  {
    name: 'Signifier',
    stack: "'Signifier', Georgia, serif",
    weight: 300,
    role: 'Display. Every headline, statement and body paragraph of running prose.',
    source: 'Self-hosted woff2, @font-face in index.html',
  },
  {
    name: 'Roboto Mono',
    stack: "'Roboto Mono', monospace",
    weight: 400,
    role: 'Everything else. Labels, metadata, buttons, navigation, form fields.',
    source: 'Google Fonts, set on html in index.css',
  },
]

/* The mono scale is where the site's voice lives: four sizes, all tiny, all
   uppercase, separated as much by tracking as by size. */
export const MONO_SCALE = [
  { size: 8,  tracking: '0.14em', uses: 38, role: 'Eyebrow above a headline.' },
  { size: 9,  tracking: '0.12em', uses: 67, role: 'Buttons and the back control. The workhorse.' },
  { size: 10, tracking: '0.12em', uses: 60, role: 'Metadata, timestamps, nav items.' },
  { size: 11, tracking: '0.10em', uses: 36, role: 'Supporting copy and longer labels.' },
]

/* Display type is fluid rather than stepped — each entry is a real clamp()
   from the shipped CSS. */
export const DISPLAY_SCALE = [
  { name: 'Statement', clamp: 'clamp(28px, 3.6vw, 54px)', lineHeight: 1.08,
    where: 'StatementCard — the one display sentence on the homepage.' },
  { name: 'Page headline', clamp: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05,
    where: 'Privacy, Terms, and the standalone routes.' },
  { name: 'Section headline', clamp: 'clamp(28px, 4vw, 52px)', lineHeight: 1.1,
    where: 'About, and the deck pages.' },
  { name: 'Section heading', clamp: 'clamp(18px, 2vw, 28px)', lineHeight: 1.3,
    where: 'Approach statements, h2.' },
  { name: 'Body', clamp: 'clamp(14px, 1.3vw, 16px)', lineHeight: 1.75,
    where: 'Running prose.' },
]

export const RADII = [
  { value: 4, uses: 85, role: 'The radius. Cards, buttons, inputs, drawers.' },
  { value: 2, uses: 27, role: 'Small inline chips and bars.' },
  { value: 3, uses: 12, role: 'Visually identical to 4 and 2 at these sizes.' },
  { value: 16, uses: 8,  role: 'Large media wells.' },
  { value: 999, uses: 5, role: 'Pills and dots.' },
]

export const MOTION = [
  { name: 'blockIn', value: '0.5s ease both',
    detail: 'opacity 0 → 1, translate 0 10px → 0. Every card enters this way.' },
  { name: 'Stagger', value: '0.05s / 0.12s / 0.19s / 0.26s',
    detail: 'nth-child delays on the homepage grid — a ~70ms cascade.' },
  { name: 'Hover lift', value: '0.3s cubic-bezier(0.25, 1, 0.4, 1)',
    detail: 'translateY(-2px) on a card, -6px on a linked card.' },
  { name: 'Colour shift', value: '0.15s',
    detail: 'The default for colour and background transitions on controls.' },
  { name: 'Media scale', value: '0.45s cubic-bezier(0.25, 1, 0.4, 1)',
    detail: 'scale(1.06) on the image inside a hovered card.' },
]

export const LAYOUT = [
  { name: 'Grid gutter', value: '5px',
    detail: 'The gap between every block on the homepage. Unusually tight, deliberately.' },
  { name: 'Page inset', value: '12px',
    detail: 'Padding around the grid on three sides.' },
  { name: 'Nav rail', value: '312px',
    detail: 'Reserved on the right of the homepage grid for the fixed nav.' },
  { name: 'Prose measure', value: '62–68ch',
    detail: 'Max width on supporting copy, measured in characters so it holds as type scales.' },
  { name: 'Display measure', value: '26ch',
    detail: 'Max width on the statement, tuned to hold three lines at any width.' },
  { name: 'Mobile breakpoint', value: '768px',
    detail: 'The only breakpoint that matters; a few components add 1024px.' },
]

/* ── Component inventory ─────────────────────────────────────────────────────
 *
 * `status` is the honest bit. SHIPPED means the pattern was read out of a real
 * component and the demo reproduces its actual CSS. NEW means the pattern does
 * not exist on the site yet and was designed here, in the system's language,
 * to be lifted into a component when it is needed. Never quietly promote a NEW
 * entry to SHIPPED — change the code first, then the label.
 */

export const BUTTONS = [
  { name: 'Solid', status: 'SHIPPED', where: 'Contact submit, case-study CTA',
    spec: '#fff on #0a0a0a · 5px · 13/26 · 10px/0.12em',
    note: 'The only high-emphasis control. One per view.' },
  { name: 'Outline', status: 'SHIPPED', where: 'Contact "book a call"',
    spec: 'transparent · border 0.18 · 5px · 11/20 · 10px/0.1em',
    note: 'Secondary action sitting beside a solid.' },
  { name: 'Ghost', status: 'SHIPPED', where: 'Kit form submit',
    spec: 'fill 0.07 · border 0.12 · 4px · 11/20 · 9px/0.12em',
    note: 'Low emphasis, on a dark card.' },
  { name: 'Chip', status: 'SHIPPED', where: 'Global back control',
    spec: '#161616 · 4px · 8/12 · 9px/0.1em',
    note: 'Reads as a surface rather than a control until hovered.' },
  { name: 'Overlay', status: 'SHIPPED', where: '"View website" over media',
    spec: 'black 0.55 · border 0.4 · 5px · 8/12 · 9px/0.12em',
    note: 'Must stay legible over an unknown image.' },
  { name: 'Gate', status: 'SHIPPED', where: 'Deck password gate',
    spec: 'white 0.9 · no radius · 12/18 · 11px/0.1em',
    note: 'The only square control on the site. Almost certainly unintentional.' },
]

export const FIELDS = [
  { name: 'Contact', status: 'SHIPPED', spec: 'fill 0.03 · border 0.14 · 3px · 13px',
    focus: 'border 0.5, fill 0.05' },
  { name: 'Kit', status: 'SHIPPED', spec: '#0a0a0a · border 0.08 · 4px · 10px',
    focus: 'border 0.2, fill #111' },
  { name: 'Gate', status: 'SHIPPED', spec: '#161616 · border 0.08 · no radius · 12px',
    focus: 'border 0.25' },
]

export const RATIOS = [
  { name: '16:9', css: '16 / 9', cls: '.r169', where: 'Showreel, thought thumbnails, landscape media.' },
  { name: '4:5',  css: '4 / 5',  cls: '.r45',  where: 'Portrait cards. What most ratios collapse to on mobile.' },
  { name: '1:1',  css: '1 / 1',  cls: '.r11',  where: 'Square blocks in the grid.' },
  { name: '9:16', css: '9 / 16', cls: '.r916', where: 'Vertical video and social cuts.' },
]

export const GRIDS = [
  { name: 'Homepage', status: 'SHIPPED', spec: 'repeat(12, 1fr) · gap 5px',
    note: 'The site grid. Blocks span columns; the gutter is deliberately hairline-tight.' },
  { name: 'Media', status: 'SHIPPED', spec: 'repeat(12, 1fr) · gap 5px',
    note: 'Case-study media, on the same 12/5 as the homepage.' },
  { name: 'Editorial', status: 'SHIPPED', spec: 'repeat(3, 1fr) · 28px / 56px · pad 40px',
    note: 'Thoughts index. A second, unrelated grid system on the same site.' },
]

/* ── Charts ──────────────────────────────────────────────────────────────────
 *
 * Instrument colours, not brand colours. The obvious starting point was the
 * three accents the site declares and never uses — but they were wrong twice
 * over, and both reasons are worth keeping:
 *
 *   - Measurably. #4ecfb3 sits at OKLCH L 0.776, outside the 0.48–0.67 band a
 *     dark chart surface needs, and #5a76e5 and #df4ed6 are ΔE 2.5 apart under
 *     protanopia — side by side in a legend, a red-blind reader cannot tell
 *     them apart at all.
 *   - Editorially. They are pitched to catch the eye once. A chart is read for
 *     minutes at a time, and saturated brand hues turn a dashboard into
 *     decoration.
 *
 * So the chart palette is its own thing: low-chroma, cool-leaning, closer to
 * an instrument than a brand. It cannot go all the way to grey, though — the
 * first attempt at that failed both the chroma floor and the normal-vision
 * floor, meaning adjacent series were hard to separate even with full colour
 * vision. These values sit just above both floors, deliberately.
 *
 * Both columns pass all six checks of the validator against their own surface
 * — dark on #0a0a0a, light on #e9e9e9. The light column's closest adjacent
 * pair sits in the 6–8 CVD band, which is legal only alongside a secondary
 * encoding; every chart on the page carries a legend, direct labels, or gaps.
 * Do not hand-edit a value here without re-running the validator.
 */

export const CHART_PALETTE = [
  { slot: 1, hue: 'Teal',   dark: '#1d9077', light: '#007a5e', note: 'Primary series' },
  { slot: 2, hue: 'Rust',   dark: '#b35f3c', light: '#8f4526', note: 'Second series' },
  { slot: 3, hue: 'Steel',  dark: '#4a7fb5', light: '#1e5f9c', note: 'Third series' },
  { slot: 4, hue: 'Ochre',  dark: '#9c8320', light: '#7a6300', note: 'Fourth series' },
  { slot: 5, hue: 'Slate',  dark: '#7b6bb0', light: '#5b4c8c', note: 'Fifth series' },
  { slot: 6, hue: 'Moss',   dark: '#5b8f3a', light: '#416b25', note: 'Sixth — then stop' },
]

/* Sequential is one hue, light to dark — never a rainbow. Stepped from the
   steel so magnitude reads as "more of the same thing". */
export const CHART_SEQUENTIAL = ['#0d1b26', '#16303f', '#21485d', '#2e6285', '#4a7fb5', '#7aa3ce']

/* Diverging is two poles and a neutral grey midpoint — never a hue in the
   middle. Rust and steel are the furthest-apart pair in the set. */
export const CHART_DIVERGING = ['#b35f3c', '#8a6a5a', '#6b6b6b', '#486a86', '#4a7fb5']

/* Status is reserved and never reused as "series 7". These are the values the
   site already uses for state, not new ones. */
export const CHART_STATUS = [
  { name: 'Good', value: 'rgba(190, 220, 150, 0.9)', where: 'Capabilities' },
  { name: 'Warning', value: '#bd842c', where: 'New — amber, slot 4' },
  { name: 'Critical', value: 'rgba(255, 80, 80, 0.85)', where: 'DeckGate' },
]

/* ── Inventory ───────────────────────────────────────────────────────────────
 *
 * Every entry here is now either backed by real code or drawn on this page.
 * The list started as a backlog of gaps; the gaps were closed, and what it
 * tracks now is the distance still left to travel — from a pattern that exists
 * on the styleguide to a component that exists in src/.
 *
 * state: 'have'  — a real component exists in src/
 *        'proto' — drawn on this page, no component behind it yet
 *
 * `why` is the trigger that would justify promoting a proto to a component.
 * If the trigger has not happened, it should stay a proto — a drawn pattern
 * costs nothing to keep and a premature component costs maintenance forever.
 */

export const BACKLOG = [
  {
    group: 'Forms',
    note: 'The weakest area. Three input designs already exist and nothing else does.',
    items: [
      { name: 'Field primitive', state: 'proto', why: 'One labelled input the three current designs collapse into. Everything below depends on it.' },
      { name: 'Select', state: 'proto', why: 'Any filter, sort or country field. The native control cannot be styled to match.' },
      { name: 'Checkbox / radio', state: 'proto', why: 'Consent, preferences, multi-select filters.' },
      { name: 'Toggle', state: 'have', why: 'Exists as the theme switch; not generalised for use inside forms.' },
      { name: 'Inline validation', state: 'proto', why: 'Only the deck gate validates anything, and it shakes. Contact fails silently.' },
      { name: 'Multi-step form', state: 'proto', why: 'A brief or intake longer than the contact form, with progress and back.' },
      { name: 'File upload', state: 'proto', why: 'Clients sending assets or briefs without email.' },
      { name: 'Search field', state: 'proto', why: 'Once the work index or thoughts outgrows a single scannable page.' },
    ],
  },
  {
    group: 'Navigation',
    note: 'Everything is a list today, which works until a page needs more than one axis.',
    items: [
      { name: 'Breadcrumb', state: 'proto', why: 'Case studies nest two levels and offer only a back button.' },
      { name: 'Pagination', state: 'proto', why: 'The thoughts index renders every post ever written.' },
      { name: 'Tabs', state: 'proto', why: 'A case study with distinct phases, or a service page with audience cuts.' },
      { name: 'Filter bar', state: 'proto', why: 'Filtering work by discipline or year — currently the drawer is the only cut.' },
      { name: 'Sort control', state: 'proto', why: 'Pairs with the filter bar. Order is currently fixed in Sanity.' },
      { name: 'In-page TOC', state: 'proto', why: 'Long thought posts and deck pages. The chip nav on this page is the pattern.' },
      { name: 'Back to top', state: 'proto', why: 'Any page past roughly three screens — this one included.' },
    ],
  },
  {
    group: 'Content',
    note: 'Prose components. The site sets long text well and structures it barely at all.',
    items: [
      { name: 'Accordion', state: 'proto', why: 'FAQs on landing pages, currently written out in full.' },
      { name: 'Table', state: 'proto', why: 'Pricing, scope comparisons, deliverable matrices. No table style exists anywhere.' },
      { name: 'Pull quote', state: 'proto', why: 'Client words inside a case study, at display scale.' },
      { name: 'Blockquote', state: 'proto', why: 'Quoting a source in a thought post.' },
      { name: 'Code block', state: 'proto', why: 'Any thought post about how something was built.' },
      { name: 'Tooltip', state: 'proto', why: 'Defining a term without leaving the sentence.' },
      { name: 'Modal', state: 'have', why: 'Drawers exist (Cal, contact). A centred confirm dialog does not.' },
      { name: 'Stat block', state: 'proto', why: 'Outcome numbers. Case studies have outcome cards but no number treatment.' },
    ],
  },
  {
    group: 'Feedback',
    note: 'What the site says when something is loading, empty or wrong.',
    items: [
      { name: 'Toast', state: 'have', why: 'Exists. Not currently reused outside the Kit form.' },
      { name: 'Empty state', state: 'proto', why: 'No page has one. A filtered work index would need it immediately.' },
      { name: 'Skeleton', state: 'proto', why: 'Sanity-backed pages flash empty before data lands.' },
      { name: 'Progress bar', state: 'proto', why: 'Upload, multi-step form, or a long deck. Distinct from the route loader.' },
      { name: 'Status badge', state: 'proto', why: '"Coming soon" is handled ad hoc in the nav today.' },
      { name: 'Confirm dialog', state: 'proto', why: 'Any destructive or irreversible action. None exist yet — but the button does.' },
    ],
  },
  {
    group: 'Media',
    note: 'The site is image-led and has almost no image UI.',
    items: [
      { name: 'Lightbox', state: 'proto', why: 'Case-study media at full size without leaving the page.' },
      { name: 'Gallery', state: 'proto', why: 'More images than a media grid holds comfortably.' },
      { name: 'Carousel', state: 'proto', why: 'Sequential work someone has to get through in order.' },
      { name: 'Caption', state: 'proto', why: 'Every case-study image currently runs unattributed.' },
      { name: 'Before / after', state: 'proto', why: 'Rebrands. The single most obvious missing component for this studio.' },
      { name: 'Video controls', state: 'proto', why: 'Case-study video is autoplay-muted with no scrub or sound.' },
    ],
  },
  {
    group: 'Conversion',
    note: 'The pages that have to ask for something.',
    items: [
      { name: 'Pricing table', state: 'proto', why: 'Package data already exists in src/data; nothing renders it as a comparison.' },
      { name: 'Testimonial', state: 'proto', why: 'Client quotes with attribution, on work and landing pages.' },
      { name: 'CTA band', state: 'proto', why: 'The end-of-page ask, currently rebuilt per page.' },
      { name: 'Logo wall', state: 'have', why: 'ClientStrip. A static grid variant would suit decks better than the marquee.' },
      { name: 'Inline capture', state: 'have', why: 'Kit form. Not generalised beyond its one placement.' },
    ],
  },
  {
    group: 'AI',
    note: 'Only worth building behind a real feature — but worth designing once, not per surface.',
    items: [
      { name: 'Chat', state: 'proto', why: 'Needs a model and a purpose before it is a component.' },
      { name: 'Streaming text', state: 'proto', why: 'Tokens arriving progressively without the layout jumping.' },
      { name: 'Citation', state: 'proto', why: 'Pointing an answer back at the case study or post it came from.' },
      { name: 'Prompt suggestions', state: 'proto', why: 'The empty state of a chat — what to ask before anyone has typed.' },
      { name: 'Response feedback', state: 'proto', why: 'Thumbs or a flag, so answers can be judged rather than assumed.' },
    ],
  },
  {
    group: 'Charts',
    note: 'The palette is validated and the types are drawn. What is missing is data — none of these are wired to anything.',
    items: [
      { name: 'KPI row', state: 'proto', why: 'A dashboard, a client report, or the numbers on a case study.' },
      { name: 'Time series', state: 'proto', why: 'Anything measured more than twice.' },
      { name: 'Bar / ranked bar', state: 'proto', why: 'Comparison across a handful of categories.' },
      { name: 'Waterfall', state: 'proto', why: 'Explaining how a total changed — pipeline, budget, headcount.' },
      { name: 'Bullet', state: 'proto', why: 'Any metric with a target attached.' },
      { name: 'Distribution', state: 'proto', why: 'Histogram or box plot, whenever the average is hiding the spread.' },
      { name: 'Funnel', state: 'proto', why: 'Conversion reporting on a landing page or a campaign.' },
      { name: 'Cohort', state: 'proto', why: 'Retention over time, for a product engagement.' },
      { name: 'Chart tooltip', state: 'proto', why: 'Ships with the time series; needs extracting to be reused.' },
      { name: 'Table view', state: 'proto', why: 'Every chart owes one — approximate shape, exact numbers.' },
    ],
  },
  {
    group: 'Texture',
    note: 'Eight fills defined as SVG patterns. The only foundation on this page with no prior art in the codebase at all.',
    items: [
      { name: 'Dither set', state: 'proto', why: 'Three densities on one grid. Section grounds and hover fills.' },
      { name: 'Halftone', state: 'proto', why: 'Under an image, or behind a quote.' },
      { name: 'Stair 45 / 135', state: 'proto', why: 'Directional grain where a flat plane needs an edge.' },
      { name: 'Stipple', state: 'proto', why: 'Placeholders and empty states — already used by both above.' },
    ],
  },
]
