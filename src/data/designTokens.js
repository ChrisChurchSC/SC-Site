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
 * tell you how little it is actually reached for. See the "drift" section of
 * the page for what that costs.
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
  { value: 3, uses: 12, role: 'Drift — visually identical to 4 and 2 at these sizes.' },
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
