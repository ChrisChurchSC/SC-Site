/* Super Conscious design system.
 *
 * The boundary. A product consumes this package and nothing below it:
 *
 *   import '@/system/tokens.css'
 *   import { Shell, Panel, StatTile, LineChart } from '@/system'
 *
 * Two files carry the whole look — tokens.css and system.module.css — so this
 * can be lifted into another repo by copying src/system/ and importing the
 * stylesheet. To retarget a brand, replace the SURFACES, TEXT, ACCENT and
 * CHART blocks in tokens.css and re-run the palette validator against the new
 * surface. Everything else is structural.
 *
 * What is deliberately NOT here: anything site-specific. The invert-based
 * light mode, the 312px nav rail and the Signifier licence belong to
 * super-conscious.studio, not to the system.
 */

export { ICONS } from './icons'

export {
  Icon, Button, IconButton,
  Card, Eyebrow, CardTitle, CardBody,
  Panel, StatTile,
  Badge, Banner, Spinner,
  Segmented, Tabs,
  Avatar, Contributors, CompositionBar, AsideBlock, FactRow, StatusList,
  TitleBar, CountButton, Toolbar, RefSelect, CountLink, FindField,
} from './primitives'

export {
  Shell, Sidebar, NavGroup, NavItem,
  Topbar, Content, Grid, Col, useSidebar,
} from './shell'

export {
  Legend, Sparkline, LineChart, BarChart, RankedBar, Donut,
} from './charts'

export { Path, FileBrowser, Tree } from './browser'
