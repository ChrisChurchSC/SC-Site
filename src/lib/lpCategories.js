/**
 * The four groups the 22 /lp pages fall into.
 *
 * This list existed in three places, and they had already drifted: the /lp
 * index called the fourth group "Cross-vertical" while the prerender's
 * BreadcrumbList JSON-LD and llms.txt both called it "Hiring a Studio". Google
 * has been told "Hiring a Studio" since those breadcrumbs shipped, so that is
 * the name that survives consolidation — changing it would move a live signal
 * to match a page that is noindexed.
 *
 * Plain ESM with no JSX and no import.meta.env, so scripts/prerender-meta.mjs
 * can `await import` it directly the way it already imports mockLandingPages.js.
 *
 * Order is meaningful: it is the order the groups render in, on /lp, on /about,
 * and in llms.txt.
 */
export const LP_CATEGORIES = [
  {
    label: 'Brand Systems',
    slugs: [
      'what-does-a-brand-system-include',
      'how-long-does-a-brand-system-take',
      'brand-system-cost',
      'brand-guidelines-vs-brand-system',
      'when-to-invest-in-a-brand-system',
      'what-is-a-verbal-identity',
      'brand-consistency-across-a-team',
    ],
  },
  {
    label: 'Content Programs',
    slugs: [
      'what-is-a-content-program',
      'how-to-build-a-b2b-content-program',
      'content-program-cost',
      'how-long-until-content-marketing-works',
      'what-is-a-thought-leadership-program',
      'how-to-measure-a-content-program',
    ],
  },
  {
    label: 'Digital Products',
    slugs: [
      'what-does-a-digital-product-design-engagement-include',
      'how-much-does-product-design-cost',
      'how-long-to-design-a-web-app',
      'design-system-vs-brand-system',
      'what-to-look-for-in-a-product-design-studio',
    ],
  },
  {
    label: 'Hiring a Studio',
    slugs: [
      'brand-or-content-first',
      'do-i-need-a-brand-system-before-content',
      'creative-studio-vs-freelancer',
      'what-to-ask-a-creative-agency',
    ],
  },
]

/** slug → category label, for the /lp BreadcrumbList in the prerender. */
export const LP_CATEGORY = Object.fromEntries(
  LP_CATEGORIES.flatMap(({ label, slugs }) => slugs.map(slug => [slug, label])),
)
