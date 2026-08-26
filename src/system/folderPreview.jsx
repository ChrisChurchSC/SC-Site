import s from './system.module.css'
import { Icon } from './primitives'
import { CampaignCanvas } from './campaignCanvas'

/* Folder preview — what is in here, rendered.
 *
 * The web workflow this borrows from: you do not read a repo to find out what
 * the site looks like, you open the preview. A brand folder should work the
 * same way. Every asset in it renders as the thing it is — the tokens as
 * swatches, the mark at its real sizes, the copy as copy — composed into one
 * surface you can look at, rather than a list of filenames you have to open
 * one at a time in five different apps.
 *
 * Each block names its source file, so the preview is never a picture with no
 * provenance: you can always get from what you are looking at back to the file
 * that produced it.
 */
export function FolderPreview({ title, blocks = [], onOpenAsset }) {
  if (blocks.length === 0) {
    return (
      <div className={s.browserEmpty}>
        <span className={s.eyebrow}>Nothing to preview</span>
        <span className={s.browserEmptyLine}>No asset in here renders to a page yet.</span>
      </div>
    )
  }

  return (
    <div className={s.fp}>
      {blocks.map((b, i) => (
        <section key={i} className={s.fpBlock}>
          <button
            type="button"
            className={s.fpSource}
            onClick={() => onOpenAsset?.(b.from)}
            title={`Open ${b.from}`}
          >
            <Icon name={b.icon ?? 'file'} size={12} />{b.from}
          </button>
          <Block block={b} />
        </section>
      ))}
      {title && <p className={s.fpFoot}>Rendered from {blocks.length} of the files in {title}.</p>}
    </div>
  )
}

function Block({ block: b }) {
  if (b.kind === 'swatches') {
    return (
      <div className={s.fpSwatches}>
        {b.colours.map((c) => (
          <span key={c.name} className={s.fpSwatch}>
            <span className={s.fpChip} style={{ background: c.value }} />
            <span className={s.fpChipName}>{c.name}</span>
            <span className={s.fpChipValue}>{c.value}</span>
          </span>
        ))}
      </div>
    )
  }

  /* The mark at the sizes the guidance argues about, so "the counter fills in
     below 24px" is a thing you can see rather than a claim you take on. */
  if (b.kind === 'mark') {
    return (
      <div className={s.fpMarks}>
        {b.sizes.map((px) => (
          <span key={px} className={s.fpMark}>
            <span className={s.fpMarkArt} style={{ width: px, height: px }}>
              <Icon name="brand" size={px} />
            </span>
            <span className={s.fpChipValue}>{px}px</span>
          </span>
        ))}
      </div>
    )
  }

  if (b.kind === 'type') {
    return (
      <div className={s.fpType}>
        {b.steps.map((t) => (
          <span key={t.name} className={s.fpTypeRow}>
            <span className={s.fpTypeSpec}>{t.name} · {t.size}</span>
            <span className={s.fpTypeSample} style={{ fontSize: t.size, fontFamily: t.mono ? 'var(--sc-font-mono)' : 'var(--sc-font-display)' }}>
              {t.sample}
            </span>
          </span>
        ))}
      </div>
    )
  }

  if (b.kind === 'copy') {
    return (
      <div className={s.fpCopy}>
        {b.lines.map((l, i) => (
          l.h
            ? <h3 key={i} className={s.fpCopyH}>{l.h}</h3>
            : <p key={i} className={s.fpCopyP}>{l.p}</p>
        ))}
      </div>
    )
  }

  /* Artwork at its real aspect, labelled with the ratio — a social kit is a
     set of shapes before it is a set of pictures. */
  if (b.kind === 'art') {
    return (
      <div className={s.fpArt}>
        {b.tiles.map((t) => (
          <span key={t.label} className={s.fpTile}>
            <span className={s.fpTileArt} style={{ aspectRatio: t.ratio }} />
            <span className={s.fpChipName}>{t.label}</span>
            <span className={s.fpChipValue}>{t.ratio.replace('/', ':')}</span>
          </span>
        ))}
      </div>
    )
  }

  if (b.kind === 'table') {
    return (
      <div className={s.fpTableWrap}>
        <table className={s.fpTable}>
          <thead>
            <tr>{b.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, i) => (
                  i === 0
                    ? <th key={i} scope="row">{cell}</th>
                    : <td key={i} className={cell === '—' ? s.fpTableNil : undefined}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (b.kind === 'canvas') return <CampaignCanvas canvas={b.canvas} dense />

  return null
}
