/* WHAT A DEFINED BRAND HOLDS — the input taxonomy, in one place.
 *
 * THE EIGHT GROUPS AND EVERY ITEM IN THEM ARE CHRIS'S, verbatim. They were
 * living inside InputsWindow.jsx; they are here now because three things draw
 * them — the memory hero, the Define card, and Build's "Define" step — and a
 * list copied into three files is a list that will disagree with itself.
 *
 * THE ORDER IS THE ONE THE WINDOW RENDERS IN: a two-column grid filled row by
 * row, so this sequence puts Strategy, Evidence, Design and Learned down the
 * left and Goals, Legal, Language and Operating down the right. Reordering
 * this array moves boxes on the page.
 *
 * THIS IS THE PRODUCT'S SHAPE, NOT AN INVENTORY OF SC-BRAND, and the two must
 * not be confused. Some of these are real files in the working copy today —
 * positioning, voice, proof points, audience, design tokens, decisions. Most
 * are not: there is no lexicon file, no iconography or sound entry, no prompt
 * library, no expiry dates. It is what the platform captures when a brand is
 * fully defined.
 */
export const inputGroups = [
  { name: 'Strategy', items: ['Positioning', 'Voice', 'Lexicon', 'Narrative', 'Naming rules'] },
  { name: 'Goals', items: ['Business', 'Brand', 'Campaign', 'Asset-level'] },
  { name: 'Evidence', items: ['Proof points', 'Objections', 'Audience'] },
  { name: 'Legal', items: ['Approved claims', 'Disclaimers', 'Expiry dates'] },
  {
    name: 'Design',
    items: ['Tokens', 'Components', 'Iconography', 'Layout', 'Motion', 'Sound', 'Imagery direction', 'Illustration style'],
  },
  { name: 'Language', items: ['Headline patterns', 'Body copy', 'Microcopy', 'Dataviz conventions'] },
  {
    name: 'Learned',
    items: ['Decisions', 'Rejections with reasons', 'Exceptions', 'Candidate rules', 'Performance summary'],
  },
  {
    name: 'Operating',
    items: ['Channel specs', 'Agent definitions', 'Prompt library', 'Access rules', 'Provenance'],
  },
]

export const inputCount = inputGroups.reduce((n, g) => n + g.items.length, 0)
