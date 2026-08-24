// The featured case study section on the homepage.
//
// ─────────────────────────────────────────────────────────────────────────
// THE STAT VALUES BELOW ARE PLACEHOLDERS. DO NOT SHIP THEM.
//
// The four labels are the client's and are final. Every `value` is "––" on
// purpose: there is no source for these numbers
// anywhere in the repo or in Sanity — the `project` schema has no stats
// field, and caseStudies.js carries qualitative `outcomes`, not metrics.
// Inventing plausible-looking figures and attributing them to four named
// companies is the one thing this file must not do, so it doesn't: the
// layout is real and the numbers are visibly absent.
//
// Replace `value` and `label` per entry and the section is finished. The
// component renders whatever is in `stats`, so a client with three stats
// instead of four just renders three.
// ─────────────────────────────────────────────────────────────────────────
//
// On media: none of these four has an image or video anywhere. The project
// documents in Sanity have no media field at all (fields are: comingSoon,
// descriptor, name, order, password, published, relationship, slug, type,
// year) and none appears in BLOCK_MAP or the homepageGrid blocks. Add a
// `media` path — a file in public/, same as the wall uses — and the card
// fills. Without one it renders as a card carrying the name, which is
// deliberate rather than broken.
//
// On linking: `href` is null where there is nothing to link to, and the
// component renders those as unlinked cards. Matching how the wall, the nav
// and the client strip already treat unwritten or hidden work.

// The measures, same set across all four case studies so the section reads
// as one comparable table rather than four unrelated brag sheets. Three now;
// Time to market came out because it is the one of the four that says
// nothing about whether the work performed.
// Labels are final. Values are not — see the warning above.
const PLACEHOLDER = [
  { value: '––', label: 'Audience growth' },
  { value: '––', label: 'SQL growth' },
  { value: '––', label: 'Win rate' },
]

export const featuredCaseStudies = [
  {
    slug: 'opentext',
    name: 'OpenText',
    type: 'Brand + Campaign',
    // published:false in Sanity and no page is built for it. FOLLOWUPS.md
    // records that OpenText was deliberately removed from the sitemap, so
    // featuring it on the homepage is a decision to reverse that, not an
    // oversight to fix in code.
    href: null,
    media: null,
    stats: PLACEHOLDER,
  },
  {
    slug: 'iscribe',
    name: 'iScribe',
    type: 'Brand + Content',
    // Does not exist in projects.js, in Sanity, or as a page. Featured here
    // because it was asked for; there is nothing behind it yet.
    href: null,
    media: null,
    stats: PLACEHOLDER,
  },
  {
    slug: 'arbitrum',
    name: 'Arbitrum',
    type: 'Brand + Content',
    // comingSoon:true in Sanity — shown but not linked everywhere else on
    // the site. Left unlinked here for the same reason.
    href: null,
    media: null,
    stats: PLACEHOLDER,
  },
  {
    slug: 'smashburger',
    name: 'Smashburger',
    type: 'Brand + Content',
    // comingSoon:true in Sanity — its page builds but is noindexed and absent
    // from the sitemap, so it is shown and not linked, the same treatment
    // Arbitrum gets here and the wall, the nav and the client strip already
    // give it. It was already on the homepage in the client strip; this puts
    // it in the featured set too.
    href: null,
    media: null,
    stats: PLACEHOLDER,
  },
  {
    slug: 'world-within',
    name: 'World Within',
    type: 'Brand + Content',
    // Checked rather than assumed: published:true and comingSoon:false in
    // Sanity, the page builds, it is indexable and it is in the sitemap. So
    // it links, which makes it the second of these cards with anywhere to go.
    href: '/work/world-within',
    media: null,
    stats: PLACEHOLDER,
  },
  {
    slug: 'wonderwerk',
    name: 'Wonderwerk',
    type: 'Brand + Content',
    // The only one of the four with a real, reachable case study page.
    href: '/work/wonderwerk',
    // A 9s cut of the case study's own delivered assets — wordmark, posters,
    // packaging, social, identity, web, 3D, and the tagline to land on. Built
    // at 16:9 from the seven assets that were already 16:9 plus five moments
    // pulled from the films, so nothing in it is a portrait frame squeezed
    // into a landscape one. LazyVideo means it costs nothing until the card
    // is near the viewport.
    media: '/wonderwerk-montage-compressed.mp4',
    stats: PLACEHOLDER,
  },
]
