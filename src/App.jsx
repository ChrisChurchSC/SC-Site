import { useEffect, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NavProvider } from './context/NavContext'
import { ComingSoonProvider } from './context/ComingSoonContext'
import { ProjectsProvider, useProjects } from './context/ProjectsContext'
import { CalDrawerProvider } from './context/CalDrawerContext'
import Nav from './components/Nav'
import WorkIndustry from './pages/WorkIndustry'
import CalDrawer from './components/CalDrawer'
import Cursor from './components/Cursor'
import ThemeToggle from './components/ThemeToggle'
import TransitionBar from './components/TransitionBar'
import Home from './pages/Home'
import HomeV2 from './pages/HomeV2'
import HomeV3 from './pages/HomeV3'
import PricingV3 from './pages/PricingV3'
import ServiceV3 from './pages/ServiceV3'
import Work from './pages/Work'
import Services from './pages/Services'
import AboutUs from './pages/AboutUs'
import CaseStudy from './pages/CaseStudy'
import ClientOverview from './pages/ClientOverview'
import Thoughts from './pages/Thoughts'
import ThoughtPost from './pages/ThoughtPost'
import Contact from './pages/Contact'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import DeckGate from './components/DeckGate'

// Heavy deck pages — lazy loaded so they don't bloat the initial bundle
const LandingHub      = lazy(() => import('./pages/LandingHub'))
const LandingIndex    = lazy(() => import('./pages/LandingIndex'))
const Capabilities    = lazy(() => import('./pages/Capabilities'))
const AgencyCapabilities = lazy(() => import('./pages/AgencyCapabilities'))
const BrandSystems    = lazy(() => import('./pages/BrandSystems'))
const ContentPrograms = lazy(() => import('./pages/ContentPrograms'))
const DigitalProducts = lazy(() => import('./pages/DigitalProducts'))
const ContentPackages = lazy(() => import('./pages/ContentPackages'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* The v3-family pages bring their own top bar (V3Nav), so they run without
   the side nav — two navigations on one page is worse than either. Gated
   here rather than through ChromeGate, which would take the theme toggle
   down with it: the deck pages want all the chrome gone, these want only the
   nav gone. */
const V3_PAGES = ['/v3', '/pricing', '/work', '/thoughts']

const isV3Page = (pathname) =>
  V3_PAGES.includes(pathname) ||
  pathname.startsWith('/services/') ||
  pathname.startsWith('/work/industry/')

function NavGate() {
  const { pathname } = useLocation()
  if (isV3Page(pathname)) return null
  return <Nav />
}

function ChromeGate({ children }) {
  const { pathname } = useLocation()
  const fullBleed = pathname === '/capabilities' || pathname === '/agency-capabilities' || pathname === '/brand-systems' || pathname === '/content-programs' || pathname === '/digital-products' || pathname === '/content-packages'
  if (fullBleed) return null
  return children
}

function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  // /v2 is a homepage, so it gets the homepage treatment: no back button.
  // The v3-family pages have a full nav bar of their own; a floating back
  // button on top of it is a second way to leave, offered twice.
  if (location.pathname === '/' || location.pathname === '/v2' || isV3Page(location.pathname) || location.pathname === '/lp' || location.pathname.startsWith('/lp/')) return null
  const handleBack = () => {
    const parts = location.pathname.split('/').filter(Boolean)
    if (parts.length > 1) {
      navigate('/' + parts.slice(0, -1).join('/'))
    } else {
      navigate('/')
    }
  }
  return (
    <button className="back-btn-global" onClick={handleBack}>← Back</button>
  )
}

function WorkRouter() {
  const { slug } = useParams()
  const projects = useProjects()
  if (projects.isMulti(slug)) return <ClientOverview />
  return <CaseStudy />
}

export default function App() {
  return (
    <ThemeProvider>
        <NavProvider>
        <ComingSoonProvider>
        <ProjectsProvider>
        <CalDrawerProvider>
          <ScrollToTop />
          <TransitionBar />
          <Cursor />
          <ChromeGate>
            <NavGate />
            <ThemeToggle />
            <BackButton />
          </ChromeGate>
          <CalDrawer />
          <div className="theme-layer">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* The design-canvas homepage, alongside the live one so the
                    two can be compared. Promoting it is a one-line change:
                    point path="/" at HomeV2 and drop this route. */}
                <Route path="/v2" element={<HomeV2 />} />
                <Route path="/v3" element={<HomeV3 />} />
        <Route path="/pricing" element={<PricingV3 />} />
        <Route path="/services/:slug" element={<ServiceV3 />} />
                <Route path="/work" element={<Work />} />
                {/* Before the dynamic ones: a static segment outranks a param in
                    React Router, but keeping them in this order says so. */}
                <Route path="/work/industry/:slug" element={<WorkIndustry />} />
                <Route path="/work/:slug" element={<WorkRouter />} />
                <Route path="/work/:clientSlug/:workSlug" element={<CaseStudy />} />
                <Route path="/services" element={<Services />} />
                {/* Capabilities lived at /about until the Services rename.
                    vercel.json 301s it, but that only fires on a request to
                    the server — an in-app <NavLink to="/about"> never leaves
                    the client, so without this the old path would fall through
                    to NotFound for anyone still linking it internally. */}
                <Route path="/about" element={<Navigate to="/services" replace />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/thoughts" element={<Thoughts />} />
                <Route path="/thoughts/:slug" element={<ThoughtPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/landing-pages" element={<Suspense fallback={null}><LandingHub /></Suspense>} />
                <Route path="/capabilities" element={<DeckGate><Suspense fallback={null}><Capabilities /></Suspense></DeckGate>} />
                <Route path="/agency-capabilities" element={<DeckGate><Suspense fallback={null}><AgencyCapabilities /></Suspense></DeckGate>} />
                <Route path="/brand-systems" element={<DeckGate><Suspense fallback={null}><BrandSystems /></Suspense></DeckGate>} />
                <Route path="/content-programs" element={<DeckGate><Suspense fallback={null}><ContentPrograms /></Suspense></DeckGate>} />
                <Route path="/digital-products" element={<DeckGate><Suspense fallback={null}><DigitalProducts /></Suspense></DeckGate>} />
                <Route path="/content-packages" element={<DeckGate><Suspense fallback={null}><ContentPackages /></Suspense></DeckGate>} />
                <Route path="/lp" element={<Suspense fallback={null}><LandingIndex /></Suspense>} />
                <Route path="/lp/:slug" element={<Suspense fallback={null}><LandingPage /></Suspense>} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </CalDrawerProvider>
        </ProjectsProvider>
        </ComingSoonProvider>
        </NavProvider>
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}
