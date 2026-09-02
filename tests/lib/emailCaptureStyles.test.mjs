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

const SOURCE = readFileSync(COMPONENT, 'utf8')

const classesIn = (src) => new Set([...src.matchAll(/styles\.(\w+)/g)].map((m) => m[1]))

/**
 * The contact variant needs classes the compact one never renders, so holding
 * every caller to all of them would demand dead rules from the careers page.
 * ContactFields is a separate function for exactly this reason: its body is
 * the contact-only contract, and everything else is what all callers owe.
 *
 * Still derived from real usage rather than a hand-kept list — a list drifts
 * from the component the first time somebody adds a field.
 */
const contactFn = SOURCE.slice(SOURCE.indexOf('function ContactFields'))
assert.ok(contactFn, 'ContactFields must exist for the variant split to be derivable')

const CONTACT_ONLY = [...classesIn(contactFn)].sort()
const BASE = [...classesIn(SOURCE.slice(0, SOURCE.indexOf('function ContactFields')))].sort()

test('the component actually asks for classes', () => {
  assert.ok(BASE.length >= 5, `expected several styles.* references, found ${BASE.length}`)
  assert.ok(CONTACT_ONLY.length >= 3, `expected ContactFields to use its own classes, found ${CONTACT_ONLY.length}`)
})

/** Everything that renders the component, found rather than listed.
 *
 * Both directories, because a consumer is whatever passes `styles` to the
 * form — the CTA is a component shared by two pages, and scanning only
 * src/pages would miss exactly the consumer that matters most.
 *
 * EmailCaptureForm itself matches its own name, so it is excluded. */
const consumers = ['src/pages', 'src/components'].flatMap((dir) =>
  readdirSync(path.join(ROOT, dir))
    .filter((f) => f.endsWith('.jsx') && f !== 'EmailCaptureForm.jsx')
    .filter((f) => readFileSync(path.join(ROOT, dir, f), 'utf8').includes('EmailCaptureForm'))
    .map((f) => ({ dir, file: f, id: `${dir}/${f}` })),
)

test('every file rendering the form was discovered', () => {
  // Guards against the regex silently matching nothing and the suite passing
  // by testing an empty list. One, not two: it was two while the careers page
  // carried its own roster form, and that was cut on 2026-09-01. ContactCTA
  // is the only consumer left, and one found consumer is still proof the
  // discovery is not matching nothing.
  assert.ok(consumers.length >= 1, `expected at least 1 consumer, found ${consumers.length}`)
})

for (const { dir, file, id } of consumers) {
  test(`${id} defines every class EmailCaptureForm uses`, () => {
    const jsx = readFileSync(path.join(ROOT, dir, file), 'utf8')

    // The component takes styles={...}; resolve which module that is.
    //
    // Read the identifier off the call site rather than assuming it is
    // named `styles`. A page can import more than one module — HomeV3 has
    // its own copy alongside the live homepage's — and it is the one
    // actually passed that owes the classes. Assuming the import named
    // `styles` meant this checked a stylesheet the form never receives,
    // which passes when the real one is empty and fails when it is not.
    const passed = jsx.match(/<EmailCaptureForm[\s\S]*?styles=\{(\w+)\}/)
    const ident = passed ? passed[1] : 'styles'

    const importMatch = jsx.match(new RegExp(`import\\s+${ident}\\s+from\\s+'\\./([\\w.]+\\.css)'`))
    assert.ok(importMatch, `${id} imports a CSS module as \`${ident}\`, the module it passes to the form`)

    const css = readFileSync(path.join(ROOT, dir, importMatch[1]), 'utf8')
    // Requires the BASE rule. `.emailInput:focus { }` alone must not count as
    // defining .emailInput — a pseudo-class variant with no base rule leaves
    // the control unstyled in its normal state, which is the bug.
    const defined = new Set(
      [...css.matchAll(/^\.(\w+)\s*[,{]/gm)].map((m) => m[1]),
    )

    // A consumer only owes the contact classes if it asks for that variant.
    const wantsContact = /variant\s*=\s*["{']contact/.test(jsx)
    const required = wantsContact ? [...BASE, ...CONTACT_ONLY] : BASE

    const missing = required.filter((c) => !defined.has(c))
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
  for (const { dir, file, id } of consumers) {
    const jsx = readFileSync(path.join(ROOT, dir, file), 'utf8')
    for (const prop of ['submitLabel', 'confirmMessage', 'subject', 'requestType']) {
      const m = jsx.match(new RegExp(`${prop}[=:]\\s*["{']?([^"}',\\n]*)`))
      assert.ok(m, `${id} must pass ${prop} explicitly`)
      const key = `${prop}:${m[1]}`
      assert.ok(!seen.has(key), `${id} reuses ${prop} from ${seen.get(key)} — contexts must differ`)
      seen.set(key, id)
    }
  }
})
