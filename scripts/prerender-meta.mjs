/**
 * Post-build: inject per-page meta tags into LP route HTML files.
 * Creates dist/lp/[slug]/index.html for each mock landing page so crawlers
 * that don't execute JS see the correct title, description, and canonical.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const require = createRequire(import.meta.url)

const distDir = path.join(ROOT, 'dist')
const indexPath = path.join(distDir, 'index.html')

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found — run vite build first')
  process.exit(1)
}

const { MOCK_PAGES } = await import(path.join(ROOT, 'src/lib/mockLandingPages.js'))
const BASE_URL = 'https://super-conscious.studio'
const DEFAULT_IMAGE = `${BASE_URL}/reel-preview.gif`
const indexHtml = fs.readFileSync(indexPath, 'utf8')

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function injectMeta(html, { title, description, url }) {
  return html
    .replace(/(<title>)[^<]*(<\/title>)/, `$1${esc(title)}$2`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<meta property="og:image" content=")[^"]*"/, `$1${DEFAULT_IMAGE}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${esc(description)}"`)
}

let count = 0

for (const [slug, page] of Object.entries(MOCK_PAGES)) {
  const title = page.seoTitle || `${page.heroHeadline} | Super Conscious`
  const description = (page.seoDescription || page.heroAnswer || '').slice(0, 155)
  const url = `${BASE_URL}/lp/${slug}`

  const html = injectMeta(indexHtml, { title, description, url })

  const dir = path.join(distDir, 'lp', slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  count++
}

console.log(`Prerendered ${count} landing pages → dist/lp/*/index.html`)
