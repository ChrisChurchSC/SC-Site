import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'

export function useSanity(query, params = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(query, params).then(result => {
      setData(result)
      setLoading(false)
    })
  }, [query])

  return { data, loading }
}
