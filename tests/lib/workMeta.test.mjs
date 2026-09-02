import assert from 'node:assert/strict'
import test from 'node:test'

import { discipline, workDescription, workHeadline, workTitle } from '../../src/lib/workMeta.js'

const SUFFIX = ' | Super Conscious'

// ── discipline ──────────────────────────────────────────────────────────────

test('discipline prefers type', () => {
  assert.equal(discipline({ type: 'Brand + Content', category: ['product'], services: ['X'] }), 'Brand + Content')
})

test('discipline falls back to category, then to the first two services', () => {
  // talos is the one sitemap'd project with no `type`.
  assert.equal(discipline({ category: ['brand', 'content'] }), 'Brand + Content')
  assert.equal(discipline({ services: ['Branding', 'Messaging', 'Toolkit'] }), 'Branding + Messaging')
})

test('discipline is empty when Sanity holds none of the three', () => {
  assert.equal(discipline({}), '')
  assert.equal(discipline(), '')
  assert.equal(discipline({ type: '   ', services: [], category: [] }), '')
})

// ── titles ──────────────────────────────────────────────────────────────────

test('title appends the discipline', () => {
  assert.equal(workTitle({ type: 'Brand' }, 'Photon'), `Photon — Brand${SUFFIX}`)
})

test('title is just the name when there is no discipline', () => {
  assert.equal(workTitle({}, 'Photon'), `Photon${SUFFIX}`)
})

test('a compound name is not given a second em dash', () => {
  // This produced "Arbitrum — Marketing Dept Videos — Marketing Dept Videos".
  const p = { type: 'Marketing Dept Videos' }
  assert.equal(workHeadline(p, 'Arbitrum — Marketing Dept Videos'), 'Arbitrum — Marketing Dept Videos')
  assert.ok(workTitle(p, 'Arbitrum — Marketing Dept Videos').length <= 60)
})

test('a name already ending in its discipline is left alone', () => {
  assert.equal(workHeadline({ type: 'Content' }, 'Smallhold Content'), 'Smallhold Content')
})

test('every title stays within a sane SERP budget for real shapes', () => {
  const cases = [
    [{ type: 'Brand' }, 'Photon'],
    [{ type: 'Brand + Content + Product' }, 'Big Buoy'],
    [{ category: ['brand', 'content'] }, 'Talos'],
    [{ type: 'Documentary Series' }, 'Small Business Profiles'],
  ]
  for (const [p, n] of cases) assert.ok(workTitle(p, n).length <= 62, `${workTitle(p, n)} too long`)
})

// ── descriptions ────────────────────────────────────────────────────────────

test('description leads with the tagline', () => {
  const d = workDescription({ tagline: 'Rewriting the prescription network around people, not paperwork' }, 'Photon')
  assert.ok(d.startsWith('Rewriting the prescription network around people, not paperwork.'))
})

test('description adds whole sentences of the summary, never a mid-word cut', () => {
  const d = workDescription({
    tagline: 'A short hook',
    summary: 'First sentence here. Second sentence is quite a bit longer than the first one. ' +
      'Third sentence would push this well past the limit and must not be sliced in half.',
  }, 'X')
  assert.ok(d.length <= 158)
  assert.ok(/[.!?]$/.test(d), `did not end on a sentence boundary: ${d}`)
  assert.ok(!d.endsWith('…'))
})

test('description never emits the old placeholder', () => {
  for (const p of [{}, { type: 'Brand' }, { services: ['Branding'] }]) {
    assert.ok(!workDescription(p, 'Entropy').includes('Work by Super Conscious for'))
  }
})

test('a project with only a name and a type still says something true', () => {
  const d = workDescription({ type: 'Brand + Content' }, 'Girlfight')
  assert.equal(d, 'Brand and content work for Girlfight by Super Conscious, a creative studio in Philadelphia.')
})

test('a three-part type reads as an Oxford list, not "and and"', () => {
  const d = workDescription({ type: 'Brand + Content + Product' }, 'Big Buoy')
  assert.ok(d.startsWith('Brand, content, and product work for Big Buoy'), d)
  assert.ok(!d.includes('and content and'))
})

test('the compound-name stutter is kept out of the description too', () => {
  // "Interview Series work for Arbitrum — Interview Series by …"
  const d = workDescription({ type: 'Interview Series' }, 'Arbitrum — Interview Series')
  assert.ok(d.includes('for Arbitrum by'), d)
  assert.ok(!d.includes('Arbitrum — Interview Series'), d)
})

test('services fill out a thin description', () => {
  const d = workDescription(
    { tagline: 'A short hook', services: ['Branding', 'Marketing Site', 'Messaging'] },
    'Photon',
  )
  assert.ok(d.startsWith('A short hook.'))
  assert.ok(d.includes('Branding'))
  assert.ok(d.length <= 158)
})

test('an over-long tagline is truncated on a character budget with an ellipsis', () => {
  const d = workDescription({ tagline: 'x'.repeat(300) }, 'X')
  assert.ok(d.length <= 158)
  assert.ok(d.endsWith('…'))
})

test('no description exceeds the budget for any input shape', () => {
  const shapes = [
    {},
    { tagline: 'y'.repeat(200) },
    { summary: 'z'.repeat(400) },
    { services: Array.from({ length: 20 }, (_, i) => `Service ${i}`) },
    { tagline: 'A hook.', summary: 'S'.repeat(300), services: ['A', 'B', 'C'], type: 'Brand + Content' },
  ]
  for (const s of shapes) assert.ok(workDescription(s, 'Name').length <= 158)
})

test('handles missing project and missing name without throwing', () => {
  assert.doesNotThrow(() => workDescription(undefined, undefined))
  assert.doesNotThrow(() => workTitle(undefined, undefined))
  assert.doesNotThrow(() => workDescription(null, ''))
})
