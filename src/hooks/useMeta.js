import { useEffect } from 'react'

const DEFAULT_TITLE = 'Super Conscious — Creative Studio'
const DEFAULT_DESC = 'Super Conscious is a creative strategy and production studio building brands, content, and digital products for founders and marketing teams. Philadelphia, PA.'

export function useMeta({ title, description } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    const metaEl = document.querySelector('meta[name="description"]')
    const prevDesc = metaEl?.getAttribute('content') ?? ''

    if (title) document.title = title
    if (description && metaEl) metaEl.setAttribute('content', description)

    return () => {
      document.title = DEFAULT_TITLE
      if (metaEl) metaEl.setAttribute('content', DEFAULT_DESC)
    }
  }, [title, description])
}
