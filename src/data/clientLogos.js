// The client strip under the showreel.
//
// `logo` is an optional path to a wordmark file in public/logos/. When it is
// absent — which is every entry today, because the repo has no client logo
// files in it — the strip sets the client's NAME as the wordmark instead.
// That is a deliberate fallback rather than a placeholder: a row of names in
// Signifier reads as a client list, where a row of empty boxes reads as a
// broken page.
//
// To light up a real logo: drop an SVG (or transparent PNG) into
// public/logos/, add `logo: '/logos/<file>'` to that entry, and it renders in
// place of the name. No component change. Prefer SVG with a single fill —
// the strip colours logos with currentColor so they inherit the muted-white
// treatment and survive the light-mode invert like everything else.
//
// `slug` links the entry to its case study. Entries without one are still
// shown, just not linked — a client we have worked with but have not written
// up is still a client, and a link to a page that does not exist is worse
// than no link.
export const clientLogos = [
  { name: 'Google',        slug: 'google' },
  { name: 'Arbitrum',      slug: 'arbitrum' },
  { name: 'Smashburger',   slug: 'smashburger' },
  { name: 'World Within',  slug: 'world-within' },
  { name: 'Oxyle',         slug: 'oxyle' },
  { name: 'Heard',         slug: 'heard' },
  { name: 'Entropy',       slug: 'entropy' },
  { name: 'Hylands',       slug: 'hylands' },
  { name: 'Big Buoy',      slug: 'big-buoy' },
  { name: 'Soft Science',  slug: 'soft-science' },
  { name: 'Smallhold',     slug: 'smallhold' },
  { name: 'Transcend',     slug: 'transcend' },
  { name: 'Nimruz',        slug: 'nimruz' },
  { name: 'Path Projects', slug: 'path-projects' },
  { name: 'Zbiotics',      slug: 'zbiotics' },
  { name: 'Photon',        slug: 'photon' },
  { name: 'Offchain',      slug: 'offchain' },
  { name: 'Wonderwerk',    slug: 'wonderwerk' },
  { name: 'J.Jill' },
  { name: 'Talos' },
]
