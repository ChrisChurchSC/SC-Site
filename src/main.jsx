import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Inject @font-face with the deploy-aware base URL so the same code works
// under /SC-Site/ today and on a future custom-domain root deploy.
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const style = document.createElement('style')
style.textContent = `
@font-face {
  font-family: 'Signifier';
  src: url('${base}/fonts/Signifier/WOFF2/signifier-light.woff2') format('woff2'),
       url('${base}/fonts/Signifier/OTF/Signifier-Light.otf') format('opentype');
  font-weight: 300;
  font-display: swap;
}
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
