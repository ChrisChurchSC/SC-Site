import assert from 'node:assert/strict'
import test from 'node:test'

import { injectSchemas, serializeSchema } from '../../scripts/lib/inject-schemas.mjs'

const DOC = '<!doctype html><html><head>\n<title>Super Conscious</title>\n</head><body><div id="root">BODY</div></body></html>'

/** Pull every JSON-LD block back out and parse it, the way capture.mjs does. */
const parseBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map(m => JSON.parse(m[1]))

const headOf = (html) => html.slice(0, html.indexOf('</head>'))

test('injects a schema before </head> and leaves it parseable', () => {
  const out = injectSchemas(DOC, [{ '@type': 'Organization', name: 'Super Conscious' }])
  assert.deepEqual(parseBlocks(out), [{ '@type': 'Organization', name: 'Super Conscious' }])
  assert.ok(headOf(out).includes('application/ld+json'))
})

test('returns the html untouched when there is nothing to inject', () => {
  assert.equal(injectSchemas(DOC, []), DOC)
  assert.equal(injectSchemas(DOC, undefined), DOC)
  assert.equal(injectSchemas(DOC, [null, false, undefined]), DOC)
})

test('drops falsy entries so callers can use conditional slots', () => {
  const out = injectSchemas(DOC, [null, { '@type': 'FAQPage' }, false])
  assert.deepEqual(parseBlocks(out), [{ '@type': 'FAQPage' }])
})

test('injects multiple schemas as separate blocks', () => {
  const out = injectSchemas(DOC, [{ '@type': 'Article' }, { '@type': 'BreadcrumbList' }])
  assert.deepEqual(parseBlocks(out).map(s => s['@type']), ['Article', 'BreadcrumbList'])
})

// ── $-substitution: the class of bug this module exists to close ────────────
// A string replacement runs $-substitution even when the search pattern is a
// plain string. Every one of these would corrupt the document under the old
// template-string implementation.

test('$& in schema content does not expand to the matched </head>', () => {
  const out = injectSchemas(DOC, [{ '@type': 'FAQPage', text: 'A$&B' }])
  assert.equal(parseBlocks(out)[0].text, 'A$&B')
  // The literal </head> must not have been written into the script block.
  assert.equal(out.match(/<\/head>/g).length, 1)
})

test("$' in schema content does not duplicate the document tail into <head>", () => {
  const out = injectSchemas(DOC, [{ '@type': 'FAQPage', text: "cost $'000" }])
  assert.equal(parseBlocks(out)[0].text, "cost $'000")
  assert.ok(!headOf(out).includes('<div id="root">'), 'body leaked into <head>')
})

test('$` in schema content does not duplicate the document head', () => {
  const out = injectSchemas(DOC, [{ '@type': 'FAQPage', text: 'a $` b' }])
  assert.equal(parseBlocks(out)[0].text, 'a $` b')
  assert.equal(out.match(/<title>/g).length, 1)
})

test('$$ in schema content stays two dollar signs', () => {
  const out = injectSchemas(DOC, [{ '@type': 'FAQPage', text: 'about $$100' }])
  assert.equal(parseBlocks(out)[0].text, 'about $$100')
})

test('$1 in schema content is not treated as a capture group', () => {
  // This is the exact shape that already shipped once via inject-meta.mjs:
  // a price of $150,000 in landing-page copy.
  const out = injectSchemas(DOC, [{ '@type': 'FAQPage', text: 'from $150,000' }])
  assert.equal(parseBlocks(out)[0].text, 'from $150,000')
})

// ── </script> breakout ──────────────────────────────────────────────────────

test('</script> in schema content cannot close the block', () => {
  const payload = 'end </script><img src=x> rest'
  const out = injectSchemas(DOC, [{ '@type': 'FAQPage', text: payload }])
  assert.equal(parseBlocks(out)[0].text, payload, 'round-trips through JSON.parse')
  assert.ok(!out.includes('<img src=x>'), 'raw markup escaped into the document')
  assert.equal(out.match(/<\/script>/g).length, 1)
})

test('serializeSchema escapes every < it emits', () => {
  const json = serializeSchema({ a: '<b>', c: '</script>' })
  assert.ok(!json.includes('<'), 'a raw < survived serialization')
  assert.deepEqual(JSON.parse(json), { a: '<b>', c: '</script>' })
})

// ── a hostile Sanity answer, end to end ─────────────────────────────────────

test('a hostile editor-authored answer survives injection intact', () => {
  const answer = `Test $' $& $$ $1 </script> "quote" <h1>tag</h1> — costs $150,000.`
  const out = injectSchemas(DOC, [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'What does it cost?',
      acceptedAnswer: { '@type': 'Answer', text: answer },
    }],
  }])

  assert.equal(parseBlocks(out)[0].mainEntity[0].acceptedAnswer.text, answer)
  // The document is still structurally sound.
  assert.equal(out.match(/<\/head>/g).length, 1)
  assert.equal(out.match(/<\/script>/g).length, 1)
  assert.equal(out.match(/<title>/g).length, 1)
  assert.ok(!headOf(out).includes('<div id="root">'))
})
