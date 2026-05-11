import { createContext, useContext, useMemo } from 'react'
import { useSanity } from '../hooks/useSanity'
import { COMING_SOON_QUERY } from '../lib/queries'

const ComingSoonContext = createContext({ has: () => false })

export function ComingSoonProvider({ children }) {
  const { data } = useSanity(COMING_SOON_QUERY)
  const value = useMemo(() => {
    const set = new Set(Array.isArray(data) ? data : [])
    return { has: (slug) => set.has(slug) }
  }, [data])
  return <ComingSoonContext.Provider value={value}>{children}</ComingSoonContext.Provider>
}

export const useComingSoon = () => useContext(ComingSoonContext)
