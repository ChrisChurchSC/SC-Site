import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

/**
 * EmailCaptureForm takes its host page's CSS module as a prop. A class the
 * host does not define is not an error — `styles.emailInput` is just
 * `undefined`, React renders `class="undefined"`, and the control appears
 * with browser defaults.
 *
 * That shipped. /about-us defined two of the six, so the email field rendered
 * as a bare white box overlapping the button, on a dark page, in production.
 * Nothing failed; it just looked broken.
 */

const ROOT = path.join(import.meta.dirname, '../..')
const COMPONENT = path.join(ROOT, 'src/components/EmailCaptureForm.jsx')

const required = [...readFileSync(COMPONENT, 'utf8').matchAll(/styles\.(\w+)/g)]
  .map((m) => m[1])
const REQUIRED = [...new Set(required)].sort()

test('the component actually asks for classes', () => {
  assert.ok(REQUIRED.length >= 5, `expected several styles.* references, found ${REQUIRED.length}`)
})

/** Every page that renders the component, found rather than listed. */
const consumers = readdirSync(path.join(ROOT, 'src/pages'))
  .filter((f) => f.endsWith('.jsx'))
  .filter((f) => readFileSync(path.join(ROOT, 'src/pages', f), 'utf8').includes('EmailCaptureForm'))

test('every page rendering the form was discovered', () => {
  // Guards against the regex silently matching nothing and the suite passing
  // by testing an empty list.
  assert.ok(consumers.length >= 2, `expected at least 2 consumers, found ${consumers.length}`)
})

for (const page of consumers) {
  test(`${page} defines every class EmailCaptureForm uses`, () => {
    const jsx = readFileSync(path.join(ROOT, 'src/pages', page), 'utf8')

    // The component takes styles={...}; resolve which module that is.
    const importMatch = jsx.match(/import\s+styles\s+from\s+'\.\/([\w.]+\.css)'/)
    assert.ok(importMatch, `${page} imports a CSS module as \`styles\``)

    const css = readFileSync(path.join(ROOT, 'src/pages', importMatch[1]), 'utf8')
    // Requires the BASE rule. `.emailInput:focus { }` alone must not count as
    // defining .emailInput — a pseudo-class variant with no base rule leaves
    // the control unstyled in its normal state, which is the bug.
    const defined = new Set(
      [...css.matchAll(/^\.(\w+)\s*[,{]/gm)].map((m) => m[1]),
    )

    const missing = REQUIRED.filter((c) => !defined.has(c))
    assert.deepEqual(
      missing,
      [],
      `${importMatch[1]} is missing ${missing.join(', ')} — the control will render unstyled`,
    )
  })
}

test('each consumer supplies its own copy and labelling', () => {
  // The original bug was not only visual: the pricing component was reused on
  // the careers page with pricing's button text, confirmation, _subject and
  // request_type, so freelancer signups were filed as pricing leads.
  const seen = new Map()
  for (const page of consumers) {
    const jsx = readFileSync(path.join(ROOT, 'src/pages', page), 'utf8')
    for (const prop of ['submitLabel', 'confirmMessage', 'subject', 'requestType']) {
      const m = jsx.match(new RegExp(`${prop}=["{]([^"}]*)`))
      assert.ok(m, `${page} must pass ${prop} explicitly`)
      const key = `${prop}:${m[1]}`
      assert.ok(!seen.has(key), `${page} reuses ${prop} from ${seen.get(key)} — contexts must differ`)
      seen.set(key, page)
    }
  }
})
