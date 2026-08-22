/**
 * Legacy URLs from the pre-rebuild site, and where they now live.
 *
 * The April 2026 rebuild (60884b1) moved every case study from a flat
 * `/<slug>` to `/work/<slug>` and shipped no redirects. The old URLs kept
 * their rankings for a while — Google was still showing them 2,934 times in
 * the two months to May 29 — and returned a soft 404 (200 + an SPA "not
 * found" shell) until 5ba731d made them hard 404s on June 15, at which point
 * they started dropping out of the index in earnest. By July they were down
 * to 265 impressions.
 *
 * These are the URLs Search Console still had impressions for, which is the
 * list that matters: an unindexed URL cannot leak traffic.
 *
 * This map is the single source of truth. `vercel.json` carries the deployed
 * copy because Vercel needs static JSON, and tests/seo/redirects.test.mjs
 * asserts the two agree — otherwise a hand-edit to either one drifts silently.
 */

export const LEGACY_REDIRECTS = {
  // Case studies — flat slug to /work/<slug>. Same slug on both sides.
  '/smallhold': '/work/smallhold',
  '/heard': '/work/heard',
  '/world-within': '/work/world-within',
  '/transcend': '/work/transcend',
  '/photon': '/work/photon',
  '/print-parlor': '/work/print-parlor',
  '/path-projects': '/work/path-projects',
  '/yura': '/work/yura',
  '/tbt': '/work/tbt',
  '/gigs': '/work/gigs',
  '/industry-standard': '/work/industry-standard',

  // Renamed rather than moved. `/marketing-dept` matched the page now titled
  // "Arbitrum — Marketing Dept Videos"; `/gigs-characters` was part of the
  // Gigs engagement and has no page of its own, so it folds into the parent.
  '/marketing-dept': '/work/arbitrum-marketing-dept-videos',
  '/gigs-characters': '/work/gigs',

  // Renamed in August 2026: the Capabilities page became Services and moved
  // off /about. Not a pre-rebuild legacy URL like the rest of this map, but it
  // is the same problem — a live, indexed URL that must not start 404ing — and
  // this map is what vercel.json is checked against, so it belongs here.
  '/about': '/services',

  // Thought post, moved under /thoughts/.
  '/rethinking-the-workweek': '/thoughts/rethinking-the-workweek',
}
