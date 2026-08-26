import { useState } from 'react'
import { useMeta } from '../hooks/useMeta'
import '../system/tokens.css'
import {
  Shell, GlobalBar, BarButton, Sidebar, Content, Grid, Col, useSidebar,
  Panel, StatTile, Button, IconButton, Banner, Avatar, Icon,
  SectionNav, Segmented, Field, Input, Switch,
  Tree, Path, FileBrowser, FileView, CodeLines, MediaPreview,
  RequestList, RequestDetail, ActivityFeed, Wiki,
  PdfPreview, CanvasPreview, WavePreview,
  Contributors, CompositionBar, AsideBlock, FactRow, StatusList,
  TitleBar, CountButton, RefSelect, FindField,
  LineChart, BarChart, RankedBar, Donut,
} from '../system'
import headMark from '../assets/logo.svg'
import WIKI from '../data/wikiPages'
import styles from './Dashboard.module.css'

/* A brand workspace, browsed as a folder tree.
 *
 * Built entirely from src/system — this page writes almost no CSS of its own,
 * which is the proof that the package is importable rather than a drawing of
 * itself.
 *
 * The repo-listing pattern earns its place here rather than being borrowed for
 * the look: brand assets genuinely are a tree, and the pattern answers what is
 * in here, what moved most recently and who moved it, all without a click.
 *
 * Internal, noindex, not in the sitemap.
 */

/* One source of truth for the tree and the browser, so a folder cannot exist
   in the sidebar and be missing from the listing.

   Brand is split by the material it is made of, not by the department that
   makes it: visual, verbal, channels, data, audio. Strategy is deliberately
   not a sibling — it is the reason the other five look the way they do, and
   filing it beside them makes it look like one more deliverable. */
const FS = {
  brand: {
    label: 'Brand', icon: 'brand',
    children: {
      visual: {
        label: 'Visual', icon: 'brand', message: 'Refit the logo lockup for small sizes', when: '2h',
        children: {
          /* A .fig opens onto its artboard, a .pdf onto its pages and a .wav
             onto its waveform. Filing every one of them behind a grey plate
             tells you the file exists, which the listing already told you. */
          'logo-lockup.fig': {
            message: 'Refit for small sizes', when: '2h', status: 'Live', icon: 'image',
            render: 'canvas',
            canvas: {
              label: 'logo-lockup.fig', width: 1600, height: 900,
              frames: [
                { name: 'Primary — horizontal', x: 80, y: 90, w: 620, h: 200, tone: 'art' },
                { name: 'Primary — stacked', x: 760, y: 90, w: 300, h: 300, tone: 'art' },
                { name: 'Mark only', x: 1120, y: 90, w: 300, h: 300, tone: 'plate' },
                { name: 'Small size — 24px', x: 80, y: 460, w: 300, h: 100, tone: 'type' },
                { name: 'Small size — 16px', x: 440, y: 460, w: 220, h: 70, tone: 'type' },
                { name: 'Clear space', x: 760, y: 460, w: 660, h: 300, tone: 'plate' },
              ],
            },
          },
          'brand-guidelines.pdf': {
            message: 'Regenerated from the token file', when: '4h', status: 'Live', icon: 'file',
            render: 'pdf',
            pdf: {
              file: 'brand-guidelines.pdf',
              pages: [
                { blocks: [
                  { kind: 'eyebrow', text: 'Super Conscious · v2.1' },
                  { kind: 'h', text: 'Brand guidelines' },
                  { kind: 'rule' },
                  { kind: 'p', text: 'Generated from the token file. If this document and the tokens disagree, the tokens are right and this is stale.' },
                ] },
                { blocks: [
                  { kind: 'eyebrow', text: 'The mark' },
                  { kind: 'h', text: 'Clear space is half the mark height' },
                  { kind: 'image' },
                  { kind: 'p', text: 'On all four sides, at every size. Below 24px use the small-size lockup — the counter fills in otherwise.' },
                ] },
                { blocks: [
                  { kind: 'eyebrow', text: 'Colour' },
                  { kind: 'h', text: 'Two accents' },
                  { kind: 'p', text: 'Pink and purple. Teal and blue were declared for two years and used nowhere, so they were removed rather than found work for.' },
                  { kind: 'rule' },
                  { kind: 'p', text: 'Charts get three categorical slots. A fourth either leaves the lightness band or fails colour-vision separation against the other two.' },
                ] },
                { blocks: [
                  { kind: 'eyebrow', text: 'Type' },
                  { kind: 'h', text: 'A serif for people, a mono for machines' },
                  { kind: 'p', text: 'Signifier carries anything a person wrote. Roboto Mono carries anything a machine produced — timestamps, hashes, counts, file names.' },
                  { kind: 'rule' },
                  { kind: 'p', text: 'It means a number never has to explain where it came from.' },
                ] },
              ],
            },
          },
          'colour-tokens.json': {
            message: 'Retire teal and blue', when: '1d', status: 'Live', icon: 'file',
            text: `{
  "ground":  "#0a0a0a",
  "card":    "#161616",
  "accent": {
    "pink":   "#df4ed6",
    "purple": "#7d5ae0"
  },
  "retired": ["teal", "blue"]
}`,
          },
          'type-scale.fig': { message: 'Drop the 3px radius step', when: '3d', status: 'Live', icon: 'image' },
          'grid-system.fig': {
            message: 'Document the 5px gutter', when: '1w', status: 'Live', icon: 'image',
            render: 'canvas',
            canvas: {
              label: 'grid-system.fig', width: 1600, height: 900,
              frames: [
                { name: 'col 1', x: 80, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 2', x: 200, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 3', x: 320, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 4', x: 440, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 5', x: 560, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 6', x: 680, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 7', x: 800, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 8', x: 920, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 9', x: 1040, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 10', x: 1160, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 11', x: 1280, y: 90, w: 115, h: 700, tone: 'plate' },
                { name: 'col 12', x: 1400, y: 90, w: 115, h: 700, tone: 'plate' },
              ],
            },
          },
          'iconography.svg': { message: 'Forty marks on a 16px grid', when: '1w', status: 'Review', icon: 'image' },
        },
      },
      verbal: {
        label: 'Verbal', icon: 'type', message: 'Tighten the positioning clause', when: '1d',
        children: {
          'tone-of-voice.md': {
            message: 'Tighten the positioning clause', when: '1d', status: 'Live', icon: 'file',
            text: `# Tone of voice

We write like someone who has done the work and is
telling you what they found.

- Say the finding, then the evidence.
- No adjective doing a verb's job.
- If a sentence survives being cut, cut it.`,
          },
          'messaging-house.md': { message: 'Name the challenger brands', when: '4d', status: 'Live', icon: 'file' },
          'positioning.md': {
            message: 'Move into review', when: '1d', status: 'Review', icon: 'file',
            text: `# Positioning

For founders and marketing teams who need brand,
content and product to say the same thing.

Not an agency of record. A studio you bring in when
the system has to outlive the engagement.`,
          },
          'launch-narrative.md': { message: 'First pass, not reviewed', when: '2d', status: 'Draft', icon: 'file' },
        },
      },
      channels: {
        label: 'Channels', icon: 'channel', message: 'Draft the channel matrix', when: '5d',
        children: {
          'channel-matrix.md': { message: 'Draft, awaiting sign-off', when: '5d', status: 'Draft', icon: 'file' },
          'social-kit.fig': { message: 'Most-used asset this quarter', when: '6h', status: 'Live', icon: 'image' },
          'audience.md': { message: 'Split founders from marketing teams', when: '2w', status: 'Live', icon: 'file' },
        },
      },
      /* Data is part of the brand, not a report about it: the chart palette,
         the number formats and the table rules are as much identity as the
         logo, and they drift the moment they live somewhere else. */
      data: {
        label: 'Data', icon: 'chart', message: 'Cap the categorical palette at three', when: '4h',
        children: {
          'chart-palette.json': {
            message: 'Cap the categorical palette at three', when: '4h', status: 'Live', icon: 'file',
            text: `{
  "categorical": ["#d94eb6", "#7d5ae0", "#a82a7e"],
  "sequential":  ["#231a49", "#342767", "#4a3891", "#6a51c4", "#9b86e6"],
  "note": "Three is the ceiling for two adjacent hues.",
  "floors": { "cvd_delta_e": 8, "contrast": 3 }
}`,
          },
          'number-formats.md': { message: 'One decimal on percentages', when: '1w', status: 'Live', icon: 'file' },
          'table-rules.md': { message: 'Hairlines, never zebra stripes', when: '2w', status: 'Live', icon: 'file' },
          'chart-anatomy.fig': { message: 'Marks, spacers and label rules', when: '2w', status: 'Review', icon: 'image' },
        },
      },
      /* Sound is the part nobody documents until somebody has already picked
         a stock track. It is here so there is something to point at. */
      audio: {
        label: 'Audio', icon: 'video', message: 'Cut the sting to 1.2s', when: '3d',
        children: {
          'brand-sting.wav': {
            message: 'Cut to 1.2s', when: '3d', status: 'Review', icon: 'video',
            render: 'wave',
            wave: {
              label: 'brand-sting.wav', duration: 1.2,
              peaks: [0.08, 0.14, 0.3, 0.62, 0.94, 0.86, 0.7, 0.58, 0.72, 0.88, 0.64, 0.46,
                0.38, 0.52, 0.44, 0.3, 0.36, 0.28, 0.2, 0.26, 0.18, 0.12, 0.14, 0.08, 0.05],
            },
          },
          'motion-timings.md': { message: 'Match the 0.15s UI easing', when: '1w', status: 'Live', icon: 'file' },
          'voice-guide.md': { message: 'Read pace and warmth for VO', when: '3w', status: 'Live', icon: 'file' },
        },
      },
    },
  },
}

/* The sidebar is the brand's own tree, derived from the same object as the
   listing so a folder cannot exist in one and be missing from the other. */
const TREE = [{
  key: 'brand',
  label: FS.brand.label,
  icon: FS.brand.icon,
  /* Folders, drawn as folders. They were carrying a discipline mark each — a
     hexagon, a T, a waveform — which made a rail of folders look like a rail
     of five unrelated tools. The discipline mark survives on the collapsed
     rail, where five identical folder glyphs would be five identical buttons. */
  children: Object.entries(FS.brand.children).map(([ck, c]) => ({
    key: `brand/${ck}`,
    label: c.label,
    icon: 'folder',
    railIcon: c.icon,
    count: c.children ? Object.keys(c.children).length : undefined,
  })),
}]

const ROOT = ['brand', 'visual']

const at = (path) =>
  path.reduce((node, seg) => node?.children?.[seg], { children: FS })

/* How big is this — a different question for text, a canvas, a deck and a
   sound file, and answered wrong for all four when one line covers them all. */
const fileMeta = (node, isText) => {
  if (!node) return []
  if (isText) return [`${node.text.split('\n').length} lines`, `${node.text.length} bytes`, node.status]
  if (node.render === 'canvas') {
    return [`${node.canvas.width} × ${node.canvas.height}`, `${node.canvas.frames.length} frames`, node.status]
  }
  if (node.render === 'pdf') return [`${node.pdf.pages.length} pages`, 'PDF', node.status]
  if (node.render === 'wave') return [`${node.wave.duration}s`, '48 kHz · WAV', node.status]
  return ['1600 × 1000', 'SVG', node.status]
}

/* Fails quietly: copying a path is a convenience, and a thrown promise in a
   webview with no clipboard permission is worse than nothing happening. */
const writeText = (t) => { try { navigator.clipboard?.writeText?.(t) } catch {} }

/* Review requests. Each is a proposed change to an asset with its own id,
   author, conversation and outcome — it outlives the file it changes, which
   is exactly what a status field on a file cannot do.

   The extra fields — revisions, checks, changed assets, a preview — exist
   because a reviewer is answering "should this go live", and that question is
   not answerable from a title and a thread. Where a code host would say
   commits, checks and files, a brand workspace says revisions, checks and
   assets: the same four questions asked of different material. */
const REVIEWS = [
  {
    id: 42,
    state: 'open',
    title: 'Refit the logo lockup for small sizes',
    asset: 'logo-lockup.fig',
    base: 'v2.1 — current',
    head: 'small-size-lockup',
    author: 'dana',
    opened: '2d',
    comments: 3,
    conflicts: false,
    labels: ['Visual', 'Blocking'],
    campaign: 'Q3 — Challenger positioning',
    reviewers: [
      { name: 'Chris Church', state: 'changes' },
      { name: 'Ravi Menon', state: 'open' },
    ],
    assignees: ['Dana Cole'],
    participants: ['Dana Cole', 'Chris Church', 'Ravi Menon'],
    summary: 'Optical sizes below 24px lost the counter in the mark. This adds a second lockup that opens it up, and brings the wordmark spacing with it.',
    preview: { note: 'Rendered at 16, 24, 32 and 64px against both surfaces.' },
    revisions: [
      { hash: 'a014ddf', title: 'Open the counter below 24px', who: 'dana', when: '2d', ok: true },
      { hash: '7c3b901', title: 'Thin the stroke to match the new counter', who: 'dana', when: '1d', ok: true },
      { hash: 'e88f2a6', title: 'Bring wordmark spacing up with the mark', who: 'dana', when: '4h', ok: true },
    ],
    checks: [
      { name: 'Contrast', state: 'pass', note: 'Mark clears 3:1 on both surfaces at every size.', took: '4s' },
      { name: 'Clear space', state: 'pass', note: 'Half the mark height on all four sides.', took: '2s' },
      { name: 'Small-size legibility', state: 'pass', note: 'Counter holds at 16px.', took: '9s' },
      { name: 'Preview build', state: 'pass', note: 'Rendered four sizes on two surfaces.', took: '31s' },
    ],
    files: [
      { name: 'logo-lockup.fig', icon: 'image', note: 'Second lockup added', added: 2, removed: 0 },
      { name: 'clear-space.md', icon: 'file', note: 'Rule restated for the small variant', added: 14, removed: 6 },
    ],
    timeline: [
      { kind: 'comment', who: 'dana', when: '2d', body: 'Below 24px the counter fills in and the mark reads as a blob. This adds a small-size variant with the counter opened up and the stroke thinned.' },
      { kind: 'pushed', who: 'dana', when: '1d', revisions: [
        { hash: 'a014ddf', title: 'Open the counter below 24px', who: 'dana', ok: true },
        { hash: '7c3b901', title: 'Thin the stroke to match the new counter', who: 'dana', ok: true },
      ] },
      { kind: 'comment', who: 'ravi', when: '1d', role: 'Reviewer', body: 'Checked it at 16px in the nav and it holds. One thing — the wordmark spacing needs to come up with it or they drift apart.' },
      { kind: 'changes', who: 'chris', when: '1d' },
      { kind: 'pushed', who: 'dana', when: '4h', revisions: [
        { hash: 'e88f2a6', title: 'Bring wordmark spacing up with the mark', who: 'dana', ok: true },
      ] },
      { kind: 'comment', who: 'dana', when: '4h', body: 'Spacing fixed. Both lockups now share the same optical gap.' },
    ],
  },
  {
    id: 41,
    state: 'approved',
    title: 'Retire teal and blue from the token set',
    asset: 'colour-tokens.json',
    base: 'v2.1 — current',
    head: 'retire-teal-blue',
    author: 'chris',
    opened: '3d',
    comments: 2,
    conflicts: false,
    labels: ['Visual'],
    campaign: null,
    reviewers: [{ name: 'Dana Cole', state: 'approved' }],
    assignees: ['Chris Church'],
    participants: ['Chris Church', 'Dana Cole'],
    summary: 'Both were declared in the token file and used nowhere. Removing them rather than finding work for them.',
    preview: { note: 'Every surface and chart re-rendered with the two values gone.' },
    revisions: [
      { hash: '4b2e77c', title: 'Remove --teal and --blue', who: 'chris', when: '3d', ok: true },
      { hash: '9df01a3', title: 'Point the two orphaned aliases at pink', who: 'chris', when: '3d', ok: true },
    ],
    checks: [
      { name: 'Unused tokens', state: 'pass', note: 'No references remain anywhere in the workspace.', took: '3s' },
      { name: 'Contrast', state: 'pass', note: 'No surface pairing changed.', took: '5s' },
      { name: 'Preview build', state: 'pass', note: '95 pages rendered.', took: '48s' },
    ],
    files: [
      { name: 'colour-tokens.json', icon: 'file', note: 'Two values removed, two aliases repointed', added: 4, removed: 18 },
    ],
    timeline: [
      { kind: 'comment', who: 'chris', when: '3d', body: 'Both are declared and used nowhere — zero references across the whole workspace. Removing rather than inventing a use.' },
      { kind: 'pushed', who: 'chris', when: '3d', revisions: [
        { hash: '4b2e77c', title: 'Remove --teal and --blue', who: 'chris', ok: true },
        { hash: '9df01a3', title: 'Point the two orphaned aliases at pink', who: 'chris', ok: true },
      ] },
      { kind: 'comment', who: 'dana', when: '2d', role: 'Reviewer', body: 'Agreed. Pink and purple carry everything we actually need, and the chart palette is the same two hues.' },
      { kind: 'approved', who: 'dana', when: '2d' },
    ],
  },
  {
    id: 40,
    state: 'changes',
    title: 'Draft the channel matrix',
    asset: 'channel-matrix.md',
    base: 'v2.1 — current',
    head: 'channel-matrix',
    author: 'ravi',
    opened: '5d',
    comments: 1,
    draft: true,
    conflicts: false,
    labels: ['Channels'],
    campaign: 'Q3 — Challenger positioning',
    reviewers: [{ name: 'Chris Church', state: 'changes' }],
    assignees: [],
    participants: ['Ravi Menon', 'Chris Church'],
    summary: 'First pass at which message runs where. Rows are channels, columns are the three messages.',
    preview: null,
    revisions: [
      { hash: '1a9c04e', title: 'First pass at the matrix', who: 'ravi', when: '5d', ok: false },
    ],
    checks: [
      { name: 'Tone', state: 'fail', note: 'Two cells use category language the messaging house retired.', took: '6s' },
      { name: 'Links', state: 'pass', note: 'All nine references resolve.', took: '2s' },
      { name: 'Preview build', state: 'running', note: 'Queued behind two other builds.', took: '—' },
    ],
    files: [
      { name: 'channel-matrix.md', icon: 'file', note: 'New file', added: 62, removed: 0 },
    ],
    timeline: [
      { kind: 'comment', who: 'ravi', when: '5d', body: 'First pass. Rows are channels, columns are the three messages. Left it as a draft — the paid column is guesswork until we have the spend split.' },
      { kind: 'changes', who: 'chris', when: '4d' },
    ],
  },
  {
    id: 38,
    state: 'merged',
    title: 'Name the challenger brands in the messaging house',
    asset: 'messaging-house.md',
    base: 'v2.0',
    head: 'name-the-challengers',
    author: 'dana',
    opened: '2w',
    comments: 4,
    conflicts: false,
    labels: ['Verbal'],
    campaign: 'Q3 — Challenger positioning',
    reviewers: [
      { name: 'Chris Church', state: 'approved' },
      { name: 'Ravi Menon', state: 'approved' },
    ],
    assignees: ['Dana Cole'],
    participants: ['Dana Cole', 'Chris Church', 'Ravi Menon'],
    summary: 'Replaces the abstract category language with the actual names.',
    preview: { note: 'Published to the workspace 11 days ago.' },
    revisions: [
      { hash: 'c71b508', title: 'Name the four challengers', who: 'dana', when: '2w', ok: true },
      { hash: '2e6a90d', title: 'Rewrite the proof line under each', who: 'dana', when: '12d', ok: true },
    ],
    checks: [
      { name: 'Tone', state: 'pass', note: 'No retired category language remains.', took: '5s' },
      { name: 'Links', state: 'pass', note: 'Twelve references resolve.', took: '3s' },
      { name: 'Preview build', state: 'pass', note: 'Rendered clean.', took: '26s' },
    ],
    files: [
      { name: 'messaging-house.md', icon: 'file', note: 'Category language replaced with names', added: 34, removed: 29 },
    ],
    timeline: [
      { kind: 'comment', who: 'dana', when: '2w', body: 'The category language was doing no work. These are the names people actually say.' },
      { kind: 'pushed', who: 'dana', when: '12d', revisions: [
        { hash: 'c71b508', title: 'Name the four challengers', who: 'dana', ok: true },
        { hash: '2e6a90d', title: 'Rewrite the proof line under each', who: 'dana', ok: true },
      ] },
      { kind: 'approved', who: 'chris', when: '2w' },
      { kind: 'approved', who: 'ravi', when: '11d' },
      { kind: 'merged', who: 'chris', when: '11d' },
    ],
  },
  {
    id: 35,
    state: 'closed',
    title: 'Add a third accent colour',
    asset: 'colour-tokens.json',
    base: 'v2.0',
    head: 'third-accent',
    author: 'ravi',
    opened: '3w',
    comments: 5,
    conflicts: true,
    labels: ['Visual'],
    campaign: null,
    reviewers: [{ name: 'Chris Church', state: 'changes' }],
    assignees: [],
    participants: ['Ravi Menon', 'Chris Church'],
    summary: 'Closed — a third categorical hue fails colour-vision separation against the other two.',
    preview: null,
    revisions: [
      { hash: 'f30c6b1', title: 'Add --accent-3 at three candidate values', who: 'ravi', when: '3w', ok: false },
    ],
    checks: [
      { name: 'Colour-vision separation', state: 'fail', note: 'ΔE 2.5 against pink under protanopia — the floor is 8.', took: '7s' },
      { name: 'Lightness band', state: 'fail', note: 'Every separating value sits at L 0.75 or above.', took: '4s' },
      { name: 'Contrast', state: 'pass', note: 'Clears 3:1 on the dark surface.', took: '4s' },
    ],
    files: [
      { name: 'colour-tokens.json', icon: 'file', note: 'Three candidate values, none passing', added: 9, removed: 0 },
    ],
    timeline: [
      { kind: 'comment', who: 'ravi', when: '3w', body: 'Three series in a chart is tight. Proposing a third accent.' },
      { kind: 'comment', who: 'chris', when: '3w', role: 'Reviewer', body: 'Ran it through the validator. Every value that separates cleanly leaves the lightness band, and every value inside the band fails the adjacent-pair check. Three is the ceiling for two adjacent hues.' },
      { kind: 'closed', who: 'chris', when: '3w' },
    ],
  },
]




/* Activity. Grouped by the day it happened rather than sorted into a map, so
   the feed keeps the order it was given. */
const ACTIVITY = [
  { who: 'Dana Cole', kind: 'published', what: 'logo-lockup.fig', where: 'Brand / Visual', when: '2h', day: 'Today', note: 'small-size variant' },
  { who: 'Ravi Menon', kind: 'commented', what: 'review #42', where: 'Reviews', when: '4h', day: 'Today' },
  { who: 'Chris Church', kind: 'published', what: 'chart-palette.json', where: 'Brand / Data', when: '4h', day: 'Today', note: 'capped at three' },
  { who: 'Ravi Menon', kind: 'updated', what: 'social-kit.fig', where: 'Brand / Channels', when: '6h', day: 'Today' },
  { who: 'Chris Church', kind: 'review', what: 'positioning.md', where: 'Brand / Verbal', when: '1d', day: 'Yesterday' },
  { who: 'Dana Cole', kind: 'updated', what: 'brand-guidelines.pdf', where: 'Brand / Visual', when: '1d', day: 'Yesterday', note: 'regenerated from tokens' },
  { who: 'Dana Cole', kind: 'created', what: 'launch-narrative.md', where: 'Brand / Verbal', when: '2d', day: 'Earlier this week' },
  { who: 'Ravi Menon', kind: 'updated', what: 'brand-sting.wav', where: 'Brand / Audio', when: '3d', day: 'Earlier this week', note: 'cut to 1.2s' },
  { who: 'Ravi Menon', kind: 'drafted', what: 'channel-matrix.md', where: 'Brand / Channels', when: '5d', day: 'Earlier this week' },
  { who: 'Chris Church', kind: 'published', what: 'messaging-house.md', where: 'Brand / Verbal', when: '1w', day: 'Last week' },
  { who: 'Dana Cole', kind: 'created', what: 'table-rules.md', where: 'Brand / Data', when: '2w', day: 'Last week' },
]


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard() {
  useMeta({
    title: 'Dashboard | Super Conscious',
    description: 'Internal brand workspace.',
    path: '/dashboard',
    noindex: true,
  })

  const { collapsed, toggle } = useSidebar()
  const [path, setPath] = useState(ROOT)
  const [tab, setTab] = useState('Files')
  const browsing = tab === 'Files'
  const [version, setVersion] = useState('v2.1 — current')
  const [search, setSearch] = useState('')
  const [find, setFind] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [wsName, setWsName] = useState('Brand')
  const [visibility, setVisibility] = useState('Private')
  const [autoReview, setAutoReview] = useState(true)
  const [file, setFile] = useState(null)
  const [fileView, setFileView] = useState('Preview')
  const [reviews, setReviews] = useState(REVIEWS)
  const [reviewId, setReviewId] = useState(null)
  const [reviewFilter, setReviewFilter] = useState('open')
  const [actFilter, setActFilter] = useState('all')
  const [wikiPage, setWikiPage] = useState('home')

  const node = at(path)
  const entries = Object.entries(node?.children ?? {}).map(([name, e]) => ({
    name,
    kind: e.kind === 'folder' || e.children ? 'folder' : 'file',
    icon: e.icon,
    message: e.message,
    when: e.when,
    status: e.status,
  }))

  /* What the listing actually shows: the folder's contents, narrowed by the
     filter field, and narrowed again to unfinished work in Reviews. Both
     controls act on the same list rather than each owning their own copy. */
  const shown = entries
    .filter((e) => !find || e.name.toLowerCase().includes(find.toLowerCase())
      || (e.message ?? '').toLowerCase().includes(find.toLowerCase()))
    .filter((e) => tab !== 'Reviews' || (e.status && e.status !== 'Live'))

  /* Open and closed are two questions, not one list with a filter chip:
     "what needs me" and "what happened". Approved and changes-requested are
     still open — a decision has been given but the work has not landed. */
  const isOpen = (r) => r.state === 'open' || r.state === 'approved' || r.state === 'changes'
  const reviewCounts = {
    open: reviews.filter(isOpen).length,
    closed: reviews.filter((r) => !isOpen(r)).length,
  }
  const visibleReviews = reviews.filter((r) => (reviewFilter === 'open' ? isOpen(r) : !isOpen(r)))
  const openReview = reviews.find((r) => r.id === reviewId) ?? null

  const activeKey = path.join('/')

  const selectNode = (n) => {
    setFile(null)
    setReviewId(null)
    setTab('Files')
    setPath(n.key.split('/'))
  }

  /* Acting on a review writes to the timeline as well as the state, so the
     record of who decided what survives the decision itself. Marking a draft
     ready is the one action that leaves the state alone — it only clears the
     flag that was blocking the decision. */
  const act = (kind) => {
    setReviews((rs) => rs.map((r) => {
      if (r.id !== reviewId) return r
      const timeline = [...r.timeline, { kind, who: 'chris', when: 'just now' }]
      if (kind === 'ready') return { ...r, draft: false, timeline }
      if (kind === 'reopened') return { ...r, state: 'open', timeline }
      const state = kind === 'closed' ? 'closed' : kind
      const reviewers = ['approved', 'changes'].includes(kind)
        ? (r.reviewers ?? []).map((p) => (p.name === 'Chris Church' ? { ...p, state: kind } : p))
        : r.reviewers
      return { ...r, state, reviewers, timeline }
    }))
  }

  /* A comment does not change the outcome, only the record — and the count on
     the row, which is the one number people scan the queue by. */
  const comment = (body) => {
    setReviews((rs) => rs.map((r) => (r.id === reviewId
      ? {
          ...r,
          comments: (r.comments ?? 0) + 1,
          timeline: [...r.timeline, { kind: 'comment', who: 'chris', when: 'just now', body }],
        }
      : r)))
  }

  const label = (segs) => segs.map((seg, i) => at(segs.slice(0, i + 1))?.label ?? seg)

  /* A folder goes deeper; a file opens. Clicking a row used to do nothing
     for files, which made half the listing look broken. */
  const open = (entry) => {
    if (entry.kind === 'folder') { setPath((p) => [...p, entry.name]); setFile(null) }
    else setFile(entry.name)
  }

  const openNode = file ? node?.children?.[file] : null
  const isText = Boolean(openNode?.text)

  return (
    <Shell
      collapsed={collapsed}
      global={
        <GlobalBar
          mark={headMark}
          owner="Super Conscious"
          workspace="Brand"
          onMenu={toggle}
          search={search}
          onSearch={setSearch}
        >
          <BarButton icon="plus" label="Create" />
          <BarButton icon="route" label="Requests" />
          <BarButton icon="mail" label="Notifications" dot />
          <span className={styles.me}>
            <Avatar name="Chris Church" size={24} />
          </span>
        </GlobalBar>
      }
    >
      {/* No mark and no toggle. The logo belongs in the global bar and nowhere
          else, and the hamburger up there already collapses this rail — a
          second control for the same thing only bought an empty band above the
          navigation. */}
      <Sidebar collapsed={collapsed}>
        {!collapsed && (
          <Tree
            nodes={TREE}
            activeKey={activeKey}
            defaultOpen={['brand']}
            onSelect={selectNode}
          />
        )}
        {collapsed && (
          <div className={styles.railIcons}>
            {TREE.flatMap((g) => g.children).map((c) => (
              <IconButton
                key={c.key}
                icon={c.railIcon ?? c.icon}
                label={c.label}
                onClick={() => selectNode(c)}
              />
            ))}
          </div>
        )}
      </Sidebar>

      <div className={styles.main}>
        <Content>
          {/* The workspace is already named in the global bar; repeating the
              owner here said the same thing twice on one screen. */}
          <TitleBar title="Brand" badge="Private">
            <CountButton icon="target" label="Pin" />
            <CountButton icon="user" label="Watch" count={4} pressed />
            <CountButton icon="copy" label="Duplicate" count={2} />
            <span className={styles.titleDivide} />
            <Button size="sm" icon="plus">Add asset</Button>
            <Button size="sm" variant="solid" icon="external">Share</Button>
          </TitleBar>

          {/* Areas of the workspace, not views of one thing — which is why
              this is a SectionNav and the row beneath it is not. */}
          <SectionNav
            value={tab}
            onChange={(t) => {
              setTab(t)
              setReviewId(null)
              setFile(null)
              /* Coming back to Files lands at the top of the tree rather than
                 wherever you were three sections ago. */
              if (t === 'Files') setPath(ROOT)
            }}
            sections={[
              { key: 'Files', label: 'Files', icon: 'folder' },
              { key: 'Reviews', label: 'Reviews', icon: 'request', count: reviewCounts.open },
              { key: 'Wiki', label: 'Wiki', icon: 'file' },
              { key: 'Activity', label: 'Activity', icon: 'refresh' },
              { key: 'Usage', label: 'Usage', icon: 'chart' },
              { key: 'Performance', label: 'Performance', icon: 'target' },
              { key: 'Settings', label: 'Settings', icon: 'sliders' },
            ]}
          />

          {tab === 'Reviews' && !openReview && (
            <RequestList
              requests={visibleReviews}
              filter={reviewFilter}
              onFilter={setReviewFilter}
              counts={reviewCounts}
              onOpen={(r) => setReviewId(r.id)}
            />
          )}

          {tab === 'Reviews' && openReview && (
            <RequestDetail
              request={openReview}
              path={['Reviews', `#${openReview.id}`]}
              onNavigate={() => setReviewId(null)}
              onApprove={() => act('approved')}
              onRequestChanges={() => act('changes')}
              onPublish={() => act('merged')}
              onClose={() => act('closed')}
              onReopen={() => act('reopened')}
              onReady={() => act('ready')}
              onComment={comment}
            >
              <p className={styles.reviewSummary}>{openReview.summary}</p>
            </RequestDetail>
          )}

          {/* Hidden while a file is open: the file view carries its own path,
              and two breadcrumbs stacked is the same location said twice. The
              version and filter belong to the listing, which isn't on screen. */}
          {browsing && !file && (
            <div className={styles.bar}>
              <Path segments={['Workspace', ...label(path)]} onNavigate={(i) => setPath(path.slice(0, i))} />
              <span className={styles.barTools}>
                <RefSelect
                  value={version}
                  onChange={setVersion}
                  options={['v2.1 — current', 'v2.0', 'v1.4 — archived']}
                />
                {/* "Filter this folder", not "search" — the global bar searches
                    the workspace, and two fields both called search on one
                    screen is a question nobody should have to answer. */}
                <FindField
                  value={find}
                  onChange={setFind}
                  placeholder="Filter this folder"
                  shortcut="F"
                />
              </span>
            </div>
          )}

          {browsing && !file && !dismissed && (
            /* Sits directly above the listing it is about, rather than in the
               middle of the chrome where it separated the controls from the
               thing they control. Neutral rather than amber: colour is the
               loudest thing in a monochrome interface, and an advisory that
               spends it leaves nothing for a real failure. */
            <Banner tone="info" icon="warning" onDismiss={() => setDismissed(true)}>
              6 assets haven't been reviewed in over 90 days.
            </Banner>
          )}

          {browsing && file && (
            <FileView
              path={['Workspace', ...label(path), file]}
              /* The last segment is the file, so navigating to any earlier one
                 means leaving it — index 0 is Workspace, hence the offset. */
              onNavigate={(i) => { setPath(path.slice(0, i)); setFile(null) }}
              head={{
                initials: 'DC',
                who: 'Dana Cole',
                message: openNode?.message ?? '',
                ref: 'a014ddf',
                when: openNode?.when ?? '',
                onHistory: () => setTab('Activity'),
              }}
              views={isText ? ['Preview', 'Raw'] : ['Preview', 'Details']}
              view={fileView}
              onView={setFileView}
              /* The meta line answers "how big is this", which is a different
                 question for a canvas, a deck and a sound file. It used to say
                 1600 × 1000 SVG for all three. */
              meta={fileMeta(openNode, isText)}
              actions={
                <span className={styles.fileActions}>
                  <Button size="sm" icon="copy"
                    onClick={() => writeText(['Workspace', ...label(path), file].join('/'))}>
                    Copy path
                  </Button>
                  <Button size="sm" icon="download">Download</Button>
                  <Button size="sm" variant="solid" icon="external">Open</Button>
                </span>
              }
            >
              {fileView === 'Preview' && isText && <CodeLines text={openNode.text} />}
              {fileView === 'Raw' && (
                <pre className={styles.raw}>{openNode.text}</pre>
              )}
              {/* Rendered by what it is, not by what it isn't. Only a file with
                  no renderer of its own falls back to the plate. */}
              {fileView === 'Preview' && !isText && openNode?.render === 'canvas' && (
                <CanvasPreview {...openNode.canvas} />
              )}
              {fileView === 'Preview' && !isText && openNode?.render === 'pdf' && (
                <PdfPreview title={openNode.pdf.file} pages={openNode.pdf.pages} />
              )}
              {fileView === 'Preview' && !isText && openNode?.render === 'wave' && (
                <WavePreview {...openNode.wave} />
              )}
              {fileView === 'Preview' && !isText && !openNode?.render && <MediaPreview label={file} />}
              {fileView === 'Details' && (
                <div className={styles.details}>
                  <FactRow icon="user" label={`Owned by ${openNode?.owner ?? 'Dana Cole'}`} />
                  <FactRow icon="clock" label={`Updated ${openNode?.when ?? '—'} ago`} />
                  <FactRow icon="layers" label={`Used in ${openNode?.used ?? 12} places`} />
                  <FactRow icon="lock" label="Licensed for all channels" />
                </div>
              )}
            </FileView>
          )}

          {browsing && !file && (
            <div className={styles.split}>
              <FileBrowser
                onOpen={open}
                entries={shown}
                head={{
                  initials: 'DC',
                  who: 'Dana Cole',
                  message: node?.message ?? 'Published the identity system',
                  ref: 'a014ddf',
                  when: node?.when ?? '2h ago',
                  count: '492 changes',
                }}
              />

              <aside className={styles.rail}>
                <AsideBlock
                  title="About"
                  action={<IconButton icon="sliders" label="Workspace settings" size={13} />}
                >
                  <p className={styles.asideText}>
                    The brand system for Super Conscious — what it looks like,
                    sounds like, says, charts and runs on.
                  </p>
                  <div className={styles.facts}>
                    {/* Counts that used to sit in the toolbar dressed as
                        links. They are facts about the workspace, not things
                        you can do to it, so they belong with the other facts. */}
                    <FactRow icon="layers" value="38" label="assets" />
                    <FactRow icon="user" value="4" label="editors" />
                    <FactRow icon="clock" value="12" label="versions" />
                    <FactRow icon="warning" value="6" label="awaiting review" />
                  </div>
                </AsideBlock>

                <CompositionBar
                  title="Composition"
                  segments={[
                    { label: 'Visual', value: 14 },
                    { label: 'Verbal', value: 9 },
                    { label: 'Data', value: 7 },
                    { label: 'Channels', value: 5 },
                    { label: 'Audio', value: 3 },
                  ]}
                />

                <Contributors
                  people={[
                    { handle: 'ChrisChurchSC', name: 'Chris Church' },
                    { handle: 'dana', name: 'Dana Cole' },
                    { handle: 'ravi', name: 'Ravi Menon' },
                    { handle: 'Super-Conscious', name: 'Super Conscious' },
                  ]}
                />

                <AsideBlock title="Publishing" count="500+">
                  <StatusList
                    items={[
                      { label: 'Preview — brand', when: '20 min ago' },
                      { label: 'Preview — assets', when: '20 min ago' },
                      { label: 'Live — super-conscious.studio', when: 'last week' },
                      { label: 'Channel matrix', when: 'blocked', tone: 'warn' },
                    ]}
                  />
                </AsideBlock>

                <AsideBlock title="Releases">
                  <p className={styles.asideText}>v2.1 — Identity refresh, shipped last week.</p>
                  <Button size="sm" icon="plus">New release</Button>
                </AsideBlock>
              </aside>
            </div>
          )}

          {tab === 'Usage' && (
            <>
              <Grid>
                <Col span={3}>
                  <StatTile label="Assets" value="38" delta="+6" direction="up" vs="vs last quarter"
                    trend={[18, 21, 24, 28, 33, 38]} series={1} />
                </Col>
                <Col span={3}>
                  <StatTile label="In use" value="71%" delta="+9pt" direction="up" vs="vs last quarter"
                    trend={[48, 52, 57, 61, 66, 71]} series={2} />
                </Col>
                <Col span={3}>
                  <StatTile label="Awaiting review" value="6" delta="+2" direction="down" vs="vs last quarter"
                    trend={[2, 3, 3, 4, 5, 6]} series={3} />
                </Col>
                <Col span={3}>
                  <StatTile label="Channels live" value="2" delta="no change" vs="vs last quarter"
                    trend={[2, 2, 2, 2, 2, 2]} series={1} />
                </Col>
              </Grid>

              <Grid>
                <Col span={8}>
                  <Panel title="Asset usage" actions={<span className={styles.panelMeta}>Target 60</span>}>
                    <LineChart
                      labels={MONTHS} unit="uses" max={100} target={60}
                      series={[
                        { label: 'Visual', data: [12, 18, 22, 28, 31, 38, 42, 49, 54, 61, 68, 74] },
                        { label: 'Verbal', data: [6, 9, 11, 14, 18, 21, 26, 29, 33, 38, 41, 47] },
                      ]}
                    />
                  </Panel>
                </Col>
                <Col span={4}>
                  <Panel title="By discipline">
                    <Donut
                      centre="38"
                      data={[
                        { label: 'Visual', value: 14 },
                        { label: 'Verbal', value: 9 },
                        { label: 'Data', value: 7 },
                        { label: 'Channels', value: 5 },
                        { label: 'Audio', value: 3 },
                      ]}
                    />
                  </Panel>
                </Col>
              </Grid>

              <Grid>
                <Col span={6}>
                  <Panel title="Most used">
                    <RankedBar data={[
                      { label: 'Social kit', value: 31 },
                      { label: 'Identity', value: 24 },
                      { label: 'Voice', value: 19 },
                      { label: 'Positioning', value: 11 },
                    ]} />
                  </Panel>
                </Col>
                <Col span={6}>
                  <Panel title="Added per month">
                    <BarChart
                      data={[2, 3, 1, 4, 2, 5, 3, 4, 6, 3, 2, 3]}
                      labels={MONTHS.map((m) => m[0])}
                      unit="n" reference={3} referenceLabel="Mean 3"
                    />
                  </Panel>
                </Col>
              </Grid>
            </>
          )}

          {/* Usage is how much of the system gets used; Performance is how the
              work did once it left. Two different questions, which is why they
              are two sections rather than one page with eight charts on it. */}
          {tab === 'Performance' && (
            <>
              <Grid>
                <Col span={3}>
                  <StatTile label="Reach" value="1.4M" delta="+18%" direction="up" vs="vs last quarter"
                    trend={[720, 810, 940, 1020, 1180, 1400]} series={1} />
                </Col>
                <Col span={3}>
                  <StatTile label="Engagement" value="3.8%" delta="+0.6pt" direction="up" vs="vs last quarter"
                    trend={[2.4, 2.7, 2.9, 3.1, 3.2, 3.8]} series={2} />
                </Col>
                <Col span={3}>
                  <StatTile label="Conversions" value="612" delta="+94" direction="up" vs="vs last quarter"
                    trend={[318, 372, 405, 461, 518, 612]} series={3} />
                </Col>
                <Col span={3}>
                  {/* No direction on this one. The tile colours up green and
                      down red, and a falling cost per conversion is the good
                      outcome — so an arrow here would say the opposite of
                      what happened. The number carries it instead. */}
                  <StatTile label="Cost per conversion" value="$41" delta="−$7" vs="vs last quarter"
                    trend={[62, 58, 54, 49, 48, 41]} series={1} />
                </Col>
              </Grid>

              <Grid>
                <Col span={8}>
                  <Panel title="Reach by channel" actions={<span className={styles.panelMeta}>Target 40k/mo</span>}>
                    {/* One measure, one axis. Reach and conversions are three
                        orders of magnitude apart, and putting them on one chart
                        with two scales is the commonest way to lie with one. */}
                    <LineChart
                      labels={MONTHS} unit="k" max={80} target={40}
                      series={[
                        { label: 'LinkedIn', data: [8, 11, 14, 18, 21, 26, 31, 36, 42, 51, 63, 74] },
                        { label: 'Paid social', data: [14, 16, 15, 19, 22, 24, 27, 25, 29, 34, 38, 44] },
                      ]}
                    />
                  </Panel>
                </Col>
                <Col span={4}>
                  <Panel title="Spend by channel">
                    <Donut
                      centre="$84k"
                      data={[
                        { label: 'Paid social', value: 38 },
                        { label: 'LinkedIn', value: 27 },
                        { label: 'Search', value: 12 },
                        { label: 'Newsletter', value: 7 },
                      ]}
                    />
                  </Panel>
                </Col>
              </Grid>

              <Grid>
                <Col span={6}>
                  <Panel title="Converting assets" actions={<span className={styles.panelMeta}>Conversions</span>}>
                    <RankedBar data={[
                      { label: 'Merger case study', value: 184 },
                      { label: 'Landing page', value: 141 },
                      { label: 'Social kit — 1:1', value: 96 },
                      { label: 'Outreach email', value: 71 },
                    ]} />
                  </Panel>
                </Col>
                <Col span={6}>
                  <Panel title="Conversions per month">
                    <BarChart
                      data={[28, 34, 31, 42, 39, 47, 51, 44, 58, 63, 87, 88]}
                      labels={MONTHS.map((m) => m[0])}
                      unit="n" reference={51} referenceLabel="Mean 51"
                    />
                  </Panel>
                </Col>
              </Grid>
            </>
          )}

          {/* The feed used to be five divs wearing class names that were never
              defined in the stylesheet — avatar, icon and text stacked, and the
              timestamp ran into the filename. It is a component now. */}
          {tab === 'Activity' && (
            <ActivityFeed
              entries={ACTIVITY}
              filter={actFilter}
              onFilter={setActFilter}
              onOpen={(e) => {
                /* Activity is a way into the workspace, not a read-only log:
                   a row about a file takes you to the folder holding it. */
                const seg = e.where.split(' / ')[1]?.toLowerCase()
                if (!seg) return
                setTab('Files')
                setPath(['brand', seg])
                setFile(null)
              }}
            />
          )}

          {tab === 'Wiki' && (
            <Wiki pages={WIKI} current={wikiPage} onSelect={setWikiPage} />
          )}

          {tab === 'Settings' && (
            <div className={styles.settings}>
              <Panel title="Workspace">
                <Field label="Name" help="Shown in the global bar and on every export.">
                  <Input value={wsName} onChange={setWsName} />
                </Field>
                <Field label="Visibility" help="Private workspaces are invisible to anyone not invited.">
                  <Segmented
                    value={visibility}
                    onChange={setVisibility}
                    label="Visibility"
                    options={['Private', 'Team', 'Public']}
                  />
                </Field>
              </Panel>

              <Panel title="Review">
                <Switch
                  checked={autoReview}
                  onChange={setAutoReview}
                  label="Flag assets untouched for 90 days"
                />
                <span className={styles.settingNote}>
                  This is what produces the notice above the listing.
                </span>
              </Panel>
            </div>
          )}
        </Content>
      </div>
    </Shell>
  )
}
