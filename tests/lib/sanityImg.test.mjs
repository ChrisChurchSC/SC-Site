import assert from 'node:assert/strict'
import test from 'node:test'

import { sanityDimensions, sanityImg, sanityImgProps } from '../../src/lib/sanityImg.js'

const IMG = 'https://cdn.sanity.io/images/ppq16wpu/production/a95750fcd91cbef0823e0bb782f989830d4e153f-1080x1350.jpg'
const GIF = 'https://cdn.sanity.io/images/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496-1343x729.gif'
const FILE = 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'
const LOCAL = '/thoughts/agility-over-headcount.webp'

// ── dimensions ──────────────────────────────────────────────────────────────

test('reads dimensions out of the asset filename', () => {
  assert.deepEqual(sanityDimensions(IMG), { width: 1080, height: 1350 })
})

test('reads dimensions through an existing query string', () => {
  assert.deepEqual(sanityDimensions(`${IMG}?auto=format&q=80`), { width: 1080, height: 1350 })
})

test('returns null rather than guessing when there are no dimensions', () => {
  for (const u of [FILE, LOCAL, '', null, undefined, 'https://example.com/a.jpg']) {
    assert.equal(sanityDimensions(u), null, `${u} should not parse`)
  }
})

// ── sanityImg: unchanged behaviour ──────────────────────────────────────────

test('sanityImg is unchanged for the existing call shapes', () => {
  assert.equal(sanityImg(IMG), `${IMG}?auto=format&q=80`)
  assert.equal(sanityImg(IMG, { w: 1200 }), `${IMG}?auto=format&q=80&w=1200`)
  assert.equal(sanityImg(IMG, { w: 800, q: 85 }), `${IMG}?auto=format&q=85&w=800`)
})

test('sanityImg leaves non-image URLs alone', () => {
  assert.equal(sanityImg(FILE), FILE)
  assert.equal(sanityImg(LOCAL), LOCAL)
  assert.equal(sanityImg(''), '')
  assert.equal(sanityImg(null), null)
})

test('a falsy width does not silently serve the untransformed original', () => {
  // Dropping `w` entirely returns the full asset, which runs to tens of MB.
  assert.ok(!sanityImg(IMG, { w: 0 }).includes('w='))
  assert.ok(!sanityImg(IMG, { w: undefined }).includes('w='))
  // …and the props helper falls back to the intrinsic width rather than none.
  assert.equal(sanityImgProps(IMG, { w: 0 }).width, 1080)
})

// ── sanityImgProps ──────────────────────────────────────────────────────────

test('emits intrinsic width and height for the requested size', () => {
  const p = sanityImgProps(IMG, { w: 540 })
  assert.equal(p.width, 540)
  assert.equal(p.height, 675) // 540 * 1350/1080
})

test('emits a 2x candidate so a retina display does not upscale', () => {
  const p = sanityImgProps(IMG, { w: 400 })
  assert.ok(p.srcSet.includes('w=400'))
  assert.ok(p.srcSet.includes('w=800'))
  assert.ok(p.srcSet.endsWith('2x'))
})

test('src carries fit=max so it can never be upscaled past the original', () => {
  // Without fit, a request wider than the asset returns an enlarged image.
  assert.ok(sanityImgProps(IMG, { w: 400 }).src.includes('fit=max'))
})

test('never requests more than the asset has', () => {
  const p = sanityImgProps(IMG, { w: 4000 })
  assert.equal(p.width, 1080, 'clamped to the intrinsic width')
  assert.equal(p.height, 1350)
  assert.equal(p.srcSet, undefined, 'no 2x candidate when 1x is already the whole asset')
})

test('no 2x candidate for a GIF', () => {
  // auto=format keeps a GIF a GIF; the 2x of a 1343x729 gif is ~3.3 MB.
  assert.equal(sanityImgProps(GIF, { w: 600 }).srcSet, undefined)
  assert.equal(sanityImgProps(GIF, { w: 600 }).width, 600)
})

test('degrades to just a src for non-Sanity URLs', () => {
  const p = sanityImgProps(LOCAL, { w: 900 })
  assert.equal(p.src, LOCAL)
  assert.equal(p.width, undefined)
  assert.equal(p.height, undefined)
  assert.equal(p.srcSet, undefined)
  assert.equal(p.loading, 'lazy')
})

test('lazy by default, eager and high priority when asked', () => {
  assert.equal(sanityImgProps(IMG, { w: 900 }).loading, 'lazy')
  assert.equal(sanityImgProps(IMG, { w: 900 }).fetchPriority, undefined)

  const hero = sanityImgProps(IMG, { w: 900, priority: true })
  assert.equal(hero.loading, undefined, 'an above-the-fold image must not be lazy')
  assert.equal(hero.fetchPriority, 'high')
})

test('handles a missing url without throwing', () => {
  assert.deepEqual(sanityImgProps(''), { src: '' })
  assert.deepEqual(sanityImgProps(null), { src: null })
  assert.doesNotThrow(() => sanityImgProps(undefined))
})

test('every emitted prop is either correct or absent — never a guess', () => {
  for (const url of [FILE, LOCAL, 'https://example.com/x.png']) {
    const p = sanityImgProps(url, { w: 900 })
    assert.ok(!('width' in p), `${url} must not claim a width`)
    assert.ok(!('height' in p), `${url} must not claim a height`)
  }
})

test('the 2x candidate is the largest the asset actually has', () => {
  // A 1080-wide asset asked for 900: 2x would be 1800, which it does not have.
  // Giving up leaves 900px in a 900px slot, which a retina display upscales —
  // the exact problem this helper exists to fix. Offer 1080 instead.
  const p = sanityImgProps(IMG, { w: 900 })
  assert.ok(p.srcSet, 'expected a 2x candidate')
  const [oneX, twoX] = p.srcSet.split(', ')
  assert.ok(oneX.includes('w=900') && oneX.endsWith(' 1x'), oneX)
  assert.ok(twoX.includes('w=1080') && twoX.endsWith(' 2x'), twoX)
})

test('still no 2x candidate when 1x already is the whole asset', () => {
  assert.equal(sanityImgProps(IMG, { w: 1080 }).srcSet, undefined)
  assert.equal(sanityImgProps(IMG, { w: 4000 }).srcSet, undefined)
})
