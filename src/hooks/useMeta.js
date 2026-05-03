import { useEffect } from 'react'

const DEFAULT_TITLE = 'Super Conscious — Creative Studio'
const DEFAULT_DESC = 'Super Conscious is a creative strategy and production studio building brands, content, and digital products for founders and marketing teams. Philadelphia, PA.'

export function useMeta({ title, description, schema } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    const metaEl = document.querySelector('meta[name="description"]')
    const prevDesc = metaEl?.getAttribute('content') ?? ''

    if (title) document.title = title
    if (description && metaEl) metaEl.setAttribute('content', description)

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
      if (metaEl) metaEl.setAttribute('content', DEFAULT_DESC)
      if (scriptEl) scriptEl.remove()
    }
  }, [title, description, schema])
}
