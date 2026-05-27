import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'

export function useSanity(query, params = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
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
