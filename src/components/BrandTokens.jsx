import styles from './BrandTokens.module.css'
import FlowDiagram from './FlowDiagram'
import { serviceBySlug } from '../data/services'

/**
 * THE PLATFORM DIAGRAM — the section on both service pages.
 *
 * Build calls it "what a brand is made of"; Grow calls it what the brand
 * shows up as every month. Same diagram, same left column, same repo in the
 * middle — only the right column changes, because that is the one thing that
 * genuinely differs: it is the service's own pillars out of services.js.
 *
 * THE DIAGRAM DOES THE WORK. An earlier version laid the eight groups out as
 * eight loose cards, which was a second design of something the site already
 * had: InputsWindow draws exactly these groups, in chrome, and it takes a
 * ratio. Both it and src/data/brandInputs.js were deleted with the platform
 * and are restored here, because neither was ever really about the platform —
 * the taxonomy is what a defined brand holds, which is what a page selling a
 * Build owes a reader.
 *
 * 16:9 BECAUSE IT IS A SCREEN. The groups scroll inside the frame rather than
 * setting its height, so the section holds one shape instead of growing with
 * the taxonomy.
 *
 * THE GROUPS AND EVERY TOKEN IN THEM ARE CHRIS'S, verbatim.
 *
 * READ THE NOTE IN brandInputs.js BEFORE QUOTING THIS AS AN INVENTORY. It
 * says plainly that this is the product's shape, not a list of files in
 * SC-Brand: positioning, voice, proof points, audience, design tokens and
 * decisions are real today; a lexicon file, iconography, sound, a prompt
 * library and expiry dates are not. It describes what a Build defines, which
 * is not the same as a claim about what already exists.
 *
 * BRAND IS CUT FROM "WHAT YOU GET" BECAUSE OF THIS SECTION. The two were
 * listing the same deliverables a screen apart; see the note in
 * PlatformOutputs.jsx.
 *
 * THE INTRO LINE IS MINE AND UNAPPROVED — and it is a swipe at the field, so
 * whether it stays is Chris's call.
 */
/* WHAT COMES OUT — Build's own pillars, mapped the way ServiceV3 used to map
   them before the diagram was cut: a pillar that names its own outputs uses
   those, and the rest fall back to their first three deliverables, which read
   as outputs already. Chris's names, unchanged, out of services.js. */
const outputsFor = (slug) => (serviceBySlug(slug)?.pillars ?? []).map(
  ({ name, items, outputs, media, status }) => ({
    name,
    media,
    status,
    items: (outputs ?? items).slice(0, 3),
  }),
)

export default function BrandTokens({
  slug = 'build',
  eyebrow = '[ Brand platform ]',
  headline = 'What a brand is made of.',
  intro = 'Everything the brand is made of goes into one place, and everything it makes comes out of it — so the next piece of work starts from the thing itself rather than from a summary of it.',
  /* Build draws the default diagram: what a brand is made of, the system in
     the middle, its pillars coming out. Grow draws a different sentence with
     the same component — the platform, the content it produces, the dashboard
     that reads it — so it passes its own three slots. */
  inputs,
  centreVisual,
  outputsVisual,
}) {
  const OUTPUTS = outputsFor(slug)

  return (
    <section className={styles.section} aria-labelledby="brand-tokens">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline} id="brand-tokens">{headline}</h2>
      <p className={styles.intro}>{intro}</p>

      <div className={styles.stage}>
        <FlowDiagram
          centre="Visual"
          outputs={OUTPUTS}
          inputs={inputs}
          centreVisual={centreVisual}
          outputsVisual={outputsVisual}
        />
      </div>
    </section>
  )
}
