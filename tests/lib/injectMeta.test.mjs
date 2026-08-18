import assert from 'node:assert/strict'
import test from 'node:test'

import { esc, injectMeta } from '../../scripts/lib/inject-meta.mjs'

const HEAD = `<!doctype html><html><head>
<title>Super Conscious</title>
<meta name="description" content="placeholder" />
<link rel="canonical" href="https://super-conscious.studio/" />
<meta property="og:url" content="https://super-conscious.studio/" />
<meta property="og:title" content="placeholder" />
<meta property="og:description" content="placeholder" />
<meta property="og:image" content="placeholder" />
<meta name="twitter:title" content="placeholder" />
<meta name="twitter:description" content="placeholder" />
</head><body></body></html>`

const render = (over = {}) =>
  injectMeta(HEAD, {
    title: 'T',
    description: 'D',
    url: 'https://super-conscious.studio/x',
    image: 'https://super-conscious.studio/reel-preview.gif',
    ...over,
  })

const attr = (html, re) => html.match(re)?.[1]
const DESC = /<meta name="description" content="([^"]*)"/
const TITLE = /<title>([^<]*)<\/title>/

test('the shipped bug: a price containing $1 is written literally', () => {
  // /lp/how-much-does-product-design-cost. The $1 used to expand to capture
  // group 1 — the opening meta tag — nesting a second <meta> inside content.
  const description = 'A focused product design engagement typically runs $40,000–$150,000 depending on scope.'
  const html = render({ description })

  assert.equal(attr(html, DESC), description)
  assert.ok(!attr(html, DESC).includes('<meta'), 'description must not contain a nested tag')
})

test('exactly one of each head tag survives injection', () => {
  const html = render({ description: 'Ranges from $150,000 to $180,000.' })
  const count = (re) => (html.match(re) || []).length

  assert.equal(count(/<meta name="description"/g), 1)
  assert.equal(count(/<title>/g), 1)
  assert.equal(count(/<link rel="canonical"/g), 1)
  assert.equal(count(/<meta property="og:description"/g), 1)
})

test('every $-substitution token is inert in a description', () => {
  // $& (whole match), $` (before), $' (after), $$ (literal $) and $1-$9 are
  // all special to a STRING replacement. A function replacer neutralises all
  // of them, so assert the whole class rather than the one that broke.
  for (const token of ['$1', '$2', '$9', '$&', '$`', "$'", '$$']) {
    const description = `Prices from ${token} upward.`
    // Compared against esc(), not the raw string: `$&` legitimately contains
    // an ampersand, which must still be escaped. What must not happen is the
    // token being consumed as a backreference.
    assert.equal(attr(render({ description }), DESC), esc(description), `token ${token}`)
  }
})

test('$-substitution is inert in a title too', () => {
  // <title> is matched with TWO capture groups, so it is exposed to $1 AND $2.
  const title = 'What $1,000 and $2,000 buy'
  assert.equal(attr(render({ title }), TITLE), title)
})

test('a $ in a URL does not corrupt the canonical', () => {
  const url = 'https://super-conscious.studio/lp/$1-pricing'
  const html = render({ url })
  assert.equal(attr(html, /<link rel="canonical" href="([^"]*)"/), url)
  assert.equal(attr(html, /<meta property="og:url" content="([^"]*)"/), url)
})

test('HTML-significant characters are still escaped', () => {
  // The fix must not regress escaping — a quote would otherwise close the
  // attribute and everything after it becomes markup.
  const html = render({ description: 'Ampersands & "quotes" and <tags>' })
  assert.equal(attr(html, DESC), 'Ampersands &amp; &quot;quotes&quot; and &lt;tags&gt;')
})

test('esc leaves $ alone — the fix is the replacer, not the escaper', () => {
  // Escaping $ would corrupt copy that legitimately quotes prices.
  assert.equal(esc('$150,000'), '$150,000')
})
