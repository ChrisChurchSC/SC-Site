/**
 * Case studies that are published in Sanity but deliberately not surfaced.
 *
 * Hidden from the nav and work drawer since 2026-06-01 (b8f83a3). They stay
 * published so their URLs keep resolving for anyone holding a direct link —
 * they are simply not offered to visitors, and not offered to Google either.
 *
 * This lives outside Nav.jsx because the decision is not a navigation detail.
 * It was a `HIDDEN_SLUGS` constant inside that one component, invisible to the
 * build, so when the prerender started taking its route list from Sanity these
 * two were treated as ordinary case studies and submitted to the sitemap —
 * putting client work in front of Google that somebody had chosen to take
 * down. Anything that decides whether a page is public has to be readable by
 * the thing that generates the sitemap.
 */
export const HIDDEN_SLUGS = new Set(['webroot', 'carbonite'])
