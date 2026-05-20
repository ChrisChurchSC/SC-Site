// Add Sanity image-pipeline params to an image URL.
// Returns the URL unchanged for non-Sanity-image URLs (videos, /files/, externals, etc).
//   sanityImg(url)                 → url + ?auto=format&q=80
//   sanityImg(url, { w: 1200 })    → url + ?auto=format&q=80&w=1200
//   sanityImg(url, { w: 800, q: 85 })
export function sanityImg(url, { w, q = 80 } = {}) {
  if (!url) return url
  if (!url.includes('cdn.sanity.io/images/')) return url
  const params = ['auto=format', `q=${q}`]
  if (w) params.push(`w=${w}`)
  return url + (url.includes('?') ? '&' : '?') + params.join('&')
}
