import { useEffect, useState } from 'react'
import s from './system.module.css'
import { ICONS } from './icons'
import {
  Icon, Button, IconButton, Badge, Banner, Field, Input, Switch, Segmented, Avatar, StatTile,
} from './primitives'
import { LineChart, BarChart, RankedBar, Donut, Sparkline } from './charts'
import {
  Modal, ConfirmDialog, Drawer, BottomSheet, DropdownMenu, Popover, Tooltip,
  Lightbox, ToastStack, useToasts, CommandPalette,
} from './overlays'
import { Accordion, Stepper, Scrollspy, SidebarNav, PrevNext } from './navigation'
import {
  Select, Combobox, CheckGroup, RadioGroup, ValidatedField, SearchField,
  TagInput, SliderControl, DatePicker, FileUpload, FilterBar, SortControl,
} from './forms'
import {
  Histogram, BoxPlot, Scatter, Bubble, DotPlot, Dumbbell, SlopeChart,
  StepLine, TimeSeries, StackedArea, StackedBar, Waterfall, Funnel, Pareto,
  Bullet, ControlChart, Treemap, CalendarHeat, Cohort, Gantt, SmallMultiples,
} from './plots'
import { Tabs, SectionNav } from './primitives'
import { Grid, Col } from './shell'
import { DataGrid } from './dataGrid'
import { Carousel, Gallery, BeforeAfter, VideoControls, ProgressBar } from './media'
import { Chat, StreamingText, ResponseFeedback } from './chat'
import { StatusPill, CardSurface, KpiRow, PersonCard, ConsentBanner } from './content'
import { Legend } from './charts'

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


/* ── Forms ─────────────────────────────────────────────────────────────── */

function FormsDemo() {
  const [sel, setSel] = useState('Brand')
  const [combo, setCombo] = useState(null)
  const [checks, setChecks] = useState(['Brand'])
  const [radio, setRadio] = useState('Now')
  const [email, setEmail] = useState('chris@')
  const [q, setQ] = useState('')
  const [tags, setTags] = useState(['Design', 'Blocking'])
  const [budget, setBudget] = useState(60)

  return (
    <div className={s.wdGrid}>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Select — returns a value</span>
        <Select options={['Brand', 'Content', 'Product']} value={sel} onChange={setSel} label="Discipline" />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Combobox — type to narrow</span>
        <Combobox options={['Arbitrum', 'Openhouse', 'Espresso', 'Offchain Labs']} value={combo} onChange={setCombo} label="Client" />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Checkbox — role, not appearance</span>
        <CheckGroup options={['Brand', 'Content', 'Product']} value={checks} onChange={setChecks} label="Disciplines" />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Radio — one of several</span>
        <RadioGroup options={['Now', 'This quarter', 'Exploring']} value={radio} onChange={setRadio} label="Timing" />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Validates on blur, never on keystroke</span>
        <ValidatedField
          label="Email" value={email} onChange={setEmail}
          validate={(v) => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v)}
          hint="Click out of the field to validate."
          error="That address looks incomplete."
        />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Search — clears itself</span>
        <SearchField value={q} onChange={setQ} placeholder="Search assets" count={q ? 3 : undefined} />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Tags — Enter adds, Backspace removes</span>
        <TagInput tags={tags} onChange={setTags} />
      </span>
      <span className={s.wdCell}>
        <span className={s.wdCount}>Slider — a native range, restyled</span>
        <SliderControl label="Budget" value={budget} min={10} max={150} step={5} onChange={setBudget} format={(n) => `${n}k`} />
      </span>
    </div>
  )
}

function DateDemo() {
  const [day, setDay] = useState(14)
  return <DatePicker value={day} onChange={setDay} />
}

function UploadDemo() {
  const [files, setFiles] = useState([{ name: 'logo-lockup.fig', size: 184320 }])
  return <FileUpload files={files} onChange={setFiles} />
}

function FilterDemo() {
  const [value, setValue] = useState({ discipline: 'Brand' })
  const [by, setBy] = useState('Recently updated')
  const [dir, setDir] = useState('desc')
  return (
    <div className={s.wdStack}>
      <FilterBar
        count={12} value={value} onChange={setValue} onClear={() => setValue({})}
        filters={[
          { key: 'discipline', label: 'Discipline', options: ['Brand', 'Content', 'Product'] },
          { key: 'status', label: 'Status', options: ['Live', 'Review', 'Draft'] },
        ]}
      />
      <SortControl
        options={['Recently updated', 'Name', 'Most used']}
        value={by} direction={dir}
        onChange={(v, d) => { setBy(v); setDir(d) }}
      />
    </div>
  )
}

/* ── Overlays ──────────────────────────────────────────────────────────────
   Every one is opened for real. A screenshot of a modal cannot show you that
   Tab wraps inside it. */

function OverlayDemo() {
  const [modal, setModal] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [light, setLight] = useState(false)
  const [i, setI] = useState(0)
  const [palette, setPalette] = useState(false)
  const { toasts, push, dismiss } = useToasts()

  return (
    <div className={s.wdStack}>
      <span className={s.wdCount}>Trapped: Escape, backdrop and close all dismiss, and focus returns to the trigger</span>
      <div className={s.wdRow}>
        <Button size="sm" onClick={() => setModal(true)}>Modal</Button>
        <Button size="sm" onClick={() => setConfirm(true)}>Confirm</Button>
        <Button size="sm" onClick={() => setDrawer(true)}>Drawer</Button>
        <Button size="sm" onClick={() => setSheet(true)}>Sheet</Button>
        <Button size="sm" onClick={() => setLight(true)}>Lightbox</Button>
        <Button size="sm" onClick={() => setPalette(true)}>Palette</Button>
      </div>

      <span className={s.wdCount}>Not trapped: attached to a trigger, so the page behind stays usable</span>
      <div className={s.wdRow}>
        <DropdownMenu
          items={[
            { label: 'Duplicate', icon: 'copy' },
            { label: 'Export', icon: 'download' },
            { divider: true },
            { label: 'Delete', icon: 'close', tone: 'bad' },
          ]}
        />
        <Popover trigger="Why three colours?">
          Pink and purple are adjacent hues. A fourth categorical value either leaves
          the lightness band or fails colour-vision separation against one of the other three.
        </Popover>
        <Tooltip label="Copy path"><Button size="sm" icon="copy">Hover me</Button></Tooltip>
        <Button size="sm" icon="check" onClick={() => push({ tone: 'good', message: 'Published to the workspace.' })}>
          Toast
        </Button>
      </div>

      <Modal
        open={modal} onClose={() => setModal(false)} title="Send this brief?"
        actions={<><Button size="sm" onClick={() => setModal(false)}>Cancel</Button><Button size="sm" variant="solid" onClick={() => setModal(false)}>Send</Button></>}
      >
        Tab around — focus cycles inside and cannot escape. Escape closes, and focus
        returns to the button that opened it.
      </Modal>
      <ConfirmDialog
        open={confirm} onClose={() => setConfirm(false)} onConfirm={() => {}}
        tone="bad" title="Delete logo-lockup.fig?" confirm="Delete"
        body="It is used in 12 places. This cannot be undone."
      />
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Asset details">
        A drawer is for adjacent work — what you opened it from stays on screen behind it.
      </Drawer>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Share">
        The same contract at the bottom edge, for a small screen where a centred modal
        has nowhere to go.
      </BottomSheet>
      <Lightbox
        open={light} onClose={() => setLight(false)} index={i} onIndex={setI}
        items={[
          { label: 'Identity — primary', ratio: '16 / 9' },
          { label: 'Identity — stacked', ratio: '1 / 1' },
          { label: 'Social kit', ratio: '4 / 5' },
        ]}
      />
      <CommandPalette
        open={palette} onClose={() => setPalette(false)}
        commands={[
          { label: 'New asset', icon: 'plus', hint: 'N' },
          { label: 'Open reviews', icon: 'request', hint: 'R' },
          { label: 'Publish changes', icon: 'merged' },
          { label: 'Workspace settings', icon: 'sliders' },
        ]}
      />
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

/* ── Navigation ────────────────────────────────────────────────────────── */

function NavDemo() {
  const [step, setStep] = useState(1)
  const [side, setSide] = useState('Workspace')
  const [tab, setTab] = useState('Approach')
  const [sec, setSec] = useState('Files')

  return (
    <div className={s.wdStack}>
      <span className={s.wdCount}>Stepper — done is filled, current is ringed, ahead is outlined</span>
      <Stepper steps={['Scope', 'Timing', 'Contact']} current={step} onStep={setStep} />

      <span className={s.wdCount}>Tabs — views of one thing</span>
      <Tabs value={tab} onChange={setTab} options={['Approach', 'Craft', 'Outcome']} />

      <span className={s.wdCount}>SectionNav — areas of a product, which is a different job</span>
      <SectionNav
        value={sec} onChange={setSec}
        sections={[
          { key: 'Files', label: 'Files', icon: 'folder' },
          { key: 'Reviews', label: 'Reviews', icon: 'request', count: 3 },
          { key: 'Usage', label: 'Usage', icon: 'chart' },
        ]}
      />

      <div className={s.wdGrid}>
        <span className={s.wdCell}>
          <span className={s.wdCount}>Accordion — many-open by default</span>
          <Accordion
            defaultOpen={['Who owns the work?']}
            items={[
              { title: 'Who owns the work?', meta: '1 min', body: 'You do, on delivery. Source files and all.' },
              { title: 'What if it changes later?', meta: '2 min', body: 'The system is built to be changed. That is what the tokens are for.' },
            ]}
          />
        </span>
        <span className={s.wdCell}>
          <span className={s.wdCount}>SidebarNav — every destination a sibling</span>
          <SidebarNav
            title="Settings" value={side} onChange={setSide}
            items={[
              { label: 'Workspace', icon: 'sliders' },
              { label: 'Members', icon: 'user', count: 4 },
              { label: 'Publishing', icon: 'upload' },
            ]}
          />
        </span>
      </div>

      <span className={s.wdCount}>PrevNext — each direction names where it goes</span>
      <PrevNext prev={{ label: 'Motion & focus' }} next={{ label: 'Accessibility' }} />
    </div>
  )
}

/* ── Plots ─────────────────────────────────────────────────────────────────
   The analytical half. Grouped by the question each answers, because picking
   a chart by how it looks is how you end up with the wrong one. */

const MO = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

function PlotsDistribution() {
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Histogram — bars touch, the axis is continuous</span>
        <Histogram unit="n" bins={[
          { label: '0', value: 2 }, { label: '5', value: 6 }, { label: '10', value: 14 },
          { label: '15', value: 23 }, { label: '20', value: 31 }, { label: '25', value: 27 },
          { label: '30', value: 18 }, { label: '35', value: 9 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Box plot — five numbers an average throws away</span>
        <BoxPlot groups={[
          { label: 'Brand', min: 18, q1: 34, median: 47, q3: 61, max: 88 },
          { label: 'Content', min: 8, q1: 16, median: 24, q3: 33, max: 52 },
          { label: 'Product', min: 26, q1: 44, median: 62, q3: 78, max: 96 },
        ]} />
      </div>
    </div>
  )
}

function PlotsCorrelation() {
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Scatter</span>
        <Scatter xLabel="Spend" yLabel="Reach" points={[
          { label: 'Meta', x: 38, y: 62 }, { label: 'LinkedIn', x: 27, y: 44 },
          { label: 'Search', x: 12, y: 21 }, { label: 'Events', x: 61, y: 74 },
          { label: 'Podcast', x: 44, y: 39 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Bubble — area, not radius</span>
        <Bubble xLabel="Spend" yLabel="Reach" rMax={200} points={[
          { label: 'Meta', x: 38, y: 62, r: 140 }, { label: 'LinkedIn', x: 27, y: 44, r: 88 },
          { label: 'Search', x: 12, y: 21, r: 34 }, { label: 'Events', x: 61, y: 74, r: 190 },
        ]} />
      </div>
    </div>
  )
}

function PlotsChange() {
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Dot plot — ink where the value is</span>
        <DotPlot rows={[
          { label: 'Brand', value: 61 }, { label: 'Content', value: 44 },
          { label: 'Product', value: 38 }, { label: 'Motion', value: 22 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Dumbbell — the gap is the finding</span>
        <Dumbbell rows={[
          { label: 'Brand', from: 42, to: 84 }, { label: 'Content', from: 31, to: 61 },
          { label: 'Product', from: 26, to: 70 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Slope — the crossing is the point</span>
        <SlopeChart left="Q1" right="Q4" rows={[
          { label: 'Brand', from: 42, to: 84 },
          { label: 'Content', from: 61, to: 44 },
          { label: 'Product', from: 26, to: 70 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Waterfall — sign on the label as well as the colour</span>
        <Waterfall max={90} unit="n" steps={[
          { label: 'Open', value: 42, kind: 'base' }, { label: 'New', value: 31 },
          { label: 'Expand', value: 14 }, { label: 'Churn', value: -11 },
          { label: 'Contract', value: -6 }, { label: 'Close', value: 70, kind: 'base' },
        ]} />
      </div>
    </div>
  )
}

function PlotsTime() {
  const data = [42, 51, 47, 63, 58, 71, 68, 79, 74, 88, 92, 96]
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Time series with a band — same hue, low opacity</span>
        <TimeSeries max={120} unit="$k" data={data} band={data.map((v) => [Math.max(0, v - 12), v + 12])} labels={MO} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Step line — a value that holds did not drift</span>
        <StepLine max={100} unit="$k" data={[20, 20, 35, 35, 35, 50, 50, 65, 65, 65, 80, 80]} labels={MO} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Stacked area — composition, so sequential</span>
        <StackedArea max={120} unit="n" labels={MO} series={[
          { label: 'Brand', data: [12, 14, 16, 19, 21, 24, 26, 29, 31, 34, 36, 39] },
          { label: 'Content', data: [8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24] },
          { label: 'Product', data: [4, 5, 5, 7, 8, 9, 10, 12, 13, 15, 16, 18] },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Control chart — the outlier is the finding</span>
        <ControlChart max={100} mean={52} sigma={9} labels={MO} data={[48, 55, 51, 58, 47, 53, 49, 82, 54, 50, 56, 52]} />
      </div>
    </div>
  )
}

function PlotsShape() {
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Funnel — each stage a share of the one above</span>
        <Funnel steps={[
          { label: 'Visits', value: 4820 }, { label: 'Enquiries', value: 412 },
          { label: 'Calls', value: 168 }, { label: 'Proposals', value: 74 }, { label: 'Won', value: 31 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Pareto — the 80% rule needs the curve</span>
        <Pareto data={[
          { label: 'Brand', value: 61 }, { label: 'Content', value: 44 },
          { label: 'Product', value: 38 }, { label: 'Motion', value: 22 },
          { label: 'Advisory', value: 14 }, { label: 'Other', value: 8 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Bullet — bar is actual, tick is target</span>
        <Bullet rows={[
          { label: 'Revenue', value: 96, target: 90, max: 100 },
          { label: 'Pipeline', value: 81, target: 95, max: 120 },
          { label: 'Retention', value: 88, target: 85, max: 100 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Stacked bar — 2px gaps between parts</span>
        <StackedBar parts={['Brand', 'Content', 'Product']} rows={[
          { label: 'Q1', values: [24, 14, 8] }, { label: 'Q2', values: [31, 18, 11] },
          { label: 'Q3', values: [38, 21, 16] }, { label: 'Q4', values: [42, 26, 19] },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Treemap — for "which is big", not precise comparison</span>
        <Treemap data={[
          { label: 'Brand', value: 61 }, { label: 'Content', value: 44 },
          { label: 'Product', value: 38 }, { label: 'Motion', value: 22 },
          { label: 'Advisory', value: 14 }, { label: 'Other', value: 8 },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Small multiples — one scale, shared</span>
        <SmallMultiples panels={[
          { label: 'Brand', data: [12, 24, 31, 44, 52, 61] },
          { label: 'Content', data: [8, 14, 19, 26, 34, 44] },
          { label: 'Product', data: [26, 30, 33, 35, 37, 38] },
          { label: 'Motion', data: [6, 9, 12, 16, 19, 22] },
        ]} />
      </div>
    </div>
  )
}

function PlotsGrids() {
  const weeks = Array.from({ length: 20 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ((w * 7 + d * 3) % 11 === 0 ? 0 : (w + d * 2) % 10)))
  return (
    <div className={s.wdCharts}>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Calendar heat — one hue, five steps</span>
        <CalendarHeat weeks={weeks} max={10} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Cohort — down for better, across for longer</span>
        <Cohort rows={[
          { label: 'Jan', cells: [100, 82, 71, 64, 58] },
          { label: 'Feb', cells: [100, 85, 74, 66, null] },
          { label: 'Mar', cells: [100, 88, 79, null, null] },
          { label: 'Apr', cells: [100, 91, null, null, null] },
        ]} />
      </div>
      <div className={s.wdChart}>
        <span className={s.wdCount}>Gantt — done filled, in flight outlined</span>
        <Gantt span={12} labels={['W1', 'W3', 'W5', 'W7', 'W9', 'W11']} tasks={[
          { label: 'Messaging', start: 0, span: 3, done: true },
          { label: 'Identity', start: 2, span: 4, done: true },
          { label: 'Channels', start: 5, span: 3 },
          { label: 'Site', start: 7, span: 4 },
        ]} />
      </div>
    </div>
  )
}

/* ── Layout ────────────────────────────────────────────────────────────── */

function GridDemo() {
  return (
    <div className={s.wdStack}>
      <span className={s.wdCount}>12 columns. Col takes a span; anything else is a raw width.</span>
      <Grid>
        {[3, 3, 3, 3].map((n, i) => <Col key={i} span={n}><span className={s.wdColBox}>span {n}</span></Col>)}
      </Grid>
      <Grid>
        <Col span={8}><span className={s.wdColBox}>span 8</span></Col>
        <Col span={4}><span className={s.wdColBox}>span 4</span></Col>
      </Grid>
      <Grid>
        <Col span={6}><span className={s.wdColBox}>span 6</span></Col>
        <Col span={6}><span className={s.wdColBox}>span 6</span></Col>
      </Grid>
    </div>
  )
}


/* ── Media ─────────────────────────────────────────────────────────────── */

function CarouselDemo() {
  return (
    <Carousel slides={[
      ['Identity', 'The mark, the lockups and the clear-space rule.'],
      ['Voice', 'How it sounds when somebody writes as us.'],
      ['Channels', 'Where the message runs, and in what order.'],
    ]} />
  )
}

function GalleryDemo() {
  return <Gallery items={['Primary', 'Stacked', 'Mark only', 'Small size']} />
}

function ProgressDemo() {
  const [pct, setPct] = useState(38)
  return <ProgressBar value={pct} onChange={setPct} label="Upload" />
}

function MediaMisc() {
  return (
    <div className={s.wdStack}>
      <span className={s.wdCount}>Before / after — draggable, because a fixed split is a picture of a comparison rather than one</span>
      <BeforeAfter />
      <span className={s.wdCount}>Video controls — the scrub bar is the control, not a decoration under it</span>
      <VideoControls title="Identity walkthrough" />
    </div>
  )
}

/* ── Content ───────────────────────────────────────────────────────────── */

function CardsDemo() {
  return (
    <div className={s.wdGrid}>
      <CardSurface>
        <span className={s.wdCount}>Surface</span>
        <span className={s.wdName}>The one card the whole system uses</span>
      </CardSurface>
      <CardSurface link>
        <span className={s.wdCount}>Link</span>
        <span className={s.wdName}>Lifts on hover, because it goes somewhere</span>
      </CardSurface>
    </div>
  )
}

function StatusDemo() {
  return (
    <div className={s.wdRow}>
      {['Live', 'Review', 'Draft', 'Archived'].map((v) => <StatusPill key={v} value={v} />)}
    </div>
  )
}

function KpiDemo() {
  return (
    <KpiRow tiles={[
      ['MRR', '$96k', '+4.3%', true, [42, 51, 47, 63, 58, 71, 68, 79, 74, 88, 92, 96], 0],
      ['Pipeline', '$81k', '+15.7%', true, [30, 34, 41, 39, 48, 52, 57, 61, 66, 70, 76, 81], 1],
      ['Churn', '4.1%', '−0.6pt', true, [12, 11, 11, 10, 9, 9, 8, 7, 7, 5, 4, 4], 2],
    ]} />
  )
}

function PeopleDemo() {
  return (
    <PersonCard people={[
      ['Chris Church', 'Founder, strategy'],
      ['Dana Cole', 'Design director'],
      ['Ravi Menon', 'Engineering'],
    ]} />
  )
}

function ConsentDemo() {
  return <ConsentBanner />
}

function LegendDemo() {
  return (
    <div className={s.wdStack}>
      <Legend items={[
        { label: 'LinkedIn', colour: 'var(--sc-s1)' },
        { label: 'Paid social', colour: 'var(--sc-s2)' },
        { label: 'Target', colour: 'rgba(255,255,255,0.35)', dashed: true },
      ]} />
      <span className={s.wdCount}>A reference key is drawn as the line it is on the chart, not as a filled swatch</span>
    </div>
  )
}

/* ── Chat ──────────────────────────────────────────────────────────────── */

const CHAT_REPLIES = {
  'What surface do cards use?': {
    text: 'The card surface is #161616 on a #0a0a0a ground, at a 4px radius — the one surface the whole system uses.',
    cite: ['tokens.css'],
    tool: null,
  },
  'How many chart colours are there?': {
    text: 'Three categorical slots. Slots four to six alias one to three on purpose, so a chart reaching for a fourth series gets a visible repeat rather than a colour that quietly fails a check.',
    cite: ['tokens.css', 'wiki/charts'],
    tool: 'Searched the token file',
  },
}

function ChatDemo() {
  return (
    <Chat
      replies={CHAT_REPLIES}
      suggestions={Object.keys(CHAT_REPLIES)}
      fallback={{
        text: 'That is outside what this demo knows — the replies here are canned strings, not a model. Try one of the suggested questions.',
        cite: [],
        tool: null,
      }}
    />
  )
}

function StreamDemo() {
  return (
    <div className={s.wdStack}>
      <StreamingText />
      <ResponseFeedback />
    </div>
  )
}

/* ── Data grid ─────────────────────────────────────────────────────────── */

const GRID_COLS = [
  { key: 'client', label: 'Client', type: 'text', w: 128, frozen: true },
  { key: 'lead', label: 'Lead', type: 'person', w: 116 },
  { key: 'disc', label: 'Discipline', type: 'text', w: 104 },
  { key: 'year', label: 'Year', type: 'num', w: 62 },
  { key: 'fee', label: 'Fee', type: 'money', w: 106, bar: true },
  { key: 'share', label: 'Share', type: 'pct', w: 92, scale: true },
  { key: 'trend', label: 'Trend', type: 'spark', w: 84 },
  { key: 'status', label: 'Status', type: 'status', w: 96 },
]

const GRID_ROWS = [
  { client: 'Talos', lead: 'Chris Church', disc: 'Brand', year: 2026, fee: 84000, share: 0.24, status: 'Live', trend: [30, 38, 41, 52, 58, 61] },
  { client: 'Transcend', lead: 'Dana Cole', disc: 'Content', year: 2026, fee: 61000, share: 0.17, status: 'Live', trend: [22, 26, 24, 31, 36, 44] },
  { client: 'Openhouse', lead: 'Ravi Menon', disc: 'Product', year: 2025, fee: 52000, share: 0.15, status: 'Review', trend: [18, 21, 26, 28, 33, 38] },
  { client: 'Espresso', lead: 'Dana Cole', disc: 'Brand', year: 2025, fee: 38000, share: 0.11, status: 'Live', trend: [12, 15, 18, 22, 25, 29] },
  { client: 'Print Parlor', lead: 'Dana Cole', disc: 'Brand', year: 2024, fee: 19500, share: 0.06, status: 'Done', trend: [14, 13, 12, 12, 11, 10] },
  { client: 'Big Buoy', lead: 'Chris Church', disc: 'Motion', year: 2026, fee: 15000, share: 0.04, status: 'Draft', trend: [4, 6, 9, 12, 15, 19] },
]

function GridDemoFull() {
  return <DataGrid columns={GRID_COLS} rows={GRID_ROWS} />
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
  'forms': FormsDemo,
  'date': DateDemo,
  'upload': UploadDemo,
  'filters': FilterDemo,
  'overlays': OverlayDemo,
  'nav': NavDemo,
  'plots-distribution': PlotsDistribution,
  'plots-correlation': PlotsCorrelation,
  'plots-change': PlotsChange,
  'plots-time': PlotsTime,
  'plots-shape': PlotsShape,
  'plots-grids': PlotsGrids,
  'grid': GridDemo,
  'carousel': CarouselDemo,
  'gallery': GalleryDemo,
  'progress': ProgressDemo,
  'media-misc': MediaMisc,
  'cards': CardsDemo,
  'status-pills': StatusDemo,
  'kpi': KpiDemo,
  'people-cards': PeopleDemo,
  'consent': ConsentDemo,
  'legend': LegendDemo,
  'chat': ChatDemo,
  'stream': StreamDemo,
  'datagrid': GridDemoFull,
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
