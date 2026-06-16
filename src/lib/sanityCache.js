// Build-time Sanity data cache (Phase 2b).
//
// During SSG, entry-server renders each route twice: pass 1 records which Sanity
// queries the route calls (via recordQuery in useSanity), the build fetches them,
// then pass 2 renders with the results in `store` so the HTML has real content.
// The store is serialized into the page as window.__SANITY_DATA__ and re-seeded
// on the client (main.jsx) so the first client render matches the SSR output —
// no hydration mismatch. After hydration, useSanity still revalidates from Sanity.

export const sanityKey = (query, params) => query + '::' + JSON.stringify(params || {})

let store = {}
let collecting = false
let collected = []

export function setStore(next) { store = next || {} }
export function getStore() { return store }

export function getCached(query, params) {
  const k = sanityKey(query, params)
  return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : undefined
}

export function startCollecting() { collecting = true; collected = [] }
export function stopCollecting() { collecting = false; return collected }

export function recordQuery(query, params) {
  if (!collecting) return
  const k = sanityKey(query, params)
  if (!collected.some(c => c.key === k)) collected.push({ query, params, key: k })
}
