import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

async function toBlobUrl(src) {
  try {
    const res = await fetch(src, { mode: 'cors', cache: 'no-cache' })
    if (!res.ok) return null
    return URL.createObjectURL(await res.blob())
  } catch {
    return null
  }
}

export async function generateDeckPdf(containerRef, filename = 'deck.pdf') {
  const slides = containerRef.querySelectorAll('[data-print-slide]')
  if (!slides.length) return

  const first = slides[0]
  const w = first.offsetWidth
  const h = first.offsetHeight

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [w, h],
    compress: true,
  })

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]

    // Swap cross-origin img srcs for same-origin blob URLs so the canvas isn't tainted
    const imgs = Array.from(slide.querySelectorAll('img[src]'))
    const origSrcs = imgs.map(img => img.src)
    const blobUrls = await Promise.all(imgs.map(img => toBlobUrl(img.src)))
    imgs.forEach((img, j) => { if (blobUrls[j]) img.src = blobUrls[j] })

    await new Promise(r => setTimeout(r, 80))

    const canvas = await html2canvas(slide, {
      scale: 2,
      useCORS: false,
      allowTaint: false,
      backgroundColor: '#0e0e0e',
      logging: false,
      width: w,
      height: h,
      ignoreElements: el => el.tagName === 'VIDEO' || el.tagName === 'IFRAME',
    })

    imgs.forEach((img, j) => { img.src = origSrcs[j] })
    blobUrls.forEach(url => { if (url) URL.revokeObjectURL(url) })

    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    if (i > 0) pdf.addPage([w, h], 'landscape')
    pdf.addImage(imgData, 'JPEG', 0, 0, w, h)
  }

  pdf.save(filename)
}
