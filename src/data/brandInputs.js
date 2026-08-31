/* WHAT A DEFINED BRAND HOLDS — the input taxonomy drawn in the memory hero.
 *
 * THIS IS THE PRODUCT'S SHAPE, NOT AN INVENTORY OF SC-BRAND, and the two must
 * not be confused. Some of these are real files in the working copy today —
 * positioning, voice, proof points, audience, design tokens, decisions. Most
 * are not: there is no lexicon file, no iconography or sound entry, no prompt
 * library, no expiry dates. This is what the platform captures when a brand is
 * fully defined, which is why the window carries a Sample data tag like every
 * other unbuilt surface on this site. The one window that does not need one is
 * the decision record, and it is still on this page further down.
 *
 * THE TAXONOMY IS CHRIS'S, from the design he gave for this window. The counts
 * are derived rather than typed so they cannot drift from the lists.
 */

/* Two columns, in the order the design puts them. */
export const inputColumns = [
  [
    { group: 'Strategy', items: ['Positioning', 'Voice', 'Lexicon', 'Narrative', 'Naming rules'] },
    { group: 'Evidence', items: ['Proof points', 'Objections', 'Audience'] },
    {
      group: 'Design',
      items: ['Tokens', 'Components', 'Iconography', 'Layout', 'Motion', 'Sound', 'Imagery direction', 'Illustration style'],
    },
    {
      group: 'Learned',
      items: ['Decisions', 'Rejections with reasons', 'Exceptions', 'Candidate rules', 'Performance summary'],
    },
  ],
  [
    { group: 'Goals', items: ['Business', 'Brand', 'Campaign', 'Asset-level'] },
    { group: 'Legal', items: ['Approved claims', 'Disclaimers', 'Expiry dates'] },
    { group: 'Language', items: ['Headline patterns', 'Body copy', 'Microcopy', 'Dataviz conventions'] },
    {
      group: 'Operating',
      items: ['Channel specs', 'Agent definitions', 'Prompt library', 'Access rules', 'Provenance'],
    },
  ],
]

export const inputGroups = inputColumns.flat()

export const inputCount = inputGroups.reduce((n, g) => n + g.items.length, 0)
