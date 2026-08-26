import { useState } from 'react'
import { useMeta } from '../hooks/useMeta'
import '../system/tokens.css'
import {
  Shell, GlobalBar, BarButton, Sidebar, Content, Grid, Col, useSidebar,
  Panel, StatTile, Button, IconButton, Banner, Avatar, Icon,
  SectionNav, Segmented, Field, Input, Switch,
  Tree, Path, FileBrowser,
  Contributors, CompositionBar, AsideBlock, FactRow, StatusList,
  TitleBar, CountButton, RefSelect, FindField,
  LineChart, BarChart, RankedBar, Donut,
} from '../system'
import headMark from '../assets/logo.svg'
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
   in the sidebar and be missing from the listing. */
const FS = {
  brand: {
    label: 'Brand', icon: 'brand',
    children: {
      design: {
        label: 'Design', icon: 'brand', message: 'Refit the logo lockup for small sizes', when: '2h',
        children: {
          'logo-lockup.fig': { message: 'Refit for small sizes', when: '2h', status: 'Live', icon: 'image' },
          'colour-tokens.json': { message: 'Retire teal and blue', when: '1d', status: 'Live', icon: 'file' },
          'type-scale.fig': { message: 'Drop the 3px radius step', when: '3d', status: 'Live', icon: 'image' },
          'grid-system.fig': { message: 'Document the 5px gutter', when: '1w', status: 'Live', icon: 'image' },
          'iconography.svg': { message: 'Forty marks on a 16px grid', when: '1w', status: 'Review', icon: 'image' },
        },
      },
      verbal: {
        label: 'Verbal', icon: 'type', message: 'Tighten the positioning clause', when: '1d',
        children: {
          'tone-of-voice.md': { message: 'Tighten the positioning clause', when: '1d', status: 'Live', icon: 'file' },
          'messaging-house.md': { message: 'Name the challenger brands', when: '4d', status: 'Live', icon: 'file' },
          'launch-narrative.md': { message: 'First pass, not reviewed', when: '2d', status: 'Draft', icon: 'file' },
        },
      },
      strategy: {
        label: 'Strategy', icon: 'target', message: 'Move positioning into review', when: '1d',
        children: {
          'positioning.md': { message: 'Move into review', when: '1d', status: 'Review', icon: 'file' },
          'audience.md': { message: 'Split founders from marketing teams', when: '2w', status: 'Live', icon: 'file' },
          'competitive-set.md': { message: 'Add two challengers', when: '3w', status: 'Live', icon: 'file' },
        },
      },
      channels: {
        label: 'Channels', icon: 'channel', message: 'Draft the channel matrix', when: '5d',
        children: {
          'channel-matrix.md': { message: 'Draft, awaiting sign-off', when: '5d', status: 'Draft', icon: 'file' },
          'social-kit.fig': { message: 'Most-used asset this quarter', when: '6h', status: 'Live', icon: 'image' },
        },
      },
    },
  },
  work: {
    label: 'Work', icon: 'layers',
    children: {
      assets: {
        label: 'Assets', icon: 'layers', message: '38 across four disciplines', when: '2h',
        children: {
          'exports': { message: 'PNG and SVG, all sizes', when: '2h', status: 'Live', kind: 'folder' },
          'source': { message: 'Working files', when: '2h', status: 'Live', kind: 'folder' },
          'manifest.json': { message: 'Regenerated on publish', when: '2h', status: 'Live', icon: 'file' },
        },
      },
      plan: {
        label: 'Plan', icon: 'route', message: 'Q3 rollout', when: '1w',
        children: {
          'q3-rollout.md': { message: 'Six weeks, three phases', when: '1w', status: 'Live', icon: 'file' },
          'dependencies.md': { message: 'Blocked on channel sign-off', when: '1w', status: 'Review', icon: 'file' },
        },
      },
      results: {
        label: 'Results', icon: 'chart', message: 'Usage up 9pt this quarter', when: '3h',
        children: {
          'usage.csv': { message: 'Usage up 9pt this quarter', when: '3h', status: 'Live', icon: 'file' },
          'adoption.csv': { message: '71% of assets in use', when: '3h', status: 'Live', icon: 'file' },
        },
      },
    },
  },
}

/* Tree shape derived from the same object, so the two can never disagree. */
const TREE = Object.entries(FS).map(([key, node]) => ({
  key,
  label: node.label,
  icon: node.icon,
  children: Object.entries(node.children).map(([ck, c]) => ({
    key: `${key}/${ck}`,
    label: c.label,
    icon: c.icon,
    count: c.children ? Object.keys(c.children).length : undefined,
  })),
}))

const at = (path) =>
  path.reduce((node, seg) => node?.children?.[seg], { children: FS })

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard() {
  useMeta({
    title: 'Dashboard | Super Conscious',
    description: 'Internal brand workspace.',
    path: '/dashboard',
    noindex: true,
  })

  const { collapsed, toggle } = useSidebar()
  const [path, setPath] = useState(['brand', 'design'])
  const [tab, setTab] = useState('Files')
  const [version, setVersion] = useState('v2.1 — current')
  const [search, setSearch] = useState('')
  const [find, setFind] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [wsName, setWsName] = useState('Brand')
  const [visibility, setVisibility] = useState('Private')
  const [autoReview, setAutoReview] = useState(true)

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

  const label = (segs) => segs.map((seg, i) => at(segs.slice(0, i + 1))?.label ?? seg)

  const open = (entry) => {
    if (entry.kind === 'folder') setPath((p) => [...p, entry.name])
  }

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
            activeKey={path.join('/')}
            defaultOpen={['brand', 'work']}
            onSelect={(n) => setPath(n.key.split('/'))}
          />
        )}
        {collapsed && (
          <div className={styles.railIcons}>
            {TREE.flatMap((g) => g.children).map((c) => (
              <IconButton
                key={c.key}
                icon={c.icon}
                label={c.label}
                onClick={() => setPath(c.key.split('/'))}
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
            onChange={setTab}
            sections={[
              { key: 'Files', label: 'Files', icon: 'folder' },
              { key: 'Reviews', label: 'Reviews', icon: 'clock', count: 3 },
              { key: 'Activity', label: 'Activity', icon: 'refresh' },
              { key: 'Results', label: 'Results', icon: 'chart' },
              { key: 'Settings', label: 'Settings', icon: 'sliders' },
            ]}
          />

          {(tab === 'Files' || tab === 'Reviews') && (
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

          {!dismissed && (
            /* Sits directly above the listing it is about, rather than in the
               middle of the chrome where it separated the controls from the
               thing they control. Neutral rather than amber: colour is the
               loudest thing in a monochrome interface, and an advisory that
               spends it leaves nothing for a real failure. */
            <Banner tone="info" icon="warning" onDismiss={() => setDismissed(true)}>
              6 assets haven't been reviewed in over 90 days.
            </Banner>
          )}

          {(tab === 'Files' || tab === 'Reviews') && (
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
                    The brand system for Super Conscious — identity, voice, strategy
                    and the channels they run on.
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
                    { label: 'Design', value: 14 },
                    { label: 'Verbal', value: 9 },
                    { label: 'Strategy', value: 6 },
                    { label: 'Channels', value: 2 },
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

          {tab === 'Results' && (
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
                        { label: 'Design', data: [12, 18, 22, 28, 31, 38, 42, 49, 54, 61, 68, 74] },
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
                        { label: 'Design', value: 14 },
                        { label: 'Verbal', value: 9 },
                        { label: 'Strategy', value: 6 },
                        { label: 'Channels', value: 2 },
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

          {tab === 'Activity' && (
            <Panel title="Recent">
              <div className={styles.feed}>
                {[
                  ['Dana Cole', 'published', 'logo-lockup.fig', '2h', 'success'],
                  ['Ravi Menon', 'updated', 'social-kit.fig', '6h', 'refresh'],
                  ['Chris Church', 'moved to review', 'positioning.md', '1d', 'clock'],
                  ['Dana Cole', 'created', 'launch-narrative.md', '2d', 'plus'],
                  ['Ravi Menon', 'drafted', 'channel-matrix.md', '5d', 'file'],
                ].map(([who, verb, what, when, icon], i) => (
                  <div key={i} className={styles.feedRow}>
                    <Avatar name={who} size={22} />
                    <Icon name={icon} size={13} />
                    <span className={styles.feedText}>
                      <strong>{who}</strong> {verb} <strong>{what}</strong>
                    </span>
                    <span className={styles.feedWhen}>{when}</span>
                  </div>
                ))}
              </div>
            </Panel>
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
