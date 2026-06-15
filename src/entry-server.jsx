import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router' // RR7: StaticRouter lives in react-router, not /server
import App from './App.jsx'

// Render a route to an HTML string for build-time SSG. Pages with a synchronous
// static fallback (LandingPage→MOCK_PAGES, ThoughtPost→staticThoughts, etc.)
// render full content here; useSanity's fetch is in an effect that never runs
// during renderToString, so the client's first paint matches (then revalidates).
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
