/* Icon paths — a 16px grid, 1.25px strokes, butt caps and miter joins, every
 * terminal on a whole pixel. Geometry only: no tapers, no rounded corners, no
 * optical curves. Closer to a technical drawing than to an app icon.
 *
 * Path data rather than components, so the set is one import and a consumer
 * can tree-shake or subset it without touching the renderer.
 */
export const ICONS = {
  'arrow-right': 'M2 8h12M9 3l5 5-5 5',
  'arrow-left': 'M14 8H2M7 3L2 8l5 5',
  'arrow-up': 'M8 14V2M3 7l5-5 5 5',
  'arrow-down': 'M8 2v12M3 9l5 5 5-5',
  'chevron-right': 'M6 3l5 5-5 5',
  'chevron-left': 'M10 3L5 8l5 5',
  'chevron-down': 'M3 6l5 5 5-5',
  'chevron-up': 'M3 10l5-5 5 5',
  close: 'M3 3l10 10M13 3L3 13',
  plus: 'M8 2v12M2 8h12',
  minus: 'M2 8h12',
  check: 'M2 8.5l4 4L14 4',
  menu: 'M2 4h12M2 8h12M2 12h12',
  search: 'M7 12a5 5 0 100-10 5 5 0 000 10M10.5 10.5L14 14',
  external: 'M9 2h5v5M14 2L7 9M12 9v5H2V4h5',
  copy: 'M5 5h9v9H5zM11 5V2H2v9h3',
  download: 'M8 2v9M4 7l4 4 4-4M2 14h12',
  upload: 'M8 11V2M4 6l4-4 4 4M2 14h12',
  link: 'M6.5 9.5l3-3M6 4l1.5-1.5a3 3 0 014 4L10 8M10 12l-1.5 1.5a3 3 0 01-4-4L6 8',
  refresh: 'M14 3v4h-4M13.2 9A5.5 5.5 0 112.5 8',
  filter: 'M2 3h12l-4.5 5.5V13L6.5 11V8.5z',
  sort: 'M4 12V3M2 5l2-2 2 2M8 4h6M8 8h4M8 12h2',
  info: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 7.5v4M8 5h.01',
  warning: 'M8 2l6 11H2zM8 6.5v3M8 11.5h.01',
  error: 'M8 14A6 6 0 108 2a6 6 0 000 12M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4',
  success: 'M8 14A6 6 0 108 2a6 6 0 000 12M5.2 8l2 2 3.6-3.6',
  clock: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 4.5V8l2.5 1.5',
  lock: 'M4 7h8v7H4zM6 7V5a2 2 0 014 0v2',
  play: 'M4 2l9 6-9 6z',
  pause: 'M5 3v10M11 3v10',
  image: 'M2 3h12v10H2zM2 10l3.5-3.5L9 10l2-2 3 3M5.5 5.5h.01',
  video: 'M2 4h9v8H2zM11 7l3-2v6l-3-2',
  file: 'M4 2h5l3 3v9H4zM9 2v3h3',
  /* Folder closed and open. The open state tilts the front face rather than
     adding an arrow — a folder that needs a glyph to say "open" is a folder
     drawn wrong. */
  /* Request states. An open request is a ring with a dot — deliberately not a
     tick or a cross, because "waiting" is a state of its own and borrowing
     either of those glyphs pre-judges the outcome. */
  request: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3',
  merged: 'M4.5 5.5a2 2 0 100-3 2 2 0 000 3M4.5 13.5a2 2 0 100-3 2 2 0 000 3M11.5 9.5a2 2 0 100-3 2 2 0 000 3M4.5 5.5v5M6.5 8h3',
  draft: 'M4.5 5.5a2 2 0 100-3 2 2 0 000 3M4.5 13.5a2 2 0 100-3 2 2 0 000 3M4.5 5.5v5M11.5 3.5v1M11.5 7.5v1M11.5 11.5v1',
  commit: 'M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5M8 2v3.5M8 10.5V14',
  comment: 'M2 3h12v8H8.5L5 14v-3H2z',
  checklist: 'M2 4.5L3.5 6 6 3M2 10.5L3.5 12 6 9M8.5 4.5H14M8.5 10.5H14',
  diff: 'M4 2h5l3 3v9H4zM9 2v3h3M8 7.5v3M6.5 9h3M6.5 12h3',
  archive: 'M2 3h12v3H2zM3 6v8h10V6M6.5 9h3',
  eye: 'M8 12c3.5 0 6-4 6-4s-2.5-4-6-4-6 4-6 4 2.5 4 6 4M8 9.8A1.8 1.8 0 108 6.2a1.8 1.8 0 000 3.6',
  folder: 'M2 4h4l1.5 2H14v8H2z',
  'folder-open': 'M2 4h4l1.5 2H14v2H5l-2 6H2zM3 14l2-6h9.5l-2 6z',
  calendar: 'M2 4h12v10H2zM2 7h12M5 2v3M11 2v3',
  mail: 'M2 4h12v8H2zM2 4l6 5 6-5',
  user: 'M8 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4',
  chart: 'M2 2v12h12M5 11V7M8 11V4M11 11V9',
  grid: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  list: 'M2 4h1M2 8h1M2 12h1M6 4h8M6 8h8M6 12h8',
  sliders: 'M3 3v10M8 3v10M13 3v10M1.5 6h3M6.5 10h3M11.5 5h3',
  /* Product-specific marks. Kept in the same set rather than a second one:
     two icon sets in one product is how weight and grid drift apart. */
  brand: 'M8 2l5.5 3v6L8 14 2.5 11V5z',
  type: 'M3 3h10M8 3v10M5.5 13h5',
  target: 'M8 14A6 6 0 108 2a6 6 0 000 12M8 11.5A3.5 3.5 0 108 4.5a3.5 3.5 0 000 7M8 8h.01',
  channel: 'M3 8a5 5 0 015-5M3 8a5 5 0 005 5M13 8a5 5 0 00-5-5M13 8a5 5 0 01-5 5M8 3v10',
  layers: 'M8 2l6 3-6 3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3',
  route: 'M4 13a2 2 0 100-4 2 2 0 000 4M12 7a2 2 0 100-4 2 2 0 000 4M12 7v2a3 3 0 01-3 3H7',
}
