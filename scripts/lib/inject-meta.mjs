/**
 * Per-route <head> rewriting for the prerender.
 *
 * Extracted from prerender-meta.mjs so it can be tested directly — importing
 * that file would run the whole prerender as a side effect.
 */

/** Escape a value for use inside a double-quoted HTML attribute or a text node. */
export function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Rewrite the title, description, canonical and social tags for one route.
 *
 * Every replacement here uses a FUNCTION replacer, never a template string.
 * That is load-bearing, not style.
 *
 * `String.prototype.replace` runs $-substitution over a *string* replacement:
 * `$1`-`$9` expand to capture groups, `$&` to the whole match, `` $` `` and
 * `$'` to the surrounding text. The injected value is site copy, so any of
 * those sequences appearing in a title or description is interpreted as a
 * backreference instead of being written out.
 *
 * This shipped. `/lp/how-much-does-product-design-cost` answers with the price
 * `$150,000`; the `$1` expanded to capture group 1 — the opening
 * `<meta name="description" content="` — producing a nested tag and a
 * description truncated at "$40,000–". og: and twitter: were corrupted the
 * same way. It went unnoticed because the sibling pricing pages quote
 * `$25,000` and `$80,000`, and `$2`/`$8` match no group in a one-group regex,
 * so they pass through untouched. The bug only bites on `$1`, and only until
 * someone writes a second capture group or a price starting `$2`.
 *
 * A function replacer receives the groups as arguments and performs no
 * substitution on what it returns, which removes the whole class.
 *
 * @param {string} html
 * @param {{title: string, description: string, url: string, image: string}} meta
 */
export function injectMeta(html, { title, description, url, image }) {
  const t = esc(title)
  const d = esc(description)
  const u = esc(url)
  const img = esc(image)

  return html
    .replace(/(<title>)[^<]*(<\/title>)/, (_m, open, close) => open + t + close)
    .replace(/(<meta name="description" content=")[^"]*"/, (_m, p) => p + d + '"')
    .replace(/(<link rel="canonical" href=")[^"]*"/, (_m, p) => p + u + '"')
    .replace(/(<meta property="og:url" content=")[^"]*"/, (_m, p) => p + u + '"')
    .replace(/(<meta property="og:title" content=")[^"]*"/, (_m, p) => p + t + '"')
    .replace(/(<meta property="og:description" content=")[^"]*"/, (_m, p) => p + d + '"')
    .replace(/(<meta property="og:image" content=")[^"]*"/, (_m, p) => p + img + '"')
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, (_m, p) => p + t + '"')
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, (_m, p) => p + d + '"')
}
