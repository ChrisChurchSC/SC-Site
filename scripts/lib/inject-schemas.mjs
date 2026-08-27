/**
 * JSON-LD injection for the prerender.
 *
 * Extracted from prerender-meta.mjs alongside inject-meta.mjs, and for the
 * same reason: importing that file to test it would run the whole prerender
 * as a side effect.
 */

/**
 * Append JSON-LD `<script>` blocks to the end of `<head>`.
 *
 * Two things here are load-bearing rather than stylistic.
 *
 * **The replacement is a function, not a template string.** This is the same
 * class of bug inject-meta.mjs documents at length: `String.prototype.replace`
 * runs $-substitution over a *string* replacement even when the search pattern
 * is a plain string, so `$&` expands to the whole match, `` $` `` and `$'` to
 * the text around it, and `$$` to a single `$`. That already shipped once here
 * — a `$150,000` in landing-page copy expanded `$1` into a capture group and
 * nested a `<meta>` inside an attribute.
 *
 * It has been latent in this injector only because the schemas it saw were
 * built from hardcoded MOCK_PAGES copy. The moment editor-controlled Sanity
 * prose reaches it, a `$'` in one FAQ answer duplicates the entire document
 * body into `<head>`:
 *
 *   '<head>A</head><body>TAIL</body>'.replace('</head>', "X$'Y</head>")
 *   → '<head>AX<body>TAIL</body>Y</head><body>TAIL</body>'
 *
 * and an `A$&B` writes a literal `</head>` into the middle of the script,
 * closing the head early. Neither throws, and no gate in this repo reads far
 * enough into a tag to notice.
 *
 * **`<` is escaped to a `\u003c` sequence.** JSON.stringify does not escape
 * it, so an answer containing `</script>` would otherwise terminate the block
 * and the rest of the schema would render as body text. The escape is valid
 * JSON and parses back to `<`, so consumers — including
 * tests/baseline/capture.mjs, which JSON.parses these blocks — see the
 * original string.
 *
 * Falsy entries are dropped so callers can build the array with conditional
 * slots (`cond && {...}`) instead of assembling it imperatively.
 *
 * @param {string} html
 * @param {Array<object|null|undefined|false>} schemas
 * @returns {string}
 */
export function injectSchemas(html, schemas) {
  const list = (schemas || []).filter(Boolean)
  if (!list.length) return html

  const scripts = list
    .map(s => `<script type="application/ld+json">${serializeSchema(s)}</script>`)
    .join('\n    ')

  return html.replace('</head>', () => `    ${scripts}\n  </head>`)
}

/** JSON for a `<script>` context: `<` escaped so nothing can close the tag. */
export function serializeSchema(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}
