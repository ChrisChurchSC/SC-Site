// Generates PDF exports for all sales decks by screenshotting each slide.
// Run with: npm run export-decks
// Requires the dev server running: npm run dev
//
// PDFs are saved to public/pdfs/

import { chromium } from 'playwright'
import { jsPDF } from 'jspdf'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '../public/pdfs')
const BASE_URL = 'http://localhost:5173'
const W = 1920
const H = 1080
const JPEG_QUALITY = 82

const DECKS = [
  { path: '/capabilities',        file: 'sc-capabilities-deck.pdf',        name: 'Capabilities' },
  { path: '/agency-capabilities', file: 'sc-agency-capabilities-deck.pdf', name: 'Agency Capabilities' },
  { path: '/brand-systems',       file: 'sc-brand-systems-deck.pdf',       name: 'Brand Systems' },
  { path: '/content-programs',    file: 'sc-content-programs-deck.pdf',    name: 'Content Programs' },
  { path: '/digital-products',    file: 'sc-digital-products-deck.pdf',    name: 'Digital Products' },
  { path: '/content-packages',    file: 'sc-content-packages-deck.pdf',    name: 'Content Packages' },
]

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const browser = await chromium.launch({ headless: true })

for (const deck of DECKS) {
  process.stdout.write(`${deck.name}...`)

  const page = await browser.newPage()
  await page.setViewportSize({ width: W, height: H })
  await page.addInitScript(() => localStorage.setItem('landing_hub_unlocked', '1'))

  // Load slide 1 and wait for data
  await page.goto(`${BASE_URL}${deck.path}?slide=1`, { waitUntil: 'load' })
  try {
    await page.waitForFunction(
      () => document.title !== 'Super Conscious — Creative Studio',
      { timeout: 12000 }
    )
  } catch { /* static decks (ContentPackages) are fine */ }
  await page.waitForTimeout(1500)

  // Read total slide count from the counter in the controls bar
  const total = await page.evaluate(() => {
    const counter = document.querySelector('[class*="counter"]')
    if (!counter) return 1
    const m = counter.textContent.match(/\/\s*0*(\d+)/)
    return m ? parseInt(m[1]) : 1
  })

  process.stdout.write(` ${total} slides...`)

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [W, H],
    compress: true,
  })

  for (let i = 1; i <= total; i++) {
    if (i > 1) {
      await page.goto(`${BASE_URL}${deck.path}?slide=${i}`, { waitUntil: 'load' })
      await page.waitForTimeout(600)
    }

    // Screenshot the slide frame only (excludes the controls bar at bottom)
    const frameEl = page.locator('[class*="slideFrame"]').first()
    const screenshot = await frameEl.screenshot({ type: 'jpeg', quality: JPEG_QUALITY })
    const b64 = `data:image/jpeg;base64,${screenshot.toString('base64')}`

    if (i > 1) pdf.addPage([W, H], 'landscape')
    pdf.addImage(b64, 'JPEG', 0, 0, W, H)

    process.stdout.write('.')
  }

  const buf = Buffer.from(pdf.output('arraybuffer'))
  fs.writeFileSync(path.join(OUTPUT_DIR, deck.file), buf)
  await page.close()

  const mb = (buf.length / 1024 / 1024).toFixed(1)
  console.log(` saved (${mb} MB)`)
}

await browser.close()
console.log(`\nAll PDFs → ${OUTPUT_DIR}`)
