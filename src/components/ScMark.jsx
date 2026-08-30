import { useId } from 'react'

/**
 * THE SUPER CONSCIOUS MARK, in one place.
 *
 * Inlined rather than an <img> because the path is fill="currentColor" — it
 * takes its colour from whatever it sits in, which an <img> cannot do.
 *
 * THE CLIP ID IS GENERATED. Three places draw this now (the comparison
 * table, the design bento and the condensed nav) and duplicate ids in one
 * document cross-clip: two marks on one page and the second one vanishes.
 * useId gives each instance its own, which is the whole reason this is a
 * component rather than a copied snippet.
 *
 * viewBox is cropped to the mark's own bounds. The asset's is 0 0 75 75 with
 * the shape inset, which renders it about a third smaller than whatever it
 * sits beside.
 */
export default function ScMark({ className, size, ...rest }) {
  const clip = `sc-mark-${useId().replace(/:/g, '')}`

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="11 11 52 52"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      <g clipPath={`url(#${clip})`}>
        <path d="M58.07 43.71L56.14 30.12C56.09 29.78 56.03 29.45 55.96 29.12C55.96 29.06 55.94 29 55.92 28.94C55 24.68 52.72 20.81 49.4 17.93C45.74 14.75 41.04 13 36.19 13C26.5 13 18.39 19.86 16.45 28.97C16.45 28.97 16.45 28.99 16.45 29C16.16 30.35 16.01 31.75 16.01 33.19C16.01 39.84 17.82 44.38 19.41 48.39C20.72 51.69 21.86 54.54 21.86 58.02C21.86 58.73 21.86 59.36 21.86 59.36V61.57C21.85 61.75 21.92 61.92 22.04 62.05C22.17 62.18 22.34 62.25 22.51 62.25H34.2C34.2 62.25 34.21 62.25 34.22 62.25H38.17C38.17 62.25 38.17 62.25 38.18 62.25H48.15C48.33 62.25 48.5 62.18 48.62 62.06C48.74 61.94 48.82 61.76 48.82 61.59V56.58H52.74C53.55 56.58 54.2 55.92 54.2 55.12V45.11H56.88C57.23 45.11 57.57 44.96 57.8 44.69C58.03 44.42 58.13 44.07 58.08 43.73L58.07 43.71ZM36.19 14.34C40.72 14.34 45.1 15.97 48.53 18.94C51.45 21.47 53.5 24.81 54.45 28.5H17.93C20.02 20.36 27.41 14.34 36.19 14.34ZM34.62 60.9L29.62 51.44H42.77L37.77 60.9H34.62ZM43.48 50.1H28.91L23.91 40.63H48.48L43.48 50.1ZM49.19 39.3H23.2L18.2 29.83H54.19L49.19 39.3ZM20.65 47.89C19.1 44 17.34 39.58 17.34 33.19C17.34 32.54 17.37 31.89 17.44 31.26L22.21 40.28L27.92 51.08L33.11 60.9H23.18V59.36C23.18 59.36 23.18 58.73 23.18 58.01C23.18 54.27 21.94 51.17 20.64 47.89H20.65ZM53.53 43.76C53.16 43.76 52.86 44.06 52.86 44.43V55.11C52.86 55.18 52.8 55.24 52.73 55.24H48.14C47.77 55.24 47.47 55.54 47.47 55.91V60.92H39.27L44.46 51.1L50.17 40.3L54.94 31.27L56.71 43.78H53.52L53.53 43.76Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id={clip}>
          <rect width="42.09" height="49.24" fill="white" transform="translate(16 13)" />
        </clipPath>
      </defs>
    </svg>
  )
}
