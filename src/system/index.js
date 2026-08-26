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
  SectionNav, Field, Input, Switch,
} from './primitives'

export {
  Shell, GlobalBar, BarButton, Sidebar, NavGroup, NavItem,
  Topbar, Content, Grid, Col, useSidebar,
} from './shell'

export {
  Axis, SERIES, Legend, Sparkline, LineChart, BarChart, RankedBar, Donut,
} from './charts'

export { Path, FileBrowser, FileView, CodeLines, MediaPreview, Tree } from './browser'

export {
  REQUEST_STATES, RequestState, DiffStat, RequestList, RequestDetail,
} from './requests'

export { PdfPreview, CanvasPreview, WavePreview } from './previews'

export { CampaignCanvas, FUNNEL_STAGES } from './campaignCanvas'

export { FolderPreview } from './folderPreview'

export { ActivityFeed, ACTIVITY_FILTERS } from './activity'

export {
  useFocusTrap, useDismiss,
  Modal, ConfirmDialog, Drawer, BottomSheet,
  DropdownMenu, Popover, Tooltip, Lightbox,
  useToasts, ToastStack, CommandPalette,
} from './overlays'

export {
  Accordion, Stepper, MultiStep, Scrollspy, SidebarNav, PrevNext,
} from './navigation'

export {
  Select, Combobox, CheckGroup, RadioGroup, ValidatedField, SearchField,
  TagInput, SliderControl, DatePicker, FileUpload, FilterBar, SortControl,
} from './forms'

export {
  Histogram, BoxPlot, Scatter, Bubble, DotPlot, Dumbbell, SlopeChart,
  StepLine, TimeSeries, StackedArea, StackedBar, Waterfall, Funnel, Pareto,
  Bullet, ControlChart, Treemap, CalendarHeat, Cohort, Gantt, SmallMultiples,
} from './plots'

export { Wiki } from './wiki'

export { ProjectList, ProjectView } from './projects'

export { DataGrid } from './dataGrid'

export { Carousel, Gallery, BeforeAfter, VideoControls, ProgressBar } from './media'

export { Chat, StreamingText, ResponseFeedback } from './chat'

export {
  StatusPill, CardSurface, KpiRow, PersonCard, ConsentBanner,
  TextureDefs, TextureSwatches,
} from './content'
