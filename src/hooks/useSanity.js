import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'
import { getCached, recordQuery } from '../lib/sanityCache'

export function useSanity(query, params = {}) {
  recordQuery(query, params) // no-op unless SSR pass-1 is collecting
  const cached = getCached(query, params) // build-time/hydration seed, else undefined
  const [data, setData] = useState(cached !== undefined ? cached : null)
  const [loading, setLoading] = useState(cached === undefined)
  // Stringify so object identity changes don't trigger refetches, but
  // actual value changes (e.g. case study slug) do.
  const paramsKey = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client.fetch(query, params).then(result => {
      if (cancelled) return
      setData(result)
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setLoading(false)
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey])

  return { data, loading }
}
