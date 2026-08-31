/* WHAT THE BRAND KNOWS, MEASURED. Every line below was read off the SC-Brand
 * working copy on 2026-08-31 by opening the file — no figure here is estimated
 * by hand or rounded to look better.
 *
 * TOKENS ARE AN APPROXIMATION, which the tilde in front of the total on screen
 * is there to say. One token to four characters is the standard English rule
 * of thumb; the real count depends on the tokenizer, so these are the right
 * ORDER and the right RELATIVE SIZE rather than a number to quote at anybody.
 *
 * SHAPE IS THE THUMBNAIL, and it is also measured. Ten real line lengths from
 * the top of the file as a fraction of a 78-column line, so a preview of prose
 * looks like prose and a preview of a stylesheet looks like a stylesheet —
 * because it is drawing the actual text rather than a plausible pattern.
 *
 * ART is set on the four files in this repo that ARE pictures. They are the
 * only images SC-Brand holds: Visual/public/imagery/ says in its own README
 * that it is empty. Anything else would have meant attaching decorative
 * photography to a markdown file and calling it a preview.
 *
 * WHAT IS LEFT OUT, and why. Fonts and other binaries carry no tokens at all —
 * a model reading an .otf reads nothing. Lock files, build config and the
 * styleguide app's own components are the viewer rather than the thing viewed.
 * Visual/src/system/tokens.css stays in because it holds values, not markup.
 *
 * REGENERATE rather than edit: the point of the file is that it matches the
 * repo.
 */
export const corpus = [
  { path: "Visual/src/lib/designTokens.js", tokens: 7483, shape: [0.54, 0.12, 0.94, 0.95, 1, 0.97, 0.35, 0.12, 0.95, 0.97] },
  { path: "Strategy/verticals/fintech.md", tokens: 6244, shape: [0.12, 1, 0.92, 1, 0.58, 0.12, 0.5, 1, 1, 1] },
  { path: "Strategy/verticals/cyber-security.md", tokens: 5745, shape: [0.19, 1, 0.92, 1, 0.71, 0.12, 0.5, 1, 1, 1] },
  { path: "Strategy/verticals/health-tech.md", tokens: 5146, shape: [0.17, 1, 0.92, 0.12, 0.5, 1, 1, 1, 0.88, 1] },
  { path: "Verbal/social/linkedin-2026-08.md", tokens: 4214, shape: [0.37, 0.55, 1, 0.96, 0.12, 0.46, 1, 1, 1, 1] },
  { path: "Visual/public/logo/sc-logotype.svg", tokens: 4055, art: "/memory-thumbs/sc-logotype.svg", shape: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.12] },
  { path: "Verbal/tone-of-voice.md", tokens: 3658, shape: [0.42, 0.45, 0.85, 0.97, 0.51, 0.82, 0.12, 0.26, 1, 0.87] },
  { path: "Visual/public/logo/logo-wordmark.svg", tokens: 3607, art: "/memory-thumbs/logo-wordmark.svg", shape: [1, 0.18, 1, 1, 1, 1, 1, 1, 1, 1] },
  { path: "Strategy/customer-language.md", tokens: 3603, shape: [0.24, 0.82, 1, 0.27, 0.96, 0.12, 0.29, 1, 1, 0.38] },
  { path: "Verbal/social/content-calendar-2026-08.md", tokens: 2894, shape: [0.47, 1, 0.86, 1, 0.88, 0.12, 0.42, 1, 1, 1] },
  { path: "Verbal/capabilities-deck.md", tokens: 2880, shape: [0.24, 0.73, 1, 1, 1, 1, 1, 0.9, 0.12, 0.15] },
  { path: "Strategy/verticals/README.md", tokens: 2696, shape: [0.35, 0.82, 1, 0.9, 0.99, 0.9, 1, 0.12, 0.49, 1] },
  { path: "Strategy/proof-points.md", tokens: 2526, shape: [0.18, 0.77, 1, 1, 1, 0.97, 0.12, 0.26, 1, 1] },
  { path: "Visual/src/system/tokens.css", tokens: 2273, shape: [0.54, 0.12, 0.99, 0.97, 0.4, 0.12, 0.56, 0.12, 1, 0.72] },
  { path: "Strategy/evidence-pass-findings.md", tokens: 2270, shape: [0.33, 1, 1, 0.37, 1, 1, 0.44, 0.12, 0.23, 1] },
  { path: "Strategy/audience.md", tokens: 2041, shape: [0.13, 0.63, 1, 0.68, 0.92, 0.41, 0.82, 0.12, 0.33, 1] },
  { path: "Agents/media-strategist.md", tokens: 1722, shape: [0.12, 0.28, 1, 1, 0.14, 0.17, 0.12, 1, 1, 0.63] },
  { path: "Agents/studio-ops.md", tokens: 1608, shape: [0.12, 0.21, 1, 1, 0.14, 0.17, 0.12, 1, 1, 0.99] },
  { path: "Agents/README.md", tokens: 1517, shape: [0.31, 1, 0.81, 0.15, 1, 0.51, 0.12, 0.96, 0.97, 0.87] },
  { path: "Strategy/messaging-house.md", tokens: 1458, shape: [0.22, 0.88, 0.56, 1, 0.12, 0.58, 1, 1, 1, 1] },
  { path: "Strategy/competitive-landscape.md", tokens: 1344, shape: [0.29, 0.95, 1, 0.96, 0.12, 0.33, 1, 1, 0.37, 1] },
  { path: "Strategy/README.md", tokens: 1273, shape: [0.13, 0.97, 0.36, 0.33, 0.81, 1, 1, 0.73, 0.36, 0.17] },
  { path: "Agents/sales-analyst.md", tokens: 1251, shape: [0.12, 0.24, 1, 1, 0.17, 0.15, 0.12, 1, 1, 0.14] },
  { path: "Agents/design-critic.md", tokens: 1118, shape: [0.12, 0.24, 1, 0.37, 0.17, 0.14, 0.12, 1, 1, 0.44] },
  { path: "Agents/brand-strategist.md", tokens: 980, shape: [0.12, 0.28, 1, 0.73, 0.14, 0.17, 0.12, 1, 1, 0.27] },
  { path: "Agents/comms-writer.md", tokens: 944, shape: [0.12, 0.23, 1, 0.46, 0.14, 0.14, 0.12, 1, 0.21, 0.31] },
  { path: "Visual/README.md", tokens: 859, shape: [0.42, 0.94, 0.99, 0.71, 0.12, 0.14, 0.65, 0.12, 0.18, 0.12] },
  { path: "Strategy/positioning.md", tokens: 830, shape: [0.5, 0.13, 1, 0.31, 1, 0.21, 0.33, 1, 1, 0.91] },
  { path: "Visual/public/logo/README.md", tokens: 559, shape: [0.12, 1, 1, 0.36, 0.4, 0.17, 1, 1, 1, 1] },
  { path: "Data/Super-Conscious Metrics - Data.csv", tokens: 551, shape: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { path: "Visual/public/logo/logo.svg", tokens: 535, art: "/memory-thumbs/logo.svg", shape: [1, 1, 0.12, 0, 0, 0, 0, 0, 0, 0] },
  { path: "Visual/public/logo/sc-mark.svg", tokens: 441, art: "/memory-thumbs/sc-mark.svg", shape: [1, 0.55, 0.4, 1, 0.12, 0.12, 0.32, 1, 0.14, 0.12] },
  { path: "Visual/public/imagery/README.md", tokens: 434, shape: [0.12, 1, 0.99, 1, 0.77, 0.26, 1, 1, 0.97, 0.18] },
]

/* 33 files, ~78,759 tokens, measured 2026-08-31. */
export const corpusTotal = 78759
export const corpusMeasured = '2026-08-31'
