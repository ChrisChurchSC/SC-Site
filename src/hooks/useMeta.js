import { useEffect } from 'react'

const DEFAULT_TITLE = 'Super Conscious | Creative Studio'
const DEFAULT_DESC = 'Super Conscious is a creative strategy and production studio building brands, content, and digital products for founders and marketing teams. Philadelphia, PA.'
const DEFAULT_OG_DESC = 'Your fractional marketing and creative department'
const DEFAULT_IMAGE = 'https://super-conscious.studio/reel-preview.gif'
const SITE_BASE = 'https://super-conscious.studio'

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector)
  if (el && value != null) el.setAttribute(attr, value)
}

export function useMeta({ title, description, image, path, schema, noindex } = {}) {
  useEffect(() => {
    if (title) document.title = title
    setMeta('meta[name="description"]', 'content', description)

    let robotsEl = null
    if (noindex) {
      robotsEl = document.createElement('meta')
      robotsEl.name = 'robots'
      robotsEl.content = 'noindex, nofollow'
      document.head.appendChild(robotsEl)
    }

    const ogTitle = title || DEFAULT_TITLE
    const ogDesc  = description || DEFAULT_OG_DESC
    const ogUrl   = path ? `${SITE_BASE}${path}` : SITE_BASE

    setMeta('meta[property="og:title"]',        'content', ogTitle)
    setMeta('meta[property="og:description"]',  'content', ogDesc)
    setMeta('meta[property="og:url"]',          'content', ogUrl)
    setMeta('meta[name="twitter:title"]',       'content', ogTitle)
    setMeta('meta[name="twitter:description"]', 'content', ogDesc)

    // Only when the caller actually has an image. This used to fall back to
    // DEFAULT_IMAGE and write it unconditionally, so any page whose useMeta
    // call omits `image` — every thought post — overwrote the per-page og:image
    // the prerender had just put in the document, back to reel-preview.gif.
    // setMeta already no-ops on a null value; the fallback was the whole bug.
    if (image) {
      setMeta('meta[property="og:image"]',  'content', image)
      setMeta('meta[name="twitter:image"]', 'content', image)
    }

    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', ogUrl)

    let scriptEl = null
    if (schema) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'application/ld+json'
      scriptEl.id = 'page-schema'
      scriptEl.textContent = JSON.stringify(schema)
      document.head.appendChild(scriptEl)
    }

    return () => {
      document.title = DEFAULT_TITLE
      setMeta('meta[name="description"]', 'content', DEFAULT_DESC)
      setMeta('meta[property="og:title"]',        'content', DEFAULT_TITLE)
      setMeta('meta[property="og:description"]',  'content', DEFAULT_OG_DESC)
      setMeta('meta[property="og:image"]',        'content', DEFAULT_IMAGE)
      setMeta('meta[property="og:url"]',          'content', SITE_BASE)
      setMeta('meta[name="twitter:title"]',       'content', DEFAULT_TITLE)
      setMeta('meta[name="twitter:description"]', 'content', DEFAULT_OG_DESC)
      setMeta('meta[name="twitter:image"]',       'content', DEFAULT_IMAGE)
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) canonical.setAttribute('href', SITE_BASE + '/')
      if (scriptEl) scriptEl.remove()
      if (robotsEl) robotsEl.remove()
    }
  }, [title, description, image, path, schema, noindex])
}
