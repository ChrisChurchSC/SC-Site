/* THE SIX AGENTS, and what each one refuses to do.
 *
 * EVERY "WILL NOT" IS FROM THE AGENT'S OWN DEFINITION, not written to fit a
 * layout. brand-strategist marks a claim it cannot source; comms-writer
 * escalates positioning rather than deciding it; media-strategist marks an
 * unverified rate; design-critic measures rather than opines; sales-analyst
 * produces evidence and hands strategy on; studio-ops passes persuasive
 * prose to comms-writer. The refusals are the product, not boilerplate.
 *
 * In one file because two places draw this roster now — the Agents card on
 * /v3 and the Encode step on a service page — and a refusal that reads one
 * way on the homepage and another way here would undo the point of it.
 *
 * Icons are not here on purpose: each caller picks its own, so this stays
 * data rather than becoming a component that imports components.
 */
export const agents = [
  {
    name: 'brand-strategist',
    does: 'Owns positioning, audience, proof points and the messaging house.',
    wont: 'Invent a claim',
  },
  {
    name: 'comms-writer',
    does: 'Drafts and edits anything the brand says out loud.',
    wont: 'Decide positioning',
  },
  {
    name: 'media-strategist',
    does: 'Plans paid media — channels, budget, flighting and measurement.',
    wont: 'Invent a rate',
  },
  {
    name: 'design-critic',
    does: 'Audits built interfaces against the design system.',
    wont: 'Opine — it measures',
  },
  {
    name: 'sales-analyst',
    does: 'Reads the CRM, transcripts and email for what customers say.',
    wont: 'Infer strategy',
  },
  {
    name: 'studio-ops',
    does: 'Scopes projects, builds proposals and runs the retros.',
    wont: 'Write the pitch',
  },
]
