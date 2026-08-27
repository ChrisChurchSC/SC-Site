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
 * `twitter:image` had no replacer at all, so it stayed pinned to the default
 * while og:image was rewritten — invisible until per-page images shipped,
 * because both happened to hold the same GIF.
 *
 * @param {string} html
 * @param {object} meta
 * @param {string} meta.title
 * @param {string} meta.description
 * @param {string} meta.url
 * @param {string} meta.image
 * @param {string} [meta.imageAlt]      alt for the social card image
 * @param {'website'|'article'} [meta.type]
 * @param {string} [meta.publishedTime] ISO date; emits article:published_time
 * @param {string} [meta.modifiedTime]  ISO date; emits article:modified_time
 */
export function injectMeta(html, { title, description, url, image, imageAlt, type, publishedTime, modifiedTime }) {
  const t = esc(title)
  const d = esc(description)
  const u = esc(url)
  const img = esc(image)
  const alt = imageAlt ? esc(imageAlt) : t

  let out = html
    .replace(/(<title>)[^<]*(<\/title>)/, (_m, open, close) => open + t + close)
    .replace(/(<meta name="description" content=")[^"]*"/, (_m, p) => p + d + '"')
    .replace(/(<link rel="canonical" href=")[^"]*"/, (_m, p) => p + u + '"')
    .replace(/(<meta property="og:url" content=")[^"]*"/, (_m, p) => p + u + '"')
    .replace(/(<meta property="og:title" content=")[^"]*"/, (_m, p) => p + t + '"')
    .replace(/(<meta property="og:description" content=")[^"]*"/, (_m, p) => p + d + '"')
    .replace(/(<meta property="og:image" content=")[^"]*"/, (_m, p) => p + img + '"')
    .replace(/(<meta property="og:image:alt" content=")[^"]*"/, (_m, p) => p + alt + '"')
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, (_m, p) => p + t + '"')
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, (_m, p) => p + d + '"')
    .replace(/(<meta name="twitter:image" content=")[^"]*"/, (_m, p) => p + img + '"')

  if (type) {
    // Consume the WHOLE tag, not just its content attribute. Appending the
    // article:* tags inside the value — or before the closing `/>` — produces
    // `content="article" <meta property="article:published_time" …/> />`,
    // which the tokenizer reads as attributes, pops </head>, and relocates the
    // rest of the document into <body>.
    const extra = [
      publishedTime && `<meta property="article:published_time" content="${esc(publishedTime)}" />`,
      modifiedTime && `<meta property="article:modified_time" content="${esc(modifiedTime)}" />`,
    ].filter(Boolean)

    out = out.replace(
      /<meta property="og:type" content="[^"]*"\s*\/?>/,
      () => [`<meta property="og:type" content="${esc(type)}" />`, ...extra].join('\n    '),
    )
  }

  return out
}
