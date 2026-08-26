import { useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton } from './primitives'

/* Previews — what a file looks like without opening the app that made it.
 *
 * The rule these follow: a preview renders the document's real structure, not
 * a grey skeleton standing in for it. A row of placeholder bars tells you a
 * file exists, which you already knew from the listing. Headings at their real
 * size, frames at their real proportions and a waveform with real peaks tell
 * you whether this is the thing you were looking for, which is the only
 * question a preview is asked.
 */

/* ── PDF ───────────────────────────────────────────────────────────────────
   A thumbnail rail and one page, because that is how a deck is actually read:
   you scan for the page you half-remember, then look at it. Page-at-a-time
   with only next/previous makes you walk past everything to find anything. */
export function PdfPreview({ pages = [], title }) {
  const [page, setPage] = useState(0)
  const current = pages[page]
  if (!current) return null

  const go = (n) => setPage(Math.min(pages.length - 1, Math.max(0, n)))

  return (
    <div className={s.pdf}>
      <div className={s.pdfRail} role="tablist" aria-label="Pages">
        {pages.map((p, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === page}
            className={`${s.pdfThumb} ${i === page ? s.pdfThumbOn : ''}`}
            onClick={() => setPage(i)}
          >
            <span className={s.pdfThumbPage}>
              <PdfBlocks blocks={p.blocks} mini />
            </span>
            <span className={s.pdfThumbNum}>{i + 1}</span>
          </button>
        ))}
      </div>

      <div className={s.pdfStage}>
        <div className={s.pdfToolbar}>
          <span className={s.pdfTitle}>
            <Icon name="file" size={13} />{title}
          </span>
          <span className={s.pdfPager}>
            <IconButton icon="chevron-left" label="Previous page" size={13} onClick={() => go(page - 1)} />
            <span className={s.pdfCount}>{page + 1} / {pages.length}</span>
            <IconButton icon="chevron-right" label="Next page" size={13} onClick={() => go(page + 1)} />
          </span>
        </div>

        <div className={s.pdfPage}>
          <PdfBlocks blocks={current.blocks} />
          <span className={s.pdfFolio}>{page + 1}</span>
        </div>
      </div>
    </div>
  )
}

/* The page itself. Four block kinds is enough to render a deck honestly:
   a title, a line of body, a rule and a placed image. */
function PdfBlocks({ blocks = [], mini }) {
  return (
    <div className={`${s.pdfBody} ${mini ? s.pdfBodyMini : ''}`}>
      {blocks.map((b, i) => {
        if (b.kind === 'rule') return <span key={i} className={s.pdfRule} />
        if (b.kind === 'image') {
          return <span key={i} className={s.pdfImage} style={{ height: mini ? 22 : 120 }} />
        }
        if (b.kind === 'h') return <span key={i} className={s.pdfH}>{b.text}</span>
        if (b.kind === 'eyebrow') return <span key={i} className={s.pdfEyebrow}>{b.text}</span>
        return <span key={i} className={s.pdfP}>{b.text}</span>
      })}
    </div>
  )
}

/* ── Canvas ────────────────────────────────────────────────────────────────
   An artboard with placed frames. Selecting one names it and gives its size,
   which is the pair of facts a canvas is opened for — everything else is a
   reason to open the file properly. */
export function CanvasPreview({ frames = [], width = 1600, height = 900, label }) {
  const [picked, setPicked] = useState(null)
  const frame = frames.find((f) => f.name === picked) ?? null

  return (
    <div className={s.canvasWrap}>
      <div className={s.canvasBar}>
        <span className={s.canvasName}>
          <Icon name="grid" size={13} />{label} · {frames.length} frames
        </span>
        <span className={s.canvasPicked}>
          {frame
            ? <>{frame.name} <span className={s.canvasDims}>{frame.w} × {frame.h}</span></>
            : 'Nothing selected'}
        </span>
      </div>

      {/* The board keeps its true ratio and is capped by height, not width —
          a 16:9 artboard given the full column is 700px tall and pushes
          everything else off the screen. Capping the width to whatever that
          ratio needs at 420px tall gets both. */}
      <div
        className={s.canvas}
        style={{ aspectRatio: `${width} / ${height}`, maxWidth: `${(width / height) * 420}px` }}
      >
        {frames.map((f) => (
          <button
            key={f.name}
            type="button"
            aria-pressed={picked === f.name}
            className={`${s.artFrame} ${picked === f.name ? s.artFrameOn : ''}`}
            style={{
              left: `${(f.x / width) * 100}%`,
              top: `${(f.y / height) * 100}%`,
              width: `${(f.w / width) * 100}%`,
              height: `${(f.h / height) * 100}%`,
            }}
            onClick={() => setPicked(picked === f.name ? null : f.name)}
          >
            <span className={s.artFrameLabel}>{f.name}</span>
            <span className={`${s.artFrameFill} ${f.tone ? s[`artFrameFill${f.tone}`] : ''}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Waveform ──────────────────────────────────────────────────────────────
   Audio is the one asset with no visual form at all, which is exactly why it
   needs one: a sting you cannot see the shape of is a filename. */
export function WavePreview({ peaks = [], duration, label }) {
  const [at, setAt] = useState(0)
  return (
    <div className={s.waveWrap}>
      <div className={s.canvasBar}>
        <span className={s.canvasName}><Icon name="video" size={13} />{label}</span>
        <span className={s.canvasPicked}>
          {(at * (duration ?? 0)).toFixed(2)}s <span className={s.canvasDims}>of {duration}s</span>
        </span>
      </div>
      <div className={s.wave}>
        {peaks.map((p, i) => (
          <button
            key={i}
            type="button"
            className={`${s.wavePeak} ${i / peaks.length <= at ? s.wavePeakOn : ''}`}
            style={{ height: `${Math.max(4, p * 100)}%` }}
            aria-label={`Seek to ${((i / peaks.length) * (duration ?? 0)).toFixed(2)} seconds`}
            onClick={() => setAt(i / peaks.length)}
          />
        ))}
      </div>
    </div>
  )
}
