import { useState } from 'react'
import { useMeta } from '../hooks/useMeta'
import '../system/tokens.css'
import {
  Shell, Sidebar, NavGroup, NavItem, Topbar, Content, Grid, Col, useSidebar,
  Panel, StatTile, Card, Eyebrow, CardTitle, CardBody,
  Button, IconButton, Badge, Banner, Segmented, Tabs, Icon,
  LineChart, BarChart, RankedBar, Donut, Sparkline,
} from '../system'
import styles from './Dashboard.module.css'

/* A brand workspace dashboard, built entirely from src/system.
 *
 * This page writes almost no CSS of its own — everything below comes from the
 * package, which is the point: it is the proof that the system is importable
 * rather than a drawing of itself. The handful of rules in
 * Dashboard.module.css are layout for this page only.
 *
 * Internal, noindex, not in the sitemap.
 */

const NAV = [
  {
    group: 'Brand',
    items: [
      { key: 'design', label: 'Design', count: 14, icon: 'brand' },
      { key: 'verbal', label: 'Verbal', count: 9, icon: 'type' },
      { key: 'strategy', label: 'Strategy', count: 6, icon: 'target' },
      { key: 'channels', label: 'Channels', count: 2, icon: 'channel' },
    ],
  },
  {
    group: 'Work',
    items: [
      { key: 'assets', label: 'Assets', count: 38, icon: 'layers' },
      { key: 'plan', label: 'Plan', icon: 'route' },
      { key: 'results', label: 'Results', icon: 'chart' },
    ],
  },
  {
    group: null,
    items: [{ key: 'dashboard', label: 'Dashboard', icon: 'grid' }],
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const ASSETS = [
  { name: 'Identity system', kind: 'Design', owner: 'Dana Cole', status: 'Live', used: 24, trend: [4, 6, 9, 12, 18, 24] },
  { name: 'Tone of voice', kind: 'Verbal', owner: 'Chris Church', status: 'Live', used: 19, trend: [2, 5, 8, 11, 15, 19] },
  { name: 'Positioning', kind: 'Strategy', owner: 'Chris Church', status: 'Review', used: 11, trend: [1, 3, 5, 7, 9, 11] },
  { name: 'Social kit', kind: 'Design', owner: 'Ravi Menon', status: 'Live', used: 31, trend: [8, 12, 17, 22, 27, 31] },
  { name: 'Launch narrative', kind: 'Verbal', owner: 'Dana Cole', status: 'Draft', used: 4, trend: [0, 0, 1, 2, 3, 4] },
  { name: 'Channel matrix', kind: 'Channels', owner: 'Ravi Menon', status: 'Draft', used: 2, trend: [0, 0, 0, 1, 1, 2] },
]

export default function Dashboard() {
  useMeta({
    title: 'Dashboard | Super Conscious',
    description: 'Internal brand workspace.',
    path: '/dashboard',
    noindex: true,
  })

  const { collapsed, toggle } = useSidebar()
  const [active, setActive] = useState('dashboard')
  const [range, setRange] = useState('12m')
  const [tab, setTab] = useState('Overview')
  const [dismissed, setDismissed] = useState(false)

  const section = NAV.flatMap((g) => g.items).find((i) => i.key === active)

  return (
    <Shell collapsed={collapsed}>
      <Sidebar brand="Super Conscious" collapsed={collapsed} onToggle={toggle}>
        {NAV.map((g, i) => (
          <NavGroup key={g.group ?? `g${i}`} label={g.group} collapsed={collapsed}>
            {g.items.map((it) => (
              <NavItem
                key={it.key}
                icon={it.icon}
                label={it.label}
                count={it.count}
                active={active === it.key}
                collapsed={collapsed}
                onClick={() => setActive(it.key)}
              />
            ))}
          </NavGroup>
        ))}
      </Sidebar>

      <div className={styles.main}>
        <Topbar title={section?.label ?? 'Dashboard'}>
          <Segmented
            value={range}
            onChange={setRange}
            label="Range"
            options={[{ value: '3m', label: '3M' }, { value: '12m', label: '12M' }, { value: 'all', label: 'All' }]}
          />
          <IconButton icon="search" label="Search" />
          <IconButton icon="sliders" label="Settings" />
          <Button variant="solid" size="sm" icon="plus">New asset</Button>
        </Topbar>

        <Content>
          {!dismissed && (
            <Banner tone="warn" onDismiss={() => setDismissed(true)}>
              6 assets haven't been reviewed in over 90 days.
            </Banner>
          )}

          <Tabs value={tab} onChange={setTab} options={['Overview', 'Assets', 'Activity']} />

          {tab === 'Overview' && (
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
                  <Panel
                    title="Asset usage"
                    actions={<span className={styles.panelMeta}>Target 60</span>}
                  >
                    <LineChart
                      labels={MONTHS}
                      unit="uses"
                      max={100}
                      target={60}
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
                <Col span={4}>
                  <Panel title="Most used">
                    <RankedBar
                      data={[
                        { label: 'Social kit', value: 31 },
                        { label: 'Identity', value: 24 },
                        { label: 'Voice', value: 19 },
                        { label: 'Positioning', value: 11 },
                      ]}
                    />
                  </Panel>
                </Col>
                <Col span={4}>
                  <Panel title="Added per month">
                    <BarChart
                      data={[2, 3, 1, 4, 2, 5, 3, 4, 6, 3, 2, 3]}
                      labels={MONTHS.map((m) => m[0])}
                      unit="n"
                      reference={3}
                      referenceLabel="Mean 3"
                    />
                  </Panel>
                </Col>
                <Col span={4}>
                  <Panel title="Needs attention">
                    <div className={styles.stack}>
                      {ASSETS.filter((a) => a.status !== 'Live').map((a) => (
                        <Card key={a.name} link className={styles.compactCard}>
                          <Eyebrow>{a.kind}</Eyebrow>
                          <CardTitle>{a.name}</CardTitle>
                          <div className={styles.cardFoot}>
                            <Badge tone={a.status === 'Draft' ? 'warn' : 'neutral'}>{a.status}</Badge>
                            <span className={styles.owner}>{a.owner}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Panel>
                </Col>
              </Grid>
            </>
          )}

          {tab === 'Assets' && (
            <Panel title={`${ASSETS.length} assets`} actions={<Button size="sm" icon="download">Export</Button>}>
              <div className={styles.table}>
                <div className={`${styles.tRow} ${styles.tHead}`}>
                  <span>Asset</span><span>Discipline</span><span>Owner</span>
                  <span>Status</span><span className={styles.tNum}>Uses</span><span>Trend</span>
                </div>
                {ASSETS.map((a) => (
                  <div key={a.name} className={styles.tRow}>
                    <span className={styles.tName}>{a.name}</span>
                    <span>{a.kind}</span>
                    <span>{a.owner}</span>
                    <span>
                      <Badge tone={a.status === 'Live' ? 'good' : a.status === 'Draft' ? 'warn' : 'neutral'}>
                        {a.status}
                      </Badge>
                    </span>
                    <span className={styles.tNum}>{a.used}</span>
                    <span className={styles.tSpark}><Sparkline data={a.trend} width={72} height={18} /></span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {tab === 'Activity' && (
            <Panel title="Recent">
              <div className={styles.feed}>
                {[
                  ['Dana Cole', 'published', 'Identity system', '2h', 'success'],
                  ['Ravi Menon', 'updated', 'Social kit', '5h', 'refresh'],
                  ['Chris Church', 'moved to review', 'Positioning', '1d', 'clock'],
                  ['Dana Cole', 'created', 'Launch narrative', '2d', 'plus'],
                ].map(([who, verb, what, when, icon], i) => (
                  <div key={i} className={styles.feedRow}>
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
        </Content>
      </div>
    </Shell>
  )
}
