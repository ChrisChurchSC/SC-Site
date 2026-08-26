import { useEffect, useState } from 'react'
import s from './system.module.css'
import { ICONS } from './icons'
import {
  Icon, Button, IconButton, Badge, Banner, Field, Input, Switch, Segmented, Avatar, StatTile,
} from './primitives'
import { LineChart, BarChart, RankedBar, Donut, Sparkline } from './charts'

/* Live demos for the wiki.
 *
 * The rule: a demo renders the real component or reads the real token. Nothing
 * here is a picture of the system — a swatch shows what shipped because it
 * asks the browser what shipped, and a button is the button. A documentation
 * page drawn by hand is a second implementation, and the second one is always
 * the one that goes stale.
 */

/* Read tokens back out of the cascade rather than importing a JS copy. If the
   value changed in tokens.css and nobody updated the page, the page updates
   itself. In an effect so it never runs during SSR. */
function useTokens(names) {
  const [vals, setVals] = useState({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setVals(Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()])))
  }, [names.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps
  return vals
}

function Swatches({ tokens, tall }) {
  const vals = useTokens(tokens.map((t) => t.token))
  return (
    <div className={s.wdSwatches}>
      {tokens.map((t) => (
        <span key={t.token} className={s.wdSwatch}>
          <span
            className={`${s.wdChip} ${tall ? s.wdChipTall : ''}`}
            style={{ background: `var(${t.token})` }}
          />
          <span className={s.wdName}>{t.name}</span>
          <span className={s.wdToken}>{t.token}</span>
          <span className={s.wdValue}>{vals[t.token] || '—'}</span>
        </span>
      ))}
    </div>
  )
}

/* Text is shown as text, not as a colour chip. A ramp of nine greys tells you
   nothing; nine lines of the same sentence tell you where it stops being
   readable. */
function TextRamp() {
  const tokens = [
    ['--sc-text-peak', 'peak'], ['--sc-text-display', 'display'], ['--sc-text-strong', 'strong'],
    ['--sc-text-title', 'title'], ['--sc-text-body', 'body'], ['--sc-text-support', 'support'],
    ['--sc-text-label', 'label'], ['--sc-text-meta', 'meta'], ['--sc-text-faint', 'faint'],
  ]
  const vals = useTokens(tokens.map(([t]) => t))
  return (
    <div className={s.wdRamp}>
      {tokens.map(([token, name]) => (
        <span key={token} className={s.wdRampRow}>
          <span className={s.wdToken}>{name}</span>
          <span className={s.wdRampText} style={{ color: `var(${token})` }}>
            Say the finding, then the evidence
          </span>
          <span className={s.wdValue}>{(vals[token] || '').replace(/rgba?\(255, 255, 255, |\)/g, '') || '—'}</span>
        </span>
      ))}
    </div>
  )
}

function TypeScale() {
  const rows = [
    { token: '--sc-size-lede', name: 'lede', display: true, sample: 'A studio you bring in when the system has to outlive the engagement' },
    { token: '--sc-size-body', name: 'body', display: true, sample: 'Say the finding, then the evidence.' },
    { token: '--sc-size-ui', name: 'ui', sample: 'Controls, rows, table cells' },
    { token: '--sc-size-meta', name: 'meta', sample: 'a014ddf · 2h ago · 492 changes' },
    { token: '--sc-size-label', name: 'label', sample: 'AWAITING REVIEW' },
    { token: '--sc-size-eyebrow', name: 'eyebrow', sample: 'SECTION' },
  ]
  const vals = useTokens(rows.map((r) => r.token))
  return (
    <div className={s.wdType}>
      {rows.map((r) => (
        <span key={r.token} className={s.wdTypeRow}>
          <span className={s.wdTypeSpec}>
            {r.name}
            <span className={s.wdValue}>{vals[r.token] || '—'}</span>
          </span>
          <span
            className={s.wdTypeSample}
            style={{
              fontSize: `var(${r.token})`,
              fontFamily: r.display ? 'var(--sc-font-display)' : 'var(--sc-font-mono)',
              letterSpacing: r.name === 'label' || r.name === 'eyebrow' ? 'var(--sc-track-wide)' : undefined,
            }}
          >
            {r.sample}
          </span>
        </span>
      ))}
    </div>
  )
}

/* The two families, at the same size, saying the same thing — the only way to
   see that the distinction is doing work rather than being decorative. */
function TypeFamilies() {
  return (
    <div className={s.wdFamilies}>
      {[
        { f: 'var(--sc-font-display)', n: 'Signifier', job: 'Anything a person wrote', sample: 'Four brands took the same three words' },
        { f: 'var(--sc-font-mono)', n: 'Roboto Mono', job: 'Anything a machine produced', sample: 'a014ddf · 492 changes · 2h' },
      ].map((x) => (
        <span key={x.n} className={s.wdFamily}>
          <span className={s.wdName}>{x.n}</span>
          <span className={s.wdToken}>{x.job}</span>
          <span className={s.wdFamilySample} style={{ fontFamily: x.f }}>{x.sample}</span>
        </span>
      ))}
    </div>
  )
}

/* Spacing drawn to size. A list of numbers is a list of numbers; a row of bars
   shows you that the scale actually doubles. */
function SpaceScale() {
  const tokens = ['--sc-space-1', '--sc-gutter', '--sc-space-2', '--sc-space-3',
    '--sc-space-4', '--sc-space-5', '--sc-space-6', '--sc-space-7', '--sc-space-8']
  const vals = useTokens(tokens)
  return (
    <div className={s.wdSpace}>
      {tokens.map((t) => (
        <span key={t} className={s.wdSpaceRow}>
          <span className={s.wdToken}>{t.replace('--sc-', '')}</span>
          <span className={s.wdSpaceBar} style={{ width: `var(${t})` }} />
          <span className={s.wdValue}>{vals[t] || '—'}</span>
        </span>
      ))}
    </div>
  )
}

function RadiusScale() {
  const tokens = ['--sc-radius-sm', '--sc-radius', '--sc-radius-lg', '--sc-radius-pill']
  const vals = useTokens(tokens)
  return (
    <div className={s.wdTiles}>
      {tokens.map((t) => (
        <span key={t} className={s.wdTile}>
          <span className={s.wdTileArt} style={{ borderRadius: `var(${t})` }} />
          <span className={s.wdToken}>{t.replace('--sc-radius', '').replace('-', '') || 'base'}</span>
          <span className={s.wdValue}>{vals[t] || '—'}</span>
        </span>
      ))}
    </div>
  )
}

function Elevation() {
  const tokens = [
    ['--sc-elev-menu', 'menu'], ['--sc-elev-dialog', 'dialog'], ['--sc-elev-drawer', 'drawer'],
  ]
  return (
    <div className={s.wdTiles}>
      {tokens.map(([t, n]) => (
        <span key={t} className={s.wdTile}>
          <span className={s.wdTileArt} style={{ boxShadow: `var(${t})`, background: 'var(--sc-raised)' }} />
          <span className={s.wdToken}>{n}</span>
        </span>
      ))}
    </div>
  )
}

/* The layer model, stacked. Eight numbers in a list do not say "there is room
   between these"; eight offset plates do. */
function Layers() {
  const rows = [
    ['cursor', 600], ['toast', 500], ['overlay', 400], ['drawer', 300],
    ['nav', 200], ['sticky', 100], ['raised', 10], ['base', 0],
  ]
  return (
    <div className={s.wdLayers}>
      {rows.map(([n, v], i) => (
        <span key={n} className={s.wdLayer} style={{ marginLeft: i * 14 }}>
          <span className={s.wdName}>{n}</span>
          <span className={s.wdValue}>{v}</span>
        </span>
      ))}
    </div>
  )
}

/* Every icon in the set, live from the same export the components use. If one
   is added, this grid grows without anybody editing the wiki. */
function IconGrid() {
  const names = Object.keys(ICONS)
  return (
    <div className={s.wdIconWrap}>
      <span className={s.wdCount}>{names.length} icons · 16px grid · 1.25px strokes</span>
      <div className={s.wdIcons}>
        {names.map((n) => (
          <span key={n} className={s.wdIcon} title={n}>
            <Icon name={n} size={16} />
            <span className={s.wdIconName}>{n}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Buttons() {
  return (
    <div className={s.wdRow}>
      <Button variant="solid" icon="check">Solid</Button>
      <Button icon="plus">Default</Button>
      <Button size="sm" icon="download">Small</Button>
      <Button size="sm" icon="merged" disabled title="Needs at least one approval">Disabled</Button>
      <IconButton icon="close" label="Close" />
    </div>
  )
}

function Statuses() {
  return (
    <div className={s.wdStack}>
      <div className={s.wdRow}>
        <Badge>Live</Badge>
        <Badge tone="warn">Review</Badge>
        <Badge tone="muted">Draft</Badge>
      </div>
      <Banner tone="info" icon="warning">6 assets haven’t been reviewed in over 90 days.</Banner>
    </div>
  )
}

function Controls() {
  const [on, setOn] = useState(true)
  const [seg, setSeg] = useState('Preview')
  const [text, setText] = useState('logo-lockup.fig')
  return (
    <div className={s.wdStack}>
      <div className={s.wdRow}>
        <Segmented value={seg} onChange={setSeg} options={['Preview', 'Raw', 'Details']} />
        <Switch checked={on} onChange={setOn} label="Auto-review" />
      </div>
      <Field label="Asset name" help="Lowercase, hyphens, no dates or version numbers.">
        <Input value={text} onChange={setText} />
      </Field>
    </div>
  )
}

function People() {
  return (
    <div className={s.wdRow}>
      {['Chris Church', 'Dana Cole', 'Ravi Menon', 'Super Conscious'].map((n) => (
        <span key={n} className={s.wdPerson}>
          <Avatar name={n} size={28} />
          <span className={s.wdToken}>{n}</span>
        </span>
      ))}
    </div>
  )
}

/* Charts as charts. The categorical slots get exactly three series, because
   that is the rule the page beside this one states. */
function Charts() {
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Line — two series, one axis</span>
        <LineChart
          labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} unit="k" max={80} target={40}
          series={[
            { label: 'LinkedIn', data: [8, 14, 21, 31, 42, 63] },
            { label: 'Paid social', data: [14, 15, 22, 27, 29, 38] },
          ]}
        />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Donut — sequential, not categorical</span>
        <Donut
          centre="38"
          data={[
            { label: 'Visual', value: 14 }, { label: 'Verbal', value: 9 },
            { label: 'Data', value: 7 }, { label: 'Channels', value: 5 },
            { label: 'Audio', value: 3 },
          ]}
        />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Ranked bar</span>
        <RankedBar data={[
          { label: 'Social kit', value: 31 }, { label: 'Identity', value: 24 },
          { label: 'Voice', value: 19 }, { label: 'Positioning', value: 11 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Bar — one series, with a reference</span>
        <BarChart
          data={[2, 3, 1, 4, 2, 5, 3, 4, 6, 3, 2, 3]}
          labels={['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']}
          unit="n" reference={3} referenceLabel="Mean 3"
        />
      </div>
    </div>
  )
}

function Stats() {
  return (
    <div className={s.wdRow}>
      <span className={s.wdStat}>
        <StatTile label="Assets" value="38" delta="+6" direction="up" vs="vs last quarter"
          trend={[18, 21, 24, 28, 33, 38]} series={1} />
      </span>
      <span className={s.wdStat}>
        <StatTile label="In use" value="71%" delta="+9pt" direction="up" vs="vs last quarter"
          trend={[48, 52, 57, 61, 66, 71]} series={2} />
      </span>
      <span className={s.wdSpark}>
        <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 14]} />
      </span>
    </div>
  )
}

/* Motion you can trigger. A duration written as 0.15s is a number; a square
   that moves when you hover it is the decision. */
function Motion() {
  const rows = [['--sc-fast', 'fast', 'hover, colour, small state'],
    ['--sc-medium', 'medium', 'panels, disclosure'],
    ['--sc-slow', 'slow', 'page-level']]
  const vals = useTokens(rows.map(([t]) => t))
  return (
    <div className={s.wdStack}>
      <span className={s.wdCount}>Hover a bar to see its duration</span>
      {rows.map(([t, n, job]) => (
        <span key={t} className={s.wdMotionRow}>
          <span className={s.wdToken}>{n}</span>
          <span className={s.wdTrack}>
            <span className={s.wdPuck} style={{ transitionDuration: `var(${t})` }} />
          </span>
          <span className={s.wdValue}>{vals[t] || '—'}</span>
          <span className={s.wdToken}>{job}</span>
        </span>
      ))}
    </div>
  )
}

function FocusDemo() {
  return (
    <div className={s.wdStack}>
      <span className={s.wdCount}>Tab into these — the ring is the same on all three</span>
      <div className={s.wdRow}>
        <Button icon="check">A button</Button>
        <Input value="A field" onChange={() => {}} />
        <a className={s.wikiLink} href="#focus" onClick={(e) => e.preventDefault()}>
          <Icon name="link" size={12} />A link
        </a>
      </div>
    </div>
  )
}

export const WIKI_DEMOS = {
  'surfaces': () => (
    <Swatches tall tokens={[
      { token: '--sc-ground', name: 'Ground' },
      { token: '--sc-recessed', name: 'Recessed' },
      { token: '--sc-card', name: 'Card' },
      { token: '--sc-card-hover', name: 'Card hover' },
      { token: '--sc-raised', name: 'Raised' },
    ]} />
  ),
  'text-ramp': TextRamp,
  'accents': () => (
    <Swatches tall tokens={[
      { token: '--sc-pink', name: 'Pink' },
      { token: '--sc-purple', name: 'Purple' },
    ]} />
  ),
  'status': () => (
    <Swatches tokens={[
      { token: '--sc-good', name: 'Good' },
      { token: '--sc-warn', name: 'Warn' },
      { token: '--sc-bad', name: 'Bad' },
    ]} />
  ),
  'chart-slots': () => (
    <Swatches tokens={[
      { token: '--sc-s1', name: 'Series 1' },
      { token: '--sc-s2', name: 'Series 2' },
      { token: '--sc-s3', name: 'Series 3' },
      { token: '--sc-s4', name: 'Series 4 — alias of 1' },
      { token: '--sc-s5', name: 'Series 5 — alias of 2' },
      { token: '--sc-s6', name: 'Series 6 — alias of 3' },
    ]} />
  ),
  'sequential': () => (
    <Swatches tokens={[
      { token: '--sc-q1', name: 'q1' }, { token: '--sc-q2', name: 'q2' },
      { token: '--sc-q3', name: 'q3' }, { token: '--sc-q4', name: 'q4' },
      { token: '--sc-q5', name: 'q5' },
    ]} />
  ),
  'type-scale': TypeScale,
  'type-families': TypeFamilies,
  'space-scale': SpaceScale,
  'radius': RadiusScale,
  'elevation': Elevation,
  'layers': Layers,
  'icons': IconGrid,
  'buttons': Buttons,
  'statuses': Statuses,
  'controls': Controls,
  'people': People,
  'charts': Charts,
  'stats': Stats,
  'motion': Motion,
  'focus': FocusDemo,
}

export function WikiDemo({ id }) {
  const D = WIKI_DEMOS[id]
  if (!D) return null
  return (
    <div className={s.wdBlock}>
      <D />
    </div>
  )
}
