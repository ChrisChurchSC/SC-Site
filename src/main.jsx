import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { setStore } from './lib/sanityCache'

// Seed the build-time Sanity data so the first client render matches the SSR
// output (no hydration mismatch); useSanity still revalidates after hydration.
if (typeof window !== 'undefined' && window.__SANITY_DATA__) {
  setStore(window.__SANITY_DATA__)
}

const rootEl = document.getElementById('root')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Hydrate when the build prerendered real content into #root; otherwise
// (dev, or routes we don't SSG) client-render from scratch.
if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
