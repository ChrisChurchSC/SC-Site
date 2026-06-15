import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router' // RR7: StaticRouter lives in react-router, not /server
import App from './App.jsx'
import { client } from './lib/sanity.js'
import { startCollecting, stopCollecting, setStore } from './lib/sanityCache.js'

function renderAt(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}

// Memoize Sanity fetches across routes — many routes share PROJECTS_QUERY,
// SITE_CONFIG_QUERY, etc., so each unique (query, params) is fetched once.
const fetchMemo = new Map()
function fetchOnce(query, params, key) {
  if (!fetchMemo.has(key)) {
    fetchMemo.set(key, client.fetch(query, params).catch(() => null))
  }
  return fetchMemo.get(key)
}

// Two-pass SSG render: pass 1 collects the route's Sanity queries, the build
// fetches them, pass 2 renders with the data. Returns the HTML body + the data
// map (serialized into the page as window.__SANITY_DATA__ for hydration parity).
export async function renderRoute(url) {
  setStore({})
  startCollecting()
  try { renderAt(url) } catch { /* pass 1 output discarded; just collecting */ }
  const queries = stopCollecting()

  const store = {}
  await Promise.all(queries.map(async ({ query, params, key }) => {
    store[key] = await fetchOnce(query, params, key)
  }))

  setStore(store)
  let html
  try { html = renderAt(url) } finally { setStore({}) }
  return { html, data: store }
}
