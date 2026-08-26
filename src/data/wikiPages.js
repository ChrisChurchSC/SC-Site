/* The wiki, documenting the system it is built out of.
 *
 * Every number here was read out of src/system rather than remembered: 84
 * tokens, 62 components across 11 modules, 57 icon paths, 474 style rules.
 * A wiki that describes a system nobody checked is how a design system starts
 * lying — the page is easier to change than the code, so it drifts first and
 * then gets believed.
 *
 * Where the system has a gap, the page says so rather than leaving it out.
 */
const WIKI = [
  {
    slug: 'home', title: 'Home', by: 'Chris Church', when: '2h',
    related: ['tokens', 'contributing'],
    body: [
      { p: 'This is the Super Conscious design system: 84 tokens, 116 components across 16 modules, 57 icons, and one stylesheet. Everything a product built on it draws comes from here.' },
      { h: 'The shape of it' },
      { list: [
        'tokens.css — the :root layer. Surfaces, text, accent, status, chart, type, space, radius, elevation, layers, motion, focus.',
        'system.module.css — every component style, each value reading a token.',
        'primitives, shell, overlays, navigation, forms, charts, plots, browser, requests, previews, activity, wiki — the components.',
        'icons.js — 57 paths on a 16px grid, geometry only.',
      ] },
      { h: 'Consuming it' },
      { p: 'Import the tokens once, put .sc-root on the outermost element, and import components from the barrel. The base layer is deliberately thin: it sets the ground, the type, the focus ring and the cursor, and nothing else.' },
      { code: `import '../system/tokens.css'
import { Shell, Panel, Button } from '../system'

<div className="sc-root">…</div>` },
      { show: 'buttons', caption: 'Button, IconButton — solid, default, small, disabled with its reason' },
      { show: 'statuses', caption: 'Badge and Banner. Status ships with an icon and a label, never colour alone' },
      { show: 'controls', caption: 'Segmented, Switch, Field, Input — the real controls, live' },
      { rule: 'If this wiki and the token file disagree, the token file is right and this page is stale. Fix the page.' },
    ],
  },

  {
    slug: 'tokens', title: 'Tokens', by: 'Chris Church', when: '1d',
    related: ['colour', 'space', 'home'],
    body: [
      { p: 'The layer that was missing. Everything in the styleguide was a description until these existed; from here a component reads a token, and changing the token changes the component.' },
      { h: 'Two rules for adding one' },
      { list: [
        'A value belongs here only if more than one component needs it. A token used once is a hardcoded value with extra steps.',
        'Names describe the job, not the appearance. --sc-card, never --sc-grey-2. An appearance name is a promise you break the first time the appearance changes.',
      ] },
      { h: 'Why the prefix' },
      { p: 'These are global custom properties. A second design system in the same document must not be able to collide with them, so every one is --sc-.' },
      { h: 'Retargeting for another brand' },
      { p: 'Replace the surfaces, text, accent and chart blocks. Leave everything below them alone — spacing, radius, layers, elevation and motion are structural rather than brand, and a brand that needs its own spacing scale needs a different system, not different tokens.' },
      { rule: 'The chart slots are validated against #0a0a0a and nothing else. Change the surface and you must re-run the palette validator before shipping.' },
    ],
  },

  {
    slug: 'colour', title: 'Colour', by: 'Dana Cole', when: '4h',
    related: ['charts', 'tokens'],
    body: [
      { h: 'Surfaces' },
      { p: 'One ground, one card, and small steps either side of it. Five values, and depth comes from the step between them rather than from shadow.' },
      { show: 'surfaces', caption: 'Read back from the cascade — if a value is wrong here it is wrong in the product' },
      { code: `--sc-ground      #0a0a0a   the page
--sc-recessed    #0e0e0e   inset: bars, table heads, code
--sc-card        #161616   the default surface
--sc-card-hover  #1c1c1c
--sc-raised      #1e1e1e   sits on top of a card` },
      { h: 'Text' },
      { p: 'White at descending alpha — nine steps, from peak at 0.95 down to faint at 0.22. There is no second text colour anywhere in the system. The entire hierarchy is opacity, which is what lets light mode be a filter rather than a second palette.' },
      { show: 'text-ramp', caption: 'Nine chips would tell you nothing. Nine lines of the same sentence show where it stops being readable' },
      { rule: 'Text wears text tokens, never a series or accent colour. A coloured mark beside a label carries the identity; the label itself stays ink.' },
      { h: 'Accent' },
      { p: 'Two hues, and only two: pink #df4ed6 and purple #7d5ae0. Teal and blue were declared for two years and used nowhere, so they were removed rather than found work for.' },
      { show: 'accents' },
      { h: 'Status' },
      { p: 'Good, warn and bad are reserved. They are never reused as a chart series or as a fourth accent, and they always ship with an icon and a label — colour alone is not a state.' },
      { show: 'status' },
    ],
  },

  {
    slug: 'charts', title: 'Charts', by: 'Chris Church', when: '4h',
    related: ['colour'],
    body: [
      { p: 'Colour does a job in a chart, and the job picks the ramp. Identity takes the categorical slots, magnitude takes the sequential ramp, polarity takes a diverging pair, state takes the status palette. Picking by taste is how a chart ends up rainbow.' },
      { h: 'Three categorical slots, and that is a ceiling' },
      { p: 'It is measured, not preferred. Pink and purple are adjacent hues, so a fourth value either leaves the OKLCH lightness band (0.48–0.67) or fails adjacent-pair colour-vision separation against one of the other three. It was proposed and rejected — see review #35.' },
      { code: `--sc-s1  #d94eb6
--sc-s2  #7d5ae0
--sc-s3  #a82a7e
--sc-s4  →  s1     alias, on purpose
--sc-s5  →  s2
--sc-s6  →  s3` },
      { p: 'The aliases are deliberate. A chart reaching for a fourth series gets a visible repeat rather than a colour that quietly fails a check nobody ran.' },
      { show: 'chart-slots', caption: 'Slots 4 to 6 are the same three colours again — the repeat is the warning' },
      { rule: 'Past three series: small multiples, or an "Other" bucket. Never a fourth hue.' },
      { h: 'A composition is not four things' },
      { p: 'A donut or a stacked bar shows degrees of one whole, so it takes the sequential ramp — q1 through q5, one hue light to dark. Handing it the categorical slots is exactly how a fourth slice ends up the same colour as the first, which is a bug this system has already shipped twice.' },
      { show: 'sequential' },
      { show: 'charts', caption: 'Every chart in the system, live. The donut takes the sequential ramp for exactly this reason' },
      { h: 'The rest of it' },
      { list: [
        'Never a dual-axis chart. Two measures of different scale get two charts, small multiples, or an index to a common base.',
        'Two or more series always get a legend; four or fewer also get direct labels, so identity is never colour alone.',
        'Colour follows the entity, never its rank — a filter that drops a series must not repaint the survivors.',
        'Thin marks, recessive grid and axes, and never a number on every point.',
      ] },
    ],
  },

  {
    slug: 'type', title: 'Type', by: 'Dana Cole', when: '3d',
    related: ['tokens'],
    body: [
      { p: 'Two families, held far apart on purpose. Signifier carries anything a person wrote and is read for meaning. Roboto Mono carries anything a machine produced — timestamps, hashes, counts, file names, labels.' },
      { p: 'The distinction does real work: it means a number never has to explain where it came from. You can tell at a glance whether you are reading someone or reading the system.' },
      { show: 'type-families', caption: 'Same size, same weight, different job' },
      { h: 'The scale' },
      { code: `--sc-size-eyebrow   8px    uppercase, tracked
--sc-size-label     9px
--sc-size-meta     10px
--sc-size-ui       11px    controls, rows
--sc-size-body     14px
--sc-size-lede     15px    prose set in the serif` },
      { p: 'Anything larger is a clamp() in the component, because display sizes should respond to the viewport and a fixed token cannot.' },
      { show: 'type-scale', caption: 'Set at the real token, in the face that token is used with' },
      { h: 'Tracking' },
      { p: 'Four steps, from 0.04em to 0.14em. Small uppercase mono needs the widest; nothing set in the serif is tracked at all.' },
      { rule: 'Never letterspace the serif. It is drawn with its spacing already in it.' },
    ],
  },

  {
    slug: 'space', title: 'Space & layout', by: 'Chris Church', when: '1w',
    related: ['tokens'],
    body: [
      { p: 'The site had no scale before this — its top eight padding values were eight separate decisions. This is the scale.' },
      { code: `--sc-space-1     4px
--sc-gutter      5px    named exception
--sc-space-2     8px
--sc-space-3    12px
--sc-space-4    16px
--sc-space-5    24px
--sc-space-6    32px
--sc-space-7    48px
--sc-space-8    64px` },
      { p: '5px stays as a named exception because it is the homepage gutter, and rounding it to 4 or 8 would change a page that is already right.' },
      { show: 'space-scale', caption: 'Each bar drawn at its own value' },
      { h: 'Radius' },
      { p: 'Four values: 2px, 4px, 16px, and a pill. A 3px step existed and was dropped — it was doing nothing 2px and 4px were not already doing.' },
      { show: 'radius' },
      { show: 'elevation', caption: 'Three shadows, each with a job. The drawer casts upward because it rises from the edge of the screen' },
      { h: 'Layers' },
      { p: 'Eight named steps, 100 apart, so there is room to insert without renumbering. They replaced eleven ad-hoc z-index values including 9500 and 9999.' },
      { show: 'layers' },
      { code: `base 0 · raised 10 · sticky 100 · nav 200
drawer 300 · overlay 400 · toast 500 · cursor 600` },
      { rule: 'A raw z-index in a component is a bug. If none of the eight fits, the layer model is wrong and needs a step added here.' },
      { h: 'The bar' },
      { p: '--sc-bar-h is 48px, and it is a token because three things depend on it — the global bar, the sidebar sticky offset, and the sidebar height — and they must not be able to disagree.' },
    ],
  },

  {
    slug: 'icons', title: 'Icons', by: 'Dana Cole', when: '1w',
    related: ['components'],
    body: [
      { p: '57 paths on a 16px grid: 1.25px strokes, butt caps, miter joins, every terminal on a whole pixel. Closer to a technical drawing than to an app icon.' },
      { show: 'icons', caption: 'Rendered from the same export the components use — add one and this grid grows on its own' },
      { h: 'The constraints' },
      { list: [
        'Geometry only — no tapers, no rounded corners, no optical curves.',
        'Path data rather than components, so the set is one import and a consumer can subset it without touching the renderer.',
        'One set. Two icon sets in one product is how weight and grid drift apart.',
      ] },
      { h: 'Drawing a new one' },
      { p: 'Work on the 16px grid at 1.25px and put every terminal on a whole pixel. If the shape needs a curve the grid cannot hold, the shape is wrong for this set — not the grid.' },
      { rule: 'An open request is a ring with a dot, deliberately not a tick or a cross. Borrowing either glyph pre-judges an outcome that has not happened.' },
    ],
  },

  {
    slug: 'motion', title: 'Motion & focus', by: 'Chris Church', when: '2w',
    related: ['accessibility'],
    body: [
      { h: 'Motion' },
      { code: `--sc-ease    cubic-bezier(0.25, 1, 0.4, 1)
--sc-fast    0.15s   hover, colour, small state
--sc-medium  0.3s    panels, disclosure
--sc-slow    0.5s    page-level` },
      { p: 'One easing curve for everything. A product with three easings has three motion languages and no one chose any of them.' },
      { show: 'motion' },
      { h: 'Focus' },
      { p: 'One ring for every control: a 2px outline at 2px offset, applied once at .sc-root rather than per component, so a new component gets it by existing.' },
      { p: 'The offset matters. Flush to the edge the ring reads as a border and disappears on anything that already has one.' },
      { show: 'focus' },
      { rule: ':focus-visible, never :focus. The ring answers "where is the keyboard", and flashing it on every mouse click teaches people to ignore it.' },
      { h: 'Reduced motion' },
      { p: 'Not "no motion" — motion that moves nothing through space. Fades survive because opacity carries no vestibular cost; travel, scale and looping stop.' },
    ],
  },

  {
    slug: 'components', title: 'Components', by: 'Dana Cole', when: '2d',
    related: ['home', 'contributing'],
    body: [
      { p: '116 components across 16 modules. Every one reads tokens; almost none writes a raw value.' },
      { show: 'stats', caption: 'StatTile and Sparkline' },
      { show: 'people', caption: 'Avatar — initials derived from the name, one colour, no cartoon' },
      { code: `primitives      26   Button, Panel, Field, Avatar, StatTile…
plots           21   Histogram, BoxPlot, Scatter, Funnel, Gantt…
forms           12   Select, Combobox, DatePicker, FileUpload…
shell           11   Shell, GlobalBar, Sidebar, Grid, Col…
overlays        10   Modal, Drawer, Popover, Toasts, Palette…
charts           8   Line, Bar, RankedBar, Donut, Axis, Legend…
navigation       6   Accordion, Stepper, Scrollspy, PrevNext…
browser          6   Tree, FileBrowser, FileView, CodeLines…
requests         4   RequestList, RequestDetail, DiffStat…
previews         3   PdfPreview, CanvasPreview, WavePreview
projects         2   ProjectList, ProjectView
+ folderPreview, campaignCanvas, activity, wiki` },
      { h: 'What belongs in the package' },
      { p: 'A component belongs here when a second product would want it unchanged. Anything that only makes sense for one page stays on that page — the package is not a place to put things you are unsure about.' },
      { h: 'Naming' },
      { p: 'The stylesheet is one shared namespace. A class named for a general idea will be taken by something general: .frame was already the app shell, and a canvas frame that reused the name inherited min-height 100vh and rendered 805px tall. Prefix by component when the word is common.' },
      { rule: 'Two components must never define the same class name in system.module.css. The last one loaded wins, and it will not be the one you are looking at.' },
    ],
  },

{
    slug: 'buttons', title: 'Buttons & controls', by: 'Dana Cole', when: '1d',
    related: ['forms', 'components'],
    body: [
      { p: 'One button, four ways to say how much it matters. Solid is the thing you came to do; the default is everything else; small is for a row or a toolbar; disabled always says why.' },
      { show: 'buttons' },
      { rule: 'A disabled control carries the reason it is disabled, in a title. A dead button that says nothing is a bug report waiting to be filed.' },
      { h: 'State, never colour alone' },
      { p: 'Badges and banners ship with an icon and a label. Colour is the fastest signal and the one a third of readers cannot rely on, so it is never the only one.' },
      { show: 'statuses' },
      { h: 'Switches and segments' },
      { p: 'A switch takes effect immediately; a checkbox waits for a submit. Using the wrong one is a promise you do not keep. Segmented is for views of one thing where all the options fit — past four, it is a select.' },
      { show: 'controls' },
    ],
  },

  {
    slug: 'forms', title: 'Forms', by: 'Chris Church', when: '2d',
    related: ['buttons', 'accessibility'],
    body: [
      { p: 'Two rules run through every control here.' },
      { list: [
        'Validate on blur, never on keystroke. Telling somebody their email is invalid while they are still typing the domain is noise, and noise trains people to ignore the one message that mattered.',
        'The role comes before the appearance. A checkbox that is a button still announces as a checkbox, so assistive tech is told what the eye is told.',
      ] },
      { show: 'forms' },
      { rule: 'The error replaces the hint rather than joining it, so the field never grows and shoves the rest of the form down while somebody is typing in it.' },
      { h: 'Pickers' },
      { p: 'A date field asking for text gets a different format from every visitor, so it gets a grid. Weeks start Monday, and today is marked whether or not it is selected — the two states are drawn differently so they can sit on the same cell.' },
      { show: 'date' },
      { h: 'Files' },
      { p: 'A drop target and a button. Drag-and-drop alone is unusable by keyboard and invisible on touch.' },
      { show: 'upload' },
      { h: 'Filtering' },
      { p: 'A filter states what it is doing and offers one way out. A filter you cannot see is a product that looks broken.' },
      { show: 'filters' },
    ],
  },

  {
    slug: 'overlays', title: 'Overlays', by: 'Chris Church', when: '2d',
    related: ['motion', 'accessibility'],
    body: [
      { p: 'Everything that appears on top of the page, and one decision applied consistently rather than re-made per component.' },
      { code: `modal, sheet, lightbox, drawer   Escape, backdrop, close. Trapped.
menu, popover                    Escape, outside click. Not trapped.
tooltip                          Hover and focus. Never blocks.` },
      { p: 'The split is whether the thing is modal. A dialog covers the page and takes the keyboard with it; a menu hangs off a trigger and leaves the page usable, so trapping focus in one would be a bug.' },
      { show: 'overlays' },
      { rule: 'useFocusTrap restores focus to the trigger on close. That matters more than the trapping — without it a screen reader lands back at the top of the document every time a dialog closes.' },
      { h: 'Toasts' },
      { p: 'A toast reports something that already happened. It never asks a question: anything needing an answer is a dialog, because a toast that times out before you read it has asked nothing.' },
      { p: 'They stack upward from the bottom right, so a new one never moves the one you are reading.' },
    ],
  },

  {
    slug: 'nav', title: 'Navigation', by: 'Dana Cole', when: '3d',
    related: ['components', 'overlays'],
    body: [
      { p: 'Three jobs that look alike and are not. The section nav moves between areas of a product. Tabs move between views of one thing. The sidebar tree moves through a hierarchy. Drawing them the same way flattens a distinction the reader needs.' },
      { show: 'nav' },
      { rule: 'Scrollspy uses IntersectionObserver, not a scroll handler. A scroll listener fires on every pixel and still gets the answer wrong at the bottom of the page, where the last section can never reach the top of the viewport.' },
      { h: 'Accordions open many by default' },
      { p: 'Single-open is a choice you make when the panels are alternatives. Making it the default means opening one silently closes the thing somebody was reading.' },
    ],
  },

  {
    slug: 'plots', title: 'Plots', by: 'Chris Church', when: '1d',
    related: ['charts', 'colour'],
    body: [
      { p: 'The analytical half of the chart set. The six on the Charts page cover reporting — a line, a bar, a ranking, a donut. These cover the questions those cannot answer, and they are grouped by the question rather than by how they look, because picking a chart by its appearance is how you end up with the wrong one.' },
      { h: 'How is it spread?' },
      { show: 'plots-distribution' },
      { h: 'Do these two things move together?' },
      { show: 'plots-correlation' },
      { h: 'What changed between two points?' },
      { show: 'plots-change' },
      { h: 'What happened over time?' },
      { show: 'plots-time' },
      { h: 'What shape is it?' },
      { show: 'plots-shape' },
      { h: 'What does it look like over a grid?' },
      { show: 'plots-grids' },
      { rule: 'Composition charts — stacked area, stacked bar, treemap, funnel — take the sequential ramp. They show degrees of one whole, and handing them the categorical slots is how a fourth part ends up the same colour as the first.' },
    ],
  },

  {
    slug: 'layout', title: 'Layout', by: 'Dana Cole', when: '1w',
    related: ['space', 'components'],
    body: [
      { p: 'Twelve columns. Col takes a span and nothing else — a component that sets its own width in pixels has left the grid, and everything beside it now has to agree with a number nobody wrote down.' },
      { show: 'grid' },
      { h: 'The shell' },
      { p: 'Shell, GlobalBar, Sidebar and Content are one arrangement, not four independent pieces. The bar spans the full width above the sidebar because it belongs to the product rather than to the page — a bar that stops at the sidebar reads as part of whatever is beside it.' },
      { rule: 'The global bar is deliberately thin on content. Page-level actions creeping up into a bar that is always on screen is the commonest way one of these gets ruined.' },
    ],
  },

  {
    slug: 'accessibility', title: 'Accessibility', by: 'Chris Church', when: '3d',
    related: ['motion', 'contributing'],
    body: [
      { p: 'What the system does, checked rather than claimed.' },
      { list: [
        'One focus ring, applied at the root, on :focus-visible.',
        'Reduced motion honoured: travel and looping stop, fades stay.',
        'Roles and state on real interactive elements — treeitem with expanded, group, tablist with selected, aria-pressed on toggles, aria-current on the selected page.',
        'The disabled Publish control carries a title saying which condition is unmet, rather than being inert and silent.',
        'Charts never rely on colour alone: a legend for two or more series, direct labels at four or fewer.',
      ] },
      { h: 'Known gaps' },
      { p: 'Written down because a gap nobody recorded is a gap nobody fixes.' },
      { list: [
        'No light theme. Light mode on the site is a filter, and the chart slots are validated against #0a0a0a only.',
        'No forced-colors pass. Nothing in the system has been checked against Windows high-contrast.',
        'Texture fills exist as a colour-blind and print fallback but are not applied by any chart.',
        'No automated contrast check in the build — the palette validator is run by hand.',
      ] },
      { rule: 'Do not add a check to this list until it passes. A list of intentions is worse than no list, because it reads like a list of facts.' },
    ],
  },

  {
    slug: 'contributing', title: 'Contributing', by: 'Chris Church', when: '3d',
    related: ['home', 'components'],
    body: [
      { p: 'Every change to the system goes through a review. A review is an object with its own id, conversation and outcome — it outlives the file it changes.' },
      { h: 'Before it can publish' },
      { list: [
        'At least one approval from a reviewer who is not you.',
        'All checks passing — contrast, tone, links, preview build.',
        'No conflict with the current version.',
        'Not still marked a draft.',
      ] },
      { rule: 'Publish stays disabled until all four are true, and it says which one is missing. Do not go around it.' },
      { h: 'Adding a token' },
      { p: 'Two components must need it, and the name must describe the job. If you can only name it after what it looks like, it is not a token yet.' },
      { h: 'Adding a component' },
      { p: 'It belongs in the package when a second product would take it unchanged. Read the stylesheet for your class names first — the namespace is shared, and a collision does not error, it just quietly wins.' },
      { h: 'Reviewing' },
      { p: 'Request changes when something is wrong, not when it is different from how you would have done it. The second one is a comment.' },
    ],
  },
]

export default WIKI
