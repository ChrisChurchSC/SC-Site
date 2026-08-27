// Sanity image-pipeline helpers.
//
// Two problems these solve:
//
// 1. No image on the site carried width/height, so every one of them caused
//    layout shift while loading. CLS is a Core Web Vitals input, so it is a
//    ranking input.
//
// 2. `?w=N` returns an N-wide image, which a 2x display then upscales. The
//    fix is a second candidate at 2N with `fit=max`, which clamps rather than
//    enlarging past the original.
//
// Dimensions come from the URL: Sanity encodes them in the asset filename as
// `-<width>x<height>.<ext>`. Nothing else on the page knows them, and an <img>
// with the WRONG width/height is worse than one with none, so every helper
// here returns null rather than guessing.

/** `{ width, height }` from a Sanity asset URL, or null if not parseable. */
export function sanityDimensions(url) {
  const m = /-(\d+)x(\d+)\.[a-z0-9]+(?:[?#]|$)/i.exec(String(url ?? ''))
  if (!m) return null
  const width = Number(m[1])
  const height = Number(m[2])
  if (!width || !height) return null
  return { width, height }
}

const isSanityImage = (url) => typeof url === 'string' && url.includes('cdn.sanity.io/images/')

/** An animated GIF re-encoded at 2x is enormous, and `auto=format` keeps it a GIF. */
const isGif = (url) => /\.gif(?:[?#]|$)/i.test(String(url ?? ''))

/**
 * Add Sanity image-pipeline params to an image URL.
 * Returns the URL unchanged for non-Sanity-image URLs (videos, /files/, externals).
 *
 *   sanityImg(url)                 → url + ?auto=format&q=80
 *   sanityImg(url, { w: 1200 })    → url + ?auto=format&q=80&w=1200
 *   sanityImg(url, { w: 800, q: 85 })
 *
 * `fit` is opt-in so this stays byte-identical to what it returned before.
 */
export function sanityImg(url, { w, q = 80, fit } = {}) {
  if (!url) return url
  if (!isSanityImage(url)) return url
  const params = ['auto=format', `q=${q}`]
  // A falsy `w` must not silently drop the param and serve the untransformed
  // original — some assets are tens of megabytes.
  if (w) params.push(`w=${Math.round(w)}`)
  if (fit) params.push(`fit=${fit}`)
  return url + (url.includes('?') ? '&' : '?') + params.join('&')
}

/**
 * Props for an <img>: a clamped src, a 2x srcSet, and intrinsic width/height.
 *
 * Spread onto the element — `{...sanityImgProps(url, { w: 900 })}`. Every field
 * is omitted rather than guessed when the URL cannot supply it, so this is safe
 * on non-Sanity URLs (it degrades to `{ src }`).
 *
 * @param {string} url
 * @param {object} [opts]
 * @param {number} [opts.w]         intended CSS width; defaults to the intrinsic width
 * @param {number} [opts.q]         quality, default 80
 * @param {boolean} [opts.priority] above the fold: eager + fetchPriority=high
 */
export function sanityImgProps(url, { w, q = 80, priority = false } = {}) {
  if (!url) return { src: url }

  const loading = priority ? undefined : 'lazy'
  const fetchPriority = priority ? 'high' : undefined

  if (!isSanityImage(url)) {
    return { src: url, ...(loading ? { loading } : {}), ...(fetchPriority ? { fetchPriority } : {}) }
  }

  const dims = sanityDimensions(url)
  // Never ask for more than the asset has: `fit=max` clamps, so a 2x candidate
  // past the intrinsic width is the same bytes as 1x and only costs a request.
  const target = Math.round(w || dims?.width || 0) || undefined
  const capped = dims && target ? Math.min(target, dims.width) : target

  const src = sanityImg(url, { w: capped, q, fit: 'max' })

  // The 2x candidate is min(2 * requested, intrinsic). Giving up entirely when
  // 2 * requested overshoots left a 1080-wide asset serving 900px into a 900px
  // slot, which a retina display then upscales — the exact problem this exists
  // to fix. The largest the asset actually has is still better than 1x.
  let srcSet
  if (!isGif(url) && capped) {
    const twoX = dims ? Math.min(capped * 2, dims.width) : capped * 2
    if (twoX > capped) {
      srcSet = `${src} 1x, ${sanityImg(url, { w: twoX, q, fit: 'max' })} 2x`
    }
  }

  const width = capped ?? dims?.width
  const height = dims && width ? Math.round((width * dims.height) / dims.width) : undefined

  return {
    src,
    ...(srcSet ? { srcSet } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(loading ? { loading } : {}),
    ...(fetchPriority ? { fetchPriority } : {}),
  }
}
